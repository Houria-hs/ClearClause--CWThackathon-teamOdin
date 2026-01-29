const express = require("express");
const multer = require("multer");
const pdfParse = require("pdf-parse");
console.log("pdfParse type:", typeof pdfParse);
const fs = require("fs");
const path = require("path");

const router = express.Router();


/**
 * Multer config
 * Files go to /uploads temporarily
 */


const upload = multer({
  dest: "uploads/",
  limits: {
    fileSize: 10 * 1024 * 1024 
  }
});

/**
 * Text chunking function
 * Splits by empty lines (paragraphs)
 */
function chunkText(text) {
  return text
    .split(/\n\s*\n/)          // split on empty lines
    .map(chunk => chunk.trim())
    .filter(chunk => chunk.length > 50); // ignore trash chunks
}

/**
 * POST /api/pdf/upload
 * Upload PDF → extract text → chunk → return chunks
 */
router.post("/upload", upload.single("pdf"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No PDF file uploaded" });
    }

    // Read uploaded file
    const filePath = path.resolve(req.file.path);
    const dataBuffer = fs.readFileSync(filePath);

    // Parse PDF
    const pdfData = await pdfParse(dataBuffer);
    // Chunk text
    const chunks = chunkText(pdfData.text);

    // Cleanup 
    fs.unlinkSync(filePath);

    res.status(200).json({
      chunks,
      totalChunks: chunks.length
    });
  } catch (err) {
    console.error("PDF upload error:", err);
    res.status(500).json({
      error: "Failed to process PDF"
    });
  }
});

module.exports = router;
