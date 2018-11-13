chrome 下可安装 
AngularJs Batarang
"C:\Program Files (x86)\Google\Chrome\Application\chrome.exe" -enable-easy-off-store-extension-install
关于angular.js 1.x? 
    脏检测机制,
        将原对象赋值一份快照。在某个时间，在某个时间，遍历比较这个对象和快照(新旧值)，如果不一样就执行某些操作。
    angular中的脏检查：
　　    1.不会检查所有的对象。当对象被绑定到html会检查，手动$scope.$watch()的会检查。检查的手段           就是为这些对象创建（watcher）对象。并push到（watcher队列）
        2.不会检查所有的属性。只要被绑定的属性才会被注册。 在angular程序初始化时，会将绑定的对象   的属性添加为监听对象（watcher），也就是说一个对象绑定了N个属性，就会添加N个watcher。
        脏检测通过两个方法触发：$digest(), $apply()
    　　$digest：是遍历当前作用域以及其子作用域的$$watchers队列，并执行其listener。
        $apply：是对$digest()的封装。接受一个函数参数（包含脱离angular环境的逻辑，需要却不会自         己触发脏检测， 所以$apply帮他触发一下。），$apply在执行了参数函数之后自动调用          $rootScope.$digest (就是从更作用于开始遍历每一个$scope.$$watchers队列)
    在一个脏检测中，digest至少会执行两次。
        因为某一个监听属性的listener可能会改变另一个监听属性的值。因此，angular需要在一次$digest()之后判断这一轮digest中时候有没有属性发生变化并执行了listener，如果有，angular必须再次调用$digest()；当已经连续触发了10次$digest()，若还有属性发生变化，angular就会认为你的逻辑错了并console报告。因此在$scope.$watch时要自己多加注意理解好逻辑问题。
    angular会触发脏检测的有以下：
        controller 初始化
        几乎所有ng-开头的事件(ng-click,ng-change...)
        http请求
        $timeout,$interval
        手动调用$apply(), $digest()


    对angular-ui-router的了解
    底层都是  $stateChangeStart 开始注册  然后 通过
    $stateChangeSuccess  进行销毁
    $locationChangeSuccess 调用function update(evt) {} 最后进行对路由 是否存在改变url 一层管控  进行视图的更新。

    中间有两个入口 一个  $browser.onUrlChange(function(newUrl, newState) {}
    另外一个 transition.to


关于 $watch() $watchCollection() 和$watch(...,true)的区别

#$watch --false
$watch(watchExpression,(newValue,oldValue,scope){},false);
当模型的引用或者值发生变化时生产效果
$scope.myArray = [];
$scope.myArray = null;
$scope.myArray = someOtherArray;

#$watchCollection()
针对对象属性的浅层监视(Shallow Watch)，当属性发生变化时触发(对于数组，指的是监视数组的元素；对于字典对象，指的是监视其属性) 触发listener的回调操作。
$scope.myArray.push({});
$scope.myArray.splice(0,1);
$scope.myArray[0] = {};

#$watch --true
$watch(watchExpression,(newValue,oldValue,scope){},true);
将由以上所有内容触发：
$scope.myArray[0].someProperty = "someValue";


#$watchGroup（watchExpressions，listener）;

watchExpressions是数组类型

如果要监听多个变量就要写很多个watch，这显然不是很好的作用。

使用$watchGroup可同时监听多个变量，如果任一一个变量发生变化就会触发listener。




#scope 指令的作用域

    可选 ，默认是false 
    false: 使用父作用域，指令中对属性的修改，会直接 作用到父级作用域中 
    true: 从父作用域继承 ，并创建一个新的作用域对象 ，指令 中可以访问 父级的作用域，修改不会影响 到父级 
    {}: 创建一个隔离作用域，不能访问 父级的作用域，修改也不会影响 到父级

#隔离作用域的绑定策略

    @： 本地作用域属性 ，使用@符号将子级作用域同DOM属性的值进行绑定。子级作用域可以
        使用父级作用域的变量，但内部作用域的变量改变，不会影响外部作用域的绑定变量， 
        即单向绑定。   ***注意绑定的方式{{变量}}***
    =： 双向绑定：通过=可以将子级作用域上的属性同父级作用域上的属性进行双向的数据绑定。
        就像普通的数据绑定一样，子级作用域上会属性变量变化会引起父级作用域上数据模型中的改变，
        即双向绑定。 ***注意绑定的方式{{变量}}***
    & 与父级的方法绑定

#   ng-model
    https://segmentfault.com/a/1190000016807866
    c.$valudators.xxx = function(moduleValue,viewValue){
        if (){
            return true;
        }else{
            return false;
        }
    }

    c.$asyncValidators.xxx = function(moduleValue,viewValue){
        var d = $q.defer();
        $http.get(url,config)
            .then(function(){
                d.resolve();
            },function(){
                d.reject();
            })
            return promise();
    }

