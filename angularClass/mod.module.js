/*
	ng frame define
	auth: XP
	time: 2018.6.14
*/
!(function(api) {
	var theApp = angular.module('myApp', [
		'retrieve',
		'registerSuccess',
		'register',
		'login',
		'company',
		'crew',
	    'preHome',
		'home',
		'hsj',
		'institution',
		'prompt',
		'notFound',
		'noticeDetail',
		'ConfigData',
		'APIData',
		'ui.router',
		'ui.bootstrap',
		'myComponent',
		'ngLocale',
		'util.serviceModel',
		'validation',
		'validation.rule',
		'directiveModel'
	]);
	// 数据
	var _config = {
		courseSearch: {// 缓存搜索条件  
			timeSortType:1,// 时间排序: 1 最新, 0 最旧
			salarySortType:'',// 金钱排序, 按照价格高低排序
			pageNo:1,// 当前页码
			companyName: "", //培训机构名称
			itemTypeCodeList: [], // 大类
			itemCodeObjList:[],// 培训课程对象数组
			endApplyTime: "", // 报名截止时间
			trainPrice:"[]"// 培训费用
		},
		api:api,
		userTypes: ['0', '1', '2', '3', '4', '5', '6'], // 开放的用户类型
		userType: window.localStorage.getItem('userType') || "", // 用户类型
		loginAgoUrl: {
			url: '',
			hasLoginGoUrl: '' // 上个页面的hash
		},
		isLogin: false,
		userName: window.localStorage.getItem("userName") || '',
		loginAgoHash: "", // 当前页面的hash
		fileRoot: api.fileRoot, //文件路径
		topMenu: "",
		privacyMenu: "",
		setTopMenu: function(meun) {

		},
		setPrivacyMenu: function(meun) {
			for(var i = 0; i < _config.privacyData.length; i++) {
				if(_config.privacyData[i].u == meun) {
					_config.privacyMenu = meun;
					break;
				}
			}
		},
	};
	angular.module('ConfigData', []).value("ConfigData", _config);

	theApp.config(['$qProvider', function($qProvider) {
		$qProvider.errorOnUnhandledRejections(false);
	}]);

	theApp.provider('routerHelp',['$stateProvider',function($stateProvider){
		var createRouter = function(params,$state){
			var statesCol = [];
			params.forEach(function(item){
				var confName = item.templateUrl.split('/').pop().split('.')[0];
				var menus = {
					title: item.title,
					stateName:item.stateName||('home.'+confName),
				};
				if($state&&$state.get(menus.stateName)) return statesCol.push(menus);
				var url = '/'+confName;
				if(item.params){
					for (var i = 0; i < item.params.length; i++) {
						url += '/:'+item.params[i];
					}
				}
				$stateProvider.state(menus.stateName,{
					url: url,
					// controller:'',
					title: item.title,
					templateUrl:item.templateUrl,
					//resolve:{}
				});
				statesCol.push(menus);
			});
			return statesCol;
		};

		this.createRouter = createRouter;
		this.$get = function(){
            return createRouter;
        };
	}]);

	theApp.factory('httpInterceptor',['$q','$injector',function($q,$injector){
		return{
			request:(config)=>{
                return config;
            },
            requestError:(err)=>{
                return $q.reject(err);
            },
            response:(res)=>{
                return res;
            },
            responseError:(err)=>{
				var $state = $injector.get('$state');
				$state.go('notFound');
                return $q.reject(err);
            }
		}
	}])

	theApp.config(['$stateProvider','$locationProvider', '$urlRouterProvider',
			function($stateProvider,$locationProvider, $urlRouterProvider) {
		$locationProvider.hashPrefix('');
		$urlRouterProvider.when('', 'home/courseList'); //当url为空
		$urlRouterProvider.otherwise('preHome/courseList'); //当url无法识别 

		$stateProvider.state('home',{
			url:'/home',
			// controller:'',
			title: '首页',
			templateUrl:'page/home/home.html',
		});
	
	}]);

	theApp.config(['$provide',function($provide){
		$provide.decorator('$state',['$delegate','routerHelp',function($delegate,routerHelp){
			var state = angular.copy($delegate);
			$delegate.transitionTo = function(to){
				var _arguments = arguments;
				console.log(to,_arguments);
				if(_arguments.length>2){
					var params = [];
					params.objkeys = [];
					for (var i = 1; i < _arguments.length-1; i++) {
						if(!_arguments[i]) continue;
						params.push(_arguments[i]);
						Object.keys(_arguments[i]).forEach(function(item){
							params.objkeys.push(item);
						});
					}
				}
				if(angular.isString(to)){
					if(to.indexOf('.html')>-1){
						var conf = [{
							templateUrl:to,
							params:params.objkeys
						}];
						var router = routerHelp(conf,state);
						state.transitionTo(router[0].stateName||'notFound',params[0]);
					}else{
						state.transitionTo.apply(null,_arguments);
					}
				}else{
					state.transitionTo(state.get(to.self.name)?to.self.name:'notFound');
				}
		
			};
			return $delegate;
		}]);
	}]);

	theApp.run(['$rootScope','$location','$state' ,"SIGN", "ConfigData",'routerHelp','routerCollections','enableRouters', function($rootScope,$location,$state, SIGN, ConfigData,routerHelp,routerCollections,enableRouters) {
		
	
		var userType = window.localStorage.getItem('userType');
		if(userType !== undefined&&(userType !== null)){
			var isTrainSystemAdmin = window.localStorage.getItem('isTrainSystemAdmin');
			var menuRouters = getMenuListName(userType,isTrainSystemAdmin,routerCollections,enableRouters);
			ConfigData.menuList = routerHelp(menuRouters,$state);
			//console.log();
		}
		if(enableRouters.common){
			routerHelp(getRouters(enableRouters.common),$state);
		}

		//从数组中获取对象 根据 这个对象的某个 key 和 value
		function objInArr(arr,key,value){
			var result = [];
			arr.forEach(function(item){
				if(item[key] === value) result.push(item);
			});
			return result;
		}

		function getRouters(router){
			var menuList = [];
			router.menus.forEach(function(item){
				menuList = menuList.concat(objInArr(routerCollections,'id',item));
			});
			if(router.type) menuList = menuList.concat(objInArr(routerCollections,'type',router.type));
			duplicateRemove(menuList);
			return menuList;
		}

		function duplicateRemove(arr){
			var duplicate = [];
			arr.forEach(function(item,index){
				if(duplicate.indexOf(item.id)>-1){
					arr.splice(index,1);
				}else{
					duplicate.push(item.id);
				}
			});
		}


		//userType  
		//isTrainSystemAdmin
		//menuObject
		//homeData
		//ConfigData
		//获取根据 权限 获取路由
		function getMenuListName(userType,isTrainSystemAdmin,routerCollections,enableRouters){

			if(userType === null||userType===undefined) return [];
			for (var key in enableRouters) {
				if(key==='common') continue;
				if (enableRouters.hasOwnProperty(key)) {
						var items = enableRouters[key].power;
						if(isTrainSystemAdmin){
						for (var i = 0; i < items.length; i++) {
							var item = items[i];
							if(typeof(item) != "object") continue;
							if(item.admin.indexOf(userType)>-1) return getRouters(enableRouters[key]);
						}
						} 
						if(items.indexOf(userType*1)>-1){
						return getRouters(enableRouters[key]);
						}
				}
			}

			return [];
		}
	
		
		$rootScope.$on('$stateChangeStart', function(event, toState, toParams, fromState, fromParams) {

			if(ConfigData.userTypes.indexOf(ConfigData.userType) < 0) {
				for(var k in window.localStorage) {
					if(k != 'versionNumber' && k != 'isNotice') {
						window.localStorage.removeItem(k);
					}
				}
			}	

			// 自动跳转到登录前页面
			ConfigData.loginAgoUrl = {
				url: fromState.name,
				hasLoginGoUrl: ConfigData.loginAgoHash
			};

			window.localStorage.setItem('hasLoginGoUrl', ConfigData.loginAgoHash);
			ConfigData.loginAgoHash = location.hash;

			ConfigData.currentState = toState.name;

			setTitle(toState.title || ConfigData.title);
		});
	}]);

	// 设置页面标题
	function setTitle(title) {
		document.title = title;
		if(navigator.userAgent.indexOf("MicroMessenger") > 0) {
			// hack在微信等webview中无法修改document.title的情况
			var body = document.body,
				iframe = document.createElement('iframe');
			iframe.src = "/null.html";
			iframe.style.display = "none";
			iframe.onload = function() {
				setTimeout(function() {
						body.removeChild(iframe);
					},
					0
				);
			};
			body.appendChild(iframe);
		}
	}

})(api);