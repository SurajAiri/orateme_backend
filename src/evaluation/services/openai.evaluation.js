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

    //   const response = {};
    //   response.content = {
    //     "report": {
    //         "candidate_performance": {
    //             "content_relevance": {
    //                 "score": 0,
    //                 "evaluation": "Response is not relevant to the topic."
    //             },
    //             "organization": {
    //                 "score": 0,
    //                 "evaluation": "Response is not relevant to the topic."
    //             },
    //             "argumentation": {
    //                 "score": 0,
    //                 "evaluation": "Response is not relevant to the topic."
    //             },
    //             "language_mechanics": {
    //                 "score": 0,
    //                 "evaluation": "Response is not relevant to the topic."
    //             },
    //             "engagement": {
    //                 "score": 0,
    //                 "evaluation": "Response is not relevant to the topic."
    //             }
    //         },
    //         "overall_performance": {
    //             "score": 0,
    //             "evaluation": "Response is not relevant to the topic."
    //         },
    //         "evaluation_summary": {
    //             "strengths": "",
    //             "weaknesses": "The response did not address the topic of morality existing without religion, leading to a complete lack of relevant content.",
    //             "suggestions": "Focus on the topic by discussing philosophical perspectives on morality independent of religious frameworks. Consider examples from secular ethics or moral philosophy.",
    //             "organization_of_ideas": "There was no clear organization due to the lack of relevant content."
    //         },
    //         "enhanced_response": {
    //             "ai_organization_of_ideas": "1. Introduction: Define morality and its traditional ties to religion. 2. Body: Discuss secular moral frameworks (e.g., utilitarianism, Kantian ethics). 3. Examples: Provide real-world instances of moral behavior without religious influence. 4. Conclusion: Summarize the argument that morality can exist independently of religion.",
    //             "improved_answer": "Morality can indeed exist without religion. Many philosophical frameworks, such as utilitarianism and Kantian ethics, provide a basis for moral reasoning that does not rely on religious beliefs. For instance, secular humanists argue that ethical behavior can be derived from human needs and societal well-being rather than divine command. This suggests that moral principles can be grounded in reason and empathy, allowing for a robust moral framework independent of religious doctrine.",
    //             "mind_map": "Morality Without Religion\n  ├── Definition of Morality\n  ├── Secular Moral Frameworks\n  │   ├── Utilitarianism\n  │   └── Kantian Ethics\n  ├── Real-World Examples\n  │   ├── Secular Humanism\n  │   └── Ethical Behavior in Society\n  └── Conclusion\n      └── Summary of Independent Morality"
    //         }
    //     }
    // };
      
      return response.content;
    } catch (error) {
      console.error("Error in evaluation:", error);
      throw new Error("Evaluation failed");
    }
  }
}

export default new OpenaiEvalService();
