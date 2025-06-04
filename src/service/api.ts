import axiosInstance from "@/service/service";
import type { AxiosError, AxiosRequestConfig } from 'axios';

interface ApiResponse<T> {
    data: T;
    status: number;
}

interface ApiError {
    message: string;
    status?: number;
    code?: string;
}

interface ApiConfig extends AxiosRequestConfig {
    headers?: Record<string, string>;
    timeout?: number;
    retry?: number;
}

export const apiService = {
    defaultConfig: {
        timeout: 30000,
        retry: 1,
        headers: {
            'Content-Type': 'application/json',
        },
    } as ApiConfig,

    mergeConfig(config?: ApiConfig): ApiConfig {
        return {
            ...this.defaultConfig,
            ...config,
            headers: {
                ...this.defaultConfig.headers,
                ...config?.headers,
            },
        };
    },

    handleError(error: AxiosError): never {
        const apiError: ApiError = {
            message: error.message,
            status: error.response?.status,
            code: error.code,
        };
        throw apiError;
    },

    async get<T>(url: string, params?: object, config?: ApiConfig): Promise<ApiResponse<T>> {
        try {
            const response = await axiosInstance.get<T>(url, this.mergeConfig({ ...config, params }));
            return { data: response.data, status: response.status };
        } catch (error) {
            return this.handleError(error as AxiosError);
        }
    },

    async post<T>(url: string, data?: object, config?: ApiConfig): Promise<ApiResponse<T>> {
        try {
            const response = await axiosInstance.post<T>(url, data, this.mergeConfig(config));
            return { data: response.data, status: response.status };
        } catch (error) {
            return this.handleError(error as AxiosError);
        }
    },

    async put<T>(url: string, data?: object, config?: ApiConfig): Promise<ApiResponse<T>> {
        try {
            const response = await axiosInstance.put<T>(url, data, this.mergeConfig(config));
            return { data: response.data, status: response.status };
        } catch (error) {
            return this.handleError(error as AxiosError);
        }
    },

    async patch<T>(url: string, data?: object, config?: ApiConfig): Promise<ApiResponse<T>> {
        try {
            const response = await axiosInstance.patch<T>(url, data, this.mergeConfig(config));
            return { data: response.data, status: response.status };
        } catch (error) {
            return this.handleError(error as AxiosError);
        }
    },

    async delete<T>(url: string, data?: object, config?: ApiConfig): Promise<ApiResponse<T>> {
        try {
            const response = await axiosInstance.delete<T>(url, this.mergeConfig({ ...config, data }));
            return { data: response.data, status: response.status };
        } catch (error) {
            return this.handleError(error as AxiosError);
        }
    },
};