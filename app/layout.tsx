import type { Metadata } from 'next';
import './globals.css';
import { KanbanProvider } from '@/context/KanbanContext';
import { ThemeProvider } from '@/context/ThemeContext';

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
    <html lang="en" suppressHydrationWarning>
      <body>
        <ThemeProvider>
          <KanbanProvider>
            {children}
          </KanbanProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
