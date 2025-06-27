from pydantic import BaseModel

class ErrorSchema(BaseModel):
    """
    Schema for error responses.
    """
    message: str