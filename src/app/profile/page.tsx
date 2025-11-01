
'use client';

import { useEffect, useState } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import ListingCard from "@/components/listing-card";
import StarRating from "@/components/star-rating";
import { getListings, getUsers, getCategories } from "@/lib/data";
import { EditIcon } from "@/components/icons";
import { useAuth } from '@/context/auth-context';
import { useRouter } from 'next/navigation';
import type { Listing, User, Category } from "@/lib/types";
import { isBefore, subDays, format } from 'date-fns';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import DatePicker from '@/components/date-picker';

type EnrichedListing = Listing & { seller: User | undefined, category: any, autoRejected?: boolean };

export default function ProfilePage() {
  const { user, isLoggedIn, login } = useAuth();
  const router = useRouter();
  const [userListings, setUserListings] = useState<EnrichedListing[]>([]);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editedName, setEditedName] = useState(user?.name || '');
  const [editedMobile, setEditedMobile] = useState(user?.mobile || '');
  const [editedDob, setEditedDob] = useState<Date | undefined>(user?.dob ? new Date(user.dob) : undefined);
  const { toast } = useToast();

  useEffect(() => {
    if (!isLoggedIn) {
      router.push('/login');
    }
  }, [isLoggedIn, router]);

  useEffect(() => {
    if (user) {
      setEditedName(user.name);
      setEditedMobile(user.mobile || '');
      setEditedDob(user.dob ? new Date(user.dob) : undefined);
      const fetchUserListings = async () => {
        const allListings = await getListings();
        const users = await getUsers();
        const categories = await getCategories();
        
        const filteredListings = allListings.filter(listing => listing.sellerId === user.id);

        const sevenDaysAgo = subDays(new Date(), 7);

        const enrichedListings = filteredListings.map(listing => {
            const seller = users.find(u => u.id === listing.sellerId);
            const category = categories.find(c => c.id === listing.categoryId);
            
            let autoRejected = false;
            if (listing.status === 'pending' && listing.createdAt && isBefore(new Date(listing.createdAt), sevenDaysAgo)) {
              listing.status = 'rejected';
              listing.rejectionReason = "This listing was automatically rejected due to inactivity.";
              autoRejected = true;
            }

            return { ...listing, seller, category, autoRejected };
        });
        setUserListings(enrichedListings);
      };
      fetchUserListings();
    }
  }, [user]);

  const handleProfileSave = () => {
    if (user) {
      const updatedUser: User = { 
        ...user, 
        name: editedName,
        mobile: editedMobile,
        dob: editedDob ? format(editedDob, 'yyyy-MM-dd') : undefined,
      };
      // In a real app, this would be an API call to the backend.
      // For now, we update the context state and sessionStorage.
      login(updatedUser);
      console.log('Profile updated:', updatedUser);
      toast({
        title: 'Profile Updated',
        description: 'Your details have been successfully saved.',
      });
      setIsEditDialogOpen(false);
    }
  };

  if (!user) {
    return (
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <p>Loading profile...</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="grid gap-10 md:grid-cols-3">
        <div className="md:col-span-1">
          <Card className="sticky top-24">
            <CardHeader className="items-center text-center">
              <Avatar className="h-24 w-24 mb-4">
                <AvatarImage src={user.avatarUrl} alt={user.name} />
                <AvatarFallback className="text-3xl">{user.name.charAt(0)}</AvatarFallback>
              </Avatar>
              <CardTitle className="text-2xl font-headline">{user.name}</CardTitle>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <StarRating rating={user.averageRating} />
                <span>({user.reviews} reviews)</span>
              </div>
            </CardHeader>
            <CardContent className="text-center">
                <p className="text-sm text-muted-foreground mb-4">Member since {new Date().getFullYear() -1}</p>
                 <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
                  <DialogTrigger asChild>
                    <Button variant="outline">
                      <EditIcon className="mr-2 h-4 w-4" /> Edit Profile
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                      <DialogTitle>Edit Profile</DialogTitle>
                      <DialogDescription>
                        Make changes to your profile here. Click save when you're done.
                      </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="name" className="text-right">
                          Name
                        </Label>
                        <Input
                          id="name"
                          value={editedName}
                          onChange={(e) => setEditedName(e.target.value)}
                          className="col-span-3"
                        />
                      </div>
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="email" className="text-right">
                          Email
                        </Label>
                        <Input
                          id="email"
                          value={user.email}
                          className="col-span-3"
                          disabled
                        />
                      </div>
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="mobile" className="text-right">
                          Mobile
                        </Label>
                        <Input
                          id="mobile"
                          value={editedMobile}
                          onChange={(e) => setEditedMobile(e.target.value)}
                          className="col-span-3"
                        />
                      </div>
                       <div className="grid grid-cols-4 items-start gap-4">
                        <Label htmlFor="dob" className="text-right pt-2">
                          Birth Date
                        </Label>
                        <div className="col-span-3">
                          <DatePicker 
                            value={editedDob}
                            onChange={setEditedDob}
                            fromYear={1920}
                            toYear={new Date().getFullYear()}
                          />
                        </div>
                      </div>
                    </div>
                    <DialogFooter>
                      <Button type="submit" onClick={handleProfileSave}>Save changes</Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
            </CardContent>
          </Card>
        </div>
        <div className="md:col-span-2">
            <h2 className="text-2xl font-bold font-headline mb-6">Your Listings ({userListings.length})</h2>
            {userListings.length > 0 ? (
                 <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    {userListings.map(listing => (
                        <ListingCard key={listing.id} listing={listing} />
                    ))}
                </div>
            ) : (
                <div className="text-center py-16 border-2 border-dashed rounded-lg">
                    <h3 className="text-xl font-semibold">You haven't listed any items yet.</h3>
                    <p className="text-muted-foreground mt-2">Start selling to see your items here.</p>
                    <Button className="mt-4" onClick={() => router.push('/listings/new')}>Sell an Item</Button>
                </div>
            )}
        </div>
      </div>
    </div>
  );
}
