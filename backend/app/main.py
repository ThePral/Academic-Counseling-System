
from fastapi import FastAPI
from app.routers import auth, students, counselors, appointments, time_slots, public, reset_password, study_plan

app = FastAPI(title="Academic Counseling API")


app.include_router(auth.router)
app.include_router(students.router)
app.include_router(counselors.router)
app.include_router(appointments.router)
app.include_router(time_slots.router)
app.include_router(public.router)
app.include_router(reset_password.router)
app.include_router(study_plan.router)
