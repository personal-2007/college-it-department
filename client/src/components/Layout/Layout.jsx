import { Outlet } from 'react-router-dom';
import Navbar from '../Navbar/Navbar';
import Footer from '../Footer/Footer';

export default function Layout() {
  return (
    <div className="min-h-screen bg-background text-slate-800">
      <Navbar />
      <main className="pt-24">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
