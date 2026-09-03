from sqlalchemy import (
    CheckConstraint,
    ForeignKey,
    ForeignKeyConstraint,
    Integer,
    String,
    UniqueConstraint,
)
from sqlalchemy.dialects.postgresql import JSONB
from sqlalchemy.orm import DeclarativeBase, Mapped, mapped_column


class Base(DeclarativeBase):
    pass


class Dimension(Base):
    __tablename__ = "dimensions"

    dimension_id: Mapped[str] = mapped_column(String, primary_key=True)
    member_type: Mapped[str] = mapped_column(String)
    dim: Mapped[dict[str, str | int]] = mapped_column(JSONB)

    __table_args__ = (
        CheckConstraint(
            "member_type IN ('col', 'beam', 'wall', 'slab')",
            name="ck_dimensions_member_type",
        ),
        UniqueConstraint(
            "dimension_id",
            "member_type",
            name="uq_dimensions_id_type",
        ),
    )


class Material(Base):
    __tablename__ = "materials"

    material_id: Mapped[str] = mapped_column(String, primary_key=True)
    material_name: Mapped[str] = mapped_column(String)
    material_type: Mapped[str] = mapped_column(String)


class Zone(Base):
    __tablename__ = "zones"

    zone_id: Mapped[str] = mapped_column(String, primary_key=True)
    zone_name: Mapped[str] = mapped_column(String)
    pour_sequence: Mapped[int] = mapped_column(Integer)
    

class Storey(Base):
    __tablename__ = "storeys"

    storey_id: Mapped[str] = mapped_column(String, primary_key=True)
    storey_name: Mapped[str] = mapped_column(String)
    elevation_mm: Mapped[int] = mapped_column(Integer)


class Grid(Base):
    __tablename__ = "grids"

    grid_axis: Mapped[str] = mapped_column(String, primary_key=True)
    grid_label: Mapped[str] = mapped_column(String, primary_key=True)
    coordinate_mm: Mapped[int] = mapped_column(Integer)

    __table_args__ = (
        CheckConstraint(
            "grid_axis IN ('x', 'y')",
            name="ck_grids_axis",
        ),
    )


class Member(Base):
    __tablename__ = "members"

    member_id: Mapped[str] = mapped_column(String, primary_key=True)
    member_type: Mapped[str] = mapped_column(String)
    storey_id: Mapped[str] = mapped_column(
        String, ForeignKey("storeys.storey_id")
    )
    dimension_id: Mapped[str] = mapped_column(String)
    material_id: Mapped[str] = mapped_column(
        String, ForeignKey("materials.material_id")
    )
    zone_id: Mapped[str] = mapped_column(
        String, ForeignKey("zones.zone_id")
    )
    geometry_points: Mapped[list[list[int]]] = mapped_column(JSONB)

    __table_args__ = (
        ForeignKeyConstraint(
            ["dimension_id", "member_type"],
            ["dimensions.dimension_id", "dimensions.member_type"],
            name="fk_members_dimension_type",
        ),
    )