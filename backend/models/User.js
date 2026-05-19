const { getDB, ObjectId } = require('./db');

// Create initial seed data if empty
async function seedInitialData() {
  const db = getDB();
  const usersCollection = db.collection('users');
  const classesCollection = db.collection('classes');

  // Check if users already exist
  const userCount = await usersCollection.countDocuments();
  if (userCount === 0) {
    const seedUsers = [
      {
        _id: 'u1',
        name: 'Alex Johnson',
        email: 'student@school.edu',
        password: 'password123',
        role: 'student',
        enrolledClassIds: [1, 3],
        activity: [
          { type: 'enroll', classId: 1, className: 'Calculus II', ts: new Date(Date.now() - 86400000 * 2) },
          { type: 'enroll', classId: 3, className: 'World History', ts: new Date(Date.now() - 86400000) },
        ],
      },
      {
        _id: 'u2',
        name: 'Prof. Elena Markov',
        email: 'teacher@school.edu',
        password: 'teach2026',
        role: 'teacher',
        enrolledClassIds: [],
        activity: [],
      },
    ];
    await usersCollection.insertMany(seedUsers);
    console.log('Seeded initial users');
  }

  // Check if classes already exist
  const classCount = await classesCollection.countDocuments();
  if (classCount === 0) {
    const seedClasses = [
      { id: 1, subject: 'Mathematics', title: 'Calculus II', teacher: 'Prof. Elena Markov', teacherId: 'u2', schedule: 'Mon / Wed / Fri — 9:00 AM', room: 'Hall B-201', color: '#2d6a4f', seats: 30, image: 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=600&q=80', description: 'Covers integration techniques, sequences, series, and multivariable calculus.' },
      { id: 2, subject: 'Biology', title: 'Cell Biology', teacher: 'Dr. James Okafor', teacherId: null, schedule: 'Tue / Thu — 11:00 AM', room: 'Lab C-104', color: '#2980b9', seats: 24, image: 'https://images.unsplash.com/photo-1530026405186-ed1f139313f8?w=600&q=80', description: 'Study of cell structure, function, and molecular processes in living systems.' },
      { id: 3, subject: 'History', title: 'World History', teacher: 'Ms. Priya Nair', teacherId: null, schedule: 'Mon / Wed — 1:00 PM', room: 'Hall A-310', color: '#8e44ad', seats: 35, image: 'https://images.unsplash.com/photo-1461360370896-922624d12aa1?w=600&q=80', description: 'Survey of major civilizations and global events from antiquity to the modern era.' },
      { id: 4, subject: 'Computer Science', title: 'Data Structures', teacher: 'Prof. Liu Chen', teacherId: null, schedule: 'Tue / Thu / Fri — 2:00 PM', room: 'Tech Lab 07', color: '#e67e22', seats: 20, image: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=600&q=80', description: 'Arrays, linked lists, trees, graphs, hashing, and algorithm complexity.' },
      { id: 5, subject: 'English', title: 'English Composition', teacher: 'Dr. Sarah Wells', teacherId: null, schedule: 'Mon / Fri — 10:00 AM', room: 'Hall D-115', color: '#c0392b', seats: 28, image: 'https://images.unsplash.com/photo-1455390582262-044cdead277a?w=600&q=80', description: 'Academic writing, argumentation, research methods, and peer review.' },
      { id: 6, subject: 'Physics', title: 'Mechanics & Waves', teacher: 'Prof. Ahmed Siad', teacherId: null, schedule: 'Wed / Fri — 3:00 PM', room: 'Lab P-202', color: '#16a085', seats: 22, image: 'https://images.unsplash.com/photo-1636466497217-26a8cbeaf0aa?w=600&q=80', description: 'Newtonian mechanics, oscillations, wave phenomena, and introductory thermodynamics.' },
      { id: 7, subject: 'Psychology', title: 'Intro to Psychology', teacher: 'Dr. Amara Diallo', teacherId: null, schedule: 'Tue / Thu — 9:00 AM', room: 'Hall E-202', color: '#d35400', seats: 40, image: 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=600&q=80', description: 'Foundational concepts in human behavior, cognition, development, and mental health.' },
      { id: 8, subject: 'Chemistry', title: 'Organic Chemistry', teacher: 'Prof. Nina Volkov', teacherId: null, schedule: 'Mon / Wed / Fri — 2:00 PM', room: 'Lab Q-301', color: '#1a5276', seats: 18, image: 'https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?w=600&q=80', description: 'Structure, properties, and reactions of organic compounds and mechanisms.' },
    ];
    await classesCollection.insertMany(seedClasses);
    console.log('Seeded initial classes');
  }
}

// User functions
async function getUserById(userId) {
  const db = getDB();
  return await db.collection('users').findOne({ _id: userId });
}

async function getUsers() {
  const db = getDB();
  return await db.collection('users').find({}).toArray();
}

async function findUser(email) {
  const db = getDB();
  return await db.collection('users').findOne({ email: email.toLowerCase() });
}

async function registerUser({ name, email, password, role }) {
  const db = getDB();
  const existingUser = await findUser(email);
  if (existingUser) return { error: 'An account with this email already exists.' };
  if (password.length < 6) return { error: 'Password must be at least 6 characters.' };
  
  const user = {
    _id: 'u' + Date.now(),
    name,
    email: email.toLowerCase(),
    password,
    role,
    enrolledClassIds: [],
    activity: [],
  };
  await db.collection('users').insertOne(user);
  return { user };
}

async function loginUser(email, password) {
  const user = await findUser(email);
  if (!user) return { error: 'No account found with that email.' };
  if (user.password !== password) return { error: 'Incorrect password.' };
  return { user };
}

// Class functions
async function getAllClasses() {
  const db = getDB();
  return await db.collection('classes').find({}).toArray();
}

async function getClassById(classId) {
  const db = getDB();
  return await db.collection('classes').findOne({ id: classId });
}

// Enrollment functions
async function enrollUserInClass(userId, classId) {
  const db = getDB();
  const user = await getUserById(userId);
  if (!user) return;
  
  if (!user.enrolledClassIds.includes(classId)) {
    const cls = await getClassById(classId);
    await db.collection('users').updateOne(
      { _id: userId },
      {
        $addToSet: { enrolledClassIds: classId },
        $push: {
          activity: {
            type: 'enroll',
            classId,
            className: cls?.title ?? 'Class',
            ts: new Date(),
          },
        },
      }
    );
  }
}

async function unenrollUserFromClass(userId, classId) {
  const db = getDB();
  await db.collection('users').updateOne(
    { _id: userId },
    {
      $pull: {
        enrolledClassIds: classId,
        activity: { type: 'enroll', classId },
      },
    }
  );
}

module.exports = {
  seedInitialData,
  getUserById,
  getUsers,
  findUser,
  registerUser,
  loginUser,
  getAllClasses,
  getClassById,
  enrollUserInClass,
  unenrollUserFromClass,
};
