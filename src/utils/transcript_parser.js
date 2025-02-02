

export const parseTranscriptDb= (transcript) => {
    try {
        const paragraphs = transcript["paragraphs"];
        if(!paragraphs) throw new Error("Paragraphs not found");
        const formattedTranscript = paragraphs.flatMap(para => 
            para.sentences.map(sentence => (
                `${sentence.start.toFixed(2)}  ${sentence.end.toFixed(2)} ${sentence.text}`
            ))
        );
        return formattedTranscript.join("\n");

    } catch (err) {
        console.error("TranscriptParserError: ", err);
        throw err;
    }
};
