"""add compressive strength to materials

Revision ID: ef3268661c18
Revises: 02b6dcc0f875
Create Date: 2026-09-03 17:05:01.792921

"""
from collections.abc import Sequence

import sqlalchemy as sa
from alembic import op

# revision identifiers, used by Alembic.
revision: str = 'ef3268661c18'
down_revision: str | Sequence[str] | None = '02b6dcc0f875'
branch_labels: str | Sequence[str] | None = None
depends_on: str | Sequence[str] | None = None


def upgrade() -> None:
    """Upgrade schema."""

    op.add_column(
        "materials",
        sa.Column(
            "compressive_strength_kg_cm2",
            sa.Integer(),
            nullable=True,
        ),
    )

    op.execute(
        sa.text(
            """
            UPDATE materials
            SET compressive_strength_kg_cm2 = CASE
                WHEN material_id = 'K100' THEN 100
                WHEN material_id = 'K250' THEN 250
            END
            WHERE material_id IN ('K100', 'K250')
            """
        )
    )

    op.alter_column(
        "materials",
        "compressive_strength_kg_cm2",
        existing_type=sa.Integer(),
        nullable=False,
    )


def downgrade() -> None:
    """Downgrade schema."""

    op.drop_column(
        "materials",
        "compressive_strength_kg_cm2",
    )
