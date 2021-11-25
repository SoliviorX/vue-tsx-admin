import axios from "axios";
import store from "../store/index";

const ENV = (import.meta as any).env;

const service = axios.create({
    baseURL: ENV.VITE_BASE_URL,
    timeout: ENV.VITE_TIMEOUT,
});

// service.defaults.headers["content-type"] = "application/json";

// service.interceptors.request.use(
//     (config) => {
//       // 在发送请求之前做些什么
//       if (store.getters.getToken) {
//         config.headers["Authorization"] = store.getters.getToken;
//       }
  
//       return config;
//     },
//     function (error) {
//       // 对请求错误做些什么
//       return Promise.reject(error);
//     }
// );

export default service;