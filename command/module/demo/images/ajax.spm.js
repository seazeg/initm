window.SPM_SWITCH = true;
jQuery.ajaxSetup({
    beforeSend: function (request) {
        // 创建一个拦截器，在请求发送出去之前做一次处理
        // if (this.login && !istrsidssdssotoken()) {
        //     request.abort();
        // }
    },
    success: function (data) {
        // 请求成功返回后可做统一处理逻辑的拦截器
        // if (data.isSuccess) {

        // }
        // 执行每个请求的 callback 方法，并传递请求的返回结果
        if (this.callback) {
            this.callback(data);
            SPM(this.SPMC);
        }

    },
    error: function (jqXHR, textStatus, errorThrown) {

    }
});

/**
 * @description 动态加载时初始化SPM
 * @param {*} spm
 */
function SPM(spm) {
    var _spm = $('[spm-c="' + spm + '"]');
    _spm.find('a').each(function (index) {
        $(this).attr('spm-d', index + 1)
    });
    SPM_D();
}


// $.ajax({
//     url: 'http://jf.haier.com/order/extra/queryProvince',
//     login: true, // 如果设置 login 为 true 则在请求前做登录校验
//     SPMC: 'CCC111',
//     callback: function (data) {
//         // 当前请求的成功回调
//         if (data.isSuccess) {
//             var html = ''
//             for (var i in data.data) {
//                 html += `<a href='http://www.xx.com' target='_blank'>${data.data[i]}</a>`
//             }
//             $('.js_new').html(html)
//         }
//     }
// });



/**
 * @description SPM-B初始化
 */
function SPM_B() {
    var point1 = +$('meta[spm-a]').attr('point1')
    var point2 = +$('meta[spm-a]').attr('point2')
    if (point1 > point2) {
        if ($(window).width() > point1) {
            $('[spm-b]').attr('spm-b', $('[spm-b]').attr('spm-b') + '_PC')
        } else if ($(window).width() <= point1 && $(window).width() > point2) {
            $('[spm-b]').attr('spm-b', $('[spm-b]').attr('spm-b') + '_PAD')
        } else {
            $('[spm-b]').attr('spm-b', $('[spm-b]').attr('spm-b') + '_MOBILE')
        }
    } else {
        if ($(window).width() > point2) {
            $('[spm-b]').attr('spm-b', $('[spm-b]').attr('spm-b') + '_PC')
        } else if ($(window).width() <= point2 && $(window).width() > point1) {
            $('[spm-b]').attr('spm-b', $('[spm-b]').attr('spm-b') + '_PAD')
        } else {
            $('[spm-b]').attr('spm-b', $('[spm-b]').attr('spm-b') + '_MOBILE')
        }
    }
}


/**
 * @description SPM-D初始化
 */
function SPM_D() {
    //点击后a标签href重置

    $('body').on('click','a', function (e) {
        if (SPM_SWITCH) {
            var _this = $(this);
            var spmA = $('meta[spm-a]').attr('spm-a');
            var spmB = $('[spm-b]').attr('spm-b');
            var spmC = _this.parents('[spm-c]').attr('spm-c');
            var spmD = _this.attr('spm-d')
            var param = spmA + '.' + spmB + '.' + spmC + '.' + spmD;
            if (_this.attr('href') && _this.attr('href').indexOf("javascript") < 0) {
                if (_this.attr('href').indexOf('spm=') <= 0) {
                    if (_this.attr('href').indexOf('?') > 0) {
                        _this.attr('href', _this.attr('href') + '&spm=' + param)
                    } else {
                        _this.attr('href', _this.attr('href') + '?spm=' + param)
                    }
                }
            }
        }
    })

}


$(function () {
    SPM_B();
    SPM_D();
});