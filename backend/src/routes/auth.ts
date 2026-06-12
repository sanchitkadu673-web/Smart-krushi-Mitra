import { Router } from 'express';
import { AuthController } from '../controllers/AuthController';

const router = Router();

router.post('/register', AuthController.register);
router.post('/send-otp', AuthController.sendOtp);
router.post('/verify-otp', AuthController.verifyOtp);
router.post('/login-password', AuthController.loginPassword);
router.post('/logout', AuthController.logout);

export default router;
