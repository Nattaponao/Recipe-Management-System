import Footer from '@/components/footer';
import OnlinePing from '@/components/OnlinePing';
import NextTopLoader from 'nextjs-toploader';
import NavbarAuthClient from '@/components/NavbarAuthClient';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export const metadata = {
  title: 'Khang Saeb',
  description:
    'อาณาจักรแห่งความอร่อย รวมสูตรอาหารไทยและนานาชาติ ค้นหาเมนูจากวัตถุดิบที่มี',
  icons: { icon: '/favicon.ico' },
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
      <NavbarAuthClient />
      {children}
      <Footer />
    </>
  );
}
