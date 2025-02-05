import { createClient } from "@deepgram/sdk";


// fixMe: uncomment the deepgram logic
 export const transcribeAudioWithUrl = async (audioUrl, model = "nova-2") => {
  try {
    const transcriber = createClient(process.env.DEEPGRAM_API_KEY);

    const { result, error } = await transcriber.listen.prerecorded.transcribeUrl(
      {
        url: audioUrl,
      },
      {
        model: model,
        smart_format: true,
      }
    );
    console.log("\n\ndeepgram: ",typeof(result),result);
    if (error) throw error;

    // const result = JSON.parse(fs.readFileSync("./res1.json", 'utf8'));
    return result;
  } catch (err) {
    console.error("DeepgramTranscriberWithUrlError: ", err);
    throw err;
  }
};

