from typing import Optional
from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, Form, Query
from sqlalchemy.orm import Session

from app.database.db import get_db
from app.models.domain import Invoice, Customer, Business, Payment, ReminderSchedule
from app.models.schemas import InvoiceCreate, InvoiceUpdate, InvoiceResponse
from app.core.security import get_current_business
from app.services.ai_service import parse_ocr_file

router = APIRouter(prefix="/api/invoices", tags=["invoices"])

@router.get("")
def list_invoices(
    search: Optional[str] = Query(None),
    status: Optional[str] = Query(None),
    business: Business = Depends(get_current_business),
    db: Session = Depends(get_db)
):
    query = db.query(Invoice).filter(Invoice.business_id == business.id)
    if status and status != "All":
        query = query.filter(Invoice.status == status)
    if search:
        search_fmt = f"%{search}%"
        query = query.filter((Invoice.number.ilike(search_fmt)) | (Invoice.customer_name.ilike(search_fmt)))

    invoices = query.order_by(Invoice.id.desc()).all()
    return invoices

@router.get("/{invoice_id}")
def get_invoice(
    invoice_id: int,
    business: Business = Depends(get_current_business),
    db: Session = Depends(get_db)
):
    invoice = db.query(Invoice).filter(Invoice.id == invoice_id, Invoice.business_id == business.id).first()
    if not invoice:
        raise HTTPException(status_code=404, detail="Invoice not found")

    payments = db.query(Payment).filter(Payment.invoice_id == invoice.id).all()
    reminders = db.query(ReminderSchedule).filter(ReminderSchedule.invoice_id == invoice.id).all()

    timeline = [
        {"title": "Invoice Created", "date": invoice.invoice_date, "status": "completed", "description": f"Issued for {invoice.customer_name}"},
    ]
    for r in reminders:
        timeline.append({"title": f"Stage {r.stage} Reminder ({r.channel})", "date": r.scheduled_date, "status": r.status.lower(), "description": r.message_draft})
    for p in payments:
        timeline.append({"title": f"Payment Received ({p.payment_method})", "date": p.payment_date, "status": "success", "description": f"Settled ₹{p.amount:,.0f} (Ref: {p.reference_number})"})

    return {
        "invoice": invoice,
        "payments": payments,
        "reminders": reminders,
        "timeline": timeline
    }

@router.post("/upload")
async def upload_invoice(
    file: UploadFile = File(...),
    business: Business = Depends(get_current_business)
):
    """
    Extracts invoice details using OCR & AI logic.
    Returns structured parameters for editable confirmation before saving.
    """
    extracted_data = parse_ocr_file(file.filename, file.content_type)
    return extracted_data

@router.post("", status_code=201)
def create_invoice(
    data: InvoiceCreate,
    business: Business = Depends(get_current_business),
    db: Session = Depends(get_db)
):
    # Find or associate customer
    customer = db.query(Customer).filter(
        Customer.business_id == business.id,
        Customer.name.ilike(data.customer_name)
    ).first()

    if not customer:
        customer = Customer(
            business_id=business.id,
            name=data.customer_name,
            company=data.customer_name,
            email=data.customer_email,
            phone=data.customer_phone,
            total_invoices=1,
            total_outstanding=data.amount if data.status != "Paid" else 0.0,
            reliability_tier="Reliable"
        )
        db.add(customer)
        db.commit()
        db.refresh(customer)
    else:
        customer.total_invoices += 1
        if data.status != "Paid":
            customer.total_outstanding += data.amount
        db.commit()

    invoice = Invoice(
        business_id=business.id,
        customer_id=customer.id,
        number=data.number,
        customer_name=data.customer_name,
        customer_email=data.customer_email or customer.email,
        customer_phone=data.customer_phone or customer.phone,
        invoice_date=data.invoice_date,
        due_date=data.due_date,
        amount=data.amount,
        status=data.status or "Pending",
        gst_number=data.gst_number,
        payment_terms=data.payment_terms,
        description=data.description
    )
    db.add(invoice)
    db.commit()
    db.refresh(invoice)

    return invoice

@router.put("/{invoice_id}")
def update_invoice(
    invoice_id: int,
    data: InvoiceUpdate,
    business: Business = Depends(get_current_business),
    db: Session = Depends(get_db)
):
    invoice = db.query(Invoice).filter(Invoice.id == invoice_id, Invoice.business_id == business.id).first()
    if not invoice:
        raise HTTPException(status_code=404, detail="Invoice not found")

    if data.number is not None: invoice.number = data.number
    if data.customer_name is not None: invoice.customer_name = data.customer_name
    if data.customer_email is not None: invoice.customer_email = data.customer_email
    if data.customer_phone is not None: invoice.customer_phone = data.customer_phone
    if data.invoice_date is not None: invoice.invoice_date = data.invoice_date
    if data.due_date is not None: invoice.due_date = data.due_date
    if data.amount is not None: invoice.amount = data.amount
    if data.status is not None: invoice.status = data.status
    if data.gst_number is not None: invoice.gst_number = data.gst_number
    if data.payment_terms is not None: invoice.payment_terms = data.payment_terms
    if data.description is not None: invoice.description = data.description

    db.commit()
    db.refresh(invoice)
    return invoice

@router.delete("/{invoice_id}")
def delete_invoice(
    invoice_id: int,
    business: Business = Depends(get_current_business),
    db: Session = Depends(get_db)
):
    invoice = db.query(Invoice).filter(Invoice.id == invoice_id, Invoice.business_id == business.id).first()
    if not invoice:
        raise HTTPException(status_code=404, detail="Invoice not found")

    db.delete(invoice)
    db.commit()
    return {"status": "deleted", "id": invoice_id}
