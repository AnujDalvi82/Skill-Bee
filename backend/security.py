from datetime import datetime, timedelta, timezone
from typing import Optional, Set
from jose import JWTError, jwt
import bcrypt
from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from sqlalchemy.orm import Session
from database import get_db
import models, schemas
from config import settings

# Security Configuration loaded from config.py / environment (C-01)
SECRET_KEY = settings.SECRET_KEY
ALGORITHM = settings.ALGORITHM
ACCESS_TOKEN_EXPIRE_MINUTES = settings.ACCESS_TOKEN_EXPIRE_MINUTES

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/api/auth/login", auto_error=False)

# In-memory revocation blocklist for logged-out tokens (H-04)
REVOKED_TOKENS: Set[str] = set()

def revoke_token(token: str) -> None:
    """Add a JWT token to the revocation blocklist upon logout"""
    if token:
        REVOKED_TOKENS.add(token)

def is_token_revoked(token: str) -> bool:
    return token in REVOKED_TOKENS

def verify_password(plain_password: str, hashed_password: str) -> bool:
    try:
        return bcrypt.checkpw(plain_password.encode("utf-8")[:72], hashed_password.encode("utf-8"))
    except Exception:
        return False

def get_password_hash(password: str) -> str:
    # bcrypt max password length is 72 bytes
    pwd_bytes = password.encode("utf-8")[:72]
    salt = bcrypt.gensalt()
    return bcrypt.hashpw(pwd_bytes, salt).decode("utf-8")

def create_access_token(data: dict, expires_delta: Optional[timedelta] = None) -> str:
    to_encode = data.copy()
    now = datetime.now(timezone.utc)
    if expires_delta:
        expire = now + expires_delta
    else:
        expire = now + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({"exp": int(expire.timestamp())})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

def get_current_user(
    token: Optional[str] = Depends(oauth2_scheme),
    db: Session = Depends(get_db)
) -> models.User:
    """
    Validates JWT token and fetches authoritative User from database (H-01).
    Never trusts role claims blindly from token payload.
    """
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials or token expired",
        headers={"WWW-Authenticate": "Bearer"},
    )
    if not token or is_token_revoked(token):
        raise credentials_exception

    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        user_id: str = payload.get("sub")
        if user_id is None:
            raise credentials_exception
    except JWTError:
        raise credentials_exception

    # Query DB for live user record (verifying user still exists, active, and current role)
    user = db.query(models.User).filter(models.User.id == user_id).first()
    if user is None or not getattr(user, "is_active", True):
        raise credentials_exception

    return user

def get_optional_user(
    token: Optional[str] = Depends(oauth2_scheme),
    db: Session = Depends(get_db)
) -> Optional[models.User]:
    """Returns current user if valid token provided, else None without raising 401"""
    if not token or is_token_revoked(token):
        return None
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        user_id: str = payload.get("sub")
        if not user_id:
            return None
        return db.query(models.User).filter(models.User.id == user_id).first()
    except Exception:
        return None

def require_faculty(current_user: models.User = Depends(get_current_user)) -> models.User:
    """
    Role-Based Access Control: Ensures authenticated caller has FACULTY or ADMIN role (C-04 / H-03).
    Evaluated against the authoritative DB role, not token claims.
    """
    if current_user.role not in [models.UserRole.FACULTY, models.UserRole.ADMIN]:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Faculty authorization required to access cohort academic records and triage actions"
        )
    return current_user

def require_admin(current_user: models.User = Depends(get_current_user)) -> models.User:
    """Role-Based Access Control: ADMIN role required"""
    if current_user.role != models.UserRole.ADMIN:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Administrative authorization required"
        )
    return current_user
