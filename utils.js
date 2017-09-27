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
        "M+" : date.getMonth()+1,                 //�·�
        "d+" : date.getDate(),                    //��
        "h+" : date.getHours(),                   //Сʱ
        "m+" : date.getMinutes(),                 //��
        "s+" : date.getSeconds(),                 //��
        "q+" : Math.floor((date.getMonth()+3)/3), //����
        "S"  : date.getMilliseconds()             //����
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
 * @param  {[Object]} object [���������]
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
 * Ƶ�ʿ��� ���غ�����������ʱ��fn ִ��Ƶ���޶�Ϊÿ����ʱ��ִ��һ��
 * @param fn {function}  ��Ҫ���õĺ���
 * @param delay  {number}    �ӳ�ʱ�䣬��λ����
 * @param immediate  {bool} �� immediate��������false �󶨵ĺ�����ִ�У�������delay���ִ�С�
 * @return {function}ʵ�ʵ��ú���
 */
function throttle(fn,delay, immediate, debounce) {
    var curr = +new Date(),//��ǰ�¼�
        last_call = 0,
        last_exec = 0,
        timer = null,
        diff, //ʱ���
        context,//������
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
 * ���п��� ���غ�����������ʱ������ʱ�������ڻ���� delay��fn �Ż�ִ��
 * @param fn {function}  Ҫ���õĺ���
 * @param delay   {number}    ����ʱ��
 * @param immediate  {bool} �� immediate��������false �󶨵ĺ�����ִ�У�������delay���ִ�С�
 * @return {function}ʵ�ʵ��ú���
 */
function debounce(fn, delay, immediate) {
    return this.throttle(fn, delay, immediate, true);
}