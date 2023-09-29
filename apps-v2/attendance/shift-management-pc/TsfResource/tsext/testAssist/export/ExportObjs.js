define([
	"dojo/_base/declare",
	"dojo/_base/lang",
	"dojo/_base/array",
	"dojo/string",
	"tsext/testAssist/export/ExportObj",
	"tsext/testAssist/Constant",
	"tsext/util/Util"
], function(declare, lang, array, str, ExportObj, Constant, Util){
	// オブジェクトのコレクション
	return declare("tsext.testAssist.ExportObjs", null, {
		/**
		 * @constructor
		 * @param {tsext.testAssist.ExportManager} manager
		 */
		constructor: function(manager){
			this.manager = manager;
			this.objs = [];
		},
		/**
		 * データ格納
		 * @param {Array.<Object>} records 
		 */
		initialize: function(records){
			this.objs = [];
			for(var i = 0 ; i < records.length ; i++){
				var obj = this.createObj(records[i]);
				if(obj){
					this.objs.push(obj);
				}
			}
		},
		/**
		 * データクラスインスタンス生成
		 * @param {Object} record
		 * @returns {tsext.testAssist.ExportObj|null}
		 */
		createObj: function(record){
			return new ExportObj(this.manager, record, this);
		},
		/**
		 * 配列の要素を返す
		 * @param {number} index
		 * @returns {tsext.testAssist.ExportObj|null}
		 */
		get: function(index){
			return (index < this.objs.length ? this.objs[index] : null);
		},
		size: function(){
			return this.objs.length;
		},
		getRaws: function(){
			var raws = [];
			for(var x = 0 ; x < this.objs.length ; x++){
				var o = this.objs[x];
				raws.push(o.getRaw());
			}
			return raws;
		},
		/**
		 * IDで検索
		 * @param {string} id 
		 * @returns {tsext.testAssist.ExportObj|null}
		 */
		getObjById: function(id){
			for(var x = 0 ; x < this.objs.length ; x++){
				var o = this.objs[x];
				if(o.getId() == id){
					return o;
				}
			}
			return null;
		},
		/**
		 * インスタンスを保持したまま再実行した時、必要に応じてメンバ変数のクリアを行う
		 */
		clearCollect: function(){
			for(var x = 0 ; x < this.objs.length ; x++){
				this.objs[x].clearCollect();
			}
		}
	});
});
