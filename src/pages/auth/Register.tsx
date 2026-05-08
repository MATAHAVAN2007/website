import { useState } from 'react';
import { User, Mail, Phone, Lock, Eye, EyeOff, UserPlus, AlertCircle, CheckCircle, GraduationCap, Briefcase } from 'lucide-react';
import Logo from '../../components/Logo';
import { useAuth } from '../../contexts/AuthContext';
import { UserRole } from '../../types';

interface RegisterProps { onNavigate: (page: string) => void; }

export default function Register({ onNavigate }: RegisterProps) {
  const { signUp } = useAuth();
  const [form, setForm] = useState({ full_name: '', email: '', phone: '', password: '', confirmPassword: '', role: 'student' as UserRole });
  const [showPwd, setShowPwd] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (form.password !== form.confirmPassword) { setError('Passwords do not match'); return; }
    if (form.password.length < 6) { setError('Password must be at least 6 characters'); return; }
    setLoading(true);
    const { error } = await signUp(form.email, form.password, {
      full_name: form.full_name,
      phone: form.phone,
      role: form.role,
    });
    setLoading(false);
    if (error) {
      setError(error.message || 'Registration failed');
    } else {
      setSuccess(true);
      setTimeout(() => onNavigate('login'), 3000);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="text-center max-w-md">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle size={40} className="text-green-500" />
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Account Created!</h2>
          <p className="text-gray-500 mb-6">Welcome to Dream Learn! Redirecting you to login...</p>
          <button onClick={() => onNavigate('login')} className="btn-green px-8 py-3">Go to Login</button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden">
          <div className="gradient-hero p-8 text-center">
            <Logo size="md" className="mx-auto mb-3" />
            <h1 className="text-2xl font-bold text-white mt-2">Join Dream Learn</h1>
            <p className="text-white/70 text-sm mt-1">Start your learning journey today</p>
          </div>

          <div className="p-8">
            {error && (
              <div className="flex items-center gap-2 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl mb-5 text-sm">
                <AlertCircle size={16} /> {error}
              </div>
            )}

            {/* Role selector */}
            <div className="mb-5">
              <label className="block text-sm font-medium text-gray-700 mb-2">I am a...</label>
              <div className="grid grid-cols-2 gap-3">
                <button type="button"
                  onClick={() => setForm({ ...form, role: 'student' })}
                  className={`flex items-center gap-2 p-3 rounded-xl border-2 text-sm font-medium transition-all ${form.role === 'student' ? 'border-primary-500 bg-primary-50 text-primary-700' : 'border-gray-200 text-gray-600 hover:border-gray-300'}`}
                >
                  <GraduationCap size={18} /> Student
                </button>
                <button type="button"
                  onClick={() => setForm({ ...form, role: 'faculty' })}
                  className={`flex items-center gap-2 p-3 rounded-xl border-2 text-sm font-medium transition-all ${form.role === 'faculty' ? 'border-primary-500 bg-primary-50 text-primary-700' : 'border-gray-200 text-gray-600 hover:border-gray-300'}`}
                >
                  <Briefcase size={18} /> Faculty
                </button>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Full Name</label>
                <div className="relative">
                  <User size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input type="text" required value={form.full_name}
                    onChange={e => setForm({ ...form, full_name: e.target.value })}
                    placeholder="Your full name"
                    className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl text-sm focus:border-accent-400 transition-colors"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Email Address</label>
                <div className="relative">
                  <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input type="email" required value={form.email}
                    onChange={e => setForm({ ...form, email: e.target.value })}
                    placeholder="you@example.com"
                    className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl text-sm focus:border-accent-400 transition-colors"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Phone Number</label>
                <div className="relative">
                  <Phone size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input type="tel" value={form.phone}
                    onChange={e => setForm({ ...form, phone: e.target.value })}
                    placeholder="+91 9999999999"
                    className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl text-sm focus:border-accent-400 transition-colors"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Password</label>
                <div className="relative">
                  <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input type={showPwd ? 'text' : 'password'} required value={form.password}
                    onChange={e => setForm({ ...form, password: e.target.value })}
                    placeholder="Min 6 characters"
                    className="w-full pl-10 pr-10 py-3 border border-gray-200 rounded-xl text-sm focus:border-accent-400 transition-colors"
                  />
                  <button type="button" onClick={() => setShowPwd(!showPwd)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                    {showPwd ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Confirm Password</label>
                <div className="relative">
                  <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input type="password" required value={form.confirmPassword}
                    onChange={e => setForm({ ...form, confirmPassword: e.target.value })}
                    placeholder="Repeat your password"
                    className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl text-sm focus:border-accent-400 transition-colors"
                  />
                </div>
              </div>
              <button type="submit" disabled={loading}
                className="w-full btn-green py-3 text-base flex items-center justify-center gap-2 mt-2">
                {loading ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <><UserPlus size={18} /> Create Account</>
                )}
              </button>
            </form>

            <div className="mt-5 text-center">
              <p className="text-sm text-gray-500">
                Already have an account?{' '}
                <button onClick={() => onNavigate('login')} className="text-primary-600 font-semibold hover:underline">
                  Sign in
                </button>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
