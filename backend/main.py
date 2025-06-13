from fastapi import FastAPI
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
    allow_methods=["GET"],
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


@app.get("/dashboard")

def read_data():
    try:
        conn = get_connection()
        cur = conn.cursor()

        # Query: summary
        sql_summary = """
            SELECT report_name, bu, start_date, end_date, TRUNC(process_date) AS process_date
            FROM tb_rel_nice_summary
            WHERE report_name = 'TAGENTINFO'
              AND process_date IS NOT NULL
        """
        cur.execute(sql_summary)
        summary_rows = cur.fetchall()
        summary_columns = [col[0].lower() for col in cur.description]

        # Query: tagentinfo
        sql_tagentinfo = """
            SELECT bu, TRUNC(row_date) AS row_date, SUM(quantidade) AS quantidade
            FROM tb_rel_nice_tagentinfo
            WHERE row_date IS NOT NULL
            GROUP BY bu, TRUNC(row_date)
        """
        cur.execute(sql_tagentinfo)
        tagent_rows = cur.fetchall()

        # Lookup map
        tagent_lookup = {
            (str(bu), row_date.strftime('%Y-%m-%d')): int(quantidade)
            for bu, row_date, quantidade in tagent_rows if row_date
        }

        # Merge logic: only if match exists
        result = []
        idx = 1
        for row in summary_rows:
            row_dict = dict(zip(summary_columns, row))
            bu = str(row_dict["bu"])
            proc_date = row_dict["process_date"]
            proc_key = proc_date.strftime('%Y-%m-%d') if proc_date else None

            key = (bu, proc_key)
            if key not in tagent_lookup:
                continue  # Skip rows without a match

            quantidade = tagent_lookup[key]

            result.append({
                "id": idx,
                "report_name": row_dict["report_name"],
                "bu": bu,
                "start_date": row_dict["start_date"].strftime("%d/%m/%Y") if row_dict["start_date"] else None,
                "end_date": row_dict["end_date"].strftime("%d/%m/%Y") if row_dict["end_date"] else None,
                "process_date": proc_date.strftime("%d/%m/%Y") if proc_date else None,
                "quantity_processed": quantidade
            })
            idx += 1

        cur.close()
        conn.close()

        return {"report_name": result}

    except Exception as e:
        return JSONResponse(status_code=500, content={"error": str(e)})


#     SELECT report_name, bu, START_DATE, END_DATE, process_date 
# FROM tb_rel_nice_summary  
# WHERE process_date >= TO_DATE('2025-06-02 00:00','YYYY-MM-DD HH24:MI')  
#   AND process_date IS NOT NULL  
#   AND report_name IN ('TAGENTINFO')  
#   -- AND bu = 4602389 -- 4602389 = C47 ou 4602920 = C51 
 

# Query - Quantidade de Registros (D-1) 

 
# SELECT count(*) AS quantidade, bu, TO_CHAR(row_date,'YYYY-MM-DD') AS dataDados  
# FROM TB_REL_NICE_TAGENTINFO 
# WHERE TO_CHAR(row_date,'YYYY-MM-DD') = '2025-06-01' 
# GROUP BY bu, row_date -- 4602389 = C47 ou 4602920 =

# npm run start:dev/prod


