import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import '../styles/globals.css';
import { AuthProvider } from '@/context/AuthContext';
import { TodoProvider } from '@/context/TodoContext';
import { ThemeProvider } from '@/context/ThemeContext';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Todo App',
  description: 'A simple todo application',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang='en' suppressHydrationWarning>
      <body className={`${inter.className}`}>
        <ThemeProvider>
          <AuthProvider>
            <TodoProvider>
              <div className='min-h-screen'>{children}</div>
            </TodoProvider>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
