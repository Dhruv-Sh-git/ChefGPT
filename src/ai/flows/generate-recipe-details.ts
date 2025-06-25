'use server';

/**
 * @fileOverview Recipe details generator.
 *
 * - generateRecipeDetails - A function that generates detailed recipe steps given a recipe.
 * - GenerateRecipeDetailsInput - The input type for the generateRecipeDetails function.
 * - GenerateRecipeDetailsOutput - The return type for the generateRecipeDetails function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateRecipeDetailsInputSchema = z.object({
  recipeName: z.string().describe('The name of the recipe to generate details for.'),
  ingredients: z.string().describe('The ingredients required for the recipe.'),
});
export type GenerateRecipeDetailsInput = z.infer<typeof GenerateRecipeDetailsInputSchema>;

const GenerateRecipeDetailsOutputSchema = z.object({
  details: z.string().describe('The detailed recipe steps.'),
});
export type GenerateRecipeDetailsOutput = z.infer<typeof GenerateRecipeDetailsOutputSchema>;

export async function generateRecipeDetails(input: GenerateRecipeDetailsInput): Promise<GenerateRecipeDetailsOutput> {
  return generateRecipeDetailsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateRecipeDetailsPrompt',
  input: {schema: GenerateRecipeDetailsInputSchema},
  output: {schema: GenerateRecipeDetailsOutputSchema},
  prompt: `You are a professional chef. Generate detailed cooking steps for the recipe: {{recipeName}}, using the following ingredients: {{ingredients}}. Be as detailed as possible.`,
});

const generateRecipeDetailsFlow = ai.defineFlow(
  {
    name: 'generateRecipeDetailsFlow',
    inputSchema: GenerateRecipeDetailsInputSchema,
    outputSchema: GenerateRecipeDetailsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
