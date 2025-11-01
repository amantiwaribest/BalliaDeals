'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useToast } from '@/hooks/use-toast';
import type { User } from '@/lib/types';
import { Separator } from '@/components/ui/separator';

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
  path: ["resume"], // you can also use "resumeLink"
});


type ApplicationFormValues = z.infer<typeof applicationFormSchema>;

interface JobApplicationFormProps {
  user: User;
  onFormSubmit: () => void;
}

export default function JobApplicationForm({ user, onFormSubmit }: JobApplicationFormProps) {
  const { toast } = useToast();

  const form = useForm<ApplicationFormValues>({
    resolver: zodResolver(applicationFormSchema),
    defaultValues: {
      name: user.name,
      email: user.email,
      mobile: '+91 12345 67890', // Placeholder mobile
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
