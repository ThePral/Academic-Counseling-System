from pydantic import BaseModel, EmailStr,  validator
from enum import Enum
from typing import Optional
from datetime import datetime
import re

class RoleEnum(str, Enum):
    student = "student"
    admin = "admin"
    counselor = "counselor"

class UserCreate(BaseModel):
    firstname: str
    lastname: str
    email: EmailStr
    phone_number: Optional[str]
    password: str
    role: RoleEnum
    @validator('password')
    def password_complexity(cls, v):
        if len(v) < 8:
            raise ValueError('Password must be at least 8 characters long')
        if not re.search(r'[A-Z]', v):
            raise ValueError('Password must contain at least one uppercase letter')
        if not re.search(r'[a-z]', v):
            raise ValueError('Password must contain at least one lowercase letter')
        if not re.search(r'\d', v):
            raise ValueError('Password must contain at least one digit')
        if not re.search(r'[!@#$%^&*(),.?":{}|<>]', v):
            raise ValueError('Password must contain at least one special character')
        return v  
    @validator('phone_number')
    def validate_phone_number(cls, v):
        if v is None:
            return v
        if not re.fullmatch(r'09\d{9}', v):
            raise ValueError('Phone number must start with "09" and be exactly 11 digits')
        return v  

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class Token(BaseModel):
    access_token: str
    refresh_token: str

class UserOut(BaseModel):
    userid: int
    firstname: str
    lastname: str
    email: EmailStr
    phone_number: Optional[str]
    role: RoleEnum
    registrationDate: datetime

    class Config:
        from_attributes = True 


class StudentCreate(BaseModel):
    major: str
    academic_year: str
    gpa: float



class CounselorCreate(BaseModel):
    department: str
    available_slots: int


class StudentOut(BaseModel):
    student_id: int
    major: Optional[str] 
    academic_year: Optional[str]  
    gpa: Optional[float]
    
    firstname: str
    lastname: str
    email: str
    phone_number: Optional[str]
    role: str
    registrationDate: datetime

    class Config:
        from_attributes = True

class CounselorOut(BaseModel):
    counselor_id: int
    department: Optional[str] 
    available_slots: Optional[int]  
   
    firstname: str
    lastname: str
    email: str
    phone_number: Optional[str]
    role: str
    registrationDate: datetime

    class Config:
        from_attributes = True

        
class UserUpdate(BaseModel):
    firstname: Optional[str]
    lastname: Optional[str]
    email: Optional[EmailStr]
    phone_number: Optional[str]

    class Config:
        from_attributes = True

class StudentUpdate(BaseModel):
    major: Optional[str]
    academic_year: Optional[str]
    gpa: Optional[float]
    firstname: Optional[str] 
    lastname: Optional[str]  
    email: Optional[EmailStr] 
    phone_number: Optional[str] 
class CounselorUpdate(UserUpdate):
    department: Optional[str]
    available_slots: Optional[int]

    class Config:
        from_attributes = True
