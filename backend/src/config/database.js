import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 数据文件目录
const DATA_DIR = path.join(__dirname, '../../data');

// 确保数据目录存在
const ensureDataDir = async () => {
  try {
    await fs.access(DATA_DIR);
  } catch {
    await fs.mkdir(DATA_DIR, { recursive: true });
  }
};

// 读取 JSON 文件
export const readJSON = async (filename) => {
  await ensureDataDir();
  const filePath = path.join(DATA_DIR, filename);
  
  try {
    const data = await fs.readFile(filePath, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    // 文件不存在，返回空数组
    return [];
  }
};

// 写入 JSON 文件
export const writeJSON = async (filename, data) => {
  await ensureDataDir();
  const filePath = path.join(DATA_DIR, filename);
  await fs.writeFile(filePath, JSON.stringify(data, null, 2), 'utf-8');
};

// 生成唯一 ID
export const generateId = (items) => {
  if (items.length === 0) return 1;
  return Math.max(...items.map(item => item.id)) + 1;
};

// 初始化数据文件
export const initializeData = async () => {
  await ensureDataDir();
  
  const files = ['merchants.json', 'products.json', 'orders.json'];
  
  for (const file of files) {
    const filePath = path.join(DATA_DIR, file);
    try {
      await fs.access(filePath);
    } catch {
      // 文件不存在，创建空数组
      await fs.writeFile(filePath, JSON.stringify([], null, 2), 'utf-8');
      console.log(`✓ 创建数据文件: ${file}`);
    }
  }
  
  console.log('✅ 数据文件初始化完成');
};

export default {
  readJSON,
  writeJSON,
  generateId,
  initializeData,
};
