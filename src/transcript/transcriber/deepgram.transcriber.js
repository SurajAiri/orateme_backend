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
    if (error) throw error;

    return result;
  } catch (err) {
    console.error("DeepgramTranscriberWithUrlError: ", err);
    throw err;
  }
};

