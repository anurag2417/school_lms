import prisma from '../utils/db.js';

export const createAssignment = async (req, res) => {
  try {
    const { courseId, title, description, dueDate, maxMarks } = req.body;
    
    // Validate teacher
    const teacher = await prisma.teacher.findUnique({ where: { userId: req.user.id } });
    if (!teacher && req.user.role !== 'SUPERADMIN') return res.status(403).json({ success: false, error: 'Unauthorized' });
    const teacherId = teacher ? teacher.id : req.body.teacherId;

    const assignment = await prisma.assignment.create({
      data: { courseId, teacherId, title, description, dueDate: new Date(dueDate), maxMarks: parseInt(maxMarks) }
    });

    res.status(201).json({ success: true, data: assignment });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: 'Failed to create assignment' });
  }
};

export const getAssignmentsByCourse = async (req, res) => {
  try {
    const { courseId } = req.params;
    const assignments = await prisma.assignment.findMany({
      where: { courseId },
      include: {
        submissions: true // Depending on role we might only want to include specific submissions, handled on frontend for MVP
      }
    });
    res.status(200).json({ success: true, data: assignments });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: 'Failed to fetch assignments' });
  }
};

export const submitAssignment = async (req, res) => {
  try {
    const { id } = req.params; // assignmentId
    const { textContent, fileUrl } = req.body;
    
    const student = await prisma.student.findUnique({ where: { userId: req.user.id } });
    if (!student) return res.status(403).json({ success: false, error: 'Only students can submit' });

    const submission = await prisma.submission.upsert({
      where: {
        assignmentId_studentId: { assignmentId: id, studentId: student.id }
      },
      update: { textContent, fileUrl, submittedAt: new Date(), status: 'PENDING' },
      create: { assignmentId: id, studentId: student.id, textContent, fileUrl }
    });

    res.status(201).json({ success: true, data: submission });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: 'Failed to submit assignment' });
  }
};

export const getSubmissions = async (req, res) => {
  try {
    const { id } = req.params; // assignmentId
    const submissions = await prisma.submission.findMany({
      where: { assignmentId: id },
      include: { student: { include: { user: { select: { name: true, email: true } } } } }
    });
    res.status(200).json({ success: true, data: submissions });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: 'Failed to fetch submissions' });
  }
};

export const gradeSubmission = async (req, res) => {
  try {
    const { submissionId } = req.params;
    const { marks, feedback } = req.body;

    const submission = await prisma.submission.update({
      where: { id: submissionId },
      data: { marks: parseFloat(marks), feedback, status: 'GRADED' }
    });

    res.status(200).json({ success: true, data: submission });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: 'Failed to grade submission' });
  }
};

export const getTeacherAssignments = async (req, res) => {
  try {
    const teacher = await prisma.teacher.findUnique({ where: { userId: req.user.id } });
    if (!teacher) return res.status(403).json({ success: false, error: 'Unauthorized' });

    const assignments = await prisma.assignment.findMany({
      where: { teacherId: teacher.id },
      include: { course: true, _count: { select: { submissions: true } } },
      orderBy: { createdAt: 'desc' }
    });
    
    res.status(200).json({ success: true, data: assignments });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: 'Failed to fetch assignments' });
  }
};

export const getStudentAssignments = async (req, res) => {
  try {
    const student = await prisma.student.findUnique({ where: { userId: req.user.id } });
    if (!student) return res.status(403).json({ success: false, error: 'Unauthorized' });

    // Get assignments for courses the student is enrolled in
    const enrollments = await prisma.enrollment.findMany({
      where: { studentId: student.id },
      select: { courseId: true }
    });
    const courseIds = enrollments.map(e => e.courseId);

    const assignments = await prisma.assignment.findMany({
      where: { courseId: { in: courseIds } },
      include: { 
        course: { select: { title: true } },
        submissions: { where: { studentId: student.id } }
      },
      orderBy: { dueDate: 'asc' }
    });
    
    res.status(200).json({ success: true, data: assignments });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: 'Failed to fetch assignments' });
  }
};
