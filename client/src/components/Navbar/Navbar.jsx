import { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { BookOpen, ChevronRight, GraduationCap, LogIn, Menu, Search, User, X } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const navItems = [
  { to: '/', label: 'Home' },
  { to: '/about', label: 'About' },
  { to: '/faculty', label: 'Faculty' },
  { to: '/academics', label: 'Academics' },
  { to: '/study-materials', label: 'Resources' },
  { to: '/mcq-test', label: 'MCQ Test' },
  { to: '/student/dashboard', label: 'Student Zone' },
  { to: '/gallery', label: 'Gallery' },
  { to: '/contact', label: 'Contact' },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-slate-200 bg-white/90 backdrop-blur-md">
      <div className="section-shell flex h-24 items-center justify-between gap-4">
        <Link to="/" className="flex items-center gap-4">
          <div className="flex h-14 w-14 items-center justify-center overflow-hidden rounded-2xl bg-white shadow-soft ring-1 ring-slate-200">
            <img src="/college-logo.png" alt="Mahendra Engineering College logo" className="h-full w-full object-contain" />
          </div>
          <div>
            <p className="text-[11px] uppercase tracking-[0.24em] text-blue-600">Mahendra Engineering College</p>
            <p className="text-xs text-slate-500">Education • Discipline • Success</p>
            <p className="mt-1 text-sm font-semibold text-slate-800">Department of Information Technology</p>
          </div>
        </Link>

        <nav className="hidden items-center gap-2 lg:flex">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `rounded-full px-3 py-2 text-sm font-medium transition ${
                  isActive ? 'bg-gradient-to-r from-primaryBlue to-skyBlue text-white shadow-soft' : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                }`
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="hidden items-center gap-3 lg:flex">
          <button className="rounded-full border border-slate-200 p-2 text-slate-600 transition hover:border-blue-200 hover:text-primaryBlue" aria-label="Search">
            <Search className="h-4 w-4" />
          </button>

          {user ? (
            <>
              <Link to="/student/dashboard" className="inline-flex items-center gap-2 rounded-full bg-slate-100 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-200">
                <User className="h-4 w-4" />
                {user.name || 'Student'}
              </Link>
              <button
                onClick={() => {
                  logout();
                  navigate('/');
                }}
                className="rounded-full border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 hover:border-blue-200 hover:text-primaryBlue"
              >
                Logout
              </button>
            </>
          ) : (
            <Link to="/login" className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-primaryBlue to-skyBlue px-4 py-2 text-sm font-semibold text-white shadow-soft transition hover:scale-[1.02]">
              <LogIn className="h-4 w-4" />
              Login
            </Link>
          )}
        </div>

        <button className="rounded-full border border-slate-200 p-2 text-slate-700 lg:hidden" onClick={() => setOpen((prev) => !prev)} aria-label="Toggle menu">
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {open && (
        <div className="border-t border-slate-200 bg-white lg:hidden">
          <div className="section-shell flex flex-col gap-2 py-4">
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                onClick={() => setOpen(false)}
                className={({ isActive }) =>
                  `flex items-center justify-between rounded-xl px-3 py-2 text-sm font-medium ${
                    isActive ? 'bg-primaryBlue text-white' : 'text-slate-700 hover:bg-slate-100'
                  }`
                }
              >
                {item.label}
                <ChevronRight className="h-4 w-4" />
              </NavLink>
            ))}

            {!user && (
              <Link to="/login" onClick={() => setOpen(false)} className="mt-2 inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-primaryBlue to-skyBlue px-4 py-3 text-sm font-semibold text-white">
                <LogIn className="h-4 w-4" />
                Login
              </Link>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
