作者：_leonlee
链接：https://www.jianshu.com/p/d183265a8dad
來源：简书

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

