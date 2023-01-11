const { createProxyMiddleware } = require("http-proxy-middleware");
const express = require("express");
const proxyServer = new express();

proxyServer.use(
    createProxyMiddleware("/api", {
        target: "http://www.baidu.com", // 目标服务器地址
        changeOrigin: true, // 允许跨域
    })
);

module.exports = proxyServer;
