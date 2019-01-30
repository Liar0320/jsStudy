var fs = require('fs');
var gulp = require('gulp');
var concat = require('gulp-concat');
var cheerio = require('cheerio');
var rm = require('rimraf');
var rename = require('gulp-rename');

//压缩工具
var uglify = require('gulp-uglify');
var cleanCss = require('gulp-clean-css');

//排除从index.html中获取的文件 ， 也可以data-engine='ignore';
const excludeFiles = ["modules/api-root.js"];

//需要单独加载的文件夹
const filesExternal = [
    "../images/**",
    "../css/**",
    "../library/approve/**",
    "../library/bootstrap-3.3.5/**" , 
    "../library/layer/layer/**",
    "../library/layer/laydate/**"
]


//从源文件中获取 src 即 所有js的路径。  text整理后的index.html文件 。 css所有需要打包压缩的css文件路径
var origin = getSrc();
var src = origin.src;
var indexHtml = origin.text;
var css = origin.css;

//移除build文件夹
gulp.task('removeFiles',function () {
    return new Promise((resolve,reject)=>{
        if(fs.existsSync('./build')){
            rm('./build',function () {
                resolve('done');
            })
        }else{
            resolve('done1');
        }
    })
    
})

//生成html文件目录结构
gulp.task('runHtml', function () {
    return gulp.src(["../**/*.html","!../node_modules/**/*.html","!../library/**","!../index.lich.html","!../index.html","!../css/**","!../gulp/**"])
        .pipe(gulp.dest('build'));
});

//生成需要单独加载的文件
gulp.task('createrFilesExternal',() =>{
    return gulp.src(filesExternal,{base:'../'})
          .pipe(gulp.dest("build"))
});

//合并压缩css文件
gulp.task('runCss', function () {
    return gulp.src(css)
        .pipe(concat('main.css'))
        .pipe(cleanCss())
        .pipe(rename({suffix: '.min'}))
        .pipe(gulp.dest('build'));
});

//合并压缩js文件  data-ignore='loading'
gulp.task('loading', function () {
    return gulp.src(src.loading)
        .pipe(concat('loading.js'))
        .pipe(gulp.dest('build'))
        .pipe(uglify())
        .pipe(rename({suffix: '.min'}))
        .pipe(gulp.dest('build'));
});

//https://blog.csdn.net/qq_31975963/article/details/83034450
//合并压缩js文件 data-ignore != 'loading'
gulp.task('common',function () {
    return gulp.src(src.common)
        .pipe(concat('common.js'))
        .pipe(gulp.dest('build'))
        .pipe(uglify())
        .pipe(rename({suffix: '.min'}))
        .pipe(gulp.dest('build'));
});

//根据indexHtml生成index.html文件
gulp.task('createrIndex',done =>{
    fs.existsSync(`./build`) || fs.mkdirSync(`./build`);
    fs.writeFileSync('./build/index.html', indexHtml , 'utf8');
    done();
});

//将流程串联起来
gulp.task('all',gulp.series(['removeFiles','runHtml',"createrFilesExternal",'runCss','loading','common','createrIndex']))



function getSrc () {
    var src = {
        loading: [],
        common: []
    };
    var css = [];

    var data = fs.readFileSync('../index.html', 'utf-8');

    var	$ = cheerio.load(data);

    $('script[data-engine=ignore]').each((i, elem) => {
        excludeFiles.push($(elem).attr('src'));
    });

    $('script[data-engine=loading]').each((i, elem) => {
        src.loading.push('../' + $(elem).attr('src'));
    });
  //  console.log(excludeFiles);
    $('script[data-engine!=loading]').each((i, elem) => {
        var temp = $(elem).attr('src');
        if(excludeFiles.includes(temp)) return ;
     
        src.common.push('../' + temp);
    });
   // console.log(src.common);
    src.loading.push('api-root.js');
    $('script[data-engine!=ignore]').remove();

    $('link[data-engine=loading]').each((i,elem) =>{
        var temp = $(elem).attr('href');
        css.push('../' + temp);
    })
    $('link[data-engine=loading]').remove();
    // window.onload = function (){
    // 	var script = document.createElement('script');
    // 	script.type = 'text/javascript';
    // 	script.src = 'main.js';
    // 	document.head.appendChild(script);
    // }
    
    $('head').append(`
        <link rel="stylesheet" href="main.min.css?v=${new Date().getTime()}">
    `)

    
    if($('script').length >0){
        $('script').eq(0).before(`
        <script src="loading.min.js?v=${new Date().getTime()}"></script>
        <script src="common.min.js?v=${new Date().getTime()}"></script>
        <script type="text/javascript" src="/apis/pageoffice.js" id="po_js_main"></script>
    `);
    }else{
        $('body').after(`
            <script src="loading.min.js?v=${new Date().getTime()}"></script>
            <script src="common.min.js?v=${new Date().getTime()}"></script>
            <script type="text/javascript" src="/apis/pageoffice.js" id="po_js_main"></script>
        `);
    }
   
    
   var text = $.html();
    // fs.existsSync(`../build`) || fs.mkdirSync(`../build`);
    // fs.writeFileSync('./index.html',text , 'utf8');



    return {
        src:src,//js
        css:css,//css
        text:text//indexHtml
    };
}


