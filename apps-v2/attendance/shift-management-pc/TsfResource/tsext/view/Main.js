define([
	"dojo/_base/declare",
	"dojo/hash",
	"dojo/topic",
	"dojo/on",
	"dojo/dom",
    "dojo/dom-construct",
	"dojo/dom-class",
	"dijit/popup",
	"tsext/view/Menu",
	"tsext/view/ChangeInitDateAttView",
	"tsext/view/ChangeInitDateJobView",
	"tsext/view/ExportView",
	"tsext/view/ImportView",
	"tsext/view/DeleteView",
	"tsext/settings/SettingExportView",
	"tsext/settings/SettingImportView",
	"tsext/configDownload/ConfigDownloadView",
	"tsext/view/AbsorberView",
	"tsext/check8661/Check8661View",
	"tsext/check8837/Check8837View",
	"tsext/check9173/Check9173View",
	"tsext/check9544/Check9544View",
	"tsext/leave/LeaveMainView",
	"tsext/testAssist/TestAssistView",
	"tsext/customFields/CustomFieldsView",
	"tsext/service/Agent"
], function(declare, hash, topic, on, dom, domConstruct, domClass, popup, Menu, ChangeInitDateAttView, ChangeInitDateJobView, ExportView, ImportView, DeleteView, SettingExportView, SettingImportView, ConfigDownloadView, AbsorberView, Check8661View, Check8837View, Check9173View, Check9544View, LeaveMainView, TestAssistView, CustomFieldsView, Agent){
	return declare("tsext.view.Main", null, {
		user : null,
		constructor: function(bodyId, res){
			Agent.init(res);
			this.bodyId = bodyId;
			this.currentHash = null;

			this.lastPage = Agent.getDefaultHash();

			var h = (Agent.getLocationHash(true) || this.lastPage);
			hash(Agent.getHashPrefix() + h, true);

			this.loadPage(h);

			topic.subscribe("/dojo/hashchange", dojo.hitch(this, function(newHash){
				this.loadPage(newHash.substr(Agent.getHashPrefix().length));
			}));
		},
		popupSupport: function(areaId, cssName){
			on(dom.byId(areaId), 'click', function(e){
				if(!domClass.contains(e.target, cssName)){
					popup.close();
				}
			});
		},
		loadPage: function(page){
			console.log('page=' + page);
			if(page != 'wait'){
				domConstruct.empty(this.bodyId);
			}
			if(this.view){
				this.view.destroyRecursive();
				this.view = null;
			}
			var args = Agent.getArgs();
			if(args['check'] == '8661'){
				this.view = new Check8661View();
				this.view.placeAt(this.bodyId);
			}else if(args['check'] == '8837'){
				this.view = new Check8837View();
				this.view.placeAt(this.bodyId);
			}else if(args['check'] == '9173'){
				this.view = new Check9173View();
				this.view.placeAt(this.bodyId);
			}else if(args['check'] == '9544'){
				this.view = new Check9544View();
				this.view.placeAt(this.bodyId);
			}else if(page == 'menu'){
				this.view = new Menu(this.bodyId, args);
			}else if(page == 'changeInitDateAtt'){
				this.view = new ChangeInitDateAttView();
				this.view.placeAt(this.bodyId);
			}else if(page == 'changeInitDateJob'){
				this.view = new ChangeInitDateJobView();
				this.view.placeAt(this.bodyId);
			}else if(page == 'export'){
				this.view = new ExportView();
				this.view.placeAt(this.bodyId);
			}else if(page == 'import'){
				this.view = new ImportView();
				this.view.placeAt(this.bodyId);
			}else if(page == 'delete'){
				this.view = new DeleteView();
				this.view.placeAt(this.bodyId);
			}else if(page == 'settingExport'){
				this.view = new SettingExportView();
				this.view.placeAt(this.bodyId);
			}else if(page == 'settingImport'){
				this.view = new SettingImportView();
				this.view.placeAt(this.bodyId);
			}else if(page == 'configDownload'){
				this.view = new ConfigDownloadView();
				this.view.placeAt(this.bodyId);
			}else if(page == 'absorber'){
				this.view = new AbsorberView();
				this.view.placeAt(this.bodyId);
			}else if(page == 'leave'){
				this.view = new LeaveMainView();
				this.view.placeAt(this.bodyId);
			}else if(page == 'testAssist'){
				this.view = new TestAssistView();
				this.view.placeAt(this.bodyId);
			}else if(page == 'customFields'){
				this.view = new CustomFieldsView();
				this.view.placeAt(this.bodyId);
			}
		}
	});
});
