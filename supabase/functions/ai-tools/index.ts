import "jsr:@supabase/functions-js/edge-runtime.d.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

const GRADE_VOCAB: Record<string, string> = {
  nursery: "very simple words, 1-2 sentence explanations, fun and playful tone",
  junior_kg: "simple words, short sentences, playful and encouraging",
  senior_kg: "basic vocabulary, short paragraphs, friendly tone",
  grade_1: "easy vocabulary, simple concepts, positive and encouraging",
  grade_2: "grade 2 vocabulary, clear explanations, supportive tone",
  grade_3: "grade 3 level, moderate complexity, informative",
  grade_4: "grade 4 level, detailed explanations, academic but friendly",
  grade_5: "grade 5 level, comprehensive answers, educational",
};

function generateQuizFallback(topic: string, grade: string, count = 5) {
  const topics: Record<string, Array<{ question: string; options: string[]; answer: number }>> = {
    maths: [
      { question: "What is 7 + 5?", options: ["10", "11", "12", "13"], answer: 2 },
      { question: "What is 8 × 3?", options: ["21", "22", "24", "26"], answer: 2 },
      { question: "What is 15 - 7?", options: ["6", "7", "8", "9"], answer: 2 },
      { question: "What is 20 ÷ 4?", options: ["3", "4", "5", "6"], answer: 2 },
      { question: "Which is the largest number?", options: ["47", "74", "44", "77"], answer: 3 },
    ],
    english: [
      { question: "Which of these is a noun?", options: ["Run", "Happy", "Cat", "Quickly"], answer: 2 },
      { question: "What is the plural of 'child'?", options: ["Childs", "Childes", "Children", "Childrens"], answer: 2 },
      { question: "Which is a vowel?", options: ["B", "C", "D", "E"], answer: 3 },
      { question: "What is the opposite of 'hot'?", options: ["Warm", "Cold", "Dry", "Wet"], answer: 1 },
      { question: "Which sentence is correct?", options: ["He go to school.", "She goes to school.", "They goes to school.", "I goes to school."], answer: 1 },
    ],
    science: [
      { question: "What do plants need to make food?", options: ["Darkness", "Sunlight", "Sand", "Salt"], answer: 1 },
      { question: "Which animal is a mammal?", options: ["Snake", "Frog", "Dog", "Eagle"], answer: 2 },
      { question: "What is the largest planet in our solar system?", options: ["Earth", "Mars", "Jupiter", "Saturn"], answer: 2 },
      { question: "What gas do plants release during photosynthesis?", options: ["Carbon dioxide", "Nitrogen", "Oxygen", "Hydrogen"], answer: 2 },
      { question: "How many bones does an adult human body have?", options: ["106", "206", "306", "406"], answer: 1 },
    ],
    default: [
      { question: "Which continent is India located in?", options: ["Africa", "Europe", "Asia", "America"], answer: 2 },
      { question: "What is the capital of India?", options: ["Mumbai", "Kolkata", "New Delhi", "Chennai"], answer: 2 },
      { question: "How many days are there in a week?", options: ["5", "6", "7", "8"], answer: 2 },
      { question: "Which is the tallest mountain in the world?", options: ["K2", "Everest", "Kilimanjaro", "Alps"], answer: 1 },
      { question: "What color is the sun?", options: ["Orange", "Red", "Yellow-white", "Blue"], answer: 2 },
    ],
  };

  const t = topic.toLowerCase();
  let pool = topics.default;
  if (t.includes("math") || t.includes("arithmetic") || t.includes("number")) pool = topics.maths;
  else if (t.includes("english") || t.includes("grammar") || t.includes("reading")) pool = topics.english;
  else if (t.includes("science") || t.includes("biology") || t.includes("physics")) pool = topics.science;

  const shuffled = [...pool].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, Math.min(count, shuffled.length));
}

function generateStoryFallback(topic: string, grade: string) {
  const stories = [
    {
      title: "The Curious Little Star",
      text: `Once upon a time, high up in the night sky, there lived a curious little star named Twinkle. Twinkle loved to ask questions about everything.

"Why is the sky dark at night?" Twinkle asked the Moon one evening.

The Moon smiled gently and said, "Because that is when we get to shine! During the day, the Sun lights up the sky, but at night, it is our turn."

Twinkle thought about this and said, "So we all have our own special time to be important?"

"Exactly!" said the Moon. "Just like how you study during the day and sleep at night — everything has its right time."

From that day on, Twinkle never felt sad about the darkness. Instead, the star shone even brighter, knowing that every moment was exactly the right moment to be your best.

The lesson: Everything and everyone has a special time to shine. Be patient, work hard, and your time will come!`,
    },
    {
      title: "The Magic Book",
      text: `Arjun found an old book in the library corner that nobody had touched in years. When he opened it, the pages glowed with golden light!

"Who are you?" Arjun whispered.

"I am Knowledge," said the book. "I have been waiting for a curious child like you."

Arjun began to read. He learned about distant planets, about the tiny cells in our bodies, about ancient kings and brave queens. Every page took him on a new adventure.

When he finally closed the book, Arjun looked up and saw the world differently. The clouds reminded him of weather patterns. The plants reminded him of photosynthesis. The birds reminded him of migration.

"Learning changed the way I see everything!" Arjun told his mother that evening.

His mother smiled. "That is the real magic of knowledge — it does not just fill your head, it opens your eyes."

Remember: Every book you read is an adventure waiting to happen. Never stop being curious!`,
    },
    {
      title: "The Brave Little Seedling",
      text: `A tiny seed was planted in dark soil. It was scared. "It is so dark and cold down here," the seed thought. "I want to give up."

But deep inside, the seed had a dream — to grow tall and reach the sunshine.

So it pushed. Day after day, the little seed stretched its roots deeper and its stem higher. Rain fell. The sun warmed the earth. The seed worked harder than ever.

Then one beautiful morning, a tiny green shoot broke through the soil and felt sunlight for the first time.

"You made it!" sang the flowers around it.

The little seedling swayed in the breeze and said, "I almost gave up. But I am so glad I did not."

Just like the seed, learning can feel hard and scary at first. But if you keep trying, keep pushing, keep believing — one day you will break through and grow tall in the sunshine of success!`,
    },
  ];

  const chosen = stories[Math.floor(Math.random() * stories.length)];
  return chosen.text;
}

function generateChatFallback(message: string) {
  const msg = message.toLowerCase();

  if (msg.includes("hello") || msg.includes("hi") || msg.includes("hey"))
    return "Hello! Great to see you here! I am your Dream Learn AI Tutor. What subject would you like help with today?";

  if (msg.includes("math") || msg.includes("addition") || msg.includes("subtract"))
    return "Maths is all about patterns! For addition, try counting objects. For subtraction, imagine taking items away from a group. Would you like me to give you a practice problem?";

  if (msg.includes("english") || msg.includes("grammar") || msg.includes("sentence"))
    return "English is wonderful! Every sentence needs a subject (who/what) and a verb (action). For example: 'The cat runs.' Cat is the subject, runs is the verb. What topic in English would you like to explore?";

  if (msg.includes("science") || msg.includes("plant") || msg.includes("animal"))
    return "Science is the study of the world around us! Plants make their food through photosynthesis — they use sunlight, water, and carbon dioxide. Animals get energy by eating. Which science topic interests you most?";

  if (msg.includes("story") || msg.includes("read"))
    return "Reading stories is one of the best ways to learn! Stories teach us vocabulary, imagination, and important life lessons. Have you tried our AI Story Generator? It can create a personalized story just for you!";

  if (msg.includes("quiz") || msg.includes("test") || msg.includes("exam"))
    return "Practice makes perfect! Our AI Quiz Generator can create custom quizzes on any topic. Regular practice with quizzes helps you remember information better. Want me to suggest some topics to quiz yourself on?";

  if (msg.includes("help"))
    return "I am here to help! I can answer questions about Maths, English, Science, Social Studies, and more. I can also explain concepts, help with homework questions, and suggest fun ways to learn. What do you need help with?";

  return `Great question! "${message}" is an interesting topic to explore. In education, we learn by asking questions just like you are doing. Keep being curious! The more questions you ask, the more you will learn. Would you like me to explain anything specific about this topic?`;
}

function generateQuestionsFallback(topic: string, grade: string, count: number) {
  const questions = [];
  for (let i = 0; i < count; i++) {
    questions.push({
      question: `Question ${i + 1}: What is the main concept of ${topic} related to ${grade}?`,
      options: [
        `It describes the fundamental principle`,
        `It explains a secondary concept`,
        `It represents an alternative approach`,
        `It contradicts the main idea`
      ],
      answer: 0,
    });
  }
  return questions;
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 200, headers: corsHeaders });
  }

  try {
    const body = await req.json();
    const { tool, topic = "", grade = "grade_3", count = 5, message = "" } = body;

    const ANTHROPIC_KEY = Deno.env.get("ANTHROPIC_API_KEY");

    if (ANTHROPIC_KEY) {
      // Use Claude API
      const systemPrompts: Record<string, string> = {
        quiz: `You are an educational quiz generator for children. Generate ${count} MCQ questions about "${topic}" for ${grade} level students (${GRADE_VOCAB[grade] || "age-appropriate"}).
Return ONLY valid JSON in this exact format:
{"questions":[{"question":"...","options":["A","B","C","D"],"answer":0}]}
The "answer" field is the 0-based index of the correct option. Generate exactly ${count} questions.`,
        story: `You are a children's story writer. Write an educational, engaging story about "${topic}" for ${grade} students.
Use ${GRADE_VOCAB[grade] || "age-appropriate"} language.
The story should be 3-5 paragraphs, have a clear moral lesson, and be positive and inspiring.
Return ONLY valid JSON: {"story":"..."}`,
        chat: `You are a friendly, encouraging AI tutor for children. Answer the student's question clearly and simply.
Use ${GRADE_VOCAB[grade] || "child-friendly"} language. Be warm, supportive, and educational.
Keep the answer under 100 words. Return ONLY valid JSON: {"reply":"..."}`,
        questions: `You are an exam question generator for teachers. Generate ${count} MCQ questions about "${topic}" for ${grade} level.
Questions should test comprehension and application. Return ONLY valid JSON:
{"questions":[{"question":"...","options":["A","B","C","D"],"answer":0}]}
The "answer" field is the 0-based index of correct option.`,
        voice: `You are a voice instructor speaking as ${body.character || "a friendly teacher"}. Create a short spoken lesson about "${topic}". Keep it under 150 words, enthusiastic and child-friendly. Return ONLY valid JSON: {"script":"..."}`,
      };

      const userContent = tool === "chat" ? message : `Topic: ${topic}, Grade: ${grade}`;

      const response = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": ANTHROPIC_KEY,
          "anthropic-version": "2023-06-01",
        },
        body: JSON.stringify({
          model: "claude-haiku-4-5",
          max_tokens: 1024,
          system: systemPrompts[tool] || systemPrompts.chat,
          messages: [{ role: "user", content: userContent }],
        }),
      });

      if (response.ok) {
        const data = await response.json();
        const text = data.content[0].text.trim();
        try {
          const parsed = JSON.parse(text);
          return new Response(JSON.stringify(parsed), {
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          });
        } catch {
          // Fall through to fallback
        }
      }
    }

    // Fallback responses when no API key or error
    let result: Record<string, unknown> = {};
    if (tool === "quiz") result = { questions: generateQuizFallback(topic, grade, count) };
    else if (tool === "story") result = { story: generateStoryFallback(topic, grade) };
    else if (tool === "chat") result = { reply: generateChatFallback(message) };
    else if (tool === "questions") result = { questions: generateQuestionsFallback(topic, grade, count) };
    else if (tool === "voice") result = { script: `Hello! Today we are going to learn about ${topic}. This is a really exciting topic! Let us explore it together step by step. Remember, learning is an adventure and you are doing great!` };
    else result = { error: "Unknown tool", message: "Supported tools: quiz, story, chat, questions, voice" };

    return new Response(JSON.stringify(result), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    return new Response(
      JSON.stringify({ error: "Internal error", message: String(error) }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
