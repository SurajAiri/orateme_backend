import { ChatOpenAI } from "@langchain/openai";
import { generatePrompt } from "../../utils/prompt.js";

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
  async evaluateSpeech(activity, question, transcript,personName) {
    try {
      // fixme: uncomment the following lines
      const messages = generatePrompt(activity, question, transcript,personName);
      const response = await this.model.invoke(messages);
      // console.log(response);
      // console.log("\n")
      // console.log(response.content);


    //   const response = {};
    //   response.content = {
    //     "report": {
    //         "candidate_performance": {
    //             "fluency": { "score": 6, "evaluation": "The candidate demonstrated a reasonable level of fluency, with a steady pace throughout the speech. However, there were moments of hesitation and slight pauses that interrupted the flow." },
    //             "pronunciation": { "score": 7, "evaluation": "Overall, the candidate's pronunciation was clear, with most words articulated correctly. There were a few instances of mispronunciation that slightly affected clarity." },
    //             "vocabulary": { "score": 6, "evaluation": "The vocabulary used was appropriate for the topic, but the range was somewhat limited. The candidate could benefit from incorporating more varied and sophisticated terms." },
    //             "grammar": { "score": 5, "evaluation": "There were several grammatical errors and awkward sentence structures that detracted from the overall quality of the speech. For example, phrases like 'the one of the most important wish' and 'we will we all will likely leave' were confusing." },
    //             "coherence": { "score": 6, "evaluation": "The ideas presented were generally coherent, but the logical flow was occasionally disrupted by unclear transitions and repetitive phrasing. More structured argumentation would enhance clarity." }
    //         },
    //         "overall_performance": { "score": 6, "evaluation": "The candidate presented a thoughtful perspective on the topic, but improvements in grammar, vocabulary, and coherence are needed for a more polished delivery." },
    //         "strengths": "The candidate showed a good understanding of the topic and was able to present both sides of the argument, demonstrating critical thinking.",
    //         "weaknesses": "Grammatical inaccuracies and limited vocabulary hindered the overall effectiveness of the speech. Additionally, coherence could be improved with better transitions between ideas.",
    //         "suggestions": "To improve, the candidate should practice speaking with a focus on grammatical accuracy and expanding vocabulary. Engaging in more structured practice sessions could help enhance coherence and fluency."
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
