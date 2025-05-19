import {genkit} from 'genkit';
import {googleAI} from '@genkit-ai/googleai';

// Ensure you have GOOGLE_API_KEY set in your .env file for this to work.
// Example: GOOGLE_API_KEY=YOUR_GEMINI_API_KEY

export const ai = genkit({
  plugins: [googleAI()],
  model: 'googleai/gemini-2.0-flash',
});
