from fastapi import FastAPI, Request, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import Response, JSONResponse
from datetime import datetime
import oracledb
import os
import sys
from dotenv import load_dotenv

app = FastAPI()

# Find .env path based on whether running as bundled executable

if getattr(sys, 'frozen', False):
    # In production (.exe): look relative to the executable
    base_dir = os.path.dirname(sys.executable)
    env_path = os.path.join(base_dir, '.env')
else:
    # In development: look in the current folder
    base_dir = os.path.dirname(__file__)
    env_path = os.path.join(base_dir, '.env')

print(f"Loading .env from: {env_path}")
load_dotenv(dotenv_path=env_path)
print(f"Oracle user: {os.getenv('USER')}")
print(f" Loaded .env from: {env_path}")
print(f" Oracle user: {os.getenv('USER')}")
print(f" Oracle password: {os.getenv('PASSWORD')}")
print(f" Oracle DSN: {os.getenv('DSN')}")

# load_dotenv()

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://127.0.0.1:3000",
    ],
    allow_methods=["GET", "HEAD"],
    allow_headers=["*"],
)

# Configure Oracle DB connection
def get_connection():
    return oracledb.connect(
        user=os.getenv("USER"),
        password=os.getenv("PASSWORD"),
        dsn=os.getenv("DSN"),  # Replace with actual service name
        mode=oracledb.AUTH_MODE_SYSDBA
    )

def format_datetime(dt):
    if isinstance(dt, datetime):
        return dt.strftime("%d/%m/%Y %H:%M:%S")
    return dt

@app.head("/health")
async def dashboard_health_check():
    # Just respond 200 OK for HEAD requests to /dashboard without body
    return Response(status_code=200)

# Whitelist of allowed report names (case-insensitive)
ALLOWED_REPORTS = {"TAGENTINFO", "HAGENT", "DAYLOG", "FSPLIT"}

@app.get("/dashboard/{report_name}")
async def read_data(report_name: str):
    print(report_name)
    report_key = report_name.upper()

    # Validate against whitelist
    if report_key not in ALLOWED_REPORTS:
        raise HTTPException(status_code=400, detail="Invalid report name")

    table_name = f"TB_REL_NICE_{report_key}"
    try:
        conn = get_connection()
        cur = conn.cursor()

        # Query 1: Summary
        sql_summary = """
            SELECT 
                report_name, 
                bu, 
                START_DATE, 
                END_DATE, 
                process_date
            FROM 
                tb_rel_nice_summary  
            WHERE 
                process_date >= TRUNC(SYSDATE) - 26
                AND process_date <= TRUNC(SYSDATE)
                AND process_date IS NOT NULL  
                AND report_name = :report_name
            ORDER BY 
                process_date DESC
        """
        cur.execute(sql_summary, report_name=report_name)
        summary_rows = cur.fetchall()

        # Format summary into desired structure
        summary_data = []
        for idx, row in enumerate(summary_rows, start=1):
            report_name, bu, start_date, end_date, process_date = row
            summary_data.append({
                "id": idx,
                "start_date": format_datetime(start_date),
                "end_date": format_datetime(end_date),
                "bu": str(bu),
                "process_date": format_datetime(process_date)
            })

        # Query 2: TAGENTINFO aggregation
        sql_countinfo = f"""
            SELECT 
                COUNT(*) AS quantidade, 
                bu, 
                TO_CHAR(row_date, 'YYYY-MM-DD') AS dataDados
            FROM 
                {table_name}
            WHERE 
                row_date >= TRUNC(SYSDATE) - 27 
                AND row_date <= TRUNC(SYSDATE)
            GROUP BY 
                bu, TO_CHAR(row_date, 'YYYY-MM-DD')
            ORDER BY 
                dataDados DESC, bu
        """
        cur.execute(sql_countinfo)
        count_rows = cur.fetchall()

        count_data = [
            {
                "id": idx,
                "quantidade": row[0],
                "bu": str(row[1]),
                "datadados": row[2]
            }
            for idx, row in enumerate(count_rows, start=1)
        ]
        print(summary_data)
        print(count_data)
        return {
            "summary": summary_data,
            "totalcount": count_data
        }

    except Exception as e:
        import traceback
        traceback.print_exc()
        return JSONResponse(status_code=500, content={"error": str(e)})

# uvicorn main:app --host 127.0.0.1 --port 8000 --reload



