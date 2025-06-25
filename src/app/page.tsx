'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  generateRecipe,
  type GenerateRecipeOutput,
} from '@/ai/flows/generate-recipe';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import {
  ChefHat,
  BookOpen,
  Sparkles,
  UtensilsCrossed,
  Leaf,
  ClipboardList,
} from 'lucide-react';

const formSchema = z.object({
  ingredients: z
    .string()
    .min(1, { message: 'Please enter at least one ingredient.' }),
  dietaryPreferences: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

export default function Home() {
  const [recipe, setRecipe] = useState<GenerateRecipeOutput | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      ingredients: '',
      dietaryPreferences: '',
    },
  });

  const onSubmit = async (values: FormValues) => {
    setIsLoading(true);
    setRecipe(null);

    try {
      const result = await generateRecipe(values);
      setRecipe(result);
    } catch (e) {
      toast({
        variant: 'destructive',
        title: 'Oh no! Something went wrong.',
        description: 'Failed to generate recipe. Please try again.',
      });
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground font-body">
      <header className="py-8 px-4 text-center">
        <div className="flex justify-center items-center gap-4">
          <ChefHat className="w-12 h-12 text-primary" />
          <h1 className="text-5xl font-headline font-bold">ChefGPT</h1>
        </div>
        <p className="mt-2 text-lg text-muted-foreground">
          Your personal AI chef. Tell me what you have, and I'll whip up a
          recipe.
        </p>
      </header>

      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <Card className="shadow-lg border-border/70">
            <CardHeader>
              <CardTitle className="text-2xl font-headline flex items-center gap-2">
                <Sparkles className="w-6 h-6 text-accent" />
                Create Your Recipe
              </CardTitle>
              <CardDescription>
                Enter ingredients you have on hand and any dietary preferences.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="space-y-6"
                >
                  <FormField
                    control={form.control}
                    name="ingredients"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-lg flex items-center gap-2">
                          <UtensilsCrossed className="w-5 h-5" /> Ingredients
                        </FormLabel>
                        <FormControl>
                          <Input
                            placeholder="e.g., chicken breast, broccoli, garlic, olive oil"
                            {...field}
                            className="text-base"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="dietaryPreferences"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-lg flex items-center gap-2">
                          <Leaf className="w-5 h-5" /> Dietary Preferences
                          (Optional)
                        </FormLabel>
                        <FormControl>
                          <Input
                            placeholder="e.g., vegetarian, gluten-free, low-carb"
                            {...field}
                            className="text-base"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button
                    type="submit"
                    disabled={isLoading}
                    className="w-full text-lg py-6 bg-accent hover:bg-accent/90 text-accent-foreground"
                  >
                    {isLoading ? (
                      <>
                        <svg
                          className="animate-spin -ml-1 mr-3 h-5 w-5"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                          ></circle>
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                          ></path>
                        </svg>
                        Generating...
                      </>
                    ) : (
                      <>
                        <Sparkles className="mr-2 h-5 w-5" /> Generate Recipe
                      </>
                    )}
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Card>

          {recipe && (
            <Card className="mt-8 shadow-lg animate-fade-in border-border/70">
              <CardHeader>
                <CardTitle className="text-3xl font-headline flex items-center gap-3">
                  <BookOpen className="w-8 h-8 text-primary" />
                  {recipe.title}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <h3 className="text-2xl font-headline font-semibold mb-3 flex items-center gap-2">
                    <ClipboardList className="w-6 h-6 text-accent" />{' '}
                    Ingredients
                  </h3>
                  <ul className="list-disc list-inside space-y-1 text-base bg-secondary/50 p-4 rounded-md">
                    {recipe.ingredients.map((ingredient, index) => (
                      <li key={index}>{ingredient}</li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h3 className="text-2xl font-headline font-semibold mb-3 flex items-center gap-2">
                    <UtensilsCrossed className="w-6 h-6 text-accent" />{' '}
                    Instructions
                  </h3>
                  <ol className="list-decimal list-inside space-y-3 text-base">
                    {recipe.instructions.map((instruction, index) => (
                      <li key={index} className="pl-2 leading-relaxed">
                        {instruction}
                      </li>
                    ))}
                  </ol>
                </div>
                {recipe.nutritionalInformation && (
                  <div>
                    <h3 className="text-2xl font-headline font-semibold mb-3 flex items-center gap-2">
                      <Leaf className="w-6 h-6 text-accent" /> Nutritional
                      Information
                    </h3>
                    <p className="text-base text-muted-foreground">
                      {recipe.nutritionalInformation}
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          )}
        </div>
      </main>
      <footer className="text-center py-4 text-sm text-muted-foreground">
        <p>Powered by AI. Generated recipes may require common sense.</p>
      </footer>
    </div>
  );
}
