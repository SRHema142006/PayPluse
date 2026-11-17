import datetime
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database.db import get_db
from app.models.domain import Invoice, Business, FinancingApplication
from app.models.schemas import FinancingApplyRequest
from app.core.security import get_current_business

router = APIRouter(prefix="/api/financing", tags=["financing"])

PARTNERS = [
    {"name": "KredX Capital", "max_advance_pct": 85, "fee_pct": 3.0, "rating": 4.9, "speed": "24 hours", "min_score": 60},
    {"name": "Mintifi Finance", "max_advance_pct": 80, "fee_pct": 2.5, "rating": 4.8, "speed": "48 hours", "min_score": 55},
    {"name": "InCred Working Capital", "max_advance_pct": 90, "fee_pct": 3.5, "rating": 4.7, "speed": "12 hours", "min_score": 65},
]

@router.get("/offers")
def list_financing_offers(
    business: Business = Depends(get_current_business),
    db: Session = Depends(get_db)
):
    unpaid_invoices = db.query(Invoice).filter(
        Invoice.business_id == business.id,
        Invoice.status.in_(["Overdue", "Pending", "Financing Requested"])
    ).all()

    offers = []
    for inv in unpaid_invoices:
        inv_amt = inv.amount
        adv_amt = inv_amt * 0.85
        fee_amt = inv_amt * 0.03
        payout_amt = adv_amt - fee_amt

        # Check existing application
        app = db.query(FinancingApplication).filter(FinancingApplication.invoice_id == inv.id).first()

        offers.append({
            "invoice_id": inv.id,
            "invoice_number": inv.number,
            "customer_name": inv.customer_name,
            "invoice_amount": inv_amt,
            "potential_advance": adv_amt,
            "estimated_fee": fee_amt,
            "expected_payout": payout_amt,
            "status": app.status if app else inv.status,
            "partners": PARTNERS
        })
    return offers

@router.post("/apply")
def apply_for_financing(
    req: FinancingApplyRequest,
    business: Business = Depends(get_current_business),
    db: Session = Depends(get_db)
):
    invoice = db.query(Invoice).filter(Invoice.id == req.invoice_id, Invoice.business_id == business.id).first()
    if not invoice:
        raise HTTPException(status_code=404, detail="Invoice not found")

    adv_amt = invoice.amount * 0.85
    fee_amt = invoice.amount * 0.03
    payout_amt = adv_amt - fee_amt

    existing = db.query(FinancingApplication).filter(FinancingApplication.invoice_id == invoice.id).first()
    if existing:
        existing.status = "Under Review"
        existing.partner_name = req.partner_name or "KredX Capital"
    else:
        existing = FinancingApplication(
            business_id=business.id,
            invoice_id=invoice.id,
            partner_name=req.partner_name or "KredX Capital",
            invoice_amount=invoice.amount,
            advance_amount=adv_amt,
            fee_amount=fee_amt,
            payout_amount=payout_amt,
            status="Under Review"
        )
        db.add(existing)

    invoice.status = "Financing Requested"
    db.commit()

    return {
        "status": "success",
        "message": f"Financing application submitted for Invoice {invoice.number}",
        "partner": req.partner_name or "KredX Capital",
        "advance_payout": payout_amt,
        "disclaimer": "Financing figures are illustrative. Offers are subject to partner verification and credit review."
    }
