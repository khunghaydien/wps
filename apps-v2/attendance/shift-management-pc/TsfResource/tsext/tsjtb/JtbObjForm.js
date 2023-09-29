define([
	"dojo/_base/declare",
	"dojo/_base/lang",
	"dojo/_base/json",
	"dojo/_base/array",
	"dojo/string",
	"dojo/query",
	"dojo/on",
	"dojo/Deferred",
	"dojo/dom-construct",
	"dojo/dom-attr",
	"dojo/dom-class",
	"dojo/dom-style",
	"dijit/Dialog",
	"tsext/dialog/Calendar",
	"tsext/dialog/Selector",
	"tsext/util/Util"
], function(declare, lang, json, array, str, query, on, Deferred, domConstruct, domAttr, domClass, domStyle, Dialog, Calendar, Selector, Util) {
	return declare("tsext.tsjtb.JtbObjForm", null, {
		constructor: function(){
		},
		getTitle: function(){
			return '';
		},
		getContent: function(){
			return '<div></div>';
		},
		setEventHandler: function(){
		},
		show: function() {
			if(!this.dialog){
				this.dialog = new Dialog({
					title: this.getTitle(),
					content: this.getContent(),
					onKeyPress :lang.hitch(this, function(e){
						if(e.keyCode === 27){
							e.preventDefault();
							e.stopPropagation();
							this.hide();
						}
					})
				});
				this.dialog.own(
					on(this.getOkButton()    , 'click', lang.hitch(this, this.onOk    )),
					on(this.getCancelButton(), 'click', lang.hitch(this, this.onCancel))
				);
				query('.tsext-jtb-date', this.dialog.domNode).forEach(function(el){
					this.dialog.own(
						on(el, 'click', lang.hitch(this, function(e){
							e.preventDefault();
							e.stopPropagation();
							Calendar.popup(e.target, this.dialog.domNode);
						})),
						on(el, 'calendar', lang.hitch(this, this.blurDate)),
						on(el, 'blur', lang.hitch(this, function(e){
							e.preventDefault();
							e.stopPropagation();
							this.blurDate(e);
						}))
					);
				}, this);
				query('.tsext-jtb-time', this.dialog.domNode).forEach(function(el){
					this.dialog.own(
						on(el, 'blur', lang.hitch(this, function(e){
							e.preventDefault();
							e.stopPropagation();
							this.blurTime(e);
						})),
						on(el, 'keypress', lang.hitch(this, function(e){
							if(e.keyCode == 13){ // Enter
								this.blurTime(e);
							}
						}))
					);
				}, this);
				query('.tsext-jtb-number', this.dialog.domNode).forEach(function(el){
					this.dialog.own(
						on(el, 'blur', lang.hitch(this, function(e){
							e.preventDefault();
							e.stopPropagation();
							this.blurNumber(e);
						})),
						on(el, 'keypress', lang.hitch(this, function(e){
							if(e.keyCode == 13){ // Enter
								this.blurNumber(e);
							}
						}))
					);
				}, this);
				query('.tsext-jtb-amount', this.dialog.domNode).forEach(function(el){
					this.dialog.own(
						on(el, 'blur', lang.hitch(this, function(e){
							e.preventDefault();
							e.stopPropagation();
							this.blurMoney(e);
						})),
						on(el, 'keypress', lang.hitch(this, function(e){
							if(e.keyCode == 13){ // Enter
								this.blurMoney(e);
							}
						}))
					);
				}, this);
				this.setEventHandler();
			}
			this.deferred = new Deferred();
			this.resetForm();
			this.dialog.show();
			return this.deferred.promise;
		},
		hide: function(){
			if(this.dialog){
				this.dialog.hide();
			}
		},
		blurDate: function(e){
			this.showError();
		},
		blurTime: function(e){
			this.showError();
			if(e && e.target && e.target.value){
				e.target.value = Util.formatHour(e.target.value) || '';
			}
		},
		blurNumber: function(e){
			this.showError();
			if(e && e.target && e.target.value){
				e.target.value = '' + Util.str2num(e.target.value);
			}
		},
		blurMoney: function(e){
			this.showError();
			if(e && e.target && e.target.value){
				e.target.value = Util.formatMoney(Util.str2num(e.target.value));
			}
		},
		getOkButton: function(){
			return query('.tsext-ok', this.dialog.domNode)[0];
		},
		getCancelButton: function(){
			return query('.tsext-cancel', this.dialog.domNode)[0];
		},
		setSelector: function(e){
			e.preventDefault();
			e.stopPropagation();
			Selector.popup(e.target, this.dialog.domNode, this.getSelectContents(e.target));
		},
		onSelected: function(e){
		},
		showError: function(errmsg){
			var els = query('div.tsext-error', this.dialog.domNode);
			if(els.length){
				var el = els[0];
				domConstruct.empty(el);
				domConstruct.create('div', { innerHTML: (errmsg ? 'ERROR: ' : '') + errmsg }, el);
				domStyle.set(el, 'display', (errmsg ? '' : 'none'));
			}
		},
		onOk: function(){
		},
		onCancel: function(){
			this.deferred.reject();
			this.hide();
		},
		resetForm: function(){
		}
	});
});
