/*
 * @Author       : Evan.G
 * @Date         : 2022-01-19 15:12:18
 * @LastEditTime : 2022-01-20 11:22:19
 * @Description  :
 */
import { createStore } from "vuex";
import user from "./modules/user";

export default createStore({
    modules: {
        user,
    },
});
