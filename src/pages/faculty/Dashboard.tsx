import { useState } from 'react';
import { BookOpen, Upload, Video, FileText, Link2, Users, Brain, Calendar, Plus, ExternalLink, Clock, Trash2, Check, AlertCircle } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { supabase } from '../../lib/supabase';
import { GRADE_LEVELS, LivePlatform } from '../../types';
import Logo from '../../components/Logo';

interface FacultyDashboardProps { onNavigate: (page: string) => void; }

const PLATFORM_ICONS: Record<LivePlatform, string> = {
  zoom: '🎥',
  google_meet: '📹',
  skype: '💬',
  other: '🔗',
};

const PLATFORM_LABELS: Record<LivePlatform, string> = {
  zoom: 'Zoom',
  google_meet: 'Google Meet',
  skype: 'Skype',
  other: 'Other',
};

export default function FacultyDashboard({ onNavigate }: FacultyDashboardProps) {
  const { profile } = useAuth();
  const [activeTab, setActiveTab] = useState<'overview' | 'courses' | 'content' | 'live' | 'quiz'>('overview');

  // Content Upload form
  const [contentForm, setContentForm] = useState({
    title: '',
    description: '',
    content_type: 'video' as 'video' | 'note' | 'book' | 'link',
    embed_url: '',
    grade_level: 'grade_1',
    subject: '',
    is_free: false,
    price: '0',
  });
  const [contentLoading, setContentLoading] = useState(false);
  const [contentSuccess, setContentSuccess] = useState('');

  // Live Class form
  const [liveForm, setLiveForm] = useState({
    title: '',
    description: '',
    platform: 'zoom' as LivePlatform,
    meeting_url: '',
    meeting_id: '',
    passcode: '',
    scheduled_at: '',
    duration_minutes: '60',
  });
  const [liveLoading, setLiveLoading] = useState(false);
  const [liveSuccess, setLiveSuccess] = useState('');
  const [liveClasses, setLiveClasses] = useState<{ id: string; title: string; platform: LivePlatform; meeting_url: string; scheduled_at: string; meeting_id: string; passcode: string }[]>([]);
  const [liveLoaded, setLiveLoaded] = useState(false);

  // AI Question Generator
  const [qTopic, setQTopic] = useState('');
  const [qGrade, setQGrade] = useState('grade_1');
  const [qCount, setQCount] = useState('5');
  const [genLoading, setGenLoading] = useState(false);
  const [genQuestions, setGenQuestions] = useState<{ question: string; options: string[]; answer: number }[]>([]);

  const loadLiveClasses = async () => {
    if (!profile) return;
    const { data } = await supabase.from('live_classes').select('*').eq('host_id', profile.id).order('scheduled_at', { ascending: true });
    if (data) setLiveClasses(data as typeof liveClasses);
    setLiveLoaded(true);
  };

  const handleTabChange = (tab: typeof activeTab) => {
    setActiveTab(tab);
    if (tab === 'live' && !liveLoaded) loadLiveClasses();
  };

  const submitContent = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!profile) return;
    setContentLoading(true);
    setContentSuccess('');
    const { error } = await supabase.from('content_items').insert({
      title: contentForm.title,
      description: contentForm.description,
      content_type: contentForm.content_type,
      embed_url: contentForm.embed_url,
      is_free: contentForm.is_free,
      price: parseFloat(contentForm.price) || 0,
      uploaded_by: profile.id,
    });
    setContentLoading(false);
    if (!error) {
      setContentSuccess('Content uploaded successfully!');
      setContentForm({ title: '', description: '', content_type: 'video', embed_url: '', grade_level: 'grade_1', subject: '', is_free: false, price: '0' });
    }
  };

  const submitLiveClass = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!profile) return;
    setLiveLoading(true);
    setLiveSuccess('');
    const { error } = await supabase.from('live_classes').insert({
      title: liveForm.title,
      description: liveForm.description,
      platform: liveForm.platform,
      meeting_url: liveForm.meeting_url,
      meeting_id: liveForm.meeting_id,
      passcode: liveForm.passcode,
      scheduled_at: liveForm.scheduled_at,
      duration_minutes: parseInt(liveForm.duration_minutes),
      host_id: profile.id,
      is_active: true,
    });
    setLiveLoading(false);
    if (!error) {
      setLiveSuccess('Live class scheduled!');
      setLiveForm({ title: '', description: '', platform: 'zoom', meeting_url: '', meeting_id: '', passcode: '', scheduled_at: '', duration_minutes: '60' });
      loadLiveClasses();
    }
  };

  const deleteLiveClass = async (id: string) => {
    await supabase.from('live_classes').delete().eq('id', id);
    setLiveClasses(prev => prev.filter(c => c.id !== id));
  };

  const generateQuestions = async () => {
    setGenLoading(true);
    setGenQuestions([]);
    try {
      const res = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/ai-tools`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}` },
        body: JSON.stringify({ tool: 'questions', topic: qTopic, grade: qGrade, count: parseInt(qCount) }),
      });
      const data = await res.json();
      setGenQuestions(data.questions || getSampleQuestions());
    } catch {
      setGenQuestions(getSampleQuestions());
    }
    setGenLoading(false);
  };

  const getSampleQuestions = () => [
    { question: `What is the main idea of ${qTopic || 'this topic'}?`, options: ['Option A', 'Option B', 'Option C', 'Option D'], answer: 0 },
    { question: `Which of the following best describes ${qTopic || 'this concept'}?`, options: ['Description 1', 'Description 2', 'Description 3', 'Description 4'], answer: 1 },
    { question: `How many key points does ${qTopic || 'this subject'} have?`, options: ['2', '3', '4', '5'], answer: 2 },
  ];

  const tabs = [
    { id: 'overview', label: 'Overview', icon: BookOpen },
    { id: 'courses', label: 'My Courses', icon: BookOpen },
    { id: 'content', label: 'Upload Content', icon: Upload },
    { id: 'live', label: 'Live Classes', icon: Video },
    { id: 'quiz', label: 'AI Questions', icon: Brain },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="gradient-hero text-white py-8 px-4">
        <div className="max-w-7xl mx-auto">
          <Logo size="sm" />
          <h1 className="text-2xl font-bold mt-3">Faculty Dashboard</h1>
          <p className="text-white/70 text-sm mt-1">Welcome, {profile?.full_name}! Manage your courses and students.</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="flex gap-2 overflow-x-auto pb-2 mb-6 scrollbar-thin">
          {tabs.map(({ id, label, icon: Icon }) => (
            <button key={id} onClick={() => handleTabChange(id as typeof activeTab)}
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
                { label: 'My Courses', value: '5', icon: BookOpen, color: 'text-blue-500', bg: 'bg-blue-50' },
                { label: 'Total Videos', value: '24', icon: Video, color: 'text-green-500', bg: 'bg-green-50' },
                { label: 'Live Classes', value: '3', icon: Calendar, color: 'text-orange-500', bg: 'bg-orange-50' },
                { label: 'Students', value: '142', icon: Users, color: 'text-purple-500', bg: 'bg-purple-50' },
              ].map(({ label, value, icon: Icon, color, bg }) => (
                <div key={label} className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
                  <div className={`w-10 h-10 ${bg} rounded-xl flex items-center justify-center mb-3`}>
                    <Icon size={20} className={color} />
                  </div>
                  <div className="text-2xl font-bold text-gray-800">{value}</div>
                  <div className="text-xs text-gray-500 mt-0.5">{label}</div>
                </div>
              ))}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[
                { id: 'content', label: 'Upload Video/Notes/Books', icon: Upload, desc: 'Add new learning content', color: 'text-blue-500', bg: 'bg-blue-50' },
                { id: 'live', label: 'Schedule Live Class', icon: Calendar, desc: 'Zoom, Meet, or Skype', color: 'text-orange-500', bg: 'bg-orange-50' },
                { id: 'quiz', label: 'Generate AI Questions', icon: Brain, desc: 'Auto-create MCQ assessments', color: 'text-purple-500', bg: 'bg-purple-50' },
              ].map(({ id, label, icon: Icon, desc, color, bg }) => (
                <button key={id} onClick={() => handleTabChange(id as typeof activeTab)}
                  className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm hover:shadow-md transition-all text-left card-hover">
                  <div className={`w-12 h-12 ${bg} rounded-xl flex items-center justify-center mb-3`}>
                    <Icon size={22} className={color} />
                  </div>
                  <p className="font-semibold text-gray-800">{label}</p>
                  <p className="text-sm text-gray-500 mt-1">{desc}</p>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* COURSES */}
        {activeTab === 'courses' && (
          <div className="animate-fade-in">
            <div className="flex justify-between items-center mb-5">
              <h2 className="font-bold text-gray-800 text-xl">My Courses</h2>
              <button className="btn-green text-sm py-2 px-4 flex items-center gap-1.5">
                <Plus size={15} /> New Course
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {[
                { title: 'English Grade 1', grade: 'Grade 1', subject: 'English', students: 45, thumbnail: 'https://images.pexels.com/photos/256417/pexels-photo-256417.jpeg?auto=compress&cs=tinysrgb&w=400' },
                { title: 'Maths Grade 2', grade: 'Grade 2', subject: 'Arithmetic', students: 38, thumbnail: 'https://images.pexels.com/photos/1148998/pexels-photo-1148998.jpeg?auto=compress&cs=tinysrgb&w=400' },
                { title: 'Science Grade 3', grade: 'Grade 3', subject: 'Biology', students: 52, thumbnail: 'https://images.pexels.com/photos/5905709/pexels-photo-5905709.jpeg?auto=compress&cs=tinysrgb&w=400' },
              ].map(course => (
                <div key={course.title} className="bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm card-hover">
                  <img src={course.thumbnail} alt={course.title} className="w-full h-36 object-cover" />
                  <div className="p-4">
                    <h3 className="font-semibold text-gray-800 mb-1">{course.title}</h3>
                    <p className="text-sm text-gray-500 mb-3">{course.subject} · {course.grade}</p>
                    <div className="flex items-center justify-between">
                      <span className="flex items-center gap-1 text-sm text-gray-600"><Users size={13} /> {course.students} students</span>
                      <button className="text-sm text-primary-600 font-medium hover:underline">Manage →</button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* UPLOAD CONTENT */}
        {activeTab === 'content' && (
          <div className="animate-fade-in max-w-2xl mx-auto">
            <h2 className="font-bold text-gray-800 text-xl mb-6 flex items-center gap-2">
              <Upload size={22} className="text-blue-500" /> Upload Content
            </h2>
            {contentSuccess && (
              <div className="flex items-center gap-2 bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-xl mb-5 text-sm">
                <Check size={16} /> {contentSuccess}
              </div>
            )}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
              <form onSubmit={submitContent} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Content Type</label>
                  <div className="grid grid-cols-4 gap-2">
                    {(['video', 'note', 'book', 'link'] as const).map(type => (
                      <button type="button" key={type}
                        onClick={() => setContentForm({ ...contentForm, content_type: type })}
                        className={`py-2 rounded-lg border text-xs font-semibold uppercase transition-all ${contentForm.content_type === type ? 'border-primary-500 bg-primary-50 text-primary-700' : 'border-gray-200 text-gray-600 hover:border-gray-300'}`}>
                        {type === 'video' ? <><Video size={14} className="inline mr-1" />Video</> :
                         type === 'note' ? <><FileText size={14} className="inline mr-1" />Note</> :
                         type === 'book' ? <><BookOpen size={14} className="inline mr-1" />Book</> :
                         <><Link2 size={14} className="inline mr-1" />Link</>}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Title *</label>
                  <input required value={contentForm.title} onChange={e => setContentForm({ ...contentForm, title: e.target.value })}
                    placeholder="Content title" className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:border-accent-400 transition-colors" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Description</label>
                  <textarea value={contentForm.description} onChange={e => setContentForm({ ...contentForm, description: e.target.value })}
                    rows={3} placeholder="What will students learn?"
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:border-accent-400 transition-colors resize-none" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Grade Level</label>
                    <select value={contentForm.grade_level} onChange={e => setContentForm({ ...contentForm, grade_level: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:border-accent-400 transition-colors bg-white">
                      {GRADE_LEVELS.map(g => <option key={g.value} value={g.value}>{g.label}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Subject</label>
                    <input value={contentForm.subject} onChange={e => setContentForm({ ...contentForm, subject: e.target.value })}
                      placeholder="e.g., English, Maths"
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:border-accent-400 transition-colors" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    {contentForm.content_type === 'video' ? 'YouTube/Vimeo Embed URL' :
                     contentForm.content_type === 'link' ? 'External Link URL' : 'File URL or Embed Link'}
                  </label>
                  <input value={contentForm.embed_url} onChange={e => setContentForm({ ...contentForm, embed_url: e.target.value })}
                    placeholder={contentForm.content_type === 'video' ? 'https://youtube.com/embed/...' : 'https://...'}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:border-accent-400 transition-colors" />
                </div>
                <div className="flex items-center gap-4">
                  <label className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer">
                    <input type="checkbox" checked={contentForm.is_free} onChange={e => setContentForm({ ...contentForm, is_free: e.target.checked })}
                      className="w-4 h-4 accent-primary-600" />
                    Free Access
                  </label>
                  {!contentForm.is_free && (
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-gray-600">Price (₹)</span>
                      <input type="number" value={contentForm.price} onChange={e => setContentForm({ ...contentForm, price: e.target.value })}
                        min="0" className="w-20 px-3 py-2 border border-gray-200 rounded-lg text-sm" />
                    </div>
                  )}
                </div>
                <button type="submit" disabled={contentLoading} className="w-full btn-green py-3 flex items-center justify-center gap-2">
                  {contentLoading ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <><Upload size={18} /> Upload Content</>}
                </button>
              </form>
            </div>
          </div>
        )}

        {/* LIVE CLASSES */}
        {activeTab === 'live' && (
          <div className="animate-fade-in max-w-3xl mx-auto">
            <h2 className="font-bold text-gray-800 text-xl mb-6 flex items-center gap-2">
              <Video size={22} className="text-orange-500" /> Live Classes
            </h2>
            {liveSuccess && (
              <div className="flex items-center gap-2 bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-xl mb-5 text-sm">
                <Check size={16} /> {liveSuccess}
              </div>
            )}
            {/* Schedule form */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 mb-6">
              <h3 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
                <Plus size={18} /> Schedule a Live Class
              </h3>
              <form onSubmit={submitLiveClass} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Platform</label>
                  <div className="grid grid-cols-4 gap-2">
                    {(['zoom', 'google_meet', 'skype', 'other'] as LivePlatform[]).map(p => (
                      <button type="button" key={p}
                        onClick={() => setLiveForm({ ...liveForm, platform: p })}
                        className={`py-2.5 rounded-xl border text-xs font-medium transition-all flex flex-col items-center gap-1 ${liveForm.platform === p ? 'border-primary-500 bg-primary-50 text-primary-700' : 'border-gray-200 text-gray-600 hover:border-gray-300'}`}>
                        <span className="text-lg">{PLATFORM_ICONS[p]}</span>
                        {PLATFORM_LABELS[p]}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Class Title *</label>
                  <input required value={liveForm.title} onChange={e => setLiveForm({ ...liveForm, title: e.target.value })}
                    placeholder="e.g., Grade 2 Maths Live Session"
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:border-accent-400 transition-colors" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Meeting URL *</label>
                  <input required type="url" value={liveForm.meeting_url} onChange={e => setLiveForm({ ...liveForm, meeting_url: e.target.value })}
                    placeholder={liveForm.platform === 'zoom' ? 'https://zoom.us/j/...' : liveForm.platform === 'google_meet' ? 'https://meet.google.com/...' : 'https://...'}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:border-accent-400 transition-colors" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Meeting ID</label>
                    <input value={liveForm.meeting_id} onChange={e => setLiveForm({ ...liveForm, meeting_id: e.target.value })}
                      placeholder="123 456 7890"
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:border-accent-400 transition-colors" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Passcode</label>
                    <input value={liveForm.passcode} onChange={e => setLiveForm({ ...liveForm, passcode: e.target.value })}
                      placeholder="Optional"
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:border-accent-400 transition-colors" />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Scheduled Date & Time *</label>
                    <input required type="datetime-local" value={liveForm.scheduled_at} onChange={e => setLiveForm({ ...liveForm, scheduled_at: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:border-accent-400 transition-colors" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Duration (minutes)</label>
                    <input type="number" value={liveForm.duration_minutes} onChange={e => setLiveForm({ ...liveForm, duration_minutes: e.target.value })}
                      min="15" max="180"
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:border-accent-400 transition-colors" />
                  </div>
                </div>
                <button type="submit" disabled={liveLoading} className="w-full btn-green py-3 flex items-center justify-center gap-2">
                  {liveLoading ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <><Calendar size={18} /> Schedule Live Class</>}
                </button>
              </form>
            </div>

            {/* Upcoming live classes */}
            <div>
              <h3 className="font-semibold text-gray-800 mb-3">Scheduled Classes</h3>
              {liveClasses.length === 0 ? (
                <div className="bg-white rounded-2xl border border-gray-100 p-8 text-center text-gray-400">
                  <Calendar size={32} className="mx-auto mb-2 text-gray-300" />
                  <p>No live classes scheduled yet</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {liveClasses.map(cls => (
                    <div key={cls.id} className="bg-white rounded-2xl border border-gray-100 p-4 flex items-center gap-4">
                      <div className="text-2xl">{PLATFORM_ICONS[cls.platform]}</div>
                      <div className="flex-1">
                        <p className="font-semibold text-gray-800">{cls.title}</p>
                        <p className="text-sm text-gray-500 flex items-center gap-1 mt-0.5">
                          <Clock size={12} /> {new Date(cls.scheduled_at).toLocaleString()}
                        </p>
                        {cls.meeting_id && <p className="text-xs text-gray-400 mt-0.5">ID: {cls.meeting_id} {cls.passcode && `· Pass: ${cls.passcode}`}</p>}
                      </div>
                      <div className="flex gap-2">
                        <a href={cls.meeting_url} target="_blank" rel="noreferrer"
                          className="p-2 bg-green-50 text-green-600 rounded-lg hover:bg-green-100 transition-colors">
                          <ExternalLink size={16} />
                        </a>
                        <button onClick={() => deleteLiveClass(cls.id)}
                          className="p-2 bg-red-50 text-red-500 rounded-lg hover:bg-red-100 transition-colors">
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* AI QUESTION GENERATOR */}
        {activeTab === 'quiz' && (
          <div className="animate-fade-in max-w-2xl mx-auto">
            <h2 className="font-bold text-gray-800 text-xl mb-6 flex items-center gap-2">
              <Brain size={22} className="text-purple-500" /> AI Question Generator
            </h2>
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 mb-5">
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Topic / Subject</label>
                    <input value={qTopic} onChange={e => setQTopic(e.target.value)}
                      placeholder="e.g., Photosynthesis, Fractions..."
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:border-accent-400 transition-colors" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Grade Level</label>
                    <select value={qGrade} onChange={e => setQGrade(e.target.value)}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm bg-white focus:border-accent-400 transition-colors">
                      {GRADE_LEVELS.map(g => <option key={g.value} value={g.value}>{g.label}</option>)}
                    </select>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Number of Questions</label>
                  <div className="flex gap-2">
                    {['3', '5', '10', '15'].map(n => (
                      <button key={n} type="button" onClick={() => setQCount(n)}
                        className={`px-4 py-2 rounded-lg border text-sm font-medium transition-all ${qCount === n ? 'border-primary-500 bg-primary-50 text-primary-700' : 'border-gray-200 text-gray-600 hover:border-gray-300'}`}>
                        {n}
                      </button>
                    ))}
                  </div>
                </div>
                <button onClick={generateQuestions} disabled={genLoading} className="w-full btn-green py-3 flex items-center justify-center gap-2">
                  {genLoading ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <><Brain size={18} /> Generate Questions</>}
                </button>
              </div>
            </div>
            {genQuestions.length > 0 && (
              <div className="space-y-4 animate-slide-up">
                <div className="flex justify-between items-center">
                  <h3 className="font-semibold text-gray-800">{genQuestions.length} Questions Generated</h3>
                  <button onClick={() => alert('Questions saved to course library!')} className="btn-green text-sm py-2 px-4 flex items-center gap-1">
                    <Check size={14} /> Save to Library
                  </button>
                </div>
                {genQuestions.map((q, i) => (
                  <div key={i} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
                    <p className="font-medium text-gray-800 mb-3">Q{i + 1}. {q.question}</p>
                    <div className="grid grid-cols-2 gap-2">
                      {q.options.map((opt, j) => (
                        <div key={j} className={`px-3 py-2 rounded-lg text-sm ${j === q.answer ? 'bg-green-50 border border-green-300 text-green-700 font-medium' : 'bg-gray-50 border border-gray-200 text-gray-600'}`}>
                          <span className="font-bold mr-2">{String.fromCharCode(65 + j)}.</span>{opt}
                          {j === q.answer && <span className="ml-2 text-xs text-green-600 font-bold">(Answer)</span>}
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
