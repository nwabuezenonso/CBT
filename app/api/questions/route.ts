import { connectDB } from "@/lib/mongodb";
import Question from "@/models/Question";

export default async function handler(req, res) {
  await connectDB();

  if (req.method === "GET") {
    const questions = await Question.find();
    return res.status(200).json(questions);
  }

  if (req.method === "POST") {
    try {
      const question = await Question.create(req.body);
      return res.status(201).json(question);
    } catch (error) {
      return res.status(400).json({ error: "Failed to create question" });
    }
  }

  res.status(405).json({ error: "Method not allowed" });
}
