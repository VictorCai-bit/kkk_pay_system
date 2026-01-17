const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

export const API_ENDPOINTS = {
  // 认证
  LOGIN: `${API_BASE_URL}/auth/login`,
  REGISTER: `${API_BASE_URL}/auth/register`,
  PROFILE: `${API_BASE_URL}/auth/profile`,

  // 商品
  PRODUCTS: `${API_BASE_URL}/products`,
  PRODUCT_BY_ID: (productId) => `${API_BASE_URL}/products/product-id/${productId}`,

  // 订单
  ORDERS: `${API_BASE_URL}/orders`,
  ORDER_BY_ID: (orderId) => `${API_BASE_URL}/orders/${orderId}`,
  PENDING_ORDERS: `${API_BASE_URL}/orders/merchant/pending`,
  TODAY_STATS: `${API_BASE_URL}/orders/merchant/stats/today`,
};

export const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || 'http://localhost:3000';
