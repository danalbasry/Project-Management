import type { Metadata, Viewport } from 'next';
import './globals.css';
import { KanbanProvider } from '@/context/KanbanContext';

export const metadata: Metadata = {
  title: 'Kanban Board - Project Management',
  description: 'A beautiful kanban board for managing your projects',
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  themeColor: '#0f0d1d',
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
