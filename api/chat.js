export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { question } = req.body;

    if (!question || !question.trim()) {
      return res.status(400).json({ error: "Question is required" });
    }

    const response = await fetch("https://api.openai.com/v1/responses", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: "gpt-5.6",
        instructions:
          "You are an expert JEE tutor for Class 11 students. " +
          "Answer Physics, Chemistry and Mathematics questions clearly. " +
          "Explain step-by-step in simple language, preferably Hinglish. " +
          "Give formulas, concepts and examples when useful. " +
          "Do not skip important steps.",
        input: question
      })
    });

    const data = await response.json();

    if (!response.ok) {
      return res.status(response.status).json({
        error: data.error?.message || "OpenAI API error"
      });
    }

    const answer =
      data.output_text ||
      "Sorry, I could not generate an answer.";

    return res.status(200).json({ answer });

  } catch (error) {
    return res.status(500).json({
      error: "Server error: " + error.message
    });
  }
}
