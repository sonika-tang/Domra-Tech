import express from 'express';
import userController from '../controllers/userController.js';
import authMiddleware from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/admin/users', authMiddleware.verifyAuth, authMiddleware.checkAdminRole, userController.findAll);
router.get('/profile', authMiddleware.verifyAuth, userController.getProfile);
router.put('/profile', authMiddleware.verifyAuth, userController.updateProfile);
router.delete('/profile', authMiddleware.verifyAuth, userController.deleteAccount);
router.put('/admin/users/:id',authMiddleware.verifyAuth, userController.updateUser);
router.delete('/admin/users/:id', authMiddleware.verifyAuth, userController.deleteUser);

export default router;
