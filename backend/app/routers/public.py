from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app import crud, schemas
from app.database import get_db

router = APIRouter(
    prefix="/public",
    tags=["public"]
)

@router.get("/counselors/", response_model=list[schemas.CounselorsDisplay])
def get_all_counselors(db: Session = Depends(get_db)):
    counselors = crud.get_all_counselors(db)
    if not counselors:
        raise HTTPException(status_code=404, detail="No counselors found")
    return counselors
