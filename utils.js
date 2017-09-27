'use strict';

var Utils = {
    is: fIs,
    extend: extend,
    formatTime: formatTime,
    isEmpty: isEmpty,
    throttle: throttle,
    debounce: debounce
};

function fIs(t, v) {
    return Object.prototype.toString.call(v).toLocaleLowerCase() == '[object ' + t + ']';
}

function extend() {
    var options, name, src, copy, copyIsArray, clone;
    var target = arguments[0];
    var i = 1;
    var length = arguments.length;
    var deep = false;

    if (typeof target === 'boolean') {
        deep = target;
        target = arguments[1] || {};
        i = 2;
    }
    if (target == null || (typeof target !== 'object' && typeof target !== 'function')) {
        target = {};
    }

    for (; i < length; ++i) {
        options = arguments[i];
        if (options != null) {
            for (name in options) {
                src = target[name];
                copy = options[name];

                if (target !== copy) {
                    if (deep && copy && (fIs('object',copy) || (copyIsArray = fIs('array',copy)))) {
                        if (copyIsArray) {
                            copyIsArray = false;
                            clone = src && fIs('array',src) ? src : [];
                        } else {
                            clone = src && fIs('object',src) ? src : {};
                        }
                        target[name] = extend(deep, clone, copy);
                    } else if (typeof copy !== 'undefined') {
                        target[name] = copy;
                    }
                }
            }
        }
    }
    return target;
}

function formatTime(date,fmt) {
    if(typeof date !== 'object'){
        date = (new Date(date));
    }
    if(!fmt){
        fmt = "yyyy-MM-dd hh:mm:ss";
    }
    var o = {
        "M+" : date.getMonth()+1,                 //月份
        "d+" : date.getDate(),                    //日
        "h+" : date.getHours(),                   //小时
        "m+" : date.getMinutes(),                 //分
        "s+" : date.getSeconds(),                 //秒
        "q+" : Math.floor((date.getMonth()+3)/3), //季度
        "S"  : date.getMilliseconds()             //毫秒
    };
    if(/(y+)/.test(fmt)) {
        fmt=fmt.replace(RegExp.$1, (date.getFullYear()+"").substr(4 - RegExp.$1.length));
    }
    for(var k in o) {
        if(new RegExp("("+ k +")").test(fmt)){
            fmt = fmt.replace(RegExp.$1, (RegExp.$1.length==1) ? (o[k]) : (("00"+ o[k]).substr((""+ o[k]).length)));
        }
    }
    return fmt;
}

/**
 * isEmpty.
 * @param  {[Object]} object [对象或数组]
 * @return Boolean
 */
function isEmpty(obj){
    for(var name in obj)
    {
        if(obj.hasOwnProperty(name))
        {
            return false;
        }
    }
    return true;
}

/**
 * 频率控制 返回函数连续调用时，fn 执行频率限定为每多少时间执行一次
 * @param fn {function}  需要调用的函数
 * @param delay  {number}    延迟时间，单位毫秒
 * @param immediate  {bool} 给 immediate参数传递false 绑定的函数先执行，而不是delay后后执行。
 * @return {function}实际调用函数
 */
function throttle(fn,delay, immediate, debounce) {
    var curr = +new Date(),//当前事件
        last_call = 0,
        last_exec = 0,
        timer = null,
        diff, //时间差
        context,//上下文
        args,
        exec = function () {
            last_exec = curr;
            fn.apply(context, args);
        };
    return function () {
        curr= +new Date();
        context = this,
            args = arguments,
            diff = curr - (debounce ? last_call : last_exec) - delay;
        clearTimeout(timer);
        if (debounce) {
            if (immediate) {
                timer = setTimeout(exec, delay);
            } else if (diff >= 0) {
                exec();
            }
        } else {
            if (diff >= 0) {
                exec();
            } else if (immediate) {
                timer = setTimeout(exec, -diff);
            }
        }
        last_call = curr;
    }
}
/**
 * 空闲控制 返回函数连续调用时，空闲时间必须大于或等于 delay，fn 才会执行
 * @param fn {function}  要调用的函数
 * @param delay   {number}    空闲时间
 * @param immediate  {bool} 给 immediate参数传递false 绑定的函数先执行，而不是delay后后执行。
 * @return {function}实际调用函数
 */
function debounce(fn, delay, immediate) {
    return this.throttle(fn, delay, immediate, true);
}