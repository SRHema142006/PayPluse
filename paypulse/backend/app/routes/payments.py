import datetime
from typing import Optional
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database.db import get_db
from app.models.domain import Payment, Invoice, Business, Customer
from app.models.schemas import PaymentCreate
from app.core.security import get_current_business

router = APIRouter(prefix="/api/payments", tags=["payments"])

@router.get("")
def list_payments(
    business: Business = Depends(get_current_business),
    db: Session = Depends(get_db)
):
    inv_ids = [i.id for i in db.query(Invoice).filter(Invoice.business_id == business.id).all()]
    if not inv_ids:
        return []

    payments = db.query(Payment).filter(Payment.invoice_id.in_(inv_ids)).order_by(Payment.id.desc()).all()
    res = []
    for p in payments:
        inv = db.query(Invoice).filter(Invoice.id == p.invoice_id).first()
        res.append({
            "id": p.id,
            "invoice_id": p.invoice_id,
            "invoice_number": inv.number if inv else "INV-000",
            "customer_name": inv.customer_name if inv else "Customer",
            "amount": p.amount,
            "payment_date": p.payment_date,
            "payment_method": p.payment_method,
            "reference_number": p.reference_number,
            "notes": p.notes
        })
    return res

@router.post("", status_code=201)
def record_payment(
    data: PaymentCreate,
    business: Business = Depends(get_current_business),
    db: Session = Depends(get_db)
):
    invoice = db.query(Invoice).filter(Invoice.id == data.invoice_id, Invoice.business_id == business.id).first()
    if not invoice:
        raise HTTPException(status_code=404, detail="Invoice not found")

    payment = Payment(
        invoice_id=invoice.id,
        amount=data.amount,
        payment_date=data.payment_date or datetime.date.today().isoformat(),
        payment_method=data.payment_method or "Bank Transfer",
        reference_number=data.reference_number or f"REF-{invoice.number}",
        notes=data.notes
    )
    db.add(payment)

    # Check total payments recorded for this invoice
    existing_payments = db.query(Payment).filter(Payment.invoice_id == invoice.id).all()
    total_paid = sum(p.amount for p in existing_payments) + data.amount

    if total_paid >= invoice.amount:
        invoice.status = "Paid"
    else:
        invoice.status = "Partially Paid"

    db.commit()
    db.refresh(payment)

    return {"status": "recorded", "payment_id": payment.id, "invoice_status": invoice.status}

@router.get("/overdue")
def list_overdue_payments(
    business: Business = Depends(get_current_business),
    db: Session = Depends(get_db)
):
    overdue_invs = db.query(Invoice).filter(
        Invoice.business_id == business.id,
        Invoice.status == "Overdue"
    ).all()
    return overdue_invs
