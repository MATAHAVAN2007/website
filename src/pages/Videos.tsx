import { useState } from 'react';
import { Play, Lock, Filter } from 'lucide-react';
import { GRADE_LEVELS } from '../types';
import { useAuth } from '../contexts/AuthContext';

interface VideosProps { onNavigate: (page: string) => void; }

const DEMO_CONTENT = [
  { id: '1', title: 'Alphabets A-Z with Fun Songs', grade: 'nursery', subject: 'Alphabets', duration: '8 min', thumbnail: 'https://images.pexels.com/photos/256417/pexels-photo-256417.jpeg?auto=compress&cs=tinysrgb&w=400', free: true, embedUrl: '' },
  { id: '2', title: 'Counting 1-20 with Colorful Objects', grade: 'nursery', subject: 'Numbers', duration: '10 min', thumbnail: 'https://images.pexels.com/photos/1148998/pexels-photo-1148998.jpeg?auto=compress&cs=tinysrgb&w=400', free: true, embedUrl: '' },
  { id: '3', title: 'Colors of the Rainbow', grade: 'nursery', subject: 'Colors', duration: '6 min', thumbnail: 'https://images.pexels.com/photos/3471017/pexels-photo-3471017.jpeg?auto=compress&cs=tinysrgb&w=400', free: false, embedUrl: '' },
  { id: '4', title: 'Phonics: Short Vowel Sounds', grade: 'junior_kg', subject: 'Phonics', duration: '12 min', thumbnail: 'https://images.pexels.com/photos/5905880/pexels-photo-5905880.jpeg?auto=compress&cs=tinysrgb&w=400', free: true, embedUrl: '' },
  { id: '5', title: 'Drawing Basic Shapes', grade: 'junior_kg', subject: 'Drawing', duration: '15 min', thumbnail: 'https://images.pexels.com/photos/1148998/pexels-photo-1148998.jpeg?auto=compress&cs=tinysrgb&w=400', free: false, embedUrl: '' },
  { id: '6', title: 'Reading Simple Sentences', grade: 'senior_kg', subject: 'Reading', duration: '14 min', thumbnail: 'https://images.pexels.com/photos/8199562/pexels-photo-8199562.jpeg?auto=compress&cs=tinysrgb&w=400', free: false, embedUrl: '' },
  { id: '7', title: 'Grade 1 English: Nouns', grade: 'grade_1', subject: 'English', duration: '18 min', thumbnail: 'https://images.pexels.com/photos/4145355/pexels-photo-4145355.jpeg?auto=compress&cs=tinysrgb&w=400', free: false, embedUrl: '' },
  { id: '8', title: 'Addition and Subtraction', grade: 'grade_1', subject: 'Maths', duration: '20 min', thumbnail: 'https://images.pexels.com/photos/8386434/pexels-photo-8386434.jpeg?auto=compress&cs=tinysrgb&w=400', free: false, embedUrl: '' },
  { id: '9', title: 'Plants and Animals - EVS', grade: 'grade_1', subject: 'EVS', duration: '16 min', thumbnail: 'https://images.pexels.com/photos/5905709/pexels-photo-5905709.jpeg?auto=compress&cs=tinysrgb&w=400', free: true, embedUrl: '' },
  { id: '10', title: 'Grammar: Adjectives', grade: 'grade_2', subject: 'Grammar', duration: '22 min', thumbnail: 'https://images.pexels.com/photos/256417/pexels-photo-256417.jpeg?auto=compress&cs=tinysrgb&w=400', free: false, embedUrl: '' },
  { id: '11', title: 'Multiplication Tables 1-10', grade: 'grade_2', subject: 'Arithmetic', duration: '25 min', thumbnail: 'https://images.pexels.com/photos/1148998/pexels-photo-1148998.jpeg?auto=compress&cs=tinysrgb&w=400', free: false, embedUrl: '' },
  { id: '12', title: 'Introduction to Fractions', grade: 'grade_3', subject: 'Fractions', duration: '20 min', thumbnail: 'https://images.pexels.com/photos/8199562/pexels-photo-8199562.jpeg?auto=compress&cs=tinysrgb&w=400', free: false, embedUrl: '' },
];

export default function Videos({ onNavigate }: VideosProps) {
  const { profile } = useAuth();
  const [selectedGrade, setSelectedGrade] = useState<string>('all');
  const [playingId, setPlayingId] = useState<string | null>(null);

  const filtered = selectedGrade === 'all' ? DEMO_CONTENT : DEMO_CONTENT.filter(v => v.grade === selectedGrade);

  const handlePlay = (video: typeof DEMO_CONTENT[0]) => {
    if (!video.free && !profile) {
      onNavigate('login');
      return;
    }
    setPlayingId(video.id);
  };

  return (
    <div className="animate-fade-in">
      {/* Hero */}
      <section className="py-16 gradient-hero text-white text-center">
        <div className="max-w-4xl mx-auto px-4">
          <Play size={40} className="text-accent-400 mx-auto mb-4" />
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Video Library</h1>
          <p className="text-white/80 text-lg max-w-2xl mx-auto">
            Stream educational videos for Nursery through Grade 5. Free videos marked with a green badge.
          </p>
        </div>
      </section>

      {/* Filter */}
      <section className="bg-white border-b border-gray-200 sticky top-16 z-30">
        <div className="max-w-7xl mx-auto px-4 py-3">
          <div className="flex items-center gap-3 overflow-x-auto scrollbar-thin pb-1">
            <div className="flex items-center gap-1 text-gray-500 text-sm flex-shrink-0">
              <Filter size={14} /> Grade:
            </div>
            <button
              onClick={() => setSelectedGrade('all')}
              className={`px-4 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-all flex-shrink-0 ${selectedGrade === 'all' ? 'bg-primary-500 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
            >
              All Grades
            </button>
            {GRADE_LEVELS.map(({ value, label }) => (
              <button
                key={value}
                onClick={() => setSelectedGrade(value)}
                className={`px-4 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-all flex-shrink-0 ${selectedGrade === value ? 'bg-primary-500 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
              >
                {label.split('(')[0].trim()}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Videos grid */}
      <section className="py-12 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex justify-between items-center mb-6">
            <p className="text-gray-600 text-sm">{filtered.length} videos found</p>
            {!profile && (
              <div className="flex items-center gap-2 text-sm text-amber-600 bg-amber-50 px-4 py-2 rounded-lg border border-amber-200">
                <Lock size={14} /> Login to access all videos
                <button onClick={() => onNavigate('login')} className="text-primary-600 font-semibold hover:underline">Sign in</button>
              </div>
            )}
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
            {filtered.map((video) => (
              <div key={video.id}
                className="bg-white rounded-2xl overflow-hidden shadow-sm card-hover group cursor-pointer border border-gray-100"
                onClick={() => handlePlay(video)}
              >
                <div className="relative aspect-video">
                  <img src={video.thumbnail} alt={video.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                  <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                    {video.free || profile ? (
                      <div className="w-10 h-10 bg-white/90 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform shadow-md">
                        <Play size={16} className="text-primary-600 ml-0.5" fill="currentColor" />
                      </div>
                    ) : (
                      <div className="w-10 h-10 bg-white/90 rounded-full flex items-center justify-center shadow-md">
                        <Lock size={16} className="text-gray-600" />
                      </div>
                    )}
                  </div>
                  {video.free && (
                    <div className="absolute top-2 left-2 bg-green-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">FREE</div>
                  )}
                  <div className="absolute bottom-2 right-2 bg-black/60 text-white text-xs px-2 py-0.5 rounded-full">{video.duration}</div>
                </div>
                <div className="p-3">
                  <p className="font-semibold text-gray-800 text-sm line-clamp-2 mb-1">{video.title}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-accent-600 font-medium">{video.subject}</span>
                    <span className="text-xs text-gray-400">{GRADE_LEVELS.find(g => g.value === video.grade)?.label.split('(')[0].trim()}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Video modal */}
      {playingId && (
        <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4" onClick={() => setPlayingId(null)}>
          <div className="bg-primary-800 rounded-2xl overflow-hidden max-w-2xl w-full p-10 text-center" onClick={e => e.stopPropagation()}>
            <Play size={48} className="text-accent-400 mx-auto mb-4" />
            <h3 className="text-white text-xl font-bold mb-2">
              {DEMO_CONTENT.find(v => v.id === playingId)?.title}
            </h3>
            <p className="text-white/60 text-sm mb-6">Video content streams here. Faculty can upload MP4 or add YouTube/Vimeo embed URLs.</p>
            <button onClick={() => setPlayingId(null)} className="btn-primary">Close</button>
          </div>
        </div>
      )}
    </div>
  );
}
