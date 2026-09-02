import os
from typing import Annotated

from fastapi import Depends, FastAPI, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy import select, text
from sqlalchemy.orm import Session

from database import engine, get_session
from models import Member
from schemas import MemberResponse

app = FastAPI()

frontend_origin = os.getenv(
    "FRONTEND_ORIGIN",
    "http://localhost:5173",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[frontend_origin],
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

@app.get(
    "/members/{member_id}",
    response_model=MemberResponse,
    status_code=status.HTTP_200_OK,
)
def get_member(
    member_id: str,
    session: Annotated[Session, Depends(get_session)],
) -> MemberResponse:
    member = session.get(Member, member_id)

    if member is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Member not found",
        )

    return MemberResponse.model_validate(member)
