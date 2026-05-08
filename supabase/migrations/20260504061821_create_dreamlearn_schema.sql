/*
  # Dream Learn Education Platform - Full Schema

  ## Tables Created:
  1. profiles - Extended user profiles (student/faculty/admin roles)
  2. courses - Course catalog with grade levels
  3. lessons - Individual lessons within courses
  4. enrollments - Student course enrollments
  5. progress - Per-lesson student progress tracking
  6. payments - Subscription payment records
  7. content_items - Videos, notes, books linked to courses
  8. live_classes - Live class links (Zoom, Meet, Skype)
  9. banners - Promotional banner management
  10. ai_sessions - AI tool usage logs

  ## Security:
  - RLS enabled on all tables
  - Role-based access policies
*/

-- PROFILES
CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name text NOT NULL DEFAULT '',
  email text NOT NULL DEFAULT '',
  phone text DEFAULT '',
  role text NOT NULL DEFAULT 'student' CHECK (role IN ('student', 'faculty', 'admin')),
  avatar_url text DEFAULT '',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own profile"
  ON profiles FOR SELECT TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can insert own profile"
  ON profiles FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Admin can view all profiles"
  ON profiles FOR SELECT TO authenticated
  USING (
    EXISTS (SELECT 1 FROM profiles p WHERE p.id = auth.uid() AND p.role = 'admin')
  );

CREATE POLICY "Admin can update all profiles"
  ON profiles FOR UPDATE TO authenticated
  USING (
    EXISTS (SELECT 1 FROM profiles p WHERE p.id = auth.uid() AND p.role = 'admin')
  )
  WITH CHECK (
    EXISTS (SELECT 1 FROM profiles p WHERE p.id = auth.uid() AND p.role = 'admin')
  );

-- COURSES
CREATE TABLE IF NOT EXISTS courses (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text DEFAULT '',
  grade_level text NOT NULL,
  subject text NOT NULL,
  thumbnail_url text DEFAULT '',
  faculty_id uuid REFERENCES profiles(id) ON DELETE SET NULL,
  is_published boolean DEFAULT false,
  price numeric(10,2) DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);
ALTER TABLE courses ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view published courses"
  ON courses FOR SELECT
  USING (is_published = true);

CREATE POLICY "Faculty can view own courses"
  ON courses FOR SELECT TO authenticated
  USING (faculty_id = auth.uid());

CREATE POLICY "Faculty can insert courses"
  ON courses FOR INSERT TO authenticated
  WITH CHECK (
    faculty_id = auth.uid() AND
    EXISTS (SELECT 1 FROM profiles p WHERE p.id = auth.uid() AND p.role IN ('faculty','admin'))
  );

CREATE POLICY "Faculty can update own courses"
  ON courses FOR UPDATE TO authenticated
  USING (faculty_id = auth.uid() OR EXISTS (SELECT 1 FROM profiles p WHERE p.id = auth.uid() AND p.role = 'admin'))
  WITH CHECK (faculty_id = auth.uid() OR EXISTS (SELECT 1 FROM profiles p WHERE p.id = auth.uid() AND p.role = 'admin'));

CREATE POLICY "Admin can delete courses"
  ON courses FOR DELETE TO authenticated
  USING (EXISTS (SELECT 1 FROM profiles p WHERE p.id = auth.uid() AND p.role IN ('admin','faculty') AND (p.role = 'admin' OR courses.faculty_id = auth.uid())));

-- LESSONS
CREATE TABLE IF NOT EXISTS lessons (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  course_id uuid NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
  title text NOT NULL,
  description text DEFAULT '',
  order_index integer DEFAULT 0,
  duration_minutes integer DEFAULT 0,
  is_free boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);
ALTER TABLE lessons ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view lessons of published courses"
  ON lessons FOR SELECT
  USING (
    EXISTS (SELECT 1 FROM courses c WHERE c.id = lessons.course_id AND c.is_published = true)
  );

CREATE POLICY "Faculty can manage own course lessons"
  ON lessons FOR INSERT TO authenticated
  WITH CHECK (
    EXISTS (SELECT 1 FROM courses c WHERE c.id = lessons.course_id AND c.faculty_id = auth.uid())
    OR EXISTS (SELECT 1 FROM profiles p WHERE p.id = auth.uid() AND p.role = 'admin')
  );

CREATE POLICY "Faculty can update own course lessons"
  ON lessons FOR UPDATE TO authenticated
  USING (
    EXISTS (SELECT 1 FROM courses c WHERE c.id = lessons.course_id AND c.faculty_id = auth.uid())
    OR EXISTS (SELECT 1 FROM profiles p WHERE p.id = auth.uid() AND p.role = 'admin')
  )
  WITH CHECK (
    EXISTS (SELECT 1 FROM courses c WHERE c.id = lessons.course_id AND c.faculty_id = auth.uid())
    OR EXISTS (SELECT 1 FROM profiles p WHERE p.id = auth.uid() AND p.role = 'admin')
  );

CREATE POLICY "Faculty can delete own course lessons"
  ON lessons FOR DELETE TO authenticated
  USING (
    EXISTS (SELECT 1 FROM courses c WHERE c.id = lessons.course_id AND c.faculty_id = auth.uid())
    OR EXISTS (SELECT 1 FROM profiles p WHERE p.id = auth.uid() AND p.role = 'admin')
  );

-- ENROLLMENTS
CREATE TABLE IF NOT EXISTS enrollments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  course_id uuid NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
  enrolled_at timestamptz DEFAULT now(),
  completed_at timestamptz,
  UNIQUE(student_id, course_id)
);
ALTER TABLE enrollments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Students can view own enrollments"
  ON enrollments FOR SELECT TO authenticated
  USING (student_id = auth.uid() OR EXISTS (SELECT 1 FROM profiles p WHERE p.id = auth.uid() AND p.role IN ('faculty','admin')));

CREATE POLICY "Students can enroll"
  ON enrollments FOR INSERT TO authenticated
  WITH CHECK (student_id = auth.uid());

CREATE POLICY "Admin can delete enrollments"
  ON enrollments FOR DELETE TO authenticated
  USING (EXISTS (SELECT 1 FROM profiles p WHERE p.id = auth.uid() AND p.role = 'admin'));

-- PROGRESS
CREATE TABLE IF NOT EXISTS progress (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  lesson_id uuid NOT NULL REFERENCES lessons(id) ON DELETE CASCADE,
  course_id uuid NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
  completed boolean DEFAULT false,
  completed_at timestamptz,
  UNIQUE(student_id, lesson_id)
);
ALTER TABLE progress ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Students can view own progress"
  ON progress FOR SELECT TO authenticated
  USING (student_id = auth.uid() OR EXISTS (SELECT 1 FROM profiles p WHERE p.id = auth.uid() AND p.role IN ('faculty','admin')));

CREATE POLICY "Students can insert own progress"
  ON progress FOR INSERT TO authenticated
  WITH CHECK (student_id = auth.uid());

CREATE POLICY "Students can update own progress"
  ON progress FOR UPDATE TO authenticated
  USING (student_id = auth.uid())
  WITH CHECK (student_id = auth.uid());

-- PAYMENTS
CREATE TABLE IF NOT EXISTS payments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  plan_name text NOT NULL,
  amount numeric(10,2) NOT NULL,
  currency text DEFAULT 'INR',
  status text DEFAULT 'pending' CHECK (status IN ('active','pending','expired','failed')),
  razorpay_order_id text DEFAULT '',
  razorpay_payment_id text DEFAULT '',
  started_at timestamptz DEFAULT now(),
  expires_at timestamptz,
  created_at timestamptz DEFAULT now()
);
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own payments"
  ON payments FOR SELECT TO authenticated
  USING (user_id = auth.uid() OR EXISTS (SELECT 1 FROM profiles p WHERE p.id = auth.uid() AND p.role = 'admin'));

CREATE POLICY "Users can insert own payments"
  ON payments FOR INSERT TO authenticated
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Admin can update payments"
  ON payments FOR UPDATE TO authenticated
  USING (EXISTS (SELECT 1 FROM profiles p WHERE p.id = auth.uid() AND p.role = 'admin'))
  WITH CHECK (EXISTS (SELECT 1 FROM profiles p WHERE p.id = auth.uid() AND p.role = 'admin'));

-- CONTENT ITEMS (videos, notes, books)
CREATE TABLE IF NOT EXISTS content_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  course_id uuid REFERENCES courses(id) ON DELETE CASCADE,
  lesson_id uuid REFERENCES lessons(id) ON DELETE CASCADE,
  title text NOT NULL,
  description text DEFAULT '',
  content_type text NOT NULL CHECK (content_type IN ('video','note','book','link')),
  file_url text DEFAULT '',
  embed_url text DEFAULT '',
  thumbnail_url text DEFAULT '',
  duration_minutes integer DEFAULT 0,
  is_free boolean DEFAULT false,
  price numeric(10,2) DEFAULT 0,
  uploaded_by uuid REFERENCES profiles(id) ON DELETE SET NULL,
  created_at timestamptz DEFAULT now()
);
ALTER TABLE content_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view free content"
  ON content_items FOR SELECT
  USING (is_free = true);

CREATE POLICY "Authenticated users can view all content"
  ON content_items FOR SELECT TO authenticated
  USING (true);

CREATE POLICY "Faculty can insert content"
  ON content_items FOR INSERT TO authenticated
  WITH CHECK (
    uploaded_by = auth.uid() AND
    EXISTS (SELECT 1 FROM profiles p WHERE p.id = auth.uid() AND p.role IN ('faculty','admin'))
  );

CREATE POLICY "Faculty can update own content"
  ON content_items FOR UPDATE TO authenticated
  USING (uploaded_by = auth.uid() OR EXISTS (SELECT 1 FROM profiles p WHERE p.id = auth.uid() AND p.role = 'admin'))
  WITH CHECK (uploaded_by = auth.uid() OR EXISTS (SELECT 1 FROM profiles p WHERE p.id = auth.uid() AND p.role = 'admin'));

CREATE POLICY "Faculty can delete own content"
  ON content_items FOR DELETE TO authenticated
  USING (uploaded_by = auth.uid() OR EXISTS (SELECT 1 FROM profiles p WHERE p.id = auth.uid() AND p.role = 'admin'));

-- LIVE CLASSES
CREATE TABLE IF NOT EXISTS live_classes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text DEFAULT '',
  platform text NOT NULL CHECK (platform IN ('zoom','google_meet','skype','other')),
  meeting_url text NOT NULL,
  meeting_id text DEFAULT '',
  passcode text DEFAULT '',
  course_id uuid REFERENCES courses(id) ON DELETE SET NULL,
  scheduled_at timestamptz NOT NULL,
  duration_minutes integer DEFAULT 60,
  host_id uuid REFERENCES profiles(id) ON DELETE SET NULL,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now()
);
ALTER TABLE live_classes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can view live classes"
  ON live_classes FOR SELECT TO authenticated
  USING (true);

CREATE POLICY "Faculty can insert live classes"
  ON live_classes FOR INSERT TO authenticated
  WITH CHECK (
    host_id = auth.uid() AND
    EXISTS (SELECT 1 FROM profiles p WHERE p.id = auth.uid() AND p.role IN ('faculty','admin'))
  );

CREATE POLICY "Faculty can update own live classes"
  ON live_classes FOR UPDATE TO authenticated
  USING (host_id = auth.uid() OR EXISTS (SELECT 1 FROM profiles p WHERE p.id = auth.uid() AND p.role = 'admin'))
  WITH CHECK (host_id = auth.uid() OR EXISTS (SELECT 1 FROM profiles p WHERE p.id = auth.uid() AND p.role = 'admin'));

CREATE POLICY "Faculty can delete own live classes"
  ON live_classes FOR DELETE TO authenticated
  USING (host_id = auth.uid() OR EXISTS (SELECT 1 FROM profiles p WHERE p.id = auth.uid() AND p.role = 'admin'));

-- BANNERS
CREATE TABLE IF NOT EXISTS banners (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  subtitle text DEFAULT '',
  image_url text NOT NULL,
  link_url text DEFAULT '',
  is_active boolean DEFAULT true,
  order_index integer DEFAULT 0,
  created_at timestamptz DEFAULT now()
);
ALTER TABLE banners ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view active banners"
  ON banners FOR SELECT
  USING (is_active = true);

CREATE POLICY "Admin can manage banners"
  ON banners FOR INSERT TO authenticated
  WITH CHECK (EXISTS (SELECT 1 FROM profiles p WHERE p.id = auth.uid() AND p.role = 'admin'));

CREATE POLICY "Admin can update banners"
  ON banners FOR UPDATE TO authenticated
  USING (EXISTS (SELECT 1 FROM profiles p WHERE p.id = auth.uid() AND p.role = 'admin'))
  WITH CHECK (EXISTS (SELECT 1 FROM profiles p WHERE p.id = auth.uid() AND p.role = 'admin'));

CREATE POLICY "Admin can delete banners"
  ON banners FOR DELETE TO authenticated
  USING (EXISTS (SELECT 1 FROM profiles p WHERE p.id = auth.uid() AND p.role = 'admin'));

-- AI SESSIONS LOG
CREATE TABLE IF NOT EXISTS ai_sessions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  tool_type text NOT NULL CHECK (tool_type IN ('quiz','story','chatbot','voice')),
  input_data jsonb DEFAULT '{}',
  output_data jsonb DEFAULT '{}',
  created_at timestamptz DEFAULT now()
);
ALTER TABLE ai_sessions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own ai sessions"
  ON ai_sessions FOR SELECT TO authenticated
  USING (user_id = auth.uid() OR EXISTS (SELECT 1 FROM profiles p WHERE p.id = auth.uid() AND p.role = 'admin'));

CREATE POLICY "Users can insert ai sessions"
  ON ai_sessions FOR INSERT TO authenticated
  WITH CHECK (user_id = auth.uid());

-- INDEXES for performance
CREATE INDEX IF NOT EXISTS idx_courses_grade_level ON courses(grade_level);
CREATE INDEX IF NOT EXISTS idx_courses_faculty_id ON courses(faculty_id);
CREATE INDEX IF NOT EXISTS idx_enrollments_student ON enrollments(student_id);
CREATE INDEX IF NOT EXISTS idx_progress_student ON progress(student_id);
CREATE INDEX IF NOT EXISTS idx_payments_user ON payments(user_id);
CREATE INDEX IF NOT EXISTS idx_content_course ON content_items(course_id);
CREATE INDEX IF NOT EXISTS idx_live_classes_host ON live_classes(host_id);
CREATE INDEX IF NOT EXISTS idx_live_classes_scheduled ON live_classes(scheduled_at);

-- Seed initial banners
INSERT INTO banners (title, subtitle, image_url, link_url, order_index) VALUES
  ('Welcome to Dream Learn', 'Learn Towards Success - Quality Education for Every Child', 'https://images.pexels.com/photos/5212345/pexels-photo-5212345.jpeg?auto=compress&cs=tinysrgb&w=1200', '#courses', 1),
  ('AI-Powered Learning', 'Experience the future of education with our AI tools', 'https://images.pexels.com/photos/8386434/pexels-photo-8386434.jpeg?auto=compress&cs=tinysrgb&w=1200', '#features', 2),
  ('Nursery to Grade 5', 'Complete curriculum designed by expert educators', 'https://images.pexels.com/photos/5905709/pexels-photo-5905709.jpeg?auto=compress&cs=tinysrgb&w=1200', '#courses', 3)
ON CONFLICT DO NOTHING;
