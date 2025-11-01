'use client';

import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

export default function BackButton() {
  const router = useRouter();

  return (
    <Button
      variant="outline"
      size="icon"
      className="rounded-full"
      onClick={() => router.back()}
    >
      <ArrowLeft className="h-5 w-5" />
      <span className="sr-only">Back</span>
    </Button>
  );
}
