const questionService = require("../services/question.service");

async function getRandomQuestionByQuesBankUtil(quesBankId, count = 1) {
    console.log(quesBankId);
    console.log(count);
    // Validate the quesBankId
    if (!quesBankId) {
        const error = new Error("Question Bank ID is required.");
        error.status = 400;
        throw error;
    }

    // Fetch random questions from the question bank
    const randomQuestions = await questionService.getRandomQuestionByQuesBank(quesBankId, count);

    // Check if questions were found
    if (!randomQuestions || randomQuestions.length !== count) {
        const error = new Error(`Specified no. '${count}' of Questions not found`);
        error.status = 404;
        throw error;
    }

    return randomQuestions;
}

module.exports = getRandomQuestionByQuesBankUtil