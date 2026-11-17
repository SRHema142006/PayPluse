from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database.db import get_db
from app.models.domain import Notification, Business
from app.core.security import get_current_business

router = APIRouter(prefix="/api/notifications", tags=["notifications"])

@router.get("")
def list_notifications(
    business: Business = Depends(get_current_business),
    db: Session = Depends(get_db)
):
    notifications = db.query(Notification).filter(
        Notification.business_id == business.id
    ).order_by(Notification.id.desc()).all()
    return notifications

@router.put("/{notification_id}/read")
def mark_as_read(
    notification_id: int,
    business: Business = Depends(get_current_business),
    db: Session = Depends(get_db)
):
    n = db.query(Notification).filter(Notification.id == notification_id, Notification.business_id == business.id).first()
    if not n:
        raise HTTPException(status_code=404, detail="Notification not found")

    n.is_read = True
    db.commit()
    return {"status": "success", "id": notification_id}

@router.post("/read-all")
def mark_all_read(
    business: Business = Depends(get_current_business),
    db: Session = Depends(get_db)
):
    db.query(Notification).filter(Notification.business_id == business.id).update({"is_read": True})
    db.commit()
    return {"status": "success", "message": "All notifications marked as read"}
