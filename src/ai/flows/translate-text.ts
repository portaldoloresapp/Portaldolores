
'use server';

/**
 * @fileOverview Translates a block of text into a single language.
 *
 * - translateText - A function that handles the translation process.
 * - TranslateTextInput - The input type for the translateText function.
 * - TranslateTextOutput - The return type for the translateText function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';
import {detectLanguage} from './automatic-language-detection';

const TranslateTextInputSchema = z.object({
  text: z.string().describe('The text to translate.'),
  targetLanguage: z.string().describe('The target language to translate the text into.'),
  sourceLanguage: z.string().optional().describe('The source language of the text. If not provided, it will be detected.'),
});
export type TranslateTextInput = z.infer<typeof TranslateTextInputSchema>;

const TranslateTextOutputSchema = z.object({
  translation: z.string().describe('The translated text.'),
  sourceLanguage: z.string().describe('The detected source language of the text.'),
});
export type TranslateTextOutput = z.infer<typeof TranslateTextOutputSchema>;

export async function translateText(input: TranslateTextInput): Promise<TranslateTextOutput> {
  return translateTextFlow(input);
}

const translateTextFlow = ai.defineFlow(
  {
    name: 'translateTextFlow',
    inputSchema: TranslateTextInputSchema,
    outputSchema: TranslateTextOutputSchema,
  },
  async ({text, targetLanguage, sourceLanguage}) => {
    if (!sourceLanguage) {
      const languageDetection = await detectLanguage({text});
      sourceLanguage = languageDetection.language;
    }

    const prompt = `Translate the following text from ${sourceLanguage} to ${targetLanguage}:
    
    Text:
    ${text}`;

    const llmResponse = await ai.generate({
      prompt,
    });

    return {
      translation: llmResponse.text,
      sourceLanguage,
    };
  }
);
