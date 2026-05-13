import prisma from '../utils/db.js';

export const createSession = async (req, res) => {
  try {
    const { courseId, date, records } = req.body; // records: [{ studentId, status }]

    const teacher = await prisma.teacher.findUnique({ where: { userId: req.user.id } });
    if (!teacher && req.user.role !== 'SUPERADMIN') return res.status(403).json({ success: false, error: 'Unauthorized' });
    const teacherId = teacher ? teacher.id : req.body.teacherId;

    const session = await prisma.attendanceSession.create({
      data: {
        courseId,
        date: new Date(date),
        teacherId,
        records: {
          create: records.map(r => ({
            studentId: r.studentId,
            status: r.status
          }))
        }
      },
      include: { records: true }
    });

    res.status(201).json({ success: true, data: session });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: 'Failed to create attendance session' });
  }
};

export const getCourseSessions = async (req, res) => {
  try {
    const { courseId } = req.params;
    const sessions = await prisma.attendanceSession.findMany({
      where: { courseId },
      include: { 
        records: {
          include: { student: { include: { user: { select: { name: true } } } } }
        } 
      },
      orderBy: { date: 'desc' }
    });
    res.status(200).json({ success: true, data: sessions });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: 'Failed to fetch sessions' });
  }
};

export const updateRecord = async (req, res) => {
  try {
    const { recordId } = req.params;
    const { status } = req.body;

    const record = await prisma.attendanceRecord.update({
      where: { id: recordId },
      data: { status }
    });

    res.status(200).json({ success: true, data: record });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: 'Failed to update record' });
  }
};

export const getStudentAttendance = async (req, res) => {
  try {
    const student = await prisma.student.findUnique({ where: { userId: req.user.id } });
    if (!student) return res.status(403).json({ success: false, error: 'Unauthorized' });

    const records = await prisma.attendanceRecord.findMany({
      where: { studentId: student.id },
      include: { 
        session: { include: { course: { select: { title: true } } } } 
      },
      orderBy: { session: { date: 'desc' } }
    });

    res.status(200).json({ success: true, data: records });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: 'Failed to fetch attendance' });
  }
};
