import express from "express";
import dotenv from "dotenv";
import { getAIReview } from "./services/groqClient.js";

dotenv.config();

const app = express();
app.use(express.json());

app.post("/review", async (req, res) => {
  try {
    const { pr_diff, repo_context } = req.body;

    if (!pr_diff) {
      return res.status(400).json({ error: "Missing PR diff" });
    }

    const review_comment = await getAIReview(pr_diff, repo_context);
    return res.json({ review_comment });
  } catch (err) {
    console.error("❌ AI Review failed:", err);
    return res.status(500).json({ error: "AI Review failed" });
  }
});

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`🚀 AI Reviewer listening on port ${PORT}`);
});
