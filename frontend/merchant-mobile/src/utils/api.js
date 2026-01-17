import axios from 'axios';
import toast from 'react-hot-toast';

const api = axios.create({
  timeout: 10000,
});

// 请求拦截器
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 响应拦截器
api.interceptors.response.use(
  (response) => {
    return response.data;
  },
  (error) => {
    if (error.response) {
      const { status, data } = error.response;
      
      if (status === 401) {
        localStorage.removeItem('token');
        localStorage.removeItem('merchant');
        window.location.href = '/login';
        toast.error('登录已过期，请重新登录');
      } else if (data?.message) {
        toast.error(data.message);
      } else {
        toast.error('请求失败，请稍后重试');
      }
    } else if (error.request) {
      toast.error('网络错误，请检查网络连接');
    } else {
      toast.error('请求失败');
    }
    
    return Promise.reject(error);
  }
);

export default api;
