jQuery.support.cors=true;
$.ajaxSetup({
    crossDomain: true,
	xhrFields: {
        withCredentials: true // 携带跨域cookie
    },

    beforeSend: function (request) {
        //登录拦截器
        if (this.login && !istrsidssdssotoken()) {
            request.abort();
        }
        //CSRF拦截器
        if (this.CSRF || 1) {
            var date = new Date();
            date.setTime(date.getTime() + 10 * 1000)
            var cred = generateMixed(10)
            var node = generateMixed(8)
            $.cookie(node, cred, {
                'path': '/',
                // 'domain': selfOption.cookieDomain,
                 'domain': document.domain.split('.').slice(-2).join('.'),
                'expires': date
            })
            request.setRequestHeader('cch', cred + '_' + node)
        }

        if (this.applicationType) {
            request.setRequestHeader("Content-Type", "application/json; charset=utf-8")
        }
    },
    success: function (data) {
        if (this.callback) {
            this.callback(data);
            SPM(this.SPMC);
        }
    },
    complete: function (XMLHttpRequest, textStatus) {

    },
    error: function (jqXHR, textStatus, errorThrown) {

    }
});

/**
 * @description 随机值
 * @param {*} n 位数
 */
function generateMixed(n) {
    var res = "";
    var chars = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'A', 'B', 'C', 'D', 'E', 'F', 'G'];
    for (var i = 0; i < n; i++) {
        var id = Math.ceil(Math.random() * (chars.length - 1));
        res += chars[id];
    }
    return res;
}

/**
 * @description 登录判断
 */
function istrsidssdssotoken() {
    var trsidssdssotoken = "ssotoken"; //同域Cookie
    var sdssotoken = $.cookie(trsidssdssotoken);
    if (sdssotoken != null && sdssotoken != '') {
        return true;
    } else {
        return false;
    }
}