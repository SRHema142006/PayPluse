from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.database.db import get_db
from app.models.domain import Invoice, Customer, Business
from app.core.security import get_current_business
from app.services.ai_service import calculate_loan_readiness

router = APIRouter(prefix="/api/loan-readiness", tags=["loan-readiness"])

@router.get("/score")
def get_loan_readiness_score(
    business: Business = Depends(get_current_business),
    db: Session = Depends(get_db)
):
    invoices = db.query(Invoice).filter(Invoice.business_id == business.id).all()
    customers = db.query(Customer).filter(Customer.business_id == business.id).all()

    inv_list = [{"status": i.status, "amount": i.amount} for i in invoices]
    cust_list = [{"reliability_tier": c.reliability_tier} for c in customers]
    biz_dict = {"business_name": business.business_name}

    score_data = calculate_loan_readiness(inv_list, cust_list, biz_dict)
    return score_data

@router.get("/report")
def get_lender_summary_report(
    business: Business = Depends(get_current_business),
    db: Session = Depends(get_db)
):
    invoices = db.query(Invoice).filter(Invoice.business_id == business.id).all()
    customers = db.query(Customer).filter(Customer.business_id == business.id).all()

    total_rev = sum(i.amount for i in invoices if i.status == "Paid")
    total_out = sum(i.amount for i in invoices if i.status not in ["Paid", "Disputed"])
    overdue_out = sum(i.amount for i in invoices if i.status == "Overdue")

    score_data = calculate_loan_readiness(
        [{"status": i.status, "amount": i.amount} for i in invoices],
        [{"reliability_tier": c.reliability_tier} for c in customers],
        {"business_name": business.business_name}
    )

    return {
        "report_title": "PayPlus Certified Financial Health & Lender Summary",
        "business_name": business.business_name,
        "owner_name": business.user.owner_name,
        "location": business.user.business_location or "Karnataka, India",
        "score": score_data["score"],
        "score_category": score_data["category"],
        "metrics": {
            "total_recorded_revenue": total_rev,
            "total_outstanding": total_out,
            "overdue_exposure": overdue_out,
            "verified_customers_count": len(customers),
            "reliable_buyers_percentage": f"{(len([c for c in customers if c.reliability_tier == 'Reliable']) / max(1, len(customers))) * 100:.0f}%"
        },
        "positive_factors": score_data["positive_factors"],
        "risk_factors": score_data["risk_factors"],
        "disclaimer": score_data["disclaimer"]
    }
