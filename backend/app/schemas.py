from pydantic import BaseModel, EmailStr,  validator, Field, constr
from typing import Optional, List
from datetime import datetime
import re
from .models import RoleEnum, AppointmentStatus
from fastapi import UploadFile, File
from app.utils.datetime import jalali_to_gregorian



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
        
# schemas.py
from pydantic import BaseModel, validator
from datetime import date, time
from typing import List
from app.utils.datetime import jalali_to_gregorian


class TimeRangeInput(BaseModel):
    date: date
    from_time: time
    to_time: time
    duration_minutes: int

    @validator("date", pre=True)
    def convert_jalali(cls, v):
        if isinstance(v, str):
            return jalali_to_gregorian(v)
        return v


class TimeRangeOut(BaseModel):
    id: int
    date: date
    from_time: time
    to_time: time
    duration: int

    class Config:
        from_attributes = True


class SlotOut(BaseModel):
    id: int
    start_time: time
    end_time: time
    is_reserved: bool

    class Config:
        from_attributes = True


class TimeRangeWithSlots(BaseModel):
    id: int
    date: date
    from_time: time
    to_time: time
    duration: int
    slots: List[SlotOut]

    class Config:
        from_attributes = True



#appointment


class AppointmentCreate(BaseModel):
    slot_id: int
    notes: Optional[str] = None

class AppointmentOut(BaseModel):
    id: int
    student_id: int
    counselor_id: int
    slot_id: int
    date: date
    time: time   
    status: AppointmentStatus
    notes: Optional[str] = None

    class Config:
        from_attributes = True
        
        
from pydantic import  EmailStr, constr        
# --------- Schemas ----------
class SendCodeIn(BaseModel):
    email: EmailStr

class ResetIn(BaseModel):
    email: EmailStr
    code: constr(min_length=6, max_length=6)
    new_password: constr(min_length=8)
        