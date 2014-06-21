/**
 * localStorage 测试脚本
 *
 * @author [soulteary](soulteary@qq.com)
 * @date 2014.06.20
 */
(function () {
    /**
     * 查看浏览器是否支持localStorage
     * @returns {boolean}
     */
    function supportFeatures() {
        try {
            localStorage.setItem("soulteary_check", true);
            localStorage.removeItem("soulteary_check");
            return true;
        } catch (e) {
            return false;
        }
    }

    /**
     * 记录浏览器写入数据，实际写入数据，以及错误信息
     * @returns {{process_write: number, browser_write: number, error: object}}
     */
    function getQuota() {
        try {
            //预先清理环境
            localStorage.clear();
            // 1TB, 显然不可能，因为SQLLite最大支持2GB.
            for (var p = 0, q = 1024; p < q; p++) {
                //1GB, 如果浏览器忠实于实现SQLLite的话
                for (var i = 0, j = 1024; i < j; i++) {
                    //1MB, 填充测试数据
                    for (var m = 0, n = 1024; m < n; m++) {
                        //1KB, 填充测试数据, JS char每个占用4字节
                        localStorage.setItem(i + ":" + m, (new Array(256)).join('c'));
                    }
                }
            }
        } catch (e) {
            //清理测试带来的环境污染
            localStorage.clear();
            return {
                "process_write": p * 1024 * 1024 + i * 1024 + m,
                "browser_write": localStorage.length,
                "error": e
            }
        }
    }

    /**
     * 通过UA获取浏览器和操作系统信息
     * @ref ua@kissy
     * @returns {object}
     */
    function getUA() {
        return (function (e) {
            function g(a) {
                var b = 0;
                return parseFloat(a.replace(/\./g,
                    function () {
                        return 0 === b++ ? "." : ""
                    }))
            }

            function l(a, b) {
                var c;
                b.trident = 0.1;
                if ((c = a.match(/Trident\/([\d.]*)/)) && c[1]) b.trident = g(c[1]);
                b.core = "trident"
            }

            function k(a) {
                var b, c;
                return (b = a.match(/MSIE ([^;]*)|Trident.*; rv(?:\s|:)?([0-9.]+)/)) && (c = b[1] || b[2]) ? g(c) : 0
            }

            function d(a) {
                var b, c = "",
                    d = "",
                    i, h = [6, 9],
                    f,
                    p = n && n.createElement("div"),
                    D = [],
                    s = {
                        webkit: e,
                        trident: e,
                        gecko: e,
                        presto: e,
                        chrome: e,
                        safari: e,
                        firefox: e,
                        ie: e,
                        opera: e,
                        mobile: e,
                        core: e,
                        shell: e,
                        phantomjs: e,
                        os: e,
                        ipad: e,
                        iphone: e,
                        ipod: e,
                        ios: e,
                        android: e,
                        nodejs: e
                    };
                p && p.getElementsByTagName && (p.innerHTML = "<\!--[if IE {{version}}]><s></s><![endif]--\>".replace("{{version}}", ""), D = p.getElementsByTagName("s"));
                if (0 < D.length) {
                    l(a, s);
                    i = h[0];
                    for (h = h[1]; i <= h; i++) if (p.innerHTML = "<\!--[if IE {{version}}]><s></s><![endif]--\>".replace("{{version}}", i), 0 < D.length) {
                        s[d = "ie"] = i;
                        break
                    }
                    if (!s.ie && (f = k(a))) s[d = "ie"] = f
                } else if ((i = a.match(/AppleWebKit\/([\d.]*)/)) && i[1]) {
                    s[c = "webkit"] = g(i[1]);
                    if ((i = a.match(/OPR\/(\d+\.\d+)/)) && i[1]) s[d = "opera"] = g(i[1]);
                    else if ((i = a.match(/Chrome\/([\d.]*)/)) && i[1]) s[d = "chrome"] = g(i[1]);
                    else if ((i = a.match(/\/([\d.]*) Safari/)) && i[1]) s[d = "safari"] = g(i[1]);
                    if (/ Mobile\//.test(a) && a.match(/iPad|iPod|iPhone/)) {
                        s.mobile = "apple";
                        if ((i = a.match(/OS ([^\s]*)/)) && i[1]) s.ios = g(i[1].replace("_", "."));
                        b = "ios";
                        if ((i = a.match(/iPad|iPod|iPhone/)) && i[0]) s[i[0].toLowerCase()] = s.ios
                    } else if (/ Android/i.test(a)) {
                        if (/Mobile/.test(a) && (b = s.mobile = "android"), (i = a.match(/Android ([^\s]*);/)) && i[1]) s.android = g(i[1])
                    } else if (i = a.match(/NokiaN[^\/]*|Android \d\.\d|webOS\/\d\.\d/)) s.mobile = i[0].toLowerCase();
                    if ((i = a.match(/PhantomJS\/([^\s]*)/)) && i[1]) s.phantomjs = g(i[1])
                } else if ((i = a.match(/Presto\/([\d.]*)/)) && i[1]) {
                    if (s[c = "presto"] = g(i[1]), (i = a.match(/Opera\/([\d.]*)/)) && i[1]) {
                        s[d = "opera"] = g(i[1]);
                        if ((i = a.match(/Opera\/.* Version\/([\d.]*)/)) && i[1]) s[d] = g(i[1]);
                        if ((i = a.match(/Opera Mini[^;]*/)) && i) s.mobile = i[0].toLowerCase();
                        else if ((i = a.match(/Opera Mobi[^;]*/)) && i) s.mobile = i[0]
                    }
                } else if (f = k(a)) s[d = "ie"] = f,
                    l(a, s);
                else if (i = a.match(/Gecko/)) {
                    s[c = "gecko"] = 0.1;
                    if ((i = a.match(/rv:([\d.]*)/)) && i[1]) s[c] = g(i[1]),
                        /Mobile|Tablet/.test(a) && (s.mobile = "firefox");
                    if ((i = a.match(/Firefox\/([\d.]*)/)) && i[1]) s[d = "firefox"] = g(i[1])
                }
                b || (/windows|win32/i.test(a) ? b = "windows" : /macintosh|mac_powerpc/i.test(a) ? b = "macintosh" : /linux/i.test(a) ? b = "linux" : /rhino/i.test(a) && (b = "rhino"));
                s.os = b;
                s.core = s.core || c;
                s.shell = d;
                return s
            }

            var f = window,
                n = f.document,
                f = f.navigator,
                b = d(f && f.userAgent || "");
            if ("object" === typeof process) {
                var c, p;
                if ((c = process.versions) && (p = c.node)) b.os = process.platform,
                    b.nodejs = g(p)
            }

            for (var c in b) {
                if (!b[c]) delete b[c];
            }

            return b;
        }());
    }

    /**
     * 创建随机字符串
     * @param strLen
     * @param opt
     * @param cut
     * @returns {string}
     */
    function randomChars(strLen, opt, cut) {
        var chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz1234567890";
        if (opt) {
            switch (opt) {
                case 'NUMBER':
                    chars = "1234567890";
                    break;
                case 'UCASE':
                    chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
                    break;
                case 'LCASE':
                    chars = "abcdefghijklmnopqrstuvwxyz";
                    break;
            }
        }
        if (cut) {
            for (var i = cut.length - 1; i >= 0; i--) {
                chars = chars.replace(cut[i], '');
            }
        }

        var len = chars.length;
        var result = "";
        if (!strLen) {
            strLen = Math.random(len);
        }
        var d = Date.parse(new Date());
        for (var i = 0; i < strLen; i++) {
            result += chars.charAt(Math.ceil(Math.random() * d) % len);
        }
        return  result;
    }

    /**
     * 程序主流程
     * @param params
     * @returns {boolean}
     */
    function process(params) {
        switch (params.mode) {
            case 'server':
                var e = encodeURIComponent,
                    o = new Image();
                //m=>quota msg
                //u=>user agent
                o.src = 'http://zs.com/build/collect.php?m=' + e(params.quota) + '&u=' + e(params.ua) + '&__r=' + randomChars(8);
                o.onload = params.callback.call(this, params.quota);
                o.onerror = function () {
                    alert('fuck!');
                };
                break;
            case 'user':
                //展示数据
                params.callback.call(this, params);
                break;
        }
        return true;
    }

    /**
     * 去掉页面标识，刷新页面
     */
    function refresh(params) {
        params = !params;
        window.location.replace(window.location.href.replace(window.location.href.match(/localStorage=on/), params ? 'localStorage=disabled' : 'localStorage=off'));
    }

    /**
     * 将之前处理过的数据展示出来
     */
    function excel(data) {
        console.log(data,'SHOW')
    }


    /**
     * 正儿八经的处理过程
     *
     * 1.当请求地址包含标识(localStorage=on)的时候，测试并收集结果，代结果反馈完毕，去掉请求地址中的标识，刷新页面。
     * 2.清除测试生成的缓存，报告用户情况。
     */

    //获取UA
    var ua = JSON.stringify(getUA.call(null)),
        quota = false;

    //当请求地址包含localStorage=on时
    if (window.location.search.indexOf('localStorage=on') > -1) {
        //如果浏览器支持localStorage的话
        if (supportFeatures.call(null)) {
            //测试并收集结果
            quota = JSON.stringify(getQuota.call(null));
            //将结果保存下来
            localStorage.setItem('quota', quota);
        }

        //不论是否获取到quota, 都进行数据收集
        return process({'quota': quota, 'ua': ua, 'callback': refresh, 'mode': 'server'});

    } else { //当请求地址不包含localStorage=on的时候
        if (supportFeatures.call(null)) {
            //展示之前的消息
            quota = localStorage.getItem('quota');
            //清理所有数据
            localStorage.clear();
        }

        //展示给用户采集结果
        return process({'quota': quota, 'ua': ua, 'callback': excel, 'mode': 'user'});
    }
})('SOULTEARY 2014.06.20');