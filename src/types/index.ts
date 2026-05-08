export type UserRole = 'student' | 'faculty' | 'admin';
export type PaymentStatus = 'active' | 'pending' | 'expired' | 'failed';
export type ContentType = 'video' | 'note' | 'book' | 'link';
export type LivePlatform = 'zoom' | 'google_meet' | 'skype' | 'other';

export interface Profile {
  id: string;
  full_name: string;
  email: string;
  phone: string;
  role: UserRole;
  avatar_url: string;
  created_at: string;
  updated_at: string;
}

export interface Course {
  id: string;
  title: string;
  description: string;
  grade_level: string;
  subject: string;
  thumbnail_url: string;
  faculty_id: string;
  is_published: boolean;
  price: number;
  created_at: string;
  updated_at: string;
  faculty?: Profile;
}

export interface Lesson {
  id: string;
  course_id: string;
  title: string;
  description: string;
  order_index: number;
  duration_minutes: number;
  is_free: boolean;
  created_at: string;
}

export interface Enrollment {
  id: string;
  student_id: string;
  course_id: string;
  enrolled_at: string;
  completed_at: string | null;
  course?: Course;
}

export interface Progress {
  id: string;
  student_id: string;
  lesson_id: string;
  course_id: string;
  completed: boolean;
  completed_at: string | null;
}

export interface Payment {
  id: string;
  user_id: string;
  plan_name: string;
  amount: number;
  currency: string;
  status: PaymentStatus;
  razorpay_order_id: string;
  razorpay_payment_id: string;
  started_at: string;
  expires_at: string | null;
  created_at: string;
  profile?: Profile;
}

export interface ContentItem {
  id: string;
  course_id: string | null;
  lesson_id: string | null;
  title: string;
  description: string;
  content_type: ContentType;
  file_url: string;
  embed_url: string;
  thumbnail_url: string;
  duration_minutes: number;
  is_free: boolean;
  price: number;
  uploaded_by: string | null;
  created_at: string;
}

export interface LiveClass {
  id: string;
  title: string;
  description: string;
  platform: LivePlatform;
  meeting_url: string;
  meeting_id: string;
  passcode: string;
  course_id: string | null;
  scheduled_at: string;
  duration_minutes: number;
  host_id: string | null;
  is_active: boolean;
  created_at: string;
  host?: Profile;
}

export interface Banner {
  id: string;
  title: string;
  subtitle: string;
  image_url: string;
  link_url: string;
  is_active: boolean;
  order_index: number;
  created_at: string;
}

export const GRADE_LEVELS = [
  { value: 'nursery', label: 'Nursery (3-5 yrs)', subjects: ['Alphabets', 'Numbers', 'Colors', 'Shapes'] },
  { value: 'junior_kg', label: 'Junior KG (4-5 yrs)', subjects: ['Phonics', 'Counting', 'Drawing', 'Stories'] },
  { value: 'senior_kg', label: 'Senior KG (5-6 yrs)', subjects: ['Reading', 'Writing', 'Math', 'Science'] },
  { value: 'grade_1', label: 'Grade 1 (6-7 yrs)', subjects: ['English', 'Maths', 'EVS', 'GK'] },
  { value: 'grade_2', label: 'Grade 2 (7-8 yrs)', subjects: ['Grammar', 'Arithmetic', 'Science', 'Hindi'] },
  { value: 'grade_3', label: 'Grade 3 (8-9 yrs)', subjects: ['Comprehension', 'Fractions', 'Biology', 'History'] },
  { value: 'grade_4', label: 'Grade 4 (9-10 yrs)', subjects: ['Algebra', 'Geography', 'Physics', 'Civics'] },
  { value: 'grade_5', label: 'Grade 5 (10-11 yrs)', subjects: ['Advanced Maths', 'Chemistry', 'Computer', 'Social Science'] },
];

export const PAYMENT_PLANS = [
  { id: 'free_trial', name: 'Free Trial', price: 0, days: 7, description: '7 days access to limited content', features: ['Access to free lessons', 'AI Chatbot (5 queries/day)', 'Progress tracking'] },
  { id: 'basic', name: 'Basic Plan', price: 199, days: 30, description: '30 days full access', features: ['All video lessons', 'Downloadable notes (₹10 each)', 'AI tools', 'Progress tracking', 'Certificate on completion'] },
  { id: 'standard', name: 'Standard Plan', price: 399, days: 30, description: '30 days premium access', features: ['Everything in Basic', 'Free notes download', 'Live class access', 'AI Story Generator', 'Priority support'] },
  { id: 'yearly', name: 'Yearly Plan', price: 1999, days: 365, description: '365 days unlimited access', features: ['Everything in Standard', 'Free books & videos', 'AI Voice Instructor', 'Unlimited AI tools', 'Certificate', 'Parent progress reports'] },
];
