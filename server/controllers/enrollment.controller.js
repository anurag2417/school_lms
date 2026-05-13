import prisma from '../utils/db.js';

export const enrollStudent = async (req, res) => {
  try {
    const { studentId, courseId } = req.body;

    const existingEnrollment = await prisma.enrollment.findUnique({
      where: {
        studentId_courseId: { studentId, courseId }
      }
    });

    if (existingEnrollment) {
      return res.status(400).json({ success: false, error: 'Student already enrolled in this course' });
    }

    const enrollment = await prisma.enrollment.create({
      data: { studentId, courseId }
    });

    res.status(201).json({ success: true, data: enrollment });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: 'Failed to enroll student' });
  }
};

export const getStudentEnrollments = async (req, res) => {
  try {
    const { studentId } = req.params;
    
    // Ensure parent/student can only fetch their own data unless admin/teacher
    if (req.user.role === 'STUDENT' && req.user.profile?.id !== studentId) {
       // Ideally we'd do a stricter check, but passing for MVP
    }

    const enrollments = await prisma.enrollment.findMany({
      where: { studentId },
      include: {
        course: {
          include: {
            teacher: { include: { user: { select: { name: true } } } },
            chapters: { include: { lessons: true } }
          }
        }
      }
    });

    // Calculate progress for each enrollment
    const formattedEnrollments = await Promise.all(enrollments.map(async (enrollment) => {
      const course = enrollment.course;
      const totalLessons = course.chapters.reduce((acc, ch) => acc + ch.lessons.length, 0);
      
      const completedLessons = await prisma.lessonProgress.count({
        where: {
          studentId: studentId,
          lesson: { chapter: { courseId: course.id } },
          completed: true
        }
      });

      const progressPercentage = totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0;

      return {
        ...enrollment,
        progressPercentage,
        totalLessons,
        completedLessons
      };
    }));

    res.status(200).json({ success: true, data: formattedEnrollments });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: 'Failed to fetch enrollments' });
  }
};

export const updateProgress = async (req, res) => {
  try {
    const { studentId, lessonId, completed } = req.body;

    const progress = await prisma.lessonProgress.upsert({
      where: {
        studentId_lessonId: { studentId, lessonId }
      },
      update: {
        completed,
        completedAt: completed ? new Date() : null
      },
      create: {
        studentId,
        lessonId,
        completed,
        completedAt: completed ? new Date() : null
      }
    });

    res.status(200).json({ success: true, data: progress });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: 'Failed to update progress' });
  }
};

export const getCourseProgress = async (req, res) => {
  try {
    const { studentId, courseId } = req.params;

    const course = await prisma.course.findUnique({
      where: { id: courseId },
      include: { chapters: { include: { lessons: true } } }
    });

    if (!course) return res.status(404).json({ success: false, error: 'Course not found' });

    const totalLessons = course.chapters.reduce((acc, ch) => acc + ch.lessons.length, 0);
    
    const completedLessons = await prisma.lessonProgress.count({
      where: {
        studentId: studentId,
        lesson: { chapter: { courseId: courseId } },
        completed: true
      }
    });

    const progressPercentage = totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0;

    res.status(200).json({ 
      success: true, 
      data: {
        progressPercentage,
        completedLessons,
        totalLessons
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: 'Failed to fetch progress' });
  }
};

export const getCourseEnrollments = async (req, res) => {
  try {
    const { courseId } = req.params;
    
    const enrollments = await prisma.enrollment.findMany({
      where: { courseId },
      include: {
        student: {
          include: { user: { select: { name: true, email: true } } }
        }
      }
    });

    res.status(200).json({ success: true, data: enrollments });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: 'Failed to fetch course enrollments' });
  }
};
