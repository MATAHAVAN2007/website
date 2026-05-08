import { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import Layout from './components/Layout';
import Home from './pages/Home';
import About from './pages/About';
import Features from './pages/Features';
import Videos from './pages/Videos';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import StudentDashboard from './pages/student/Dashboard';
import FacultyDashboard from './pages/faculty/Dashboard';
import AdminDashboard from './pages/admin/Dashboard';

type Page = 'home' | 'about' | 'features' | 'videos' | 'login' | 'register' | 'student' | 'faculty' | 'admin' | 'dashboard' | 'profile' | 'courses' | 'forgot-password';

const PUBLIC_PAGES: Page[] = ['home', 'about', 'features', 'videos', 'login', 'register', 'forgot-password'];

function AppInner() {
  const { profile, loading } = useAuth();
  const [page, setPage] = useState<Page>('home');

  useEffect(() => {
    const hash = window.location.hash.slice(1) as Page;
    if (hash && [...PUBLIC_PAGES, 'student', 'faculty', 'admin', 'dashboard'].includes(hash)) {
      setPage(hash);
    }
  }, []);

  const navigate = (to: string) => {
    const target = to as Page;
    if (target === 'dashboard') {
      if (profile?.role === 'admin') setPage('admin');
      else if (profile?.role === 'faculty') setPage('faculty');
      else setPage('student');
    } else {
      setPage(target as Page);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
    window.location.hash = to;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#1a3d2e' }}>
        <div className="text-center">
          <img src="/image.png" alt="Dream Learn" className="h-16 mx-auto mb-6 animate-pulse" />
          <div className="w-8 h-8 border-2 border-white/30 border-t-white rounded-full animate-spin mx-auto" />
        </div>
      </div>
    );
  }

  // Dashboard pages — no Layout wrapper
  if (page === 'student') return <StudentDashboard onNavigate={navigate} />;
  if (page === 'faculty') return <FacultyDashboard onNavigate={navigate} />;
  if (page === 'admin') return <AdminDashboard onNavigate={navigate} />;

  // Auth pages — no Layout wrapper
  if (page === 'login') return <Login onNavigate={navigate} />;
  if (page === 'register') return <Register onNavigate={navigate} />;
  if (page === 'forgot-password') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-3xl shadow-xl p-8 max-w-md w-full text-center">
          <img src="/image.png" alt="Dream Learn" className="h-12 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Reset Password</h2>
          <p className="text-gray-500 mb-6">Contact our support team to reset your password.</p>
          <a href="tel:+919944656602" className="btn-green block w-full py-3 text-center">
            Call +91 9944656602
          </a>
          <button onClick={() => navigate('login')} className="mt-3 text-sm text-primary-600 hover:underline">
            Back to Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <Layout currentPage={page} onNavigate={navigate}>
      {page === 'home' && <Home onNavigate={navigate} />}
      {page === 'about' && <About onNavigate={navigate} />}
      {page === 'features' && <Features onNavigate={navigate} />}
      {page === 'videos' && <Videos onNavigate={navigate} />}
      {page === 'courses' && <Videos onNavigate={navigate} />}
    </Layout>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppInner />
    </AuthProvider>
  );
}
