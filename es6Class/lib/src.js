"use strict";

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

(function (window) {
	var $ = window.$;
	var jquery = window.jquery;
	if (jquery === undefined || $ === undefined) {
		jquery = {};$ = jquery;
	}

	(function (_$) {
		//number string boolean undefind object function
		function type(thing) {
			var TEMPLATE = {
				"[object Number]": "number - object",
				"[object String]": "string - object",
				"[object Boolean]": "boolean - object",
				"[object Object]": "object"
			};
			var _type = typeof thing === "undefined" ? "undefined" : _typeof(thing);
			if (thing === null) {
				return "null";
			} else if (_type === "object") {
				return TEMPLATE[Object.prototype.toString.call(thing)];
			} else {
				return _type;
			}
		}

		///基础类型判断
		var types = ["Array", "Boolean", "Date", "Number", "Object", "RegExp", "HTMLDocument", "String", "Window", "Function"];
		types.reduce(function (index, item) {
			_$["is" + item] = function (data) {
				if (Object.prototype.toString.call(data) === "[object " + item + "]") return true;
				return false;
			};
			return _$;
		}, _$);

		///是否为空
		function isNull(obj) {
			if ((typeof obj === "undefined" ? "undefined" : _typeof(obj)) === "object") {
				if (_$.isArray(obj)) {
					return obj.length === 0;
				} else {
					return Object.keys(obj).length === 0;
				}
			} else {
				if (obj === undefined || obj === "") return true;
				return false;
			}
		}

		$["isNull"] = isNull;
		$["type"] = type;
	})($);

	$.objToArr = function (obj) {
		var result = [];
		for (var key in obj) {
			if (obj.hasOwnProperty(key)) {
				(function () {
					var element = obj[key];
					var temp = {};
					temp.__id = key;
					if ($.isObject(element)) {
						var objResult = objToArrShallow(element);
						objResult.forEach(function (element) {
							temp[element.__id] = element.value;
						});
					}
					result.push(temp);
				})();
			}
		}
		function objToArrShallow(obj) {
			var result = [];
			for (var _key in obj) {
				if (obj.hasOwnProperty(_key)) {
					var element = obj[_key];
					var temp = {};
					temp.__id = _key;
					temp.value = element;
					result.push(temp);
				}
			}
			return result;
		}
		return result;
	};
	$.GUID = function (len, radix) {
		var chars = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz".split("");
		var uuid = [],
		    i;
		radix = radix || chars.length;

		if (len) {
			// Compact form
			for (i = 0; i < len; i++) {
				uuid[i] = chars[0 | Math.random() * radix];
			}
		} else {
			// rfc4122, version 4 form
			var r;

			// rfc4122 requires these characters
			uuid[8] = uuid[13] = uuid[18] = uuid[23] = "-";
			uuid[14] = "4";

			// Fill in random data.  At i==19 set the high bits of clock sequence as
			// per rfc4122, sec. 4.1.5
			for (i = 0; i < 36; i++) {
				if (!uuid[i]) {
					r = 0 | Math.random() * 16;
					uuid[i] = chars[i == 19 ? r & 0x3 | 0x8 : r];
				}
			}
		}

		return uuid.join("");
	};
})(window);

//在原型上操作的工具
(function () {
	//获取时间处理格式
	Date.prototype.format = function (format) {
		var o = {
			"M+": this.getMonth() + 1,
			"d+": this.getDate(),
			"h+": this.getHours(),
			"m+": this.getMinutes(),
			"s+": this.getSeconds(),
			"q+": Math.floor((this.getMonth() + 3) / 3),
			"s": this.getMilliseconds()
		};
		if (/(y+)/.test(format)) {
			format = format.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
		}
		for (var k in o) {
			if (new RegExp("(" + k + ")").test(format)) {
				format = format.replace(RegExp.$1, RegExp.$1.length == 1 ? o[k] : ("00" + o[k]).substr(("" + o[k]).length));
			}
		}
		return format;
	};
})();