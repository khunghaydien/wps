define([
	"dojo/_base/declare",
	"dojo/_base/lang",
	"dojo/hash",
	"dojo/topic",
	"dojo/on",
	"dojo/dom",
    "dojo/dom-construct",
	"dojo/dom-class",
	"dijit/popup",
	"tsext/tsjtb/JtbDummyMenu",
	"tsext/tsjtb/JtbCompoView",
	"tsext/tsjtb/JtbData",
	"tsext/util/Util"
], function(declare, lang, hash, topic, on, dom, domConstruct, domClass, popup, JtbDummyMenu, JtbCompoView, JtbData, Util){
	return declare("tsext.view.JtbDummyMain", null, {
		user : null,
		constructor: function(bodyId, res){
			JtbData.init(Util.fromJson(res) || {});
			this.bodyId = bodyId;
			this.currentHash = null;

			this.prefix = "!";
			this.lastPage = "menu";

			var h = location.hash;
			var m = /^#\!?(.+)/.exec(h);
			if(m){
				h = m[1];
			}
			var oh = h;
			h = (h || this.lastPage);

			hash(this.prefix + h, true);

			if(h == oh){
				this.loadPage(h);
			}
			topic.subscribe("/dojo/hashchange", dojo.hitch(this, function(newHash){
				this.loadPage(newHash.substr(this.prefix.length));
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
			JtbData.setParam(page, this.prefix);
			if(page != 'wait'){
				domConstruct.empty(this.bodyId);
			}
			if(this.view){
				this.view.destroyRecursive();
				this.view = null;
			}
			if(JtbData.getPage() == 'menu'){
				this.view = new JtbDummyMenu(this.bodyId);
			}else if(JtbData.getPage() == 'compo'){
				this.view = new JtbCompoView();
				this.view.placeAt(this.bodyId);
			}
		}
	});
});
