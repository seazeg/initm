/*
 * @Author       : Evan.G
 * @Date         : 2022-01-19 15:12:18
 * @LastEditTime : 2022-01-19 16:23:03
 * @Description  :
 */
import { createRouter, createWebHashHistory } from "vue-router";

const routes = [
    { path: "/:catchAll(.*)", redirect: "/" },
    {
        path: "/",
        name: "demo",
        component: () =>
            import(/* webpackChunkName: "demo" */ "@/views/demo/demo.vue"),
    },
];

const router = createRouter({
    history: createWebHashHistory(process.env.APP_SITE_URL),
    routes,
});

router.beforeEach((to, from, next) => {
    next();
});

export default router;
