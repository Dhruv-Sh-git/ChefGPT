import { Recipe } from '@/types';
import RecipeCard from './RecipeCard';
import { Skeleton } from './ui/skeleton';
import { ChefHat } from 'lucide-react';

type RecipeListProps = {
  recipes: Recipe[];
  isLoading: boolean;
  favorites: Recipe[];
  toggleFavorite: (recipe: Recipe) => void;
  emptyStateMessage: string;
};

export default function RecipeList({ recipes, isLoading, favorites, toggleFavorite, emptyStateMessage }: RecipeListProps) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
        {[...Array(6)].map((_, i) => (
           <Card className="flex flex-col h-full bg-card p-4 space-y-4" key={i}>
            <div className='flex justify-between items-start'>
                <Skeleton className="h-6 w-3/4 rounded-md" />
                <Skeleton className="h-6 w-6 rounded-full" />
            </div>
            <Skeleton className="h-4 w-1/2 rounded-md" />
            <Skeleton className="h-16 w-full rounded-md" />
            <div className="flex justify-end">
                <Skeleton className="h-10 w-28 rounded-md" />
            </div>
          </Card>
        ))}
      </div>
    );
  }

  if (recipes.length === 0) {
    return (
      <div className="text-center py-20 px-4 border-2 border-dashed rounded-lg mt-8 bg-card">
        <ChefHat className="mx-auto h-12 w-12 text-muted-foreground" />
        <p className="mt-4 text-muted-foreground max-w-sm mx-auto">{emptyStateMessage}</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
      {recipes.map((recipe, index) => (
        <RecipeCard
          key={`${recipe.name}-${index}`}
          recipe={recipe}
          isFavorite={favorites.some((fav) => fav.name === recipe.name)}
          toggleFavorite={toggleFavorite}
        />
      ))}
    </div>
  );
}

// Minimal card for skeleton to avoid circular dependency
const Card = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
    <div
      className={className}
      {...props}
    />
  )
