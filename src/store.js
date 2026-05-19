// ─────────────────────────────────────────────
// In-memory user store & auth helpers
// In a real app this would hit a backend API.
// ─────────────────────────────────────────────

// Seed accounts so login always has something to test against
const SEED_USERS = [
  {
    id: 'u1',
    name: 'Alex Johnson',
    email: 'student@school.edu',
    password: 'password123',
    role: 'student',
    enrolledClassIds: [1, 3],
    activity: [
      { type: 'enroll', classId: 1, className: 'Calculus II', ts: Date.now() - 86400000 * 2 },
      { type: 'enroll', classId: 3, className: 'World History', ts: Date.now() - 86400000 },
    ],
  },
  {
    id: 'u2',
    name: 'Prof. Elena Markov',
    email: 'teacher@school.edu',
    password: 'teach2026',
    role: 'teacher',
    enrolledClassIds: [],
    activity: [],
  },
];

// ALL_CLASSES is the course catalogue (not per-student)
export const ALL_CLASSES = [
  { id: 1, subject: 'Mathematics', title: 'Calculus II', teacher: 'Prof. Elena Markov', teacherId: 'u2', schedule: 'Mon / Wed / Fri — 9:00 AM', room: 'Hall B-201', color: '#2d6a4f', seats: 30, image: 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=600&q=80', description: 'Covers integration techniques, sequences, series, and multivariable calculus.' },
  { id: 2, subject: 'Biology', title: 'Cell Biology', teacher: 'Dr. James Okafor', teacherId: null, schedule: 'Tue / Thu — 11:00 AM', room: 'Lab C-104', color: '#2980b9', seats: 24, image: 'https://images.unsplash.com/photo-1530026405186-ed1f139313f8?w=600&q=80', description: 'Study of cell structure, function, and molecular processes in living systems.' },
  { id: 3, subject: 'History', title: 'World History', teacher: 'Ms. Priya Nair', teacherId: null, schedule: 'Mon / Wed — 1:00 PM', room: 'Hall A-310', color: '#8e44ad', seats: 35, image: 'https://images.unsplash.com/photo-1461360370896-922624d12aa1?w=600&q=80', description: 'Survey of major civilizations and global events from antiquity to the modern era.' },
  { id: 4, subject: 'Computer Science', title: 'Data Structures', teacher: 'Prof. Liu Chen', teacherId: null, schedule: 'Tue / Thu / Fri — 2:00 PM', room: 'Tech Lab 07', color: '#e67e22', seats: 20, image: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=600&q=80', description: 'Arrays, linked lists, trees, graphs, hashing, and algorithm complexity.' },
  { id: 5, subject: 'English', title: 'English Composition', teacher: 'Dr. Sarah Wells', teacherId: null, schedule: 'Mon / Fri — 10:00 AM', room: 'Hall D-115', color: '#c0392b', seats: 28, image: 'https://images.unsplash.com/photo-1455390582262-044cdead277a?w=600&q=80', description: 'Academic writing, argumentation, research methods, and peer review.' },
  { id: 6, subject: 'Physics', title: 'Mechanics & Waves', teacher: 'Prof. Ahmed Siad', teacherId: null, schedule: 'Wed / Fri — 3:00 PM', room: 'Lab P-202', color: '#16a085', seats: 22, image: 'https://images.unsplash.com/photo-1636466497217-26a8cbeaf0aa?w=600&q=80', description: 'Newtonian mechanics, oscillations, wave phenomena, and introductory thermodynamics.' },
  { id: 7, subject: 'Psychology', title: 'Intro to Psychology', teacher: 'Dr. Amara Diallo', teacherId: null, schedule: 'Tue / Thu — 9:00 AM', room: 'Hall E-202', color: '#d35400', seats: 40, image: 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=600&q=80', description: 'Foundational concepts in human behavior, cognition, development, and mental health.' },
  { id: 8, subject: 'Chemistry', title: 'Organic Chemistry', teacher: 'Prof. Nina Volkov', teacherId: null, schedule: 'Mon / Wed / Fri — 2:00 PM', room: 'Lab Q-301', color: '#1a5276', seats: 18, image: 'https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?w=600&q=80', description: 'Structure, properties, and reactions of organic compounds and mechanisms.' },
];

// Mutable registry (lives for the session)
let _users = [...SEED_USERS];

export function getUsers() { return _users; }

export function findUser(email) {
  return _users.find(u => u.email.toLowerCase() === email.toLowerCase());
}

export function registerUser({ name, email, password, role }) {
  if (findUser(email)) return { error: 'An account with this email already exists.' };
  if (password.length < 6) return { error: 'Password must be at least 6 characters.' };
  const user = {
    id: 'u' + Date.now(),
    name,
    email,
    password,
    role,
    enrolledClassIds: [],
    activity: [],
  };
  _users = [..._users, user];
  return { user };
}

export function loginUser(email, password) {
  const user = findUser(email);
  if (!user) return { error: 'No account found with that email.' };
  if (user.password !== password) return { error: 'Incorrect password.' };
  return { user };
}

// Returns a mutable ref to the user object so mutations persist in session
export function getUserById(id) {
  return _users.find(u => u.id === id);
}

export function enrollUserInClass(userId, classId) {
  const user = getUserById(userId);
  if (!user) return;
  if (!user.enrolledClassIds.includes(classId)) {
    user.enrolledClassIds = [...user.enrolledClassIds, classId];
    const cls = ALL_CLASSES.find(c => c.id === classId);
    user.activity = [
      { type: 'enroll', classId, className: cls?.title ?? 'Class', ts: Date.now() },
      ...user.activity,
    ];
  }
}

export function unenrollUserFromClass(userId, classId) {
  const user = getUserById(userId);
  if (!user) return;
  user.enrolledClassIds = user.enrolledClassIds.filter(id => id !== classId);
  user.activity = user.activity.filter(a => !(a.type === 'enroll' && a.classId === classId));
}

// avatar is a base64 data-URL string; null = show initials fallback
export function updateUserAvatar(userId, dataUrl) {
  const user = getUserById(userId);
  if (!user) return;
  user.avatar = dataUrl;
}