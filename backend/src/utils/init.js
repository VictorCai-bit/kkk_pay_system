import { initializeData } from '../config/database.js';

const init = async () => {
  console.log('开始初始化数据文件...\n');
  
  try {
    await initializeData();
    console.log('\n✅ 初始化完成！可以运行 npm run dev 启动服务器');
  } catch (error) {
    console.error('初始化失败:', error);
    process.exit(1);
  }
};

init();
