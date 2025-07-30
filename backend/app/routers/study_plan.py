from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database import get_db
from app import crud
from app.schemas import StudyPlanCreate, StudentStatusSubmit, CounselorFeedback, ActivityStatusUpdate
from typing import List
from app.auth import JWTBearer
from app.models import Student


router = APIRouter(
    prefix="/study-plan",
    tags=["Study Plan"]
)


@router.post("/counselor/create")
def create_plan(
    data: StudyPlanCreate,
    db: Session = Depends(get_db),
    payload: dict = Depends(JWTBearer())
):
    counselor_user_id = payload["sub"]
    return crud.create_study_plan(db, counselor_user_id, data)

@router.post("/counselor/finalize/{plan_id}")
def finalize(plan_id: int, db: Session = Depends(get_db)):
    crud.finalize_plan(db, plan_id)
    return {"detail": "Plan finalized"}


from app.auth import JWTBearer

@router.get("/student/my")
def get_my_plan(
    db: Session = Depends(get_db),
    payload: dict = Depends(JWTBearer())
):
    student_id = payload["sub"]
    plan = crud.get_student_weekly_plan(db, student_id)
    if not plan:
        raise HTTPException(status_code=404, detail="No finalized plan found")
    return plan


@router.post("/student/update-status")
def update_status(updates: List[ActivityStatusUpdate], db: Session = Depends(get_db),payload: dict = Depends(JWTBearer())):
    student_id = payload["sub"]
    crud.update_activity_status(db, student_id, updates)
    return {"detail": "Status updated"}


@router.post("/student/submit-status")
def submit_status(payload: dict = Depends(JWTBearer()), db: Session = Depends(get_db)):
    student_id = payload["sub"]
    crud.student_submit_status(db, student_id)
    return {"detail": "Status submitted"}


@router.get("/counselor/review/{student_id}")
def review_plan(student_id: int, db: Session = Depends(get_db)):
    plan = crud.get_plan_for_review(db, student_id)
    if not plan:
        raise HTTPException(status_code=404, detail="No submitted plan found")
    return plan


@router.post("/counselor/submit-feedback")
def submit_feedback(data: CounselorFeedback, db: Session = Depends(get_db)):
    crud.submit_counselor_feedback(db, data.plan_id, data.feedback)
    return {"detail": "Feedback submitted"}


from app.schemas import ScoreInput
from app.auth import JWTBearer

@router.post("/counselor/score")
def give_score(
    data: ScoreInput,
    db: Session = Depends(get_db),
    payload: dict = Depends(JWTBearer())  # احراز هویت مشاور
):
    return crud.set_plan_score(db, data.plan_id, data.score)
