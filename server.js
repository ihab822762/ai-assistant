import express from "express";
import OpenAI from "openai";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

dotenv.config();

const app = express();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

app.use(express.json({ limit: "10mb" }));

app.use(express.static(path.join(__dirname, "public")));

app.post("/api/chat", async (req, res) => {
  try {
    const { messages } = req.body;

    if (!Array.isArray(messages)) {
      return res.status(400).json({
        error: "الرسائل غير صحيحة"
      });
    }

    const response = await client.responses.create({
      model: "gpt-5.6-luna",
      input: messages
    });

    res.json({
      answer: response.output_text || "لم يتم إنشاء رد."
    });

  } catch (error) {
    console.error("OpenAI Error:", error);

    res.status(500).json({
      error: "حدث خطأ في الاتصال بالذكاء الاصطناعي."
    });
  }
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
