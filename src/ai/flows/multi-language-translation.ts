'use server';

/**
 * @fileOverview Translates a block of text into multiple languages.
 *
 * - multiLanguageTranslation - A function that handles the translation process.
 * - MultiLanguageTranslationInput - The input type for the multiLanguageTranslation function.
 * - MultiLanguageTranslationOutput - The return type for the multiLanguageTranslation function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const MultiLanguageTranslationInputSchema = z.object({
  text: z.string().describe('The text to translate.'),
  targetLanguages: z
    .array(z.string())
    .describe('The list of target languages to translate the text into.'),
  sourceLanguage: z.string().optional().describe('The source language of the text. If not provided, it will be detected.'),
});

export type MultiLanguageTranslationInput = z.infer<typeof MultiLanguageTranslationInputSchema>;

const MultiLanguageTranslationOutputSchema = z.record(z.string(), z.string()).describe('A map of target languages to translated texts.');

export type MultiLanguageTranslationOutput = z.infer<typeof MultiLanguageTranslationOutputSchema>;

export async function multiLanguageTranslation(input: MultiLanguageTranslationInput): Promise<MultiLanguageTranslationOutput> {
  return multiLanguageTranslationFlow(input);
}

const multiLanguageTranslationPrompt = ai.definePrompt({
  name: 'multiLanguageTranslationPrompt',
  input: {schema: MultiLanguageTranslationInputSchema},
  output: {schema: MultiLanguageTranslationOutputSchema},
  prompt: `You are a translation expert. Translate the given text into the following languages:

  {{#each targetLanguages}}
  - {{this}}
  {{/each}}

  Source Text: {{{text}}}

  Return a JSON object where the keys are the target languages and the values are the translated texts.
  {
    "target_language_1": "translated text 1",
    "target_language_2": "translated text 2",
    ...
  }
  `,
});

const multiLanguageTranslationFlow = ai.defineFlow(
  {
    name: 'multiLanguageTranslationFlow',
    inputSchema: MultiLanguageTranslationInputSchema,
    outputSchema: MultiLanguageTranslationOutputSchema,
  },
  async input => {
    const {output} = await multiLanguageTranslationPrompt(input);
    return output!;
  }
);
