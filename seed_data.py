import os
import random
import pandas as pd
from faker import Faker
from datetime import datetime, timedelta
import bcrypt

import database
import models

fake = Faker()

# Create or Recreate Database
models.Base.metadata.drop_all(bind=database.engine)
models.Base.metadata.create_all(bind=database.engine)
db = database.SessionLocal()

def get_password_hash(password: str) -> str:
    salt = bcrypt.gensalt()
    return bcrypt.hashpw(password.encode('utf-8'), salt).decode('utf-8')

print("Seeding Users...")
# Requested specific users
specific_users = [
    {"name": "Sarah Johnson", "email": "sarah.j@safegas.ai", "role": "Administrator", "department": "System Administration"},
    {"name": "David Wilson", "email": "david.w@safegas.ai", "role": "Operator", "department": "Emergency Response"},
    {"name": "Emily Carter", "email": "emily.c@safegas.ai", "role": "Supervisor", "department": "Safety Operations"},
    {"name": "Michael Brown", "email": "michael.b@safegas.ai", "role": "Supervisor", "department": "Operations Management"},
    {"name": "James Miller", "email": "james.m@safegas.ai", "role": "Operator", "department": "Field Inspection"},
    {"name": "Sophia Anderson", "email": "sophia.a@safegas.ai", "role": "Analyst", "department": "Data Analytics"},
    {"name": "Olivia Thomas", "email": "olivia.t@safegas.ai", "role": "Viewer", "department": "Support Engineering"},
    {"name": "Admin Default", "email": "admin@gasleak.com", "role": "Administrator", "department": "Root"}
]

password_hash = get_password_hash("admin123")

for u in specific_users:
    user = models.User(
        email=u["email"],
        password_hash=password_hash,
        full_name=u["name"],
        phone=fake.phone_number()[:15],
        organization=u["department"],
        role=u["role"],
        is_active=True
    )
    db.add(user)

# Add remaining random users (Total 35+)
roles = ["Operator", "Supervisor", "Analyst", "Viewer", "Guest"]
departments = ["Field Support", "Analytics", "Operations", "Logistics", "Emergency Services"]
for _ in range(28):
    user = models.User(
        email=fake.unique.email(),
        password_hash=password_hash,
        full_name=fake.name(),
        phone=fake.phone_number()[:15],
        organization=random.choice(departments),
        role=random.choice(roles),
        is_active=True
    )
    db.add(user)

db.commit()

# Audit logs
print("Seeding Audit Logs...")
actions = ["USER_LOGIN", "DATA_GENERATED", "AI_ASSESSMENT", "INCIDENT_REPORTED", "PROFILE_UPDATED"]
users = db.query(models.User).all()
for _ in range(50):
    u = random.choice(users)
    log = models.AuditLog(
        user_id=u.id,
        user_email=u.email,
        action=random.choice(actions),
        details="Simulated action for demo purposes.",
        timestamp=fake.date_time_between(start_date="-30d", end_date="now")
    )
    db.add(log)

db.commit()
db.close()

# Generate CSV Data
DATA_DIR = os.path.join(os.path.dirname(__file__), "datasets")
os.makedirs(DATA_DIR, exist_ok=True)

districts = ["North District", "South District", "East District", "West District", "Central District", "Highlands", "Valley"]
occupations = ["Farmer", "Teacher", "Merchant", "Worker", "Engineer", "Nurse", "Student", "Retired"]

print("Seeding Beneficiaries...")
# Beneficiary_ID,Name,Age,Gender,Occupation,District,Village,Mobile,Household_Size
b_data = []
for i in range(1, 551):
    b_data.append({
        "Beneficiary_ID": i,
        "Name": fake.name(),
        "Age": random.randint(18, 85),
        "Gender": random.choice(["Male", "Female", "Other"]),
        "Occupation": random.choice(occupations),
        "District": random.choice(districts),
        "Village": fake.city(),
        "Mobile": fake.phone_number(),
        "Household_Size": random.randint(1, 8)
    })
pd.DataFrame(b_data).to_csv(os.path.join(DATA_DIR, "Benificiary.csv"), index=False)

print("Seeding Benefits...")
# Benefit_ID,Beneficiary_ID,Benefit_Type,Date_Provided,Status,Remarks
benefit_types = ["Safety Kit", "Training Session", "Gas Detector Install", "Maintenance Check", "Subsidized Equipment"]
statuses = ["Completed", "Pending", "In Progress", "Rejected"]
ben_data = []
for i in range(1, 1251):
    ben_data.append({
        "Benefit_ID": i,
        "Beneficiary_ID": random.randint(1, 550),
        "Benefit_Type": random.choice(benefit_types),
        "Date_Provided": fake.date_between(start_date="-1y", end_date="today").strftime("%Y-%m-%d"),
        "Status": random.choices(statuses, weights=[70, 15, 10, 5])[0],
        "Remarks": fake.sentence() if random.random() > 0.5 else ""
    })
pd.DataFrame(ben_data).to_csv(os.path.join(DATA_DIR, "Benifits.csv"), index=False)

print("Seeding Incidents...")
# Incident_ID,Date,Location,Risk_Level,Incident_Summary
risks = ["CRITICAL", "HIGH", "MEDIUM", "LOW"]
inc_data = []
for i in range(1, 215):
    inc_data.append({
        "Incident_ID": i,
        "Date": fake.date_between(start_date="-6m", end_date="today").strftime("%Y-%m-%d"),
        "Location": fake.address().replace("\n", ", "),
        "Risk_Level": random.choices(risks, weights=[5, 15, 40, 40])[0],
        "Incident_Summary": fake.paragraph(nb_sentences=2)
    })
pd.DataFrame(inc_data).to_csv(os.path.join(DATA_DIR, "incidents.csv"), index=False)

print("Seeding Service Centers...")
# Centre_ID,Centre_Name,District,Address,Contact_Number,Officer_Name
sc_data = []
for i in range(1, 48):
    sc_data.append({
        "Centre_ID": i,
        "Centre_Name": f"{fake.company()} Safety Center",
        "District": random.choice(districts),
        "Address": fake.address().replace("\n", ", "),
        "Contact_Number": fake.phone_number(),
        "Officer_Name": fake.name()
    })
pd.DataFrame(sc_data).to_csv(os.path.join(DATA_DIR, "Service_centers.csv"), index=False)

print("Seeding Stakeholders...")
# Stakeholder_ID,Organization,Stakeholder_Type,Role,District,Contact
types = ["Government", "NGO", "Corporate", "Community"]
roles_st = ["Funding", "Oversight", "Implementation", "Awareness"]
st_data = []
for i in range(1, 155):
    st_data.append({
        "Stakeholder_ID": i,
        "Organization": fake.company(),
        "Stakeholder_Type": random.choice(types),
        "Role": random.choice(roles_st),
        "District": random.choice(districts),
        "Contact": fake.email()
    })
pd.DataFrame(st_data).to_csv(os.path.join(DATA_DIR, "Stakeholders.csv"), index=False)

print("Seeding complete!")
