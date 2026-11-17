import datetime
from sqlalchemy import Column, Integer, String, Float, Boolean, DateTime, Text, ForeignKey
from sqlalchemy.orm import declarative_base, relationship

Base = declarative_base()

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True, nullable=False)
    hashed_password = Column(String, nullable=False)
    owner_name = Column(String, nullable=False)
    phone_number = Column(String, nullable=True)
    business_category = Column(String, nullable=True)
    business_location = Column(String, nullable=True)
    preferred_language = Column(String, default="en")
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

    business = relationship("Business", back_populates="user", uselist=False)


class Business(Base):
    __tablename__ = "businesses"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    business_name = Column(String, nullable=False)
    business_type = Column(String, nullable=True)
    monthly_revenue = Column(String, nullable=True)
    monthly_expenses = Column(Float, default=0.0)
    payment_terms = Column(String, default="Net 30")
    regular_customers_count = Column(Integer, default=10)
    preferred_reminder_channel = Column(String, default="WhatsApp")
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

    user = relationship("User", back_populates="business")
    customers = relationship("Customer", back_populates="business", cascade="all, delete-orphan")
    invoices = relationship("Invoice", back_populates="business", cascade="all, delete-orphan")
    expenses = relationship("Expense", back_populates="business", cascade="all, delete-orphan")


class Customer(Base):
    __tablename__ = "customers"

    id = Column(Integer, primary_key=True, index=True)
    business_id = Column(Integer, ForeignKey("businesses.id"), nullable=False)
    name = Column(String, nullable=False)
    company = Column(String, nullable=True)
    email = Column(String, nullable=True)
    phone = Column(String, nullable=True)
    total_invoices = Column(Integer, default=0)
    total_outstanding = Column(Float, default=0.0)
    avg_payment_delay = Column(Integer, default=0)
    reliability_tier = Column(String, default="Reliable") # Reliable, Moderate Risk, High Risk
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

    business = relationship("Business", back_populates="customers")
    invoices = relationship("Invoice", back_populates="customer_rel", cascade="all, delete-orphan")


class Invoice(Base):
    __tablename__ = "invoices"

    id = Column(Integer, primary_key=True, index=True)
    business_id = Column(Integer, ForeignKey("businesses.id"), nullable=False)
    customer_id = Column(Integer, ForeignKey("customers.id"), nullable=True)
    number = Column(String, nullable=False, index=True)
    customer_name = Column(String, nullable=False)
    customer_email = Column(String, nullable=True)
    customer_phone = Column(String, nullable=True)
    invoice_date = Column(String, nullable=False)
    due_date = Column(String, nullable=False)
    amount = Column(Float, nullable=False)
    status = Column(String, default="Pending") # Draft, Pending, Upcoming, Due Today, Overdue, Partially Paid, Paid, Disputed, Financing Requested
    gst_number = Column(String, nullable=True)
    payment_terms = Column(String, default="Net 30")
    description = Column(Text, nullable=True)
    file_path = Column(String, nullable=True)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

    business = relationship("Business", back_populates="invoices")
    customer_rel = relationship("Customer", back_populates="invoices")
    payments = relationship("Payment", back_populates="invoice", cascade="all, delete-orphan")
    reminders = relationship("ReminderSchedule", back_populates="invoice", cascade="all, delete-orphan")


class Payment(Base):
    __tablename__ = "payments"

    id = Column(Integer, primary_key=True, index=True)
    invoice_id = Column(Integer, ForeignKey("invoices.id"), nullable=False)
    amount = Column(Float, nullable=False)
    payment_date = Column(String, nullable=False)
    payment_method = Column(String, default="Bank Transfer") # UPI, Bank Transfer, Cheque, Cash
    reference_number = Column(String, nullable=True)
    notes = Column(Text, nullable=True)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

    invoice = relationship("Invoice", back_populates="payments")


class Expense(Base):
    __tablename__ = "expenses"

    id = Column(Integer, primary_key=True, index=True)
    business_id = Column(Integer, ForeignKey("businesses.id"), nullable=False)
    category = Column(String, nullable=False) # Salaries, Rent, Utilities, Materials, Software
    description = Column(String, nullable=True)
    amount = Column(Float, nullable=False)
    expense_date = Column(String, nullable=False)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

    business = relationship("Business", back_populates="expenses")


class ReminderSchedule(Base):
    __tablename__ = "reminder_schedules"

    id = Column(Integer, primary_key=True, index=True)
    invoice_id = Column(Integer, ForeignKey("invoices.id"), nullable=False)
    stage = Column(Integer, nullable=False) # 1: Friendly before due, 2: On due date, 3: 3 days overdue, 4: 7 days overdue, 5: 15 days formal warning
    scheduled_date = Column(String, nullable=False)
    status = Column(String, default="Scheduled") # Scheduled, Approved, Sent, Cancelled
    channel = Column(String, default="WhatsApp") # WhatsApp, Email
    message_draft = Column(Text, nullable=True)
    is_approved = Column(Boolean, default=False)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

    invoice = relationship("Invoice", back_populates="reminders")


class MessageLog(Base):
    __tablename__ = "message_logs"

    id = Column(Integer, primary_key=True, index=True)
    business_id = Column(Integer, ForeignKey("businesses.id"), nullable=False)
    invoice_id = Column(Integer, ForeignKey("invoices.id"), nullable=True)
    customer_name = Column(String, nullable=False)
    channel = Column(String, nullable=False) # WhatsApp, Email
    stage = Column(Integer, default=1)
    message_body = Column(Text, nullable=False)
    status = Column(String, default="Sent") # Sent, Delivered, Failed, Demo Simulated
    sent_at = Column(DateTime, default=datetime.datetime.utcnow)


class Notification(Base):
    __tablename__ = "notifications"

    id = Column(Integer, primary_key=True, index=True)
    business_id = Column(Integer, ForeignKey("businesses.id"), nullable=False)
    title = Column(String, nullable=False)
    message = Column(Text, nullable=False)
    type = Column(String, default="info") # info, warning, success, alert
    is_read = Column(Boolean, default=False)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)


class FinancingApplication(Base):
    __tablename__ = "financing_applications"

    id = Column(Integer, primary_key=True, index=True)
    business_id = Column(Integer, ForeignKey("businesses.id"), nullable=False)
    invoice_id = Column(Integer, ForeignKey("invoices.id"), nullable=False)
    partner_name = Column(String, default="KredX Capital")
    invoice_amount = Column(Float, nullable=False)
    advance_amount = Column(Float, nullable=False) # e.g. 85%
    fee_amount = Column(Float, nullable=False) # e.g. 3%
    payout_amount = Column(Float, nullable=False) # advance - fee
    status = Column(String, default="Applied") # Draft, Applied, Under Review, Approved, Disbursed
    requested_at = Column(DateTime, default=datetime.datetime.utcnow)


class UserPreference(Base):
    __tablename__ = "user_preferences"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False, unique=True)
    whatsapp_enabled = Column(Boolean, default=True)
    whatsapp_api_key = Column(String, nullable=True)
    whatsapp_phone_number_id = Column(String, nullable=True)
    email_enabled = Column(Boolean, default=True)
    smtp_host = Column(String, nullable=True)
    smtp_port = Column(Integer, default=587)
    smtp_user = Column(String, nullable=True)
    smtp_password = Column(String, nullable=True)
    auto_reminders = Column(Boolean, default=True)
    currency = Column(String, default="INR")
    language = Column(String, default="en")
