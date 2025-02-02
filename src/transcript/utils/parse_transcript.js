

export function parseTranscriptDeepgram(data) {
    // onnext: words are skipped for now ; have separate db for transcript and then have words and paragraphs in it

  try {
    data = data["results"]["channels"][0]["alternatives"][0];

    // const words = data["words"].map(word => ({
    //     word: word.word,
    //     start: word.start,
    //     end: word.end,
    //     confidence: word.confidence
    // }));
    const paragraphs = data["paragraphs"]["paragraphs"];
    return { paragraphs };
  } catch (err) {
    console.error("DeepgramTranscriptParserError: ", err);
    throw err;
  }
}

