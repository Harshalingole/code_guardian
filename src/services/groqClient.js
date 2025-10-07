import Groq from "groq-sdk";
import dotenv from "dotenv";
import fs from "fs";
import path from "path";
dotenv.config();

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

export async function getAIReview(pr_diff, repo_context) {
  const promptTemplate = fs.readFileSync(path.join(__dirname, "../../ai/prompt-template.md"), "utf-8");
  const guidelines = fs.readFileSync(path.join(__dirname, "../../ai/company-guidelines.md"), "utf-8");

  const fullPrompt = `
${promptTemplate}

---
Repository Context: ${repo_context || "N/A"}
Company Guidelines:
${guidelines}

Pull Request Diff:
${pr_diff}
`;

  const response = await groq.chat.completions.create({
    model: "mixtral-8x7b-32768", // or any LLM model you prefer
    messages: [{ role: "user", content: fullPrompt }],
  });

  return response.choices[0]?.message?.content || "No review feedback generated.";
}
