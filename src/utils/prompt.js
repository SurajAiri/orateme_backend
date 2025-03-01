import { HumanMessage, SystemMessage } from "@langchain/core/messages";

function generateServerTranscriberPrompt(
  activity,
  question,
  transcript,
  personName
) {
  const message = [
    new SystemMessage(
      `You are an advanced speech evaluation assistant for the Orate Me platform. Your role is to assess ${personName}'s speaking skills and provide structured feedback as if directly addressing them.`
    ),
    new HumanMessage(`
You are evaluating ${personName}'s response to the topic "${question}" for the activity "${activity}". Provide a detailed report based on the following criteria:
<User's Answer>
${transcript}
</User's Answer>

Before evaluating, please check the following conditions:
1. If the response is empty or too short (less than 3 complete sentences), set all scores to 0 and include: "Response is too short for meaningful evaluation."
2. If the response is off-topic, set all scores to 0 and include: "Response is not relevant to the topic."
3. If both conditions apply, set all scores to 0 and explain both issues.

Evaluation Criteria:  
- Content Relevance: How well the candidate addresses the topic and supports ideas.  
- Organization: Clarity and logical flow, including a clear structure with an introduction, body, and conclusion.  
- Argumentation: Quality and persuasiveness of the candidate's reasoning, with appropriate examples.  
- Language Mechanics: Accuracy in grammar and vocabulary usage throughout the response.  
- Engagement: Ability to captivate the listener through expressive and varied language.

Evaluation Format (JSON):  
{
  "report": {
    "candidate_performance": {
      "content_relevance": { "score": null, "evaluation": "" },
      "organization": { "score": null, "evaluation": "" },
      "argumentation": { "score": null, "evaluation": "" },
      "language_mechanics": { "score": null, "evaluation": "" },
      "engagement": { "score": null, "evaluation": "" }
    },
    "overall_performance": { "score": null, "evaluation": "" },
    "evaluation_summary": {
      "strengths": "",
      "weaknesses": "",
      "suggestions": "",
      "organization_of_ideas": ""
    },
    "enhanced_response": {
      "ai_organization_of_ideas": "",
      "improved_answer": "",
      "mind_map": ""
    }
  }
}

Guidelines for Evaluation:
- If the response is empty or off-topic, return 0 for all criteria and provide a detailed explanation in each evaluation field.
- Use clear, concise, and constructive feedback, citing specific examples from the transcript.
- Provide scores out of 100 for each criterion with two-decimal precision.
- Highlight both strengths and weaknesses, and offer actionable suggestions for improvement.
- Consider ${personName}'s speech length and relevance when assigning scores.
- In organization_of_ideas, assess how well the candidate's ideas are structured.
- In ai_organization_of_ideas, suggest a more effective structure for clarity.
- In improved_answer, provide a revised version of the candidate's response based on your suggestions.
- Mind Map Creation: Also, create a text-based mind map that outlines the organization of ideas from the candidate's response. The mind map should clearly depict the main idea at the center with branches for supporting ideas, details, and conclusions, serving as a note for the user. (Proper indentation and formatting are recommended.)
`),
  ];

  return message;
}

function generateLocalTranscriberPrompt(
  activity,
  question,
  transcript,
  personName
) {
  const message = [
    new SystemMessage(
      `You are an advanced speech evaluation assistant for the Orate Me platform. Your role is to assess ${personName}'s speaking skills and provide structured feedback as if directly addressing them.`
    ),
    new HumanMessage(`
You are evaluating ${personName}'s response to the topic "${question}" for the activity "${activity}". Note that this transcription was generated using a tiny transcription model. As a result, the transcript may contain minor errors such as misinterpreted words, omissions, or other inaccuracies that do not reflect the candidate's true performance.

Provide a detailed report based on the following criteria:
<User's Answer>
${transcript}
</User's Answer>

Before evaluating, please check the following conditions:
1. If the response is empty or too short (less than 3 complete sentences), set all scores to 0 and include: "Response is too short for meaningful evaluation."
2. If the response is off-topic, set all scores to 0 and include: "Response is not relevant to the topic."
3. If both conditions apply, set all scores to 0 and explain both issues.

Evaluation Criteria:  
- Content Relevance: How well the candidate addresses the topic and supports ideas.  
- Organization: Clarity and logical flow, including a clear structure with an introduction, body, and conclusion.  
- Argumentation: Quality and persuasiveness of the candidate's reasoning, with appropriate examples.  
- Language Mechanics: Accuracy in grammar and vocabulary usage throughout the response.  
- Engagement: Ability to captivate the listener through expressive and varied language.

Evaluation Format (JSON):  
{
  "report": {
    "candidate_performance": {
      "content_relevance": { "score": null, "evaluation": "" },
      "organization": { "score": null, "evaluation": "" },
      "argumentation": { "score": null, "evaluation": "" },
      "language_mechanics": { "score": null, "evaluation": "" },
      "engagement": { "score": null, "evaluation": "" }
    },
    "overall_performance": { "score": null, "evaluation": "" },
    "evaluation_summary": {
      "strengths": "",
      "weaknesses": "",
      "suggestions": "",
      "organization_of_ideas": ""
    },
    "enhanced_response": {
      "ai_organization_of_ideas": "",
      "improved_answer": "",
      "mind_map": ""
    }
  }
}

Guidelines for Evaluation:
- Account for potential transcription errors caused by the tiny transcription model. Disregard minor misinterpretations or omissions when evaluating the candidate’s performance.
- If the response is empty or off-topic, return 0 for all criteria and provide a detailed explanation in each evaluation field.
- Use clear, concise, and constructive feedback, citing specific examples from the transcript.
- Provide scores out of 100 for each criterion with two-decimal precision.
- Highlight both strengths and weaknesses, and offer actionable suggestions for improvement.
- Consider ${personName}'s speech length and relevance when assigning scores.
- In organization_of_ideas, assess how well the candidate's ideas are structured.
- In ai_organization_of_ideas, suggest a more effective structure for clarity.
- In improved_answer, provide a revised version of the candidate's response based on your suggestions.
- Mind Map Creation: Also, create a text-based mind map that outlines the organization of ideas from the candidate's response. The mind map should depict the main idea at the center with branches for supporting ideas, details, and conclusions, serving as a note for the user.
`),
  ];

  return message;
}

export { generateServerTranscriberPrompt, generateLocalTranscriberPrompt };
