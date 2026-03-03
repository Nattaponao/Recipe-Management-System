import Footer from '@/components/footer';
import NavbarServer from '@/components/NavbarServer';
import OnlinePing from '@/components/OnlinePing';
import NextTopLoader from 'nextjs-toploader';

export const metadata = {
  title: 'Khang Saeb',
  description: 'Recipe App',
  icons: {
    icon: '/favicon.ico',
  },
};

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <NextTopLoader color="#637402" showSpinner={false} />
      <OnlinePing />
      <NavbarServer />
      {children}
      <Footer />
    </>
  );
}
