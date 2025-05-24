from fastapi import APIRouter, Depends
from functions.encryption import authentication

router = APIRouter(dependencies=[Depends(authentication)])

@router.get("/access")
def check_access_to_data(payload: dict = Depends(authentication)):
    return {"message":"Access granted", "payload": payload}