from sqlalchemy import Column, Integer, String, Boolean, DateTime
from datetime import datetime
from database import Base

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True, nullable=False)
    password_hash = Column(String, nullable=False)
    full_name = Column(String, nullable=False)
    phone = Column(String, nullable=True)
    organization = Column(String, nullable=True)
    role = Column(String, default="Viewer") # Admin, Operator, Viewer
    is_active = Column(Boolean, default=True)

class AuditLog(Base):
    __tablename__ = "audit_logs"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, nullable=True) # can be null if action done before auth
    user_email = Column(String, nullable=True)
    action = Column(String, nullable=False)
    details = Column(String, nullable=True)
    timestamp = Column(DateTime, default=datetime.utcnow)
