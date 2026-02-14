import Nav from '@/components/nav';
import Footer from '@/components/footer';
import NavbarServer from '@/components/NavbarServer';

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <NavbarServer />
      {children}
      <Footer />
    </>
  );
}
