import prisma from '../utils/db.js';

export const createFeeStructure = async (req, res) => {
  try {
    const { name, amount, dueDate, grade, type, academicYear } = req.body;

    const structure = await prisma.feeStructure.create({
      data: {
        name,
        amount: parseFloat(amount),
        dueDate: new Date(dueDate),
        grade,
        type,
        academicYear
      }
    });

    // Auto-assign to all students in that grade
    const students = await prisma.student.findMany({
      where: { grade }
    });

    if (students.length > 0) {
      const payments = students.map(s => ({
        feeStructureId: structure.id,
        studentId: s.id,
        amount: parseFloat(amount),
        status: 'PENDING'
      }));

      await prisma.feePayment.createMany({
        data: payments
      });
    }

    res.status(201).json({ success: true, data: structure, assignedCount: students.length });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: 'Failed to create fee structure' });
  }
};

export const getFeeStructures = async (req, res) => {
  try {
    const structures = await prisma.feeStructure.findMany({
      include: {
        _count: { select: { payments: true } }
      },
      orderBy: { dueDate: 'desc' }
    });
    res.status(200).json({ success: true, data: structures });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: 'Failed to fetch fee structures' });
  }
};

export const getStudentFees = async (req, res) => {
  try {
    const student = await prisma.student.findUnique({ where: { userId: req.user.id } });
    if (!student) return res.status(403).json({ success: false, error: 'Unauthorized' });

    const fees = await prisma.feePayment.findMany({
      where: { studentId: student.id },
      include: { feeStructure: true },
      orderBy: { feeStructure: { dueDate: 'asc' } }
    });

    res.status(200).json({ success: true, data: fees });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: 'Failed to fetch student fees' });
  }
};

export const processPayment = async (req, res) => {
  try {
    const { paymentId } = req.params;
    
    // Simulate payment processing
    const receiptNo = `REC-${Date.now()}-${Math.floor(Math.random() * 1000)}`;

    const payment = await prisma.feePayment.update({
      where: { id: paymentId },
      data: {
        status: 'PAID',
        paidAt: new Date(),
        receiptNo
      },
      include: { feeStructure: true }
    });

    res.status(200).json({ success: true, data: payment });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: 'Failed to process payment' });
  }
};
