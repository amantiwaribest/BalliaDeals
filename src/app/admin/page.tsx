
'use client';

import { useEffect, useState, useMemo, Suspense } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { useAuth } from '@/context/auth-context';
import { getListings, getUsers, getCategories } from '@/lib/data';
import type { Listing, User, Category } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';
import { CheckCircle2, XCircle, Hourglass, List, ShieldCheck } from 'lucide-react';
import CategoryIcon from '@/components/category-icon';
import { format, formatDistanceToNow, isBefore, subDays } from 'date-fns';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';

type EnrichedListing = Listing & { seller?: User; category?: Category; };

export default function AdminDashboardPage() {
  const { user, isLoggedIn, loading } = useAuth();
  const router = useRouter();
  const { toast } = useToast();

  const [allListings, setAllListings] = useState<EnrichedListing[]>([]);
  const [isRejectDialogOpen, setIsRejectDialogOpen] = useState(false);
  const [rejectionListingId, setRejectionListingId] = useState<string | null>(null);
  const [rejectionReason, setRejectionReason] = useState('');


  useEffect(() => {
    if (!loading) {
      if (!isLoggedIn || user?.role !== 'admin') {
        toast({
          variant: "destructive",
          title: "Access Denied",
          description: "You do not have permission to view this page.",
        });
        router.push('/');
      }
    }
  }, [user, isLoggedIn, loading, router]);

  useEffect(() => {
    async function fetchAllData() {
      const listingsData = await getListings();
      const usersData = await getUsers();
      const categoriesData = await getCategories();

      const sevenDaysAgo = subDays(new Date(), 7);

      const enriched: EnrichedListing[] = listingsData.map(listing => {
        let autoRejected = false;
        if (listing.status === 'pending' && listing.createdAt && isBefore(new Date(listing.createdAt), sevenDaysAgo)) {
          listing.status = 'rejected';
          autoRejected = true;
          listing.rejectionReason = "This listing was automatically rejected due to being in 'pending' status for over 7 days.";
        }
        return {
          ...listing,
          seller: usersData.find(u => u.id === listing.sellerId),
          category: categoriesData.find(c => c.id === listing.categoryId),
          autoRejected,
        }
      });

      const statusOrder = {
        pending: 0,
        approved: 1,
        rejected: 2,
      };

      const sortedListings = enriched.sort((a, b) => statusOrder[a.status] - statusOrder[b.status]);

      setAllListings(sortedListings);
    }
    if (user?.role === 'admin') {
      fetchAllData();
    }
  }, [user]);

  const handleStatusChange = (listingId: string, newStatus: 'approved' | 'rejected', reason?: string) => {
    setAllListings(prevListings =>
      prevListings.map(l =>
        l.id === listingId ? { ...l, status: newStatus, autoRejected: false, rejectionReason: reason } : l
      )
    );
    toast({
      title: `Listing ${newStatus}`,
      description: `The listing has been successfully ${newStatus}.`,
    });

    if (newStatus === 'rejected') {
        console.log(`Listing ${listingId} rejected with reason: ${reason}`);
    }
  };

  const openRejectDialog = (listingId: string) => {
    setRejectionListingId(listingId);
    setIsRejectDialogOpen(true);
  };

  const handleRejectSubmit = () => {
    if (rejectionListingId) {
      handleStatusChange(rejectionListingId, 'rejected', rejectionReason);
    }
    setRejectionListingId(null);
    setRejectionReason('');
    setIsRejectDialogOpen(false);
  };
  
  const stats = useMemo(() => {
    const total = allListings.length;
    const pending = allListings.filter(l => l.status === 'pending').length;
    const approved = allListings.filter(l => l.status === 'approved').length;
    const rejected = allListings.filter(l => l.status === 'rejected').length;
    return { total, pending, approved, rejected };
  }, [allListings]);

  if (loading || !isLoggedIn || user?.role !== 'admin') {
    return (
      <div className="flex h-[calc(100vh-8rem)] items-center justify-center">
        <div className="flex items-center gap-2 text-muted-foreground">
          <Hourglass className="h-5 w-5 animate-spin" />
          <span>Loading Admin Dashboard...</span>
        </div>
      </div>
    );
  }

  const listingToReject = allListings.find(l => l.id === rejectionListingId);

  return (
    <Suspense fallback={<div>Loading admin dashboard...</div>}>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="flex flex-col sm:flex-row justify-between items-start gap-4 mb-8">
        <div>
            <h1 className="text-3xl font-bold font-headline tracking-tight flex items-center gap-2">
                <ShieldCheck className="h-8 w-8 text-primary" />
                Admin Dashboard
            </h1>
            <p className="text-muted-foreground mt-1">Manage listings and users across the platform.</p>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Listings</CardTitle>
            <List className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
            <p className="text-xs text-muted-foreground">All listings in the system</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Approval</CardTitle>
            <Hourglass className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.pending}</div>
            <p className="text-xs text-muted-foreground">Listings needing moderation</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Approved Listings</CardTitle>
            <CheckCircle2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.approved}</div>
             <p className="text-xs text-muted-foreground">Live on the site</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Rejected Listings</CardTitle>
            <XCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.rejected}</div>
            <p className="text-xs text-muted-foreground">Removed from the site</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
            <CardTitle>All Listings</CardTitle>
        </CardHeader>
        <CardContent>
             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {allListings.map(listing => (
                  <Card key={listing.id} className="flex flex-col group">
                    <Link href={`/listings/${listing.id}`} className="flex flex-col flex-grow">
                      <div className="relative aspect-[16/10] bg-secondary rounded-t-lg overflow-hidden">
                        <div className="absolute top-2 left-2 z-10 flex flex-col gap-1">
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

                        {listing.imageUrl ? (
                          <Image src={listing.imageUrl} alt={listing.title} fill className="object-cover transition-transform duration-300 group-hover:scale-105" />
                        ) : (
                          <div className="w-full h-full bg-muted flex items-center justify-center">
                            {listing.category && <CategoryIcon categoryName={listing.category.name} className="h-24 w-24 text-muted-foreground/30" />}
                          </div>
                        )}
                      </div>
                      <CardContent className="p-4 flex-grow flex flex-col">
                        {listing.category && (
                          <Badge variant="outline" className="mb-2 w-fit">
                            {listing.category.name}
                          </Badge>
                        )}
                        <h3 className="font-semibold line-clamp-2 flex-grow transition-colors group-hover:text-primary">{listing.title}</h3>
                        <p className="text-sm text-muted-foreground mt-1">by {listing.seller?.name || 'Unknown'}</p>
                        {listing.createdAt && (
                          <p className="text-xs text-muted-foreground mt-1">
                            Posted {formatDistanceToNow(new Date(listing.createdAt), { addSuffix: true })} ({format(new Date(listing.createdAt), 'dd/MM/yyyy')})
                          </p>
                        )}
                        <p className="font-bold text-lg mt-2">₹{listing.price.toLocaleString('en-IN')}</p>
                      </CardContent>
                    </Link>
                     {listing.status === 'pending' && (
                        <div className="p-4 border-t flex gap-2 justify-end">
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleStatusChange(listing.id, 'approved')}
                        >
                            Approve
                        </Button>
                        <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => openRejectDialog(listing.id)}
                        >
                            Reject
                        </Button>
                        </div>
                    )}
                  </Card>
                ))}
            </div>
        </CardContent>
      </Card>

      <Dialog open={isRejectDialogOpen} onOpenChange={setIsRejectDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reject Listing</DialogTitle>
            <DialogDescription>
              Provide a reason for rejecting the listing &quot;{listingToReject?.title}&quot;. This will be visible to the seller.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="rejection-reason" className="text-right">
                Reason
              </Label>
              <Textarea
                id="rejection-reason"
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
                className="col-span-3"
                placeholder="e.g., Prohibited item, duplicate listing, etc."
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsRejectDialogOpen(false)}>Cancel</Button>
            <Button variant="destructive" onClick={handleRejectSubmit}>Confirm Rejection</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

    </div>
    </Suspense>
  );
}
