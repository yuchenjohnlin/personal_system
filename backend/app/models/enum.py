from enum import Enum as PyEnum

class ValueType(str, PyEnum):
    AMOUNT = "amount"
    PERCENT = "percent"

class UnitType(str, PyEnum):
    WEIGHT = "weight"
    COUNT = "count"
