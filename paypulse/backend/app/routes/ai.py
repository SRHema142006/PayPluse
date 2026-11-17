from fastapi import APIRouter, Depends, UploadFile, File, Form
from sqlalchemy.orm import Session
from app.database.db import get_db
from app.models.domain import Invoice, Customer, Business
from app.models.schemas import AIChatRequest, AIChatResponse
from app.core.security import get_current_business
from app.services.ai_service import parse_ocr_file, process_ai_chat_query, generate_payment_reminder, calculate_cashflow_forecast

router = APIRouter(prefix="/api/ai", tags=["ai"])

@router.post("/chat", response_model=AIChatResponse)
def ai_chat(
    data: AIChatRequest,
    business: Business = Depends(get_current_business),
    db: Session = Depends(get_db)
):
    invoices = db.query(Invoice).filter(Invoice.business_id == business.id).all()
    customers = db.query(Customer).filter(Customer.business_id == business.id).all()

    inv_list = [{"number": i.number, "customer_name": i.customer_name, "amount": i.amount, "due_date": i.due_date, "status": i.status} for i in invoices]
    cust_list = [{"name": c.name, "company": c.company, "reliability_tier": c.reliability_tier} for c in customers]
    biz_info = {"business_name": business.business_name}

    res = process_ai_chat_query(data.message, inv_list, cust_list, biz_info)
    return res

@router.post("/extract-invoice")
async def extract_invoice_ocr(
    file: UploadFile = File(...)
):
    data = parse_ocr_file(file.filename, file.content_type)
    return data

@router.get("/reminder")
def get_ai_reminder_prompt(
    stage: int = 1,
    number: str = "INV-1024",
    amount: float = 45000.0,
    customer: str = "ABC Enterprises",
    due_date: str = "2026-11-01",
    language: str = "en"
):
    msg = generate_payment_reminder(
        stage=stage,
        invoice_number=number,
        amount=amount,
        customer_name=customer,
        due_date=due_date,
        language=language
    )
    return {"stage": stage, "language": language, "message": msg}

@router.get("/forecast")
def get_ai_forecast(days: int = 30, business: Business = Depends(get_current_business), db: Session = Depends(get_db)):
    invoices = db.query(Invoice).filter(Invoice.business_id == business.id).all()
    inv_list = [{"due_date": i.due_date, "amount": i.amount, "status": i.status} for i in invoices]
    forecast = calculate_cashflow_forecast(inv_list, [], period_days=days)
    return forecast
