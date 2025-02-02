const { ChatOpenAI } = require("@langchain/openai");
const { generatePrompt } = require("../../utils/prompt");

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
      // fixme: uncomment the following lines
      // const messages = generatePrompt(activity, question, transcript);
      // const response = await this.model.invoke(messages);
      // console.log(response);
      // console.log("\n")
      // console.log(response.content);

      const response = {
        "report": {
            "candidate_performance": {
                "fluency": { "score": 6, "evaluation": "The candidate demonstrated a reasonable level of fluency, with a steady pace throughout the speech. However, there were moments of hesitation and repetition that slightly disrupted the flow." },
                "pronunciation": { "score": 7, "evaluation": "The candidate's pronunciation was generally clear, with most words articulated correctly. Some phrases were slightly unclear, but overall, the speech was understandable." },
                "vocabulary": { "score": 6, "evaluation": "The vocabulary used was appropriate for the topic, but it lacked variety. The candidate relied on common phrases and expressions, which limited the richness of the speech." },
                "grammar": { "score": 5, "evaluation": "There were several grammatical errors, including incorrect verb forms and sentence structures. For example, 'the technology has changed our our daily life' and 'the technology is the synonym of our living of life' indicate issues with grammar." },
                "coherence": { "score": 6, "evaluation": "The ideas presented were generally connected, but the logical flow was sometimes disrupted by unclear transitions and repetitive statements. More structured organization would enhance coherence." }
            },
            "overall_performance": { "score": 6, "evaluation": "The candidate showed a good understanding of the topic and communicated their ideas effectively, but improvements in grammar, vocabulary variety, and coherence are needed for a stronger performance." },
            "strengths": "The candidate displayed a clear understanding of the topic and maintained a steady pace, which contributed positively to the overall delivery.",
            "weaknesses": "Repetitive phrases, grammatical inaccuracies, and a lack of vocabulary variety detracted from the overall effectiveness of the speech.",
            "suggestions": "To improve, the candidate should practice using a wider range of vocabulary and focus on grammatical accuracy. Additionally, organizing thoughts more clearly and using transitional phrases could enhance coherence."
        }
    };    
      return response;
    } catch (error) {
      console.error("Error in evaluation:", error);
      throw new Error("Evaluation failed");
    }
  }
}

module.exports = new OpenaiEvalService();
