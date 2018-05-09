/** 
 * 2016/03/22 yc 重写sql-hint.js 
 * 2018/05/9 lch 修改sql-hint.js 不匹配转义字符
 * @param {Object} mod 
 */  
(function(mod) {  
    if (typeof exports == "object" && typeof module == "object") // CommonJS  
        mod(require("../../lib/codemirror"), require("../../mode/sql/sql"));  
    else if (typeof define == "function" && define.amd) // AMD  
        define(["../../lib/codemirror", "../../mode/sql/sql"], mod);  
    else // Plain browser env  
        mod(CodeMirror);  
})(function(CodeMirror) {  
    "use strict";  
    var Pos = CodeMirror.Pos;  
    /** 
     * 从sql.js里获取keyword数组 
     * @param {Object} editor 
     */  
    function getKeywords(editor) {  
        var mode = editor.doc.modeOption;  
        if (mode === "sql") mode = "text/x-sql";  
        return CodeMirror.resolveMode(mode).keywords;  
    };  
    /** 
     * 判断元素item是否存在数组arr中   
     * @param {Object} arr 
     * @param {Object} item 
     */  
    function arrayContains(arr, item) { // 判断元素item是否存在数组arr中    
        if (!Array.prototype.indexOf) {  
            var i = arr.length;  
            while (i--) {  
                if (arr[i] === item) {  
                    return true;  
                }  
            }  
            return false;  
        }  
        return arr.indexOf(item) != -1;  
    };  
      
    function hintSql(editor, keywords, tableKeywords, getToken, options) { // 处理hint的核心函数，改名为velocityHint(也可以不做修改)    
        // Find the token at the cursor，获取当前光标指定的字符串    
        var cur = editor.getCursor(),  
            token = getToken(editor, cur),  
            tprop = token;  
        return {  
            list: getCompletions(token, keywords, tableKeywords, options),  
            from: Pos(cur.line, fetchStartPoint(token)), // 字符串拼接的初始位置，这个很重要    
            to: Pos(cur.line, token.end)  
        };  
    };  
    /** 
     * 字符拼接位置 
     * @param {Object} token 
     */  
    function fetchStartPoint(token) {  
        var index = token.string.lastIndexOf("\.");  
        if (index < 0) {  
            return token.start;  
        } else {  
            return token.start + index + 1;  
        }  
        //      return token.start;  
    };  
  
    function sqlHint(editor, options) {  
        var keywords = wordToString(getKeywords(editor)) + CodeMirror.keywords;  
        return hintSql(editor, keywords, CodeMirror.tableKeywords, function(e, cur) {  
            return e.getTokenAt(cur);  
        }, options);  
    };  
    CodeMirror.registerHelper("hint", "sql", sqlHint);  
    /** 
     * 得到匹配的关键字数组 
     * @param {Object} token 
     * @param {Object} keywords 
     * @param {Object} tableKeywords 
     * @param {Object} options 
     */  
    function getCompletions(token, keywords, tableKeywords, options) {  
        var found = [],  
            start, pointCount, content = getWord(token.string, token.end); // found为匹配的数组    
        if (content && content.length) {  
            start = token.string.charAt(0); //字符串首字母  
            content = content.trim().substring(0, content.lenght); //除首字母外的截取  
            pointCount = (start == '\.') ? true : false; //判断最后一个字符是否是.  
        }  
        var result = null;  
        if (start && start.trim() != '') {
            try {
                var regChat = '*+?(){}';
                var regRule = new RegExp("\\" + content + "", 'g');
                if (regRule.test(regChat)) return found;
                var regexp = new RegExp("\\b" + content + "\\w+\\.?\\b", "gi");
                if (pointCount && tableKeywords) {
                    result = tableKeywords.match(regexp);
                } else {
                    result = keywords.match(regexp);
                }
            } catch (e) {
                console.log(e, content);
            }
          //  console.log('result = ' + result);  
        }  
        if (result && result.length) {  
            for (var i = 0; i < result.length; i++) {  
                if (!arrayContains(found, result[i]) && content.length <= result[i].length && pointCount) {  
                    if (result[i].charAt(result[i].length-1) == '.') { //如果最后一位是'.'  
                        found.push(result[i].substring(content.lastIndexOf("\.") + 1, result[i].length - 1));  
                    } else {  
                        found.push(result[i].substring(content.lastIndexOf("\.") + 1, result[i].length));  
                    }  
                } else {  
                    found.push(result[i]);  
                }  
            }  
        }  
        return found;  
    };  
    /** 
     * 获取当前字符串 
     * @param {Object} str 当前行字符串 
     * @param {Object} end 结束位置 
     */  
    function getWord(str, end) {  
        return str.substring(str.lastIndexOf(' '), end);  
    };  
    /** 
     * 将wordlist拼成字符串 
     * @param {Object} wordlist 
     */  
    function wordToString(wordlist) {  
        var str = '';  
        for (var word in wordlist) {  
            str += word + ' ';  
        }  
        return str;  
    };  
});