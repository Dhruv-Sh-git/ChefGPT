'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Form, FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { suggestRecipes } from '@/ai/flows/suggest-recipes';
import { useToast } from '@/hooks/use-toast';
import { Recipe } from '@/types';
import { Loader2, Sparkles } from 'lucide-react';

const formSchema = z.object({
  ingredients: z.string().min(3, {
    message: 'Please enter at least one ingredient.',
  }),
});

type IngredientFormProps = {
  onSuggest: (recipes: Recipe[]) => void;
  setIsLoading: (isLoading: boolean) => void;
  isLoading: boolean;
};

export default function IngredientForm({ onSuggest, setIsLoading, isLoading }: IngredientFormProps) {
  const { toast } = useToast();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      ingredients: '',
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    onSuggest([]);
    try {
      const result = await suggestRecipes(values);
      if (result && result.recipes && result.recipes.length > 0) {
        onSuggest(result.recipes);
      } else {
        toast({
          variant: 'default',
          title: 'No recipes found',
          description: 'We couldn\'t find any recipes with those ingredients. Try some different ones!',
        });
        onSuggest([]);
      }
    } catch (error) {
      console.error(error);
      toast({
        variant: 'destructive',
        title: 'Error generating recipes',
        description: 'An unexpected error occurred. Please try again later.',
      });
      onSuggest([]);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 max-w-2xl mx-auto">
        <FormField
          control={form.control}
          name="ingredients"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Textarea
                  placeholder="e.g., chicken breast, broccoli, soy sauce, rice..."
                  className="resize-none h-28 text-base bg-card shadow-inner"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex justify-center">
            <Button type="submit" disabled={isLoading} size="lg" className="font-bold">
            {isLoading ? (
                <>
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                Generating...
                </>
            ) : (
                <>
                <Sparkles className="mr-2 h-5 w-5" />
                Find Recipes
                </>
            )}
            </Button>
        </div>
      </form>
    </Form>
  );
}
