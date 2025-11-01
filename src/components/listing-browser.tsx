'use client';

import React, { useState, useEffect } from 'react';
import type { Listing, Category, User } from '@/lib/types';
import { useSearchParams } from 'next/navigation';
import ListingCard from './listing-card';
import JobListingCard from './job-listing-card';

type EnrichedListing = Listing & {
  seller: User | undefined;
  category: Category | undefined;
};

interface ListingBrowserProps {
  listings: EnrichedListing[];
  categories: Category[];
}

export default function ListingBrowser({ listings, categories }: ListingBrowserProps) {
  const searchParams = useSearchParams();
  const [filteredListings, setFilteredListings] = useState<EnrichedListing[]>(listings);
  
  const query = searchParams.get('q');
  const categoryId = searchParams.get('category');
  const activeCategory = categories.find(c => c.id === categoryId);

  const isJobCategory = activeCategory?.name === 'Jobs';

  useEffect(() => {
    let newFilteredListings = listings;

    if (categoryId && categoryId !== 'all') {
      newFilteredListings = newFilteredListings.filter(
        (listing) => listing.categoryId === categoryId
      );
    }
    
    if (query) {
      newFilteredListings = newFilteredListings.filter((listing) =>
        listing.title.toLowerCase().includes(query.toLowerCase()) ||
        listing.description.toLowerCase().includes(query.toLowerCase())
      );
    }

    setFilteredListings(newFilteredListings);
  }, [query, categoryId, listings]);

  const gridClasses = isJobCategory
    ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4"
    : "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-x-6 gap-y-8";


  return (
    <div>
      <div className="mb-8">
        <h2 className="text-3xl font-bold font-headline tracking-tight">
          {activeCategory ? activeCategory.name : "Today's Deals"}
        </h2>
        <p className="text-muted-foreground mt-1">
          {filteredListings.length} listings found.
        </p>
      </div>
      
      {filteredListings.length > 0 ? (
        <div className={gridClasses}>
          {filteredListings.map((listing) => (
            isJobCategory ? (
              <JobListingCard key={listing.id} listing={listing} />
            ) : (
              <ListingCard key={listing.id} listing={listing} />
            )
          ))}
        </div>
      ) : (
        <div className="text-center py-20 bg-card rounded-lg border-2 border-dashed">
          <h3 className="text-2xl font-bold font-headline">No listings found</h3>
          <p className="text-muted-foreground mt-2">Try adjusting your search or filters to find what you're looking for.</p>
        </div>
      )}
    </div>
  );
}
