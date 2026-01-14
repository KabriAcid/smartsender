import { ReactNode } from 'react';
import { Sidebar } from './Sidebar';
import { BottomNav } from './BottomNav';
import { PageTransition } from './PageTransition';

interface DashboardLayoutProps {
  children: ReactNode;
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  return (
    <div className="min-h-screen bg-background">
      <Sidebar />
      <main className="xl:ml-64 min-h-screen pb-24 xl:pb-0">
        <PageTransition>
          <div className="p-4 sm:p-6 lg:p-8">{children}</div>
        </PageTransition>
      </main>
      <BottomNav />
    </div>
  );
}
