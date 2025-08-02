from fastapi import FastAPI
from app.database import Base, engine
from app.routers import  authentication,students, counselors, appointments, time_slots, public, reset_password, study_plan, notifications, admin

Base.metadata.create_all(bind=engine)

app = FastAPI(title="Academic Counseling API")

app.include_router(authentication.router)
app.include_router(students.router)
app.include_router(counselors.router)
app.include_router(appointments.router)
app.include_router(time_slots.router)
app.include_router(public.router)
app.include_router(reset_password.router)
app.include_router(study_plan.router)
app.include_router(notifications.router, prefix="/notifications", tags=["notifications"])
app.include_router(admin.router)


