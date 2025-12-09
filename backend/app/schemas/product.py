from pydantic import BaseModel
from typing import Optional


class ProductOut(BaseModel):
    id: int
    product_name_id: Optional[int] = None
    item_id: Optional[int] = None
    category_id: Optional[int] = None

    class Config:
        orm_mode = True
