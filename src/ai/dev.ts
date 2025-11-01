
import 'dotenv/config';

import { genkit } from 'genkit';
import { googleAI } from '@genkit-ai/google-genai';

// Keep this file here for local development.
// It is not used in the deployed application.
export default genkit({
  plugins: [googleAI()],
  logLevel: 'debug',
  enableTracingAndMetrics: true,
});
