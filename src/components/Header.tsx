import { ChefHat } from 'lucide-react';
import Link from 'next/link';

export default function Header() {
  return (
    <header className="py-4 px-4 md:px-8 border-b border-border/40 bg-background/95 backdrop-blur-sm sticky top-0 z-10">
      <div className="container mx-auto">
        <Link href="/" className="flex items-center gap-3 text-2xl font-bold font-headline w-fit">
            <div className="p-2 bg-primary/20 text-primary rounded-lg">
                <ChefHat className="h-6 w-6" />
            </div>
            <span className="text-foreground">ChefGPT</span>
        </Link>
      </div>
    </header>
  );
}
