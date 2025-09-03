import { Router } from 'express';
import { authenticate } from '../middleware/auth';

const router = Router();

// Placeholder routes - to be implemented
router.get('/', authenticate, (req, res) => {
  res.json({ message: 'Depots endpoint - to be implemented' });
});

router.post('/', authenticate, (req, res) => {
  res.json({ message: 'Create depot - to be implemented' });
});

export default router;
