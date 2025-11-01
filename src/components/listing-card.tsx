
import Link from 'next/link';
import Image from 'next/image';
import type { Listing, User, Category } from '@/lib/types';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { ShoppingBagIcon } from './icons';
import { cn } from '@/lib/utils';
import CategoryIcon from './category-icon';

interface ListingCardProps {
  listing: Listing & { seller: User | undefined, category: Category | undefined, autoRejected?: boolean };
}

export default function ListingCard({ listing }: ListingCardProps) {
  const { seller, category } = listing;
  const hasImage = !!listing.imageUrl;

  return (
    <Link href={`/listings/${listing.id}`} className="group">
      <Card className="overflow-hidden h-full transition-all duration-300 hover:shadow-xl hover:-translate-y-1.5 flex flex-col">
        <div className="relative aspect-[16/9] bg-secondary">
          {hasImage ? (
            <Image
              src={listing.imageUrl}
              alt={listing.title}
              fill
              className="object-cover"
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              data-ai-hint={listing.imageHint}
            />
          ) : (
             <div className="w-full h-full bg-muted flex items-center justify-center">
                {category ? <CategoryIcon categoryName={category.name} className="h-12 w-12 text-muted-foreground/30" /> : <ShoppingBagIcon className="h-12 w-12 text-muted-foreground/30" />}
              </div>
          )}
           <div className="absolute top-2 left-2 z-10 flex flex-col gap-1.5">
              <Badge
                variant={
                listing.status === 'approved'
                    ? 'default'
                    : listing.status === 'pending'
                    ? 'secondary'
                    : 'destructive'
                }
                className={cn(
                  "capitalize w-fit",
                  listing.status === 'approved' && "bg-green-100 text-green-800 border-green-200 dark:bg-green-900/50 dark:text-green-300 dark:border-green-800",
                )}
              >
                {listing.status}
              </Badge>
              {listing.autoRejected && (
                <Badge variant="destructive" className="w-fit">Auto-Rejected</Badge>
              )}
           </div>

           {category && (
             <Badge variant="secondary" className="absolute top-3 right-3">{category.name}</Badge>
           )}
        </div>
        <CardContent className="p-4 flex flex-col justify-between flex-grow">
          <div>
            <h3 className="font-headline font-semibold text-lg leading-tight truncate group-hover:text-primary transition-colors">
              {listing.title}
            </h3>
             <p className="text-2xl font-bold mt-2 text-primary">
              ₹{listing.price.toLocaleString('en-IN')}
            </p>
          </div>
          {seller && (
            <div className="flex items-center gap-3 mt-4 pt-4 border-t">
              <Avatar className="h-9 w-9">
                <AvatarImage src={seller.avatarUrl} alt={seller.name} />
                <AvatarFallback>{seller.name.charAt(0)}</AvatarFallback>
              </Avatar>
              <div className="text-sm">
                <p className="font-medium text-foreground">{seller.name}</p>
                <p className="text-muted-foreground">Seller</p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </Link>
  );
}
