import { getListings, getCategories, getUsers } from '@/lib/data';
import ListingBrowser from '@/components/listing-browser';
import CategoryRail from '@/components/category-rail';
import type { Listing } from '@/lib/types';

export default async function Home() {
  const listingsData = await getListings();
  const categories = await getCategories();
  const users = await getUsers();

  const listings: (Listing & { seller: any; category: any; })[] = listingsData
    .filter(listing => listing.status === 'approved')
    .map(listing => {
      const seller = users.find(u => u.id === listing.sellerId);
      const category = categories.find(c => c.id === listing.categoryId);
      return { ...listing, seller, category };
    });

  return (
    <>
      <CategoryRail categories={categories} />
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <ListingBrowser listings={listings} categories={categories} />
      </div>
    </>
  );
}
