import { Phone, Globe, Target, Eye, Heart, Award, BookOpen, Users } from 'lucide-react';

interface AboutProps { onNavigate: (page: string) => void; }

const VALUES = [
  { icon: Target, title: 'Our Mission', desc: 'To make quality education accessible to every child from Nursery to Grade 5 through AI-powered interactive learning experiences.', color: 'text-blue-500', bg: 'bg-blue-50' },
  { icon: Eye, title: 'Our Vision', desc: 'A world where every child has access to personalized, engaging education that nurtures curiosity, creativity, and critical thinking.', color: 'text-green-500', bg: 'bg-green-50' },
  { icon: Heart, title: 'Our Values', desc: 'We believe in child-centered learning, innovation, inclusivity, and building lifelong learners through technology and compassion.', color: 'text-rose-500', bg: 'bg-rose-50' },
];

const ACHIEVEMENTS = [
  { value: '10,000+', label: 'Students Enrolled', icon: Users },
  { value: '500+', label: 'Lessons Available', icon: BookOpen },
  { value: '50+', label: 'Expert Faculty', icon: Award },
  { value: '4.9/5', label: 'Parent Rating', icon: Heart },
];

export default function About({ onNavigate }: AboutProps) {
  return (
    <div className="animate-fade-in">
      {/* Hero */}
      <section className="py-20 gradient-hero text-white text-center">
        <div className="max-w-4xl mx-auto px-4">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">About Dream Learn</h1>
          <p className="text-white/80 text-lg max-w-2xl mx-auto">
            Transforming early childhood education through the power of artificial intelligence and expert pedagogy.
          </p>
        </div>
      </section>

      {/* Achievements */}
      <section className="py-12 bg-white">
        <div className="max-w-5xl mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {ACHIEVEMENTS.map(({ value, label, icon: Icon }) => (
              <div key={label} className="text-center p-6 rounded-2xl bg-primary-50 card-hover">
                <Icon size={28} className="text-primary-600 mx-auto mb-2" />
                <div className="text-3xl font-bold text-primary-700">{value}</div>
                <div className="text-sm text-gray-600 mt-1">{label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Mission Vision Values */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold text-gray-900 mb-3">What Drives Us</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {VALUES.map(({ icon: Icon, title, desc, color, bg }) => (
              <div key={title} className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 card-hover text-center">
                <div className={`w-16 h-16 ${bg} rounded-2xl flex items-center justify-center mx-auto mb-4`}>
                  <Icon size={28} className={color} />
                </div>
                <h3 className="font-bold text-gray-800 text-xl mb-3">{title}</h3>
                <p className="text-gray-500 leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Founder */}
      <section className="py-16 bg-white">
        <div className="max-w-5xl mx-auto px-4">
          <div className="text-center mb-10">
            <span className="inline-block bg-accent-50 text-accent-700 text-xs font-semibold uppercase tracking-widest px-3 py-1 rounded-full mb-3">Leadership</span>
            <h2 className="text-3xl font-bold text-gray-900">Meet the Founder</h2>
          </div>
          <div className="flex flex-col md:flex-row items-center gap-10 bg-gradient-to-br from-primary-50 to-accent-50 rounded-3xl p-8 md:p-12 border border-primary-100">
            <div className="flex-shrink-0">
              <div className="w-32 h-32 rounded-2xl shadow-lg flex items-center justify-center text-white text-4xl font-bold"
                style={{ backgroundColor: '#1a3d2e' }}>
                AG
              </div>
            </div>
            <div className="flex-1 text-center md:text-left">
              <h3 className="text-2xl font-bold text-gray-900 mb-1">Arumugasamy G</h3>
              <p className="text-accent-600 font-semibold mb-4">Founder & CEO, Dream Learn</p>
              <p className="text-gray-600 leading-relaxed mb-6">
                A visionary educator with a passion for making quality education accessible to every child.
                With years of experience in EdTech and child psychology, Arumugasamy founded Dream Learn
                to bridge the gap between traditional education and the digital future, creating an
                AI-powered platform that makes learning engaging, effective, and joyful.
              </p>
              <div className="flex flex-wrap gap-4 justify-center md:justify-start">
                <a href="tel:+919944656602"
                  className="flex items-center gap-2 bg-white border border-primary-200 text-primary-700 px-5 py-2.5 rounded-xl hover:bg-primary-50 transition-colors font-medium text-sm">
                  <Phone size={16} /> +91 9944656602
                </a>
                <a href="http://www.dreamlearn.education.com" target="_blank" rel="noreferrer"
                  className="flex items-center gap-2 bg-white border border-primary-200 text-primary-700 px-5 py-2.5 rounded-xl hover:bg-primary-50 transition-colors font-medium text-sm">
                  <Globe size={16} /> www.dreamlearn.education.com
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Story */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">Our Story</h2>
          <div className="prose prose-lg mx-auto text-gray-600 leading-relaxed space-y-4">
            <p>
              Dream Learn was born from a simple but powerful observation: children learn best when education
              is engaging, personalized, and fun. Traditional textbooks often fail to capture a young child's
              imagination, leading to disengagement and a fear of learning.
            </p>
            <p>
              We combined the latest advances in artificial intelligence with proven pedagogical methods to
              create a platform that adapts to each child's learning pace, generates personalized quizzes,
              tells educational stories, and even teaches through beloved animated characters like Shin Chan
              and Doraemon.
            </p>
            <p>
              From Nursery to Grade 5, Dream Learn covers the complete curriculum with videos, interactive
              lessons, live classes, and AI-powered tools that make every learning session an adventure.
            </p>
          </div>
          <button
            onClick={() => onNavigate('register')}
            className="btn-primary mt-8 px-8 py-3 text-base"
          >
            Join Dream Learn Today
          </button>
        </div>
      </section>
    </div>
  );
}
