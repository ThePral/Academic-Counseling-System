from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app import crud, schemas, auth, models
from app.database import get_db

router = APIRouter(
    prefix="/appointments",
    tags=["appointments"]
)

@router.post("/book/", response_model=schemas.AppointmentOut)
def book_appointment(
    data: schemas.AppointmentCreate,
    db: Session = Depends(get_db),
    payload: dict = Depends(auth.JWTBearer())
):
    user_id = int(payload.get("sub"))
    student = db.query(models.Student).filter(models.Student.user_id == user_id).first()
    return crud.create_appointment(db, student_id=student.student_id, slot_id=data.slot_id, notes=data.notes)

@router.post("/{appointment_id}/approve", response_model=schemas.AppointmentOut)
def approve_appointment(
    appointment_id: int,
    db: Session = Depends(get_db),
    payload: dict = Depends(auth.JWTBearer())
):
    user_id = int(payload.get("sub"))
    user = crud.get_user_by_id(db, user_id)
    if user.role != models.RoleEnum.counselor:
        raise HTTPException(403, "Only counselors can approve appointments")
    return crud.approve_appointment(db, appointment_id)

@router.delete("/{appointment_id}/cancel")
def cancel_appointment(
    appointment_id: int,
    db: Session = Depends(get_db),
    payload: dict = Depends(auth.JWTBearer())
):
    return crud.cancel_appointment(db, appointment_id)