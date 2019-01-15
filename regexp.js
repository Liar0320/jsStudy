//https://www.regular-expressions.info/tutorial.html
/// http://www.jb51.net/article/88838.htm      http://www.jb51.net/tools/zhengze.html
/// js正则表达的声明 /a/g.test('abc')---true || new RegExp('a','g').test('abc')---true
/// ***  大写取反,  \s:空白字符,\S:非空白字符,\s\S:任意字符,\d:数字,\w:字符
/// ***  量词：+ 至少出现一次 匹配不确定的次数（匹配就是搜索查找的意思）17
/// *** /g:全局,/i:模糊不区分大小写,
//  /^ : 放在正则的最开始位置，就代表起始的意思，注意  /[^a] /   和   /^[a]/是不一样的，前者是排除的意思，后者是代表首位。
/*
    \b 匹配单词的开始或结束 
    \w 匹配字母或数字或下划线或汉字
*/
/**
 * [\u4e00-\u9fa5]   中文
 * 
 */

// 0-特殊字符：()"    这三个需要转义

// 1-获取指定字符串之后：  (?<=指定字符串)

// 2-获取指定字符串之前： (?=指定字符串)
// '1231.ggf.jpg'.match(/(?<=\.)[^\.]+$/g)
(function(){
	var str = "abcdefghijklmnopqrstuvwxyzabc";
	var str2 = str.replace(/a/g,"9");            
	console.log(str+"\n\r"+str2);
	console.log(str.replace(/[abc]/g,"5"));

	///reg
	var reg = new RegExp("1");
	console.log(reg.test("1我怕"),/1/.test("12312"));
	var reg_2 = new RegExp("2","g");
	console.log("723131231".replace(reg_2,"帅"));

	///  +
	var matchStr = "12345da123sds22af";
	console.log(matchStr.match(/\d+/g),matchStr.match(/\d/g));

	var strDate = "2013-6-7";
	var re1 = /\d-+/g;  // 全局匹配数字，横杠，横杠数量至少为1，匹配结果为：  3- 6-
	var re1 = /(\d-)+/g;  // 全局匹配数字，横杠，数字和横杠整体数量至少为1   3-6-
	var re2  = /(\d+)(-)/g;   //  全局匹配至少一个数字，匹配一个横杠 匹配结果：2013- 6-

	var strTrim = "  asdsad   ";
	console.log("55"+strTrim+"55","55"+strTrim.replace(/^\s+|\s+$/g,"")+"55");

	"translate3d(35px, 18px, 0px)".replace(/[^\d]+/g,","); //取反
})();
//"bower_components/angular-ui-router\\angular-ui-router.js".match(/bower_components[\\\/]([\w-]+)[\\\/]/)[1]
//var reg=new RegExp("(http://www.qidian.com/BookReader/)(\\d+),(\\d+).aspx","gmi");
// var url="http://www.qidian.com/BookReader/1017141,20361055.aspx";

// var rep=url.replace(reg,"$1ShowBook.aspx?bookId=$2&chapterId=$3");

// 你可能注意到了，在reg正则表达式里的几对"()",比如`("(http://www.qidian.com/BookReader/)` ，`(\\d+)`，$n就指的是匹配到的第n个括号里的内容，**$n主要是用在后面的程序需要引用前面的正则匹配到的内容时。**在这个例子里：
// $1 : http://www.qidian.com/BookReader/
// $2 : 1017141
// $3 : 20361055
window.location.search.match(/[^&|?]+/g).map(function(item,index){var obj = item.match(/[^=]+/g);return {[obj[0]]:obj[1]};});