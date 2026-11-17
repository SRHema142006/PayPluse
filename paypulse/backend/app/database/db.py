import os
import hashlib
import datetime
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from app.models.domain import (
    Base, User, Business, Customer, Invoice, Payment, Expense,
    ReminderSchedule, MessageLog, Notification, FinancingApplication, UserPreference
)

DATABASE_URL = os.getenv("DATABASE_URL", "sqlite:///./payplus.db")

connect_args = {"check_same_thread": False} if DATABASE_URL.startswith("sqlite") else {}

engine = create_engine(DATABASE_URL, connect_args=connect_args)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

def hash_pwd(password: str) -> str:
    salt = "payplus_salt_2026"
    return hashlib.pbkdf2_hmac("sha256", password.encode("utf-8"), salt.encode("utf-8"), 100000).hex()

def init_db():
    Base.metadata.create_all(bind=engine)
    db = SessionLocal()
    try:
        user = db.query(User).filter(User.email == "demo@payplus.in").first()
        if not user:
            user = User(
                email="demo@payplus.in",
                hashed_password=hash_pwd("demo123"),
                owner_name="Rajesh Sharma",
                phone_number="+91 98765 43210",
                business_category="Manufacturing & Distribution",
                business_location="Bengaluru, Karnataka",
                preferred_language="en"
            )
            db.add(user)
            db.commit()
            db.refresh(user)

            business = Business(
                user_id=user.id,
                business_name="Sharma Engineering & Supplies",
                business_type="Small Manufacturing & B2B Distribution",
                monthly_revenue="₹15,00,000",
                monthly_expenses=380000.0,
                payment_terms="Net 30",
                regular_customers_count=18,
                preferred_reminder_channel="WhatsApp"
            )
            db.add(business)
            db.commit()
            db.refresh(business)

            pref = UserPreference(
                user_id=user.id,
                whatsapp_enabled=True,
                email_enabled=True,
                auto_reminders=True,
                currency="INR",
                language="en"
            )
            db.add(pref)

            customers_data = [
                {"name": "ABC Enterprises", "company": "ABC Group Ltd", "email": "finance@abcenterprises.in", "phone": "+91 98111 22334", "tot_inv": 6, "tot_out": 45000.0, "delay": 14, "tier": "High Risk"},
                {"name": "Sharma Textiles", "company": "Sharma Mills", "email": "accounts@sharmatextiles.com", "phone": "+91 98222 33445", "tot_inv": 12, "tot_out": 80000.0, "delay": 5, "tier": "Moderate Risk"},
                {"name": "Kaveri Foods", "company": "Kaveri Retail Pvt Ltd", "email": "billing@kaverifoods.in", "phone": "+91 98333 44556", "tot_inv": 8, "tot_out": 120000.0, "delay": 0, "tier": "Reliable"},
                {"name": "Metro Retail Hub", "company": "Metro Supermarkets", "email": "vendor@metroretail.com", "phone": "+91 98444 55667", "tot_inv": 15, "tot_out": 60000.0, "delay": 2, "tier": "Reliable"},
                {"name": "Lotus Traders", "company": "Lotus Export Corp", "email": "pay@lotustraders.org", "phone": "+91 98555 66778", "tot_inv": 5, "tot_out": 0.0, "delay": 1, "tier": "Reliable"},
                {"name": "Bharat Auto Parts", "company": "Bharat Ancillaries", "email": "ap@bharatauto.co.in", "phone": "+91 98666 77889", "tot_inv": 9, "tot_out": 100000.0, "delay": 18, "tier": "High Risk"},
                {"name": "Sunrise Electronics", "company": "Sunrise Tech Supplies", "email": "info@sunrisetech.in", "phone": "+91 98777 88990", "tot_inv": 4, "tot_out": 55000.0, "delay": 3, "tier": "Reliable"},
                {"name": "Deccan Logistics", "company": "Deccan Freight Movers", "email": "accounts@deccanlogistics.in", "phone": "+91 98888 99001", "tot_inv": 7, "tot_out": 35000.0, "delay": 9, "tier": "Moderate Risk"},
            ]
            cust_objs = {}
            for cdata in customers_data:
                c = Customer(
                    business_id=business.id,
                    name=cdata["name"],
                    company=cdata["company"],
                    email=cdata["email"],
                    phone=cdata["phone"],
                    total_invoices=cdata["tot_inv"],
                    total_outstanding=cdata["tot_out"],
                    avg_payment_delay=cdata["delay"],
                    reliability_tier=cdata["tier"]
                )
                db.add(c)
                db.commit()
                db.refresh(c)
                cust_objs[cdata["name"]] = c

            today = datetime.date.today()
            def d_str(offset):
                return (today + datetime.timedelta(days=offset)).isoformat()

            invoices_data = [
                ("INV-1024", "ABC Enterprises", d_str(-40), d_str(-10), 45000.0, "Overdue", "Precision Components Batch A"),
                ("INV-1025", "Sharma Textiles", d_str(-30), d_str(-2), 80000.0, "Overdue", "Industrial Weaving Machine Accessories"),
                ("INV-1026", "Kaveri Foods", d_str(-20), d_str(10), 120000.0, "Pending", "Packaging Supplies & Containers"),
                ("INV-1027", "Metro Retail Hub", d_str(-15), d_str(15), 60000.0, "Upcoming", "Display Racks & Hardware"),
                ("INV-1028", "Lotus Traders", d_str(-50), d_str(-20), 90000.0, "Paid", "Custom Metal Fabrication"),
                ("INV-1029", "Bharat Auto Parts", d_str(-35), d_str(-5), 100000.0, "Financing Requested", "Engine Gaskets & Spare Parts"),
                ("INV-1030", "Sunrise Electronics", d_str(-10), d_str(20), 55000.0, "Pending", "Circuit Boards & Wiring Assemblies"),
                ("INV-1031", "Deccan Logistics", d_str(-25), d_str(-1), 35000.0, "Overdue", "Maintenance & Fleet Hardware"),
                ("INV-1032", "Kaveri Foods", d_str(-60), d_str(-30), 150000.0, "Paid", "Quarterly Raw Material Supply"),
                ("INV-1033", "Metro Retail Hub", d_str(-45), d_str(-15), 75000.0, "Paid", "Store Fixtures & Shelving"),
            ]

            inv_objs = []
            for num, cust_name, idate, ddate, amt, status, desc in invoices_data:
                c_obj = cust_objs.get(cust_name)
                c_id = c_obj.id if c_obj else None
                c_email = c_obj.email if c_obj else "customer@example.com"
                c_phone = c_obj.phone if c_obj else "+91 99999 00000"

                inv = Invoice(
                    business_id=business.id,
                    customer_id=c_id,
                    number=num,
                    customer_name=cust_name,
                    customer_email=c_email,
                    customer_phone=c_phone,
                    invoice_date=idate,
                    due_date=ddate,
                    amount=amt,
                    status=status,
                    gst_number="29ABCDE1234F1Z5",
                    payment_terms="Net 30",
                    description=desc
                )
                db.add(inv)
                db.commit()
                db.refresh(inv)
                inv_objs.append(inv)

                if status == "Paid":
                    p = Payment(
                        invoice_id=inv.id,
                        amount=amt,
                        payment_date=ddate,
                        payment_method="UPI / Bank Transfer",
                        reference_number=f"PAY-{num}-8892",
                        notes="Full settlement received on time"
                    )
                    db.add(p)

                if status in ["Overdue", "Pending"]:
                    r = ReminderSchedule(
                        invoice_id=inv.id,
                        stage=3 if status == "Overdue" else 1,
                        scheduled_date=d_str(1),
                        status="Scheduled",
                        channel="WhatsApp",
                        message_draft=f"Dear {cust_name}, gentle reminder that invoice {num} of ₹{amt:,.0f} is currently due. Please settle at your earliest convenience.",
                        is_approved=False
                    )
                    db.add(r)

            expenses = [
                Expense(business_id=business.id, category="Salaries", description="Staff monthly salaries", amount=210000.0, expense_date=d_str(-5)),
                Expense(business_id=business.id, category="Rent", description="Factory & warehouse lease", amount=85000.0, expense_date=d_str(-10)),
                Expense(business_id=business.id, category="Utilities", description="Electricity & Water bills", amount=35000.0, expense_date=d_str(-8)),
                Expense(business_id=business.id, category="Materials", description="Raw steel & alloy stocks", amount=50000.0, expense_date=d_str(-2)),
            ]
            for exp in expenses:
                db.add(exp)

            notifications = [
                Notification(business_id=business.id, title="Cash-Flow Alert", message="Your business may face a ₹30,000 cash shortage next week based on upcoming expenses and expected collections.", type="warning", is_read=False),
                Notification(business_id=business.id, title="Invoice Overdue", message="Invoice INV-1025 for Sharma Textiles (₹80,000) is now 2 days overdue.", type="alert", is_read=False),
                Notification(business_id=business.id, title="Financing Offer", message="INV-1029 is eligible for instant advance up to ₹85,000 from KredX Capital.", type="info", is_read=False),
                Notification(business_id=business.id, title="Payment Received", message="Lotus Traders settled INV-1028 of ₹90,000 via UPI.", type="success", is_read=True),
            ]
            for n in notifications:
                db.add(n)

            financing_app = FinancingApplication(
                business_id=business.id,
                invoice_id=inv_objs[5].id,
                partner_name="KredX Capital",
                invoice_amount=100000.0,
                advance_amount=85000.0,
                fee_amount=3000.0,
                payout_amount=82000.0,
                status="Under Review"
            )
            db.add(financing_app)

            db.commit()
    finally:
        db.close()
