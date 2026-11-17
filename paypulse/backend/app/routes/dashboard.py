from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.database.db import get_db
from app.models.domain import Business, Invoice, Customer, Payment, Notification
from app.core.security import get_current_user, get_current_business
from app.services.ai_service import calculate_cashflow_forecast, calculate_loan_readiness

router = APIRouter(prefix="/api/dashboard", tags=["dashboard"])

@router.get("/summary")
def get_dashboard_summary(
    business: Business = Depends(get_current_business),
    db: Session = Depends(get_db)
):
    invoices = db.query(Invoice).filter(Invoice.business_id == business.id).all()
    customers = db.query(Customer).filter(Customer.business_id == business.id).all()

    total_outstanding = sum(i.amount for i in invoices if i.status not in ["Paid", "Disputed"])
    overdue_amount = sum(i.amount for i in invoices if i.status == "Overdue")
    collected_amount = sum(i.amount for i in invoices if i.status == "Paid")
    upcoming_amount = sum(i.amount for i in invoices if i.status in ["Pending", "Upcoming"])
    cash_available = 185000.0 # Estimated bank cash

    inv_dicts = [{"due_date": i.due_date, "amount": i.amount, "status": i.status} for i in invoices]
    forecast = calculate_cashflow_forecast(inv_dicts, [], period_days=7)

    # Recent activity logs
    activities = [
        {"id": 1, "type": "invoice_uploaded", "title": "Invoice Uploaded", "description": "INV-1031 for Deccan Logistics added via OCR", "time": "2 hours ago", "icon": "upload"},
        {"id": 2, "type": "reminder_sent", "title": "WhatsApp Reminder Sent", "description": "Friendly reminder delivered to Sharma Textiles for INV-1025", "time": "5 hours ago", "icon": "send"},
        {"id": 3, "type": "payment_received", "title": "Payment Received", "description": "Lotus Traders settled INV-1028 of ₹90,000", "time": "Yesterday", "icon": "check"},
        {"id": 4, "type": "invoice_overdue", "title": "Invoice Marked Overdue", "description": "ABC Enterprises (INV-1024, ₹45,000) reached 10 days past due", "time": "2 days ago", "icon": "alert"},
        {"id": 5, "type": "financing_offer", "title": "Financing Offer Available", "description": "KredX Capital offered ₹85,000 advance on INV-1029", "time": "3 days ago", "icon": "zap"},
    ]

    # AI Insight Panel
    insight = "Your business may face a ₹30,000 cash shortage next week based on upcoming expenses and expected collection delays." if overdue_amount > 50000 else "Receivables look healthy! Consider clearing 2 overdue invoices to boost your credit score above 80."

    return {
        "business_name": business.business_name,
        "kpis": {
            "total_outstanding": total_outstanding,
            "total_outstanding_change": "+4.2%",
            "overdue_payments": overdue_amount,
            "overdue_payments_change": "-2.1%",
            "collected_this_month": collected_amount,
            "collected_change": "+12.5%",
            "upcoming_payments": upcoming_amount,
            "upcoming_change": "+5.0%",
            "cash_available": cash_available,
            "cash_change": "+3.8%"
        },
        "charts": {
            "revenue_vs_expenses": [
                {"month": "Jun", "revenue": 450000, "expenses": 280000},
                {"month": "Jul", "revenue": 520000, "expenses": 310000},
                {"month": "Aug", "revenue": 490000, "expenses": 295000},
                {"month": "Sep", "revenue": 610000, "expenses": 340000},
                {"month": "Oct", "revenue": collected_amount, "expenses": business.monthly_expenses or 380000}
            ],
            "paid_vs_unpaid": [
                {"name": "Paid", "value": len([i for i in invoices if i.status == "Paid"]), "amount": collected_amount, "color": "#35C99A"},
                {"name": "Pending", "value": len([i for i in invoices if i.status in ["Pending", "Upcoming"]]), "amount": upcoming_amount, "color": "#315EF4"},
                {"name": "Overdue", "value": len([i for i in invoices if i.status == "Overdue"]), "amount": overdue_amount, "color": "#EF4444"},
            ],
            "customer_reliability": [
                {"category": "Reliable", "count": len([c for c in customers if c.reliability_tier == "Reliable"])},
                {"category": "Moderate Risk", "count": len([c for c in customers if c.reliability_tier == "Moderate Risk"])},
                {"category": "High Risk", "count": len([c for c in customers if c.reliability_tier == "High Risk"])},
            ]
        },
        "ai_insight": insight,
        "recent_activities": activities
    }
