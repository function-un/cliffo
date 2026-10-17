const express = require("express");
const fs = require("fs");
const path = require("path");
const app = express();

// Make sure app listens externally
app.listen(3000, "0.0.0.0", () => console.log("Server running on port 3000"));

// Array of all your JSON files
const dataFiles = [
  "phone.json",
  "computer.json",
  "appliance.json",
  "otherpi.json",
  "otherp.json",
  "electrical.json",
  "chandelier.json",
  "buildingmat.json",
  "electronics.json",
  "accessories.json"
];

// Search route
app.get("/search", async (req, res) => {
  const query = req.query.query?.toLowerCase() || "";

  try {
    let results = [];

    for (const file of dataFiles) {
      const filePath = path.join(__dirname, "data", file); // adjust folder if needed
      if (fs.existsSync(filePath)) {
        const data = JSON.parse(fs.readFileSync(filePath, "utf8"));
        // Search in each item
        const matched = data.filter(item =>
          item.pModel.toLowerCase().includes(query)
        );
        results = results.concat(matched);
      }
    }

    res.json(results); // return all matches across all files
  } catch (err) {
    console.error("Search error:", err);
    res.status(500).json({ error: "Server error" });
  }
});