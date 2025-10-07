import Groq from "groq-sdk";
import dotenv from "dotenv";
import PROMPT from "../prompt.js";
import GUIDELINES from "../guidlines.js";
dotenv.config();

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

export async function getAIReview(pr_diff, repo_context) {
  
  const fullPrompt = `
${PROMPT}

---
Repository Context: ${repo_context || "N/A"}
Company Guidelines:
${GUIDELINES}

Pull Request Diff:
${pr_diff}
`;

  const response = await groq.chat.completions.create({
    model: "llama-3.3-70b-versatile",
    messages: [{ role: "user", content: fullPrompt }],
  });

  return response.choices[0]?.message?.content || "No review feedback generated.";
}
