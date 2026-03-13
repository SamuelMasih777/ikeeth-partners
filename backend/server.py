from fastapi import FastAPI, APIRouter, HTTPException, Depends, UploadFile, File, Form, Header
from fastapi.staticfiles import StaticFiles
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
from pathlib import Path
from pydantic import BaseModel, Field, ConfigDict, EmailStr
from typing import List, Optional
import uuid
from datetime import datetime, timezone, timedelta
import jwt
import bcrypt
import shutil

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# Create uploads directory
UPLOAD_DIR = ROOT_DIR / "uploads"
UPLOAD_DIR.mkdir(exist_ok=True)

# MongoDB connection
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

# JWT Configuration
JWT_SECRET = os.environ.get('JWT_SECRET', 'ikthees-partners-secret-key-2024')
JWT_ALGORITHM = "HS256"
JWT_EXPIRATION_HOURS = 24

# Create the main app
app = FastAPI()

# Create routers
api_router = APIRouter(prefix="/api")
admin_router = APIRouter(prefix="/api/admin")

# ============== MODELS ==============

# Auth Models
class AdminUser(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    email: EmailStr
    password_hash: str
    reset_token: Optional[str] = None
    reset_token_expires: Optional[datetime] = None
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class LoginRequest(BaseModel):
    email: EmailStr
    password: str

class LoginResponse(BaseModel):
    token: str
    email: str

class ChangePasswordRequest(BaseModel):
    current_password: str
    new_password: str

class ResetPasswordRequest(BaseModel):
    email: EmailStr

class ResetPasswordConfirm(BaseModel):
    token: str
    new_password: str

# Contact Models
class ContactSubmission(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    name: str
    email: EmailStr
    company: Optional[str] = None
    inquiry_type: str
    message: str
    is_read: bool = False
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class ContactSubmissionCreate(BaseModel):
    name: str
    email: EmailStr
    company: Optional[str] = None
    inquiry_type: str
    message: str

# Pitch Models
class PitchSubmission(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    founder_name: str
    email: EmailStr
    company_name: str
    website: Optional[str] = None
    industry: str
    funding_stage: str
    description: str
    deck_url: Optional[str] = None
    status: str = "pending"  # pending, reviewed, contacted, rejected
    notes: Optional[str] = None
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class PitchSubmissionCreate(BaseModel):
    founder_name: str
    email: EmailStr
    company_name: str
    website: Optional[str] = None
    industry: str
    funding_stage: str
    description: str
    deck_url: Optional[str] = None

class PitchStatusUpdate(BaseModel):
    status: str
    notes: Optional[str] = None

# Newsletter Models
class NewsletterSubscription(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    email: EmailStr
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class NewsletterSubscriptionCreate(BaseModel):
    email: EmailStr

# Portfolio Models
class PortfolioCompany(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    name: str
    sector: str
    description: str
    stage: str
    year: int
    website: Optional[str] = None
    logo_url: Optional[str] = None
    is_featured: bool = False
    order: int = 0
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class PortfolioCompanyCreate(BaseModel):
    name: str
    sector: str
    description: str
    stage: str
    year: int
    website: Optional[str] = None
    logo_url: Optional[str] = None
    is_featured: bool = False
    order: int = 0

class PortfolioCompanyUpdate(BaseModel):
    name: Optional[str] = None
    sector: Optional[str] = None
    description: Optional[str] = None
    stage: Optional[str] = None
    year: Optional[int] = None
    website: Optional[str] = None
    logo_url: Optional[str] = None
    is_featured: Optional[bool] = None
    order: Optional[int] = None

# Team Models
class TeamMember(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    name: str
    title: str
    bio: str
    linkedin: Optional[str] = None
    image_url: Optional[str] = None
    is_advisor: bool = False
    order: int = 0
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class TeamMemberCreate(BaseModel):
    name: str
    title: str
    bio: str
    linkedin: Optional[str] = None
    image_url: Optional[str] = None
    is_advisor: bool = False
    order: int = 0

class TeamMemberUpdate(BaseModel):
    name: Optional[str] = None
    title: Optional[str] = None
    bio: Optional[str] = None
    linkedin: Optional[str] = None
    image_url: Optional[str] = None
    is_advisor: Optional[bool] = None
    order: Optional[int] = None

# Insights Models
class Insight(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    title: str
    excerpt: str
    content: str
    category: str
    image_url: Optional[str] = None
    read_time: str = "5 min"
    is_published: bool = True
    is_featured: bool = False
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    published_at: Optional[datetime] = None

class InsightCreate(BaseModel):
    title: str
    excerpt: str
    content: str
    category: str
    image_url: Optional[str] = None
    read_time: str = "5 min"
    is_published: bool = True
    is_featured: bool = False

class InsightUpdate(BaseModel):
    title: Optional[str] = None
    excerpt: Optional[str] = None
    content: Optional[str] = None
    category: Optional[str] = None
    image_url: Optional[str] = None
    read_time: Optional[str] = None
    is_published: Optional[bool] = None
    is_featured: Optional[bool] = None

# Site Settings Models
class SiteSettings(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = "site_settings"
    portfolio_companies: int = 42
    capital_deployed: str = "$850M"
    industries: int = 8
    countries: int = 12
    successful_exits: int = 6
    average_moic: str = "3.2x"
    company_email: str = "contact@ikthees.com"
    company_location: str = "Houston, Texas"
    updated_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class SiteSettingsUpdate(BaseModel):
    portfolio_companies: Optional[int] = None
    capital_deployed: Optional[str] = None
    industries: Optional[int] = None
    countries: Optional[int] = None
    successful_exits: Optional[int] = None
    average_moic: Optional[str] = None
    company_email: Optional[str] = None
    company_location: Optional[str] = None

# ============== HELPER FUNCTIONS ==============

def hash_password(password: str) -> str:
    return bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')

def verify_password(password: str, hashed: str) -> bool:
    return bcrypt.checkpw(password.encode('utf-8'), hashed.encode('utf-8'))

def create_token(email: str) -> str:
    payload = {
        "email": email,
        "exp": datetime.now(timezone.utc) + timedelta(hours=JWT_EXPIRATION_HOURS)
    }
    return jwt.encode(payload, JWT_SECRET, algorithm=JWT_ALGORITHM)

def verify_token(token: str) -> Optional[str]:
    try:
        payload = jwt.decode(token, JWT_SECRET, algorithms=[JWT_ALGORITHM])
        return payload.get("email")
    except jwt.ExpiredSignatureError:
        return None
    except jwt.InvalidTokenError:
        return None

async def get_current_admin(authorization: str = Header(None)) -> str:
    if not authorization or not authorization.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Not authenticated")
    token = authorization.split(" ")[1]
    email = verify_token(token)
    if not email:
        raise HTTPException(status_code=401, detail="Invalid or expired token")
    admin = await db.admin_users.find_one({"email": email}, {"_id": 0})
    if not admin:
        raise HTTPException(status_code=401, detail="Admin not found")
    return email

# ============== INITIALIZE DEFAULT ADMIN ==============

async def init_default_admin():
    existing = await db.admin_users.find_one({"email": "admin@ikthees.com"}, {"_id": 0})
    if not existing:
        admin = AdminUser(
            email="admin@ikthees.com",
            password_hash=hash_password("Admin123!")
        )
        doc = admin.model_dump()
        doc['created_at'] = doc['created_at'].isoformat()
        await db.admin_users.insert_one(doc)
        logging.info("Default admin user created")

async def init_default_settings():
    existing = await db.site_settings.find_one({"id": "site_settings"}, {"_id": 0})
    if not existing:
        settings = SiteSettings()
        doc = settings.model_dump()
        doc['updated_at'] = doc['updated_at'].isoformat()
        await db.site_settings.insert_one(doc)
        logging.info("Default site settings created")

async def init_default_data():
    # Initialize portfolio if empty
    portfolio_count = await db.portfolio.count_documents({})
    if portfolio_count == 0:
        default_portfolio = [
            {"id": str(uuid.uuid4()), "name": "NeuralPath AI", "sector": "Artificial Intelligence", "description": "Enterprise AI platform automating complex business workflows", "stage": "Series A", "year": 2023, "order": 1, "is_featured": True},
            {"id": str(uuid.uuid4()), "name": "FinStack", "sector": "Fintech", "description": "Next-generation payment infrastructure for emerging markets", "stage": "Seed", "year": 2024, "order": 2, "is_featured": True},
            {"id": str(uuid.uuid4()), "name": "GreenGrid", "sector": "Climate Tech", "description": "AI-powered renewable energy grid optimization", "stage": "Series A", "year": 2023, "order": 3, "is_featured": True},
            {"id": str(uuid.uuid4()), "name": "HealthSync", "sector": "Healthcare", "description": "Unified patient data platform for healthcare providers", "stage": "Series B", "year": 2022, "order": 4, "is_featured": True},
            {"id": str(uuid.uuid4()), "name": "CloudNative", "sector": "Enterprise Software", "description": "Zero-trust security infrastructure for cloud-native applications", "stage": "Seed", "year": 2024, "order": 5, "is_featured": False},
            {"id": str(uuid.uuid4()), "name": "BioGenix", "sector": "Biotech", "description": "Computational biology platform for drug discovery", "stage": "Pre-Seed", "year": 2024, "order": 6, "is_featured": False}
        ]
        for p in default_portfolio:
            p['created_at'] = datetime.now(timezone.utc).isoformat()
        await db.portfolio.insert_many(default_portfolio)
        logging.info("Default portfolio created")

    # Initialize team if empty
    team_count = await db.team.count_documents({})
    if team_count == 0:
        default_team = [
            {"id": str(uuid.uuid4()), "name": "Alexander Chen", "title": "Managing Partner", "bio": "20+ years in venture capital. Former Goldman Sachs partner. Stanford MBA.", "linkedin": "https://linkedin.com", "image_url": "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=face", "is_advisor": False, "order": 1},
            {"id": str(uuid.uuid4()), "name": "Sarah Mitchell", "title": "Investment Partner", "bio": "Former CTO at Series D startup. Deep expertise in AI/ML infrastructure.", "linkedin": "https://linkedin.com", "image_url": "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&h=400&fit=crop&crop=face", "is_advisor": False, "order": 2},
            {"id": str(uuid.uuid4()), "name": "Marcus Thompson", "title": "Investment Partner", "bio": "15 years fintech experience. Led 3 unicorn investments.", "linkedin": "https://linkedin.com", "image_url": "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop&crop=face", "is_advisor": False, "order": 3},
            {"id": str(uuid.uuid4()), "name": "Emily Rodriguez", "title": "Venture Associate", "bio": "Former product lead at Stripe. Harvard Business School.", "linkedin": "https://linkedin.com", "image_url": "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400&h=400&fit=crop&crop=face", "is_advisor": False, "order": 4}
        ]
        for t in default_team:
            t['created_at'] = datetime.now(timezone.utc).isoformat()
        await db.team.insert_many(default_team)
        logging.info("Default team created")

    # Initialize insights if empty
    insights_count = await db.insights.count_documents({})
    if insights_count == 0:
        default_insights = [
            {"id": str(uuid.uuid4()), "title": "The Next Wave of AI Infrastructure", "excerpt": "How foundational AI models are reshaping enterprise software architecture.", "content": "Full article content here...", "category": "Market Analysis", "read_time": "8 min", "is_published": True, "is_featured": True},
            {"id": str(uuid.uuid4()), "title": "Climate Innovation and Venture Capital", "excerpt": "The investment thesis behind climate tech and sustainable infrastructure.", "content": "Full article content here...", "category": "Technology Trends", "read_time": "6 min", "is_published": True, "is_featured": False},
            {"id": str(uuid.uuid4()), "title": "Building Resilient Startups in Emerging Markets", "excerpt": "Lessons from founders navigating uncertainty and scaling globally.", "content": "Full article content here...", "category": "Founder Interviews", "read_time": "10 min", "is_published": True, "is_featured": False},
            {"id": str(uuid.uuid4()), "title": "Portfolio Update: Q4 2024", "excerpt": "Key milestones and updates from our portfolio companies.", "content": "Full article content here...", "category": "Portfolio Updates", "read_time": "5 min", "is_published": True, "is_featured": False}
        ]
        for i in default_insights:
            i['created_at'] = datetime.now(timezone.utc).isoformat()
            i['published_at'] = datetime.now(timezone.utc).isoformat()
        await db.insights.insert_many(default_insights)
        logging.info("Default insights created")

@app.on_event("startup")
async def startup_event():
    await init_default_admin()
    await init_default_settings()
    await init_default_data()

# ============== PUBLIC API ROUTES ==============

@api_router.get("/")
async def root():
    return {"message": "IKTHEES PARTNERS API"}

@api_router.get("/credits")
async def get_credits():
    return {
        "designed_by": "Pankaj Maurya",
        "website": "https://pankajmaurya.com",
        "message": "Designed and Developed by Pankaj Maurya"
    }

@api_router.get("/health")
async def health_check():
    return {"status": "healthy"}

# Contact submissions (public)
@api_router.post("/contact", response_model=ContactSubmission)
async def create_contact_submission(input: ContactSubmissionCreate):
    submission = ContactSubmission(**input.model_dump())
    doc = submission.model_dump()
    doc['created_at'] = doc['created_at'].isoformat()
    await db.contact_submissions.insert_one(doc)
    return submission

# Pitch submissions (public)
@api_router.post("/pitch", response_model=PitchSubmission)
async def create_pitch_submission(input: PitchSubmissionCreate):
    submission = PitchSubmission(**input.model_dump())
    doc = submission.model_dump()
    doc['created_at'] = doc['created_at'].isoformat()
    await db.pitch_submissions.insert_one(doc)
    return submission

# Newsletter (public)
@api_router.post("/newsletter", response_model=NewsletterSubscription)
async def create_newsletter_subscription(input: NewsletterSubscriptionCreate):
    existing = await db.newsletter_subscriptions.find_one({"email": input.email}, {"_id": 0})
    if existing:
        raise HTTPException(status_code=400, detail="Email already subscribed")
    subscription = NewsletterSubscription(**input.model_dump())
    doc = subscription.model_dump()
    doc['created_at'] = doc['created_at'].isoformat()
    await db.newsletter_subscriptions.insert_one(doc)
    return subscription

# Portfolio (public)
@api_router.get("/portfolio")
async def get_portfolio():
    portfolio = await db.portfolio.find({}, {"_id": 0}).sort("order", 1).to_list(100)
    return portfolio

# Team (public)
@api_router.get("/team")
async def get_team():
    team = await db.team.find({"is_advisor": False}, {"_id": 0}).sort("order", 1).to_list(100)
    return team

@api_router.get("/advisors")
async def get_advisors():
    advisors = await db.team.find({"is_advisor": True}, {"_id": 0}).sort("order", 1).to_list(100)
    return advisors

# Insights (public)
@api_router.get("/insights")
async def get_insights():
    insights = await db.insights.find({"is_published": True}, {"_id": 0}).sort("created_at", -1).to_list(100)
    for insight in insights:
        insight['date'] = insight.get('published_at', insight.get('created_at', ''))[:10]
    return insights

# Stats (public)
@api_router.get("/stats")
async def get_stats():
    settings = await db.site_settings.find_one({"id": "site_settings"}, {"_id": 0})
    if not settings:
        settings = SiteSettings().model_dump()
    return {
        "portfolio_companies": settings.get("portfolio_companies", 42),
        "capital_deployed": settings.get("capital_deployed", "$850M"),
        "industries": settings.get("industries", 8),
        "countries": settings.get("countries", 12)
    }

# ============== ADMIN AUTH ROUTES ==============

@admin_router.post("/login", response_model=LoginResponse)
async def admin_login(request: LoginRequest):
    admin = await db.admin_users.find_one({"email": request.email}, {"_id": 0})
    if not admin or not verify_password(request.password, admin['password_hash']):
        raise HTTPException(status_code=401, detail="Invalid email or password")
    token = create_token(request.email)
    return LoginResponse(token=token, email=request.email)

@admin_router.post("/reset-password-request")
async def request_password_reset(request: ResetPasswordRequest):
    admin = await db.admin_users.find_one({"email": request.email}, {"_id": 0})
    if not admin:
        # Don't reveal if email exists
        return {"message": "If the email exists, a reset token has been generated"}
    
    reset_token = str(uuid.uuid4())
    expires = datetime.now(timezone.utc) + timedelta(hours=1)
    
    await db.admin_users.update_one(
        {"email": request.email},
        {"$set": {"reset_token": reset_token, "reset_token_expires": expires.isoformat()}}
    )
    
    # In production, send email. For now, return token (for demo purposes)
    return {"message": "Reset token generated", "reset_token": reset_token}

@admin_router.post("/reset-password-confirm")
async def confirm_password_reset(request: ResetPasswordConfirm):
    admin = await db.admin_users.find_one({"reset_token": request.token}, {"_id": 0})
    if not admin:
        raise HTTPException(status_code=400, detail="Invalid reset token")
    
    expires = admin.get('reset_token_expires')
    if expires:
        if isinstance(expires, str):
            expires = datetime.fromisoformat(expires)
        if expires < datetime.now(timezone.utc):
            raise HTTPException(status_code=400, detail="Reset token has expired")
    
    new_hash = hash_password(request.new_password)
    await db.admin_users.update_one(
        {"reset_token": request.token},
        {"$set": {"password_hash": new_hash, "reset_token": None, "reset_token_expires": None}}
    )
    
    return {"message": "Password has been reset successfully"}

@admin_router.post("/change-password")
async def change_password(request: ChangePasswordRequest, email: str = Depends(get_current_admin)):
    admin = await db.admin_users.find_one({"email": email}, {"_id": 0})
    
    if not verify_password(request.current_password, admin['password_hash']):
        raise HTTPException(status_code=400, detail="Current password is incorrect")
    
    new_hash = hash_password(request.new_password)
    await db.admin_users.update_one(
        {"email": email},
        {"$set": {"password_hash": new_hash}}
    )
    
    return {"message": "Password changed successfully"}

@admin_router.get("/me")
async def get_admin_me(email: str = Depends(get_current_admin)):
    return {"email": email}

# ============== ADMIN DASHBOARD ROUTES ==============

@admin_router.get("/dashboard")
async def get_dashboard_stats(email: str = Depends(get_current_admin)):
    
    portfolio_count = await db.portfolio.count_documents({})
    team_count = await db.team.count_documents({})
    insights_count = await db.insights.count_documents({})
    contact_count = await db.contact_submissions.count_documents({})
    contact_unread = await db.contact_submissions.count_documents({"is_read": False})
    pitch_count = await db.pitch_submissions.count_documents({})
    pitch_pending = await db.pitch_submissions.count_documents({"status": "pending"})
    newsletter_count = await db.newsletter_subscriptions.count_documents({})
    
    recent_contacts = await db.contact_submissions.find({}, {"_id": 0}).sort("created_at", -1).limit(5).to_list(5)
    recent_pitches = await db.pitch_submissions.find({}, {"_id": 0}).sort("created_at", -1).limit(5).to_list(5)
    
    return {
        "portfolio_count": portfolio_count,
        "team_count": team_count,
        "insights_count": insights_count,
        "contact_count": contact_count,
        "contact_unread": contact_unread,
        "pitch_count": pitch_count,
        "pitch_pending": pitch_pending,
        "newsletter_count": newsletter_count,
        "recent_contacts": recent_contacts,
        "recent_pitches": recent_pitches
    }

# ============== ADMIN PORTFOLIO CRUD ==============

@admin_router.get("/portfolio")
async def admin_get_portfolio(_: str = Depends(get_current_admin)):
    
    portfolio = await db.portfolio.find({}, {"_id": 0}).sort("order", 1).to_list(100)
    return portfolio

@admin_router.post("/portfolio")
async def admin_create_portfolio(input: PortfolioCompanyCreate, _: str = Depends(get_current_admin)):
    
    company = PortfolioCompany(**input.model_dump())
    doc = company.model_dump()
    doc['created_at'] = doc['created_at'].isoformat()
    await db.portfolio.insert_one(doc)
    return company

@admin_router.put("/portfolio/{company_id}")
async def admin_update_portfolio(company_id: str, input: PortfolioCompanyUpdate, _: str = Depends(get_current_admin)):
    
    update_data = {k: v for k, v in input.model_dump().items() if v is not None}
    if not update_data:
        raise HTTPException(status_code=400, detail="No data to update")
    result = await db.portfolio.update_one({"id": company_id}, {"$set": update_data})
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Company not found")
    updated = await db.portfolio.find_one({"id": company_id}, {"_id": 0})
    return updated

@admin_router.delete("/portfolio/{company_id}")
async def admin_delete_portfolio(company_id: str, _: str = Depends(get_current_admin)):
    
    result = await db.portfolio.delete_one({"id": company_id})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Company not found")
    return {"message": "Company deleted successfully"}

# ============== ADMIN TEAM CRUD ==============

@admin_router.get("/team")
async def admin_get_team(_: str = Depends(get_current_admin)):
    
    team = await db.team.find({}, {"_id": 0}).sort("order", 1).to_list(100)
    return team

@admin_router.post("/team")
async def admin_create_team(input: TeamMemberCreate, _: str = Depends(get_current_admin)):
    
    member = TeamMember(**input.model_dump())
    doc = member.model_dump()
    doc['created_at'] = doc['created_at'].isoformat()
    await db.team.insert_one(doc)
    return member

@admin_router.put("/team/{member_id}")
async def admin_update_team(member_id: str, input: TeamMemberUpdate, _: str = Depends(get_current_admin)):
    
    update_data = {k: v for k, v in input.model_dump().items() if v is not None}
    if not update_data:
        raise HTTPException(status_code=400, detail="No data to update")
    result = await db.team.update_one({"id": member_id}, {"$set": update_data})
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Team member not found")
    updated = await db.team.find_one({"id": member_id}, {"_id": 0})
    return updated

@admin_router.delete("/team/{member_id}")
async def admin_delete_team(member_id: str, _: str = Depends(get_current_admin)):
    
    result = await db.team.delete_one({"id": member_id})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Team member not found")
    return {"message": "Team member deleted successfully"}

# ============== ADMIN INSIGHTS CRUD ==============

@admin_router.get("/insights")
async def admin_get_insights(_: str = Depends(get_current_admin)):
    
    insights = await db.insights.find({}, {"_id": 0}).sort("created_at", -1).to_list(100)
    return insights

@admin_router.get("/insights/{insight_id}")
async def admin_get_insight(insight_id: str, _: str = Depends(get_current_admin)):
    
    insight = await db.insights.find_one({"id": insight_id}, {"_id": 0})
    if not insight:
        raise HTTPException(status_code=404, detail="Insight not found")
    return insight

@admin_router.post("/insights")
async def admin_create_insight(input: InsightCreate, _: str = Depends(get_current_admin)):
    
    insight = Insight(**input.model_dump())
    if input.is_published:
        insight.published_at = datetime.now(timezone.utc)
    doc = insight.model_dump()
    doc['created_at'] = doc['created_at'].isoformat()
    if doc.get('published_at'):
        doc['published_at'] = doc['published_at'].isoformat()
    await db.insights.insert_one(doc)
    return insight

@admin_router.put("/insights/{insight_id}")
async def admin_update_insight(insight_id: str, input: InsightUpdate, _: str = Depends(get_current_admin)):
    
    update_data = {k: v for k, v in input.model_dump().items() if v is not None}
    if not update_data:
        raise HTTPException(status_code=400, detail="No data to update")
    
    # Set published_at if publishing for first time
    if update_data.get('is_published'):
        existing = await db.insights.find_one({"id": insight_id}, {"_id": 0})
        if existing and not existing.get('published_at'):
            update_data['published_at'] = datetime.now(timezone.utc).isoformat()
    
    result = await db.insights.update_one({"id": insight_id}, {"$set": update_data})
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Insight not found")
    updated = await db.insights.find_one({"id": insight_id}, {"_id": 0})
    return updated

@admin_router.delete("/insights/{insight_id}")
async def admin_delete_insight(insight_id: str, _: str = Depends(get_current_admin)):
    
    result = await db.insights.delete_one({"id": insight_id})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Insight not found")
    return {"message": "Insight deleted successfully"}

# ============== ADMIN CONTACT SUBMISSIONS ==============

@admin_router.get("/contacts")
async def admin_get_contacts(_: str = Depends(get_current_admin)):
    
    contacts = await db.contact_submissions.find({}, {"_id": 0}).sort("created_at", -1).to_list(1000)
    return contacts

@admin_router.get("/contacts/{contact_id}")
async def admin_get_contact(contact_id: str, _: str = Depends(get_current_admin)):
    
    contact = await db.contact_submissions.find_one({"id": contact_id}, {"_id": 0})
    if not contact:
        raise HTTPException(status_code=404, detail="Contact not found")
    # Mark as read
    await db.contact_submissions.update_one({"id": contact_id}, {"$set": {"is_read": True}})
    contact['is_read'] = True
    return contact

@admin_router.delete("/contacts/{contact_id}")
async def admin_delete_contact(contact_id: str, _: str = Depends(get_current_admin)):
    
    result = await db.contact_submissions.delete_one({"id": contact_id})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Contact not found")
    return {"message": "Contact deleted successfully"}

# ============== ADMIN PITCH SUBMISSIONS ==============

@admin_router.get("/pitches")
async def admin_get_pitches(_: str = Depends(get_current_admin)):
    
    pitches = await db.pitch_submissions.find({}, {"_id": 0}).sort("created_at", -1).to_list(1000)
    return pitches

@admin_router.get("/pitches/{pitch_id}")
async def admin_get_pitch(pitch_id: str, _: str = Depends(get_current_admin)):
    
    pitch = await db.pitch_submissions.find_one({"id": pitch_id}, {"_id": 0})
    if not pitch:
        raise HTTPException(status_code=404, detail="Pitch not found")
    return pitch

@admin_router.put("/pitches/{pitch_id}/status")
async def admin_update_pitch_status(pitch_id: str, input: PitchStatusUpdate, _: str = Depends(get_current_admin)):
    
    update_data = {"status": input.status}
    if input.notes is not None:
        update_data["notes"] = input.notes
    result = await db.pitch_submissions.update_one({"id": pitch_id}, {"$set": update_data})
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Pitch not found")
    updated = await db.pitch_submissions.find_one({"id": pitch_id}, {"_id": 0})
    return updated

@admin_router.delete("/pitches/{pitch_id}")
async def admin_delete_pitch(pitch_id: str, _: str = Depends(get_current_admin)):
    
    result = await db.pitch_submissions.delete_one({"id": pitch_id})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Pitch not found")
    return {"message": "Pitch deleted successfully"}

# ============== ADMIN NEWSLETTER ==============

@admin_router.get("/newsletter")
async def admin_get_newsletter(_: str = Depends(get_current_admin)):
    
    subscribers = await db.newsletter_subscriptions.find({}, {"_id": 0}).sort("created_at", -1).to_list(10000)
    return subscribers

@admin_router.delete("/newsletter/{subscription_id}")
async def admin_delete_newsletter(subscription_id: str, _: str = Depends(get_current_admin)):
    
    result = await db.newsletter_subscriptions.delete_one({"id": subscription_id})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Subscription not found")
    return {"message": "Subscription deleted successfully"}

# ============== ADMIN SITE SETTINGS ==============

@admin_router.get("/settings")
async def admin_get_settings(_: str = Depends(get_current_admin)):
    
    settings = await db.site_settings.find_one({"id": "site_settings"}, {"_id": 0})
    if not settings:
        settings = SiteSettings().model_dump()
    return settings

@admin_router.put("/settings")
async def admin_update_settings(input: SiteSettingsUpdate, _: str = Depends(get_current_admin)):
    
    update_data = {k: v for k, v in input.model_dump().items() if v is not None}
    update_data['updated_at'] = datetime.now(timezone.utc).isoformat()
    
    await db.site_settings.update_one(
        {"id": "site_settings"},
        {"$set": update_data},
        upsert=True
    )
    
    updated = await db.site_settings.find_one({"id": "site_settings"}, {"_id": 0})
    return updated

# ============== FILE UPLOAD ==============

@admin_router.post("/upload")
async def upload_file(file: UploadFile = File(...), _: str = Depends(get_current_admin)):
    
    
    # Validate file type
    allowed_types = ['image/jpeg', 'image/png', 'image/gif', 'image/webp']
    if file.content_type not in allowed_types:
        raise HTTPException(status_code=400, detail="Invalid file type. Allowed: JPEG, PNG, GIF, WebP")
    
    # Generate unique filename
    ext = file.filename.split('.')[-1] if '.' in file.filename else 'jpg'
    filename = f"{uuid.uuid4()}.{ext}"
    filepath = UPLOAD_DIR / filename
    
    # Save file
    with open(filepath, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)
    
    # Return URL
    return {"url": f"/api/uploads/{filename}", "filename": filename}

# ============== INCLUDE ROUTERS ==============

app.include_router(api_router)
app.include_router(admin_router)

# Mount static files for uploads
app.mount("/api/uploads", StaticFiles(directory=str(UPLOAD_DIR)), name="uploads")

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get('CORS_ORIGINS', '*').split(','),
    allow_methods=["*"],
    allow_headers=["*"],
)

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()
