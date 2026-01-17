import express from 'express';
import { body, param } from 'express-validator';
import {
  createProduct,
  getProducts,
  getProductByProductId,
  updateProduct,
  deleteProduct,
} from '../controllers/productController.js';
import { authMiddleware } from '../middleware/index.js';

const router = express.Router();

// 所有路由都需要认证
router.use(authMiddleware);

// 创建商品
router.post('/',
  [
    body('productId').trim().notEmpty().withMessage('商品ID不能为空'),
    body('name').trim().notEmpty().withMessage('商品名称不能为空'),
    body('costPrice').isFloat({ min: 0 }).withMessage('进货价必须大于等于0'),
    body('salePrice').isFloat({ min: 0 }).withMessage('售价必须大于等于0'),
    body('description').optional().trim(),
  ],
  createProduct
);

// 获取商品列表
router.get('/', getProducts);

// 根据商品ID获取商品详情
router.get('/product-id/:productId', getProductByProductId);

// 更新商品
router.put('/:id',
  [
    param('id').isInt().withMessage('无效的商品ID'),
    body('name').optional().trim().notEmpty().withMessage('商品名称不能为空'),
    body('costPrice').optional().isFloat({ min: 0 }).withMessage('进货价必须大于等于0'),
    body('salePrice').optional().isFloat({ min: 0 }).withMessage('售价必须大于等于0'),
    body('description').optional().trim(),
  ],
  updateProduct
);

// 删除商品
router.delete('/:id',
  [
    param('id').isInt().withMessage('无效的商品ID'),
  ],
  deleteProduct
);

export default router;
