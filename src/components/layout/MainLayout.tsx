// src/components/layout/MainLayout.tsx
import React from 'react';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function MainLayout({ children }: { children: React.ReactNode }) {
  const { data: session } = useSession();

  return (
    <div className="min-h-screen flex flex-col">
      <header className="border-b">
        <div className="container mx-auto py-4 px-4 flex justify-between items-center">
          <Link href="/" className="font-bold text-xl">
            Bluebird Edu
          </Link>
          
          <nav className="flex items-center gap-6">
            <Link href="/dashboard" className="hover:text-blue-600">
              Dashboard
            </Link>
            <Link href="/practice" className="hover:text-blue-600">
              Practice
            </Link>
            <Link href="/mock-tests" className="hover:text-blue-600">
              Mock Tests
            </Link>
            
            {session ? (
              <div className="flex items-center gap-4">
                <Link href="/profile">
                  <div className="flex items-center gap-2">
                    {session.user?.image ? (
                      <img 
                        src={session.user.image} 
                        alt={session.user.name || "User"} 
                        className="w-8 h-8 rounded-full"
                      />
                    ) : (
                      <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white">
                        {session.user?.name?.[0] || "U"}
                      </div>
                    )}
                    <span>{session.user?.name}</span>
                  </div>
                </Link>
                <Button variant="outline" asChild>
                  <Link href="/api/auth/signout">Sign Out</Link>
                </Button>
              </div>
            ) : (
              <Button asChild>
                <Link href="/login">Sign In</Link>
              </Button>
            )}
          </nav>
        </div>
      </header>
      
      <main className="flex-1 container mx-auto py-8 px-4">
        {children}
      </main>
      
      <footer className="border-t py-6">
        <div className="container mx-auto px-4 text-center text-gray-500">
          © {new Date().getFullYear()} Bluebird Edu. All rights reserved.
        </div>
      </footer>
    </div>
  );
}