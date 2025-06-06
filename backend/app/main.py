from fastapi import FastAPI, Depends, HTTPException, status
from sqlalchemy.orm import Session
from .schemas import RoleEnum
from . import models, schemas, crud, auth
from .database import engine, get_db
from .models import Base

Base.metadata.create_all(bind=engine)

app = FastAPI(title="Academic Counseling Auth API")

def is_admin(user_role: RoleEnum) -> bool:
    return user_role == RoleEnum.admin

def is_own_data(user_id: int, data_id: int) -> bool:
    return user_id == data_id



@app.post("/signup", response_model=schemas.UserOut, status_code=status.HTTP_201_CREATED)
def signup(user_in: schemas.UserCreate, db: Session = Depends(get_db)):
    user = crud.create_user(db, user_in)
    print(f"Role being saved: {RoleEnum[user_in.role]}")

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
        'student_id': student.student_id,
        'major': student.major if student.major else None,
        'academic_year': student.academic_year if student.academic_year else None,
        'gpa': student.gpa if student.gpa else None,
        'firstname': user.firstname,
        'lastname': user.lastname,
        'email': user.email,
        'phone_number': user.phone_number,
        'role': user.role,
        'registrationDate': user.registrationDate
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
        'counselor_id': counselor.counselor_id,
        'department': counselor.department if counselor.department else None,
        'available_slots': counselor.available_slots if counselor.available_slots is not None else None,
        'firstname': user.firstname,
        'lastname': user.lastname,
        'email': user.email,
        'phone_number': user.phone_number,
        'role': user.role,
        'registrationDate': user.registrationDate
    }
    return schemas.CounselorOut(**counselor_data)


#update
@app.put("/students/me", response_model=schemas.StudentOut)
def update_student(student_in: schemas.StudentUpdate, db: Session = Depends(get_db), payload: dict = Depends(auth.JWTBearer())):
    user_id = int(payload.get("sub"))
    user = crud.get_user_by_id(db, user_id)
    student = crud.get_student_by_user_id(db, user_id)

    if not student:
        raise HTTPException(status_code=404, detail="Student not found")

    if is_admin(user.role) or is_own_data(user_id, student.user_id):
 
        updated_student = crud.update_student_profile(db, student.student_id, student_in)
        updated_user = crud.update_user_profile(db, user_id, student_in)

        student_data = {
            'student_id': updated_student.student_id,
            'major': updated_student.major,
            'academic_year': updated_student.academic_year,
            'gpa': updated_student.gpa,
            'firstname': updated_user.firstname,
            'lastname': updated_user.lastname,
            'email': updated_user.email,
            'phone_number': updated_user.phone_number,
            'role': updated_user.role,
            'registrationDate': updated_user.registrationDate
        }

        return schemas.StudentOut(**student_data)
    else:
        raise HTTPException(status_code=403, detail="Permission denied")

@app.put("/counselors/me", response_model=schemas.CounselorOut)
def update_counselor(counselor_in: schemas.CounselorUpdate, db: Session = Depends(get_db), payload: dict = Depends(auth.JWTBearer())):
    user_id = int(payload.get("sub"))
    user = crud.get_user_by_id(db, user_id)
    counselor = crud.get_counselor_by_user_id(db, user_id)

    if not counselor:
        raise HTTPException(status_code=404, detail="Counselor not found")

    if is_admin(user.role) or is_own_data(user_id, counselor.user_id):

        updated_counselor = crud.update_counselor_profile(db, counselor.user_id, counselor_in)
        updated_user = crud.update_user_profile(db, user_id, counselor_in)
        counselor_data = {
            'counselor_id': updated_counselor.counselor_id,
            'department': updated_counselor.department,
            'available_slots': updated_counselor.available_slots,
            'firstname': updated_user.firstname,
            'lastname': updated_user.lastname,
            'email': updated_user.email,
            'phone_number': updated_user.phone_number,
            'role': updated_user.role,
            'registrationDate': updated_user.registrationDate
        }
        return schemas.CounselorOut(**counselor_data)
    else:
        raise HTTPException(status_code=403, detail="Permission denied")
  
    
#delete

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
