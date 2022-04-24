/*
 * @Author       : Evan.G
 * @Date         : 2022-01-19 15:12:18
 * @LastEditTime : 2022-01-19 17:53:00
 * @Description  :
 */
import { createApp } from "vue";
import App from "@/App.vue";
import router from "@/router";
import store from "@/store";

import Antd from "ant-design-vue";
import "ant-design-vue/dist/antd.css";

import { selfComponents } from "@/components/";
import { httpServiceMount } from "@/utils/httpService";
import { utilityMount } from "@/utils/utility";

import "@/styles/base.less";
import "@/styles/theme.less";

const app = createApp(App);
selfComponents(app);
httpServiceMount(app);
utilityMount(app);

window.debugConsole = true; //请求拦截器debug

app.use(store).use(router).use(Antd).mount("#app");
