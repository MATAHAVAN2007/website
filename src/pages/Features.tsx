import { Brain, BookOpen, Mic, Video, FileText, Award, Shield, Zap, Users, BarChart3, Clock, Globe, CheckCircle } from 'lucide-react';

interface FeaturesProps { onNavigate: (page: string) => void; }

const FEATURE_SECTIONS = [
  {
    title: 'AI-Powered Tools',
    subtitle: 'Cutting-edge artificial intelligence for personalized learning',
    features: [
      { icon: Brain, title: 'AI Quiz Generator', desc: 'Generate unlimited MCQ quizzes tailored to any subject, grade, or difficulty level. Perfect for exam preparation and regular practice.', badge: 'AI' },
      { icon: BookOpen, title: 'AI Story Generator', desc: 'Create engaging educational stories based on topics and themes. Makes learning vocabulary, comprehension, and concepts fun and memorable.', badge: 'AI' },
      { icon: Mic, title: 'AI Voice Instructor', desc: 'Learn with beloved animated characters Shin Chan and Doraemon. Our AI voice technology brings lessons to life with engaging narrations.', badge: 'AI' },
      { icon: Brain, title: 'AI Chatbot', desc: 'Get instant answers to any academic question 24/7. Our intelligent chatbot understands natural language and provides clear, age-appropriate explanations.', badge: 'AI' },
    ],
  },
  {
    title: 'Content & Learning',
    subtitle: 'Rich, structured content for comprehensive education',
    features: [
      { icon: Video, title: 'Video Lessons', desc: 'High-quality video lessons for every subject from Nursery to Grade 5, accessible on any device anytime.', badge: null },
      { icon: FileText, title: 'Notes & Books', desc: 'Downloadable PDF notes and textbooks organized by grade and subject. Yearly plan includes free unlimited downloads.', badge: null },
      { icon: Users, title: 'Live Classes', desc: 'Join live sessions via Zoom, Google Meet, or Skype with expert teachers. Schedule, join, and participate easily.', badge: 'LIVE' },
      { icon: Award, title: 'Certificates', desc: 'Earn digital certificates automatically when you complete a course. Share achievements and motivate continued learning.', badge: null },
    ],
  },
  {
    title: 'Platform Features',
    subtitle: 'Everything you need for a complete learning experience',
    features: [
      { icon: BarChart3, title: 'Progress Tracking', desc: 'Monitor student progress across all courses with detailed analytics. Parents and teachers get full visibility.', badge: null },
      { icon: Shield, title: 'Safe & Secure', desc: 'Child-safe platform with no ads, age-appropriate content, and secure authentication for peace of mind.', badge: null },
      { icon: Clock, title: 'Learn Anytime', desc: 'Access content 24/7 from any device. Pre-recorded lessons and AI tools are always available.', badge: null },
      { icon: Globe, title: 'Multi-Grade Support', desc: 'Complete curriculum for Nursery, Junior KG, Senior KG, and Grades 1 through 5 with age-appropriate content.', badge: null },
    ],
  },
];

const PLAN_COMPARISON = [
  { feature: 'Video Lessons', free: true, basic: true, standard: true, yearly: true },
  { feature: 'AI Chatbot', free: 'Limited', basic: true, standard: true, yearly: true },
  { feature: 'AI Quiz Generator', free: false, basic: true, standard: true, yearly: true },
  { feature: 'AI Story Generator', free: false, basic: false, standard: true, yearly: true },
  { feature: 'AI Voice Instructor', free: false, basic: false, standard: false, yearly: true },
  { feature: 'Live Classes', free: false, basic: false, standard: true, yearly: true },
  { feature: 'PDF Notes', free: false, basic: '₹10 each', standard: 'Free', yearly: 'Free' },
  { feature: 'Digital Books', free: false, basic: '₹10 each', standard: '₹10 each', yearly: 'Free' },
  { feature: 'Certificates', free: false, basic: true, standard: true, yearly: true },
  { feature: 'Progress Reports', free: false, basic: false, standard: true, yearly: true },
];

function FeatureValue({ value }: { value: boolean | string }) {
  if (value === true) return <CheckCircle size={18} className="text-green-500 mx-auto" />;
  if (value === false) return <span className="text-gray-300 text-lg">—</span>;
  return <span className="text-xs font-medium text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full">{value}</span>;
}

export default function Features({ onNavigate }: FeaturesProps) {
  return (
    <div className="animate-fade-in">
      {/* Hero */}
      <section className="py-20 gradient-hero text-white text-center">
        <div className="max-w-4xl mx-auto px-4">
          <Zap size={40} className="text-accent-400 mx-auto mb-4" />
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Platform Features</h1>
          <p className="text-white/80 text-lg max-w-2xl mx-auto">
            Everything a young learner needs — AI tools, structured curriculum, live classes, and more.
          </p>
        </div>
      </section>

      {/* Feature sections */}
      {FEATURE_SECTIONS.map((section, si) => (
        <section key={si} className={`py-16 ${si % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}>
          <div className="max-w-6xl mx-auto px-4">
            <div className="text-center mb-10">
              <h2 className="text-3xl font-bold text-gray-900 mb-2">{section.title}</h2>
              <p className="text-gray-500">{section.subtitle}</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {section.features.map(({ icon: Icon, title, desc, badge }) => (
                <div key={title} className="flex gap-5 p-6 bg-white rounded-2xl shadow-sm border border-gray-100 card-hover">
                  <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-primary-50 flex items-center justify-center">
                    <Icon size={22} className="text-primary-600" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-semibold text-gray-800">{title}</h3>
                      {badge && (
                        <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${badge === 'AI' ? 'bg-blue-100 text-blue-600' : badge === 'LIVE' ? 'bg-red-100 text-red-600' : 'bg-gray-100 text-gray-600'}`}>
                          {badge}
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-gray-500 leading-relaxed">{desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      ))}

      {/* Plan Comparison */}
      <section className="py-16 bg-white">
        <div className="max-w-5xl mx-auto px-4">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold text-gray-900 mb-3">Compare Plans</h2>
            <p className="text-gray-500">See exactly what's included in each plan</p>
          </div>
          <div className="overflow-x-auto rounded-2xl border border-gray-200 shadow-sm">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left p-4 text-gray-600 font-semibold text-sm bg-gray-50">Feature</th>
                  <th className="p-4 text-center text-gray-600 font-semibold text-sm bg-gray-50">Free Trial</th>
                  <th className="p-4 text-center text-gray-600 font-semibold text-sm bg-gray-50">₹199 Basic</th>
                  <th className="p-4 text-center text-gray-600 font-semibold text-sm bg-gray-50">₹399 Standard</th>
                  <th className="p-4 text-center text-accent-600 font-bold text-sm bg-accent-50">₹1999 Yearly</th>
                </tr>
              </thead>
              <tbody>
                {PLAN_COMPARISON.map(({ feature, free, basic, standard, yearly }, i) => (
                  <tr key={feature} className={`border-b border-gray-100 ${i % 2 === 0 ? 'bg-white' : 'bg-gray-50/50'}`}>
                    <td className="p-4 text-sm font-medium text-gray-700">{feature}</td>
                    <td className="p-4 text-center"><FeatureValue value={free} /></td>
                    <td className="p-4 text-center"><FeatureValue value={basic} /></td>
                    <td className="p-4 text-center"><FeatureValue value={standard} /></td>
                    <td className="p-4 text-center bg-accent-50/30"><FeatureValue value={yearly} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="text-center mt-8">
            <button onClick={() => onNavigate('register')} className="btn-primary px-10 py-3 text-base">
              Start Free Trial — No Credit Card Needed
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
