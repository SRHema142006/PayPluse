from typing import Optional
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from app.database.db import get_db
from app.models.domain import Customer, Invoice, Business, Payment
from app.models.schemas import CustomerCreate, CustomerResponse
from app.core.security import get_current_business

router = APIRouter(prefix="/api/customers", tags=["customers"])

@router.get("")
def list_customers(
    search: Optional[str] = Query(None),
    business: Business = Depends(get_current_business),
    db: Session = Depends(get_db)
):
    query = db.query(Customer).filter(Customer.business_id == business.id)
    if search:
        fmt = f"%{search}%"
        query = query.filter((Customer.name.ilike(fmt)) | (Customer.company.ilike(fmt)))

    customers = query.all()
    # Recalculate totals dynamically from invoice DB records
    result = []
    for c in customers:
        invs = db.query(Invoice).filter(Invoice.customer_id == c.id, Invoice.business_id == business.id).all()
        tot_inv = len(invs)
        tot_out = sum(i.amount for i in invs if i.status not in ["Paid", "Disputed"])
        overdue_cnt = len([i for i in invs if i.status == "Overdue"])

        tier = "High Risk" if overdue_cnt >= 2 or c.avg_payment_delay > 10 else "Moderate Risk" if overdue_cnt == 1 or c.avg_payment_delay > 3 else "Reliable"

        result.append({
            "id": c.id,
            "business_id": c.business_id,
            "name": c.name,
            "company": c.company or c.name,
            "email": c.email or "customer@example.com",
            "phone": c.phone or "+91 98000 00000",
            "total_invoices": tot_inv,
            "total_outstanding": tot_out,
            "avg_payment_delay": c.avg_payment_delay,
            "reliability_tier": tier
        })

    return result

@router.post("", response_model=CustomerResponse, status_code=201)
def create_customer(
    data: CustomerCreate,
    business: Business = Depends(get_current_business),
    db: Session = Depends(get_db)
):
    cust = Customer(
        business_id=business.id,
        name=data.name,
        company=data.company or data.name,
        email=data.email,
        phone=data.phone,
        total_invoices=0,
        total_outstanding=0.0,
        avg_payment_delay=0,
        reliability_tier="Reliable"
    )
    db.add(cust)
    db.commit()
    db.refresh(cust)
    return cust

@router.get("/{customer_id}")
def get_customer_profile(
    customer_id: int,
    business: Business = Depends(get_current_business),
    db: Session = Depends(get_db)
):
    customer = db.query(Customer).filter(Customer.id == customer_id, Customer.business_id == business.id).first()
    if not customer:
        raise HTTPException(status_code=404, detail="Customer not found")

    invoices = db.query(Invoice).filter(Invoice.customer_id == customer.id).all()
    inv_ids = [i.id for i in invoices]
    payments = db.query(Payment).filter(Payment.invoice_id.in_(inv_ids)).all() if inv_ids else []

    total_outstanding = sum(i.amount for i in invoices if i.status not in ["Paid", "Disputed"])
    overdue_count = len([i for i in invoices if i.status == "Overdue"])

    return {
        "customer": customer,
        "invoices": invoices,
        "payments": payments,
        "metrics": {
            "total_invoices": len(invoices),
            "total_outstanding": total_outstanding,
            "overdue_count": overdue_count,
            "late_payment_frequency": f"{overdue_count / max(1, len(invoices)) * 100:.0f}%",
            "avg_days_to_pay": f"{customer.avg_payment_delay + 30} days"
        }
    }
