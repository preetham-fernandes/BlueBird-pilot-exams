// src/app/dashboard/page.tsx
'use client';

import { useSession } from 'next-auth/react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login');
    }
  }, [status, router]);

  if (status === 'loading') {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Welcome, {session?.user?.name || 'Pilot'}</h1>
        <p className="text-gray-500 mt-1">Your learning dashboard at Bluebird Edu</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Practice Mode</CardTitle>
            <CardDescription>
              Practice questions by subject with immediate feedback
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="mb-4">
              Choose a subject and practice at your own pace with detailed explanations for each question.
            </p>
            <Button asChild className="w-full">
              <Link href="/practice">Start Practice</Link>
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Mock Tests</CardTitle>
            <CardDescription>
              Take timed mock exams to test your knowledge
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="mb-4">
              Simulate real exam conditions with timed tests covering all subjects.
            </p>
            <Button asChild className="w-full">
              <Link href="/mock-tests">Take Mock Test</Link>
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Performance</CardTitle>
            <CardDescription>
              Track your progress and identify areas to improve
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="mb-4">
              View your test history and performance analytics.
            </p>
            <Button asChild variant="outline" className="w-full">
              <Link href="/performance">View Performance</Link>
            </Button>
          </CardContent>
        </Card>
      </div>

      {session?.user?.role === 'admin' && (
        <div className="mt-8">
          <h2 className="text-2xl font-bold mb-4">Admin Tools</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Question Management</CardTitle>
                <CardDescription>
                  Manage the question bank
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button asChild className="w-full">
                  <Link href="/admin/questions">Manage Questions</Link>
                </Button>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>User Management</CardTitle>
                <CardDescription>
                  View and manage user accounts
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button asChild className="w-full">
                  <Link href="/admin/users">Manage Users</Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      )}
    </div>
  );
}