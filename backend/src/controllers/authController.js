import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import Merchant from '../models/Merchant.js';
import config from '../config/index.js';

// 注册
export const register = async (req, res) => {
  try {
    const { username, password, storeName, phone, walletAddress } = req.body;

    // 检查用户名是否已存在
    const existingMerchant = await Merchant.findByUsername(username);
    if (existingMerchant) {
      return res.status(400).json({
        success: false,
        message: '用户名已存在',
      });
    }

    // 加密密码
    const hashedPassword = await bcrypt.hash(password, 10);

    // 创建商家
    const merchantId = await Merchant.create({
      username,
      password: hashedPassword,
      storeName,
      phone,
      walletAddress,
    });

    // 生成 token
    const token = jwt.sign(
      { id: merchantId, username },
      config.jwt.secret,
      { expiresIn: config.jwt.expiresIn }
    );

    return res.status(201).json({
      success: true,
      message: '注册成功',
      data: {
        token,
        merchant: {
          id: merchantId,
          username,
          storeName,
          phone,
          walletAddress,
        },
      },
    });
  } catch (error) {
    console.error('Register error:', error);
    return res.status(500).json({
      success: false,
      message: '注册失败',
      error: error.message,
    });
  }
};

// 登录
export const login = async (req, res) => {
  try {
    const { username, password } = req.body;

    // 查找商家
    const merchant = await Merchant.findByUsername(username);
    if (!merchant) {
      return res.status(401).json({
        success: false,
        message: '用户名或密码错误',
      });
    }

    // 验证密码
    const isValidPassword = await bcrypt.compare(password, merchant.password);
    if (!isValidPassword) {
      return res.status(401).json({
        success: false,
        message: '用户名或密码错误',
      });
    }

    // 生成 token
    const token = jwt.sign(
      { id: merchant.id, username: merchant.username },
      config.jwt.secret,
      { expiresIn: config.jwt.expiresIn }
    );

    return res.json({
      success: true,
      message: '登录成功',
      data: {
        token,
        merchant: {
          id: merchant.id,
          username: merchant.username,
          storeName: merchant.store_name,
          phone: merchant.phone,
          walletAddress: merchant.wallet_address,
        },
      },
    });
  } catch (error) {
    console.error('Login error:', error);
    return res.status(500).json({
      success: false,
      message: '登录失败',
      error: error.message,
    });
  }
};

// 获取当前用户信息
export const getProfile = async (req, res) => {
  try {
    const merchant = await Merchant.findById(req.user.id);
    
    if (!merchant) {
      return res.status(404).json({
        success: false,
        message: '用户不存在',
      });
    }

    return res.json({
      success: true,
      data: {
        id: merchant.id,
        username: merchant.username,
        storeName: merchant.store_name,
        phone: merchant.phone,
        walletAddress: merchant.wallet_address,
        createdAt: merchant.created_at,
      },
    });
  } catch (error) {
    console.error('Get profile error:', error);
    return res.status(500).json({
      success: false,
      message: '获取用户信息失败',
      error: error.message,
    });
  }
};

// 更新用户信息
export const updateProfile = async (req, res) => {
  try {
    const { storeName, phone, walletAddress } = req.body;

    await Merchant.update(req.user.id, {
      storeName,
      phone,
      walletAddress,
    });

    return res.json({
      success: true,
      message: '更新成功',
    });
  } catch (error) {
    console.error('Update profile error:', error);
    return res.status(500).json({
      success: false,
      message: '更新失败',
      error: error.message,
    });
  }
};
