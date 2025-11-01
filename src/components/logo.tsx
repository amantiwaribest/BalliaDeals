import Link from 'next/link';
import type { FC } from 'react';

const Logo: FC = () => {
  return (
    <Link href="/" className="flex items-center gap-2">
      <span className="text-2xl font-bold font-headline text-foreground tracking-tight">
        Ballia<span className="text-primary">Deals</span>
      </span>
    </Link>
  );
};

export default Logo;
