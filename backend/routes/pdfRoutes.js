const express = require("express");
const multer = require("multer");
const fs = require("fs");
const path = require("path");
const crypto = require("crypto");
const { PDFExtract } = require("pdf.js-extract");
const pool = require("../config/db.js");
const verifyToken = require("../middleware/authMiddleware.js");
const { analyzeClause } = require("../services/geminiAnalyzer");

const router = express.Router();
const pdfExtract = new PDFExtract();
const upload = multer({ dest: "uploads/", limits: { fileSize: 10 * 1024 * 1024 } });

function chunkText(text) {
  return text
    .split(/(?<=\.)\s+(?=[A-Z])/)
    .map((chunk) => chunk.trim())
    .filter((chunk) => chunk.length > 80 && chunk.length < 1200);
}

router.post("/upload", verifyToken, upload.single("pdf"), async (req, res) => {
  if (!req.file) return res.status(400).json({ error: "No PDF uploaded" });
  const filePath = path.resolve(req.file.path);

  try {
    pdfExtract.extract(filePath, {}, async (err, data) => {
      try { if (fs.existsSync(filePath)) fs.unlinkSync(filePath); } catch (cleanupError) { console.error("Upload cleanup error:", cleanupError.message); }
      if (err) return res.status(500).json({ error: "Failed to extract PDF text" });

      try {
        const fullText = data.pages.map((page) => page.content.map((item) => item.str).join(" ")).join("\n");
        if (!fullText.trim() || fullText.trim().length < 50) return res.status(422).json({ error: "This file contains no readable text." });
        const chunks = chunkText(fullText);
        if (!chunks.length) return res.status(400).json({ error: "The document is too short." });

        const documentId = crypto.randomUUID();
        await pool.query(
          `INSERT INTO documents (id, user_id, filename, mime_type, extracted_text)
           VALUES ($1, $2, $3, $4, $5)`,
          [documentId, req.userId, req.file.originalname || "Uploaded document", req.file.mimetype || null, fullText]
        );
        return res.json({ documentId, filename: req.file.originalname, chunks });
      } catch (error) {
        console.error("Document persistence error:", error.message);
        return res.status(500).json({ error: "Unable to prepare this document for analysis." });
      }
    });
  } catch (error) {
    if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
    console.error("Upload error:", error.message);
    return res.status(500).json({ error: "Internal server error during upload" });
  }
});

router.post("/analyze", verifyToken, async (req, res) => {
  const { chunks, documentId } = req.body;
  if (!documentId || !Array.isArray(chunks)) return res.status(400).json({ error: "A document and chunks are required." });

  try {
    const owned = await pool.query("SELECT id FROM documents WHERE id = $1 AND user_id = $2", [documentId, req.userId]);
    if (!owned.rows.length) return res.status(404).json({ error: "Document not found or you do not have access." });

    const analyzedChunks = [];
    for (const chunk of chunks) {
      const text = typeof chunk === "string" ? chunk : chunk.text;
      if (typeof text !== "string") continue;
      const analysis = await analyzeClause(text);
      analyzedChunks.push({ text, risk: analysis.risk_level, explanation: analysis.reason });
    }
    await pool.query("UPDATE documents SET analysis = $1, updated_at = NOW() WHERE id = $2 AND user_id = $3", [JSON.stringify(analyzedChunks), documentId, req.userId]);
    return res.json({ documentId, analyzedChunks });
  } catch (error) {
    console.error("Analysis error:", error.message);
    return res.status(500).json({ error: "AI analysis failed" });
  }
});

module.exports = router;
