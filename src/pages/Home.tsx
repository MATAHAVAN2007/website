import { useState, useEffect, useRef } from 'react';
import { ChevronLeft, ChevronRight, Play, Star, Users, Award, BookOpen, Brain, Mic, FileText, Video, Zap, CheckCircle, ArrowRight } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { Banner, GRADE_LEVELS, PAYMENT_PLANS } from '../types';
import Logo from '../components/Logo';

interface HomeProps {
  onNavigate: (page: string) => void;
}

const DEMO_VIDEOS = [
  { id: 'dQw4w9WgXcQ', title: 'Introduction to Dream Learn', platform: 'youtube', thumbnail: 'https://images.pexels.com/photos/8199562/pexels-photo-8199562.jpeg?auto=compress&cs=tinysrgb&w=600' },
  { id: '2', title: 'AI Learning Experience', platform: 'demo', thumbnail: 'https://images.pexels.com/photos/4145355/pexels-photo-4145355.jpeg?auto=compress&cs=tinysrgb&w=600' },
  { id: '3', title: 'Grade 1 English Lesson', platform: 'demo', thumbnail: 'https://images.pexels.com/photos/5905880/pexels-photo-5905880.jpeg?auto=compress&cs=tinysrgb&w=600' },
  { id: '4', title: 'AI Story Generator Demo', platform: 'demo', thumbnail: 'https://images.pexels.com/photos/256417/pexels-photo-256417.jpeg?auto=compress&cs=tinysrgb&w=600' },
];

const STATS = [
  { value: '10,000+', label: 'Happy Students', icon: Users },
  { value: '500+', label: 'Video Lessons', icon: Video },
  { value: '8', label: 'Grade Levels', icon: BookOpen },
  { value: '4.9', label: 'Average Rating', icon: Star },
];

const FEATURES = [
  { icon: Brain, title: 'AI Quiz Generator', desc: 'Auto-generate MCQ quizzes for any subject and grade.', color: 'text-blue-500', bg: 'bg-blue-50' },
  { icon: BookOpen, title: 'AI Story Generator', desc: 'Create engaging educational stories on any topic.', color: 'text-emerald-500', bg: 'bg-emerald-50' },
  { icon: Mic, title: 'AI Voice Instructor', desc: 'Learn with Shin Chan & Doraemon AI voice characters.', color: 'text-orange-500', bg: 'bg-orange-50' },
  { icon: Video, title: 'Live Classes', desc: 'Join Zoom, Google Meet & Skype live sessions.', color: 'text-purple-500', bg: 'bg-purple-50' },
  { icon: FileText, title: 'Notes & Books', desc: 'Download PDF notes and books for all subjects.', color: 'text-rose-500', bg: 'bg-rose-50' },
  { icon: Award, title: 'Certificates', desc: 'Earn certificates upon course completion.', color: 'text-yellow-500', bg: 'bg-yellow-50' },
];

const TESTIMONIALS = [
  { name: 'Priya Sharma', role: 'Parent - Grade 3', text: 'My daughter loves the AI story generator! Her reading improved drastically in just one month.', avatar: 'PS', stars: 5 },
  { name: 'Rajesh Kumar', role: 'Parent - Nursery', text: 'The animated lessons keep my son engaged. The Doraemon voice instructor is his favorite!', avatar: 'RK', stars: 5 },
  { name: 'Meena Iyer', role: 'Parent - Grade 5', text: 'Excellent platform. The AI quiz generator really helped my child prepare for exams.', avatar: 'MI', stars: 5 },
];

export default function Home({ onNavigate }: HomeProps) {
  const [banners, setBanners] = useState<Banner[]>([]);
  const [bannerIndex, setBannerIndex] = useState(0);
  const [playingVideo, setPlayingVideo] = useState<string | null>(null);
  const bannerTimer = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    supabase.from('banners').select('*').eq('is_active', true).order('order_index').then(({ data }) => {
      if (data && data.length > 0) setBanners(data as Banner[]);
    });
  }, []);

  useEffect(() => {
    if (banners.length < 2) return;
    bannerTimer.current = setInterval(() => {
      setBannerIndex(i => (i + 1) % banners.length);
    }, 5000);
    return () => { if (bannerTimer.current) clearInterval(bannerTimer.current); };
  }, [banners]);

  const prevBanner = () => setBannerIndex(i => (i - 1 + banners.length) % banners.length);
  const nextBanner = () => setBannerIndex(i => (i + 1) % banners.length);

  const defaultBanners = [
    {
      id: '1', title: 'Welcome to Dream Learn', subtitle: 'AI-Powered Education for Children Nursery to Grade 5',
      image_url: 'https://images.pexels.com/photos/8199562/pexels-photo-8199562.jpeg?auto=compress&cs=tinysrgb&w=1400',
      link_url: '#', order_index: 1, is_active: true, created_at: ''
    },
    {
      id: '2', title: 'AI-Powered Learning Tools', subtitle: 'Quiz Generator, Story Generator & Voice Instructor',
      image_url: 'https://images.pexels.com/photos/8386434/pexels-photo-8386434.jpeg?auto=compress&cs=tinysrgb&w=1400',
      link_url: '#', order_index: 2, is_active: true, created_at: ''
    },
    {
      id: '3', title: 'Complete Curriculum', subtitle: 'Expert teachers covering all subjects for every grade',
      image_url: 'https://images.pexels.com/photos/5905709/pexels-photo-5905709.jpeg?auto=compress&cs=tinysrgb&w=1400',
      link_url: '#', order_index: 3, is_active: true, created_at: ''
    },
  ];

  const displayBanners = banners.length > 0 ? banners : defaultBanners;
  const current = displayBanners[bannerIndex];

  return (
    <div className="animate-fade-in">
      {/* Hero Banner Slider */}
      <section className="relative h-[85vh] min-h-[500px] overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center transition-all duration-700"
          style={{ backgroundImage: `url(${current.image_url})` }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-forest/90 via-forest/70 to-transparent" style={{ '--tw-gradient-from': '#0f2a1e' } as React.CSSProperties} />
        <div className="absolute inset-0 flex items-center">
          <div className="max-w-7xl mx-auto px-4 w-full">
            <div className="max-w-2xl animate-slide-up">
              <div className="mb-6">
                <Logo size="lg" />
              </div>
              <h1 className="text-4xl md:text-6xl font-bold text-white leading-tight text-shadow mb-4">
                {current.title}
              </h1>
              <p className="text-lg md:text-xl text-white/80 mb-8 leading-relaxed">
                {current.subtitle}
              </p>
              <div className="flex flex-wrap gap-4">
                <button onClick={() => onNavigate('register')} className="btn-primary text-base px-8 py-3.5">
                  Start Free Trial <ArrowRight size={18} className="inline ml-1" />
                </button>
                <button onClick={() => onNavigate('features')} className="btn-secondary text-base px-8 py-3.5">
                  Explore Features
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Banner controls */}
        {displayBanners.length > 1 && (
          <>
            <button onClick={prevBanner} className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/20 hover:bg-white/40 backdrop-blur-sm rounded-full flex items-center justify-center text-white transition-all">
              <ChevronLeft size={20} />
            </button>
            <button onClick={nextBanner} className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/20 hover:bg-white/40 backdrop-blur-sm rounded-full flex items-center justify-center text-white transition-all">
              <ChevronRight size={20} />
            </button>
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2">
              {displayBanners.map((_, i) => (
                <button key={i} onClick={() => setBannerIndex(i)}
                  className={`w-2.5 h-2.5 rounded-full transition-all ${i === bannerIndex ? 'bg-accent-400 w-6' : 'bg-white/50'}`} />
              ))}
            </div>
          </>
        )}
      </section>

      {/* Stats Bar */}
      <section className="py-8" style={{ backgroundColor: '#1a3d2e' }}>
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {STATS.map(({ value, label, icon: Icon }) => (
              <div key={label} className="flex items-center gap-3 text-white">
                <div className="w-10 h-10 rounded-lg bg-accent-500/20 flex items-center justify-center">
                  <Icon size={20} className="text-accent-400" />
                </div>
                <div>
                  <div className="font-bold text-xl text-accent-400">{value}</div>
                  <div className="text-xs text-white/70">{label}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Promotional Banner Scroll */}
      <section className="py-3 bg-accent-500 overflow-hidden">
        <div className="banner-scroll flex whitespace-nowrap">
          {[...Array(4)].map((_, rep) =>
            ['Free 7-day trial available!', 'AI-Powered Learning Tools', 'Live Classes with Expert Teachers', 'Certificates on Completion', 'Nursery to Grade 5 Curriculum', 'Join 10,000+ Happy Students'].map((text, i) => (
              <span key={`${rep}-${i}`} className="inline-flex items-center gap-2 mx-8 text-white font-semibold text-sm">
                <Star size={14} className="text-white/80" /> {text}
              </span>
            ))
          )}
        </div>
      </section>

      {/* Demo Videos */}
      <section className="py-16 bg-gray-50" id="videos">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-10">
            <span className="inline-block bg-primary-50 text-primary-600 text-xs font-semibold uppercase tracking-widest px-3 py-1 rounded-full mb-3">Demo Videos</span>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">See Dream Learn in Action</h2>
            <p className="text-gray-500 max-w-xl mx-auto">Watch how our AI-powered platform transforms learning for children</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {DEMO_VIDEOS.map((vid) => (
              <div key={vid.id} className="bg-white rounded-2xl overflow-hidden shadow-md card-hover group cursor-pointer"
                onClick={() => setPlayingVideo(vid.id)}>
                <div className="relative aspect-video">
                  <img src={vid.thumbnail} alt={vid.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                  <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                    <div className="w-12 h-12 bg-white/90 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform shadow-lg">
                      <Play size={20} className="text-primary-600 ml-1" fill="currentColor" />
                    </div>
                  </div>
                </div>
                <div className="p-4">
                  <h3 className="font-semibold text-gray-800 text-sm">{vid.title}</h3>
                  <span className="text-xs text-accent-600 font-medium">Watch Now</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Video Modal */}
      {playingVideo && (
        <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4" onClick={() => setPlayingVideo(null)}>
          <div className="bg-black rounded-2xl overflow-hidden max-w-3xl w-full aspect-video" onClick={e => e.stopPropagation()}>
            {playingVideo === 'dQw4w9WgXcQ' ? (
              <iframe
                className="w-full h-full"
                src={`https://www.youtube.com/embed/${playingVideo}?autoplay=1`}
                allow="autoplay; fullscreen"
                allowFullScreen
              />
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center text-white bg-primary-800">
                <Play size={48} className="text-accent-400 mb-4" />
                <p className="text-lg font-semibold">Demo Video</p>
                <p className="text-white/60 text-sm mt-2">Video content will be available after upload by faculty</p>
                <button onClick={() => setPlayingVideo(null)} className="mt-6 btn-primary text-sm">Close</button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Features */}
      <section className="py-16 bg-white" id="features">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-10">
            <span className="inline-block bg-accent-50 text-accent-700 text-xs font-semibold uppercase tracking-widest px-3 py-1 rounded-full mb-3">What We Offer</span>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">AI-Powered Learning Features</h2>
            <p className="text-gray-500 max-w-xl mx-auto">Everything your child needs to excel academically</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {FEATURES.map(({ icon: Icon, title, desc, color, bg }) => (
              <div key={title} className="p-6 rounded-2xl border border-gray-100 hover:border-primary-200 card-hover bg-white">
                <div className={`w-12 h-12 ${bg} rounded-xl flex items-center justify-center mb-4`}>
                  <Icon size={22} className={color} />
                </div>
                <h3 className="font-semibold text-gray-800 mb-2">{title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Grade Levels */}
      <section className="py-16" id="courses" style={{ backgroundColor: '#f8faf9' }}>
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-10">
            <span className="inline-block bg-primary-50 text-primary-600 text-xs font-semibold uppercase tracking-widest px-3 py-1 rounded-full mb-3">Curriculum</span>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">Grades Nursery to Grade 5</h2>
            <p className="text-gray-500 max-w-xl mx-auto">Structured curriculum designed by expert educators for every developmental stage</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {GRADE_LEVELS.map(({ value, label, subjects }) => (
              <div key={value}
                className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 card-hover cursor-pointer hover:border-primary-300"
                onClick={() => onNavigate('courses')}
              >
                <div className="w-10 h-10 rounded-xl mb-3 flex items-center justify-center text-white font-bold text-sm"
                  style={{ backgroundColor: '#1a3d2e' }}>
                  {label.split(' ')[0].substring(0, 2).toUpperCase()}
                </div>
                <h3 className="font-semibold text-gray-800 text-sm mb-1">{label}</h3>
                <p className="text-xs text-gray-500">{subjects.slice(0, 3).join(', ')}</p>
                <div className="mt-3 flex items-center text-accent-600 text-xs font-medium">
                  <span>Explore</span> <ArrowRight size={12} className="ml-1" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-10">
            <span className="inline-block bg-accent-50 text-accent-700 text-xs font-semibold uppercase tracking-widest px-3 py-1 rounded-full mb-3">Pricing</span>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">Simple, Affordable Plans</h2>
            <p className="text-gray-500 max-w-xl mx-auto">Choose the plan that works best for your family</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {PAYMENT_PLANS.map((plan) => (
              <div key={plan.id}
                className={`rounded-2xl p-6 border-2 relative card-hover ${plan.id === 'yearly' ? 'border-accent-500 bg-gradient-to-b from-primary-50 to-white' : 'border-gray-200 bg-white'}`}
              >
                {plan.id === 'yearly' && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-accent-500 text-white text-xs font-bold px-3 py-1 rounded-full">BEST VALUE</div>
                )}
                <h3 className="font-bold text-gray-800 mb-1">{plan.name}</h3>
                <div className="text-3xl font-bold mb-1" style={{ color: '#1a3d2e' }}>
                  {plan.price === 0 ? 'Free' : `₹${plan.price}`}
                </div>
                <p className="text-xs text-gray-500 mb-4">{plan.description}</p>
                <ul className="space-y-2 mb-6">
                  {plan.features.map((f) => (
                    <li key={f} className="flex items-start gap-2 text-sm text-gray-600">
                      <CheckCircle size={14} className="text-green-500 mt-0.5 flex-shrink-0" /> {f}
                    </li>
                  ))}
                </ul>
                <button
                  onClick={() => onNavigate('register')}
                  className={`w-full py-2.5 rounded-xl font-semibold text-sm transition-all ${plan.id === 'yearly' ? 'btn-primary' : 'btn-green'}`}
                >
                  {plan.price === 0 ? 'Start Free' : 'Get Started'}
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16" style={{ backgroundColor: '#f8faf9' }}>
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-10">
            <span className="inline-block bg-primary-50 text-primary-600 text-xs font-semibold uppercase tracking-widest px-3 py-1 rounded-full mb-3">Testimonials</span>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">What Parents Say</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {TESTIMONIALS.map(({ name, role, text, avatar, stars }) => (
              <div key={name} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 card-hover">
                <div className="flex gap-1 mb-3">
                  {Array(stars).fill(null).map((_, i) => (
                    <Star key={i} size={14} className="text-accent-400" fill="currentColor" />
                  ))}
                </div>
                <p className="text-gray-600 text-sm leading-relaxed mb-4">"{text}"</p>
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-primary-500 flex items-center justify-center text-white text-sm font-bold">
                    {avatar}
                  </div>
                  <div>
                    <p className="font-semibold text-gray-800 text-sm">{name}</p>
                    <p className="text-xs text-gray-500">{role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Banner */}
      <section className="py-16 gradient-hero text-white text-center">
        <div className="max-w-3xl mx-auto px-4">
          <Zap size={40} className="text-accent-400 mx-auto mb-4" />
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready to Start Learning?</h2>
          <p className="text-white/80 mb-8 text-lg">Join thousands of students and unlock AI-powered education today.</p>
          <div className="flex flex-wrap justify-center gap-4">
            <button onClick={() => onNavigate('register')} className="btn-primary px-10 py-4 text-base">
              Start Free Trial
            </button>
            <button onClick={() => onNavigate('login')} className="btn-secondary px-10 py-4 text-base">
              Sign In
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
