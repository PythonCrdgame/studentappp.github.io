const express = require('express');
const router = express.Router();
const attendanceController = require('../controllers/attendanceController');

// POST: Mark attendance (student marks present/absent)
router.post('/mark', attendanceController.markAttendance);

// GET: Get all attendance for a class on a specific date
router.get('/class/date', attendanceController.getClassAttendanceByDate);

// GET: Get attendance summary for a class (all records)
router.get('/class/:classId', attendanceController.getClassAttendanceSummary);

// GET: Get attendance for a specific student in a class
router.get('/student/:studentId/class/:classId', attendanceController.getStudentAttendance);

// GET: Get attendance stats for a student in a class
router.get('/stats/:studentId/class/:classId', attendanceController.getStudentAttendanceStats);

// GET: Get all attendance for a teacher's classes on a specific date
router.get('/teacher/:teacherId', attendanceController.getTeacherAttendanceByDate);

module.exports = router;
