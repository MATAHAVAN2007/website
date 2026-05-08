import { useState, useEffect } from 'react';
import { Users, CreditCard, BookOpen, Video, BarChart3, Trash2, RefreshCw, CheckCircle, AlertCircle, Clock, Search, Filter, Eye } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { supabase } from '../../lib/supabase';
import { Profile, Payment } from '../../types';
import Logo from '../../components/Logo';

interface AdminDashboardProps { onNavigate: (page: string) => void; }

export default function AdminDashboard({ onNavigate }: AdminDashboardProps) {
  const { profile } = useAuth();
  const [activeTab, setActiveTab] = useState<'overview' | 'users' | 'payments' | 'content' | 'analytics'>('overview');
  const [users, setUsers] = useState<Profile[]>([]);
  const [payments, setPayments] = useState<(Payment & { user_name?: string })[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchUser, setSearchUser] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');

  const loadUsers = async () => {
    setLoading(true);
    const { data } = await supabase.from('profiles').select('*').order('created_at', { ascending: false });
    if (data) setUsers(data as Profile[]);
    setLoading(false);
  };

  const loadPayments = async () => {
    setLoading(true);
    const { data } = await supabase.from('payments').select('*, profiles(full_name, email)').order('created_at', { ascending: false });
    if (data) {
      setPayments(data.map((p: Payment & { profiles?: { full_name: string; email: string } }) => ({
        ...p,
        user_name: p.profiles?.full_name || 'Unknown',
      })));
    }
    setLoading(false);
  };

  useEffect(() => {
    if (activeTab === 'users') loadUsers();
    if (activeTab === 'payments') loadPayments();
  }, [activeTab]);

  const deleteUser = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this user?')) return;
    await supabase.from('profiles').delete().eq('id', id);
    setUsers(prev => prev.filter(u => u.id !== id));
  };

  const updatePaymentStatus = async (id: string, status: string) => {
    await supabase.from('payments').update({ status }).eq('id', id);
    setPayments(prev => prev.map(p => p.id === id ? { ...p, status: status as Payment['status'] } : p));
  };

  const filteredUsers = users.filter(u => {
    const matchRole = roleFilter === 'all' || u.role === roleFilter;
    const matchSearch = !searchUser || u.full_name.toLowerCase().includes(searchUser.toLowerCase()) || u.email.toLowerCase().includes(searchUser.toLowerCase());
    return matchRole && matchSearch;
  });

  const statusBadge = (status: string) => {
    const map = {
      active: 'bg-green-100 text-green-700',
      pending: 'bg-yellow-100 text-yellow-700',
      expired: 'bg-red-100 text-red-700',
      failed: 'bg-gray-100 text-gray-600',
    };
    return map[status as keyof typeof map] || 'bg-gray-100 text-gray-600';
  };

  const roleBadge = (role: string) => {
    const map = { admin: 'bg-red-100 text-red-700', faculty: 'bg-blue-100 text-blue-700', student: 'bg-green-100 text-green-700' };
    return map[role as keyof typeof map] || 'bg-gray-100 text-gray-600';
  };

  const tabs = [
    { id: 'overview', label: 'Overview', icon: BarChart3 },
    { id: 'users', label: 'Users', icon: Users },
    { id: 'payments', label: 'Payments', icon: CreditCard },
    { id: 'content', label: 'Content', icon: Video },
    { id: 'analytics', label: 'Analytics', icon: BarChart3 },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="gradient-hero text-white py-8 px-4">
        <div className="max-w-7xl mx-auto">
          <Logo size="sm" />
          <h1 className="text-2xl font-bold mt-3">Admin Panel</h1>
          <p className="text-white/70 text-sm mt-1">Platform management — {profile?.full_name}</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="flex gap-2 overflow-x-auto pb-2 mb-6 scrollbar-thin">
          {tabs.map(({ id, label, icon: Icon }) => (
            <button key={id} onClick={() => setActiveTab(id as typeof activeTab)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium whitespace-nowrap transition-all flex-shrink-0 ${
                activeTab === id ? 'bg-primary-600 text-white shadow-md' : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
              }`}>
              <Icon size={15} /> {label}
            </button>
          ))}
        </div>

        {/* OVERVIEW */}
        {activeTab === 'overview' && (
          <div className="space-y-6 animate-fade-in">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { label: 'Total Users', value: '10,284', icon: Users, color: 'text-blue-500', bg: 'bg-blue-50', change: '+12%' },
                { label: 'Active Subscriptions', value: '3,847', icon: CheckCircle, color: 'text-green-500', bg: 'bg-green-50', change: '+8%' },
                { label: 'Monthly Revenue', value: '₹2,14,500', icon: CreditCard, color: 'text-amber-500', bg: 'bg-amber-50', change: '+15%' },
                { label: 'Courses', value: '48', icon: BookOpen, color: 'text-purple-500', bg: 'bg-purple-50', change: '+3' },
              ].map(({ label, value, icon: Icon, color, bg, change }) => (
                <div key={label} className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
                  <div className={`w-10 h-10 ${bg} rounded-xl flex items-center justify-center mb-3`}>
                    <Icon size={20} className={color} />
                  </div>
                  <div className="text-2xl font-bold text-gray-800">{value}</div>
                  <div className="flex items-center justify-between mt-0.5">
                    <span className="text-xs text-gray-500">{label}</span>
                    <span className="text-xs text-green-600 font-medium">{change}</span>
                  </div>
                </div>
              ))}
            </div>

            {/* Recent activity */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
                <h3 className="font-semibold text-gray-800 mb-4">Recent Registrations</h3>
                <div className="space-y-3">
                  {[
                    { name: 'Priya Sharma', role: 'student', time: '2 min ago' },
                    { name: 'Rajesh Kumar', role: 'student', time: '15 min ago' },
                    { name: 'Dr. Meena Iyer', role: 'faculty', time: '1 hr ago' },
                    { name: 'Arun Nair', role: 'student', time: '2 hr ago' },
                  ].map(({ name, role, time }) => (
                    <div key={name} className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-primary-100 flex items-center justify-center text-primary-700 text-xs font-bold">
                          {name.charAt(0)}
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-800">{name}</p>
                          <span className={`text-xs px-2 py-0.5 rounded-full ${roleBadge(role)}`}>{role}</span>
                        </div>
                      </div>
                      <span className="text-xs text-gray-400">{time}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
                <h3 className="font-semibold text-gray-800 mb-4">Recent Payments</h3>
                <div className="space-y-3">
                  {[
                    { name: 'Pooja Reddy', plan: 'Yearly Plan', amount: '₹1,999', status: 'active' },
                    { name: 'Suresh Babu', plan: 'Standard Plan', amount: '₹399', status: 'active' },
                    { name: 'Kavitha N', plan: 'Basic Plan', amount: '₹199', status: 'pending' },
                    { name: 'Mani Kumar', plan: 'Yearly Plan', amount: '₹1,999', status: 'active' },
                  ].map(({ name, plan, amount, status }) => (
                    <div key={name} className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-800">{name}</p>
                        <p className="text-xs text-gray-500">{plan}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-semibold text-gray-800">{amount}</p>
                        <span className={`text-xs px-2 py-0.5 rounded-full ${statusBadge(status)}`}>{status}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* USERS */}
        {activeTab === 'users' && (
          <div className="animate-fade-in">
            <div className="flex flex-col md:flex-row gap-4 mb-5">
              <div className="relative flex-1">
                <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input value={searchUser} onChange={e => setSearchUser(e.target.value)}
                  placeholder="Search by name or email..."
                  className="w-full pl-9 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:border-accent-400 transition-colors" />
              </div>
              <div className="flex items-center gap-2">
                <Filter size={15} className="text-gray-400" />
                {['all', 'student', 'faculty', 'admin'].map(r => (
                  <button key={r} onClick={() => setRoleFilter(r)}
                    className={`px-3 py-2 rounded-lg text-xs font-medium capitalize transition-all ${roleFilter === r ? 'bg-primary-500 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>
                    {r}
                  </button>
                ))}
                <button onClick={loadUsers} className="p-2 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors">
                  <RefreshCw size={15} className="text-gray-600" />
                </button>
              </div>
            </div>

            {loading ? (
              <div className="flex items-center justify-center py-20">
                <div className="w-8 h-8 border-3 border-primary-600/30 border-t-primary-600 rounded-full animate-spin" />
              </div>
            ) : (
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-gray-100 bg-gray-50 text-xs text-gray-500 uppercase tracking-wide">
                        <th className="p-4 text-left">Name</th>
                        <th className="p-4 text-left">Email</th>
                        <th className="p-4 text-left">Phone</th>
                        <th className="p-4 text-left">Role</th>
                        <th className="p-4 text-left">Joined</th>
                        <th className="p-4 text-left">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredUsers.length === 0 ? (
                        <tr><td colSpan={6} className="text-center py-12 text-gray-400">No users found</td></tr>
                      ) : filteredUsers.map(user => (
                        <tr key={user.id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                          <td className="p-4">
                            <div className="flex items-center gap-2">
                              <div className="w-7 h-7 rounded-full bg-primary-100 flex items-center justify-center text-primary-700 text-xs font-bold">
                                {user.full_name.charAt(0).toUpperCase()}
                              </div>
                              <span className="font-medium text-sm text-gray-800">{user.full_name}</span>
                            </div>
                          </td>
                          <td className="p-4 text-sm text-gray-600">{user.email}</td>
                          <td className="p-4 text-sm text-gray-600">{user.phone || '—'}</td>
                          <td className="p-4">
                            <span className={`text-xs px-2.5 py-1 rounded-full font-medium capitalize ${roleBadge(user.role)}`}>{user.role}</span>
                          </td>
                          <td className="p-4 text-sm text-gray-500">{new Date(user.created_at).toLocaleDateString()}</td>
                          <td className="p-4">
                            <div className="flex gap-2">
                              <button className="p-1.5 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors">
                                <Eye size={14} />
                              </button>
                              <button onClick={() => deleteUser(user.id)}
                                className="p-1.5 bg-red-50 text-red-500 rounded-lg hover:bg-red-100 transition-colors">
                                <Trash2 size={14} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <div className="px-4 py-3 border-t border-gray-100 text-xs text-gray-500">
                  {filteredUsers.length} user(s) shown
                </div>
              </div>
            )}
          </div>
        )}

        {/* PAYMENTS */}
        {activeTab === 'payments' && (
          <div className="animate-fade-in">
            <div className="flex justify-between items-center mb-5">
              <h2 className="font-bold text-gray-800 text-xl">Payment Management</h2>
              <button onClick={loadPayments} className="flex items-center gap-1.5 text-sm text-primary-600 hover:text-primary-700">
                <RefreshCw size={14} /> Refresh
              </button>
            </div>
            {/* Summary cards */}
            <div className="grid grid-cols-3 gap-4 mb-5">
              {[
                { label: 'Active', icon: CheckCircle, color: 'text-green-500', bg: 'bg-green-50' },
                { label: 'Pending', icon: Clock, color: 'text-yellow-500', bg: 'bg-yellow-50' },
                { label: 'Expired', icon: AlertCircle, color: 'text-red-500', bg: 'bg-red-50' },
              ].map(({ label, icon: Icon, color, bg }) => (
                <div key={label} className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm flex items-center gap-3">
                  <div className={`w-9 h-9 ${bg} rounded-xl flex items-center justify-center`}>
                    <Icon size={18} className={color} />
                  </div>
                  <div>
                    <p className="font-bold text-gray-800 text-xl">
                      {payments.filter(p => p.status === label.toLowerCase()).length}
                    </p>
                    <p className="text-xs text-gray-500">{label}</p>
                  </div>
                </div>
              ))}
            </div>
            {loading ? (
              <div className="flex items-center justify-center py-20">
                <div className="w-8 h-8 border-2 border-primary-600/30 border-t-primary-600 rounded-full animate-spin" />
              </div>
            ) : (
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-gray-100 bg-gray-50 text-xs text-gray-500 uppercase tracking-wide">
                        <th className="p-4 text-left">User</th>
                        <th className="p-4 text-left">Plan</th>
                        <th className="p-4 text-left">Amount</th>
                        <th className="p-4 text-left">Status</th>
                        <th className="p-4 text-left">Expires</th>
                        <th className="p-4 text-left">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {payments.length === 0 ? (
                        <tr><td colSpan={6} className="text-center py-12 text-gray-400">No payments found</td></tr>
                      ) : payments.map(pay => (
                        <tr key={pay.id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                          <td className="p-4 text-sm font-medium text-gray-800">{pay.user_name}</td>
                          <td className="p-4 text-sm text-gray-600">{pay.plan_name}</td>
                          <td className="p-4 text-sm font-semibold text-gray-800">₹{pay.amount}</td>
                          <td className="p-4">
                            <span className={`text-xs px-2.5 py-1 rounded-full font-medium capitalize ${statusBadge(pay.status)}`}>{pay.status}</span>
                          </td>
                          <td className="p-4 text-sm text-gray-500">
                            {pay.expires_at ? new Date(pay.expires_at).toLocaleDateString() : '—'}
                          </td>
                          <td className="p-4">
                            <div className="flex gap-1">
                              {pay.status !== 'active' && (
                                <button onClick={() => updatePaymentStatus(pay.id, 'active')}
                                  className="p-1.5 bg-green-50 text-green-600 rounded-lg hover:bg-green-100 text-xs transition-colors">
                                  <CheckCircle size={14} />
                                </button>
                              )}
                              {pay.status === 'active' && (
                                <button onClick={() => updatePaymentStatus(pay.id, 'expired')}
                                  className="p-1.5 bg-red-50 text-red-500 rounded-lg hover:bg-red-100 transition-colors">
                                  <AlertCircle size={14} />
                                </button>
                              )}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <div className="px-4 py-3 border-t border-gray-100 text-xs text-gray-500">
                  {payments.length} payment record(s)
                </div>
              </div>
            )}
          </div>
        )}

        {/* CONTENT */}
        {activeTab === 'content' && (
          <div className="animate-fade-in">
            <h2 className="font-bold text-gray-800 text-xl mb-5">Content Management</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              {[
                { label: 'Total Videos', value: '284', icon: Video, color: 'text-blue-500', bg: 'bg-blue-50' },
                { label: 'Notes/PDFs', value: '156', icon: BookOpen, color: 'text-green-500', bg: 'bg-green-50' },
                { label: 'Books', value: '42', icon: BookOpen, color: 'text-purple-500', bg: 'bg-purple-50' },
                { label: 'Live Classes', value: '18', icon: Users, color: 'text-orange-500', bg: 'bg-orange-50' },
              ].map(({ label, value, icon: Icon, color, bg }) => (
                <div key={label} className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
                  <div className={`w-10 h-10 ${bg} rounded-xl flex items-center justify-center mb-3`}>
                    <Icon size={20} className={color} />
                  </div>
                  <div className="text-2xl font-bold text-gray-800">{value}</div>
                  <div className="text-xs text-gray-500">{label}</div>
                </div>
              ))}
            </div>
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 text-center text-gray-400">
              <Video size={32} className="mx-auto mb-2 text-gray-300" />
              <p>Content items will appear here as faculty uploads materials</p>
            </div>
          </div>
        )}

        {/* ANALYTICS */}
        {activeTab === 'analytics' && (
          <div className="animate-fade-in">
            <h2 className="font-bold text-gray-800 text-xl mb-5">Analytics</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Enrollment by grade */}
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
                <h3 className="font-semibold text-gray-800 mb-4">Enrollment by Grade</h3>
                <div className="space-y-3">
                  {[
                    { grade: 'Nursery', count: 1240, total: 2000 },
                    { grade: 'Jr KG', count: 980, total: 2000 },
                    { grade: 'Sr KG', count: 1120, total: 2000 },
                    { grade: 'Grade 1', count: 1850, total: 2000 },
                    { grade: 'Grade 2', count: 1640, total: 2000 },
                    { grade: 'Grade 3', count: 1200, total: 2000 },
                    { grade: 'Grade 4', count: 980, total: 2000 },
                    { grade: 'Grade 5', count: 830, total: 2000 },
                  ].map(({ grade, count, total }) => (
                    <div key={grade} className="flex items-center gap-3">
                      <span className="text-sm text-gray-600 w-16 flex-shrink-0">{grade}</span>
                      <div className="flex-1 bg-gray-100 rounded-full h-2">
                        <div className="h-2 rounded-full transition-all" style={{ width: `${(count / total) * 100}%`, backgroundColor: '#1a3d2e' }} />
                      </div>
                      <span className="text-sm font-medium text-gray-800 w-12 text-right">{count.toLocaleString()}</span>
                    </div>
                  ))}
                </div>
              </div>
              {/* Revenue by plan */}
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
                <h3 className="font-semibold text-gray-800 mb-4">Revenue by Plan</h3>
                <div className="space-y-4">
                  {[
                    { plan: 'Yearly Plan (₹1999)', percent: 65, revenue: '₹1,85,000', color: '#1a3d2e' },
                    { plan: 'Standard Plan (₹399)', percent: 20, revenue: '₹42,000', color: '#2a5c45' },
                    { plan: 'Basic Plan (₹199)', percent: 15, revenue: '₹18,500', color: '#f59e0b' },
                  ].map(({ plan, percent, revenue, color }) => (
                    <div key={plan}>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-gray-600">{plan}</span>
                        <span className="font-semibold text-gray-800">{revenue}</span>
                      </div>
                      <div className="w-full bg-gray-100 rounded-full h-2.5">
                        <div className="h-2.5 rounded-full" style={{ width: `${percent}%`, backgroundColor: color }} />
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-4 pt-4 border-t border-gray-100">
                  <div className="flex justify-between">
                    <span className="font-semibold text-gray-800">Total Revenue</span>
                    <span className="font-bold text-xl text-primary-700">₹2,45,500</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
