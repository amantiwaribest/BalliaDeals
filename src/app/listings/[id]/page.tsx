
'use client';

import { getListingById, getUserById } from '@/lib/data';
import Image from 'next/image';
import Link from 'next/link';
import { notFound, useRouter, useParams } from 'next/navigation';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import CategoryIcon from '@/components/category-icon';
import SellerRatingForm from '@/components/seller-rating-form';
import StarRating from '@/components/star-rating';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';
import { ArrowLeft, Briefcase, Building, MessageSquare, Star, Info } from 'lucide-react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import BackButton from '@/components/back-button';
import type { User, Listing, Category } from '@/lib/types';
import React, { useEffect, useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useToast } from '@/hooks/use-toast';
import { ScrollArea } from '@/components/ui/scroll-area';
import { isBefore, subDays } from 'date-fns';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

const applicationFormSchema = z.object({
  name: z.string(),
  email: z.string().email(),
  mobile: z.string(),
  resume: z
    .custom<FileList>()
    .optional(),
  resumeLink: z.string().url("Please provide a valid URL.").optional(),
}).refine(data => data.resume && data.resume.length > 0 || !!data.resumeLink, {
  message: "Please upload a resume or provide a link.",
  path: ["resume"],
});


type ApplicationFormValues = z.infer<typeof applicationFormSchema>;

interface JobApplicationFormProps {
  user: User;
  onFormSubmit: () => void;
}

function JobApplicationForm({ user, onFormSubmit }: JobApplicationFormProps) {
  const { toast } = useToast();

  const form = useForm<ApplicationFormValues>({
    resolver: zodResolver(applicationFormSchema),
    defaultValues: {
      name: user.name,
      email: user.email,
      mobile: '+91 12345 67890',
      resumeLink: '',
    },
  });

  const onSubmit = (data: ApplicationFormValues) => {
    console.log('Application submitted:', data);
    toast({
      title: 'Application Sent!',
      description: 'Your application has been submitted successfully.',
    });
    onFormSubmit();
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Full Name</FormLabel>
                <FormControl>
                  <Input {...field} disabled />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email Address</FormLabel>
                <FormControl>
                  <Input {...field} disabled />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <FormField
          control={form.control}
          name="mobile"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Mobile Number</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="resume"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Upload Resume</FormLabel>
              <FormControl>
                <Input
                  type="file"
                  accept=".pdf,.doc,.docx"
                  onChange={(e) => field.onChange(e.target.files)}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex items-center gap-4">
          <Separator className="flex-1" />
          <span className="text-sm text-muted-foreground">OR</span>
          <Separator className="flex-1" />
        </div>

        <FormField
          control={form.control}
          name="resumeLink"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Paste Resume Link</FormLabel>
              <FormControl>
                <Input placeholder="https://example.com/resume" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" className="w-full" size="lg">
          Submit Application
        </Button>
      </form>
    </Form>
  );
}


const ActionButtons = ({ categoryName, seller, listing, listingTitle }: { categoryName?: string; seller?: User, listing: Listing, listingTitle: string }) => {
  const [isOpen, setIsOpen] = useState(false);

  if (categoryName === 'Jobs' && seller) {
    return (
       <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger asChild>
          <Button size="lg" className="w-full">
            <Briefcase className="mr-2 h-5 w-5" />
            Apply Now
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[525px] p-0">
          <DialogHeader className="p-6 pb-0">
            <DialogTitle className="font-headline text-2xl">Apply for {listing.title}</DialogTitle>
            <DialogDescription>
              Your information will be sent to {listing.seller?.name}.
            </DialogDescription>
          </DialogHeader>
          <ScrollArea className="h-[60vh]">
            <div className="px-6">
              <JobApplicationForm user={seller} onFormSubmit={() => setIsOpen(false)} />
            </div>
          </ScrollArea>
        </DialogContent>
      </Dialog>
    );
  }

  if (categoryName === 'Services' || categoryName === 'Real Estate') {
     return (
       <Button size="lg" className="w-full">
        <MessageSquare className="mr-2 h-5 w-5" />
        Contact Provider
      </Button>
    );
  }

  return (
    <div className="flex flex-col sm:flex-row gap-3">
      <Button size="lg" className="flex-1 bg-accent hover:bg-accent/90">Add to Cart</Button>
      <Button size="lg" className="flex-1">Buy Now</Button>
    </div>
  );
};


export default function ListingPage() {
  const params = useParams();
  const id = Array.isArray(params.id) ? params.id[0] : params.id;
  const [listing, setListing] = useState<Listing | null>(null);

  useEffect(() => {
    async function fetchData() {
      if (!id) return;
      const listingData = await getListingById(id);
      if (!listingData) {
        notFound();
        return;
      }
      
      const sevenDaysAgo = subDays(new Date(), 7);
      let autoRejected = false;
      if (listingData.status === 'pending' && listingData.createdAt && isBefore(new Date(listingData.createdAt), sevenDaysAgo)) {
        listingData.status = 'rejected';
        listingData.rejectionReason = "This listing was automatically rejected due to inactivity.";
        autoRejected = true;
      }

      const seller = await getUserById(listingData.sellerId);
      const categories = await import('@/lib/data').then(m => m.getCategories());
      const category = categories.find(c => c.id === listingData.categoryId);

      setListing({
        ...listingData,
        seller: seller || undefined,
        category: category || undefined,
        autoRejected,
      });
    }

    fetchData();
  }, [id]);


  if (!listing) {
    return (
       <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <p>Loading...</p>
      </div>
    );
  }
  
  const hasImage = !!listing.imageUrl;

  let sellerOrProviderText = 'Seller';
  if (listing.category?.name === 'Jobs') {
    sellerOrProviderText = 'Employer';
  } else if (listing.category?.name === 'Services' || listing.category?.name === 'Real Estate') {
    sellerOrProviderText = 'Provider';
  }

  const getSellerIcon = () => {
    if (listing.category?.name === 'Jobs') return <Briefcase className="h-4 w-4 text-muted-foreground" />;
    if (listing.category?.name === 'Real Estate') return <Building className="h-4 w-4 text-muted-foreground" />;
    return null;
  }
  
  const getStatusAlert = () => {
    if (listing.status === 'pending') {
      return (
        <Alert variant="default" className="mb-6 bg-yellow-50 border-yellow-200 text-yellow-800">
          <Info className="h-4 w-4 !text-yellow-800" />
          <AlertTitle>Pending Review</AlertTitle>
          <AlertDescription>
            This listing is currently being reviewed by our moderators.
          </AlertDescription>
        </Alert>
      );
    }
    if (listing.status === 'rejected') {
      return (
        <Alert variant="destructive" className="mb-6">
          <Info className="h-4 w-4" />
          <AlertTitle>Listing Rejected</AlertTitle>
          <AlertDescription>
            {listing.rejectionReason || "This listing was not approved by our moderators."}
          </AlertDescription>
        </Alert>
      );
    }
    return null;
  }

  return (
    <div className="relative py-12">
      <div className="absolute top-12 left-4 sm:left-6 lg:left-8 hidden md:block">
        <BackButton />
      </div>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className={cn("grid gap-12", hasImage ? "lg:grid-cols-5" : "lg:grid-cols-1")}>
          {hasImage && (
            <div className="lg:col-span-3">
              <div className="aspect-w-16 aspect-h-10 bg-card rounded-lg overflow-hidden shadow-lg">
                <Image
                  src={listing.imageUrl}
                  alt={listing.title}
                  width={1200}
                  height={800}
                  className="object-cover w-full h-full"
                  data-ai-hint={listing.imageHint}
                />
              </div>
            </div>
          )}
          <div className={cn(hasImage ? "lg:col-span-2" : "lg:col-span-1 max-w-2xl mx-auto w-full")}>
            <div className="flex flex-col gap-6">
              {getStatusAlert()}
              <div>
                {listing.category && (
                  <Badge variant="secondary" className="mb-2">
                    <CategoryIcon categoryName={listing.category.name} className="h-4 w-4 mr-1.5" />
                    {listing.category.name}
                  </Badge>
                )}
                <h1 className="font-headline text-3xl lg:text-4xl font-bold tracking-tight">
                  {listing.title}
                </h1>
                <div className="flex items-baseline gap-2">
                  <p className="text-4xl font-bold text-primary mt-2">₹{listing.price.toLocaleString('en-IN')}</p>
                  {listing.salaryPeriod && <span className="text-muted-foreground">per {listing.salaryPeriod}</span>}
                </div>
              </div>
              
              {listing.seller && (
                <Card>
                  <CardHeader className="flex flex-row items-center gap-4">
                    <Avatar className="h-12 w-12">
                      <AvatarImage src={listing.seller.avatarUrl} alt={listing.seller.name} />
                      <AvatarFallback>{listing.seller.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <CardTitle className="text-lg flex items-center gap-2">
                        {getSellerIcon()}
                        {listing.seller.name}
                      </CardTitle>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <StarRating rating={listing.seller.averageRating} />
                        <span>({listing.seller.reviews} reviews)</span>
                      </div>
                    </div>
                  </CardHeader>
                </Card>
              )}

              <div>
                <h2 className="font-headline text-xl font-semibold mb-2">Description</h2>
                <p className="text-muted-foreground leading-relaxed">{listing.description}</p>
              </div>

               {listing.status === 'approved' && (
                <ActionButtons categoryName={listing.category?.name} seller={listing.seller} listing={listing} listingTitle={listing.title} />
              )}

              <Separator />
              
              <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="rate-seller" className="border-none">
                  <Card>
                    <AccordionTrigger className="w-full p-6 [&[data-state=open]>svg]:rotate-180">
                        <div className="flex items-center gap-3">
                          <Star className="h-5 w-5 text-primary" />
                          <h3 className="font-headline text-lg font-semibold">Rate this {sellerOrProviderText}</h3>
                        </div>
                    </AccordionTrigger>
                    <AccordionContent className="p-6 pt-0">
                      <SellerRatingForm sellerId={listing.sellerId} />
                    </AccordionContent>
                  </Card>
                </AccordionItem>
              </Accordion>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
