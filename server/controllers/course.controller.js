import prisma from '../utils/db.js';

export const createCourse = async (req, res) => {
  try {
    const { title, description, subject, grade, thumbnail } = req.body;
    
    // Ensure user has a teacher profile
    const teacher = await prisma.teacher.findUnique({ where: { userId: req.user.id } });
    if (!teacher && req.user.role !== 'SUPERADMIN') {
      return res.status(403).json({ success: false, error: 'Only teachers can create courses' });
    }

    const teacherId = req.user.role === 'TEACHER' ? teacher.id : req.body.teacherId;

    const course = await prisma.course.create({
      data: {
        title,
        description,
        subject,
        grade,
        thumbnail,
        teacherId
      }
    });

    res.status(201).json({ success: true, data: course });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: 'Failed to create course' });
  }
};

export const getCourses = async (req, res) => {
  try {
    const { grade, subject } = req.query;
    
    let whereClause = {};
    if (grade) whereClause.grade = grade;
    if (subject) whereClause.subject = subject;

    // If teacher, show only their courses unless specified
    if (req.user.role === 'TEACHER') {
      const teacher = await prisma.teacher.findUnique({ where: { userId: req.user.id } });
      if (teacher) whereClause.teacherId = teacher.id;
    }

    const courses = await prisma.course.findMany({
      where: whereClause,
      include: {
        teacher: { include: { user: { select: { name: true } } } },
        chapters: true
      }
    });

    res.status(200).json({ success: true, data: courses });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: 'Failed to fetch courses' });
  }
};

export const getCourseById = async (req, res) => {
  try {
    const { id } = req.params;
    const course = await prisma.course.findUnique({
      where: { id },
      include: {
        teacher: { include: { user: { select: { name: true } } } },
        chapters: {
          include: { lessons: { orderBy: { order: 'asc' } } },
          orderBy: { order: 'asc' }
        }
      }
    });

    if (!course) return res.status(404).json({ success: false, error: 'Course not found' });
    res.status(200).json({ success: true, data: course });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: 'Failed to fetch course' });
  }
};

export const updateCourse = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, subject, grade, thumbnail, isPublished } = req.body;
    
    const course = await prisma.course.update({
      where: { id },
      data: { title, description, subject, grade, thumbnail, isPublished }
    });

    res.status(200).json({ success: true, data: course });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: 'Failed to update course' });
  }
};

export const deleteCourse = async (req, res) => {
  try {
    const { id } = req.params;
    await prisma.course.delete({ where: { id } });
    res.status(200).json({ success: true, message: 'Course deleted' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: 'Failed to delete course' });
  }
};

export const addChapter = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, order } = req.body;
    
    const chapter = await prisma.chapter.create({
      data: { title, order: parseInt(order), courseId: id }
    });

    res.status(201).json({ success: true, data: chapter });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: 'Failed to add chapter' });
  }
};

export const addLesson = async (req, res) => {
  try {
    const { chapterId } = req.params;
    const { title, type, content, order } = req.body;

    const lesson = await prisma.lesson.create({
      data: {
        title,
        type, // VIDEO, TEXT, PDF
        content,
        order: parseInt(order),
        chapterId
      }
    });

    res.status(201).json({ success: true, data: lesson });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: 'Failed to add lesson' });
  }
};
