from typing import Annotated

from fastapi import Depends, FastAPI, status
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy import select, text
from sqlalchemy.orm import Session

from database import engine, get_session
from models import Member
from schemas import MemberResponse

app = FastAPI()


app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
def hello() -> dict[str, str]:
    return {"message": "Backend is running"}


@app.get("/db-check")
def check_database() -> dict[str, str]:
    with engine.connect() as connection:
        database_name = connection.execute(
            text("SELECT current_database()")
        ).scalar_one()

    return {
        "status": "connected",
        "database": database_name,
    }


@app.get(
    "/members",
    response_model=list[MemberResponse],
    status_code=status.HTTP_200_OK,
)
def get_members(
    session: Annotated[Session, Depends(get_session)],
) -> list[MemberResponse]:
    statement = select(Member).order_by(Member.member_id)
    members = session.scalars(statement).all()

    return [
        MemberResponse.model_validate(member)
        for member in members
    ]
