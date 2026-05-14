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

export const register = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    if (!name || !email || !password || !role) {
      return res.status(400).json({ success: false, error: 'Please provide all required fields' });
    }

    const validRoles = ['STUDENT', 'TEACHER', 'PARENT'];
    if (!validRoles.includes(role)) {
      return res.status(400).json({ success: false, error: 'Invalid role selected' });
    }

    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ success: false, error: 'Email already exists' });
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const userData = {
      name,
      email,
      passwordHash,
      role,
    };

    if (role === 'STUDENT') {
      userData.studentProfile = { create: { grade: 'TBD', section: 'TBD', rollNo: 'TBD' } };
    } else if (role === 'TEACHER') {
      userData.teacherProfile = { create: { subjects: [] } };
    } else if (role === 'PARENT') {
      userData.parentProfile = { create: {} };
    }

    const user = await prisma.user.create({
      data: userData,
    });

    const token = jwt.sign(
      { id: user.id, role: user.role },
      process.env.JWT_SECRET || 'fallback_secret',
      { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
    );

    let profile = null;
    if (user.role === 'STUDENT') profile = await prisma.student.findUnique({ where: { userId: user.id } });
    if (user.role === 'TEACHER') profile = await prisma.teacher.findUnique({ where: { userId: user.id } });
    if (user.role === 'PARENT') profile = await prisma.parent.findUnique({ where: { userId: user.id } });

    res.status(201).json({
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
    res.status(500).json({ success: false, error: 'Server error during registration' });
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
