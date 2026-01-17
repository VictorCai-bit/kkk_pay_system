import Product from '../models/Product.js';

// 创建商品
export const createProduct = async (req, res) => {
  try {
    const { productId, name, costPrice, salePrice, description } = req.body;
    const merchantId = req.user.id;

    // 检查商品ID是否已存在
    const existingProduct = await Product.findByProductId(productId, merchantId);
    if (existingProduct) {
      return res.status(400).json({
        success: false,
        message: '商品ID已存在',
      });
    }

    const id = await Product.create({
      merchantId,
      productId,
      name,
      costPrice,
      salePrice,
      description,
    });

    return res.status(201).json({
      success: true,
      message: '商品创建成功',
      data: { id },
    });
  } catch (error) {
    console.error('Create product error:', error);
    return res.status(500).json({
      success: false,
      message: '创建商品失败',
      error: error.message,
    });
  }
};

// 获取商品列表
export const getProducts = async (req, res) => {
  try {
    const merchantId = req.user.id;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;

    const products = await Product.findByMerchantId(merchantId, page, limit);
    const total = await Product.countByMerchant(merchantId);

    return res.json({
      success: true,
      data: {
        products,
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit),
        },
      },
    });
  } catch (error) {
    console.error('Get products error:', error);
    return res.status(500).json({
      success: false,
      message: '获取商品列表失败',
      error: error.message,
    });
  }
};

// 根据商品ID获取商品详情
export const getProductByProductId = async (req, res) => {
  try {
    const { productId } = req.params;
    const merchantId = req.user.id;

    const product = await Product.findByProductId(productId, merchantId);
    
    if (!product) {
      return res.status(404).json({
        success: false,
        message: '商品不存在',
      });
    }

    return res.json({
      success: true,
      data: product,
    });
  } catch (error) {
    console.error('Get product error:', error);
    return res.status(500).json({
      success: false,
      message: '获取商品详情失败',
      error: error.message,
    });
  }
};

// 更新商品
export const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, costPrice, salePrice, description } = req.body;

    const product = await Product.findById(id);
    
    if (!product) {
      return res.status(404).json({
        success: false,
        message: '商品不存在',
      });
    }

    // 验证权限
    if (product.merchant_id !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: '无权限操作此商品',
      });
    }

    await Product.update(id, {
      name,
      costPrice,
      salePrice,
      description,
    });

    return res.json({
      success: true,
      message: '商品更新成功',
    });
  } catch (error) {
    console.error('Update product error:', error);
    return res.status(500).json({
      success: false,
      message: '更新商品失败',
      error: error.message,
    });
  }
};

// 删除商品
export const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;

    const product = await Product.findById(id);
    
    if (!product) {
      return res.status(404).json({
        success: false,
        message: '商品不存在',
      });
    }

    // 验证权限
    if (product.merchant_id !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: '无权限操作此商品',
      });
    }

    await Product.delete(id);

    return res.json({
      success: true,
      message: '商品删除成功',
    });
  } catch (error) {
    console.error('Delete product error:', error);
    return res.status(500).json({
      success: false,
      message: '删除商品失败',
      error: error.message,
    });
  }
};
