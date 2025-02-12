import { HumanMessage, SystemMessage } from "@langchain/core/messages";

function generatePrompt(activity, question, transcript, personName) {
  const message = [
    new SystemMessage(
      `You are an advanced speech evaluation assistant for the Orate Me platform. Your role is to assess ${personName}'s speaking skills and provide structured feedback as if directly addressing them.`
    ),
    new HumanMessage(`
You are evaluating ${personName}'s response to the topic "${question}" for the activity "${activity}". Provide a detailed report based on the following criteria:

- Fluency: Smoothness and consistency of speech.  
- Pronunciation: Clarity and correctness of word pronunciation.  
- Vocabulary: Appropriateness and range of word usage.  
- Grammar: Accuracy in sentence structure.  
- Coherence: Logical flow and connectivity of ideas.  

Evaluation Format (JSON):  
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
        "organization_of_ideas": "",
        "ai_organization_of_ideas": "",
        "improved_answer": ""
    }
}

Guidelines:  
- Use clear, concise, and constructive feedback.  
- Provide examples from the transcript to support evaluations.
- strengthen your feedback with specific examples from the transcript.  
- Highlight strengths and weaknesses with actionable suggestions.  
- Ensure logical organization and adherence to the provided JSON structure.  
- Consider ${personName}'s speech length when evaluating. 
- In organization_of_ideas, assess the logical structure of the response. 
- In ai_organization_of_ideas, suggest how the response should be structured for improvement.  
- In improved_answer, provide a revised version of the response based on ai_organization_of_ideas.


Transcript:  
${transcript}  
`),
  ];

  return message;
}

export { generatePrompt };
