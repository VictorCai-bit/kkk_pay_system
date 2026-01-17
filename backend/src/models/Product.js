import { readJSON, writeJSON, generateId } from '../config/database.js';

const PRODUCTS_FILE = 'products.json';

class Product {
  // 创建商品
  static async create({ merchantId, productId, name, costPrice, salePrice, description }) {
    const products = await readJSON(PRODUCTS_FILE);
    const id = generateId(products);
    
    const product = {
      id,
      merchant_id: merchantId,
      product_id: productId,
      name,
      cost_price: costPrice,
      sale_price: salePrice,
      description: description || '',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    
    products.push(product);
    await writeJSON(PRODUCTS_FILE, products);
    
    return id;
  }

  // 根据商品ID和商家ID查找
  static async findByProductId(productId, merchantId) {
    const products = await readJSON(PRODUCTS_FILE);
    return products.find(p => p.product_id === productId && p.merchant_id === merchantId);
  }

  // 根据ID查找
  static async findById(id) {
    const products = await readJSON(PRODUCTS_FILE);
    return products.find(p => p.id === id);
  }

  // 获取商家的所有商品
  static async findByMerchantId(merchantId, page = 1, limit = 20) {
    const products = await readJSON(PRODUCTS_FILE);
    const merchantProducts = products
      .filter(p => p.merchant_id === merchantId)
      .sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
    
    const start = (page - 1) * limit;
    const end = start + limit;
    
    return merchantProducts.slice(start, end);
  }

  // 更新商品
  static async update(id, data) {
    const products = await readJSON(PRODUCTS_FILE);
    const index = products.findIndex(p => p.id === id);
    
    if (index !== -1) {
      products[index] = {
        ...products[index],
        name: data.name,
        cost_price: data.costPrice,
        sale_price: data.salePrice,
        description: data.description,
        updated_at: new Date().toISOString(),
      };
      
      await writeJSON(PRODUCTS_FILE, products);
      return true;
    }
    
    return false;
  }

  // 删除商品
  static async delete(id) {
    const products = await readJSON(PRODUCTS_FILE);
    const filtered = products.filter(p => p.id !== id);
    
    if (filtered.length < products.length) {
      await writeJSON(PRODUCTS_FILE, filtered);
      return true;
    }
    
    return false;
  }

  // 统计商家商品数量
  static async countByMerchant(merchantId) {
    const products = await readJSON(PRODUCTS_FILE);
    return products.filter(p => p.merchant_id === merchantId).length;
  }
}

export default Product;
