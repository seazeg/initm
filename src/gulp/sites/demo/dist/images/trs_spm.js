window.SPM_SWITCH = true;

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

    $('body').on('click', 'a', function (e) {
        if (SPM_SWITCH) {
            var _this = $(this);
            var spmA = $('meta[spm-a]').attr('spm-a');
            var spmB = $('[spm-b]').attr('spm-b');
            var spmC = _this.parents('[spm-c]').attr('spm-c');
            var spmD = _this.attr('spm-d');
            if (!spmD) {
                spmD = _this.index() + 1;
            }
			if(spmB){
				var param = spmA + '.' + spmB + '.' + spmC + '.' + spmD;
				if (_this.attr('href') && _this.attr('href').indexOf("javascript") < 0 && _this.attr('href')[0] != '#') {
					if (_this.attr('href').indexOf('spm=') <= 0) {
						if (_this.attr('href').indexOf('?') > 0) {
							_this.attr('href', _this.attr('href') + '&spm=' + param)
						} else {
							_this.attr('href', _this.attr('href') + '?spm=' + param)
						}
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