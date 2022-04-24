/*
 * @Author       : Evan.G
 * @Date         : 2021-08-26 14:27:53
 * @LastEditTime : 2022-01-19 16:26:50
 * @Description  :
 */
export const selfComponents = (app) => {
    const requireComponents = require.context("./", true, /\.vue/);
    requireComponents.keys().forEach((fileName) => {
        const reqCom = requireComponents(fileName);
        app.component(reqCom.default.name, reqCom.default || reqCom);
    });
};
