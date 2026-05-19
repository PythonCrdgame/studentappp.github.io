const { getDB, ObjectId } = require('./db');

// Create attendance record or update if exists
async function markAttendance({ studentId, classId, date, status }) {
  const db = getDB();
  const attendanceCollection = db.collection('attendance');
  
  // Ensure date is start of day
  const attendanceDate = new Date(date);
  attendanceDate.setHours(0, 0, 0, 0);

  const existingRecord = await attendanceCollection.findOne({
    studentId,
    classId,
    date: attendanceDate,
  });

  if (existingRecord) {
    await attendanceCollection.updateOne(
      { _id: existingRecord._id },
      { $set: { status, updatedAt: new Date() } }
    );
    return existingRecord;
  } else {
    const result = await attendanceCollection.insertOne({
      studentId,
      classId,
      date: attendanceDate,
      status, // 'present' or 'absent'
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    return { _id: result.insertedId, studentId, classId, date: attendanceDate, status };
  }
}

// Get attendance for a specific student and class
async function getStudentAttendance(studentId, classId) {
  const db = getDB();
  return await db
    .collection('attendance')
    .find({ studentId, classId })
    .sort({ date: -1 })
    .toArray();
}

// Get all attendance for a class on a specific date
async function getClassAttendanceByDate(classId, date) {
  const db = getDB();
  const attendanceDate = new Date(date);
  attendanceDate.setHours(0, 0, 0, 0);

  return await db
    .collection('attendance')
    .find({
      classId,
      date: attendanceDate,
    })
    .toArray();
}

// Get attendance summary for a class (all dates)
async function getClassAttendanceSummary(classId) {
  const db = getDB();
  return await db
    .collection('attendance')
    .find({ classId })
    .sort({ date: -1 })
    .toArray();
}

// Get attendance for teacher's classes on a specific date
async function getTeacherAttendanceByDate(teacherId, date) {
  const db = getDB();
  const { getAllClasses } = require('./User');
  
  const allClasses = await getAllClasses();
  const teacherClassIds = allClasses
    .filter(c => c.teacherId === teacherId)
    .map(c => c.id);

  const attendanceDate = new Date(date);
  attendanceDate.setHours(0, 0, 0, 0);

  return await db
    .collection('attendance')
    .find({
      classId: { $in: teacherClassIds },
      date: attendanceDate,
    })
    .toArray();
}

// Get attendance stats for a student
async function getStudentAttendanceStats(studentId, classId) {
  const db = getDB();
  const attendance = await db
    .collection('attendance')
    .find({ studentId, classId })
    .toArray();

  const present = attendance.filter(a => a.status === 'present').length;
  const absent = attendance.filter(a => a.status === 'absent').length;
  const total = attendance.length;

  return {
    studentId,
    classId,
    present,
    absent,
    total,
    percentage: total > 0 ? ((present / total) * 100).toFixed(2) : 0,
  };
}

module.exports = {
  markAttendance,
  getStudentAttendance,
  getClassAttendanceByDate,
  getClassAttendanceSummary,
  getTeacherAttendanceByDate,
  getStudentAttendanceStats,
};
