import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { memoryStore } from '../services/memoryStore.service.js';
import { config } from '../config/env.js';
export const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        let user = memoryStore.getUserByEmail(email);
        if (!user) {
            return res.status(401).json({ success: false, error: 'Invalid credentials. User not found.' });
        }
        // Check password
        if (user.password) {
            const isValid = await bcrypt.compare(password, user.password);
            if (!isValid) {
                return res.status(401).json({ success: false, error: 'Invalid credentials. Incorrect password.' });
            }
        }
        else {
            // Legacy demo users (rajesh.kumar@procurement.gov.in / suresh.r@gem.gov.in)
            const expectedPassword = user.role === 'admin' ? 'admin123' : 'demo123';
            if (password !== expectedPassword) {
                return res.status(401).json({ success: false, error: 'Invalid credentials. Incorrect password.' });
            }
        }
        const token = jwt.sign({ id: user.id, email: user.email, role: user.role, name: user.name }, config.jwtSecret, { expiresIn: '7d' });
        memoryStore.logAudit({
            userId: user.id,
            userName: user.name,
            action: 'user_login',
            details: `${user.name} logged in securely with role ${user.role}`
        });
        res.json({
            success: true,
            data: {
                user,
                token
            }
        });
    }
    catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
};
export const getCurrentUser = (req, res) => {
    const userId = req.user?.id;
    const user = userId ? memoryStore.getUserById(userId) : memoryStore.getUsers()[0];
    res.json({
        success: true,
        data: user || memoryStore.getUsers()[0]
    });
};
export const register = async (req, res) => {
    try {
        const { name, email, password, role, organization } = req.body;
        if (!name || !email || !password) {
            return res.status(400).json({ success: false, error: 'Name, email, and password are required' });
        }
        const existing = memoryStore.getUserByEmail(email);
        if (existing) {
            return res.status(400).json({ success: false, error: 'User with this email already exists' });
        }
        // Hash the password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        const newUser = memoryStore.createUser({
            id: `user_${Date.now()}`,
            name,
            email,
            password: hashedPassword,
            role: role || 'officer',
            organization: organization || 'Procurement Organization'
        });
        const token = jwt.sign({ id: newUser.id, email: newUser.email, role: newUser.role, name: newUser.name }, config.jwtSecret, { expiresIn: '7d' });
        res.status(201).json({
            success: true,
            data: {
                user: newUser,
                token
            }
        });
    }
    catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
};
