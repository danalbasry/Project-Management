import type { Metadata } from 'next';
import './globals.css';
import { KanbanProvider } from '@/context/KanbanContext';

export const metadata: Metadata = {
  title: 'Kanban Board - Project Management',
  description: 'A beautiful kanban board for managing your projects',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <KanbanProvider>
          {children}
        </KanbanProvider>
      </body>
    </html>
  );
}
