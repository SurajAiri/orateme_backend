import questionService from "../services/question.service.js";

async function getRandomQuestionByQuesBankUtil(quesBankId, count = 1) {
    // Validate the quesBankId
    if (!quesBankId) {
        const error = new Error("Question Bank ID is required.");
        error.status = 400;
        throw error;
    }

    // Fetch random questions from the question bank
    const randomQuestions = await questionService.getRandomQuestionByQuesBank(quesBankId, count);
    // console.log("we have ",randomQuestions);
    // console.log(randomQuestions);

    // Check if questions were found
    if (!randomQuestions || randomQuestions.length !== count) {
        const error = new Error(`Unable to fetch question list of length: ${count}`);
        error.status = 404;
        throw error;
    }

    return randomQuestions;
}

export default getRandomQuestionByQuesBankUtil