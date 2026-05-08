import Navbar from "../../../components/shared/Navbar";
import Footer from "../../../components/shared/Footer";

const CommonLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow">{children}</main>
      <Footer />
    </div>
  );
};

export default CommonLayout;
