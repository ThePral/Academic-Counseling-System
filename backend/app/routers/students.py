from fastapi import APIRouter, Depends, HTTPException, UploadFile, File
from sqlalchemy.orm import Session
from app import crud, schemas, auth
from app.database import get_db


router = APIRouter(
    prefix="/students",
    tags=["students"]
)

@router.get("/me/", response_model=schemas.StudentOut)
def get_student_info(
    db: Session = Depends(get_db),
    payload: dict = Depends(auth.JWTBearer())
):
    return crud.get_student_info(db, payload)

@router.put("/update-profile/", response_model=schemas.StudentUpdate)
def update_student(
    student_in: schemas.StudentUpdate,
    db: Session = Depends(get_db),
    payload: dict = Depends(auth.JWTBearer())
):
    return crud.update_student_profile_service(db, payload, student_in)

@router.put("/upload-profile/", response_model=schemas.UserOut)
def upload_profile_image(
    file: UploadFile = File(...),
    db: Session = Depends(get_db),
    payload: dict = Depends(auth.JWTBearer())
):
    user_id = int(payload.get("sub"))
    return crud.update_user_profile_with_image(db, user_id, file)
