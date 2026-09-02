import os
from collections.abc import Iterator
from pathlib import Path

from dotenv import load_dotenv
from sqlalchemy import URL, create_engine, text
from sqlalchemy.orm import Session

load_dotenv(Path(__file__).resolve().parent / ".env")

database_url = URL.create(
    drivername="postgresql+psycopg",
    username=os.environ["POSTGRES_USER"],
    password=os.environ["POSTGRES_PASSWORD"],
    host=os.environ["POSTGRES_HOST"],
    port=int(os.environ["POSTGRES_PORT"]),
    database=os.environ["POSTGRES_DB"],
)

engine = create_engine(database_url, pool_pre_ping=True)

if __name__ == "__main__":
    with engine.connect() as connection:
        database_name = connection.execute(
            text("SELECT current_database()")
        ).scalar_one()
        print(f"Successfully connected to database: {database_name}")

def get_session() -> Iterator[Session]:
    with Session(engine) as session:
        yield session