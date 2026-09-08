import type { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { memoryStore } from '../services/memoryStore.service.js';
import { config } from '../config/env.js';
import type { UserRole } from '../types/index.js';

export const login = async (req: Request, res: Response) => {
  try {
    const { email, role } = req.body;
    let user = memoryStore.getUserByEmail(email);

    if (!user) {
      // For ease of demo and testing, auto-create or pick role user
      const users = memoryStore.getUsers();
      user = users.find(u => u.role === role) || users[0];
    }

    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role, name: user.name },
      config.jwtSecret,
      { expiresIn: '7d' }
    );

    memoryStore.logAudit({
      userId: user.id,
      userName: user.name,
      action: 'user_login',
      details: `${user.name} logged in with role ${user.role}`
    });

    res.json({
      success: true,
      data: {
        user,
        token
      }
    });
  } catch (err) {
    res.status(500).json({ success: false, error: (err as Error).message });
  }
};

export const getCurrentUser = (req: any, res: Response) => {
  const userId = req.user?.id;
  const user = userId ? memoryStore.getUserById(userId) : memoryStore.getUsers()[0];
  res.json({
    success: true,
    data: user || memoryStore.getUsers()[0]
  });
};

export const register = async (req: Request, res: Response) => {
  try {
    const { name, email, role, organization } = req.body;
    if (!name || !email) {
      return res.status(400).json({ success: false, error: 'Name and email are required' });
    }

    const existing = memoryStore.getUserByEmail(email);
    if (existing) {
      return res.status(400).json({ success: false, error: 'User with this email already exists' });
    }

    const newUser = memoryStore.createUser({
      id: `user_${Date.now()}`,
      name,
      email,
      role: (role as UserRole) || 'officer',
      organization: organization || 'Procurement Organization'
    });

    const token = jwt.sign(
      { id: newUser.id, email: newUser.email, role: newUser.role, name: newUser.name },
      config.jwtSecret,
      { expiresIn: '7d' }
    );

    res.status(201).json({
      success: true,
      data: {
        user: newUser,
        token
      }
    });
  } catch (err) {
    res.status(500).json({ success: false, error: (err as Error).message });
  }
};
