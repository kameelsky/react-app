import os

from api.auth.database import check_password
from api.auth.models import AuthRequest, AuthResponse
from fastapi import APIRouter, Body, HTTPException, Query, status
from functions.encryption import encryptJWT

router = APIRouter()

@router.post("/user-validate", response_model=AuthResponse)
def validate_user(developer: bool = Query(default=False), 
                        body: AuthRequest = Body(default=None)):
    if developer == True: return {"name": "Developer", "role": "admin", "login": "DEVE"}
    if not os.path.exists(body.database): raise HTTPException(status_code=status.HTTP_503_SERVICE_UNAVAILABLE, detail="No database found. Contact IT support.")
    name, role = check_password(database=body.database,
                                user_login=body.user_login,
                                encrypted_provided_password=body.provided_password,
                                role_app=body.role_app)
    return {"name": name, "role": role, "login": body.user_login}

@router.get("/token")
def get_token(body: AuthRequest = Body(default=None)):
    if not os.path.exists(body.database): raise HTTPException(status_code=status.HTTP_503_SERVICE_UNAVAILABLE, detail="No database found. Contact IT support.")
    name, role = check_password(database=body.database,
                                user_login=body.user_login,
                                encrypted_provided_password=body.provided_password,
                                role_app=body.role_app)
    return encryptJWT(name, role, user_login=body.user_login)