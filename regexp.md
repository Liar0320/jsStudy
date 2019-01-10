一、元字符

1.     \b     元字符    开头和结尾

2.     .      元字符    匹配除了换行符以外的任意字符

3.     *      元字符    指定*前边的内容可以连续重复使用任意次以使整个表达式得到匹配(0次或多次)

4.     \d     元字符    匹配一位数字

5.     -                匹配连字符本身

6.     字符串           匹配字符串本身

7.     \d\d\d\d\d\d  等同于  \d{6}

8.     \s     元字符    匹配任意的空白符，包括空格，制表符(Tab)，换行符，中文全角空格

9.     \w     元字符    匹配字母或数字或下划线或汉字

10.    +      元字符    匹配1个或更多(1次或多次)

11.    ^     元字符    匹配字符串的开始

12.    $     元字符    匹配字符串的结束

(^$与\b的区别是:前者,必须这个字符串完全符合^$中间的规则。后者,这个字符串只要有匹配的部分就可以)

13.    ？     元字符    匹配零次或一次(0或1)

14.    {n} {n,} {n,m}   指定重复次数(左闭右闭区间)

15.    []     元字符？

16.    ()　　 元字符



二、字符转义

查找元字符本身，需要使用\来解释元字符，\可以取消元字符的特殊意义



三、字符类

使用[]包含想要匹配的字符串

[0-9]代表\d 

[a-z0-9A-Z_]也完全等同于\w（如果只考虑英文的话）



四、分枝条件（|）

|

使用分枝条件时，要注意各个条件的顺序

匹配分枝条件时，将会从左到右地测试每个条件，如果满足了某个分枝的话，就不会去再管其它的条件了



五、分组

()

(\d{1,3}\.){3}\d{1,3}是一个简单的IP地址匹配表达式



六、反义

\W         匹配任意不是字母，数字，下划线，汉字的字符

\S         匹配任意不是空白符的字符

\D         匹配任意非数字的字符

\B         匹配不是单词开头或结束的位置

[^x]       匹配除了x以外的任意字符

[^aeiou]   匹配除了aeiou这几个字母以外的任意字符




七、后向引用

使用小括号指定一个子表达式后，匹配这个子表达式的文本(也就是此分组捕获的内容)可以在表达式或其它程序中作进一步的处理。默认情况下，每个分组会自动拥有一个组号，规则是：从左向右，以分组的左括号为标志，第一个出现的分组的组号为1，第二个为2，以此类推。

后向引用用于重复搜索前面某个分组匹配的文本。例如，\1代表分组1匹配的文本





分组0对应整个正则表达式

实际上组号分配过程是要从左向右扫描两遍的：第一遍只给未命名组分配，第二遍只给命名组分配－－因此所有命名组的组号都大于未命名的组号

你可以使用(?:exp)这样的语法来剥夺一个分组对组号分配的参与权．




八、常用分组语法

分类       代码/语法        说明

捕获       (exp)            匹配exp,并捕获文本到自动命名的组里

            (?<name>exp)    匹配exp,并捕获文本到名称为name的组里，也可以写成(?'name'exp)

            (?:exp)          匹配exp,不捕获匹配的文本，也不给此分组分配组号

零宽断言   (?=exp)          匹配exp前面的位置

            (?<=exp)        匹配exp后面的位置

            (?!exp)          匹配后面跟的不是exp的位置

            (?<!exp)        匹配前面不是exp的位置

注释       (?#comment)      这种类型的分组不对正则表达式的处理产生任何影响，用于提供注释让人阅读



九、零宽断言

\b\w+(?=ing\b)    匹配以ing结尾的单词的前面部分(除了ing以外的部分)

(?<=\bre)\w+\b    匹配以re开头的单词的后半部分(除了re以外的部分)

负向零宽断言

(?<=<(\w+)>).*(?=<\/\1>)    匹配不包含属性的简单HTML标签内里的内容



十、注释

(?#comment)来包含注释。例如：2[0-4]\d(?#200-249)|25[0-5](?#250-255)|[01]?\d\d?(?#0-199)。



十一、贪婪与懒惰

贪婪 匹配尽可能多

a.*b

懒惰 匹配尽可能少

a.*?b  即数量符号后面加上?



十二、处理选项

IgnoreCase(忽略大小写)                 匹配时不区分大小写。

Multiline(多行模式)                     更改^和$的含义，使它们分别在任意一行的行首和行尾匹配，而不仅仅在整个字符串的开头和结尾匹配。(在此模式                                        下,$的精确含意是:匹配\n之前的位置以及字符串结束前的位置.)

Singleline(单行模式)                   更改.的含义，使它与每一个字符匹配（包括换行符\n）。

IgnorePatternWhitespace(忽略空白)       忽略表达式中的非转义空白并启用由#标记的注释。

ExplicitCapture(显式捕获)               仅捕获已被显式命名的组。



十三、平衡组/递归匹配

匹配HTML    <div[^>]*>[^<>]*(((?'Open'<div[^>]*>)[^<>]*)+((?'-Open'</div>)[^<>]*)+)*(?(Open)(?!))</div>











附录：常见正则表达式
1、js端

// [^\da-zA-Z0-9\u4e00-\u9fa5_-]表示除了【数字中文字大小写字母_-】外的任意字符   /g是替换的意思

// 此句完整意思就是 替换value中所有非【数字中文字大小写字母_-】的字符为【""】

var temp = value.replace(/[^\da-zA-Z0-9\u4e00-\u9fa5_-]/g, "");   


--------------------- 
作者：IceDarron 
来源：CSDN 
原文：https://blog.csdn.net/darron_r/article/details/52718526 
版权声明：本文为博主原创文章，转载请附上博文链接！