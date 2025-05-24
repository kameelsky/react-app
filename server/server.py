import uvicorn
from api.auth.routes import router as auth_router
from api.data.routes import router as data_router
from api.tools.routes import router as tools_router
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse

origins = []

app = FastAPI(title="Protein Engineering API", version="1.0.0", root_path="/api", docs_url="/docs", redoc_url="/redoc")
app.add_middleware(CORSMiddleware, allow_origins=origins, allow_credentials=True, allow_methods=["*"], allow_headers=["*"])
app.include_router(auth_router, prefix="/auth", tags=["authentication"], include_in_schema=False)
app.include_router(tools_router, prefix="/tools", tags=["tools"], include_in_schema=False)
app.include_router(data_router, prefix="/data", tags=["Data"], include_in_schema=True)

@app.get("/")
def home_page():
    return FileResponse("index.html")

if __name__ == "__main__":
    uvicorn.run("server:app", port=9003, reload=True)
