from fastapi import APIRouter, Depends, HTTPException, Request, status
from sqlalchemy.orm import Session
from database import get_db
import models, schemas, security
from config import settings
from slowapi import Limiter
from slowapi.util import get_remote_address

limiter = Limiter(key_func=get_remote_address)
router = APIRouter(prefix="/api/auth", tags=["Authentication"])

@router.post("/register", response_model=schemas.Token)
@limiter.limit("5/minute")
def register(request: Request, user_in: schemas.UserCreate, db: Session = Depends(get_db)):
    """
    Register new user account.
    - Rate limited to 5 attempts per minute per IP (H-02)
    - Role is strictly restricted to STUDENT or FACULTY; ADMIN cannot self-register (M-04)
    - Password is validated for minimum 8 characters (M-01)
    """
    existing_user = db.query(models.User).filter(models.User.email == user_in.email).first()
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="A user with this email already exists"
        )
    
    hashed_pwd = security.get_password_hash(user_in.password)
    new_user = models.User(
        email=user_in.email,
        hashed_password=hashed_pwd,
        name=user_in.name,
        role=models.UserRole(user_in.role),
        college=user_in.college,
        classroom_code=user_in.classroom_code,
        career_track=user_in.career_track,
        avatar=user_in.name[:2].upper()
    )
    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    token = security.create_access_token(data={"sub": new_user.id, "role": new_user.role.value})
    return {
        "access_token": token,
        "token_type": "bearer",
        "expires_in_seconds": settings.ACCESS_TOKEN_EXPIRE_MINUTES * 60,
        "user": new_user
    }

@router.post("/login", response_model=schemas.Token)
@limiter.limit("10/minute")
def login(request: Request, credentials: schemas.UserLogin, db: Session = Depends(get_db)):
    """
    Authenticate with email & password.
    - Rate limited to 10 attempts per minute per IP to prevent brute-force attacks (H-02)
    """
    user = db.query(models.User).filter(models.User.email == credentials.email).first()
    if not user or not security.verify_password(credentials.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password"
        )
    
    if not user.is_active:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Account is disabled"
        )

    token = security.create_access_token(data={"sub": user.id, "role": user.role.value})
    return {
        "access_token": token,
        "token_type": "bearer",
        "expires_in_seconds": settings.ACCESS_TOKEN_EXPIRE_MINUTES * 60,
        "user": user
    }

@router.post("/demo-login", response_model=schemas.Token)
@limiter.limit("20/minute")
def demo_login(request: Request, req: schemas.DemoLoginRequest, db: Session = Depends(get_db)):
    """
    1-Click demo authentication for hackathon evaluators.
    - C-02: Gated by settings.ALLOW_DEMO_LOGIN (can be disabled in production)
    - Validates optional passphrase if DEMO_PASSPHRASE env var is configured
    - Role is strictly restricted to STUDENT or FACULTY
    """
    if not settings.ALLOW_DEMO_LOGIN:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Demo login is disabled in this environment. Use /api/auth/login with valid credentials."
        )

    if settings.DEMO_PASSPHRASE and req.passphrase != settings.DEMO_PASSPHRASE:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Invalid demo passphrase"
        )

    if req.role == "FACULTY":
        email = "dr.sharma@college.edu"
        name = "Dr. Sunita Sharma"
        avatar = "SS"
        role_enum = models.UserRole.FACULTY
    else:
        email = "rohan.verma@college.edu"
        name = "Rohan Verma"
        avatar = "RV"
        role_enum = models.UserRole.STUDENT

    user = db.query(models.User).filter(models.User.email == email).first()
    if not user:
        # Pre-seed isolated demo account
        user = models.User(
            email=email,
            hashed_password=security.get_password_hash("DemoSecret2026!"),
            name=name,
            role=role_enum,
            avatar=avatar,
            college="Indian Institute of Technology",
            classroom_code="CS302",
            career_track="ai-engineer",
            latent_ability_theta=0.45 if role_enum == models.UserRole.STUDENT else 0.0
        )
        db.add(user)
        db.commit()
        db.refresh(user)

    token = security.create_access_token(data={"sub": user.id, "role": user.role.value})
    return {
        "access_token": token,
        "token_type": "bearer",
        "expires_in_seconds": settings.ACCESS_TOKEN_EXPIRE_MINUTES * 60,
        "user": user
    }

@router.post("/logout")
def logout(
    token: str = Depends(security.oauth2_scheme),
    current_user: models.User = Depends(security.get_current_user)
):
    """
    H-04: Revoke the caller's active JWT access token to invalidate immediate session.
    """
    if token:
        security.revoke_token(token)
    return {"message": "Successfully logged out. Token has been revoked."}

@router.get("/me", response_model=schemas.UserResponse)
def get_current_user_profile(current_user: models.User = Depends(security.get_current_user)):
    """Return authenticated user profile verified directly from database (H-01)"""
    return current_user
