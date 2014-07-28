"use strict";

var Gulp = require('gulp'),
    Clean = require('gulp-clean'),
    Uglify = require('gulp-uglify'),
    HtmlReplace = require('gulp-html-replace'),
    Less = require('gulp-less'),
    Rename = require('gulp-rename');


/** 文件路径 **/
var path = {
    "src"  : "./src/",
    "build": "./build/",
    "html" : "index.html",
    "less" : "style.less",
    "css"  : "style.min.css",
    "js"   : {
        "normal": "i18N.js",
        "min"   : "i18N.min.js"
    }
};


/** 默认任务 **/
/** 常规任务:编译模板，压缩图片， **/
Gulp.task('default', ['build-html', 'scripts', 'less'], function () {
    console.log('打完收功。');
});


/** 清理编译完成的样式文件 **/
Gulp.task('clean-css', function () {
    return Gulp.src(path.build + path.css.min, { read: false })
        .pipe(Clean());
});


/** 清理掉编译完成的文件 **/
Gulp.task('clean', function () {
    return Gulp.src(path.build, { read: false })
        .pipe(Clean());
});


/** 清理掉编译完成的脚本文件 **/
Gulp.task('clean-js', function () {
    return Gulp.src(path.build + path.js.min, { read: false })
        .pipe(Clean());
});


/** 组装模板中的引入脚本 **/
Gulp.task('build-html', ['clean'], function () {
    var jsTpl = '<script src="%s' + "?r=" + (new Date() - 0) + '" type="text/javascript"></script>';
    var cssTpl = '<link rel="stylesheet" href="%s' + '?r=' + (new Date() - 0) + '"/>';

    return Gulp.src(path.src + path.html)
        .pipe(HtmlReplace({
            js : {
                src: path.js.min,
                tpl: jsTpl
            },
            css: {
                src: path.css,
                tpl: cssTpl
            }
        }))
        .pipe(Gulp.dest(path.build));
});


/** 压缩脚本 **/
Gulp.task('scripts', ['clean-js'], function () {
    return Gulp.src(path.src + path.js.normal)
        .pipe(Uglify())
        .pipe(Rename(path.js.min))
        .pipe(Gulp.dest(path.build));
});


/** 生成样式 **/
Gulp.task('less', ['clean-css'], function () {
    Gulp.src(path.src + path.less)
        .pipe(Less({compress: true}))
        .pipe(Rename(path.css))
        .pipe(Gulp.dest(path.build));
});
