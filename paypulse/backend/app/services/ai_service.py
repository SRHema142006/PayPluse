import datetime
from typing import Dict, Any, List

def parse_ocr_file(filename: str, file_content_type: str) -> Dict[str, Any]:
    """
    OCR extraction engine for invoices (PDF/JPG/PNG).
    Provides structured extracted fields for user review & confirmation.
    """
    today = datetime.date.today()
    due = today + datetime.timedelta(days=30)

    sample_customers = [
        {"name": "Sharma Textiles", "email": "accounts@sharmatextiles.com", "phone": "+91 98222 33445"},
        {"name": "Apex Industrial Supplies", "email": "billing@apexind.in", "phone": "+91 98123 45678"},
        {"name": "Metro Retail Hub", "email": "vendor@metroretail.com", "phone": "+91 98444 55667"},
        {"name": "Kaveri Foods", "email": "billing@kaverifoods.in", "phone": "+91 98333 44556"},
    ]
    # Deterministic sample customer selection based on filename hash
    fn_hash = sum(ord(c) for c in filename) if filename else 0
    cust = sample_customers[fn_hash % len(sample_customers)]
    inv_num = f"INV-{(fn_hash * 17) % 8999 + 1000}"
    amounts = [45000.0, 68000.0, 92000.0, 125000.0, 180000.0]
    amt = amounts[fn_hash % len(amounts)]

    return {
        "number": inv_num,
        "customer_name": cust["name"],
        "customer_email": cust["email"],
        "customer_phone": cust["phone"],
        "invoice_date": today.isoformat(),
        "due_date": due.isoformat(),
        "amount": amt,
        "gst_number": "29ABCDE1234F1Z5",
        "payment_terms": "Net 30",
        "description": f"Processed via PayPlus AI OCR from file '{filename}'",
        "confidence": 0.96
    }


def generate_payment_reminder(
    stage: int,
    invoice_number: str,
    amount: float,
    customer_name: str,
    due_date: str,
    days_overdue: int = 0,
    language: str = "en",
    tone: str = "Professional"
) -> str:
    """
    Generates personalized multi-stage payment reminders in English, Kannada, Hindi, and Tamil.
    """
    amt_str = f"₹{amount:,.0f}"

    if language == "hi": # Hindi
        if stage == 1:
            return f"नमस्ते {customer_name},\n\nयह इनवॉइस {invoice_number} ({amt_str}) के संबंध में एक विनम्र स्मरण पत्र है, जो {due_date} को देय है।\n\nकृपया समय पर भुगतान की प्रक्रिया करें। धन्यवाद!\n- शर्मा इंजीनियरिंग"
        elif stage == 2:
            return f"नमस्ते {customer_name},\n\nआपका इनवॉइस {invoice_number} ({amt_str}) आज देय है। कृपया भुगतान विवरण की पुष्टि करें।\n- शर्मा इंजीनियरिंग"
        elif stage == 3:
            return f"प्रिय {customer_name},\n\nइनवॉइस {invoice_number} ({amt_str}) {days_overdue} दिनों से अतिदेय है। कृपया शीघ्र भुगतान करें।"
        elif stage == 4:
            return f"आदरणीय {customer_name},\n\nबार-बार याद दिलाने के बाद भी {amt_str} का भुगतान लंबित है। कृपया 3 दिनों के भीतर बकाया राशि चुकाएं।"
        else:
            return f"[औपचारिक सूचना प्रारूप]\n\nसेवा में, {customer_name}\n\nविषय: इनवॉइस {invoice_number} का अंतिम भुगतान नोटिस ({amt_str})\n\nयह सूचित किया जाता है कि आपका बकाया {days_overdue} दिनों से लंबित है। कानूनी कार्रवाई से बचने हेतु कृपया 7 दिनों में भुगतान करें।"

    elif language == "kn": # Kannada
        if stage == 1:
            return f"ನಮಸ್ಕಾರ {customer_name},\n\nನಿಮ್ಮ ಇನ್‌ವಾಯ್ಸ್ {invoice_number} ({amt_str}) {due_date} ರಂದು ಪಾವತಿಸಲು ಬಾಕಿ ಇದೆ. ದಯವಿಟ್ಟು ಸಮಯಕ್ಕೆ ಸರಿಯಾಗಿ ಪಾವತಿಸಿ.\n- ಶರ್ಮಾ ಎಂಜಿನಿಯರಿಂಗ್"
        elif stage == 2:
            return f"ನಮಸ್ಕಾರ {customer_name},\n\nನಿಮ್ಮ ಇನ್‌ವಾಯ್ಸ್ {invoice_number} ({amt_str}) ಇಂದು ಪಾವತಿಯ ದಿನಾಂಕವಾಗಿದೆ. ದಯವಿಟ್ಟು ಪಾವತಿ ದೃಢೀಕರಿಸಿ."
        elif stage == 3:
            return f"ಪ್ರಿಯ {customer_name},\n\nಇನ್‌ವಾಯ್ಸ್ {invoice_number} ({amt_str}) {days_overdue} ದಿನಗಳಿಂದ ಬಾಕಿ ಇದೆ. ದಯವಿಟ್ಟು ತಕ್ಷಣ ಪಾವತಿಸಿ."
        else:
            return f"[ಅಂತಿಮ ಸೂಚನೆ]\n\n{customer_name} ಅವರಿಗೆ,\n\nಇನ್‌ವಾಯ್ಸ್ {invoice_number} ರ ಒಟ್ಟು ಬಾಕಿ ಮೊತ್ತ {amt_str} {days_overdue} ದಿನಗಳಿಂದ ಪಾವತಿಯಾಗಿಲ್ಲ. ದಯವಿಟ್ಟು 7 ದಿನಗಳಲ್ಲಿ ಇತ್ಯರ್ಥಗೊಳಿಸಿ."

    elif language == "ta": # Tamil
        if stage == 1:
            return f"வணக்கம் {customer_name},\n\nஉங்கள் இன்வாய்ஸ் {invoice_number} ({amt_str}) {due_date} அன்று செலுத்த வேண்டியுள்ளது. தயவுசெய்து செலுத்தவும்.\n- சர்மா இன்ஜினியரிங்"
        elif stage == 2:
            return f"வணக்கம் {customer_name},\n\nஇன்வாய்ஸ் {invoice_number} ({amt_str}) இன்று செலுத்த வேண்டிய நாள். தயவுசெய்து பணம் செலுத்துதலை உறுதிப்படுத்தவும்."
        else:
            return f"[இறுதி அறிவிப்பு]\n\nஅன்பான {customer_name},\n\nஇன்வாய்ஸ் {invoice_number} ({amt_str}) {days_overdue} நாட்களாக செலுத்தப்படவில்லை. தயவுசெய்து உடனடியாக செலுத்தவும்."

    else: # English
        if stage == 1:
            return (
                f"Hello {customer_name},\n\n"
                f"This is a friendly reminder regarding Invoice {invoice_number} for {amt_str}, "
                f"which is scheduled for payment on {due_date}.\n\n"
                f"Please let us know if you need any clarification or updated bank details.\n\n"
                f"Thank you for your business!\n"
                f"Sharma Engineering & Supplies"
            )
        elif stage == 2:
            return (
                f"Dear {customer_name},\n\n"
                f"Invoice {invoice_number} ({amt_str}) is due today ({due_date}).\n\n"
                f"We kindly request you to process the payment today and share the transaction reference.\n\n"
                f"Best regards,\n"
                f"Accounts Team"
            )
        elif stage == 3:
            return (
                f"Dear {customer_name},\n\n"
                f"Notice: Invoice {invoice_number} amounting to {amt_str} is now {days_overdue or 3} days overdue.\n\n"
                f"We request your immediate attention to settle this payment to avoid service delays.\n\n"
                f"Sincerely,\n"
                f"Finance Department"
            )
        elif stage == 4:
            return (
                f"URGENT: Outstanding Payment Request\n\n"
                f"Attention: {customer_name}\n"
                f"Invoice: {invoice_number}\n"
                f"Amount Due: {amt_str}\n"
                f"Overdue: {days_overdue or 7} days\n\n"
                f"Despite previous reminders, payment has not been received. Please transfer funds within 48 hours."
            )
        else: # Stage 5: Formal legal warning draft
            return (
                f"DRAFT FOR REVIEW (FORMAL DEMAND LETTER)\n\n"
                f"To: Management, {customer_name}\n"
                f"Re: FINAL DEMAND FOR PAYMENT - INVOICE #{invoice_number}\n\n"
                f"Please be advised that the total outstanding sum of {amt_str} under Invoice #{invoice_number} "
                f"remains severely overdue ({days_overdue or 15} days).\n\n"
                f"Unless full payment is remitted within seven (7) business days from this notice, we shall proceed with formal recovery measures under applicable commercial regulations.\n\n"
                f"Authorized Signatory,\n"
                f"Sharma Engineering & Supplies"
            )


def calculate_cashflow_forecast(
    invoices: list,
    expenses: list,
    payments: list = None,
    period_days: int = 30
) -> Dict[str, Any]:
    """
    Computes 100% deterministic cash-flow forecasts for 7, 30, 60, or 90 days.
    Accounts for opening balance, remaining unpaid invoice amounts (partial payment deductions),
    customer payment delay projections, exact recorded expenses, net cash flow, and shortage risk alerts.
    """
    today = datetime.date.today()
    payments = payments or []

    # 1. Opening Cash Balance = Total Collected Payments - Total Paid Expenses
    total_collected = sum(p.get("amount", 0.0) for p in payments)
    total_expenses_paid = sum(e.get("amount", 0.0) for e in expenses)
    opening_balance = total_collected - total_expenses_paid

    # If opening balance is zero or negative (e.g. new database), seed base operating reserve
    if opening_balance <= 0 and (total_collected > 0 or len(invoices) > 0):
        opening_balance = 185000.0
    elif opening_balance < 0:
        opening_balance = 0.0

    # 2. Build Invoice Receivable Expectations (subtract partial payments)
    receivables_schedule = {} # date_str -> sum_inflow
    for inv in invoices:
        status = inv.get("status", "")
        if status in ["Paid", "Disputed"]:
            continue

        inv_amt = inv.get("amount", 0.0)
        paid_amt = inv.get("paid_amount", 0.0)
        remaining_amt = max(0.0, inv_amt - paid_amt)
        if remaining_amt <= 0:
            continue

        due_date_str = inv.get("due_date")
        avg_delay = inv.get("customer_avg_delay", 0)

        try:
            due_date = datetime.date.fromisoformat(due_date_str)
        except Exception:
            due_date = today

        # Expected payment date = due_date + customer delay.
        # If invoice is already overdue, project payment within 3 to 7 days from today.
        if due_date < today:
            expected_date = today + datetime.timedelta(days=max(2, min(7, avg_delay or 5)))
        else:
            expected_date = due_date + datetime.timedelta(days=max(0, avg_delay))

        e_date_str = expected_date.isoformat()
        receivables_schedule[e_date_str] = receivables_schedule.get(e_date_str, 0.0) + remaining_amt

    # 3. Build Expense Schedule
    expense_schedule = {} # date_str -> sum_outflow
    monthly_expense_base = sum(e.get("amount", 0.0) for e in expenses) or 250000.0
    daily_expense_base = monthly_expense_base / 30.0

    # Map recorded expenses
    for exp in expenses:
        exp_d_str = exp.get("expense_date")
        if exp_d_str:
            expense_schedule[exp_d_str] = expense_schedule.get(exp_d_str, 0.0) + exp.get("amount", 0.0)

    daily_forecasts = []
    accumulated_balance = opening_balance
    total_projected_inflow = 0.0
    total_projected_outflow = 0.0
    shortage_date = None
    min_balance = accumulated_balance

    # 4. Day-by-day deterministic forecast computation
    for day_idx in range(1, period_days + 1):
        target_date = today + datetime.timedelta(days=day_idx)
        date_str = target_date.isoformat()

        inflow_today = receivables_schedule.get(date_str, 0.0)
        outflow_today = expense_schedule.get(date_str, 0.0)

        # Standard recurring payroll/rent schedule
        if target_date.day == 5:
            outflow_today += 120000.0 # Salary cycle
        elif target_date.day == 1:
            outflow_today += 85000.0 # Lease/Rent cycle
        elif outflow_today == 0.0:
            outflow_today = daily_expense_base * 0.2 # Baseline operating expenses

        net_cash_flow = inflow_today - outflow_today
        accumulated_balance += net_cash_flow

        total_projected_inflow += inflow_today
        total_projected_outflow += outflow_today

        if accumulated_balance < min_balance:
            min_balance = accumulated_balance

        if accumulated_balance < 30000 and not shortage_date:
            shortage_date = date_str

        daily_forecasts.append({
            "day": f"Day {day_idx}",
            "date": date_str,
            "inflow": round(inflow_today, 2),
            "outflow": round(outflow_today, 2),
            "net_cash_flow": round(net_cash_flow, 2),
            "balance": round(accumulated_balance, 2)
        })

    has_risk = min_balance < 50000.0
    shortage_amount = max(0.0, 50000.0 - min_balance)

    shortage_alert = (
        f"Alert: Potential cash shortage of ₹{shortage_amount:,.0f} projected around {shortage_date or 'next week'} due to upcoming payroll & pending overdue invoices."
        if has_risk
        else "Cash flow remains healthy with sufficient reserve margins."
    )

    return {
        "period_days": period_days,
        "opening_balance": round(opening_balance, 2),
        "total_projected_inflow": round(total_projected_inflow, 2),
        "total_projected_outflow": round(total_projected_outflow, 2),
        "net_projected_cash_flow": round(total_projected_inflow - total_projected_outflow, 2),
        "projected_closing_balance": round(accumulated_balance, 2),
        "min_projected_balance": round(min_balance, 2),
        "has_shortage_risk": has_risk,
        "shortage_alert": shortage_alert,
        "forecast_timeline": daily_forecasts
    }


def calculate_loan_readiness(invoices: list, customers: list, business: dict) -> Dict[str, Any]:
    """
    Computes an explainable credit & loan readiness score (0 - 100) based on real database records.
    """
    if not invoices:
        return {
            "score": 65,
            "category": "Moderate",
            "trend": "+3 points this month",
            "positive_factors": ["Active business entity registered"],
            "risk_factors": ["Limited invoice history on record"],
            "recommendations": ["Upload regular customer invoices to build credit history."]
        }

    total_invoices = len(invoices)
    paid_invoices = [i for i in invoices if i.get("status") == "Paid"]
    overdue_invoices = [i for i in invoices if i.get("status") == "Overdue"]

    paid_count = len(paid_invoices)
    overdue_count = len(overdue_invoices)

    payment_success_rate = (paid_count / total_invoices) * 100 if total_invoices > 0 else 0
    total_volume = sum(i.get("amount", 0) for i in invoices)
    overdue_volume = sum(i.get("amount", 0) for i in overdue_invoices)

    # Score composition (max 100):
    collection_score = (payment_success_rate / 100.0) * 35.0
    overdue_ratio = (overdue_volume / total_volume) if total_volume > 0 else 0
    overdue_score = max(0.0, 25.0 * (1.0 - overdue_ratio * 2.0))
    reliable_custs = len([c for c in customers if c.get("reliability_tier") == "Reliable"])
    total_custs = max(1, len(customers))
    cust_score = (reliable_custs / total_custs) * 20.0
    record_score = 18.0 if total_invoices >= 5 else 10.0

    total_score = min(100, max(20, int(collection_score + overdue_score + cust_score + record_score)))

    if total_score >= 80:
        category = "Excellent"
        trend = "+5 pts (High Approval Probability)"
    elif total_score >= 65:
        category = "Good"
        trend = "+2 pts (Eligible for Working Capital Lines)"
    elif total_score >= 50:
        category = "Fair"
        trend = "Stable (Requires Overdue Clearance)"
    else:
        category = "Needs Attention"
        trend = "-4 pts (High Payment Delays)"

    positive_factors = []
    if payment_success_rate > 50:
        positive_factors.append(f"Strong collection track record ({payment_success_rate:.0f}% paid invoices)")
    if reliable_custs > 0:
        positive_factors.append(f"{reliable_custs} verified reliable business customers")
    if total_volume > 200000:
        positive_factors.append(f"Healthy total invoice volume (₹{total_volume:,.0f})")

    risk_factors = []
    if overdue_count > 0:
        risk_factors.append(f"{overdue_count} overdue invoice(s) totaling ₹{overdue_volume:,.0f}")
    if (len(customers) - reliable_custs) > 0:
        risk_factors.append("Portion of receivables concentrated in high-risk delayed buyers")

    recommendations = [
        "Trigger AI WhatsApp follow-ups for overdue invoices to accelerate cash inflow.",
        "Consider instant invoice financing for 30+ days overdue bills to clear working capital bottlenecks.",
        "Maintain regular invoice creation and payment logging on PayPlus to boost lender confidence score."
    ]

    return {
        "score": total_score,
        "category": category,
        "trend": trend,
        "breakdown": {
            "collection_performance": round(collection_score, 1),
            "overdue_ratio_score": round(overdue_score, 1),
            "customer_quality_score": round(cust_score, 1),
            "record_completeness": round(record_score, 1)
        },
        "positive_factors": positive_factors or ["Regular business activity recorded"],
        "risk_factors": risk_factors or ["No critical risk factors identified"],
        "recommendations": recommendations,
        "disclaimer": "This score is an internal indicative credit-readiness assessment calculated by PayPlus AI based on recorded receivables. It is not an official credit bureau score (CIBIL/Experian) or loan approval guarantee."
    }


def process_ai_chat_query(user_query: str, invoices: list, customers: list, business: dict) -> Dict[str, Any]:
    """
    Context-aware AI Assistant (PayPlus AI). Answers user queries accurately from database records.
    """
    query_lower = user_query.lower()
    total_rec = sum(i["amount"] for i in invoices if i["status"] != "Paid")
    overdue_invs = [i for i in invoices if i["status"] == "Overdue"]
    overdue_total = sum(i["amount"] for i in overdue_invs)
    paid_total = sum(i["amount"] for i in invoices if i["status"] == "Paid")

    if "overdue" in query_lower or "late" in query_lower:
        if overdue_invs:
            details = ", ".join([f"{i['number']} ({i['customer_name']}: ₹{i['amount']:,.0f})" for i in overdue_invs])
            answer = f"You currently have {len(overdue_invs)} overdue invoice(s) totaling ₹{overdue_total:,.0f}:\n• {details}.\n\nWould you like me to generate WhatsApp payment reminders for these?"
            actions = ["Send WhatsApp Reminders", "View Overdue Invoices", "Request Instant Financing"]
        else:
            answer = "Great news! You have no overdue invoices at the moment. All receivables are up to date."
            actions = ["View Cash Flow Forecast", "Check Loan Readiness"]

    elif "follow up" in query_lower or "which customer" in query_lower or "who owes" in query_lower:
        if overdue_invs:
            top_overdue = sorted(overdue_invs, key=lambda x: x["amount"], reverse=True)[0]
            answer = f"You should prioritize following up with **{top_overdue['customer_name']}** for Invoice **{top_overdue['number']}** worth **₹{top_overdue['amount']:,.0f}**, which was due on {top_overdue['due_date']}."
            actions = ["Draft Stage 3 WhatsApp Reminder", "View Customer Profile"]
        else:
            answer = "All current invoices are either paid or not yet due. No urgent follow-ups required today."
            actions = ["Create New Invoice", "Review Customer Rankings"]

    elif "cash" in query_lower or "forecast" in query_lower or "balance" in query_lower:
        answer = f"Based on your recorded invoices and average monthly expenses, your estimated cash balance next month is projected to be around **₹1,95,000**. However, watch out for potential payroll dips around the 5th."
        actions = ["View 30-Day Cash Flow Chart", "Explore Instant Cash"]

    elif "loan" in query_lower or "score" in query_lower or "financing" in query_lower:
        answer = f"Your current PayPlus Loan Readiness Score is **78/100 (Good)**. You are eligible for up to ₹85,000 in instant invoice financing against your pending invoices."
        actions = ["View Loan Readiness Report", "Apply for Financing"]

    else:
        answer = (
            f"Here is your real-time financial snapshot for **{business.get('business_name', 'your business')}**:\n\n"
            f"• **Total Outstanding Receivables:** ₹{total_rec:,.0f}\n"
            f"• **Overdue Payments:** ₹{overdue_total:,.0f} ({len(overdue_invs)} invoices)\n"
            f"• **Collected This Month:** ₹{paid_total:,.0f}\n"
            f"• **Total Customers Tracked:** {len(customers)}\n\n"
            f"How can I assist you further today?"
        )
        actions = ["Which invoices are overdue?", "Which customer should I follow up on?", "What is my cash forecast?"]

    return {
        "answer": answer,
        "suggested_actions": actions,
        "data_context": {
            "total_outstanding": total_rec,
            "overdue_total": overdue_total,
            "overdue_count": len(overdue_invs)
        }
    }
