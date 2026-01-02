import Header from './Header';
import Footer from './Footer';
import { Outlet } from 'react-router-dom';

function PublicLayout() {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-gray-50 via-white to-gray-50/50">
      <Header />
      <main className="flex-grow pt-16 md:pt-20">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}

export default PublicLayout;
