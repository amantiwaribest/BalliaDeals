'use client';

import React from 'react';
import type { Category } from '@/lib/types';
import CategoryIcon from './category-icon';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { cn } from '@/lib/utils';

interface CategoryRailProps {
  categories: Category[];
}

export default function CategoryRail({ categories }: CategoryRailProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const activeCategory = searchParams.get('category') || 'all';
  
  const handleCategoryClick = (categoryId: string) => {
    const params = new URLSearchParams(searchParams);
    if (categoryId === 'all') {
      params.delete('category');
    } else {
      params.set('category', categoryId);
    }
    const queryString = params.toString();
    router.replace(queryString ? `${pathname}?${queryString}` : pathname);
  };
  
  const allCategories = [{ id: 'all', name: 'All' }, ...categories.filter(c => c.id !== 'cat-0')];

  return (
    <div className="border-b bg-background">
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="flex space-x-4 sm:space-x-6 py-5 overflow-x-auto" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
            {allCategories.map((category) => (
              <button
                key={category.id}
                onClick={() => handleCategoryClick(category.id)}
                className={cn(
                  'flex flex-col items-center gap-2 text-center text-sm font-medium transition-colors hover:text-primary group focus:outline-none flex-shrink-0',
                  activeCategory === category.id
                    ? 'text-primary'
                    : 'text-muted-foreground'
                )}
              >
                <div
                  className={cn(
                    'flex h-16 w-16 items-center justify-center rounded-full bg-secondary transition-all duration-200 group-hover:bg-primary/10 group-hover:scale-105',
                    activeCategory === category.id
                      ? 'bg-primary text-primary-foreground scale-105'
                      : 'bg-secondary'
                  )}
                >
                  <CategoryIcon categoryName={category.name} className="h-7 w-7" />
                </div>
                <span className="w-20 truncate">{category.name}</span>
              </button>
            ))}
        </div>
      </div>
    </div>
  );
}
