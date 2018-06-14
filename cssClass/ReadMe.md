作者：_leonlee
链接：https://www.jianshu.com/p/d183265a8dad
來源：简书

翻译自 https://css-tricks.com/snippets/css/complete-guide-grid/#prop-grid-column-row

http://www.css88.com/archives/8510#prop-justify-self

http://www.w3cplus.com/blog/tags/355.html

设置在网格容器上的属性

display
grid-template-columns
grid-template-rows
grid-template-areas
grid-column-gap
grid-row-gap
grid-gap
justify-items
align-items
justify-content
align-content
grid-auto-columns
grid-auto-rows
grid-auto-flow
grid


1. display: grid | inline-grid | subgrid;

属性值：
grid: 生成块级网格
inline-grid: 生成行内网格
subgrid: 如果网格容器本身是网格项（嵌套网格容器），此属性用来继承其父网格容器的列、行大小。

注：当元素设置了网格布局，column、float、clear、vertical-align属性无效。


2. grid-template-columns: <track-size> ... | <line-name> <track-size> ... ;
grid-template-rows: <track-size> ... | <line-name> <track-size> ... ;

设置行和列的大小，在行轨道或列轨道两边是网格线。

属性值：
track-size: 轨道大小，可以使用css长度，百分比或用分数（用fr单位）。
line-name: 网格线名字，你可以选择任何名字。

例子：
当你设置行或列大小为auto时，网格会自动分配空间和网格线名称。


3.grid-template-areas

通过获取网格项中的grid-area属性值（名称），来定义网格模版。重复网格区（grid-area）名称将跨越网格单元格，‘.’代表空网格单元。

属性值：
grid-area-name: 网格项的grid-area属性值（名字）
‘.’ : 空网格单元
none: 不定义网格区域

4. grid-column-gap：<line-size>; 和 grid-row-gap: <line-size> ;

网格单元间距。

属性值：
line-size: 网格线间距,设置单位值。

注：间隔仅仅作用在网格单元之间，不作用在容器边缘。

5. grid-gap：<grid-row-gap> <grid-column-gap>;

是grid-column-gap 和 grid-row-gap简写。

6. justify-items: start | end | center | stretch（默认） ;

垂直于列网格线对齐，适用于网格容器里的所有网格项。

属性值：
start: 左对齐。
end: 右对齐。
center: 居中对齐。
stretch: 填满（默认）。


8. justify-content: start | end | center | stretch | space-around | space-between | space-evenly ;

如果用像px非弹性单位定义的话，总网格区域大小有可能小于网格容器，这时候你可以设置网格的对齐方式（垂直于列网格线对齐）。

属性值：
start: 左对齐。
end: 右对齐。
center: 居中对齐。
stretch: 填满网格容器。
space-around: 网格项两边间距相等，网格项之间间隔是单侧的2倍。
space-between: 两边对齐，网格项之间间隔相等。
space-evenly: 网格项间隔相等。


9. align-content: start | end | center | stretch | space-around | space-between | space-evenly ;

如果用像px非弹性单位定义的话，总网格区域大小有可能小于网格容器，这时候你可以设置网格的对齐方式（垂直于行网格线对齐）。

属性值：
start: 顶部对齐。
end: 底部对齐。
center: 居中对齐。
stretch: 填满网格容器。
space-around: 网格项两边间距相等，网格项之间间隔是单侧的2倍。
space-between: 两边对齐，网格项之间间隔相等。
space-evenly: 网格项间隔相等。

11. grid-auto-flow : row（默认） | column | dense ;

在没有设置网格项的位置时，这个属性控制网格项怎样排列。

属性值：
row: 按照行依次从左到右排列。
column: 按照列依次从上倒下排列。
dense: 按先后顺序排列。


12. grid: none | <grid-template-rows> / <grid-template-columns> | <grid-auto-flow> [<grid-auto-rows> [ / <grid-auto-columns>] ];

是一种简写形式，设置网格容器所有属性。

属性值：
none: 设置为所有属性的默认值。
<grid-template-rows> / <grid-template-columns>: 设置行和列的值，其他属性为默认值。
<grid-auto-flow> [ <grid-auto-rows> [ / <grid-auto-columns>] ] : 设置网格自动流、网格自动行、网格自动列的值，其他未设置则为默认值。

1. grid-column-start: <number> | <name> | span <number> | span <name> | auto ;
    grid-column-end: <number> | <name> | span <number> | span <name> | auto ;
    grid-row-start: <number> | <name> | span <number> | span <name> | auto ;
    grid-row-end: <number> | <name> | span <number> | span <name> | auto ;

通过网格线来定义网格项的位置。grid-column-start、grid-row-start定义网格项的开始位置，grid-column-end、grid-row-end定义网格项的结束位置。

属性值：
line: 指定带编号或者名字的网格线。
span <number>: 跨越轨道的数量。
span <name>: 跨越轨道直到对应名字的网格线。
auto: 自动展示位置，默认跨度为1。


2. grid-column: <start-line> / <end-line> | <start-line> / span <value> ;
     grid-row: <start-line> / <end-line> | <start-line> / span <value> ;

是 grid-column-start、grid-column-end 和 grid-row-start、grid-row-end 的简写。

3. grid-area: <name> | <row-start> / <column-start> / <row-end> / <column-end> ;

定义网格项名字，以便创建模块（容器属性grid-template-areas来定义模块）。

属性值：
name: 项目名子。
<row-start> / <column-start> / <row-end> / <column-end>: 可以是数字或网格线名字。


4. justify-self: justify-self: start | end | center | stretch;

定义单个网格项垂直于列网格线的对齐方式。

属性值：
start: 网格区域左对齐。
end: 网格区域右对齐。
center: 网格区域居中。
stretch: 网格区域填满。

提示：也可以在容器上设置justify-items，达到全部网格项对齐。

5. align-self: start | end | center | stretch;

定义单个网格项垂直于行网格线的对齐方式。

属性值：
start: 网格区域顶部对齐。
end: 网格区域底部对齐。
center: 网格区域居中。
stretch: 网格区域填满。

提示：也可以在容器上设置align-items，达到全部网格项对齐。