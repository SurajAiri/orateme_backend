import { ChatOpenAI } from "@langchain/openai";
import {  generateServerTranscriberPrompt, generateLocalTranscriberPrompt } from "../../utils/prompt.js";
import e from "cors";

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
  async evaluateSpeech(activity, question, transcript, personName) {
    try {
      // fixme: uncomment the following lines
      const messages = generateLocalTranscriberPrompt(activity, question, transcript,personName);
      const response = await this.model.invoke(messages);
      console.log(response);
      console.log("\n")
      console.log(response.content);

      // const response = {};
      // response.content = {
      //   report: {
      //     candidate_performance: {
      //       fluency: {
      //         score: 50,
      //         evaluation:
      //           "Your speech had some smooth moments, but there were noticeable pauses and hesitations that disrupted the flow.",
      //       },
      //       pronunciation: {
      //         score: 60,
      //         evaluation:
      //           "Most words were pronounced correctly, but some phrases were unclear, which affected overall understanding.",
      //       },
      //       vocabulary: {
      //         score: 55,
      //         evaluation:
      //           "You used basic vocabulary effectively, but there was a lack of variety and complexity that could enhance your message.",
      //       },
      //       grammar: {
      //         score: 45,
      //         evaluation:
      //           "There were several grammatical errors, such as 'which my differ' instead of 'which may differ', which impacted clarity.",
      //       },
      //       coherence: {
      //         score: 50,
      //         evaluation:
      //           "The ideas presented were somewhat connected, but the transition between thoughts was not smooth, making it hard to follow.",
      //       },
      //     },
      //     overall_performance: {
      //       score: 52,
      //       evaluation:
      //         "Your response touched on important aspects of a meaningful life, but it lacked clarity and structure, which hindered overall effectiveness.",
      //     },
      //     evaluation_summary: {
      //       strengths:
      //         "You demonstrated a good understanding of the topic and shared personal insights.",
      //       weaknesses:
      //         "There were issues with fluency, pronunciation, and grammar that affected the overall delivery.",
      //       suggestions:
      //         "Work on speaking more confidently and practice pronunciation to improve clarity. Pay attention to grammar and sentence structure for better coherence.",
      //       organization_of_ideas:
      //         "The response lacked a clear structure and could benefit from a more organized presentation of ideas.",
      //     },
      //     enhanced_response: {
      //       ai_organization_of_ideas:
      //         "To improve clarity and coherence, consider structuring your response in a logical sequence with clear topic sentences and supporting details.",
      //       improved_answer:
      //         "In a revised version, you could start by introducing the concept of a meaningful life and then provide examples of what it means to you. Focus on connecting your ideas smoothly to engage the listener effectively.",
      //     },
      //   },
      // };

      return response.content;
    } catch (error) {
      console.error("Error in evaluation:", error);
      throw new Error("Evaluation failed");
    }
  }
}

export default new OpenaiEvalService();
