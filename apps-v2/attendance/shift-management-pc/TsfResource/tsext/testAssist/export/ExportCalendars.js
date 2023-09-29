define([
	"dojo/_base/declare",
	"dojo/_base/lang",
	"dojo/_base/array",
	"dojo/string",
	"tsext/testAssist/export/ExportObjs",
	"tsext/testAssist/export/ExportCalendar",
	"tsext/util/Util"
], function(declare, lang, array, str, ExportObjs, ExportCalendar, Util){
	// 勤怠カレンダーのコレクション
	return declare("tsext.testAssist.ExportCalendars", ExportObjs, {
		/**
		 * データ格納
		 * @override ExportObjs.initialize
		 * @param {Array.<Object>} records 
		 */
		initialize: function(records){
			this.objs = [];
			for(var i = 0 ; i < records.length ; i++){
				var obj = this.createObj(records[i]);
				var c = this.getCalendarByDate(obj.getDate());
				if(c){
					c.addCalendar(obj);
				}else{
					this.objs.push(obj);
				}
			}
			this.objs = this.objs.sort(function(a, b){
				return (a.getDate() < b.getDate() ? -1 : 1);
			});
		},
		/**
		 * データクラスインスタンス生成
		 * @param {Object} record
		 * @returns {Object|null}
		 */
		createObj: function(record){
			return new ExportCalendar(this.manager, record, this);
		},
		/**
		 * 日付で検索
		 * @param {string} d (yyyy-MM-dd)
		 * @returns {Object|null}
		 */
		getCalendarByDate: function(d){
			for(var x = 0 ; x < this.objs.length ; x++){
				var o = this.objs[x];
				if(o.getDate() == d){
					return o;
				}
			}
			return null;
		},
		getPatternIds: function(){
			var ids = [];
			for(var x = 0 ; x < this.objs.length ; x++){
				var obj = this.objs[x];
				Util.mergeList(ids, obj.getPatternId());
			}
			return ids;
		},
		/**
		 * カレンダーの新規作成
		 * @param {Array.<string>} lst 
		 * @param {tsext.testAssist.ExportVisitor} visit 
		 * @param {Object} empTypeMap
		 * @param {Object} dateMap 対象日のマップ
		 * @returns {Array.<string>}
		 */
		 outputExportCalendars: function(lst, visit, empTypeMap, dateMap){
			for(var x = 0 ; x < this.objs.length ; x++){
				var obj = this.objs[x];
				if(dateMap[obj.getDate()]){
					obj.outputExportCalendar(lst, visit, empTypeMap);
				}
			}
			return lst;
		}
	});
});
