const json5 = require('json5');

const llmJsonParser = (llm) => {
    if (typeof llm === 'object' && !Array.isArray(llm)) return llm;
    try {
        return json5.parse(llm);
    } catch (err) {
        // Extract JSON content from triple backticks
        const match = llm.match(/```json\s*([\s\S]+?)\s*```/);
        if (match) {
            return json5.parse(match[1]);
        }
        throw new Error('Invalid JSON format');
    }
};

module.exports = llmJsonParser; // CommonJS export

// // Test case
// const raw = 'hi what is your name ```json\n{"a":"b","c":32}\n```';
// console.log(llmJsonParser(raw));  // Output: { a: 'b', c: 32 }
