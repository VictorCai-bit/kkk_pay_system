import { readJSON, writeJSON, generateId } from '../config/database.js';

const MERCHANTS_FILE = 'merchants.json';

class Merchant {
  // 创建商家
  static async create({ username, password, storeName, phone, walletAddress }) {
    const merchants = await readJSON(MERCHANTS_FILE);
    const id = generateId(merchants);
    
    const merchant = {
      id,
      username,
      password,
      store_name: storeName,
      phone: phone || null,
      wallet_address: walletAddress || null,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    
    merchants.push(merchant);
    await writeJSON(MERCHANTS_FILE, merchants);
    
    return id;
  }

  // 根据用户名查找
  static async findByUsername(username) {
    const merchants = await readJSON(MERCHANTS_FILE);
    return merchants.find(m => m.username === username);
  }

  // 根据ID查找
  static async findById(id) {
    const merchants = await readJSON(MERCHANTS_FILE);
    const merchant = merchants.find(m => m.id === id);
    
    if (merchant) {
      // 返回时不包含密码
      const { password, ...merchantData } = merchant;
      return merchantData;
    }
    
    return null;
  }

  // 更新商家信息
  static async update(id, data) {
    const merchants = await readJSON(MERCHANTS_FILE);
    const index = merchants.findIndex(m => m.id === id);
    
    if (index !== -1) {
      merchants[index] = {
        ...merchants[index],
        store_name: data.storeName,
        phone: data.phone,
        wallet_address: data.walletAddress,
        updated_at: new Date().toISOString(),
      };
      
      await writeJSON(MERCHANTS_FILE, merchants);
      return true;
    }
    
    return false;
  }
}

export default Merchant;
