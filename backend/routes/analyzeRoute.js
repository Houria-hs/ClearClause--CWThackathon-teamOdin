const express = require("express");
const router = express.Router();
const { analyzeClause } = require("../services/riskAnalyzer"); 

/**
 * POST /api/pdf/analyze
 * Receive array of chunks → send to AI → return analyzed chunks
 */
router.post("/analyze", async (req, res) => {

  
  try {
    const { chunks } = req.body;

    console.log("Analyzing chunks:", chunks.length);

    const analyzedChunks = await Promise.all(
      chunks.map(async (text) => {
        const analysis = await analyzeClause(text);
        return {
          text,
          risk: analysis.risky === "yes" ? analysis.risk_level : "Low",
          explanation: analysis.reason
        };
      })
    );

    

    res.status(200).json({ analyzedChunks });
  } catch (err) {
    console.error("ANALYZE ROUTE ERROR:", err);
    res.status(500).json({ error: "AI analysis failed" });
  }
});


module.exports = router;

