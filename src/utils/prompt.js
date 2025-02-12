import { HumanMessage, SystemMessage } from "@langchain/core/messages";


function generatePrompt(activity, question, transcript,personName) {
  const message = [
    new SystemMessage(
      `You are an advanced speech evaluation assistant for the Orate Me platform. Your role is to analyze and provide structured feedback on ${personName}'s speaking skills. Your evaluation should be like you are telling ${personName} directly about their performance.`
    ),
    new HumanMessage(`
You are an examiner evaluating a candidate's speaking test. The candidate spoke on the topic "${question}" for the activity "${activity}". Your task is to assess the candidate's performance and provide a detailed report.

Evaluation Criteria:
Fluency: Assess the candidate's ability to speak smoothly and maintain a steady pace.
Pronunciation: Evaluate the clarity of speech and correctness of word pronunciation.
Vocabulary: Judge the range and appropriateness of the candidate's vocabulary.
Grammar: Analyze grammatical accuracy and sentence structure.
Coherence: Review the logical flow and connectivity of ideas.

Additional Notes:
- Highlight the candidate's strengths and weaknesses.
- Provide an overall performance evaluation, including a final score.
- Assign scores out of 10 for each criterion.

Transcript:
The candidate’s speech transcript is provided below:
${transcript}

Format:
Return the evaluation in JSON format using the following structure:

{
    "report": {
        "candidate_performance": {
            "fluency": { "score": null, "evaluation": "" },
            "pronunciation": { "score": null, "evaluation": "" },
            "vocabulary": { "score": null, "evaluation": "" },
            "grammar": { "score": null, "evaluation": "" },
            "coherence": { "score": null, "evaluation": "" }
        },
        "overall_performance": { "score": null, "evaluation": "" },
        "strengths": "",
        "weaknesses": "",
        "suggestions": "",
        "organization_of_ideas":"",
        "improved_answer":"",
        "ai_organization_of_ideas":"",
    }
}

Guidelines:
- Ensure evaluations are concise, clear, and professional.
- Focus on actionable feedback.
- Also include examples from the transcript to support your evaluation and analysis including strengths, weakness, and other.
- Provide constructive criticism and suggestions for improvement.
- Evaluation should be concise and to the point.
- Use the provided template without modification.
- Organize your evaluation logically and coherently.
- Also consider ${personName}'s content length in transcript while evaluating.
- ai_organization_of_ideas is how you would like to see the organization of ideas in the improved answer.
`),
  ];

  return message;
}

export  { generatePrompt };