import { useState } from 'react';
import { Mail, Lock, Eye, EyeOff, LogIn, AlertCircle } from 'lucide-react';
import Logo from '../../components/Logo';
import { useAuth } from '../../contexts/AuthContext';

interface LoginProps { onNavigate: (page: string) => void; }

export default function Login({ onNavigate }: LoginProps) {
  const { signIn } = useAuth();
  const [form, setForm] = useState({ email: '', password: '' });
  const [showPwd, setShowPwd] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    const { error } = await signIn(form.email, form.password);
    setLoading(false);
    if (error) {
      setError(error.message || 'Invalid email or password');
    } else {
      onNavigate('dashboard');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden">
          {/* Header */}
          <div className="gradient-hero p-8 text-center">
            <Logo size="md" className="mx-auto mb-3" />
            <h1 className="text-2xl font-bold text-white mt-2">Welcome Back!</h1>
            <p className="text-white/70 text-sm mt-1">Sign in to continue learning</p>
          </div>

          {/* Form */}
          <div className="p-8">
            {error && (
              <div className="flex items-center gap-2 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl mb-5 text-sm">
                <AlertCircle size={16} /> {error}
              </div>
            )}
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Email Address</label>
                <div className="relative">
                  <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type="email"
                    required
                    value={form.email}
                    onChange={e => setForm({ ...form, email: e.target.value })}
                    placeholder="you@example.com"
                    className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl text-sm focus:border-accent-400 transition-colors"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Password</label>
                <div className="relative">
                  <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type={showPwd ? 'text' : 'password'}
                    required
                    value={form.password}
                    onChange={e => setForm({ ...form, password: e.target.value })}
                    placeholder="Enter your password"
                    className="w-full pl-10 pr-10 py-3 border border-gray-200 rounded-xl text-sm focus:border-accent-400 transition-colors"
                  />
                  <button type="button" onClick={() => setShowPwd(!showPwd)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                    {showPwd ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>
              <div className="flex justify-end">
                <button type="button" onClick={() => onNavigate('forgot-password')}
                  className="text-sm text-primary-600 hover:text-primary-700 font-medium">
                  Forgot password?
                </button>
              </div>
              <button type="submit" disabled={loading}
                className="w-full btn-green py-3 text-base flex items-center justify-center gap-2">
                {loading ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <><LogIn size={18} /> Sign In</>
                )}
              </button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-sm text-gray-500">
                Don't have an account?{' '}
                <button onClick={() => onNavigate('register')} className="text-primary-600 font-semibold hover:underline">
                  Create one free
                </button>
              </p>
            </div>

            {/* Demo logins */}
            <div className="mt-6 p-4 bg-gray-50 rounded-xl border border-gray-200">
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Demo Accounts</p>
              <div className="space-y-1.5 text-xs text-gray-600">
                <p>Admin: admin@dreamlearn.com / admin123</p>
                <p>Faculty: faculty@dreamlearn.com / faculty123</p>
                <p>Student: student@dreamlearn.com / student123</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
