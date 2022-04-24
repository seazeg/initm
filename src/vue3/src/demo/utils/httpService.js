/*
 * @Author       : Evan.G
 * @Date         : 2021-08-18 10:19:11
 * @LastEditTime : 2022-01-19 15:40:38
 * @Description  :
 */

import axios from "axios";
import store from "@/store";
import router from "@/router";

/**
 * 请求失败后的错误统一处理
 * @param {Number} status 请求失败的状态码
 */
const errorHandle = (status, other) => {
    // 状态码判断
    switch (status) {
        case 401:
            break;
        case 403:
            break;
        case 404:
            break;
        default:
            console.log(other);
    }
};

const instance = axios.create({
    baseURL: process.env.VUE_APP_API_URL,
    timeout: 1000 * 60,
});

//熔断器 start
let pending = []; //声明一个数组用于存储每个ajax请求的取消函数和ajax标识
let cancelToken = axios.CancelToken;
let removePending = (ever) => {
    for (let p in pending) {
        if (pending[p].u === ever.data.queryName + "&" + ever.method) {
            //当当前请求在数组中存在时执行函数体
            pending[p].f(); //执行取消操作
            pending.splice(p, 1); //把这条记录从数组中移除
        }
    }
};
//熔断器 end

instance.interceptors.request.use(
    (config) => {
        // 前置拦截器
        // 熔断器
        removePending(config); //在一个ajax发送前执行一下取消操作
        config.cancelToken = new cancelToken((c) => {
            // 这里的ajax标识我是用请求地址&请求方式拼接的字符串，当然你可以选择其他的一些方式
            if (!config.url.includes("getDictItemList")) {
                pending.push({
                    u: config.data.queryName + "&" + config.method,
                    f: c,
                });
            }
        });

        if (debugConsole) {
            console.log("[httpService] 请求拦截器", config);
        }
        return config;
    },
    (error) => Promise.error(error)
);

instance.interceptors.response.use(
    (res) => {
        // 后置拦截器
        //熔断器
        removePending(res.config);
        if (debugConsole) {
            console.log("[httpService] 响应拦截器", res);
        }

        return res;
    },
    (error) => {
        const { response } = error;
        if (response) {
            // 请求验证token失效判断
            // code
            // 请求已发出，但是不在2xx的范围
            errorHandle(response.status, response.data.message);
            return Promise.reject(response);
        } else {
            // 处理断网的情况
            // eg:请求超时或断网时，更新state的network状态
            // network状态在app.vue中控制着一个全局的断网提示组件的显示隐藏
            // 关于断网组件中的刷新重新获取数据，会在断网组件中说明
            // store.commit("changeNetwork", false);
        }
    }
);

export const $http = ({ url, method, options }) => {
    return new Promise((resolve, reject) => {
        url = `${url}?v=${Number(new Date())}`;
        let res = { method: method, url: url, ...options };
        instance(res).then(
            (res) => {
                if (res) {
                    resolve(res.data);
                } else {
                    reject(res);
                }
            },
            (err) => {
                reject(err);
            }
        );
    });
};

export const httpServiceMount = (app) => {
    app.config.globalProperties.$http = $http;
};
