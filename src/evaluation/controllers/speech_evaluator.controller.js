import llmService from "../services/openai.evaluation.js";

app.post("/evaluate", async (req, res) => {
  try {
    const { activity, question, transcript } = req.body;

    if (!activity || !question || !transcript) {
      return res.status(400).json({ error: "Missing required fields." });
    }

    const evaluation = await llmService.evaluateSpeech(activity, question, transcript);
    res.json({ evaluation });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


