define([
	"dojo/_base/declare",
	"dojo/_base/json",
	"dojo/_base/array",
	"dijit/_WidgetBase",
	"dijit/_TemplatedMixin",
	"dojo/dom",
	"dojo/dom-construct",
	"dojo/dom-attr",
	"dojo/dom-style",
	"dojo/query",
	"dojo/on",
	"dojo/string",
	"dojo/Deferred",
	"dojo/_base/lang",
	"dojo/text!tsext/testAssist/TestAssistWidget.html",
	"tsext/service/Request",
	"tsext/dialog/Confirm",
	"tsext/service/Agent",
	"tsext/testAssist/Current",
	"tsext/testAssist/Distributor",
	"tsext/testAssist/DialogInput",
	"tsext/testAssist/DialogData",
	"tsext/testAssist/DialogOption",
	"tsext/util/Util"
], function(declare, json, array, _WidgetBase, _TemplatedMixin, dom, domConstruct, domAttr, domStyle, query, on, str, Deferred, lang, template, Request, Confirm, Agent, Current, Distributor, DialogInput, DialogData, DialogOption, Util) {
	return declare("tsext.testAssist.TestAssistWidget", [_WidgetBase, _TemplatedMixin], {
		templateString: template,
		constructor: function(){
			this.hash = Agent.getLocationHash(true);
			this.distributor = new Distributor();
			this.DialogInput = new DialogInput(this.distributor);
		},
		placeAt: function(){
			this.inherited(arguments);
			this.startup();
		},
		startup: function(){
			this.inherited(arguments);
			var area = query('#expTopView .main-title')[0];
			domStyle.set(area, 'cursor', 'pointer');
			this.own(
				on(area, 'click', lang.hitch(this, function(e){
					this.showDialogAction();
				}))
			);
		},
		destroy: function(){
			this.inherited(arguments);
		},
		setMainView: function(view){
			this.distributor.setMainView(view);
			view.buildLogTable(this.distributor, 0);
		},
		/**
		 * 入力ダイアログ表示
		 */
		showDialogAction: function(mainView){
			this.DialogInput.show(mainView).then(
				lang.hitch(this, function(flag){
					mainView.buildLogTable(this.distributor);
				}),
				lang.hitch(this, function(errmsg){
				})
			);
		},
		toggleMode: function(index){
			return this.distributor.toggleMode(index);
		},
		getEntryByIndex: function(index){
			return this.distributor.getEntryByIndex(index);
		},
		getEntryCount: function(){
			return this.distributor.getEntryCount();
		},
		startEntry: function(){
			this.distributor.inputStart();
		},
		pauseEntry: function(){
			this.distributor.pauseRequest();
		},
		showDialogOption: function(){
		},
		showDialogLog: function(mainView){
			var dialog = new DialogData({title:'LOG', suffix:'Log', extension:'txt'});
			dialog.show(this.distributor.getLog());
		}
	});
});
