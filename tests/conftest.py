import os
from collections.abc import Iterator

import pytest
from sqlalchemy import URL, Engine, create_engine, text
from sqlalchemy.orm import Session, sessionmaker

from models import Base

TEST_POSTGRES_DB = os.environ.get("TEST_POSTGRES_DB", "week2_test_db")


def _admin_url() -> URL:
    return URL.create(
        drivername="postgresql+psycopg",
        username=os.environ["POSTGRES_USER"],
        password=os.environ["POSTGRES_PASSWORD"],
        host=os.environ["POSTGRES_HOST"],
        port=int(os.environ["POSTGRES_PORT"]),
        database="postgres",
    )


@pytest.fixture(scope="session")
def test_engine() -> Iterator[Engine]:
    admin_engine = create_engine(_admin_url(), isolation_level="AUTOCOMMIT")
    with admin_engine.connect() as connection:
        connection.execute(text(f'DROP DATABASE IF EXISTS "{TEST_POSTGRES_DB}"'))
        connection.execute(text(f'CREATE DATABASE "{TEST_POSTGRES_DB}"'))
    admin_engine.dispose()

    engine = create_engine(_admin_url().set(database=TEST_POSTGRES_DB))
    Base.metadata.create_all(engine)

    yield engine

    engine.dispose()
    admin_engine = create_engine(_admin_url(), isolation_level="AUTOCOMMIT")
    with admin_engine.connect() as connection:
        connection.execute(text(f'DROP DATABASE IF EXISTS "{TEST_POSTGRES_DB}"'))
    admin_engine.dispose()


@pytest.fixture()
def db_session(test_engine: Engine) -> Iterator[Session]:
    connection = test_engine.connect()
    transaction = connection.begin()
    session = sessionmaker(bind=connection)()

    yield session

    session.close()
    transaction.rollback()
    connection.close()
