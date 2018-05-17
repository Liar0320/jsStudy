dom节点操作 node
addEventListener(name,fnc);
removeEventListener(name,fnc);

node 和 element {
    https://www.cnblogs.com/renzm0318/p/8279268.html
    node属性
    nodeType：显示节点的类型
    nodeName：显示节点的名称
    nodeValue：显示节点的值
    attributes：获取一个属性节点
    firstChild：表示某一节点的第一个节点
    lastChild：表示某一节点的最后一个子节点
    childNodes：表示所在节点的所有子节点
    parentNode：表示所在节点的父节点
    nextSibling：紧挨着当前节点的下一个节点
    previousSibling：紧挨着当前节点的上一个节点
    node方法
    asChildNodes()方法：判定一个节点是否有子节点，有返回true，没有返回false
    removeChild()方法：去除一个节点
    appendChild()方法：添加一个节点，如果文档树中已经存在该节点，则将它删除，然后在新位置插入
    replaceChild()方法：从文档树中删除（并返回）指定的子节点，用另一个节点来替换它
    insertBefore()方法：在指定节点的前面插入一个节点，如果已经存在，则删除原来的，然后在新位置插入
    cloneNode()方法：复制一个节点，该方法有一个参数，true表示同时复制所有的子节点，false表示近复制当前节点
}