define([
	"dojo/_base/declare",
	"dojo/_base/lang",
	"dojo/_base/json",
	"dojo/_base/array",
	"dojo/string",
	"dojo/query",
	"dojo/on",
	"dojo/Deferred",
	"dojo/dom",
	"dojo/dom-construct",
	"dojo/dom-attr",
	"dojo/dom-class",
	"dojo/dom-style",
	"dijit/Dialog",
	"dojox/layout/ResizeHandle",
	"dojo/text!tsext/testAssist/DialogSample.html",
	"dojo/text!tsext/testAssist/SAMPLE1.csv",
	"dojo/text!tsext/testAssist/SAMPLE2.csv",
	"tsext/service/Request",
	"tsext/testAssist/Current",
	"tsext/testAssist/Constant",
	"tsext/util/DomUtil",
	"tsext/util/Util"
], function(declare, lang, json, array, str, query, on, Deferred, dom, domConstruct, domAttr, domClass, domStyle, Dialog, ResizeHandle, template, SAMPLE1, SAMPLE2, Request, Current, Constant, DomUtil, Util) {
	return declare("tsext.testAssist.DialogSample", null, {
		// 選択ダイアログ
		constructor : function(param){
			this.param = param || {};
		},
		/**
		 * ダイアログオープン
		 */
		show : function() {
			this.deferred = new Deferred();
			this.dialog = new Dialog({
				title: this.param.title || '',
				class: 'tsext-test-assist-dialog',
				content: template
			});
			domStyle.set('testAssistSample', 'width' , '300px');
			domStyle.set('testAssistSample', 'height', '120px');
			this.resizeHandle = new ResizeHandle({
				activeResize:true,
				intermediateChanges: true,
				minWidth:220,
				minHeight:100,
				style:'right:-6px;bottom:-8px',
				targetId: 'testAssistSample'
			}, dom.byId('testAssistSampleResize'));
			this.dialog.own(
				on(this.dialog, 'cancel', lang.hitch(this, this.onClose)),
				on(query('.tsext-c-cancel', this.dialog.domNode)[0], 'click', lang.hitch(this, this.onClose)),
				on(query('.tsext-c-ok'    , this.dialog.domNode)[0], 'click', lang.hitch(this, this.onOk)),
				on(this.resizeHandle, 'resize', lang.hitch(this, this.onResize))
			);
			var select = dom.byId('testAssistSampleList');
			this.map = {
				'1': { value:SAMPLE1, name:'時間休取得' },
				'2': { value:SAMPLE2, name:'入退館ログ' }
			};
			for(var key in this.map){
				var o = this.map[key];
				domConstruct.create('option', { innerHTML:o.name, value:key }, select);
			}
			this.dialog.show();
			this.onResize();
			return this.deferred.promise;
		},
		/**
		 * ダイアログサイズ変更
		 */
		onResize : function(){
			var cw = dom.byId('testAssistSample').clientWidth;
			var ch = dom.byId('testAssistSample').clientHeight;
			var rowHeight = 0;
			query('tr.test-assist-row-fix', this.dialog.domNode).forEach(function(tr){
				rowHeight += tr.clientHeight;
			});
			var h = (ch - rowHeight);
			domStyle.set('testAssistSampleList', 'width', '100%');
			domStyle.set('testAssistSampleList', 'height', h + 'px');
		},
		/**
		 * ダイアログを閉じる（DOMごと削除）
		 */
		hide : function(){
			if(this.dialog){
				this.dialog.hide().then(lang.hitch(this, function(){
					this.dialog.destroyRecursive();
					this.dialog = null;
				}));
			}
		},
		onOk : function(){
			var select = dom.byId('testAssistSampleList');
			if(!select.value){
				return;
			}
			var o = this.map[select.value];
			this.deferred.resolve(o.value);
			this.hide();
		},
		/**
		 * 閉じる
		 */
		onClose : function(){
			this.deferred.reject();
			this.hide();
		}
	});
});
