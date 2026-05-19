const User = require('../models/User');
const { getAllClasses } = require('../models/User');

async function register(req, res) {
  try {
    const { name, email, password, role } = req.body;

    if (!name || !email || !password || !role) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const result = await User.registerUser({ name, email, password, role });

    if (result.error) {
      return res.status(400).json({ error: result.error });
    }

    res.json({
      success: true,
      message: 'Registration successful',
      user: result.user,
    });
  } catch (error) {
    console.error('Error registering user:', error);
    res.status(500).json({ error: 'Registration failed' });
  }
}

async function login(req, res) {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    const result = await User.loginUser(email, password);

    if (result.error) {
      return res.status(401).json({ error: result.error });
    }

    res.json({
      success: true,
      message: 'Login successful',
      user: result.user,
    });
  } catch (error) {
    console.error('Error logging in:', error);
    res.status(500).json({ error: 'Login failed' });
  }
}

async function getUserById(req, res) {
  try {
    const { userId } = req.params;

    const user = await User.getUserById(userId);

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json(user);
  } catch (error) {
    console.error('Error fetching user:', error);
    res.status(500).json({ error: 'Failed to fetch user' });
  }
}

async function getAllUsers(req, res) {
  try {
    const users = await User.getUsers();
    res.json(users);
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ error: 'Failed to fetch users' });
  }
}

async function enrollInClass(req, res) {
  try {
    const { userId, classId } = req.body;

    if (!userId || !classId) {
      return res.status(400).json({ error: 'Missing userId or classId' });
    }

    await User.enrollUserInClass(userId, classId);
    const updatedUser = await User.getUserById(userId);

    res.json({
      success: true,
      message: 'Enrolled successfully',
      user: updatedUser,
    });
  } catch (error) {
    console.error('Error enrolling user:', error);
    res.status(500).json({ error: 'Failed to enroll user' });
  }
}

async function unenrollFromClass(req, res) {
  try {
    const { userId, classId } = req.body;

    if (!userId || !classId) {
      return res.status(400).json({ error: 'Missing userId or classId' });
    }

    await User.unenrollUserFromClass(userId, classId);
    const updatedUser = await User.getUserById(userId);

    res.json({
      success: true,
      message: 'Unenrolled successfully',
      user: updatedUser,
    });
  } catch (error) {
    console.error('Error unenrolling user:', error);
    res.status(500).json({ error: 'Failed to unenroll user' });
  }
}

async function getClasses(req, res) {
  try {
    const classes = await getAllClasses();
    res.json(classes);
  } catch (error) {
    console.error('Error fetching classes:', error);
    res.status(500).json({ error: 'Failed to fetch classes' });
  }
}

module.exports = {
  register,
  login,
  getUserById,
  getAllUsers,
  enrollInClass,
  unenrollFromClass,
  getClasses,
};
