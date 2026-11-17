from typing import Optional, List
from pydantic import BaseModel, EmailStr

# Auth & User
class UserRegister(BaseModel):
    owner_name: str
    email: EmailStr
    password: str
    phone_number: Optional[str] = None
    business_name: str
    business_category: Optional[str] = None
    business_location: Optional[str] = None
    preferred_language: Optional[str] = "en"

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: dict

class OnboardingData(BaseModel):
    business_type: Optional[str] = None
    monthly_revenue: Optional[str] = None
    monthly_expenses: Optional[float] = 0.0
    payment_terms: Optional[str] = "Net 30"
    regular_customers_count: Optional[int] = 10
    preferred_reminder_channel: Optional[str] = "WhatsApp"

# Invoices
class InvoiceBase(BaseModel):
    number: str
    customer_name: str
    customer_email: Optional[str] = None
    customer_phone: Optional[str] = None
    invoice_date: str
    due_date: str
    amount: float
    status: Optional[str] = "Pending"
    gst_number: Optional[str] = None
    payment_terms: Optional[str] = "Net 30"
    description: Optional[str] = None

class InvoiceCreate(InvoiceBase):
    pass

class InvoiceUpdate(BaseModel):
    number: Optional[str] = None
    customer_name: Optional[str] = None
    customer_email: Optional[str] = None
    customer_phone: Optional[str] = None
    invoice_date: Optional[str] = None
    due_date: Optional[str] = None
    amount: Optional[float] = None
    status: Optional[str] = None
    gst_number: Optional[str] = None
    payment_terms: Optional[str] = None
    description: Optional[str] = None

class InvoiceResponse(InvoiceBase):
    id: int
    business_id: int
    customer_id: Optional[int] = None
    file_path: Optional[str] = None

    class Config:
        from_attributes = True

# Customers
class CustomerCreate(BaseModel):
    name: str
    company: Optional[str] = None
    email: Optional[str] = None
    phone: Optional[str] = None

class CustomerResponse(BaseModel):
    id: int
    business_id: int
    name: str
    company: Optional[str]
    email: Optional[str]
    phone: Optional[str]
    total_invoices: int
    total_outstanding: float
    avg_payment_delay: int
    reliability_tier: str

    class Config:
        from_attributes = True

# Payments
class PaymentCreate(BaseModel):
    invoice_id: int
    amount: float
    payment_date: str
    payment_method: Optional[str] = "Bank Transfer"
    reference_number: Optional[str] = None
    notes: Optional[str] = None

# Reminders
class ReminderGenerateRequest(BaseModel):
    invoice_id: int
    stage: int = 1
    channel: str = "WhatsApp"
    tone: Optional[str] = "Professional" # Friendly, Professional, Firm, Formal Warning

class ReminderSendRequest(BaseModel):
    invoice_id: int
    stage: int
    channel: str
    message: str
    recipient: str

# AI Chat
class AIChatRequest(BaseModel):
    message: str
    language: Optional[str] = "en"
    conversation_id: Optional[str] = None

class AIChatResponse(BaseModel):
    answer: str
    suggested_actions: Optional[List[str]] = []
    data_context: Optional[dict] = None

# Financing
class FinancingApplyRequest(BaseModel):
    invoice_id: int
    partner_name: Optional[str] = "KredX Capital"

# Settings
class SettingsUpdate(BaseModel):
    business_name: Optional[str] = None
    owner_name: Optional[str] = None
    phone_number: Optional[str] = None
    whatsapp_enabled: Optional[bool] = True
    whatsapp_api_key: Optional[str] = None
    whatsapp_phone_number_id: Optional[str] = None
    email_enabled: Optional[bool] = True
    smtp_host: Optional[str] = None
    smtp_port: Optional[int] = 587
    smtp_user: Optional[str] = None
    smtp_password: Optional[str] = None
    auto_reminders: Optional[bool] = True
    currency: Optional[str] = "INR"
    language: Optional[str] = "en"
