'use client';

import { Recipe } from '@/types';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from './ui/button';
import { Heart, UtensilsCrossed, BookOpen } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from './ui/dialog';
import { ScrollArea } from './ui/scroll-area';
import { Badge } from './ui/badge';
import { Separator } from './ui/separator';

type RecipeCardProps = {
  recipe: Recipe;
  isFavorite: boolean;
  toggleFavorite: (recipe: Recipe) => void;
};

export default function RecipeCard({ recipe, isFavorite, toggleFavorite }: RecipeCardProps) {
  const ingredientsList = recipe.ingredients.split(',').map(i => i.trim()).filter(i => i.length > 0);

  return (
    <Card className="flex flex-col h-full transform transition-all duration-300 hover:scale-[1.02] hover:shadow-xl bg-card">
      <CardHeader>
        <div className="flex justify-between items-start gap-4">
            <CardTitle className="font-headline text-xl leading-snug">{recipe.name}</CardTitle>
            <Button
                variant="ghost"
                size="icon"
                onClick={() => toggleFavorite(recipe)}
                className="text-muted-foreground hover:text-destructive flex-shrink-0 -mt-1 -mr-2"
                aria-label={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
            >
                <Heart className={`h-6 w-6 transition-all ${isFavorite ? 'fill-destructive text-destructive scale-110' : ''}`} />
            </Button>
        </div>
        <div className="flex items-center gap-2 pt-1 text-sm text-muted-foreground">
          <UtensilsCrossed className="h-4 w-4"/>
          <span>{ingredientsList.length} ingredients</span>
        </div>
      </CardHeader>
      <CardContent className="flex-grow">
        <p className="text-sm text-muted-foreground mb-4">
          {recipe.instructions.substring(0, 100).trim()}{recipe.instructions.length > 100 ? '...' : ''}
        </p>
        <div className="flex flex-wrap gap-1.5">
          {ingredientsList.slice(0, 4).map((ingredient) => (
            <Badge key={ingredient} variant="secondary">{ingredient}</Badge>
          ))}
          {ingredientsList.length > 4 && <Badge variant="outline">+{ingredientsList.length - 4} more</Badge>}
        </div>
      </CardContent>
      <CardFooter>
        <Dialog>
          <DialogTrigger asChild>
            <Button className="w-full bg-accent hover:bg-accent/90 text-accent-foreground">
              <BookOpen className="mr-2 h-4 w-4"/>
              View Recipe
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-2xl">
            <DialogHeader>
              <DialogTitle className="font-headline text-3xl">{recipe.name}</DialogTitle>
              <DialogDescription asChild>
                <div className='pt-2'>
                  <h3 className="text-sm font-semibold text-foreground uppercase tracking-wider">Ingredients</h3>
                  <div className="flex flex-wrap gap-2 pt-2">
                    {ingredientsList.map((ingredient) => (
                      <Badge key={ingredient} variant="secondary">{ingredient}</Badge>
                    ))}
                  </div>
                </div>
              </DialogDescription>
            </DialogHeader>
            <Separator className="my-4" />
            <ScrollArea className="max-h-[50vh] pr-6">
              <div className="whitespace-pre-line text-sm text-foreground">
                <h3 className="font-headline font-bold text-xl mb-3 text-foreground">Instructions</h3>
                <div className='prose prose-sm dark:prose-invert max-w-none'>
                    <p>{recipe.instructions}</p>
                </div>
              </div>
            </ScrollArea>
          </DialogContent>
        </Dialog>
      </CardFooter>
    </Card>
  );
}
