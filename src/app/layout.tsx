import type { Metadata } from 'next';
import './globals.css';
import { CartProvider } from '@/lib/store/cart-context';
import { AuthProvider } from '@/lib/store/auth-context';
import { AgeGateModal } from '@/components/store/AgeGateModal';
import { AnnouncementBar } from '@/components/store/AnnouncementBar';
import { Header } from '@/components/store/Header';
import { Footer } from '@/components/store/Footer';
import { CartDrawer } from '@/components/store/CartDrawer';

export const metadata: Metadata = {
  title: 'KILLASNUS | Premium Nicotine Pouches Store',
  description:
    'Authentic Scandinavian nicotine pouches. Velo, Pablo, Killa, ZYN, Iceberg and more. Fast tracked UK & international delivery.',
  keywords: [
    'nicotine pouches',
    'killa',
    'pablo',
    'velo',
    'zyn',
    'white fox',
    'tobacco free snus',
    'buy snus uk',
  ],
  openGraph: {
    title: 'KILLASNUS | Premium Nicotine Pouches Store',
    description: 'Authentic Scandinavian nicotine pouches. Fast tracked delivery.',
    siteName: 'KILLASNUS',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className="min-h-screen bg-[#09090b] text-[#f4f4f5] antialiased selection:bg-gold-500 selection:text-black">
        <AuthProvider>
          <CartProvider>
            <AgeGateModal />
            <AnnouncementBar />
            <Header />
            <CartDrawer />
            <main className="min-h-[calc(100vh-280px)]">{children}</main>
            <Footer />
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  );
}

