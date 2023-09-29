define([
	"dojo/_base/declare",
	"dojo/_base/lang",
	"dojo/_base/array",
	"dojo/string",
	"tsext/testAssist/export/ExportObj",
	"tsext/testAssist/Constant",
	"tsext/util/Util"
], function(declare, lang, array, str, ExportObj, Constant, Util){
	// 組織
	return declare("tsext.testAssist.ExportOrganization", ExportObj, {
		getName: function(){
			return this.obj.Name;
			// InstanceName,IsSandbox,FiscalYearStartMonth,OrganizationType
		},
		/**
		 * 冒頭コメントを生成してエクスポート
		 * @param {Array.<string>} lst 
		 * @param {tsext.testAssist.ExportVisitor} visit 
		 * @param {tsext.testAssist.ExportEmp} emp
		 * @param {Array.<tsext.testAssist.ExportVirMonth}} virMonths
		 * @param {string} tsVersion
		 * @returns {Array.<string>}
		 */
		 outputExportOrganization: function(lst, visit, emp, virMonths, tsVersion){
			var range = virMonths[0].getYearMonth(1) + (virMonths.length > 1 ? ('～' + virMonths[virMonths.length - 1].getYearMonth(1)) : '');
			lst.push(this.getCommentLine(str.substitute('${0} 組織:${1} 社員:${2} 期間:${3}', [
				tsVersion,
				this.getName(),
				emp.getName(),
				range
			])));
		}
	});
});
