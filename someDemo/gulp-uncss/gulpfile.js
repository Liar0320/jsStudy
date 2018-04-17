var gulp = require('gulp'),
	uncss = require('gulp-uncss');
console.log('run');
gulp.task('uncss', function() {
    //冗余css文件
	return gulp.src('./index.css')
		.pipe(uncss({
			//使用css的html页面，可多个
	//	html: [/Common\/.*\/\.html/]
		html: ['./index.html']
		}))
        //输出目录
		.pipe(gulp.dest('./outP'));
});
