import express from 'express';
import { body } from 'express-validator';
import { register, login, getProfile, updateProfile } from '../controllers/authController.js';
import { authMiddleware } from '../middleware/index.js';

const router = express.Router();

// 注册
router.post('/register',
  [
    body('username').trim().isLength({ min: 3 }).withMessage('用户名至少3个字符'),
    body('password').isLength({ min: 6 }).withMessage('密码至少6个字符'),
    body('storeName').trim().notEmpty().withMessage('店铺名称不能为空'),
    body('phone').optional().isMobilePhone('zh-CN').withMessage('请输入有效的手机号'),
    body('walletAddress').optional().isEthereumAddress().withMessage('请输入有效的钱包地址'),
  ],
  register
);

// 登录
router.post('/login',
  [
    body('username').trim().notEmpty().withMessage('用户名不能为空'),
    body('password').notEmpty().withMessage('密码不能为空'),
  ],
  login
);

// 获取个人信息（需要认证）
router.get('/profile', authMiddleware, getProfile);

// 更新个人信息（需要认证）
router.put('/profile',
  authMiddleware,
  [
    body('storeName').optional().trim().notEmpty().withMessage('店铺名称不能为空'),
    body('phone').optional().isMobilePhone('zh-CN').withMessage('请输入有效的手机号'),
    body('walletAddress').optional().isEthereumAddress().withMessage('请输入有效的钱包地址'),
  ],
  updateProfile
);

export default router;
