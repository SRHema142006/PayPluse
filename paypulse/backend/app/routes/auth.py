from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.database.db import get_db
from app.models.domain import User, Business, UserPreference
from app.models.schemas import UserRegister, UserLogin, TokenResponse, OnboardingData
from app.core.security import get_password_hash, verify_password, create_access_token, get_current_user

router = APIRouter(prefix="/api/auth", tags=["auth"])

@router.post("/register", response_model=TokenResponse)
def register(data: UserRegister, db: Session = Depends(get_db)):
    existing = db.query(User).filter(User.email == data.email).first()
    if existing:
        raise HTTPException(status_code=400, detail="User with this email already exists")

    user = User(
        email=data.email,
        hashed_password=get_password_hash(data.password),
        owner_name=data.owner_name,
        phone_number=data.phone_number,
        business_category=data.business_category,
        business_location=data.business_location,
        preferred_language=data.preferred_language or "en"
    )
    db.add(user)
    db.commit()
    db.refresh(user)

    business = Business(
        user_id=user.id,
        business_name=data.business_name,
        business_type=data.business_category or "Small Business",
        monthly_revenue="₹10,00,000",
        monthly_expenses=250000.0,
        payment_terms="Net 30"
    )
    db.add(business)

    pref = UserPreference(
        user_id=user.id,
        whatsapp_enabled=True,
        email_enabled=True,
        auto_reminders=True,
        currency="INR",
        language=data.preferred_language or "en"
    )
    db.add(pref)
    db.commit()

    access_token = create_access_token({"sub": user.email})
    return {
        "access_token": access_token,
        "token_type": "bearer",
        "user": {
            "id": user.id,
            "email": user.email,
            "owner_name": user.owner_name,
            "business_name": business.business_name
        }
    }

@router.post("/login", response_model=TokenResponse)
def login(data: UserLogin, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == data.email).first()
    if not user or not verify_password(data.password, user.hashed_password):
        raise HTTPException(status_code=401, detail="Invalid email or password")

    business = db.query(Business).filter(Business.user_id == user.id).first()
    access_token = create_access_token({"sub": user.email})
    return {
        "access_token": access_token,
        "token_type": "bearer",
        "user": {
            "id": user.id,
            "email": user.email,
            "owner_name": user.owner_name,
            "business_name": business.business_name if business else "PayPlus Business"
        }
    }

@router.get("/me")
def get_profile(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    business = db.query(Business).filter(Business.user_id == current_user.id).first()
    pref = db.query(UserPreference).filter(UserPreference.user_id == current_user.id).first()
    return {
        "id": current_user.id,
        "email": current_user.email,
        "owner_name": current_user.owner_name,
        "phone_number": current_user.phone_number,
        "preferred_language": current_user.preferred_language,
        "business": {
            "id": business.id if business else None,
            "business_name": business.business_name if business else "PayPlus Business",
            "business_type": business.business_type if business else "Small Business",
            "monthly_revenue": business.monthly_revenue if business else "₹10,00,000",
            "monthly_expenses": business.monthly_expenses if business else 250000.0,
            "payment_terms": business.payment_terms if business else "Net 30"
        } if business else None,
        "preferences": {
            "currency": pref.currency if pref else "INR",
            "language": pref.language if pref else "en",
            "whatsapp_enabled": pref.whatsapp_enabled if pref else True,
            "email_enabled": pref.email_enabled if pref else True
        } if pref else None
    }

@router.post("/onboarding")
def save_onboarding(data: OnboardingData, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    business = db.query(Business).filter(Business.user_id == current_user.id).first()
    if not business:
        business = Business(user_id=current_user.id, business_name=f"{current_user.owner_name}'s Business")
        db.add(business)

    if data.business_type: business.business_type = data.business_type
    if data.monthly_revenue: business.monthly_revenue = data.monthly_revenue
    if data.monthly_expenses is not None: business.monthly_expenses = data.monthly_expenses
    if data.payment_terms: business.payment_terms = data.payment_terms
    if data.regular_customers_count: business.regular_customers_count = data.regular_customers_count
    if data.preferred_reminder_channel: business.preferred_reminder_channel = data.preferred_reminder_channel

    db.commit()
    return {"status": "success", "message": "Onboarding completed successfully"}

@router.post("/forgot-password")
def forgot_password(data: dict):
    return {"status": "success", "message": "Password reset instructions sent to your email (Demo Mode)."}
