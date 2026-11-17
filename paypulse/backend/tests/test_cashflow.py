import pytest
import datetime
from app.services.ai_service import calculate_cashflow_forecast, calculate_loan_readiness

def test_cashflow_forecast_opening_balance():
    today = datetime.date.today().isoformat()
    payments = [{"amount": 100000.0, "payment_date": today}]
    expenses = [{"amount": 30000.0, "expense_date": today}]
    invoices = [
        {"id": 1, "amount": 50000.0, "paid_amount": 10000.0, "due_date": today, "status": "Pending"}
    ]

    forecast = calculate_cashflow_forecast(invoices, expenses, payments, period_days=30)

    # Opening balance = 100,000 - 30,000 = 70,000
    assert forecast["opening_balance"] == 70000.0
    assert forecast["period_days"] == 30
    assert len(forecast["forecast_timeline"]) == 30
    assert "net_projected_cash_flow" in forecast

def test_cashflow_partial_payments():
    today = datetime.date.today().isoformat()
    payments = [{"amount": 20000.0}]
    expenses = []
    # Invoice of 50k with 20k paid -> remaining receivable = 30k
    invoices = [{"amount": 50000.0, "paid_amount": 20000.0, "due_date": today, "status": "Partially Paid"}]

    forecast = calculate_cashflow_forecast(invoices, expenses, payments, period_days=7)
    assert forecast["opening_balance"] == 20000.0

def test_loan_readiness_score_empty():
    res = calculate_loan_readiness([], [], {})
    assert res["score"] == 65
    assert "category" in res

def test_loan_readiness_score_calculation():
    invoices = [
        {"status": "Paid", "amount": 100000.0},
        {"status": "Paid", "amount": 50000.0},
        {"status": "Overdue", "amount": 20000.0}
    ]
    customers = [{"reliability_tier": "Reliable"}, {"reliability_tier": "Moderate Risk"}]
    res = calculate_loan_readiness(invoices, customers, {"business_name": "Test Co"})
    assert 0 <= res["score"] <= 100
    assert res["category"] in ["Excellent", "Good", "Fair", "Needs Attention"]
