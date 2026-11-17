from typing import Optional
from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from app.database.db import get_db
from app.models.domain import Invoice, Customer, Payment, Business
from app.core.security import get_current_business

router = APIRouter(prefix="/api/reports", tags=["reports"])

@router.get("/summary")
def get_reports_summary(
    start_date: Optional[str] = Query(None),
    end_date: Optional[str] = Query(None),
    business: Business = Depends(get_current_business),
    db: Session = Depends(get_db)
):
    invoices = db.query(Invoice).filter(Invoice.business_id == business.id).all()
    customers = db.query(Customer).filter(Customer.business_id == business.id).all()

    total_invoiced = sum(i.amount for i in invoices)
    total_paid = sum(i.amount for i in invoices if i.status == "Paid")
    total_overdue = sum(i.amount for i in invoices if i.status == "Overdue")
    total_pending = sum(i.amount for i in invoices if i.status in ["Pending", "Upcoming"])

    collection_rate = (total_paid / total_invoiced * 100) if total_invoiced > 0 else 0

    return {
        "summary": {
            "total_invoiced": total_invoiced,
            "total_collected": total_paid,
            "total_overdue": total_overdue,
            "total_pending": total_pending,
            "collection_rate": f"{collection_rate:.1f}%",
            "active_customers": len(customers)
        },
        "monthly_trend": [
            {"month": "Jun", "invoiced": 240000, "collected": 180000},
            {"month": "Jul", "invoiced": 280000, "collected": 210000},
            {"month": "Aug", "invoiced": 260000, "collected": 195000},
            {"month": "Sep", "invoiced": 310000, "collected": 260000},
            {"month": "Oct", "invoiced": total_invoiced, "collected": total_paid},
        ],
        "customer_behavior": [
            {"name": c.name, "company": c.company, "tier": c.reliability_tier, "outstanding": c.total_outstanding}
            for c in customers
        ]
    }
