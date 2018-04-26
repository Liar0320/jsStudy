/* xlsx.js (C) 2013-present SheetJS -- http://sheetjs.com */
/* eslint-env browser */
/* global XLSX */
/* exported SheetJSExportService, SheetJSImportDirective */
(function(angular){
  function SheetJSExportService() {

    function exportSheetJS(gridApi, wopts) {
  
      var fileName = gridApi.options.filename || 'SheetJS';
      fileName += wopts.bookType ? "." + wopts.bookType : '.xlsx';
  
      var sheetName = gridApi.options.sheetname || 'Sheet1';

      var wb={SheetNames:[],Sheets:{}}
      if(angular.isArray(gridApi.data)){
        var sheet = XLSX.utils.json_to_sheet(gridApi.data);
        wb.SheetNames.push(sheetName);
        wb.Sheets[sheetName] = sheet;
      }

      XLSX.writeFile(wb, fileName);
    }
  
    var service = {};
    service.exportXLSB = function exportXLSB(gridApi) { return exportSheetJS(gridApi, { bookType: 'xlsb', bookSST: true, type: 'array' }); };
    service.exportXLSX = function exportXLSX(gridApi) { return exportSheetJS(gridApi, { bookType: 'xlsx', bookSST: true, type: 'array' }); }
  
    return service;
  }
  
  function SheetJSImportDirective() {
    return {
      scope: { opts: '&' },
      link: function($scope, $elm) {
        $elm.on('change', function(changeEvent) {
          var reader = new FileReader();
  
          reader.onload = function(e) {
            /* read workbook */
            var bstr = e.target.result;
            var wb = XLSX.read(bstr, {type:'binary'});
  
            /* grab first sheet */
            var wsname = wb.SheetNames[0];
            var ws = wb.Sheets[wsname];
  
            /* grab first row and generate column headers */
            var aoa = XLSX.utils.sheet_to_json(ws, {header:1, raw:false});
            var cols = [];
            for(var i = 0; i < aoa[0].length; ++i) cols[i] = { field: aoa[0][i] };
  
            /* generate rest of the data */
            var data = [];
            for(var r = 1; r < aoa.length; ++r) {
              data[r-1] = {};
              for(i = 0; i < aoa[r].length; ++i) {
                if(aoa[r][i] == null) continue;
                data[r-1][aoa[0][i]] = aoa[r][i]
              }
            }
  
            /* update scope */
            $scope.$apply(function() {
              $scope.opts({excel:{'columnDefs':cols,'data':data}})
              // $scope.opts.columnDefs = cols;
              // $scope.opts.data = data;
            });
          };
  
          reader.readAsBinaryString(changeEvent.target.files[0]);
        });
      }
    };
  }  
  angular.module('xslxJs',[])
    .factory('SheetJSExportService', SheetJSExportService)
    .directive('sheetJsImportDirective',SheetJSImportDirective);
})(angular)