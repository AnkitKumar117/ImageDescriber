import fs from 'fs';
import path from 'path';
import axios from 'axios';

export const sendToLlava = async (imagePath: string, prompt : string): Promise<string> => {
  try {
    const fileBuffer = fs.readFileSync(path.resolve(imagePath));
    const base64Image = fileBuffer.toString('base64');
    const response = await axios.post(process.env.LLAVA_API_URL!, {
      model: "llava",
      stream :false,
      prompt: prompt,
      images: [base64Image],
    }, {
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Response structure for Ollama-based LLaVA
    const text = response.data?.response || 'No response from model';
    return text;
  } catch (err) {
    console.error('Error in sendToLlava:', err);
    throw err;
  }
};
