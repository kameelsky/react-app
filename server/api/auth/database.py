import sqlite3
from contextlib import contextmanager
from typing import Optional

from fastapi import HTTPException, status


@contextmanager
def SQL(database: str):
    try:
        connection = sqlite3.connect(database)
        cursor = connection.cursor()
        yield cursor
    finally:
        connection.commit()
        cursor.close()
        connection.close()

def check_password(database: str, user_login: str, encrypted_provided_password: str, role_app: str) -> Optional[tuple[str, str]]:

    with SQL(database) as cursor:
        try:
            cursor.execute(f"SELECT Name, Password, {role_app} FROM ACCOUNTS WHERE Login = '{user_login}'")
            name, password_encrypted_databse, role = cursor.fetchone()
        except: raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Login not found in database")   
    if password_encrypted_databse == encrypted_provided_password: 
        return name, role
    else: raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Incorrect password")