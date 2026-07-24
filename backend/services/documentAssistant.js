const { GoogleGenerativeAI } = require("@google/generative-ai");

const MAX_QUESTION_LENGTH = 1_000;
const MAX_CONTEXT_LENGTH = 45_000;
const PRIMARY_MODEL = process.env.GEMINI_MODEL || "gemini-2.5-flash";
const FALLBACK_MODEL = process.env.GEMINI_FALLBACK_MODEL;

const compactAnalysis = (analysis) => Array.isArray(analysis)
  ? analysis.map(({ text, risk, explanation }, index) => ({ clause: index + 1, text, risk, explanation }))
  : [];

const findRelevantSources = (question, analysis) => {
  const terms = question.toLowerCase().match(/[a-z]{4,}/g) || [];
  return compactAnalysis(analysis)
    .map((clause) => ({ ...clause, score: terms.reduce((score, term) => score + (clause.text.toLowerCase().includes(term) ? 1 : 0), 0) }))
    .filter((clause) => clause.score > 0 || clause.risk === "High")
    .sort((a, b) => b.score - a.score)
    .slice(0, 3)
    .map(({ clause, risk, explanation, text }) => ({ clause, risk, explanation, excerpt: text.slice(0, 280) }));
};

const createDocumentFallbackAnswer = ({ question, document }) => {
  const sources = findRelevantSources(question, document.analysis);
  if (!sources.length) {
    return {
      answer: "I couldn't find a clear answer to that in this document. Ask ClearClause's AI service is currently rate-limited, so this response is limited to the matching document analysis.",
      sources,
    };
  }

  const excerpts = sources.map((source) => `Clause ${source.clause}: "${source.excerpt}"`).join("\n\n");
  return {
    answer: `Ask ClearClause's AI service is temporarily rate-limited. Based on the relevant document clauses, here is what the document says:\n\n${excerpts}\n\nReview the full clause before taking action.`,
    sources,
  };
};

async function askDocumentQuestion({ question, document }) {
  const analysis = compactAnalysis(document.analysis);
  if (process.env.NODE_ENV === "test") {
    if (question === "__TEST_GEMINI_QUOTA__") {
      const error = new Error("Simulated Gemini quota error");
      error.status = 429;
      throw error;
    }
    if (question === "__TEST_GEMINI_FAILURE__") {
      const error = new Error("Simulated Gemini provider failure");
      error.status = 503;
      throw error;
    }
    const source = findRelevantSources(question, document.analysis)[0];
    return {
      answer: source
        ? `Based on this document, the most relevant clause is: "${source.excerpt}"`
        : "I couldn't find a clear answer to that in this document.",
      sources: findRelevantSources(question, document.analysis),
    };
  }

  if (!process.env.GEMINI_API_KEY) throw new Error("AI service is not configured.");
  const context = document.extracted_text.slice(0, MAX_CONTEXT_LENGTH);
  const prompt = `You are Ask ClearClause, a careful contract document assistant. Answer the user's question using ONLY the supplied document and its analysis as the primary source.

Rules:
- Clearly distinguish what the document explicitly says from reasonable inferences.
- Never invent clauses, terms, deadlines, fees, or section numbers.
- If the document does not answer the question, say exactly: "I couldn't find a clear answer to that in this document."
- Explain legal language in plain English. Do not present yourself as a lawyer.
- When useful, cite a short quoted excerpt from the document. Include a brief practical caution only when it follows from the document.

Document name: ${document.filename}
Document text:
"""${context}"""

Existing clause analysis (may be incomplete):
${JSON.stringify(analysis)}

User question: ${question}`;

  const client = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
  const generate = async (modelName) => client.getGenerativeModel({ model: modelName }).generateContent(prompt);
  let result;
  try {
    result = await generate(PRIMARY_MODEL);
  } catch (error) {
    if (error.status !== 429 || !FALLBACK_MODEL || FALLBACK_MODEL === PRIMARY_MODEL) throw error;
    console.warn(`Ask ClearClause primary model quota reached; retrying with ${FALLBACK_MODEL}.`);
    result = await generate(FALLBACK_MODEL);
  }
  const answer = result.response.text()?.trim();
  if (!answer) throw new Error("The AI returned an empty response.");

  return { answer, sources: findRelevantSources(question, document.analysis) };
}

module.exports = { askDocumentQuestion, createDocumentFallbackAnswer, MAX_QUESTION_LENGTH };
