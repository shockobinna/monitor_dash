from fastapi import FastAPI
import psycopg2
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
    "http://localhost:3000",
    "http://127.0.0.1:3000",],  # Allow frontend access
    allow_methods=["GET"],
    allow_headers=["*"],
)

def get_connection():
    return psycopg2.connect(
        dbname="papelaria_app",
        user="postgres",
        password=8485,
        host="localhost",
        port=5433
    )

@app.get("/dashboard")
def read_data():
    try:
        conn = get_connection()
        cur = conn.cursor()
        cur.execute("SELECT COUNT (*) FROM papelaria_cliente")
        data = cur.fetchall()
        cur.close()
        conn.close()
        return {"data": data}
    except Exception as e:
        print("Error:", e)
        return JSONResponse(status_code=500, content={"error": str(e)})
