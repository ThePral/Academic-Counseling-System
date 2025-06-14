from pydantic import BaseModel, EmailStr,  validator, Field, constr
from typing import Optional, List
from datetime import datetime
import re
from .models import DayOfWeek, TimeSlot, RoleEnum
from fastapi import UploadFile, File


class PasswordChangeRequest(BaseModel):
    email: EmailStr
    new_password: constr(min_length=8)
    confirm_password: constr(min_length=8)

    @validator('confirm_password')
    def passwords_match(cls, v, values):
        if 'new_password' in values and v != values['new_password']:
            raise ValueError('Passwords do not match')
        return v
    
class UserCreate(BaseModel):
    firstname: str
    lastname: str
    email: EmailStr
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
    role: RoleEnum
    profile_image_url: Optional[str] = None  
    profile_image_filename: Optional[str] = None  
    registrationDate: datetime

    class Config:
        from_attributes = True


class StudentOut(BaseModel):
    firstname: str
    lastname: str
    email: str
    phone_number: Optional[str]
    province: Optional[str]
    city: Optional[str]
    academic_year: Optional[str]  
    major: Optional[str] 
    gpa: Optional[float]
    profile_image_url: Optional[str] = None
    
    class Config:
        from_attributes = True

class CounselorOut(BaseModel):
    firstname: str
    lastname: str
    email: str
    phone_number: Optional[str]
    province: Optional[str]
    city: Optional[str]
    department: Optional[str]
    profile_image_url: Optional[str] = None
    class Config:
        from_attributes = True

        
class UserUpdate(BaseModel):
    firstname: Optional[str]
    lastname: Optional[str]
    email: Optional[EmailStr]
    class Config:
        from_attributes = True

class StudentUpdate(BaseModel):
    firstname: Optional[str] 
    lastname: Optional[str]  
    email: Optional[EmailStr] 
    phone_number: Optional[str] 
    province: Optional[str]
    city: Optional[str] 
    academic_year: Optional[str]
    major: Optional[str]
    gpa: Optional[float]
    
    
class CounselorUpdate(UserUpdate):
    phone_number: Optional[str]
    province: Optional[str]
    city: Optional[str]
    department: Optional[str]
    
    class Config:
        from_attributes = True
        
        
class CounselorsDisplay(BaseModel):
    firstname: str
    lastname: str
    profile_image_url: Optional[str] = None
    class Config:
        from_attributes = True        
        
 
 
 
        
class CounselorAvailableSlotCreate(BaseModel):
    day: DayOfWeek
    slot: TimeSlot

class CounselorAvailableSlotOut(BaseModel):
    available_slots_id: int
    day: DayOfWeek
    slot: TimeSlot

    class Config:
        from_attributes = True
   

class CounselorAvailableSlotUpdate(BaseModel):
    day: Optional[DayOfWeek]
    slot: Optional[TimeSlot]
    
class CounselorAvailableSlotDelete(BaseModel):
    available_slots_id: int
    
