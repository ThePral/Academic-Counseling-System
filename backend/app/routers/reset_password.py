# app/routers/password_reset.py
from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel, EmailStr, constr
from sqlalchemy.orm import Session
from app.schemas import ResetIn, SendCodeIn
from app.database import get_db
from app import crud
from app.utils.email import send_email
from app.utils import otp

router = APIRouter(
    prefix="/password-reset",
    tags=["password-reset"]
)

from dotenv import load_dotenv
load_dotenv()



# --------- Endpoints ----------
@router.post("/send-code", status_code=200)
def send_reset_code(data: SendCodeIn, db: Session = Depends(get_db)):
    user = crud.users_crud.get_user_by_email(db, data.email)
    
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    code = otp.generate_code(data.email)
    send_email(
        to_email=data.email,
        subject="کد بازیابی رمز عبور",
        body=(
            f"سلام {user.firstname},\n\n"
            f"کد بازیابی رمز عبور شما: {code}\n"
            f"این کد به مدت ۵ دقیقه معتبر است."
        )
        
    )
    return {"message": "Verification code sent to email"}

@router.post("/verify-and-reset", status_code=200)
def verify_and_reset(data: ResetIn, db: Session = Depends(get_db)):
    if not otp.verify_code(data.email, data.code):
        raise HTTPException(status_code=400, detail="Invalid or expired code")

    success = crud.users_crud.change_user_password(db, data.email, data.new_password)
    if not success:
        raise HTTPException(status_code=500, detail="Password reset failed")

    return {"message": "Password updated successfully"}
