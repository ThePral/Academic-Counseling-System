from fastapi import APIRouter, Depends, HTTPException, UploadFile, File
from sqlalchemy.orm import Session
from app import crud, schemas, auth
from app.database import get_db

router = APIRouter(
    prefix="/counselors",
    tags=["counselors"]
)

@router.get("/me/", response_model=schemas.CounselorOut)
def get_counselor_info(
    db: Session = Depends(get_db),
    payload: dict = Depends(auth.JWTBearer())
):
    return crud.get_counselor_info(db, payload)

@router.get("/{counselor_id}/", response_model=schemas.CounselorOut)
def get_counselor_by_id(
    counselor_id: int,
    db: Session = Depends(get_db),
    payload: dict = Depends(auth.JWTBearer())
):
    return crud.get_counselor_by_id_service(db, counselor_id)

@router.get("/", response_model=list[schemas.CounselorsDisplay])
def get_counselors(db: Session = Depends(get_db)):
    counselors = crud.get_all_counselors(db)
    if not counselors:
        raise HTTPException(status_code=404, detail="No counselors found")
    return counselors

@router.put("/update-profile/", response_model=schemas.CounselorUpdate)
def update_counselor(
    counselor_in: schemas.CounselorUpdate,
    db: Session = Depends(get_db),
    payload: dict = Depends(auth.JWTBearer())
):
    return crud.update_counselor_profile_service(db, payload, counselor_in)

