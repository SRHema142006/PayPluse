from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.database.db import get_db
from app.models.domain import User, Business, UserPreference
from app.models.schemas import SettingsUpdate
from app.core.security import get_current_user

router = APIRouter(prefix="/api/settings", tags=["settings"])

@router.get("")
def get_settings(
    user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    business = db.query(Business).filter(Business.user_id == user.id).first()
    pref = db.query(UserPreference).filter(UserPreference.user_id == user.id).first()

    return {
        "owner_name": user.owner_name,
        "email": user.email,
        "phone_number": user.phone_number,
        "business_name": business.business_name if business else "PayPlus Business",
        "business_type": business.business_type if business else "Small Business",
        "preferences": {
            "whatsapp_enabled": pref.whatsapp_enabled if pref else True,
            "whatsapp_api_key": pref.whatsapp_api_key if pref else "",
            "whatsapp_phone_number_id": pref.whatsapp_phone_number_id if pref else "",
            "email_enabled": pref.email_enabled if pref else True,
            "auto_reminders": pref.auto_reminders if pref else True,
            "currency": pref.currency if pref else "INR",
            "language": pref.language if pref else "en"
        }
    }

@router.put("")
def update_settings(
    data: SettingsUpdate,
    user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    if data.owner_name: user.owner_name = data.owner_name
    if data.phone_number: user.phone_number = data.phone_number

    business = db.query(Business).filter(Business.user_id == user.id).first()
    if business and data.business_name:
        business.business_name = data.business_name

    pref = db.query(UserPreference).filter(UserPreference.user_id == user.id).first()
    if not pref:
        pref = UserPreference(user_id=user.id)
        db.add(pref)

    if data.whatsapp_enabled is not None: pref.whatsapp_enabled = data.whatsapp_enabled
    if data.whatsapp_api_key is not None: pref.whatsapp_api_key = data.whatsapp_api_key
    if data.whatsapp_phone_number_id is not None: pref.whatsapp_phone_number_id = data.whatsapp_phone_number_id
    if data.email_enabled is not None: pref.email_enabled = data.email_enabled
    if data.auto_reminders is not None: pref.auto_reminders = data.auto_reminders
    if data.currency is not None: pref.currency = data.currency
    if data.language is not None:
        pref.language = data.language
        user.preferred_language = data.language

    db.commit()
    return {"status": "success", "message": "Settings updated successfully"}
