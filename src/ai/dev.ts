import { config } from 'dotenv';
config();

import '@/ai/flows/generate-recipe-details.ts';
import '@/ai/flows/suggest-recipes.ts';
import '@/ai/flows/suggest-recipe-modifications.ts';
import '@/ai/flows/suggest-recipe-name.ts';
import '@/ai/flows/generate-recipe.ts';
