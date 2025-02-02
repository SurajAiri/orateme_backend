const { ChatOpenAI } = require("@langchain/openai");
const { generatePrompt } = require("../utils/prompt");

class OpenaiEvalService {
  constructor() {
    this.model = new ChatOpenAI({
      model: process.env.OPEN_AI_MODEL_NAME,
      temperature: 0,
    });
  }


  /**
   * Evaluates a speech transcript using OpenAI's language model.
   * @param {Object} activity - The activity object containing evaluation context
   * @param {string} question - The question or prompt for evaluation
   * @param {string} transcript - The speech transcript to be evaluated
   * @returns {Promise<string>} The evaluation response content from the model
   * @throws {Error} When evaluation fails
   */
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
