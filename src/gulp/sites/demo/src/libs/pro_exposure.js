(function () {
    // 产品曝光在可视化编辑状态下，不需要曝光
    if (window.location.href.indexOf("shedderShow") > 0) {
        return;
    }
    // 获取完整的spm（a、b、c、d），注意与ajax.spm.js里获取完整的spm一致
    function getFullSpm(ele) {
        var _this = ele;
        var spmA = $('meta[spm-a]').attr('spm-a');
        var spmB = $('[spm-b]').attr('spm-b');
        var spmC = _this.parents('[spm-c]').attr('spm-c');
        var spmD = _this.attr('spm-d');
        if (!spmA && !spmB && !spmC) {
            var param = "";
            return param;
        }
        if (!spmD) {
            spmD = _this.index() + 1;
        }
        var param = spmA + '.' + spmB + '.' + spmC + '.' + spmD;
        return param;
    }
    /**
     * 显示在当前视窗的产品加入曝光
     */
    // 产品详情页地址格式
    var proHrefReg = getProDetailUrl();
    // 暂存数组
    var exposurePro = [];
    // 加入曝光定时器
    var joinTime;
    // 开启曝光定时器
    var startExposureTime;
    // ie浏览器版本
    var ieVerson = IEVersion();
    // ie9及以下，切换页面用focus和blur
    if (JSON.stringify(proHrefReg) !== "{}" && !(ieVerson <= 9)) {
        whenPageShow();
        document.addEventListener("visibilitychange", function () {
            if (!document.hidden) {
                whenPageShow();
            } else {
                whenPageHidden()
            }
        });
    } else if (JSON.stringify(proHrefReg) !== "{}") {
        window.onfocus = function () {
            whenPageShow();
        };
        window.onblur = function () {
            whenPageHidden();
        };
    }

    // 页面处于show需执行的方法
    function whenPageShow() {
        // console.log("页面处于show");
        // 开启曝光
        startExposure();
        // 开启上传定时器
        startJoinExposure();
    }
    // 页面处于hidden需执行的方法
    function whenPageHidden() {
        // console.log("页面处于hidden");
        // 切换或关闭页面时，将暂存数组里还没上传曝光的产品，上传曝光；清除上传曝光产品定时器和暂存数组
        joinExposure();
        exposurePro = [];
        clearInterval(joinTime);
        clearInterval(startExposureTime);
    }
    // 开启曝光
    function startExposure() {
        if (!(ieVerson <= 9)) {
            var time = null;
            clearTimeout(time);
            time = setTimeout(function () {
                checkProAddTempArray(document.getElementsByTagName("a"));
            }, 500);
            document.addEventListener('DOMNodeInserted', debounce(function () {
                checkProAddTempArray(document.getElementsByTagName("a"));
            }, 500));
            document.addEventListener('click', debounce(function () {
                checkProAddTempArray(document.getElementsByTagName("a"));
            }, 600));
            document.addEventListener('mousedown', debounce(function () {
                checkProAddTempArray(document.getElementsByTagName("a"));
            }, 600));
            window.addEventListener("resize", debounce(function (e) {
                checkProAddTempArray(document.getElementsByTagName("a"));
            }, 500));
            window.addEventListener("scroll", debounce(function (e) {
                checkProAddTempArray(document.getElementsByTagName("a"));
            }, 500));
            // 除去ie8和火狐的滚动事件（监测非window对象的滚动）
            document.addEventListener("mousewheel", debounce(function (e) {
                checkProAddTempArray(document.getElementsByTagName("a"));
            }, 500));
            // 火狐浏览器滚动事件
            document.addEventListener("DOMMouseScroll", debounce(function (e) {
                checkProAddTempArray(document.getElementsByTagName("a"));
            }, 500));
            // 监听动画完成事件
            document.addEventListener("transitionend", debounce(function (e) {
                checkProAddTempArray(document.getElementsByTagName("a"));
            }, 500));
            document.addEventListener("webkitTransitionEnd", debounce(function (e) {
                checkProAddTempArray(document.getElementsByTagName("a"));
            }, 500));
        } else {
            clearInterval(startExposureTime);
            startExposureTime = setInterval(function () {
                checkProAddTempArray(document.getElementsByTagName("a"));
            }, 500);
        }
    }
    // 开启上传定时器，将暂存数组里存的曝光产品上传，每隔counts将暂存数组里暂存的曝光产品上传，如果不传counts，默认counts为5秒
    function startJoinExposure(counts) {
        if (counts && typeof (counts) == "number") {
            delay = counts;
        } else {
            delay = 5000;
        }
        clearInterval(joinTime);
        joinTime = setInterval(throttle(function () {
            joinExposure();
        }, delay - delay * 0.2, delay), delay);
    }
    // 获取产品详情页地址格式
    function getProDetailUrl() {
        var result = {};
        if (typeof (proUrlExposure) === "undefined") {
            return result;
        }
        result = proUrlExposure;
        // 将数据里consumer之前的内容都去掉，因为产品详情页链接里没有consumer
        for (var key in result) {
            if (key == "null") {
                delete result[key];
            } else {
                result[key] = result[key].replace(/^.*(:)/, "").replace(/^.*(consumer)/, "");
            }
        }
        return result
    }
    // 校验a链接是否是产品详情页地址
    function isProDetailUrl(url) {
        var flag = false;
        var curPageHref = window.location.href;
        var FN = {
            // 判断是否是海尔家用产品
            product: function () {
                for (var key in proHrefReg) {
                    var curUrl = proHrefReg[key] + "(t)?20\\d{6}_\\d*\.shtml";
                    var familyArray = curUrl.split("/");
                    var familyUrl = "";
                    familyUrl += familyArray.join('\\/');
                    if (new RegExp(familyUrl).test(url)) {
                        flag = true;
                        return flag;
                    }
                }
            },
            // 判断是否是海尔生态产品，域名+/eco/20190115_66075.shtml
            eco: function () {
                var ecoRegUrl = "\\/eco\\/20\\d{6}_\\d*\.shtml";
                if (new RegExp(ecoRegUrl).test(url)) {
                    flag = true;
                    return flag;
                }
            },
            // 判断是否是海尔商用产品，域名+/cn/business/......../t20141017_249155.shtml
            business: function () {
                if (url.indexOf("/cn/business") > 0) {
                    var tailPart = url.substring(url.lastIndexOf("/"));
                    var businessRegUrl = "t20\\d{6}_\\d*.shtml";
                    if (new RegExp(businessRegUrl).test(tailPart)) {
                        flag = true;
                        return flag;
                    }
                }
            },
            // 判断是否是卡萨帝产品
            casarte: function () {
                for (var key in proHrefReg) {
                    var curUrl = proHrefReg[key] + "([\\s\\S]*)/" + "(t)?20\\d{6}_\\d*\.shtml";
                    var familyArray = curUrl.split("/");
                    var familyUrl = "";
                    familyUrl += familyArray.join('\\/');
                    if (new RegExp(familyUrl).test(url)) {
                        flag = true;
                        return flag;
                    }
                }
            },
            // 判断是否是统帅产品
            tongshuai: function () {
                for (var key in proHrefReg) {
                    var curUrl = proHrefReg[key] + "(t)?20\\d{6}_\\d*\.shtml";
                    var familyArray = curUrl.split("/");
                    var familyUrl = "";
                    familyUrl += familyArray.join('\\/');
                    if (new RegExp(familyUrl).test(url)) {
                        flag = true;
                        return flag;
                    }
                }
            }
        }
        // 判断是否是海尔官网产品，如果是移动端，只判断是否是家用产品
        if (curPageHref.indexOf("m.haier.com") >= 0 || curPageHref.indexOf("test.haier.com/cnmobile") >= 0 || curPageHref.indexOf("user.haier.com/cnmobile") >= 0) {
            return FN.product() || false;
        }
        if (curPageHref.indexOf("www.haier.com") >= 0 || (curPageHref.indexOf("test.haier.com") >= 0 && curPageHref.indexOf("test.haier.com/cnmobile") < 0) || (curPageHref.indexOf("user.haier.com") >= 0 && curPageHref.indexOf("user.haier.com/cnmobile") < 0)) {
            return FN.product() || FN.eco() || FN.business() || false;
        }
        // 判断是否是卡萨帝产品
        if (curPageHref.indexOf("www.casarte.com") >= 0 || curPageHref.indexOf("testuser.casarte.com") >= 0 || curPageHref.indexOf("user.casarte.com") >= 0) {
            return FN.casarte() || false;
        }
        // 判断是否是统帅产品
        if (curPageHref.indexOf("www.tongshuai.com") >= 0 || curPageHref.indexOf("test.tongshuai.com") >= 0 || curPageHref.indexOf("user.tongshuai.com") >= 0) {
            return FN.tongshuai() || false;
        }
    }
    // 如果当前窗口出现a是产品详情页链接，将a加入暂存数组
    function checkProAddTempArray(obj) {
        // 判断是否是产品详情页，如果是产品详情页加入曝光
        isProDetailPage();
        for (var i = 0; i < obj.length; i++) {
            var element = obj[i];
            var checkInView = isInView(element);
            if (checkInView.isInView) {
                // console.log("在视窗内：" + "---" + relativePathToFullPath(element.getAttribute("href")))
                // 获取当前在视窗内a的链接
                var inViewHref = element.getAttribute("href"),
                    proId = element.getAttribute("data-proid");
                inViewHref = relativePathToFullPath(inViewHref);
                if (proId && Number(proId)) {
                    // 获取改元素的spm值
                    var spm = getFullSpm($(element));
                    checkInView.spm = spm;
                    proAddTempArray(proId, checkInView);
                    continue;
                }
                if (inViewHref) {
                    // 过滤掉链接里的http:、https:、?和后面的参数
                    inViewHref = filterUrl(inViewHref);
                    if (isProDetailUrl(inViewHref)) {
                        // 截取_和.shtml之间的产品id
                        var pid = inViewHref.substring(inViewHref.lastIndexOf("/") + 1, inViewHref.indexOf(".shtml")).replace("t", "");
                        pid = pid.substring(pid.lastIndexOf("_") + 1, pid.length);
                        // 获取改元素的spm值
                        var spm = getFullSpm($(element));
                        checkInView.spm = spm;
                        proAddTempArray(pid, checkInView);
                    }
                }
            }
        }
    }
    // 获取a的绝对路径
    function relativePathToFullPath(url) {
        var a = document.createElement('A');
        a.href = url;
        url = a.href;
        a = null;
        return url;
    };
    // 判断是否访问的是产品详情页
    function isProDetailPage() {
        // 过滤掉链接里的http:、https:、?和后面的参数
        var curUrl = filterUrl(location.href);
        if (isProDetailUrl(curUrl)) {
            // 给产品详情页定义一个位置对象，以便存入暂存数组比较去重
            var objPosition = {
                "posiX": 0,
                "posiY": 0,
                "spm": 0
            }
            // 截取_和.shtml之间的产品id
            var pid = curUrl.substring(curUrl.lastIndexOf("/") + 1, curUrl.indexOf(".shtml")).replace("t", "");
            pid = pid.substring(pid.lastIndexOf("_") + 1, pid.length);
            proAddTempArray(pid, objPosition);
        }
    }
    // 过滤掉链接里的http:、https:、?和后面的参数
    function filterUrl(url) {
        return url.replace(/^http(s)?:/, "").replace(/\?.*/, "");
    }
    // 将当前窗口可见的产品存入暂存数组，pid表示产品id，objInfo表示当前元素的一些位置等信息
    function proAddTempArray(pid, objInfo) {
        var tempObj = {
            "pid": pid,
            "posiX": objInfo.posiX,
            "posiY": objInfo.posiY,
            "left": objInfo.left,
            "top": objInfo.top,
            "spm": objInfo.spm
        }
        if (!tempObj.pid) {
            return;
        }
        // 如果有相同产品，判断是否是同一位置，如果不是同一位置，加入暂存数组
        if (exposurePro.length) {
            var isExist = false;
            for (var i = 0; i < exposurePro.length; i++) {
                // if (tempObj.pid == exposurePro[i].pid && Math.abs(tempObj.posiX - exposurePro[i].posiX) <= 1 && Math.abs(tempObj.posiY - exposurePro[i].posiY) <= 1) {
                //     isExist = true;
                // }
                if (isRecord(tempObj, exposurePro[i])) {
                    isExist = true;
                }
            }
            if (!isExist) {
                exposurePro.push(tempObj);
            }
        } else {
            exposurePro.push(tempObj);
        }
    }
    // 判断是否在同一位置的产品已经记录
    function isRecord(tempObj, exposurePro) {
        var record = false;
        var fn = {
            pid: function () {
                if (tempObj.pid == exposurePro.pid) {
                    record = true;
                    return record;
                } else {
                    record = false;
                    return record;
                }
            },
            posiX: function () {
                if (Math.abs(tempObj.posiX - exposurePro.posiX) <= 1) {
                    record = true;
                    return record;
                } else {
                    if (Math.abs(tempObj.left - exposurePro.left) <= 1) {
                        record = true;
                        return record;
                    } else {
                        record = false;
                        return record;
                    }
                }
            },
            posiY: function () {
                if (Math.abs(tempObj.posiY - exposurePro.posiY) <= 1) {
                    record = true;
                    return record;
                } else {
                    if (Math.abs(tempObj.top - exposurePro.top) <= 1) {
                        record = true;
                        return record;
                    } else {
                        record = false;
                        return record;
                    }
                }
            },
            curspm: function () {
                if (tempObj.spm == exposurePro.spm) {
                    record = true;
                    return record;
                } else {
                    record = false;
                    return record;
                }
            }
        }
        if (tempObj.spm == "") {
            return fn.pid() && fn.posiX() && fn.posiY();
        } else {
            return fn.pid() && fn.curspm();
        }
        
    }
    // 加入曝光
    function joinExposure() {
        var obj = exposurePro;
        // console.log("每隔5s加入曝光-----总数：" + obj.length);
        if (obj && obj.length) {
            var joinExposureObj = [],
                tempobj = {};
            for (var i = 0; i < obj.length; i++) {
                if (obj[i].isExposure) {
                    continue;
                }
                tempobj = {
                    eventItem: obj[i].pid, // 产品id
                    eventItemName: "", // 产品名称
                    eventItemType: "", // 产品一级大类+"."+产品二级大类
                    customParam: {
                        commodity_label: "" // 产品标签
                    }
                }
                joinExposureObj.push(tempobj);
            };
            if (joinExposureObj.length) {
                // console.log("即将加入曝光产品", JSON.stringify(joinExposureObj));
                TA17Obj.track({
                    "eventKey": "e_commodityExposure",
                    "trackInfos": joinExposureObj
                });
                // 加入曝光后，将已经加入曝光的产品设置已曝光标志，重新存入暂存数组
                var finishExposurePro = exposurePro;
                for (var i = 0; i < finishExposurePro.length; i++) {
                    finishExposurePro[i].isExposure = true;
                }
                exposurePro = finishExposurePro;
                // console.log("已曝光产品", JSON.stringify(finishExposurePro));
            }
        }
    }
    // 获取元素的任意 CSS 属性值。
    function getStyle(element) {
        if (element.currentStyle) {
            return element.currentStyle;
        } else {
            return getComputedStyle(element, false);
        }
    }
    // 判断元素是否在视窗内
    function isInView(element) {
        var result = {};
        var elePosition = element.getBoundingClientRect();
        // elePosition为Domrect对象，ie8下不能obj[key]=value赋值，所以设置一个普通对象
        var tempObj = {};
        for (var key in elePosition) {
            tempObj[key] = ~~elePosition[key]
        }
        tempObj.posiX = ~~(tempObj.left + Math.max(document.documentElement.scrollLeft, document.body.scrollLeft));
        tempObj.posiY = ~~(tempObj.top + Math.max(document.documentElement.scrollTop, document.body.scrollTop));
        var elementW = tempObj.width;
        var elementH = tempObj.height;
        var windowH = ~~(window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight); // 浏览器高度兼容写法
        var windowW = ~~(window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth); // 浏览器宽度兼容写法
        if (tempObj.posiX > windowW || tempObj.posiY + elementH < 0) {
            result.isInView = false;
            return result;
        }
        var style = getStyle(element);
        if (style.display === 'none' || style.visibility === 'hidden' || style.opacity === 0) {
            result.isInView = false;
            return result;
        }
        var elementPoints = {
            'center': {
                x: tempObj.left + elementW / 2,
                y: tempObj.top + elementH / 2
            },
            'top-left': {
                x: tempObj.left + 2,
                y: tempObj.top + 2
            },
            'top-right': {
                x: tempObj.right - 2,
                y: tempObj.top + 2
            },
            'bottom-left': {
                x: tempObj.left + 2,
                y: tempObj.bottom - 2
            },
            'bottom-right': {
                x: tempObj.right - 2,
                y: tempObj.bottom - 2
            }
        }

        if (tempObj.top >= windowH || tempObj.bottom < 0 || tempObj.left >= windowW || tempObj.right < 0) { // 在视窗外
            result.isInView = false;
            return result;
        }
        for (index in elementPoints) {
            var point = elementPoints[index];
            var pointContainer = document.elementFromPoint(~~point.x, ~~point.y);
            if (pointContainer !== null) {
                do {
                    if (pointContainer === element) {
                        result.isInView = true;
                        result.posiX = tempObj.posiX;
                        result.posiY = tempObj.posiY;
                        result.left = tempObj.left;
                        result.top = tempObj.top;
                        return result;
                    };
                } while (pointContainer = pointContainer.parentNode);
            }
        }
        if (tempObj.top <= 0 && tempObj.bottom >= windowH) {
            var pointNew = {
                x: tempObj.left + elementW / 2,
                y: windowH / 2
            };
            var pointContainerNew = document.elementFromPoint(~~pointNew.x, ~~pointNew.y);
            if (pointContainerNew !== null) {
                do {
                    if (pointContainerNew === element) {
                        result.isInView = true;
                        result.posiX = tempObj.posiX;
                        result.posiY = tempObj.posiY;
                        result.left = tempObj.left;
                        result.top = tempObj.top;
                        return result;
                    };
                } while (pointContainerNew = pointContainerNew.parentNode);
            }
        }
        result.isInView = false;
        return result;
    }
    // 去除抖动，用于window的resize、scroll事件，动作结束delay时间之后再执行代码
    function debounce(fn, delay) {
        var args = arguments,
            context = this,
            timer = null;
        return function () {
            if (timer) {
                clearTimeout(timer);
                timer = setTimeout(function () {
                    fn.apply(context, args);
                }, delay);
            } else {
                timer = setTimeout(function () {
                    fn.apply(context, args);
                }, delay);
            }
        }
    }
    // 函数节流，用于每隔一定时间执行某段代码
    function throttle(fn, delay, atleast) {
        var timer = null;
        var previous = null;
        return function () {
            var now = +new Date();
            if (!previous) previous = now;
            if (atleast && now - previous > atleast) {
                fn();
                // 重置上一次开始时间为本次结束时间
                previous = now;
                clearTimeout(timer);
            } else {
                clearTimeout(timer);
                timer = setTimeout(function () {
                    fn();
                    previous = null;
                }, delay);
            }
        }
    }
    // 判断ie版本
    function IEVersion() {
        var userAgent = navigator.userAgent; //取得浏览器的userAgent字符串
        var isIE = userAgent.indexOf("compatible") > -1 && userAgent.indexOf("MSIE") > -1; //判断是否IE<11浏览器
        var isEdge = userAgent.indexOf("Edge") > -1 && !isIE; //判断是否IE的Edge浏览器
        var isIE11 = userAgent.indexOf('Trident') > -1 && userAgent.indexOf("rv:11.0") > -1;
        if (isIE) {
            var reIE = new RegExp("MSIE (\\d+\\.\\d+);");
            reIE.test(userAgent);
            var fIEVersion = parseFloat(RegExp["$1"]);
            if (fIEVersion == 7) {
                return 7;
            } else if (fIEVersion == 8) {
                return 8;
            } else if (fIEVersion == 9) {
                return 9;
            } else if (fIEVersion == 10) {
                return 10;
            } else {
                return 6; //IE版本<=7
            }
        } else if (isEdge) {
            return 'edge'; //edge
        } else if (isIE11) {
            return 11; //IE11
        }
    }
})();
//解决ie下console.log()报错问题
window.console = window.console || (function () {
    var c = {};
    c.log = c.warn = c.debug = c.info = c.error = c.time = c.dir = c.profile = c.clear = c.exception = c.trace = c.assert = function () {};
    return c;
})();

// collect_data.js start
(function () {
    // 数据采集在可视化编辑状态下，不需要采集
    if (window.location.href.indexOf("shedderShow") > 0) {
        return;
    }
    if (document.addEventListener) {
        document.addEventListener("click", function (e) {
            var element = e.target;
            // 判断元素是否含有监测事件，如果有监测事件执行监测事件
            checkMonitor(element);
        });
    } else {
        document.attachEvent("onclick", function (e) {
            var element = window.event.srcElement;
            // 判断元素是否含有监测事件，如果有监测事件执行监测事件
            checkMonitor(element);
        });
    }
    // 判断元素是否含有监测事件，如果有监测事件执行监测事件
    function checkMonitor(element) {
        do {
            if (element == document) {
                return;
            }
            var type = element.getAttribute("data-monitor-type");
            if (type) {
                getMonitorData(type, element);
                return;
            }
        } while (element = element.parentNode);
    }
    // 根据事件类别，获取相应的属性
    function getMonitorData(type, element) {
        switch (type) {
            // 点击筛选页
            case "e_filterPage":
                var attrArray = ["filter_name", "filter_category", "filter_category_id", "filter_option", "filter_option_id"];
                // 产品类别
                var other = {
                    "eventItemType": element.getAttribute("eventItemType")
                };
                monitorData(type, element, attrArray, other);
                break;
                // 点击活动页
            case "e_activityPage":
                var attrArray = ["activity_id", "activity_name"];
                monitorData(type, element, attrArray);
                break;
                // 点击专区页
            case "e_zonePage":
                var attrArray = ["zone_id", "zone_name"];
                monitorData(type, element, attrArray);
                break;
                // 分享事件
            case "e_share":
                var attrArray = ["commodity_id"];
                monitorData(type, element, attrArray);
                break;
                // 添加购物车
            case "e_addShoppingCart":
                var attrArray = ["commodity_id"];
                monitorData(type, element, attrArray);
                break;
                // 商品对比事件
            case "e_commodityCompare":
                var attrArray = ["commodity_id"];
                monitorData(type, element, attrArray);
                break;
                // 站外购买事件
            case "e_outsideBuy":
                var attrArray = ["shop_name", "commodity_id"];
                monitorData(type, element, attrArray);
                break;
                // 下载产品说明书事件
            case "e_downloadProductManual":
                var attrArray = ["commodity_first_class", "commodity_secondary_class", "commodity_third_class", "download_type"];
                monitorData(type, element, attrArray);
                break;
                // 海尔应用中心事件
            case "e_applicationCenter":
                var attrArray = ["app_name", "app_version", "app_update_time", "download_type"];
                monitorData(type, element, attrArray);
                break;
                // 下载电脑驱动事件
            case "e_downloadComputerDrive":
                var attrArray = ["commodity_first_class", "commodity_secondary_class", "commodity_third_class", "download_type"];
                monitorData(type, element, attrArray);
                break;
                // 用户操作定位查询优惠券事件
            case "e_queryAddressCoupon":
                var attrArray = ["address_province", "address_city"];
                monitorData(type, element, attrArray);
                break;
        }
    }
    // 上传监测数据
    function monitorData(type, element, attrArray, other) {
        var param = {};
        for (var i = 0; i < attrArray.length; i++) {
            var key = attrArray[i];
            param[key] = element.getAttribute(key);
        }
        // 产品对比事件，产品id传数组
        if (type == "e_commodityCompare") {
            param["commodity_id"] = JSON.parse(param["commodity_id"]);
        }
        // 如果是点击了活动，判断是否是活动页链接，如果是活动，才传给网脉
        if (type == "e_activityPage") {
            var href = element.getAttribute("href");
            if (href.indexOf("yxhd") < 0 || href.indexOf("markets") < 0) {
                return;
            }
        }
        // 筛选页需要多传两个字段
        if (type == "e_filterPage") {
            // console.log(type + "====" + JSON.stringify(param) + "###eventItemType###" + other.eventItemType);
            TA17Obj.track({
                "eventKey": type,
                "eventItemType": other.eventItemType, // 产品类别（一级品类.二级品类）
                "trackInfos": [{
                    "customParam": param
                }]
            });
        } else {
            // console.log(type + "====" + JSON.stringify(param));
            TA17Obj.track({
                "eventKey": type,
                "trackInfos": [{
                    "customParam": param
                }]
            });
        }
    }
})();
// collect_data.js end