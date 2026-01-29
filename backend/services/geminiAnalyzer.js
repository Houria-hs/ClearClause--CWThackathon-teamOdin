const { GoogleGenerativeAI } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const model = genAI.getGenerativeModel({
  model: "gemini-2.5-flash" // 
});

async function analyzeClause(clauseText) {
  if (typeof clauseText !== "string" || clauseText.length < 20) {
    return {
      risky: "no",
      risk_level: "Low",
      reason: "Clause too short"
    };
  }

  const prompt = `
You are a Legal Risk Detector. 

CONTEXT: 
The user is uploading a document. It might be a Contract, a Terms of Service, or a Resume (CV).
- If the document is a RESUME or CV: These are generally "Low Risk". Only mark as risky if there is a weird data-sharing clause.
- If it is a CONTRACT: Look for hidden traps.

RULES:
1. If the text is just a list of skills, education, or contact info -> Low Risk.
2. Only "yes" to risky if you find actual legal traps (e.g., "Company owns your soul").

FORMAT:
{
  "risky": "yes" | "no",
  "risk_level": "Low" | "Medium" | "High",
  "reason": "Short explanation"
}

TEXT TO ANALYZE:
"""${clauseText}"""
`;

  try {
    const result = await model.generateContent(prompt);
    const text = result.response.text();

    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) throw new Error("Invalid JSON");

    return JSON.parse(jsonMatch[0]);
  } catch (err) {
    console.error("GEMINI ERROR:", err.message);
    const isRateLimit = err.message.includes("429") || err.message.includes("quota");
    return {
      risky: "no",
      risk_level: "Low",
      reason: isRateLimit ? "API Limit reached. Wait 1 minute." : "Technical error."    };
  }
}

module.exports = { analyzeClause };
