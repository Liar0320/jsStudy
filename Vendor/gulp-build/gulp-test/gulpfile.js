var gulp = require("gulp");
var concat = require("gulp-concat");
gulp.task("start",function () {
	return  gulp.src(["\\formFilesComponent\\dangzuhuiyi\\dangzuhuiyi.js","\\formFilesComponent\\dangzuhuiyi\\dangzuhuiyijl.js"])
		.pipe(concat("main.js"))
		.pipe(gulp.dest("build"));
});