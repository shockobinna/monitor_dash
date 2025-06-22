from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from datetime import datetime
import oracledb
import os
from dotenv import load_dotenv



app = FastAPI()

load_dotenv()

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
        # dsn="localhost/orclpdb1"  # Use proper TNS or Easy Connect string
        dsn=os.getenv("DSN"),  # Replace with actual service name
        mode=oracledb.AUTH_MODE_SYSDBA
    )

def format_datetime(dt):
    if isinstance(dt, datetime):
        return dt.strftime("%d/%m/%Y %H:%M:%S")
    return dt

@app.api_route("/dashboard", methods=["GET", "HEAD"])
async def read_data(request: Request):  # <-- make it async to handle awaitables if needed
    if request.method == "HEAD":
        return JSONResponse(status_code=200, content=None)
    
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
                process_date >= TRUNC(SYSDATE) - 16
                AND process_date <= TRUNC(SYSDATE)
                AND process_date IS NOT NULL  
                AND report_name = 'TAGENTINFO'
            ORDER BY 
                process_date DESC
        """
        cur.execute(sql_summary)
        summary_rows = cur.fetchall()

        # Format summary into desired structure
        summary_data = {}
        report_name_key = "TAGENTINFO"
        summary_data[report_name_key] = []

        for idx, row in enumerate(summary_rows, start=1):
            report_name, bu, start_date, end_date, process_date = row
            summary_data[report_name_key].append({
                "id": idx,
                "start_date": format_datetime(start_date),
                "end_date": format_datetime(end_date),
                "bu": str(bu),
                "process_date": format_datetime(process_date)
            })

        # Query 2: TAGENTINFO aggregation
        sql_tagentinfo = """
            SELECT 
                COUNT(*) AS quantidade, 
                bu, 
                TO_CHAR(row_date, 'YYYY-MM-DD') AS dataDados
            FROM 
                TB_REL_NICE_TAGENTINFO
            WHERE 
                row_date >= TRUNC(SYSDATE) - 17
                AND row_date <= TRUNC(SYSDATE)
            GROUP BY 
                bu, TO_CHAR(row_date, 'YYYY-MM-DD')
            ORDER BY 
                dataDados DESC, bu
        """
        cur.execute(sql_tagentinfo)
        tagentinfo_rows = cur.fetchall()

        # Add unique ID and convert bu to string
        tagentinfo_data = [
            {
                "id": idx,
                "quantidade": row[0],
                "bu": str(row[1]),
                "datadados": row[2]
            }
            for idx, row in enumerate(tagentinfo_rows, start=1)
        ]

        return {
            "summary": summary_data["TAGENTINFO"],
            "tagentinfo": tagentinfo_data
        }

    except Exception as e:
        return JSONResponse(status_code=500, content={"error": str(e)})
    
# SELECT 
#     report_name, 
#     bu, 
#     START_DATE, 
#     END_DATE, 
#     process_date
# FROM 
#     tb_rel_nice_summary  
# WHERE 
#     process_date >= TRUNC(SYSDATE) - 6  -- 6 days ago (start)
#     AND process_date <= TRUNC(SYSDATE)  -- today (end)
#     AND process_date IS NOT NULL  
#     AND report_name = 'TAGENTINFO'
# ORDER BY 
#     process_date DESC;

    
# Query - Quantidade de Registros (D-1) 
# SELECT 
#     COUNT(*) AS quantidade, 
#     bu, 
#     TO_CHAR(row_date, 'YYYY-MM-DD') AS dataDados
# FROM 
#     TB_REL_NICE_TAGENTINFO
# WHERE 
#     row_date >= TRUNC(SYSDATE) - 7      -- 7 days ago (from yesterday)
#     AND row_date <= TRUNC(SYSDATE)  -- yesterday
# GROUP BY 
#     bu, TO_CHAR(row_date, 'YYYY-MM-DD')
# ORDER BY 
#     dataDados DESC, bu;



#     SELECT report_name, bu, START_DATE, END_DATE, process_date 
# FROM tb_rel_nice_summary  
# WHERE process_date >= TO_DATE('2025-06-02 00:00','YYYY-MM-DD HH24:MI')  
#   AND process_date IS NOT NULL  
#   AND report_name IN ('TAGENTINFO')  
#   -- AND bu = 4602389 -- 4602389 = C47 ou 4602920 = C51 
 

# # Query - Quantidade de Registros (D-1) 

 
# SELECT count(*) AS quantidade, bu, TO_CHAR(row_date,'YYYY-MM-DD') AS dataDados  
# FROM TB_REL_NICE_TAGENTINFO 
# WHERE TO_CHAR(row_date,'YYYY-MM-DD') = '2025-06-01' 
# GROUP BY bu, row_date -- 4602389 = C47 ou 4602920 =

# npm run start:dev/prod

# SELECT 
#     s.report_name,
#     s.bu,
#     s.START_DATE,
#     s.END_DATE,
#     s.process_date,
#     t.quantidade
# FROM 
#     tb_rel_nice_summary s
# LEFT JOIN (
#     SELECT 
#         bu, 
#         COUNT(*) AS quantidade
#     FROM 
#         TB_REL_NICE_TAGENTINFO
#     WHERE 
#         TO_CHAR(row_date, 'YYYY-MM-DD') = '2025-06-01'
#     GROUP BY 
#         bu
# ) t ON s.bu = t.bu
# WHERE 
#     s.process_date = TO_DATE('2025-06-02 00:00', 'YYYY-MM-DD HH24:MI')
#     AND s.process_date IS NOT NULL
#     AND s.report_name IN ('TAGENTINFO');



