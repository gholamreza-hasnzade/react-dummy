import axios from 'axios';
import type { AxiosError, AxiosInstance, InternalAxiosRequestConfig, AxiosResponse } from 'axios';
import toast from 'react-hot-toast';

const BASE_URL = import.meta.env.VITE_API_URL;

const errorMessages: { [key: number]: string } = {
  403: "دسترسی غیرمجاز! شما اجازه این عملیات را ندارید.",
  404: "صفحه یا منبع موردنظر یافت نشد.",
  500: "خطای داخلی سرور. لطفاً بعداً تلاش کنید.",
  502: "خطا در ارتباط با سرور. لطفاً بعداً تلاش کنید.",
  503: "سرویس موقتاً در دسترس نیست. لطفاً بعداً تلاش کنید.",
  504: "زمان پاسخگویی سرور به پایان رسید. لطفاً دوباره تلاش کنید."
};

const axiosInstance: AxiosInstance = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

axiosInstance.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error: AxiosError) => {
    toast.error('خطا در ارسال درخواست');
    return Promise.reject(error);
  }
);
axiosInstance.interceptors.response.use(
  (response: AxiosResponse) => {
    return response;
  },
  async (error: AxiosError) => {
    if (error.response) {
      const status = error.response.status;
      const errorMessage = errorMessages[status] || 'خطای ناشناخته رخ داده است';

      toast.error(errorMessage);
      console.error(`Error ${status}:`, error.response.data);
    } else if (error.request) {
      toast.error('خطا در دریافت پاسخ از سرور');
      console.error('No response received:', error.request);
    } else {
      toast.error('خطا در تنظیم درخواست');
      console.error('Error setting up request:', error.message);
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;