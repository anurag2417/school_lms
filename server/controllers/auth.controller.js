import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import prisma from '../utils/db.js';

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return res.status(401).json({ success: false, error: 'Invalid credentials' });
    }

    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
      return res.status(401).json({ success: false, error: 'Invalid credentials' });
    }

    const token = jwt.sign(
      { id: user.id, role: user.role },
      process.env.JWT_SECRET || 'fallback_secret',
      { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
    );

    let profile = null;
    if (user.role === 'STUDENT') profile = await prisma.student.findUnique({ where: { userId: user.id } });
    if (user.role === 'TEACHER') profile = await prisma.teacher.findUnique({ where: { userId: user.id } });
    if (user.role === 'PARENT') profile = await prisma.parent.findUnique({ where: { userId: user.id } });

    res.status(200).json({
      success: true,
      data: {
        token,
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
          profile
        }
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: 'Server error during login' });
  }
};

export const logout = (req, res) => {
  res.status(200).json({ success: true, message: 'Logged out successfully' });
};

export const getMe = async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
      select: { id: true, name: true, email: true, role: true }
    });
    
    if (!user) {
      return res.status(404).json({ success: false, error: 'User not found' });
    }

    let profile = null;
    if (user.role === 'STUDENT') profile = await prisma.student.findUnique({ where: { userId: user.id } });
    if (user.role === 'TEACHER') profile = await prisma.teacher.findUnique({ where: { userId: user.id } });
    if (user.role === 'PARENT') profile = await prisma.parent.findUnique({ where: { userId: user.id } });

    res.status(200).json({
      success: true,
      data: { user: { ...user, profile } }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: 'Server error fetching user' });
  }
};
