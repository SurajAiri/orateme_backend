const { ChatOpenAI } = require("@langchain/openai");
const { generatePrompt } = require("../utils/prompt");

class OpenaiEvalService {
  constructor() {
    this.model = new ChatOpenAI({
      model: process.env.OPEN_AI_MODEL_NAME,
      temperature: 0,
    });
  }

  async evaluateSpeech(activity, question, transcript) {
    try {
      const messages = generatePrompt(activity, question, transcript);
      const response = await this.model.invoke(messages);
      return response.content;
    } catch (error) {
      console.error("Error in evaluation:", error);
      throw new Error("Evaluation failed");
    }
  }
}

module.exports = new OpenaiEvalService();
