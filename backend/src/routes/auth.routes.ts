import { Router } from 'express';
import { AuthService } from '../services/auth.service.js';
import { registerSchema, loginSchema } from '../schemas/auth.schema.js';
import { protect } from '../middleware/auth.js';
import type { AuthRequest } from '../middleware/auth.js';

const router = Router();

// Register
router.post('/register', async (req, res, next) => {
  try {
    const data = registerSchema.parse(req.body);
    const user = await AuthService.register(
      data.email,
      data.username,
      data.password,
      data.fullName
    );

    res.status(201).json({
      message: 'Usuario registrado exitosamente',
      user,
    });
  } catch (error: any) {
    next(error);
  }
});

// Login
router.post('/login', async (req, res, next) => {
  try {
    const data = loginSchema.parse(req.body);
    const { user, token } = await AuthService.login(data.email, data.password);

    res.json({
      message: 'Login exitoso',
      token,
      user,
    });
  } catch (error: any) {
    next(error);
  }
});

// Get current user
router.get('/me', protect, async (req: AuthRequest, res, next) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: 'Not authenticated' });
    }

    const user = await AuthService.getUserById(req.user.id);

    if (!user) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }

    res.json({ user });
  } catch (error) {
    next(error);
  }
});

export default router;
