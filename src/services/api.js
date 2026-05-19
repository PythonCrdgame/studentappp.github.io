// API service for communicating with the backend
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

function normalizeUser(user) {
  if (!user) return user;
  return {
    ...user,
    id: user.id || user._id,
  };
}

function normalizeUsers(users) {
  if (!Array.isArray(users)) return users;
  return users.map(normalizeUser);
}

// Attendance endpoints
export async function markAttendance(studentId, classId, date, status) {
  try {
    const response = await fetch(`${API_URL}/attendance/mark`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ studentId, classId, date, status }),
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.error);
    return data;
  } catch (error) {
    console.error('Error marking attendance:', error);
    throw error;
  }
}

export async function getClassAttendanceByDate(classId, date) {
  try {
    const response = await fetch(
      `${API_URL}/attendance/class/date?classId=${classId}&date=${date}`
    );
    const data = await response.json();
    if (!response.ok) throw new Error(data.error);
    return data;
  } catch (error) {
    console.error('Error fetching attendance:', error);
    throw error;
  }
}

export async function getClassAttendanceSummary(classId) {
  try {
    const response = await fetch(`${API_URL}/attendance/class/${classId}`);
    const data = await response.json();
    if (!response.ok) throw new Error(data.error);
    return data;
  } catch (error) {
    console.error('Error fetching attendance summary:', error);
    throw error;
  }
}

export async function getStudentAttendance(studentId, classId) {
  try {
    const response = await fetch(
      `${API_URL}/attendance/student/${studentId}/class/${classId}`
    );
    const data = await response.json();
    if (!response.ok) throw new Error(data.error);
    return data;
  } catch (error) {
    console.error('Error fetching student attendance:', error);
    throw error;
  }
}

export async function getStudentAttendanceStats(studentId, classId) {
  try {
    const response = await fetch(
      `${API_URL}/attendance/stats/${studentId}/class/${classId}`
    );
    const data = await response.json();
    if (!response.ok) throw new Error(data.error);
    return data;
  } catch (error) {
    console.error('Error fetching attendance stats:', error);
    throw error;
  }
}

export async function getTeacherAttendanceByDate(teacherId, date) {
  try {
    const response = await fetch(
      `${API_URL}/attendance/teacher/${teacherId}?date=${date}`
    );
    const data = await response.json();
    if (!response.ok) throw new Error(data.error);
    return data;
  } catch (error) {
    console.error('Error fetching teacher attendance:', error);
    throw error;
  }
}

// User endpoints
export async function login(email, password) {
  try {
    const response = await fetch(`${API_URL}/users/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.error);
    return { ...data, user: normalizeUser(data.user) };
  } catch (error) {
    console.error('Error logging in:', error);
    throw error;
  }
}

export async function register(name, email, password, role) {
  try {
    const response = await fetch(`${API_URL}/users/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, password, role }),
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.error);
    return { ...data, user: normalizeUser(data.user) };
  } catch (error) {
    console.error('Error registering:', error);
    throw error;
  }
}

export async function getUserById(userId) {
  try {
    const response = await fetch(`${API_URL}/users/${userId}`);
    const data = await response.json();
    if (!response.ok) throw new Error(data.error);
    return normalizeUser(data);
  } catch (error) {
    console.error('Error fetching user:', error);
    throw error;
  }
}

export async function getAllUsers() {
  try {
    const response = await fetch(`${API_URL}/users/all`);
    const data = await response.json();
    if (!response.ok) throw new Error(data.error);
    return normalizeUsers(data);
  } catch (error) {
    console.error('Error fetching users:', error);
    throw error;
  }
}

export async function enrollInClass(userId, classId) {
  try {
    const response = await fetch(`${API_URL}/users/enroll`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId, classId }),
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.error);
    return data;
  } catch (error) {
    console.error('Error enrolling:', error);
    throw error;
  }
}

export async function unenrollFromClass(userId, classId) {
  try {
    const response = await fetch(`${API_URL}/users/unenroll`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId, classId }),
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.error);
    return data;
  } catch (error) {
    console.error('Error unenrolling:', error);
    throw error;
  }
}

export async function getClasses() {
  try {
    const response = await fetch(`${API_URL}/users/classes/all`);
    const data = await response.json();
    if (!response.ok) throw new Error(data.error);
    return data;
  } catch (error) {
    console.error('Error fetching classes:', error);
    throw error;
  }
}
