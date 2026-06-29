import Navbar from './Navbar';
import Footer from './Footer';
import SearchModal from '../search/SearchModal';
import { ReactNode } from 'react';

interface LayoutProps {
  children: ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <SearchModal />
      <main className="flex-1 pt-16 animate-fade-in">
        {children}
      </main>
      <Footer />
    </div>
  );
};

export default Layout;
