import datetime
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database.db import get_db
from app.models.domain import ReminderSchedule, Invoice, Business, MessageLog, Customer
from app.models.schemas import ReminderGenerateRequest, ReminderSendRequest
from app.core.security import get_current_business
from app.services.ai_service import generate_payment_reminder
from app.services.messaging_service import send_whatsapp_message, send_email_message

router = APIRouter(prefix="/api/reminders", tags=["reminders"])

@router.get("")
def list_reminders(
    business: Business = Depends(get_current_business),
    db: Session = Depends(get_db)
):
    inv_ids = [i.id for i in db.query(Invoice).filter(Invoice.business_id == business.id).all()]
    if not inv_ids:
        return []

    reminders = db.query(ReminderSchedule).filter(ReminderSchedule.invoice_id.in_(inv_ids)).all()
    res = []
    for r in reminders:
        inv = db.query(Invoice).filter(Invoice.id == r.invoice_id).first()
        res.append({
            "id": r.id,
            "invoice_id": r.invoice_id,
            "invoice_number": inv.number if inv else "INV-000",
            "customer_name": inv.customer_name if inv else "Customer",
            "amount": inv.amount if inv else 0.0,
            "stage": r.stage,
            "scheduled_date": r.scheduled_date,
            "status": r.status,
            "channel": r.channel,
            "message_draft": r.message_draft,
            "is_approved": r.is_approved
        })
    return res

@router.post("/generate")
def generate_reminder_draft(
    req: ReminderGenerateRequest,
    business: Business = Depends(get_current_business),
    db: Session = Depends(get_db)
):
    invoice = db.query(Invoice).filter(Invoice.id == req.invoice_id, Invoice.business_id == business.id).first()
    if not invoice:
        raise HTTPException(status_code=404, detail="Invoice not found")

    today = datetime.date.today()
    try:
        due_d = datetime.date.fromisoformat(invoice.due_date)
        days_overdue = max(0, (today - due_d).days)
    except Exception:
        days_overdue = 0

    message_text = generate_payment_reminder(
        stage=req.stage,
        invoice_number=invoice.number,
        amount=invoice.amount,
        customer_name=invoice.customer_name,
        due_date=invoice.due_date,
        days_overdue=days_overdue,
        language=business.user.preferred_language or "en",
        tone=req.tone or "Professional"
    )

    return {
        "invoice_id": invoice.id,
        "invoice_number": invoice.number,
        "customer_name": invoice.customer_name,
        "recipient": invoice.customer_phone if req.channel == "WhatsApp" else invoice.customer_email,
        "stage": req.stage,
        "channel": req.channel,
        "message": message_text
    }

@router.post("/send")
def send_reminder(
    req: ReminderSendRequest,
    business: Business = Depends(get_current_business),
    db: Session = Depends(get_db)
):
    invoice = db.query(Invoice).filter(Invoice.id == req.invoice_id, Invoice.business_id == business.id).first()
    if not invoice:
        raise HTTPException(status_code=404, detail="Invoice not found")

    if req.channel == "WhatsApp":
        res = send_whatsapp_message(
            phone_number=req.recipient or invoice.customer_phone or "+919876543210",
            message_text=req.message
        )
    else:
        res = send_email_message(
            to_email=req.recipient or invoice.customer_email or "customer@example.com",
            subject=f"Payment Reminder: Invoice {invoice.number}",
            body=req.message
        )

    # Log message
    log = MessageLog(
        business_id=business.id,
        invoice_id=invoice.id,
        customer_name=invoice.customer_name,
        channel=req.channel,
        stage=req.stage,
        message_body=req.message,
        status=res.get("status", "Sent")
    )
    db.add(log)
    db.commit()

    return {
        "status": "success",
        "channel": req.channel,
        "recipient": req.recipient,
        "message": "Payment reminder processed successfully",
        "delivery_details": res
    }
