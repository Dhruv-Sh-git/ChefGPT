// src/ai/flows/suggest-recipe-modifications.ts
'use server';
/**
 * @fileOverview Recipe modification suggestion AI agent.
 *
 * - suggestRecipeModifications - A function that handles the recipe modification suggestion process.
 * - SuggestRecipeModificationsInput - The input type for the suggestRecipeModifications function.
 * - SuggestRecipeModificationsOutput - The return type for the suggestRecipeModifications function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SuggestRecipeModificationsInputSchema = z.object({
  recipe: z.string().describe('The original recipe to modify.'),
  dietaryRestrictions: z.string().describe('Dietary restrictions or ingredient substitutions to apply.'),
});
export type SuggestRecipeModificationsInput = z.infer<typeof SuggestRecipeModificationsInputSchema>;

const SuggestRecipeModificationsOutputSchema = z.object({
  modifiedRecipe: z.string().describe('The modified recipe based on the input dietary restrictions.'),
});
export type SuggestRecipeModificationsOutput = z.infer<typeof SuggestRecipeModificationsOutputSchema>;

export async function suggestRecipeModifications(input: SuggestRecipeModificationsInput): Promise<SuggestRecipeModificationsOutput> {
  return suggestRecipeModificationsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'suggestRecipeModificationsPrompt',
  input: {schema: SuggestRecipeModificationsInputSchema},
  output: {schema: SuggestRecipeModificationsOutputSchema},
  prompt: `You are a recipe modification expert. Given a recipe and dietary restrictions, you will modify the recipe to adhere to the specified restrictions.

Original Recipe: {{{recipe}}}
Dietary Restrictions/Substitutions: {{{dietaryRestrictions}}}

Modified Recipe:`,
});

const suggestRecipeModificationsFlow = ai.defineFlow(
  {
    name: 'suggestRecipeModificationsFlow',
    inputSchema: SuggestRecipeModificationsInputSchema,
    outputSchema: SuggestRecipeModificationsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
