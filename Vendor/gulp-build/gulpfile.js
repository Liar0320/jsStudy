var fs = require("fs");
var gulp = require("gulp");
var concat = require("gulp-concat");
var cheerio = require("cheerio");


function getSrc() {
	var src = {
		loading:["api-root.js"],
		common:[]
	};

	var data = fs.readFileSync("index.html","utf-8");

	var	$ = cheerio.load(data);

	$("script[name=loading]").each((i,elem)=>{
		src.loading.push($(elem).attr("src"));
	});

	$("script[name!=loading]").each((i,elem)=>{
		src.common.push($(elem).attr("src"));
	});
	// window.onload = function (){
	// 	var script = document.createElement('script');
	// 	script.type = 'text/javascript';
	// 	script.src = 'main.js';
	// 	document.head.appendChild(script);
	// }
	$("script").remove();
	$("body").after(`
		<script src="main.js"></script>
		<script src="common.js"></script>
	`);

	fs.writeFileSync("index.main.html",$.html(),"utf8");
	return src;
}

var src = getSrc();

console.log(src);

gulp.task("loading",function () {
	return  gulp.src(src.loading)
		.pipe(concat("loading.js"))
		.pipe(gulp.dest("build"));
});

gulp.task("common", ["loading"],function () {
	return  gulp.src(src.common)
		.pipe(concat("common.js"))
		.pipe(gulp.dest("build"));
});