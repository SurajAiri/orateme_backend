// index.js (node example)

const { createClient } = require("@deepgram/sdk");
const fs = require('fs');
require("dotenv").config();

const transcribeUrl = async (audioUrl) => {
  // STEP 1: Create a Deepgram client using the API key
  console.log(process.env.DEEPGRAM_API_KEY);
  const deepgram = createClient(process.env.DEEPGRAM_API_KEY);

  // STEP 2: Call the transcribeUrl method with the audio payload and options
  const { result, error } = await deepgram.listen.prerecorded.transcribeUrl(
    {
      url: audioUrl,
    },
    // STEP 3: Configure Deepgram options for audio analysis
    {
      model: "nova-2",
      smart_format: true,
    }
  );

  if (error) throw error;
  // STEP 4: Print the results
  fs.writeFileSync('res.json', JSON.stringify(result, null, 2));
  if (!error) console.dir(result, { depth: null });
};

transcribeUrl("https://s3.us-east-005.backblazeb2.com/audios-orateme/test.mp3?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=0052ebabdd7a2110000000001%2F20250201%2Fus-east-005%2Fs3%2Faws4_request&X-Amz-Date=20250201T010027Z&X-Amz-Expires=3600&X-Amz-Signature=d19353a945010869a290cac22ebd729bcd2c2761a1dd09722be1aede05870161&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject");