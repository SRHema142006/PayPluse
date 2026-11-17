from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from app.database.db import get_db
from app.models.domain import Invoice, Expense, Business, Payment, Customer
from app.core.security import get_current_business
from app.services.ai_service import calculate_cashflow_forecast

router = APIRouter(prefix="/api/cashflow", tags=["cashflow"])

@router.get("/forecast")
def get_cash_flow_forecast(
    days: int = Query(30, description="Forecast timeline: 7, 30, 60, or 90 days"),
    business: Business = Depends(get_current_business),
    db: Session = Depends(get_db)
):
    invoices = db.query(Invoice).filter(Invoice.business_id == business.id).all()
    expenses = db.query(Expense).filter(Expense.business_id == business.id).all()

    # Retrieve all payments associated with business invoices
    inv_ids = [i.id for i in invoices]
    payments = db.query(Payment).filter(Payment.invoice_id.in_(inv_ids)).all() if inv_ids else []

    # Map partial payments per invoice
    payments_by_inv = {}
    for p in payments:
        payments_by_inv[p.invoice_id] = payments_by_inv.get(p.invoice_id, 0.0) + p.amount

    # Map customer average delay
    customers = db.query(Customer).filter(Customer.business_id == business.id).all()
    cust_delays = {c.id: c.avg_payment_delay for c in customers}

    inv_list = []
    for i in invoices:
        paid_amt = payments_by_inv.get(i.id, 0.0)
        cust_delay = cust_delays.get(i.customer_id, 0) if i.customer_id else 0
        inv_list.append({
            "id": i.id,
            "number": i.number,
            "due_date": i.due_date,
            "amount": i.amount,
            "paid_amount": paid_amt,
            "status": i.status,
            "customer_avg_delay": cust_delay
        })

    exp_list = [{"amount": e.amount, "category": e.category, "expense_date": e.expense_date} for e in expenses]
    pay_list = [{"amount": p.amount, "payment_date": p.payment_date} for p in payments]

    forecast = calculate_cashflow_forecast(inv_list, exp_list, pay_list, period_days=days)
    return forecast
