from pydantic import BaseModel, Field

ROLE_APP = "Role"
DATABASE = "database.db"

class AuthRequest(BaseModel):
    database: str = Field(default=DATABASE)
    role_app: str = Field(default=ROLE_APP)
    user_login: str
    provided_password: str

class AuthResponse(BaseModel):
    name: str
    role: str
    login: str

