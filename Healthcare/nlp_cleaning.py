import sys
import pandas as pd
import spacy
import nltk
from pymongo import MongoClient
from transformers import pipeline

# Load NLP Models
nlp = spacy.load("en_core_web_sm")
nltk.download("stopwords")
stopwords = set(nltk.corpus.stopwords.words("english"))

# Connect to MongoDB
client = MongoClient("mongodb://127.0.0.1:27017/")
db = client["healthcare_nlp"]
collection = db["cleaneddatas"]

# Read Uploaded File
file_path = sys.argv[1]
df = pd.read_csv(file_path)

# ✅ Standardize Text Formatting
df["Name"] = df["Name"].str.title()  # Convert to Proper Case
df["Doctor"] = df["Doctor"].str.title()
df["Hospital"] = df["Hospital"].str.title()

# ✅ Standardize Gender Values
df["Gender"] = df["Gender"].str.capitalize()

# ✅ Normalize Blood Type (Remove Spaces)
df["BloodType"] = df["BloodType"].str.strip()

# ✅ Convert Date Fields to Datetime
df["DateofAdmission"] = pd.to_datetime(df["DateofAdmission"], errors="coerce")
df["DischargeDate"] = pd.to_datetime(df["DischargeDate"], errors="coerce")

# ✅ Handle Missing Values
df["InsuranceProvider"].fillna("Not Available", inplace=True)  # Replace missing Insurance Provider
df["BloodType"].fillna("Unknown", inplace=True)
# ✅ Correct Data Types
df["BillingAmount"] = pd.to_numeric(df["BillingAmount"],errors="coerce").fillna(0).round(2)  # Round to 2 decimal places
df["RoomNumber"] = df["RoomNumber"].astype(str)  # Convert Room Number to string


# Store Cleaned Data in MongoDB
cleaned_data = df.to_dict(orient="records")

if cleaned_data:
    collection.insert_many(cleaned_data)
    print(f"✅ Successfully inserted {len(cleaned_data)} records into MongoDB!")
else:
    print("⚠ No records to insert!")
