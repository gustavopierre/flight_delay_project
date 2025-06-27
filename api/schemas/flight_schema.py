from pydantic import BaseModel
from typing import Optional, List
from model.flight import Flight
import json
import numpy as np

class FlightSchema(BaseModel):
    airline: str
    flight: int
    airportFrom: str
    airportTo: str
    dayOfWeek: int
    time: int
    length: int

class FlightResponseSchema(BaseModel):
    prediction: int
