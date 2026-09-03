from typing import Literal

from pydantic import BaseModel, ConfigDict


class MemberResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    member_id: str
    member_type: Literal["col", "beam", "wall", "slab"]
    storey_id: str
    dimension_id: str
    material_id: str
    zone_id: str
    geometry_points: list[list[int]]

class MemberDetailResponse(MemberResponse):
    storey_name: str
    material_strength_kg_cm2: int
    dimension_section: dict[str, str | int]
