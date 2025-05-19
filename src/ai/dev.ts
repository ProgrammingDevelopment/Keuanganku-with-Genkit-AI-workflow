import { config } from 'dotenv';
config();

import '@/ai/flows/ask-financial-question.ts';
import '@/ai/flows/personalized-financial-tips.ts';
import '@/ai/flows/ocr-receipt-upload.ts';
import '@/ai/flows/financial-chatbot-flow.ts'; // Added new chatbot flow
