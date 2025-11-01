'use client';

import { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { getListings, getCategories, getUsers } from '@/lib/data';
import ListingBrowser from '@/components/listing-browser';
import CategoryRail from '@/components/category-rail';
import type { Listing } from '@/lib/types';
import { useEffect, useState } from 'react';

function HomeInner() {
  const [data, setData] = useState<{ listings: (Listing & { seller: any; category: any; })[], categories: any[], users: any[] }>({ listings: [], categories: [], users: [] });
  const searchParams = useSearchParams(); // Keep this as per user's example

  useEffect(() => {
    async function fetchData() {
      const listingsData = await getListings();
      const categories = await getCategories();
      const users = await getUsers();

      const filteredListings: (Listing & { seller: any; category: any; })[] = listingsData
        .filter(listing => listing.status === 'approved')
        .map(listing => {
          const seller = users.find(u => u.id === listing.sellerId);
          const category = categories.find(c => c.id === listing.categoryId);
          return { ...listing, seller, category };
        });

      setData({ listings: filteredListings, categories, users });
    }
    fetchData();
  }, []);

  // Example usage of searchParams, can be removed if not needed
  const name = searchParams.get('name') || 'Guest';

  return (
    <>
      <CategoryRail categories={data.categories} />
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <ListingBrowser listings={data.listings} categories={data.categories} />
      </div>
    </>
  );
}

export default function Home() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <HomeInner />
    </Suspense>
  );
}
