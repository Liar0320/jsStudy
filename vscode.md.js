//https://blog.csdn.net/maokelong95/article/details/54379046/           配置snippet
{
	//prettier && eslint
	//http://www.lanrenxiazai.cn/tech/aq/jQueryjiaocheng/2018/0829/18383.html
	"javascript.validate.enable": false,
	"eslint.validate": [
		"javascript", 
		"javascriptreact",
		{
			"language": "html",
			"autoFix": true
		},
		{
			"language": "vue",
			"autoFix": true
		}
	],
	"eslint.autoFixOnSave": true,
	"prettier.eslintIntegration": true
}



{
	"git.autofetch": true,
	"window.zoomLevel": 0,
	//terminal in vscode
	// "terminal.integrated.shell.windows": "C:\\Windows\\System32\\cmd.exe",
	"terminal.integrated.shell.windows": "C:\\Program Files\\Git\\bin\\bash.exe",
	"git.path": "D:\\Git\\bin\\bash.exe",
	"gitlens.advanced.messages": {
		"suppressShowKeyBindingsNotice": true
	},
	"gitlens.historyExplorer.enabled": true,
	//default browser open
	"open-in-browser.default": "Chrome",
	//fileheader
	"fileheader.Author": "liar",
	"fileheader.LastModifiedBy": "liar",
	//prettier && eslint
	"prettier.eslintIntegration": true,
	// 关闭编辑器自带的 js 检查，建议关闭
    "javascript.validate.enable" : false,
	"eslint.autoFixOnSave": true,
	"eslint.validate": [
	    "javascript",{
			"language": "vue",
			"autoFix": true
		},"html",
		"vue"
	],
//	"editor.formatOnSave": false,
	"liveServer.settings.CustomBrowser": "chrome",
	"workbench.iconTheme": "vscode-icons",
	"files.associations": {
		"*.vue": "vue"
	},
	"emmet.syntaxProfiles": {
		"vue": "html"
	},
	"liveServer.settings.donotVerifyTags": true,
	"search.followSymlinks": false
}
