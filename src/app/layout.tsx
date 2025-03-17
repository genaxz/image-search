'use client';
import { SavedGifsProvider } from './components/context/SavedGifsContext';
import { useReportWebVitals } from 'next/web-vitals';
import reportWebVitals from './reportWebVitals';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  useReportWebVitals(reportWebVitals);

  return (
    <html lang="en">
      <body>
        <SavedGifsProvider>{children}</SavedGifsProvider>
      </body>
    </html>
  );
}
