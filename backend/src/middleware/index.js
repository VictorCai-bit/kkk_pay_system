import jwt from 'jsonwebtoken';
import config from '../config/index.js';

export const authMiddleware = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({
        success: false,
        message: '未提供认证令牌',
      });
    }

    const decoded = jwt.verify(token, config.jwt.secret);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: '无效的认证令牌',
    });
  }
};

export const errorHandler = (err, req, res, next) => {
  console.error('Error:', err);

  if (err.name === 'ValidationError') {
    return res.status(400).json({
      success: false,
      message: '数据验证失败',
      errors: err.errors,
    });
  }

  if (err.name === 'UnauthorizedError') {
    return res.status(401).json({
      success: false,
      message: '未授权访问',
    });
  }

  return res.status(500).json({
    success: false,
    message: '服务器内部错误',
    error: config.env === 'development' ? err.message : undefined,
  });
};
