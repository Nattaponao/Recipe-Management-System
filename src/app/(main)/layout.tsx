import Footer from '@/components/footer';
import NavbarV2Server from '@/components/NavbarV2Server'; // ใช้ตัวเดียวกับ admin layout
import OnlinePing from '@/components/OnlinePing';
import NextTopLoader from 'nextjs-toploader';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'Khang Saeb',
  description: 'Recipe App',
  icons: {
    icon: '/favicon.ico',
  },
};

export default async function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <NextTopLoader color="#637402" showSpinner={false} />
      <OnlinePing />
      <NavbarV2Server />
      {children}
      <Footer />
    </>
  );
}
