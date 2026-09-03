"""add pour sequence to zones

Revision ID: 02b6dcc0f875
Revises: dfe8b83b9b14
Create Date: 2026-09-02 20:22:38.690332

"""
from collections.abc import Sequence

import sqlalchemy as sa
from alembic import op

# revision identifiers, used by Alembic.
revision: str = '02b6dcc0f875'
down_revision: str | Sequence[str] | None = 'dfe8b83b9b14'
branch_labels: str | Sequence[str] | None = None
depends_on: str | Sequence[str] | None = None


def upgrade() -> None:
    """Upgrade schema."""

    op.add_column(
        "zones",
        sa.Column(
            "pour_sequence",
            sa.Integer(),
            nullable=True,
        ),
    )

    op.execute(
        sa.text(
            """
            UPDATE zones
            SET pour_sequence = CASE
                WHEN zone_id = 'Z01' THEN 1
                WHEN zone_id = 'Z02' THEN 2
            END
            WHERE zone_id IN ('Z01', 'Z02')
            """
        )
    )

    op.alter_column(
        "zones",
        "pour_sequence",
        existing_type=sa.Integer(),
        nullable=False,
    )


def downgrade() -> None:
    """Downgrade schema."""

    op.drop_column(
        "zones",
        "pour_sequence",
    )