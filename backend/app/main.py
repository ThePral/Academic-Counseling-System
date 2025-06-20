from fastapi import FastAPI, Depends, HTTPException, status
from sqlalchemy.orm import Session
from .schemas import RoleEnum
from . import models, schemas, crud, auth
from .database import engine, get_db
from .models import Base, AvailableTimeSlot
from app.schemas import PasswordChangeRequest
from fastapi import UploadFile, File
from typing import List
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app import crud, schemas
from app.database import get_db
from app.models import RoleEnum
from app.auth import JWTBearer

Base.metadata.create_all(bind=engine)

app = FastAPI(title="Academic Counseling Auth API")

def is_admin(user_role: RoleEnum) -> bool:
    return user_role == RoleEnum.admin

def is_own_data(user_id: int, data_id: int) -> bool:
    return user_id == data_id



@app.post("/signup", response_model=schemas.UserOut, status_code=status.HTTP_201_CREATED)
def signup(user_in: schemas.UserCreate, db: Session = Depends(get_db)):
    user = crud.create_user(db, user_in) 

    if not user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email or phone number already registered"
        )
    return user


@app.post("/login", response_model=schemas.Token)
def login(form_data: schemas.UserLogin, db: Session = Depends(get_db)):
    user = crud.authenticate_user(db, form_data.email, form_data.password)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password"
        )
    access_token = auth.create_access_token(subject=user.userid, role=user.role)
    refresh_token = auth.create_refresh_token(subject=user.userid)
    return {"access_token": access_token, "refresh_token": refresh_token}

from app.schemas import PasswordChangeRequest

@app.post("/change-password")
def change_password(request: PasswordChangeRequest, db: Session = Depends(get_db)):
    user = crud.get_user_by_email(db, request.email)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    success = crud.change_user_password(db, request.email, request.new_password)
    if not success:
        raise HTTPException(status_code=500, detail="Password update failed")

    return {"message": "Password updated successfully"}

@app.post("/refresh", response_model=schemas.Token)
def refresh_token(token: schemas.Token, db: Session = Depends(get_db)):
    payload = auth.decode_token(token.refresh_token, refresh=True)
    if not payload:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid or expired refresh token"
        )
    user_id = int(payload.get("sub"))
    user = crud.get_user_by_id(db, user_id)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    new_access = auth.create_access_token(subject=user.userid, role=user.role)
    new_refresh = auth.create_refresh_token(subject=user.userid)
    return {"access_token": new_access, "refresh_token": new_refresh}


# read 
@app.get("/students/me", response_model=schemas.StudentOut)
def get_student_info(db: Session = Depends(get_db), payload: dict = Depends(auth.JWTBearer())):
    user_id = int(payload.get("sub"))
    user = crud.get_user_by_id(db, user_id)
    student = crud.get_student_by_user_id(db, user_id)
    
    if not student:
        raise HTTPException(status_code=404, detail="Student not found")
    
    student_data = {
            'firstname': user.firstname,
            'lastname': user.lastname,
            'email': user.email,
            'phone_number': student.phone_number,
            'province': student.province,
            'city': student.city,
            'academic_year':student.academic_year,
            'major': student.major,
            'gpa': student.gpa,
            'profile_image_url': user.profile_image_url
    }
    return schemas.StudentOut(**student_data)


@app.get("/counselors/me", response_model=schemas.CounselorOut)
def get_counselor_info(db: Session = Depends(get_db), payload: dict = Depends(auth.JWTBearer())):
    user_id = int(payload.get("sub"))
    user = crud.get_user_by_id(db, user_id)
    counselor = crud.get_counselor_by_user_id(db, user_id)

    if not counselor:
        raise HTTPException(status_code=404, detail="Counselor not found")

    counselor_data = {
        'firstname': user.firstname,
        'lastname': user.lastname,
        'email': user.email,
        'phone_number': counselor.phone_number,
        'province': counselor.province,
        'city': counselor.city,
        'department': counselor.department if counselor.department else None,
        'profile_image_url': user.profile_image_url
    }
    return schemas.CounselorOut(**counselor_data)



#update
@app.put("/students/me", response_model=schemas.StudentUpdate)
def update_student(student_in: schemas.StudentUpdate, db: Session = Depends(get_db), payload: dict = Depends(auth.JWTBearer())):
    user_id = int(payload.get("sub"))
    user = crud.get_user_by_id(db, user_id)
    student = crud.get_student_by_user_id(db, user_id)

    if not student:
        raise HTTPException(status_code=404, detail="Student not found")

    if is_admin(user.role) or is_own_data(user_id, student.user_id):
        student = crud.update_student_profile(db, student.student_id, student_in)
        user = crud.update_user_profile(db, user_id, student_in)
        student_data = {
           'firstname': user.firstname,
            'lastname': user.lastname,
            'email': user.email,
            'phone_number': student.phone_number,
            'province': student.province,
            'city': student.city,
            'academic_year': student.academic_year,
            'major': student.major,
            'gpa': student.gpa
        }

        return schemas.StudentUpdate(**student_data)
    else:
        raise HTTPException(status_code=403, detail="Permission denied")
    

@app.put("/counselors/me", response_model=schemas.CounselorUpdate)
def update_counselor(counselor_in: schemas.CounselorUpdate, db: Session = Depends(get_db), payload: dict = Depends(auth.JWTBearer())):
    user_id = int(payload.get("sub"))
    user = crud.get_user_by_id(db, user_id)
    counselor = crud.get_counselor_by_user_id(db, user_id)

    if not counselor:
        raise HTTPException(status_code=404, detail="Counselor not found")

    if is_admin(user.role) or is_own_data(user_id, counselor.user_id):
        counselor = crud.update_counselor_profile(db, counselor.user_id, counselor_in)
        user = crud.update_user_profile(db, user_id, counselor_in)
        counselor_data = {
            'firstname': user.firstname,
            'lastname': user.lastname,
            'email': user.email,
            'phone_number': counselor.phone_number,
            'province': counselor.province,
            'city': counselor.city,
            'department': counselor.department if counselor.department else None,
        }
        return schemas.CounselorUpdate(**counselor_data)
    else:
        raise HTTPException(status_code=403, detail="Permission denied")

  

@app.delete("/students/me", status_code=status.HTTP_204_NO_CONTENT) 
def delete_student(db: Session = Depends(get_db), payload: dict = Depends(auth.JWTBearer())):
    user_id = int(payload.get("sub"))
    user = crud.get_user_by_id(db, user_id)
    student = crud.get_student_by_user_id(db, user_id)
    
    if not student:
        raise HTTPException(status_code=404, detail="Student not found")
    
    if is_admin(user.role) :
        success = crud.delete_student(db, student.student_id)
        if not success:
            raise HTTPException(status_code=404, detail="Student not found")
        return {"message": "Student deleted"}
    else:
        raise HTTPException(status_code=403, detail="Permission denied")


@app.delete("/counselors/me", status_code=status.HTTP_204_NO_CONTENT)
def delete_counselor(db: Session = Depends(get_db), payload: dict = Depends(auth.JWTBearer())):
    user_id = int(payload.get("sub"))
    user = crud.get_user_by_id(db, user_id)
    counselor = crud.get_counselor_by_user_id(db, user_id)
    
    if not counselor:
        raise HTTPException(status_code=404, detail="Counselor not found")
    
    if is_admin(user.role) :
        success = crud.delete_counselor(db, counselor.counselor_id)
        if not success:
            raise HTTPException(status_code=404, detail="Counselor not found")
        return {"message": "Counselor deleted"}
    else:
        raise HTTPException(status_code=403, detail="Permission denied")
    
    
@app.put("/profile/upload", response_model=schemas.UserOut)
def upload_profile_image(file: UploadFile = File(...), db: Session = Depends(get_db), payload: dict = Depends(auth.JWTBearer())):
    user_id = int(payload.get("sub"))
    user = crud.update_user_profile_with_image(db, user_id, file)
    return user


@app.get("/counselors/", response_model=list[schemas.CounselorsDisplay])
def get_counselors(db: Session = Depends(get_db)):
    counselors = crud.get_all_counselors(db)
    if not counselors:
        raise HTTPException(status_code=404, detail="No counselors found")
    return counselors




@app.post("/counselors/time-slots")
def create_time_range(time_input: schemas.TimeRangeInput, db: Session = Depends(get_db), payload: dict = Depends(JWTBearer())):
    user_id = int(payload.get("sub"))
    counselor = crud.get_counselor_by_user_id(db, user_id)
    user = crud.get_user_by_id(db, user_id)
    
    if user.role != RoleEnum.counselor:
        raise HTTPException(403, "Only counselors can create slots")
    
    counselor = crud.get_counselor_by_user_id(db, user_id)
    if not counselor:
        raise HTTPException(404, "Counselor not found")

    if crud.check_range_overlap(db, counselor.counselor_id, time_input.date, time_input.from_time, time_input.to_time):
        raise HTTPException(400, "Overlapping time range")

    time_range, slots = crud.create_time_range_with_slots(
        db, counselor.counselor_id,
        time_input.date, time_input.from_time, time_input.to_time,
        time_input.duration_minutes
    )

    return {"range_id": time_range.id, "slot_count": len(slots)}


@app.get("/counselors/ranges", response_model=List[schemas.TimeRangeOut])
def get_my_ranges(db: Session = Depends(get_db), payload: dict = Depends(JWTBearer())):
    user_id = int(payload.get("sub"))
    counselor = crud.get_counselor_by_user_id(db, user_id)
    if not counselor:
        raise HTTPException(404, "Counselor not found")

    return crud.get_ranges_by_counselor(db, counselor.counselor_id)


@app.get("/counselors/ranges/{range_id}/slots", response_model=schemas.TimeRangeWithSlots)
def get_slots_for_range(range_id: int, db: Session = Depends(get_db)):
    range_obj = db.query(crud.CounselorTimeRange).filter_by(id=range_id).first()
    if not range_obj:
        raise HTTPException(404, "Time range not found")

    slots = crud.get_slots_by_range(db, range_id)
    return {
        "id": range_obj.id,
        "date": range_obj.date,
        "from_time": range_obj.from_time,
        "to_time": range_obj.to_time,
        "duration": range_obj.duration,
        "slots": slots
    }


@app.delete("/counselors/ranges/{range_id}")
def delete_time_range(range_id: int, db: Session = Depends(get_db)):
    success = crud.delete_range_by_id(db, range_id)
    if not success:
        raise HTTPException(404, "Range not found")
    return {"message": "Time range deleted"}


@app.delete("/counselors/slots/{slot_id}")
def delete_slot(slot_id: int, db: Session = Depends(get_db)):
    success = crud.delete_slot_by_id(db, slot_id)
    if not success:
        raise HTTPException(404, "Slot not found")
    return {"message": "Slot deleted"}


@app.post("/appointments/", response_model=schemas.AppointmentOut)
def book_appointment(data: schemas.AppointmentCreate, db: Session = Depends(get_db), payload: dict = Depends(JWTBearer())):
    user_id = int(payload.get("sub"))
    student = db.query(models.Student).filter(models.Student.user_id == user_id).first()
    return crud.create_appointment(db, student_id=student.student_id, slot_id=data.slot_id, notes=data.notes)


@app.post("/appointments/{appointment_id}/approve", response_model=schemas.AppointmentOut)
def approve_appointment(appointment_id: int, db: Session = Depends(get_db), payload: dict = Depends(JWTBearer())):
    user_id = int(payload.get("sub"))
    user = crud.get_user_by_id(db, user_id)
    
    if user.role != RoleEnum.counselor:
        raise HTTPException(403, "Only counselors can approve appointments")

    return crud.approve_appointment(db, appointment_id)


@app.delete("/appointments/{appointment_id}")
def cancel_appointment(appointment_id: int, db: Session = Depends(get_db), payload: dict = Depends(JWTBearer())):
    return crud.cancel_appointment(db, appointment_id)
