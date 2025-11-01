'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import JobApplicationForm from './job-application-form';
import type { User, Listing } from '@/lib/types';
import { Briefcase } from 'lucide-react';

interface ApplyJobDialogProps {
  user: User;
  listing: Listing;
}

export default function ApplyJobDialog({ user, listing }: ApplyJobDialogProps) {
  const [isOpen, setIsOpen] = React.useState(false);

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button size="lg" className="w-full">
          <Briefcase className="mr-2 h-5 w-5" />
          Apply Now
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[525px]">
        <DialogHeader>
          <DialogTitle className="font-headline text-2xl">Apply for {listing.title}</DialogTitle>
          <DialogDescription>
            Your information will be sent to {listing.seller?.name}.
          </DialogDescription>
        </DialogHeader>
        <JobApplicationForm user={user} onFormSubmit={() => setIsOpen(false)} />
      </DialogContent>
    </Dialog>
  );
}
