// This file holds the Genkit flow for generating recipes based on user-provided ingredients.
// It defines the input and output schemas, the AI prompt, and the flow itself.

'use server';

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateRecipeInputSchema = z.object({
  ingredients: z
    .string()
    .describe('A comma-separated list of ingredients the user has available.'),
  dietaryPreferences: z
    .string()
    .optional()
    .describe('Optional dietary preferences or restrictions (e.g., vegetarian, gluten-free).'),
});

export type GenerateRecipeInput = z.infer<typeof GenerateRecipeInputSchema>;

const GenerateRecipeOutputSchema = z.object({
  title: z.string().describe('The title of the generated recipe.'),
  ingredients: z.array(z.string()).describe('A list of ingredients required for the recipe.'),
  instructions: z.array(z.string()).describe('A list of step-by-step instructions for preparing the recipe.'),
  nutritionalInformation: z
    .string()
    .optional()
    .describe('Optional nutritional information for the recipe.'),
});

export type GenerateRecipeOutput = z.infer<typeof GenerateRecipeOutputSchema>;

export async function generateRecipe(input: GenerateRecipeInput): Promise<GenerateRecipeOutput> {
  return generateRecipeFlow(input);
}

const generateRecipePrompt = ai.definePrompt({
  name: 'generateRecipePrompt',
  input: {schema: GenerateRecipeInputSchema},
  output: {schema: GenerateRecipeOutputSchema},
  prompt: `You are a professional chef specializing in creating delicious recipes based on available ingredients.

  Generate a unique and detailed recipe based on the ingredients provided. If dietary preferences are specified, ensure the recipe adheres to those restrictions.

  Ingredients: {{{ingredients}}}
  Dietary Preferences: {{{dietaryPreferences}}}

  Format the response as a JSON object with the following keys:
  - title: The title of the recipe.
  - ingredients: An array of ingredients required for the recipe.
  - instructions: An array of step-by-step instructions for preparing the recipe.
  - nutritionalInformation: Optional nutritional information for the recipe, if available.
  `,
});

const generateRecipeFlow = ai.defineFlow(
  {
    name: 'generateRecipeFlow',
    inputSchema: GenerateRecipeInputSchema,
    outputSchema: GenerateRecipeOutputSchema,
  },
  async input => {
    const {output} = await generateRecipePrompt(input);
    return output!;
  }
);
