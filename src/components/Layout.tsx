import { useState } from 'react';
import { Menu, X, BookOpen, Video, Home, Info, Star, LogIn, UserPlus, LogOut, User, LayoutDashboard, ChevronDown } from 'lucide-react';
import Logo from './Logo';
import { useAuth } from '../contexts/AuthContext';

type Page = string;

interface LayoutProps {
  children: React.ReactNode;
  currentPage: Page;
  onNavigate: (page: Page) => void;
}

const navLinks = [
  { label: 'Home', page: 'home', icon: Home },
  { label: 'About', page: 'about', icon: Info },
  { label: 'Features', page: 'features', icon: Star },
  { label: 'Videos', page: 'videos', icon: Video },
];

export default function Layout({ children, currentPage, onNavigate }: LayoutProps) {
  const { profile, signOut } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  if (typeof window !== 'undefined') {
    window.onscroll = () => setScrolled(window.scrollY > 20);
  }

  const handleSignOut = async () => {
    await signOut();
    onNavigate('home');
    setUserMenuOpen(false);
  };

  const getDashboardPage = () => {
    if (!profile) return 'login';
    if (profile.role === 'admin') return 'admin';
    if (profile.role === 'faculty') return 'faculty';
    return 'student';
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? 'bg-forest shadow-lg py-2' : 'bg-forest py-3'}`}
        style={{ backgroundColor: '#1a3d2e' }}>
        <div className="max-w-7xl mx-auto px-4 flex items-center justify-between">
          <button onClick={() => onNavigate('home')} className="flex items-center gap-2 hover:opacity-90 transition-opacity">
            <Logo size="sm" className="h-10" />
          </button>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map(({ label, page }) => (
              <button
                key={page}
                onClick={() => onNavigate(page)}
                className={`px-4 py-2 rounded-lg font-medium text-sm transition-all duration-200 ${
                  currentPage === page
                    ? 'bg-accent-500 text-white'
                    : 'text-white/80 hover:text-white hover:bg-white/10'
                }`}
              >
                {label}
              </button>
            ))}
          </nav>

          {/* Right Actions */}
          <div className="hidden md:flex items-center gap-3">
            {profile ? (
              <div className="relative">
                <button
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-xl transition-all duration-200"
                >
                  <div className="w-7 h-7 rounded-full bg-accent-500 flex items-center justify-center text-xs font-bold">
                    {profile.full_name.charAt(0).toUpperCase()}
                  </div>
                  <span className="text-sm font-medium max-w-24 truncate">{profile.full_name}</span>
                  <ChevronDown size={14} className={`transition-transform ${userMenuOpen ? 'rotate-180' : ''}`} />
                </button>
                {userMenuOpen && (
                  <div className="absolute right-0 top-full mt-2 w-52 bg-white rounded-xl shadow-xl border border-gray-100 overflow-hidden animate-slide-up">
                    <div className="px-4 py-3 border-b border-gray-100 bg-primary-50">
                      <p className="font-semibold text-gray-800 text-sm">{profile.full_name}</p>
                      <p className="text-xs text-gray-500 capitalize">{profile.role}</p>
                    </div>
                    <button
                      onClick={() => { onNavigate(getDashboardPage()); setUserMenuOpen(false); }}
                      className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-gray-700 hover:bg-primary-50 transition-colors"
                    >
                      <LayoutDashboard size={15} /> Dashboard
                    </button>
                    <button
                      onClick={() => { onNavigate('profile'); setUserMenuOpen(false); }}
                      className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-gray-700 hover:bg-primary-50 transition-colors"
                    >
                      <User size={15} /> Profile
                    </button>
                    <div className="border-t border-gray-100">
                      <button
                        onClick={handleSignOut}
                        className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors"
                      >
                        <LogOut size={15} /> Sign Out
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <>
                <button
                  onClick={() => onNavigate('login')}
                  className="flex items-center gap-1.5 text-white/80 hover:text-white px-4 py-2 rounded-lg font-medium text-sm transition-all hover:bg-white/10"
                >
                  <LogIn size={15} /> Login
                </button>
                <button
                  onClick={() => onNavigate('register')}
                  className="btn-primary text-sm py-2 px-5"
                >
                  <UserPlus size={15} className="inline mr-1" /> Get Started
                </button>
              </>
            )}
          </div>

          {/* Mobile menu toggle */}
          <button
            className="md:hidden text-white p-2 hover:bg-white/10 rounded-lg"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            {mobileOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>

        {/* Mobile Nav */}
        {mobileOpen && (
          <div className="md:hidden border-t border-white/10 mt-2 px-4 pb-4 animate-slide-up" style={{ backgroundColor: '#1a3d2e' }}>
            <nav className="flex flex-col gap-1 mt-3">
              {navLinks.map(({ label, page, icon: Icon }) => (
                <button
                  key={page}
                  onClick={() => { onNavigate(page); setMobileOpen(false); }}
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all ${
                    currentPage === page ? 'bg-accent-500 text-white' : 'text-white/80 hover:bg-white/10 hover:text-white'
                  }`}
                >
                  <Icon size={16} /> {label}
                </button>
              ))}
              {profile ? (
                <>
                  <button
                    onClick={() => { onNavigate(getDashboardPage()); setMobileOpen(false); }}
                    className="flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium text-white/80 hover:bg-white/10 hover:text-white"
                  >
                    <LayoutDashboard size={16} /> Dashboard
                  </button>
                  <button
                    onClick={handleSignOut}
                    className="flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium text-red-400 hover:bg-red-500/10"
                  >
                    <LogOut size={16} /> Sign Out
                  </button>
                </>
              ) : (
                <>
                  <button onClick={() => { onNavigate('login'); setMobileOpen(false); }}
                    className="flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium text-white/80 hover:bg-white/10">
                    <LogIn size={16} /> Login
                  </button>
                  <button onClick={() => { onNavigate('register'); setMobileOpen(false); }}
                    className="btn-primary text-sm py-2 mt-1">
                    <UserPlus size={15} className="inline mr-1" /> Get Started
                  </button>
                </>
              )}
            </nav>
          </div>
        )}
      </header>

      {/* Main content with top padding for fixed header */}
      <main className="flex-1 pt-16">
        {children}
      </main>

      {/* Footer */}
      <footer className="text-white py-12 mt-8" style={{ backgroundColor: '#0f2a1e' }}>
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div className="md:col-span-2">
              <Logo size="md" className="mb-4" />
              <p className="text-white/70 text-sm leading-relaxed max-w-xs">
                Empowering young minds from Nursery to Grade 5 with AI-powered, interactive learning experiences.
              </p>
              <div className="flex gap-3 mt-4">
                <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center cursor-pointer hover:bg-accent-500 transition-colors">
                  <BookOpen size={14} />
                </div>
                <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center cursor-pointer hover:bg-accent-500 transition-colors">
                  <Video size={14} />
                </div>
              </div>
            </div>
            <div>
              <h4 className="font-semibold text-accent-400 mb-3 text-sm uppercase tracking-wide">Quick Links</h4>
              <ul className="space-y-2 text-sm text-white/70">
                {navLinks.map(({ label, page }) => (
                  <li key={page}>
                    <button onClick={() => onNavigate(page)} className="hover:text-accent-400 transition-colors">{label}</button>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-accent-400 mb-3 text-sm uppercase tracking-wide">Contact</h4>
              <div className="space-y-2 text-sm text-white/70">
                <p className="font-medium text-white">Arumugasamy G</p>
                <p>Founder & CEO</p>
                <a href="tel:+919944656602" className="hover:text-accent-400 transition-colors block">+91 9944656602</a>
                <a href="http://www.dreamlearn.education.com" className="hover:text-accent-400 transition-colors block">www.dreamlearn.education.com</a>
              </div>
            </div>
          </div>
          <div className="border-t border-white/10 pt-6 flex flex-col md:flex-row justify-between items-center gap-3 text-sm text-white/50">
            <p>&copy; 2025 Dream Learn Education Platform. All rights reserved.</p>
            <p>Designed for young learners, Nursery to Grade 5</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
