
import Link from 'next/link';
import type { Listing, User, Category } from '@/lib/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Briefcase, MapPin } from 'lucide-react';

interface JobListingCardProps {
  listing: Listing & { seller: User | undefined; category: Category | undefined };
}

export default function JobListingCard({ listing }: JobListingCardProps) {
  const { seller } = listing;

  const getCityFromDescription = (description: string) => {
    const cities = ['Bangalore', 'Mumbai', 'Delhi', 'Hyderabad', 'Pune', 'Chennai'];
    const words = description.split(' ');
    for (const city of cities) {
      if (words.includes(city)) {
        return city;
      }
    }
    return 'Remote';
  }

  const city = getCityFromDescription(listing.description);

  const isNew = listing.createdAt && new Date().getTime() - new Date(listing.createdAt).getTime() < 24 * 60 * 60 * 1000;

  return (
    <Link href={`/listings/${listing.id}`} className="group">
      <Card className="overflow-hidden h-full transition-all duration-300 hover:shadow-xl hover:border-primary/50 flex flex-col sm:flex-row">
        <CardContent className="p-6 flex-grow">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="font-headline font-semibold text-xl leading-tight group-hover:text-primary transition-colors">
                  {listing.title}
                </h3>
                {isNew && (
                  <Badge variant="destructive" className="shrink-0">New</Badge>
                )}
              </div>
              <div className="flex items-center gap-4 text-sm text-muted-foreground mt-2">
                {seller && (
                  <div className="flex items-center gap-2">
                    <Briefcase className="h-4 w-4" />
                    <span>{seller.name}</span>
                  </div>
                )}
                <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4" />
                    <span>{city}</span>
                </div>
              </div>
            </div>
          </div>

          <p className="text-muted-foreground mt-4 text-sm line-clamp-2">
            {listing.description}
          </p>
          
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mt-6">
            <div>
              <p className="text-lg font-bold text-primary">
                ₹{listing.price.toLocaleString('en-IN')}
              </p>
              {listing.salaryPeriod && (
                  <p className="text-xs text-muted-foreground -mt-1">per {listing.salaryPeriod}</p>
              )}
            </div>
            <Button className="mt-4 sm:mt-0">View Details</Button>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
