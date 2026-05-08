import { useState, useRef, useEffect } from 'react';
import { BookOpen, Brain, Mic, MessageSquare, Clock, Award, Play, ChevronRight, Send, RefreshCw, Volume2, CheckCircle, AlertCircle, CreditCard, Calendar } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { supabase } from '../../lib/supabase';
import { GRADE_LEVELS, PAYMENT_PLANS } from '../../types';
import Logo from '../../components/Logo';

interface StudentDashboardProps { onNavigate: (page: string) => void; }

const SAMPLE_QUIZZES: Record<string, { question: string; options: string[]; answer: number }[]> = {
  default: [
    { question: 'What is 5 + 3?', options: ['6', '7', '8', '9'], answer: 2 },
    { question: 'Which planet is closest to the Sun?', options: ['Earth', 'Venus', 'Mercury', 'Mars'], answer: 2 },
    { question: 'What is the capital of India?', options: ['Mumbai', 'New Delhi', 'Kolkata', 'Chennai'], answer: 1 },
    { question: 'How many days are in a week?', options: ['5', '6', '7', '8'], answer: 2 },
    { question: 'What comes after the letter "D" in the alphabet?', options: ['B', 'C', 'E', 'F'], answer: 2 },
  ],
};

const SAMPLE_STORIES = {
  'The Helpful Robot': `Once upon a time, in a small village, there lived a curious robot named Bolt. Bolt was built to help children learn. Every morning, he would visit the village school and help students with their lessons.\n\nOne day, a little girl named Priya was struggling with her maths homework. She couldn't understand fractions at all. Bolt sat beside her and explained, "Think of a pizza! If you cut it into 4 equal pieces and eat one, you have eaten one-fourth of the pizza!"\n\nPriya's eyes lit up. "Oh! That makes so much sense!" she exclaimed. From that day on, she loved fractions.\n\nBolt smiled and said, "Learning becomes easy when we connect it to things we love." And Priya never forgot that lesson.`,
  'The Magic Pencil': `Maya found a golden pencil on her way to school one morning. When she drew a butterfly, it fluttered right off the page! She drew a flower and it bloomed with the most beautiful colors.\n\nMaya used the magic pencil to draw books, and they appeared filled with wonderful stories. She drew a school with a big library, and suddenly her whole village had a place to learn.\n\nBut the magic was not in the pencil. The pencil showed Maya what her imagination could do. "Your mind is the real magic," whispered the pencil. Maya smiled and began drawing her future — bright, colorful, and full of knowledge.`,
};

const VOICE_CHARACTERS = [
  { id: 'shinchan', name: 'Shin Chan', emoji: '🎭', style: 'fun and playful' },
  { id: 'doraemon', name: 'Doraemon', emoji: '🤖', style: 'wise and encouraging' },
];

const VOICE_LESSONS = [
  { id: '1', title: 'Spoken English: Greetings', level: 'Beginner', duration: '5 min' },
  { id: '2', title: 'Pronouncing Vowels Correctly', level: 'Beginner', duration: '8 min' },
  { id: '3', title: 'Describing Your Day', level: 'Intermediate', duration: '10 min' },
  { id: '4', title: 'Storytelling in English', level: 'Advanced', duration: '15 min' },
];

export default function StudentDashboard({ onNavigate }: StudentDashboardProps) {
  const { profile } = useAuth();
  const [activeTab, setActiveTab] = useState<'overview' | 'courses' | 'quiz' | 'story' | 'chat' | 'voice' | 'payment'>('overview');

  // Payment
  const [payment, setPayment] = useState<{ plan_name: string; status: string; expires_at: string | null } | null>(null);

  // Quiz state
  const [quizTopic, setQuizTopic] = useState('');
  const [quizGrade, setQuizGrade] = useState('grade_1');
  const [quizStarted, setQuizStarted] = useState(false);
  const [quizQuestions, setQuizQuestions] = useState(SAMPLE_QUIZZES.default);
  const [currentQ, setCurrentQ] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [quizScore, setQuizScore] = useState(0);
  const [quizDone, setQuizDone] = useState(false);
  const [answered, setAnswered] = useState(false);

  // Story state
  const [storyTopic, setStoryTopic] = useState('');
  const [storyGrade, setStoryGrade] = useState('grade_2');
  const [generatedStory, setGeneratedStory] = useState('');
  const [storyLoading, setStoryLoading] = useState(false);

  // Chat state
  const [messages, setMessages] = useState<{ role: 'user' | 'ai'; text: string }[]>([
    { role: 'ai', text: 'Hi! I am your Dream Learn AI Tutor. Ask me any question about your studies!' },
  ]);
  const [chatInput, setChatInput] = useState('');
  const [chatLoading, setChatLoading] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  // Voice state
  const [selectedCharacter, setSelectedCharacter] = useState('shinchan');
  const [selectedLesson, setSelectedLesson] = useState('');
  const [voicePlaying, setVoicePlaying] = useState(false);

  useEffect(() => {
    if (profile) {
      supabase.from('payments').select('*').eq('user_id', profile.id).eq('status', 'active').maybeSingle()
        .then(({ data }) => setPayment(data));
    }
  }, [profile]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const generateQuiz = async () => {
    setQuizStarted(true);
    setCurrentQ(0);
    setQuizScore(0);
    setQuizDone(false);
    setSelected(null);
    setAnswered(false);

    // Call AI edge function
    try {
      const res = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/ai-tools`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}` },
        body: JSON.stringify({ tool: 'quiz', topic: quizTopic || 'General Knowledge', grade: quizGrade }),
      });
      const data = await res.json();
      if (data.questions) setQuizQuestions(data.questions);
    } catch {
      setQuizQuestions(SAMPLE_QUIZZES.default);
    }
  };

  const handleAnswer = (idx: number) => {
    if (answered) return;
    setSelected(idx);
    setAnswered(true);
    if (idx === quizQuestions[currentQ].answer) setQuizScore(s => s + 1);
  };

  const nextQuestion = () => {
    if (currentQ + 1 >= quizQuestions.length) {
      setQuizDone(true);
    } else {
      setCurrentQ(q => q + 1);
      setSelected(null);
      setAnswered(false);
    }
  };

  const generateStory = async () => {
    setStoryLoading(true);
    try {
      const res = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/ai-tools`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}` },
        body: JSON.stringify({ tool: 'story', topic: storyTopic || 'A magical adventure', grade: storyGrade }),
      });
      const data = await res.json();
      setGeneratedStory(data.story || Object.values(SAMPLE_STORIES)[0]);
    } catch {
      setGeneratedStory(Object.values(SAMPLE_STORIES)[Math.floor(Math.random() * 2)]);
    }
    setStoryLoading(false);
  };

  const sendChat = async () => {
    if (!chatInput.trim()) return;
    const userMsg = chatInput.trim();
    setChatInput('');
    setMessages(m => [...m, { role: 'user', text: userMsg }]);
    setChatLoading(true);
    try {
      const res = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/ai-tools`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}` },
        body: JSON.stringify({ tool: 'chat', message: userMsg, grade: 'grade_3' }),
      });
      const data = await res.json();
      setMessages(m => [...m, { role: 'ai', text: data.reply || 'Great question! Let me explain that for you...' }]);
    } catch {
      setMessages(m => [...m, { role: 'ai', text: "That's a great question! Keep exploring and learning. Ask me another question!" }]);
    }
    setChatLoading(false);
  };

  const getDaysRemaining = () => {
    if (!payment?.expires_at) return null;
    const diff = new Date(payment.expires_at).getTime() - Date.now();
    return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)));
  };

  const tabs = [
    { id: 'overview', label: 'Overview', icon: BookOpen },
    { id: 'courses', label: 'My Courses', icon: Play },
    { id: 'quiz', label: 'AI Quiz', icon: Brain },
    { id: 'story', label: 'AI Story', icon: BookOpen },
    { id: 'chat', label: 'AI Chat', icon: MessageSquare },
    { id: 'voice', label: 'AI Voice', icon: Mic },
    { id: 'payment', label: 'Payment', icon: CreditCard },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Dashboard Header */}
      <div className="gradient-hero text-white py-8 px-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div>
            <Logo size="sm" />
            <h1 className="text-2xl font-bold mt-3">Welcome back, {profile?.full_name?.split(' ')[0] || 'Student'}!</h1>
            <p className="text-white/70 text-sm mt-1">Keep learning, keep growing!</p>
          </div>
          <div className="hidden md:flex items-center gap-3">
            {payment ? (
              <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl px-4 py-3 text-sm">
                <div className="flex items-center gap-2 text-accent-300 font-semibold">
                  <CheckCircle size={14} /> {payment.plan_name}
                </div>
                <div className="text-white/70 text-xs mt-0.5">{getDaysRemaining()} days remaining</div>
              </div>
            ) : (
              <button onClick={() => setActiveTab('payment')}
                className="btn-primary text-sm px-5 py-2.5">
                Upgrade Plan
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Tab Nav */}
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

        {/* OVERVIEW TAB */}
        {activeTab === 'overview' && (
          <div className="space-y-6 animate-fade-in">
            {/* Quick stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { label: 'Enrolled Courses', value: '3', icon: BookOpen, color: 'text-blue-500', bg: 'bg-blue-50' },
                { label: 'Lessons Done', value: '12', icon: CheckCircle, color: 'text-green-500', bg: 'bg-green-50' },
                { label: 'Quiz Score', value: '85%', icon: Brain, color: 'text-purple-500', bg: 'bg-purple-50' },
                { label: 'Certificates', value: '1', icon: Award, color: 'text-amber-500', bg: 'bg-amber-50' },
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

            {/* AI tools grid */}
            <div>
              <h2 className="font-bold text-gray-800 mb-4">AI Learning Tools</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                  { id: 'quiz', label: 'AI Quiz Generator', icon: Brain, desc: 'Test your knowledge', color: 'text-blue-500', bg: 'bg-blue-50' },
                  { id: 'story', label: 'AI Story Generator', icon: BookOpen, desc: 'Read fun stories', color: 'text-emerald-500', bg: 'bg-emerald-50' },
                  { id: 'chat', label: 'AI Chatbot Tutor', icon: MessageSquare, desc: 'Ask any question', color: 'text-violet-500', bg: 'bg-violet-50' },
                  { id: 'voice', label: 'AI Voice Instructor', icon: Mic, desc: 'Learn by listening', color: 'text-orange-500', bg: 'bg-orange-50' },
                ].map(({ id, label, icon: Icon, desc, color, bg }) => (
                  <button key={id} onClick={() => setActiveTab(id as typeof activeTab)}
                    className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm hover:shadow-md hover:border-primary-200 transition-all text-left card-hover">
                    <div className={`w-12 h-12 ${bg} rounded-xl flex items-center justify-center mb-3`}>
                      <Icon size={24} className={color} />
                    </div>
                    <p className="font-semibold text-gray-800 text-sm">{label}</p>
                    <p className="text-xs text-gray-500 mt-1">{desc}</p>
                    <div className="mt-2 flex items-center text-primary-600 text-xs font-medium">
                      Open <ChevronRight size={12} className="ml-0.5" />
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Subscription status */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-bold text-gray-800">Subscription Status</h2>
                <button onClick={() => setActiveTab('payment')} className="text-sm text-primary-600 font-medium hover:underline flex items-center gap-1">
                  View plans <ChevronRight size={14} />
                </button>
              </div>
              {payment ? (
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                    <CheckCircle size={24} className="text-green-500" />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-800">{payment.plan_name} — Active</p>
                    <p className="text-sm text-gray-500 flex items-center gap-1">
                      <Calendar size={13} /> {getDaysRemaining()} days remaining
                    </p>
                  </div>
                </div>
              ) : (
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-amber-100 rounded-xl flex items-center justify-center">
                    <AlertCircle size={24} className="text-amber-500" />
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold text-gray-800">No Active Plan</p>
                    <p className="text-sm text-gray-500">Subscribe to unlock all content and AI tools</p>
                  </div>
                  <button onClick={() => setActiveTab('payment')} className="btn-primary text-sm py-2 px-5">
                    Subscribe
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* COURSES TAB */}
        {activeTab === 'courses' && (
          <div className="animate-fade-in space-y-6">
            <h2 className="font-bold text-gray-800 text-xl">My Courses</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {[
                { title: 'English Grade 1', subject: 'English', grade: 'Grade 1', progress: 65, thumbnail: 'https://images.pexels.com/photos/256417/pexels-photo-256417.jpeg?auto=compress&cs=tinysrgb&w=400' },
                { title: 'Mathematics Grade 1', subject: 'Maths', grade: 'Grade 1', progress: 40, thumbnail: 'https://images.pexels.com/photos/1148998/pexels-photo-1148998.jpeg?auto=compress&cs=tinysrgb&w=400' },
                { title: 'EVS - Our Environment', subject: 'EVS', grade: 'Grade 1', progress: 90, thumbnail: 'https://images.pexels.com/photos/5905709/pexels-photo-5905709.jpeg?auto=compress&cs=tinysrgb&w=400' },
              ].map((course) => (
                <div key={course.title} className="bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm card-hover">
                  <div className="relative aspect-video">
                    <img src={course.thumbnail} alt={course.title} className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                    <div className="absolute bottom-3 left-3 right-3">
                      <div className="bg-white/20 backdrop-blur-sm rounded-full h-1.5">
                        <div className="h-1.5 rounded-full bg-accent-400" style={{ width: `${course.progress}%` }} />
                      </div>
                    </div>
                  </div>
                  <div className="p-4">
                    <h3 className="font-semibold text-gray-800 mb-1">{course.title}</h3>
                    <div className="flex items-center justify-between text-sm text-gray-500 mb-3">
                      <span>{course.subject} · {course.grade}</span>
                      <span className="font-medium text-primary-600">{course.progress}%</span>
                    </div>
                    {course.progress >= 100 ? (
                      <div className="flex items-center gap-1 text-green-600 text-sm font-medium">
                        <CheckCircle size={14} /> Completed
                      </div>
                    ) : (
                      <button className="w-full btn-green text-sm py-2 flex items-center justify-center gap-2">
                        <Play size={14} /> Continue Learning
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
            <button onClick={() => onNavigate('videos')} className="btn-primary px-6 py-2.5 text-sm">
              Browse More Courses
            </button>
          </div>
        )}

        {/* AI QUIZ TAB */}
        {activeTab === 'quiz' && (
          <div className="animate-fade-in max-w-2xl mx-auto">
            <h2 className="font-bold text-gray-800 text-xl mb-6 flex items-center gap-2">
              <Brain size={22} className="text-blue-500" /> AI Quiz Generator
            </h2>
            {!quizStarted ? (
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8">
                <p className="text-gray-600 mb-6">Generate a custom quiz on any subject. Our AI creates unique questions just for you!</p>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Topic / Subject</label>
                    <input type="text" value={quizTopic} onChange={e => setQuizTopic(e.target.value)}
                      placeholder="e.g., Addition, Animals, Planets..."
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:border-accent-400 transition-colors" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Grade Level</label>
                    <select value={quizGrade} onChange={e => setQuizGrade(e.target.value)}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:border-accent-400 transition-colors bg-white">
                      {GRADE_LEVELS.map(g => (
                        <option key={g.value} value={g.value}>{g.label}</option>
                      ))}
                    </select>
                  </div>
                  <button onClick={generateQuiz} className="w-full btn-green py-3 flex items-center justify-center gap-2">
                    <Brain size={18} /> Generate Quiz
                  </button>
                </div>
              </div>
            ) : quizDone ? (
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8 text-center">
                <Award size={48} className="text-accent-500 mx-auto mb-4" />
                <h3 className="text-2xl font-bold text-gray-800 mb-2">Quiz Complete!</h3>
                <p className="text-gray-500 mb-4">You scored</p>
                <div className="text-5xl font-bold text-primary-600 mb-6">
                  {quizScore} / {quizQuestions.length}
                </div>
                <div className="text-lg text-gray-600 mb-6">
                  {quizScore === quizQuestions.length ? 'Perfect score! Excellent work!' :
                   quizScore >= quizQuestions.length * 0.7 ? 'Great job! Keep it up!' :
                   'Good effort! Practice more to improve.'}
                </div>
                <div className="flex gap-3 justify-center">
                  <button onClick={() => { setQuizStarted(false); setQuizDone(false); }} className="btn-green px-6 py-2.5">
                    <RefreshCw size={16} className="inline mr-1" /> Try Again
                  </button>
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8">
                <div className="flex justify-between text-sm text-gray-500 mb-4">
                  <span>Question {currentQ + 1} of {quizQuestions.length}</span>
                  <span>Score: {quizScore}</span>
                </div>
                <div className="w-full bg-gray-100 rounded-full h-1.5 mb-6">
                  <div className="h-1.5 rounded-full bg-primary-500 transition-all" style={{ width: `${((currentQ + 1) / quizQuestions.length) * 100}%` }} />
                </div>
                <h3 className="text-xl font-semibold text-gray-800 mb-6">{quizQuestions[currentQ].question}</h3>
                <div className="space-y-3 mb-6">
                  {quizQuestions[currentQ].options.map((opt, i) => (
                    <button key={i} onClick={() => handleAnswer(i)} disabled={answered}
                      className={`w-full text-left px-5 py-3 rounded-xl border-2 text-sm font-medium transition-all ${
                        answered && i === quizQuestions[currentQ].answer ? 'border-green-500 bg-green-50 text-green-700' :
                        answered && i === selected && i !== quizQuestions[currentQ].answer ? 'border-red-400 bg-red-50 text-red-700' :
                        selected === i && !answered ? 'border-primary-500 bg-primary-50 text-primary-700' :
                        'border-gray-200 hover:border-primary-300 text-gray-700'
                      }`}>
                      <span className="inline-flex w-6 h-6 rounded-full bg-gray-100 items-center justify-center mr-3 text-xs font-bold">
                        {String.fromCharCode(65 + i)}
                      </span>
                      {opt}
                    </button>
                  ))}
                </div>
                {answered && (
                  <button onClick={nextQuestion} className="w-full btn-green py-3">
                    {currentQ + 1 >= quizQuestions.length ? 'See Results' : 'Next Question →'}
                  </button>
                )}
              </div>
            )}
          </div>
        )}

        {/* AI STORY TAB */}
        {activeTab === 'story' && (
          <div className="animate-fade-in max-w-2xl mx-auto">
            <h2 className="font-bold text-gray-800 text-xl mb-6 flex items-center gap-2">
              <BookOpen size={22} className="text-emerald-500" /> AI Story Generator
            </h2>
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 mb-4">
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Story Topic</label>
                  <input type="text" value={storyTopic} onChange={e => setStoryTopic(e.target.value)}
                    placeholder="e.g., Friendship, Space, Animals..."
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:border-accent-400 transition-colors" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Grade Level</label>
                  <select value={storyGrade} onChange={e => setStoryGrade(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:border-accent-400 transition-colors bg-white">
                    {GRADE_LEVELS.map(g => <option key={g.value} value={g.value}>{g.label}</option>)}
                  </select>
                </div>
              </div>
              <button onClick={generateStory} disabled={storyLoading} className="w-full btn-green py-3 flex items-center justify-center gap-2">
                {storyLoading ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <><BookOpen size={18} /> Generate Story</>}
              </button>
            </div>
            {generatedStory && (
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 animate-slide-up">
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-8 h-8 bg-emerald-100 rounded-full flex items-center justify-center">
                    <BookOpen size={16} className="text-emerald-600" />
                  </div>
                  <h3 className="font-semibold text-gray-800">Your Story</h3>
                </div>
                <div className="prose prose-sm max-w-none text-gray-700 leading-relaxed whitespace-pre-wrap font-serif text-base">
                  {generatedStory}
                </div>
                <button onClick={() => setGeneratedStory('')} className="mt-4 text-sm text-primary-600 hover:underline flex items-center gap-1">
                  <RefreshCw size={13} /> Generate another
                </button>
              </div>
            )}
          </div>
        )}

        {/* AI CHAT TAB */}
        {activeTab === 'chat' && (
          <div className="animate-fade-in max-w-2xl mx-auto">
            <h2 className="font-bold text-gray-800 text-xl mb-6 flex items-center gap-2">
              <MessageSquare size={22} className="text-violet-500" /> AI Chatbot Tutor
            </h2>
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden flex flex-col" style={{ height: '520px' }}>
              <div className="px-4 py-3 border-b border-gray-100 flex items-center gap-3 bg-primary-50">
                <div className="w-8 h-8 rounded-full bg-primary-600 flex items-center justify-center text-white text-xs font-bold">AI</div>
                <div>
                  <p className="text-sm font-semibold text-gray-800">Dream Learn AI Tutor</p>
                  <p className="text-xs text-green-600 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 bg-green-500 rounded-full" /> Online
                  </p>
                </div>
              </div>
              <div className="flex-1 overflow-y-auto p-4 space-y-3 scrollbar-thin">
                {messages.map((msg, i) => (
                  <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-xs px-4 py-2.5 rounded-2xl text-sm leading-relaxed ${
                      msg.role === 'user' ? 'bg-primary-600 text-white rounded-br-md' : 'bg-gray-100 text-gray-800 rounded-bl-md'
                    }`}>
                      {msg.text}
                    </div>
                  </div>
                ))}
                {chatLoading && (
                  <div className="flex justify-start">
                    <div className="bg-gray-100 rounded-2xl rounded-bl-md px-4 py-2.5">
                      <div className="flex gap-1">
                        {[0, 1, 2].map(i => (
                          <div key={i} className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: `${i * 0.15}s` }} />
                        ))}
                      </div>
                    </div>
                  </div>
                )}
                <div ref={chatEndRef} />
              </div>
              <div className="p-4 border-t border-gray-100">
                <form onSubmit={e => { e.preventDefault(); sendChat(); }} className="flex gap-2">
                  <input value={chatInput} onChange={e => setChatInput(e.target.value)}
                    placeholder="Ask me anything..."
                    className="flex-1 px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:border-accent-400 transition-colors" />
                  <button type="submit" disabled={chatLoading || !chatInput.trim()}
                    className="w-10 h-10 bg-primary-600 rounded-xl flex items-center justify-center text-white hover:bg-primary-700 disabled:opacity-50 transition-colors">
                    <Send size={16} />
                  </button>
                </form>
              </div>
            </div>
          </div>
        )}

        {/* AI VOICE TAB */}
        {activeTab === 'voice' && (
          <div className="animate-fade-in max-w-2xl mx-auto">
            <h2 className="font-bold text-gray-800 text-xl mb-6 flex items-center gap-2">
              <Mic size={22} className="text-orange-500" /> AI Voice Instructor
            </h2>
            {/* Character selection */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 mb-4">
              <h3 className="font-semibold text-gray-800 mb-3">Choose Your AI Instructor</h3>
              <div className="grid grid-cols-2 gap-3 mb-5">
                {VOICE_CHARACTERS.map(char => (
                  <button key={char.id} onClick={() => setSelectedCharacter(char.id)}
                    className={`p-4 rounded-xl border-2 transition-all text-center ${selectedCharacter === char.id ? 'border-primary-500 bg-primary-50' : 'border-gray-200 hover:border-gray-300'}`}>
                    <div className="text-4xl mb-2">{char.emoji}</div>
                    <p className="font-semibold text-gray-800">{char.name}</p>
                    <p className="text-xs text-gray-500 mt-0.5 capitalize">{char.style}</p>
                  </button>
                ))}
              </div>
              <h3 className="font-semibold text-gray-800 mb-3">Select a Lesson</h3>
              <div className="space-y-2">
                {VOICE_LESSONS.map(lesson => (
                  <button key={lesson.id} onClick={() => setSelectedLesson(lesson.id)}
                    className={`w-full flex items-center justify-between p-3.5 rounded-xl border text-sm transition-all ${selectedLesson === lesson.id ? 'border-primary-400 bg-primary-50' : 'border-gray-200 hover:border-gray-300'}`}>
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center ${selectedLesson === lesson.id ? 'bg-primary-500 text-white' : 'bg-gray-100'}`}>
                        <Volume2 size={14} />
                      </div>
                      <div className="text-left">
                        <p className="font-medium text-gray-800">{lesson.title}</p>
                        <p className="text-xs text-gray-500">{lesson.level} · {lesson.duration}</p>
                      </div>
                    </div>
                    {selectedLesson === lesson.id && <CheckCircle size={16} className="text-primary-500" />}
                  </button>
                ))}
              </div>
              <button
                disabled={!selectedLesson}
                onClick={() => setVoicePlaying(true)}
                className="w-full btn-primary mt-4 py-3 flex items-center justify-center gap-2 disabled:opacity-50">
                <Volume2 size={18} /> Start Listening
              </button>
            </div>
            {voicePlaying && (
              <div className="bg-white rounded-2xl border border-primary-200 shadow-sm p-6 animate-slide-up text-center">
                <div className="text-5xl mb-3">{VOICE_CHARACTERS.find(c => c.id === selectedCharacter)?.emoji}</div>
                <h3 className="font-semibold text-gray-800 mb-2">{VOICE_CHARACTERS.find(c => c.id === selectedCharacter)?.name} is speaking...</h3>
                <p className="text-gray-500 text-sm mb-4">
                  "{VOICE_LESSONS.find(l => l.id === selectedLesson)?.title}"
                </p>
                <div className="flex justify-center gap-1 mb-4">
                  {[...Array(20)].map((_, i) => (
                    <div key={i} className="w-1 bg-primary-400 rounded-full animate-bounce"
                      style={{ height: `${8 + Math.random() * 24}px`, animationDelay: `${i * 0.05}s` }} />
                  ))}
                </div>
                <p className="text-sm text-gray-600 italic bg-gray-50 rounded-xl p-4 mb-4">
                  "Hello! Today we are going to learn about {VOICE_LESSONS.find(l => l.id === selectedLesson)?.title.toLowerCase()}.
                  Ready to learn? Let's go! Remember, practice every day makes you a great English speaker!"
                </p>
                <button onClick={() => setVoicePlaying(false)} className="btn-green px-6 py-2.5 text-sm">
                  Stop
                </button>
              </div>
            )}
          </div>
        )}

        {/* PAYMENT TAB */}
        {activeTab === 'payment' && (
          <div className="animate-fade-in">
            <h2 className="font-bold text-gray-800 text-xl mb-6 flex items-center gap-2">
              <CreditCard size={22} className="text-primary-600" /> Subscription Plans
            </h2>
            {payment && (
              <div className="bg-green-50 border border-green-200 rounded-2xl p-5 mb-6 flex items-center gap-4">
                <CheckCircle size={24} className="text-green-500 flex-shrink-0" />
                <div>
                  <p className="font-semibold text-green-800">Active Plan: {payment.plan_name}</p>
                  <p className="text-green-700 text-sm">{getDaysRemaining()} days remaining · Expires {payment.expires_at ? new Date(payment.expires_at).toLocaleDateString() : 'N/A'}</p>
                </div>
              </div>
            )}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
              {PAYMENT_PLANS.map((plan) => (
                <div key={plan.id}
                  className={`bg-white rounded-2xl p-6 border-2 card-hover relative ${plan.id === 'yearly' ? 'border-accent-400' : 'border-gray-200'}`}>
                  {plan.id === 'yearly' && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-accent-500 text-white text-xs font-bold px-3 py-1 rounded-full">BEST VALUE</div>
                  )}
                  <h3 className="font-bold text-gray-800 mb-1">{plan.name}</h3>
                  <div className="text-3xl font-bold mb-1 text-primary-700">
                    {plan.price === 0 ? 'Free' : `₹${plan.price}`}
                  </div>
                  <p className="text-xs text-gray-500 mb-4">{plan.days} days · {plan.description}</p>
                  <ul className="space-y-1.5 mb-5">
                    {plan.features.map(f => (
                      <li key={f} className="flex items-start gap-2 text-xs text-gray-600">
                        <CheckCircle size={12} className="text-green-500 mt-0.5 flex-shrink-0" /> {f}
                      </li>
                    ))}
                  </ul>
                  <button
                    onClick={() => alert(`Razorpay integration: Processing ₹${plan.price} payment for ${plan.name}...`)}
                    className={`w-full py-2.5 rounded-xl text-sm font-semibold transition-all ${plan.id === 'yearly' ? 'btn-primary' : 'btn-green'}`}
                  >
                    {plan.price === 0 ? 'Current Plan' : `Pay ₹${plan.price}`}
                  </button>
                </div>
              ))}
            </div>
            <div className="mt-6 p-4 bg-amber-50 border border-amber-200 rounded-xl text-sm text-amber-700 flex items-start gap-2">
              <AlertCircle size={16} className="flex-shrink-0 mt-0.5" />
              <p>Payments are processed securely via Razorpay. Contact +91 9944656602 for payment assistance.</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
