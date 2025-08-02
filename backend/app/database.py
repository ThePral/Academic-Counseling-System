from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from sqlalchemy.orm import declarative_base
import os

DATABASE_URL = os.getenv("DATABASE_URL", "postgresql://postgres:admin@localhost/academic_counseling")

engine = create_engine(DATABASE_URL)
try:
    with engine.connect() as connection:
        print("Connection to database is successful.")
except Exception as e:
    print(f"Error: Unable to connect to the database: {e}")
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
        
