document.addEventListener("DOMContentLoaded", function () {
    const form = document.getElementById("scoringForm");
    const resultsTable = document.querySelector("#resultsTable tbody");
    const ctx = document.getElementById("predictionChart").getContext("2d");
    let chart;

    form.addEventListener("submit", async function (event) {
        event.preventDefault(); // Prevent page refresh

        // Collect form data
        const formData = new FormData(form);
        const values = [[
            formData.get("Name"),
            parseInt(formData.get("Age")),
            formData.get("Gender"),
            formData.get("BloodType"),
            formData.get("MedicalCondition"),
            formData.get("DateofAdmission"),
            formData.get("Doctor"),
            formData.get("Hospital"),
            formData.get("InsuranceProvider"),
            parseFloat(formData.get("BillingAmount")).toFixed(6), // Allow 6 decimal places
            parseInt(formData.get("RoomNumber")),
            formData.get("AdmissionType"),
            formData.get("DischargeDate"),
            formData.get("Medication")
        ]];

        console.log("📤 Sending Data:", values); // Debugging

        try {
            const response = await fetch("/api/ibm-score", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ inputData: values })
            });

            const data = await response.json();
            console.log("✅ Prediction Result:", data);

            if (data.error) {
                alert("Error fetching prediction: " + data.error);
                return;
            }

            // Extract risk score & prediction from IBM response
            const { riskScore, prediction } = data.predictions[0];

            // Update Table
            const row = document.createElement("tr");
            row.innerHTML = `
                <td>${formData.get("Name")}</td>
                <td>${formData.get("MedicalCondition")}</td>
                <td>${riskScore.low || 0} / ${riskScore.medium || 0} / ${riskScore.high || 0}</td>
                <td>${prediction}</td>
            `;
            resultsTable.appendChild(row);

            // Update Chart
            if (chart) chart.destroy();
            chart = new Chart(ctx, {
                type: "bar",
                data: {
                    labels: ["Low Risk", "Medium Risk", "High Risk"],
                    datasets: [{
                        label: "Risk Probability",
                        data: [
                            riskScore.low || 0, 
                            riskScore.medium || 0, 
                            riskScore.high || 0
                        ],
                        backgroundColor: ["green", "yellow", "red"]
                    }]
                }
            });

        } catch (error) {
            console.error("❌ Error:", error);
            alert("Failed to fetch IBM prediction.");
        }
    });
});
