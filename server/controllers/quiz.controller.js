import prisma from '../utils/db.js';

export const createQuiz = async (req, res) => {
  try {
    const { courseId, title, totalMarks, questions } = req.body;
    
    const teacher = await prisma.teacher.findUnique({ where: { userId: req.user.id } });
    if (!teacher && req.user.role !== 'SUPERADMIN') return res.status(403).json({ success: false, error: 'Unauthorized' });
    const teacherId = teacher ? teacher.id : req.body.teacherId;

    const quiz = await prisma.quiz.create({
      data: {
        courseId,
        teacherId,
        title,
        totalMarks: parseInt(totalMarks),
        questions: {
          create: questions.map(q => ({
            text: q.text,
            options: q.options,
            correctAnswer: q.correctAnswer,
            marks: parseInt(q.marks)
          }))
        }
      },
      include: { questions: true }
    });

    res.status(201).json({ success: true, data: quiz });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: 'Failed to create quiz' });
  }
};

export const getQuizzesByCourse = async (req, res) => {
  try {
    const { courseId } = req.params;
    const quizzes = await prisma.quiz.findMany({
      where: { courseId },
      include: { 
        questions: {
          select: { id: true, text: true, options: true, marks: true } // Hide correct answer from list
        }
      }
    });
    res.status(200).json({ success: true, data: quizzes });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: 'Failed to fetch quizzes' });
  }
};

export const attemptQuiz = async (req, res) => {
  try {
    const { id } = req.params; // quizId
    const { answers } = req.body; // { questionId: answerStr }

    const student = await prisma.student.findUnique({ where: { userId: req.user.id } });
    if (!student) return res.status(403).json({ success: false, error: 'Only students can attempt quizzes' });

    // Calculate score
    const quiz = await prisma.quiz.findUnique({
      where: { id },
      include: { questions: true }
    });

    if (!quiz) return res.status(404).json({ success: false, error: 'Quiz not found' });

    let score = 0;
    quiz.questions.forEach(q => {
      if (answers[q.id] === q.correctAnswer) {
        score += q.marks;
      }
    });

    const attempt = await prisma.quizAttempt.create({
      data: {
        quizId: id,
        studentId: student.id,
        answers: JSON.stringify(answers),
        score
      }
    });

    res.status(201).json({ success: true, data: attempt });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: 'Failed to submit quiz' });
  }
};

export const getTeacherQuizzes = async (req, res) => {
  try {
    const teacher = await prisma.teacher.findUnique({ where: { userId: req.user.id } });
    if (!teacher) return res.status(403).json({ success: false, error: 'Unauthorized' });

    const quizzes = await prisma.quiz.findMany({
      where: { teacherId: teacher.id },
      include: { course: true, _count: { select: { quizAttempts: true } } },
      orderBy: { title: 'asc' }
    });
    
    res.status(200).json({ success: true, data: quizzes });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: 'Failed to fetch quizzes' });
  }
};

export const getStudentQuizzes = async (req, res) => {
  try {
    const student = await prisma.student.findUnique({ where: { userId: req.user.id } });
    if (!student) return res.status(403).json({ success: false, error: 'Unauthorized' });

    const enrollments = await prisma.enrollment.findMany({
      where: { studentId: student.id },
      select: { courseId: true }
    });
    const courseIds = enrollments.map(e => e.courseId);

    const quizzes = await prisma.quiz.findMany({
      where: { courseId: { in: courseIds } },
      include: { 
        course: { select: { title: true } },
        quizAttempts: { where: { studentId: student.id } },
        _count: { select: { questions: true } }
      }
    });
    
    res.status(200).json({ success: true, data: quizzes });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: 'Failed to fetch quizzes' });
  }
};

export const getQuiz = async (req, res) => {
  try {
    const { id } = req.params;
    const quiz = await prisma.quiz.findUnique({
      where: { id },
      include: {
        course: { select: { title: true } },
        questions: { select: { id: true, text: true, options: true, marks: true } }
      }
    });

    if (!quiz) return res.status(404).json({ success: false, error: 'Quiz not found' });

    res.status(200).json({ success: true, data: quiz });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: 'Failed to fetch quiz' });
  }
};
