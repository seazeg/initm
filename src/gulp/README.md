# 说明文档

## 一、站点结构说明

```
├─README.md  说明文档
├─package.json  依赖管理文件
├─qd_site  站点根目录
|    ├─config.json  变量配置文件
|    ├─gulpfile.js  gulp主文件
|    ├─src
|    |  ├─shredder  碎片目录
|    |  ├─template  模板目录
|    |  ├─pages     静态页面目录
|    |  |   ├─public    通用页面目录
|    |  |   |   ├─common.js     全局JS
|    |  |   |   ├─common.less   全局less
|    |  |   |   ├─foot.shtml    通用底部资源页面
|    |  |   |   ├─footer.shtml  通用底部页面
|    |  |   |   ├─head.shtml    通用头部资源页面
|    |  |   |   ├─header.shtml  通用头部页面
|    |  |   |   ├─images        通用图片资源
|    |  |   ├─demo      demo页面目录
|    |  |   |  ├─demo.js        当前模块js
|    |  |   |  ├─demo.less      当前模块less
|    |  |   |  ├─demo.shtml     当前模块页面
|    |  |   |  ├─images         当前模块图片资源
|    |  ├─assets    公用资源
|    |  |   ├─libs      方法库
|    |  |   |  ├─ajax.interceptor.js
|    |  |   |  ├─clipboard.min.js
|    |  |   |  ├─hopeui.min.css
|    |  |   |  ├─hopeui.min.js
|    |  |   |  ├─jQuery.min.js
|    |  |   |  ├─jquery.cookie.js
|    |  |   |  ├─pro_exposure.js
|    |  |   |  ├─trs_spm.js
|    |  |   |  ├─videojs
|    |  |   ├─icons     字体图标

```

## 二、开发流程

### 1. 安装依赖

进入项目根目录执行

```shell
npm i -g gulp //全局安一下gulp
npm i -g pnpm //全局安pnpm包管理
pnpm i //安装当前项目依赖
```

### 2. 本地启动

```shell
cd qd_site
gulp debug
```

### 3. 分支都从 dev 分支切出新分支，命名按照：`姓名_模块名_当前日期`，`zhouyong_homepage_20210928`

## 三、开发规范


> 前端代码开发规范(重要) http://192.168.1.29:8090/pages/viewpage.action?pageId=1901212 
> 
> 响应式页面开发规范(重要) http://192.168.1.29:8090/pages/viewpage.action?pageId=1900845

### 1. html

-   静态页公用模块用 ssi 方式引入
    ```html
    <!--#include virtual="public/haier_header.shtml"-->
    ```
-   页面中 html 模块必须要有注释
    ```html
    <!-- 头部 start -->
    <!--#include virtual="public/haier_header.shtml"-->
    <!-- 头部 end -->
    ```
-   所有可能循环的内容（列表等），需要考虑 HTML 结构是否可循环

### 2. js 相关

-   js 代码只能加载于 HTML 代码最后，且放于 `</Body>` 标签内

-   页面首次加载，通过 js 加载首次需要展现的内容时，需要在加载区域添加 loading 提示

-   除必要变量声明、业务嵌码等情况，禁止任何业务逻辑的 js 代码内联(与 HTML 代码混合)

-   js 选择器，必须统一加`js_`前缀， 例：`$('js_save')`

-   必须为大块代码添加注释（例如大的功能模块，后期需要通过置标或服务循环的循环体），小块代码适当注释

-   可用部分 es6 特性，参考 demo.js，如果不需要 es6 转码 js 需要在文件名中加`.ignore`排除

-   类库文件必须放到 libs 中

### 3. css 相关

-   避免 css 嵌入或内联样式

-   根节点 class，必须要加相应模块前缀，例：`homepage_container`

-   模块化注释

-   类库文件必须放到 libs 中

### 4.默认框架

默认用 hopeUI，文档 API 地址：http://seazeg.gitee.io/hopeui/
配套工具，vscode 插件，搜 Quick HopeUI，提供快速 api 查看，代码块自动输出等功能

## 四、 命名规范

-   pages 中静态页面命名，按照 demo 规则即可

## 五、config.json 配置说明

```
siteId: 站点id
userUrl: 个人中心域名
headUrl: 站点域名
apiUrl: 服务域名
cHaierUrl: c.haier.com域名（如：分享插件的域名）
imgUrl: 图片域名
featureID: 产品特性栏目id
loginUrl: 登录页地址
registerUrl: 注册页地址
usercenterUrl: 个人中心首页地址
logOutUrl: 退出登录地址
mpid: 网脉js的mpid
videoUrl: 视频资源域名
downloadUrl: 驱动下载等资源域名
continentID: 海外国家选择维护栏目id
baiduMapApi: 百度地图api
baiduMapAK: 百度地图key
siteSmartSearchId: 全文检索站点栏目id
productCode: 产品code
serviceCode: 服务code
haierstoreCode: 门店code
appDownloadCode: app下载code
specificationDownloadCode: 说明书code
driveDownloadCode: 驱动下载code
newsCode: 新闻code
videosCode: 视频code
guanggaowei: 各广告位id
driverchnlid: 产品详情页驱动下载驱动资源包栏目id
```
