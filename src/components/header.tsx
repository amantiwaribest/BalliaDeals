'use client';

import Link from 'next/link';
import { SearchIcon, UserCircleIcon, PlusIcon, MenuIcon } from './icons';
import Logo from './logo';
import { Input } from './ui/input';
import { Button } from './ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from './ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { usePathname, useSearchParams, useRouter } from 'next/navigation';
import { useDebouncedCallback } from 'use-debounce';
import React from 'react';
import { Sheet, SheetContent, SheetTrigger } from './ui/sheet';
import { useIsMobile } from '@/hooks/use-mobile';
import { Separator } from './ui/separator';
import { useAuth } from '@/context/auth-context';
import { ShieldCheck } from 'lucide-react';

const UserNav = () => {
  const { isLoggedIn, user, logout } = useAuth();
  const router = useRouter();

  if (isLoggedIn && user) {
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="relative h-10 w-10 rounded-full">
            <Avatar className="h-10 w-10 border">
              <AvatarImage src={user.avatarUrl} alt={user.name} />
              <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
            </Avatar>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56" align="end" forceMount>
          <DropdownMenuLabel className="font-normal">
            <div className="flex flex-col space-y-1">
              <p className="text-sm font-medium leading-none">{user.name}</p>
              <p className="text-xs leading-none text-muted-foreground">
                {user.email}
              </p>
            </div>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          {user.role === 'admin' && (
            <DropdownMenuItem onClick={() => router.push('/admin')}>
              Admin Dashboard
            </DropdownMenuItem>
          )}
          <DropdownMenuItem onClick={() => router.push('/profile')}>
            Profile
          </DropdownMenuItem>
           <DropdownMenuItem>
            Settings
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => {
            logout();
            router.push('/');
          }}>
            Log out
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    );
  }

  return (
    <Button asChild>
      <Link href="/login">
        <UserCircleIcon className="mr-2 h-4 w-4" />
        Login / Sign Up
      </Link>
    </Button>
  );
};


const SearchBar = () => {
  const pathname = usePathname();
  const { replace } = useRouter();
  const searchParams = useSearchParams();

  const handleSearch = useDebouncedCallback((term: string) => {
    const params = new URLSearchParams(searchParams);
    if (term) {
      params.set('q', term);
    } else {
      params.delete('q');
    }
    replace(`${pathname}?${params.toString()}`);
  }, 300);

  return (
    <div className="relative w-full max-w-md">
       <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
      <Input
        type="search"
        placeholder="Find anything..."
        className="w-full rounded-full border-2 border-border bg-background pl-12 pr-4 h-12 text-base"
        onChange={(e) => handleSearch(e.target.value)}
        defaultValue={searchParams.get('q')?.toString()}
      />
    </div>
  );
};

const MobileNav = () => {
  const [isOpen, setIsOpen] = React.useState(false);
  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="md:hidden">
          <MenuIcon className="h-6 w-6" />
          <span className="sr-only">Toggle Navigation</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="p-0 w-[300px]">
        <div className="flex flex-col h-full">
          <div className="p-4 border-b">
            <Logo />
          </div>
          <div className="flex-grow p-4">
             <nav className="flex flex-col gap-4">
              <Link href="/listings/new" className="text-lg font-medium" onClick={() => setIsOpen(false)}>Sell</Link>
              <Link href="/profile" className="text-lg font-medium" onClick={() => setIsOpen(false)}>Profile</Link>
              <Link href="/login" className="text-lg font-medium" onClick={() => setIsOpen(false)}>Login</Link>
            </nav>
          </div>
          <Separator />
          <div className="p-4">
            <UserNav />
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
}

const Header = () => {
  return (
    <header className="w-full border-b bg-background sticky top-0 z-40">
      <div className="flex h-20 items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-2">
          <MobileNav />
          <div className="hidden md:block">
            <Logo />
          </div>
        </div>
        <div className="md:hidden">
          <Logo />
        </div>
        <div className="hidden md:flex flex-1 justify-center px-8">
          <SearchBar />
        </div>
        <div className="flex items-center gap-2">
            <UserNav />
            <Button asChild className="hidden md:flex bg-primary hover:bg-primary/90 text-primary-foreground font-bold rounded-full">
              <Link href="/listings/new">
                <PlusIcon className="mr-1 h-5 w-5" />
                SELL
              </Link>
            </Button>
          </div>
      </div>
    </header>
  );
};

export default Header;
