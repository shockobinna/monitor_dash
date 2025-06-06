import json
import random
from datetime import datetime, timedelta

# Configuration
start_date = datetime.strptime("25/05/2026", "%d/%m/%Y")
num_days = 20
bus = ["4602920", "4602389"]
entries = []

entry_id = 1

for day in range(num_days):
    date = start_date + timedelta(days=day)
    for bu in bus:
        # Generate time ranges for the entry
        start_hour = random.randint(7, 9)
        start_minute = random.randint(0, 59)
        start_time = datetime(date.year, date.month, date.day, start_hour, start_minute)

        end_hour = start_hour + 8
        end_minute = random.randint(0, 59)
        end_time = datetime(date.year, date.month, date.day, end_hour, end_minute)

        process_hour = end_hour + 1
        process_minute = random.randint(0, 59)
        process_time = datetime(date.year, date.month, date.day, process_hour, process_minute)

        entry = {
            "id": entry_id,
            "start_date": start_time.strftime("%d/%m/%Y %H:%M:%S"),
            "end_date": end_time.strftime("%d/%m/%Y %H:%M:%S"),
            "bu": bu,
            "process_date": process_time.strftime("%d/%m/%Y %H:%M:%S"),
            "quantity_processed": random.randint(100, 200)
        }
        entries.append(entry)
        entry_id += 1

# Wrap in top-level JSON
db_json = {
    "report_name": entries
}

# Save to db.json
with open("db.json", "w") as f:
    json.dump(db_json, f, indent=2)

print("✅ db.json with 40 entries created.")
