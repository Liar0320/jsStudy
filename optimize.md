很多初学者总会陷入过分追求性能的误区，而忽略了语义和可读性。如果只谈性能，显然是 for > forEach > map，为什么 for 的性能比较好？读一下 forEach 和 map 的规范就知道了。map 会返回一个等长数组，forEach 不会，所以 forEach 大于 map。但是哪个快和应该使用哪个，并不应该划等号。如果你需要将数组按照某种规则映射为另一个数组，就应该用 map。如果你需要进行简单的遍历，用 forEach 或者 for of。如果你需要对迭代器进行遍历，用 for of.如果你需要过滤出符合条件的项，用 filter.如果你需要先按照规则映射为新数组，再根据条件过滤，那就用一个 map 加一个 filter。不要担心这样会慢，你那点数据量浏览器根本不 care。如果你真的需要考虑性能，或者有 break 的需求，就用 for 吧。但是如果真的到了这一步，你应该不会来问这个问题。另外你的第一个 test case 显然是不合理的，就不解读了。

作者：黑猫
链接：https://www.zhihu.com/question/263645361/answer/271393425
来源：知乎
著作权归作者所有。商业转载请联系作者获得授权，非商业转载请注明出处。

http://ghmagical.com/article/page/id/nXCnaSLsuyWd