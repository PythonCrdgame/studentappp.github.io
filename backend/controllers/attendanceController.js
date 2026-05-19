const Attendance = require('../models/Attendance');
const User = require('../models/User');

// Mark attendance (student marks themselves present/absent)
async function markAttendance(req, res) {
  try {
    const { studentId, classId, date, status } = req.body;

    if (!studentId || !classId || !date || !status) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    if (!['present', 'absent'].includes(status)) {
      return res.status(400).json({ error: 'Status must be "present" or "absent"' });
    }

    const attendance = await Attendance.markAttendance({
      studentId,
      classId,
      date,
      status,
    });

    res.json({
      success: true,
      message: `Marked ${status} for ${date}`,
      attendance,
    });
  } catch (error) {
    console.error('Error marking attendance:', error);
    res.status(500).json({ error: 'Failed to mark attendance' });
  }
}

// Get attendance for a specific class on a date
async function getClassAttendanceByDate(req, res) {
  try {
    const { classId, date } = req.query;

    if (!classId || !date) {
      return res.status(400).json({ error: 'Missing classId or date' });
    }

    const attendance = await Attendance.getClassAttendanceByDate(
      parseInt(classId),
      date
    );

    res.json({
      classId: parseInt(classId),
      date,
      attendance,
    });
  } catch (error) {
    console.error('Error fetching attendance:', error);
    res.status(500).json({ error: 'Failed to fetch attendance' });
  }
}

// Get all attendance for a class
async function getClassAttendanceSummary(req, res) {
  try {
    const { classId } = req.params;

    const attendance = await Attendance.getClassAttendanceSummary(
      parseInt(classId)
    );

    res.json({
      classId: parseInt(classId),
      attendance,
    });
  } catch (error) {
    console.error('Error fetching attendance summary:', error);
    res.status(500).json({ error: 'Failed to fetch attendance summary' });
  }
}

// Get student's attendance for a class
async function getStudentAttendance(req, res) {
  try {
    const { studentId, classId } = req.params;

    const attendance = await Attendance.getStudentAttendance(
      studentId,
      parseInt(classId)
    );

    res.json({
      studentId,
      classId: parseInt(classId),
      attendance,
    });
  } catch (error) {
    console.error('Error fetching student attendance:', error);
    res.status(500).json({ error: 'Failed to fetch student attendance' });
  }
}

// Get attendance stats for a student
async function getStudentAttendanceStats(req, res) {
  try {
    const { studentId, classId } = req.params;

    const stats = await Attendance.getStudentAttendanceStats(
      studentId,
      parseInt(classId)
    );

    res.json(stats);
  } catch (error) {
    console.error('Error fetching attendance stats:', error);
    res.status(500).json({ error: 'Failed to fetch attendance stats' });
  }
}

// Get teacher's attendance view (all their classes for a date)
async function getTeacherAttendanceByDate(req, res) {
  try {
    const { teacherId } = req.params;
    const { date } = req.query;

    if (!date) {
      return res.status(400).json({ error: 'Missing date parameter' });
    }

    const attendance = await Attendance.getTeacherAttendanceByDate(
      teacherId,
      date
    );

    res.json({
      teacherId,
      date,
      attendance,
    });
  } catch (error) {
    console.error('Error fetching teacher attendance:', error);
    res.status(500).json({ error: 'Failed to fetch teacher attendance' });
  }
}

module.exports = {
  markAttendance,
  getClassAttendanceByDate,
  getClassAttendanceSummary,
  getStudentAttendance,
  getStudentAttendanceStats,
  getTeacherAttendanceByDate,
};
