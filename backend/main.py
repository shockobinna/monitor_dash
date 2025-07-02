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


ALLOWED_REPORTS = {"TAGENTINFO", "HAGENTD1", "HSPLITD1", "BILLOGD1"}

@app.get("/dashboard/{report_name}")
async def read_data(report_name: str):
    print(f"I am here : {report_name}")
    report_key = report_name.upper()
    print(f"Report key: {report_key}")

    # Validate against whitelist
    if report_key not in ALLOWED_REPORTS:
        raise HTTPException(status_code=400, detail="Invalid report name")
    
    if report_key == "TAGENTINFO":
        

        table_name = f"TB_REL_NICE_{report_key}"
        print(f"if loop: {table_name}")
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
                    process_date >= TRUNC(SYSDATE) - 6
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
                    row_date >= TRUNC(SYSDATE) - 7 
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
        
        finally:
            try:
                if cur:
                    cur.close()
            except Exception as e:
                print(f"Error closing cursor: {e}")

            try:
                if conn:
                    conn.close()
            except Exception as e:
                print(f"Error closing connection: {e}")
    else:
        
        base_key = report_key.removesuffix("D1")  # Or use slicing if needed
        table_name_c47 = f"TB_REL_NICE_{base_key}_C47"
        table_name_c51 = f"TB_REL_NICE_{base_key}_C51"
        print(f"in the else block :{table_name_c47} and {table_name_c51}")
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
                    process_date >= TRUNC(SYSDATE) - 6
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
            # Define the query
            sql_countinfo = f"""
                SELECT 
                    COUNT(*) AS quantidade, 
                    bu, 
                    TO_CHAR(row_date, 'YYYY-MM-DD') AS dataDados,
                    'C47' AS origem
                FROM 
                    {table_name_c47}
                WHERE 
                    row_date >= TRUNC(SYSDATE) - 7 
                    AND row_date <= TRUNC(SYSDATE)
                GROUP BY 
                    bu, TO_CHAR(row_date, 'YYYY-MM-DD')

                UNION ALL

                SELECT 
                    COUNT(*) AS quantidade, 
                    bu, 
                    TO_CHAR(row_date, 'YYYY-MM-DD') AS dataDados,
                    'C51' AS origem
                FROM 
                    {table_name_c51}
                WHERE 
                    row_date >= TRUNC(SYSDATE) - 7 
                    AND row_date <= TRUNC(SYSDATE)
                GROUP BY 
                    bu, TO_CHAR(row_date, 'YYYY-MM-DD')

                ORDER BY 
                    dataDados DESC, bu
            """

            # Execute and fetch
            cur.execute(sql_countinfo)
            rows = cur.fetchall()

            # Build the totalcount list
            totalcount = [
                {
                    "id": idx,
                    "quantidade": row[0],
                    "bu": str(row[1]),
                    "datadados": row[2],
                }
                for idx, row in enumerate(rows, start=1)
            ]

            return {
                "summary": summary_data,
                "totalcount": totalcount
            }
            
        except Exception as e:
            import traceback
            traceback.print_exc()
            return JSONResponse(status_code=500, content={"error": str(e)})
        
        finally:
            try:
                if cur:
                    cur.close()
            except Exception as e:
                print(f"Error closing cursor: {e}")

            try:
                if conn:
                    conn.close()
            except Exception as e:
                print(f"Error closing connection: {e}")
                
    
# uvicorn main:app --host 127.0.0.1 --port 8000 --reload



