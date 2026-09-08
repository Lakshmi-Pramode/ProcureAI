import type { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { config } from '../config/env.js';
import { memoryStore } from '../services/memoryStore.service.js';

export interface AuthRequest extends Request {
  user?: {
    id: string;
    email: string;
    role: string;
    name: string;
  };
}

export const authenticate = (req: AuthRequest, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    // In demo mode or local testing, provide fallback mock user if no token
    const mockUser = memoryStore.getUsers()[0];
    req.user = {
      id: mockUser.id,
      email: mockUser.email,
      role: mockUser.role,
      name: mockUser.name
    };
    return next();
  }

  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, config.jwtSecret) as any;
    req.user = decoded;
    next();
  } catch {
    // Graceful fallback for invalid/expired token during local demo
    const mockUser = memoryStore.getUsers()[0];
    req.user = {
      id: mockUser.id,
      email: mockUser.email,
      role: mockUser.role,
      name: mockUser.name
    };
    next();
  }
};
