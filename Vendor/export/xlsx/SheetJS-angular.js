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




// //Excel 导出功能
// (function () {
//   'use strict';
//   angular.module('app')
//   .factory('exportExcel', exportExcel)

//   exportExcel.$inject = ['$window'];
//   function exportExcel($window) {
//       var uri = 'data:application/msword;base64,',
//       //var uri = 'data:application/vnd.ms-excel;base64,',
//   //    var uri = 'data:application/pdf;base64,',
//      template = '<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40"><head><meta http-equiv="Content-Type" content="text/html;charset=utf-8"></meta><!--[if gte mso 9]><xml><x:ExcelWorkbook><x:ExcelWorksheets><x:ExcelWorksheet><x:Name>{worksheet}</x:Name><x:WorksheetOptions><x:DisplayGridlines/></x:WorksheetOptions></x:ExcelWorksheet></x:ExcelWorksheets></x:ExcelWorkbook></xml><![endif]--></head><body><table>{table}</table></body></html>',
//      base64 = function (s) { return $window.btoa(unescape(encodeURIComponent(s))); },
//      format = function (s, c) { return s.replace(/{(\w+)}/g, function (m, p) { return c[p]; }) },
//      tableSlide = function (tb) {
//          $('#' + tb + ' td').each(function () {
//              if ($(this).attr('ng-show') == 'false') {
//                  $(this).remove();
//                  return true;
//              }
//              if ($(this).attr('class')&&$(this).attr('class').indexOf('ng-hide') != -1) {
//                  $(this).remove();
//              }
//          })
//          $('#' + tb + ' th').each(function () {
//              if ($(this).attr('ng-hide') == 'true') {
//                  $(this).remove();
//                  return true;
//              }
//              if ($(this).attr('class')&&$(this).attr('class').indexOf('ng-hide') != -1) {
//                  $(this).remove();
//              }
//          })

//          var tablestr = '<thead>'
//          dealformat('thead', 'th');
//          tablestr += '</thead><tbody>'
//          dealformat('tbody', 'td');
//          tablestr += '</tbody>'
//          return tablestr;
//          function dealformat(first, second) {
//              $('#' + tb + ' ' + first + ' tr').each(function () {
//                  tablestr += '<tr>';
//                  $(this).children().each(function () {
//                      var rowspan = $(this).attr('rowspan');
//                      var colspan = $(this).attr('colspan');

//                      if (rowspan == undefined) rowspan = 1;
//                      if (colspan == undefined) colspan = 1;
//                      var text = $.trim($(this).text());
//                      tablestr += '<' + second + ' rowspan=' + rowspan + ' colspan=' + colspan + '>' + text + '</' + second + '>'
//                  })
//                  tablestr += '</tr>';
//              })
//          }
//      };
//       return  function (tableid, worksheetName, type, filename) {
//               var ctx = { worksheet: worksheetName, table: tableSlide(tableid) },
//                   uri = type == 'excel' ? 'data:application/vnd.ms-excel;base64,' : 'data:application/msword;base64,',
//                   href = uri + base64(format(template, ctx));
//               var dlink = document.createElement('a');
//               dlink.href = href;
//               dlink.download = filename;
//               dlink.click();
//               dlink = null;
//               return href;            
//       }
//   }
// })();
