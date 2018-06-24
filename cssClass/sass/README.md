ps: https://www.jianshu.com/p/fa379a309c8a
1. CSS预处理器
    定义了一种新的专门的编程语言，编译后成正常的CSS文件。为CSS增加一些编程的特性，无需考虑浏览器的兼容问题，让CSS更加简洁，适应性更强，可读性更佳，更易于代码的维护等诸多好处。
    CSS预处理器语言：scss（sass）、LESS等
2. Sass和SCSS的区别
    文件扩展名不同：“.sass”和“.scss”；
    Sass是以严格缩进式语法规则来书写的，不带大括号和分号；而SCSS的语法和CSS书写语法类似。
3. Sass安装（Windows版）
    先安装ruby：Ruby 的官网（http://rubyinstaller.org/downloads）下载对应需要的 Ruby 版本
    安装sass：
    方法一（通过命令安装sass）：打开命令终端，输入：gem install sass
    方法二（本地安装sass）：从http://rubygems.org/gems/sass 下载sass安装包，然后在终端输入: “gem install <把下载的安装包拖到这里>” 然后直接额回车即可安装成功。
4. scss语法格式

5. sass编译
    命令编译
    GUI工具编译
    自动化编译
    ----
    sass命令编译（在命令终端输入sass指令来编译sass，最直接，最简单）
    单文件编译：
    sass <filePath>/<fileName>.scss:<filePath>/<fileName>.css
    多文件编译
    sass sass/:css/
    上面的命令表示将项目中“sass”文件夹中所有“.scss”(“.sass”)文件编译成“.css”文件，并且将这些 CSS 文件都放在项目中“css”文件夹中。
    缺点及解决方法：
    缺点：每次保存scss文件后都要重新编译太麻烦；
    解决方法：开启“watch”功能：
    sass --watch <filenPath>/<fileName>.scss:<filePath>/<fileName>.css
    tip:文件路径不要带中文，如果有中文，watch功能无法正常使用。
6. sass输出方式
    a.嵌套输出方式nested
     sass --watch test.scss:test.css --style nested
    b.展开输出方式expanded
     sass --watch test.scss:test.css --style expanded
    c.紧凑输出方式compact
     sass --watch test.scss:test.css --style compact
    d.压缩输出方式compressed
     sass --watch test.scss:test.css --style compressed


