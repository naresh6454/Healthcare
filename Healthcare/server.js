const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");
const axios = require("axios");
const {parser} = require("json2csv")
const API_KEY = process.env.IBM_API_KEY;
const IBM_AUTH_URL = "https://iam.cloud.ibm.com/identity/token";
const SCORING_URL = "https://us-south.ml.cloud.ibm.com/ml/v4/deployments/d2e18e59-9f49-4707-9561-4cd9e74c7d6d/predictions?version=2021-05-01";

require("dotenv").config();

const app = express();
app.use(express.json());
app.use(cors());

// Set up EJS
app.set("view engine", "ejs");
app.use(express.static('public'));
app.use(cors());
app.set("views", path.join(__dirname, "views"));

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Define Schema & Model
const DataSchema = new mongoose.Schema({
  Name: String,
  Gender: String,
  BloodType: String,
  MedicalCondition: String,
  Medication: String,
  TestResults: String,
  BillingAmount: Number,
  InsuranceProvider:String,
});

const CleanedData = mongoose.model("CleanedData", DataSchema);

// Route to fetch cleaned data and render it using EJS
app.get("/", async (req, res) => {
  try {
    const data = await CleanedData.find();
    res.render("dashboard", { data });
  } catch (err) {
    res.status(500).send("Error fetching data");
  }
});
app.get("/visualizations", (req, res) => {
  res.render("visualizations");
});

app.get("/api/patient-stats", async (req, res) => {
  try {
      const stats = await CleanedData.aggregate([
          { $group: { _id: "$MedicalCondition", count: { $sum: 1 } } }
      ]);
      res.json(stats);
  } catch (err) {
      console.error("Error fetching patient stats:", err);
      res.status(500).json({ error: "Failed to fetch patient stats" });
  }
});
app.get("/api/gender-stats", async (req, res) => {
  try {
      const stats = await CleanedData.aggregate([
          { $group: { _id: "$Gender", count: { $sum: 1 } } }
      ]);
      res.json(stats);
  } catch (err) {
      console.error("Error fetching gender stats:", err);
      res.status(500).json({ error: "Failed to fetch gender stats" });
  }
});
app.get("/api/test-results", async (req, res) => {
  try {
      const stats = await CleanedData.aggregate([
          { $group: { _id: "$TestResults", count: { $sum: 1 } } }
      ]);
      res.json(stats);
  } catch (err) {
      console.error("Error fetching test results stats:", err);
      res.status(500).json({ error: "Failed to fetch test results" });
  }
});
app.get("/api/billing-stats", async (req, res) => {
  try {
      const stats = await CleanedData.aggregate([
          {
              $bucket: {
                  groupBy: "$BillingAmount",
                  boundaries: [0, 10000, 50000, 100000], // Adjust range as needed
                  default: "High",
                  output: { count: { $sum: 1 } }
              }
          }
      ]);
      res.json(stats.map(entry => entry.count));
  } catch (err) {
      console.error("Error fetching billing stats:", err);
      res.status(500).json({ error: "Failed to fetch billing stats" });
  }
});

app.get("/api/blood-group-stats", async (req, res) => {
  try {
      const stats = await CleanedData.aggregate([
          { $group: { _id: "$Blood Type", count: { $sum: 1 } } }
      ]);

      res.json(stats);
  } catch (err) {
      console.error("❌ Error fetching blood group stats:", err);
      res.status(500).json({ error: "Failed to fetch blood group data" });
  }
});
app.get("/trans-anomaly", async (req, res) => {
  try {
      const highestBilling = await CleanedData.findOne().sort({ "BillingAmount": -1 }).select("BillingAmount");
      const billingThreshold = highestBilling ? highestBilling["BillingAmount"] * 0.98 : 100000;  

      console.log(`🔍 Using Billing Threshold: ${billingThreshold}`);

      // Fetch fraud transactions (billing above threshold)
      const fraudCases = await CleanedData.find({ "BillingAmount": { $gt: billingThreshold } }).lean();
      console.log("🚨 Fraud Transactions Found:", fraudCases.length);

      res.render("anomaly-detection", { fraudCases, highRiskPatients: null });

  } catch (err) {
      console.error("❌ Error fetching anomaly data:", err);
      res.status(500).json({ error: "Failed to fetch fraud transactions" });
  }
});

app.get("/risk/cancer", async (req, res) => {
  try {
      const highRiskPatients = await CleanedData.find({
          "TestResults": "Abnormal",
          "MedicalCondition": "Cancer"
      }).lean();
      console.log("⚠ High-Risk Patients Found:", highRiskPatients.length);

      res.render("anomaly-detection", { fraudCases: null, highRiskPatients });

  } catch (err) {
      console.error("❌ Error fetching high-risk patient data:", err);
      res.status(500).json({ error: "Failed to fetch high-risk patients" });
  }
});
app.get("/risk/diabetes", async (req, res) => {
  try {
      const highRiskPatients = await CleanedData.find({
          "TestResults": "Abnormal",
          "MedicalCondition": "Diabetes"
      }).lean();
      console.log("⚠ High-Risk Patients Found:", highRiskPatients.length);

      res.render("anomaly-detection", { fraudCases: null, highRiskPatients });

  } catch (err) {
      console.error("❌ Error fetching high-risk patient data:", err);
      res.status(500).json({ error: "Failed to fetch high-risk patients" });
  }
});
app.get("/risk/obesity", async (req, res) => {
  try {
      const highRiskPatients = await CleanedData.find({
          "TestResults": "Abnormal",
          "MedicalCondition": "Obesity"
      }).lean();
      console.log("⚠ High-Risk Patients Found:", highRiskPatients.length);

      res.render("anomaly-detection", { fraudCases: null, highRiskPatients });

  } catch (err) {
      console.error("❌ Error fetching high-risk patient data:", err);
      res.status(500).json({ error: "Failed to fetch high-risk patients" });
  }
});
app.get("/risk/asthma", async (req, res) => {
  try {
      const highRiskPatients = await CleanedData.find({
          "TestResults": "Abnormal",
          "MedicalCondition": "Asthma"
      }).lean();
      console.log("⚠ High-Risk Patients Found:", highRiskPatients.length);

      res.render("anomaly-detection", { fraudCases: null, highRiskPatients });

  } catch (err) {
      console.error("❌ Error fetching high-risk patient data:", err);
      res.status(500).json({ error: "Failed to fetch high-risk patients" });
  }
});
app.get("/risk/hypertense", async (req, res) => {
  try {
      const highRiskPatients = await CleanedData.find({
          "TestResults": "Abnormal",
          "MedicalCondition": "Hypertension"
      }).lean();
      console.log("⚠ High-Risk Patients Found:", highRiskPatients.length);

      res.render("anomaly-detection", { fraudCases: null, highRiskPatients });

  } catch (err) {
      console.error("❌ Error fetching high-risk patient data:", err);
      res.status(500).json({ error: "Failed to fetch high-risk patients" });
  }
});
app.get("/risk/arthritis", async (req, res) => {
  try {
      const highRiskPatients = await CleanedData.find({
          "TestResults": "Abnormal",
          "MedicalCondition": "Arthritis"
      }).lean();
      console.log("⚠ High-Risk Patients Found:", highRiskPatients.length);

      res.render("anomaly-detection", { fraudCases: null, highRiskPatients });

  } catch (err) {
      console.error("❌ Error fetching high-risk patient data:", err);
      res.status(500).json({ error: "Failed to fetch high-risk patients" });
  }
});

app.get('/anomaly', (req,res)=>{
  res.render("anomaly")
});

app.get('/upload', (req,res)=>{
  res.render("upload")
});
//ibm
app.get("/ibm-score",(req,res)=>{
  res.render("index")
})
app.post("/api/ibm-score", async (req, res) => {
    try {
        const { inputData } = req.body;
        const result = await runScoring(inputData);
        res.json(result);
    } catch (error) {
        console.error("IBM Scoring API Error:", error);
        res.status(500).json({ error: "Failed to fetch IBM prediction" });
    }
});


// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running at \x1b[36mhttp://localhost:${PORT}\x1b[0m`);
});
