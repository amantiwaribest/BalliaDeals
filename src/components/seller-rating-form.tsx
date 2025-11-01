'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import StarRating from './star-rating';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from './ui/form';

const ratingSchema = z.object({
  rating: z.number().min(1, 'Rating is required').max(5),
  comment: z.string().max(500, 'Comment must be 500 characters or less').optional(),
});

type RatingFormValues = z.infer<typeof ratingSchema>;

interface SellerRatingFormProps {
  sellerId: string;
}

export default function SellerRatingForm({ sellerId }: SellerRatingFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const form = useForm<RatingFormValues>({
    resolver: zodResolver(ratingSchema),
    defaultValues: {
      rating: 0,
      comment: '',
    },
  });

  const onSubmit = async (data: RatingFormValues) => {
    setIsSubmitting(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    try {
      // In a real app, you'd save this to your database
      console.log('Rating submitted for seller:', sellerId, data);
      
      toast({
        title: 'Rating Submitted!',
        description: "Thanks for your feedback.",
        variant: 'default',
      });
      form.reset();
    } catch (error) {
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'An unknown error occurred.',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div>
        <p className="text-sm text-muted-foreground mb-4">Share your experience to help others.</p>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="rating"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Your Rating</FormLabel>
                  <FormControl>
                    <StarRating
                      rating={field.value}
                      onRate={(rate) => field.onChange(rate)}
                      isInteractive
                      size={24}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="comment"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Additional Comments (optional)</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Tell us more about your experience..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Submitting...' : 'Submit Rating'}
            </Button>
          </form>
        </Form>
    </div>
  );
}
