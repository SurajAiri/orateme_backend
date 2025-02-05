
// const { ChatAnthropic } = require("@langchain/anthropic");
// const dotenv = require("dotenv");
// dotenv.config();
// const { HumanMessage, SystemMessage } = require("@langchain/core/messages");
// const { generatePrompt } = require("../utils/prompt");

// const model = new ChatAnthropic({
//   model: "claude-3-5-sonnet-20240620",
//   apiKey: process.env.ANTHROPIC_API_KEY,
//   temperature: 0
// });

// // console.log(process.env.ANTHROPIC_API_KEY);

// const activity = "Impromptu Speech";
// const question = "How technology has changed our daily life?";
// const transcript = `3.76 - 5.54 : Good morning to all the dignitaries.
// 5.92 - 14.02 : So the topic for my impromptu is, how the technology has changed our our daily life.
// 15.39 - 18.14 : So as we all know, this is the age of science and technology.
// 18.91 - 24.13 : We are seeing the use of technology, mostly Internet in every day of our life.
// 25.07 - 30.29 : In this world, we can't even imagine our life without the use of Internet or the technology.
// 31.61 - 39.87 : Nowadays, we can even imagine that the technology is the synonym of our living of life or quality of life.
// 40.97 - 45.55 : It's more the technology we use is the better our life becomes.
// 47.05 - 50.20 : The better it enhances our life in all the ways.
// 50.89 - 59.16 : It has the technology has its own impact in both from the medical to entertainment, to education, to everything.
// 60.66 - 67.58 : Technology has been the has become the thing that can't be changed.
// 67.88 - 73.26 : So I believe that as we can't live without our phone, even a second.
// 73.88 - 78.43 : So there's a huge impact of technology in our life.
// 78.57 - 79.39 : Thank you.`;

// async function evaluateSpeech() {
//   try {
//     const messages = generatePrompt(activity, question, transcript);
//     const response = await model.invoke(messages);
//     // console.log("Evaluation Report:", response);

//   } catch (error) {
//     console.error("Error in evaluation:", error);
//   }
// }

// evaluateSpeech();
