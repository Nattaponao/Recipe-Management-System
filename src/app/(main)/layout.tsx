import Footer from "@/components/footer";
import NavbarServer from "@/components/NavbarServer";
import OnlinePing from "@/components/OnlinePing";

export default function MainLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <OnlinePing />
      <NavbarServer />
      {children}
      <Footer />
    </>
  );
}
