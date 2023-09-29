define([
	"dojo/_base/declare",
	"dojo/dom",
	"dojo/query",
	"dojo/dom-style",
	"dojo/text!tsext/template/menu.html"
], function(declare, dom, query, domStyle, template){
	return declare("tsext.view.Menu", null, {
		constructor : function(bodyId, args){
			var bodyObj = dom.byId(bodyId);
			bodyObj.innerHTML = template;
			var v = args['support'];
			if(/^(full|changeInitDate)$/i.test(v)){
				query('.changeInitDate', this.domNode).forEach(function(el){
					domStyle.set(el, 'display', '');
				});
			}
			if(/^(full|settings)$/i.test(v)){
				query('.settings', this.domNode).forEach(function(el){
					domStyle.set(el, 'display', '');
				});
			}
			if(/^(full|sampler)$/i.test(v)){
				query('.sampler', this.domNode).forEach(function(el){
					domStyle.set(el, 'display', '');
				});
			}
			if(/^(full|absorber)$/i.test(v)){
				query('.absorber', this.domNode).forEach(function(el){
					domStyle.set(el, 'display', '');
				});
			}
			if(/^(full|leave)$/i.test(v)){
				query('.leave', this.domNode).forEach(function(el){
					domStyle.set(el, 'display', '');
				});
			}
			if(/^(full|testAssist)$/i.test(v)){
				query('.testAssist', this.domNode).forEach(function(el){
					domStyle.set(el, 'display', '');
				});
			}
		},
		destroyRecursive : function(){
		}
	});
});
