import prisma from '../utils/db.js';

export const createNotification = async (req, res) => {
  try {
    const { title, message, targetRole, courseId } = req.body;

    const notification = await prisma.notification.create({
      data: {
        title,
        message,
        targetRole: targetRole || 'ALL',
        courseId: courseId || null,
        createdBy: req.user.id
      }
    });

    res.status(201).json({ success: true, data: notification });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: 'Failed to create notification' });
  }
};

export const getMyNotifications = async (req, res) => {
  try {
    const userId = req.user.id;
    const role = req.user.role;

    // Fetch student's course enrollments if they are a student
    let courseIds = [];
    if (role === 'STUDENT') {
      const student = await prisma.student.findUnique({ where: { userId } });
      if (student) {
        const enrollments = await prisma.enrollment.findMany({ where: { studentId: student.id } });
        courseIds = enrollments.map(e => e.courseId);
      }
    } else if (role === 'TEACHER') {
      const teacher = await prisma.teacher.findUnique({ where: { userId } });
      if (teacher) {
        const courses = await prisma.course.findMany({ where: { teacherId: teacher.id } });
        courseIds = courses.map(c => c.id);
      }
    }

    // Determine target roles to fetch
    const rolesToFetch = ['ALL', `${role}S`]; // e.g., 'STUDENTS', 'TEACHERS'

    const notifications = await prisma.notification.findMany({
      where: {
        OR: [
          { targetRole: { in: rolesToFetch }, courseId: null },
          { courseId: { in: courseIds } }
        ]
      },
      orderBy: { createdAt: 'desc' },
      take: 50,
      include: {
        reads: {
          where: { userId }
        }
      }
    });

    // Format to indicate if read
    const formattedNotifications = notifications.map(n => ({
      id: n.id,
      title: n.title,
      message: n.message,
      createdAt: n.createdAt,
      isRead: n.reads.length > 0
    }));

    res.status(200).json({ success: true, data: formattedNotifications });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: 'Failed to fetch notifications' });
  }
};

export const markAsRead = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const read = await prisma.notificationRead.upsert({
      where: {
        notificationId_userId: { notificationId: id, userId }
      },
      update: {},
      create: {
        notificationId: id,
        userId
      }
    });

    res.status(200).json({ success: true, data: read });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: 'Failed to mark as read' });
  }
};

export const markAllAsRead = async (req, res) => {
  try {
    const userId = req.user.id;
    const role = req.user.role;

    // We can't easily upsert many based on complex conditions in Prisma in one query, 
    // so we'll fetch unread ones and create records
    let courseIds = [];
    if (role === 'STUDENT') {
      const student = await prisma.student.findUnique({ where: { userId } });
      if (student) {
        const enrollments = await prisma.enrollment.findMany({ where: { studentId: student.id } });
        courseIds = enrollments.map(e => e.courseId);
      }
    } else if (role === 'TEACHER') {
      const teacher = await prisma.teacher.findUnique({ where: { userId } });
      if (teacher) {
        const courses = await prisma.course.findMany({ where: { teacherId: teacher.id } });
        courseIds = courses.map(c => c.id);
      }
    }

    const rolesToFetch = ['ALL', `${role}S`];

    const unreadNotifications = await prisma.notification.findMany({
      where: {
        OR: [
          { targetRole: { in: rolesToFetch }, courseId: null },
          { courseId: { in: courseIds } }
        ],
        NOT: {
          reads: { some: { userId } }
        }
      },
      select: { id: true }
    });

    if (unreadNotifications.length > 0) {
      await prisma.notificationRead.createMany({
        data: unreadNotifications.map(n => ({
          notificationId: n.id,
          userId
        }))
      });
    }

    res.status(200).json({ success: true, message: 'All marked as read' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: 'Failed to mark all as read' });
  }
};
