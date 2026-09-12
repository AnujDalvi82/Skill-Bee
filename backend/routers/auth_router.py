from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from database import get_db
import models, schemas, security

router = APIRouter(prefix="/api/auth", tags=["Authentication"])

@router.post("/register", response_model=schemas.Token)
def register(user_in: schemas.UserCreate, db: Session = Depends(get_db)):
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
    return {"access_token": token, "token_type": "bearer", "user": new_user}

@router.post("/login", response_model=schemas.Token)
def login(credentials: schemas.UserLogin, db: Session = Depends(get_db)):
    user = db.query(models.User).filter(models.User.email == credentials.email).first()
    if not user or not security.verify_password(credentials.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password"
        )
    
    token = security.create_access_token(data={"sub": user.id, "role": user.role.value})
    return {"access_token": token, "token_type": "bearer", "user": user}

@router.post("/demo-login", response_model=schemas.Token)
def demo_login(req: schemas.DemoLoginRequest, db: Session = Depends(get_db)):
    """Instant 1-click demo login for hackathon judges"""
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
        # Auto-seed the demo account
        user = models.User(
            email=email,
            hashed_password=security.get_password_hash("password123"),
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
    return {"access_token": token, "token_type": "bearer", "user": user}

@router.get("/me", response_model=schemas.UserResponse)
def get_current_user_profile(current_user: models.User = Depends(security.get_current_user)):
    return current_user
