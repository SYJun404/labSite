import axios, {
    type AxiosInstance,
    type AxiosRequestConfig,
    type AxiosResponse,
} from "axios";

// API响应结构
interface ApiResponse<T = any> {
    code: number;
    message: string;
    data: T;
}

// 创建axios实例
// 后端 API 统一使用 /api 前缀
const service: AxiosInstance = axios.create({
    baseURL: "/api",
    timeout: 30000,
});

// 请求拦截器
service.interceptors.request.use(
    (config) => {
        return config;
    },
    (error) => {
        return Promise.reject(error);
    },
);

// 响应拦截器
service.interceptors.response.use(
    async (response: AxiosResponse<ApiResponse>) => {
        // 如果是 blob 类型响应（文件下载），直接返回
        if (response.config.responseType === "blob") {
            return response.data;
        }
        const res = response.data;

        if (res.code !== 200) {
            return Promise.reject(new Error(res.message || "请求失败"));
        }

        return res.data;
    },
    (error) => {
        const message =
            error.response?.data?.message || error.message || "网络错误";
        return Promise.reject(error);
    },
);

// 封装请求方法
export function request<T = any>(config: AxiosRequestConfig): Promise<T> {
    return service(config) as Promise<T>;
}

export default service;
