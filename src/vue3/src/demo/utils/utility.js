/*
 * @Author       : Evan.G
 * @Date         : 2021-12-24 15:47:00
 * @LastEditTime : 2022-01-19 15:53:21
 * @Description  :
 */
import _ from "lodash";
import $ from "jquery";

window._ = _;
window.$ = $;

const $u = {};

export const utilityMount = (app) => {
    app.config.globalProperties.$u = $u;
};
