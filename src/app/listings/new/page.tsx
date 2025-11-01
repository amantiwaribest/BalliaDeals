'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useToast } from '@/hooks/use-toast';
import { UploadIcon } from '@/components/icons';
import Image from 'next/image';

const listingFormSchema = z.object({
  title: z.string().min(5, 'Title must be at least 5 characters long'),
  description: z.string().min(20, 'Description must be at least 20 characters long'),
  price: z.coerce.number().positive('Price must be a positive number'),
  category: z.string({ required_error: 'Please select a category' }),
});

type ListingFormValues = z.infer<typeof listingFormSchema>;

const categories = [
  { id: 'cat-10', name: 'Cars'},
  { id: 'cat-11', name: 'Mobiles'},
  { id: 'cat-12', name: 'Bikes'},
  { id: 'cat-13', name: 'Real Estate'},
  { id: 'cat-1', name: 'Electronics' },
  { id: 'cat-14', name: 'Jobs'},
  { id: 'cat-15', name: 'Services'},
  { id: 'cat-2', name: 'Furniture' },
  { id: 'cat-4', name: 'Books' },
  { id: 'cat-5', 'name': 'Sports' },
  { id: 'cat-16', name: 'Others' },
];

export default function NewListingPage() {
  const { toast } = useToast();
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const form = useForm<ListingFormValues>({
    resolver: zodResolver(listingFormSchema),
    defaultValues: {
      title: '',
      description: '',
    },
  });

  const onSubmit = (data: ListingFormValues) => {
    // In a real app, you would send this to your backend
    const newListing = {
      ...data,
      status: 'pending',
    };
    console.log('New listing submitted:', newListing);

    toast({
      title: 'Listing Submitted!',
      description: `Your item "${data.title}" is pending approval.`,
    });
    form.reset();
    setImagePreview(null);
  };

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <Card className="max-w-3xl mx-auto border-none shadow-none">
        <CardHeader className="text-center p-0 mb-8">
          <CardTitle className="font-headline text-3xl md:text-4xl">Sell an Item</CardTitle>
          <CardDescription className="text-lg">Fill out the details below to list your item on BalliaDeals.</CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-base">Item Title</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g. Vintage Leather Armchair" {...field} className="h-12 text-base" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-base">Description</FormLabel>
                    <FormControl>
                      <Textarea placeholder="Describe your item in detail..." {...field} rows={6} className="text-base" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <FormField
                  control={form.control}
                  name="price"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-base">Price (₹)</FormLabel>
                      <FormControl>
                        <Input type="number" placeholder="0" {...field} className="h-12 text-base" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="category"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-base">Category</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger className="h-12 text-base">
                            <SelectValue placeholder="Select a category" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {categories.map(cat => (
                            <SelectItem key={cat.id} value={cat.id}>{cat.name}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div>
                <FormLabel className="text-base">Item Image</FormLabel>
                <div className="mt-2 flex justify-center rounded-lg border-2 border-dashed border-input px-6 py-10">
                  {imagePreview ? (
                    <div className="relative w-full max-w-sm">
                      <Image src={imagePreview} alt="Upload preview" width={400} height={300} className="rounded-md object-cover" />
                    </div>
                  ) : (
                    <div className="text-center">
                      <UploadIcon className="mx-auto h-12 w-12 text-gray-400" />
                      <p className="mt-4 text-sm text-muted-foreground">Click the button below to upload an image</p>
                    </div>
                  )}
                </div>
                <div className="mt-4">
                  <Button type="button" variant="outline" size="lg">
                    <UploadIcon className="mr-2 h-4 w-4" /> Upload Image
                  </Button>
                </div>
              </div>

              <Button type="submit" size="lg" className="w-full text-lg h-14">
                Submit for Approval
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
