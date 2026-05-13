import prisma from '../utils/db.js';

export const getStudents = async (req, res) => {
  try {
    const students = await prisma.student.findMany({
      include: {
        user: { select: { name: true, email: true } },
        parent: { include: { user: { select: { name: true, email: true } } } }
      }
    });

    res.status(200).json({ success: true, data: students });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: 'Failed to fetch students' });
  }
};
