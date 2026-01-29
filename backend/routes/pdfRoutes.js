const express = require("express");
const multer = require("multer");
const fs = require("fs");
const path = require("path");
const { PDFExtract } = require("pdf.js-extract");
const { analyzeClause } = require("../services/geminiAnalyzer");

const router = express.Router();
const pdfExtract = new PDFExtract();

const upload = multer({
  dest: "uploads/",
  limits: { fileSize: 10 * 1024 * 1024 }
});

function chunkText(text) {
  return text
    .split(/(?<=\.)\s+(?=[A-Z])/)
    .map(c => c.trim())
    .filter(c => c.length > 80 && c.length < 1200);
}

/* ---------- UPLOAD & EXTRACT ---------- */
router.post("/upload", upload.single("pdf"), async (req, res) => {
  if (!req.file) return res.status(400).json({ error: "No PDF uploaded" });

  const filePath = path.resolve(req.file.path);


  pdfExtract.extract(filePath, {}, (err, data) => {
    fs.unlinkSync(filePath);

    if (err) {
      console.error("PDF Extraction Error:", err);
      return res.status(500).json({ error: "Failed to extract PDF text" });
    }

    const fullText = data.pages
      .map(page => page.content.map(item => item.str).join(" "))
      .join("\n");

    if (!fullText.trim()) {
      return res.status(400).json({
        error: "No readable text found. Scanned PDFs not supported."
      });
    }
    if (!extractedText || extractedText.trim().length < 50) {
      return res.status(422).json({ 
        error: "This file contains no readable text. Please ensure it is a clear document or image." 
      });
    }
    
    const chunks = chunkText(fullText);

    if (chunks.length === 0) {
      return res.status(400).json({ error: "The document is too short or unreadable." });
    }
    res.json({ chunks });
  });
});

/* ---------- ANALYZE ---------- */
router.post("/analyze", async (req, res) => {
  try {
    const { chunks } = req.body;
    if (!Array.isArray(chunks)) {
      return res.status(400).json({ error: "Invalid chunks" });
    }

    const analyzedChunks = [];
    
for (const chunk of chunks) {
  const text = typeof chunk === "string" ? chunk : chunk.text;

  const analysis = await analyzeClause(text);

  analyzedChunks.push({
    text,
    risk: analysis.risk_level,
    explanation: analysis.reason
  });
}


    res.json({ analyzedChunks });
  } catch (err) {
    console.error("Analysis Error:", err);
    res.status(500).json({ error: "AI analysis failed" });
  }
});

module.exports = router;
