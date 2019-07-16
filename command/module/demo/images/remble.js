(function (doc, win) {
    var docEl = doc.documentElement,
        resizeEvt = 'orientationchange' in window ? 'orientationchange' : 'resize',
        recalc = function () {
            var clientWidth = docEl.clientWidth;
            if (!clientWidth) return;

            if (clientWidth <= 750) {
                docEl.style.fontSize = 100 * (clientWidth / 750) + 'px';
            } else if (clientWidth <= 960 && clientWidth > 750) {
                docEl.style.fontSize = 100 * (clientWidth / 960) + 'px';
            } else {
                docEl.style.fontSize = 100 * (clientWidth / 1366) + 'px';
                if (100 * (clientWidth / 1366) >= 100) {
                    docEl.style.fontSize = 100 + 'px'
                }
            }
        }
    window.onresize = function() {
        recalc();
     }
     window.onload = function() {
        recalc();
     }

    //     addEventListener = function (ele, event, fn) {
    //         if (ele.addEventListener) {
    //             ele.addEventListener(event, fn, false);
    //         } else {
    //             ele.attachEvent('on' + event, fn.bind(ele));
    //         }
    //     }

    // if (!Function.prototype.bind) {
    //     Function.prototype.bind = function () {
    //         if (typeof this !== 'function') {
    //             throw new TypeError(
    //                 'Function.prototype.bind - what is trying to be bound is not callable');
    //         }
    //         var $this = this;
    //         var obj = arguments[0];
    //         var ags = Array.prototype.slice.call(arguments, 1);
    //         return function () {
    //             $this.apply(obj, ags);
    //         };
    //     };
    // }
    // // if (!doc.addEventListener) return;
    // addEventListener(win, resizeEvt, recalc);
    // addEventListener(doc, 'DOMContentLoaded', recalc);
    recalc();
})(document, window);