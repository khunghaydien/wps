define([
	"dojo/_base/declare",
	"dojo/_base/lang",
	"dojo/_base/json",
	"dojo/_base/array",
	"dojo/query",
	"dojo/on",
	"dojo/Deferred",
	"dojo/dom",
	"dojo/dom-construct",
	"dojo/dom-attr",
	"dojo/dom-class",
	"dojo/dom-style",
	"dijit/Dialog",
	"tsext/service/Request",
	"dojo/text!tsext/leave/DialogHolidays.html",
	"tsext/util/Util"
], function(declare, lang, json, array, query, on, Deferred, dom, domConstruct, domAttr, domClass, domStyle, Dialog, Request, template, Util) {
	return declare("tsext.leave.DialogHolidays", null, {
		constructor : function(){
			this.holidays = null;
		},
		show : function(holidays) {
			this.holidays = holidays;
			this.deferred = new Deferred();
			this.dialog = new Dialog({
				title: "休暇リスト",
				content: template
			});
			this.dialog.own(
				on(this.dialog, 'cancel', lang.hitch(this, this.onClose)),
				on(query('.tsext-c-cancel', this.dialog.domNode)[0], 'click', lang.hitch(this, this.onClose)),
				on(dom.byId('managedOnly') , 'change', lang.hitch(this, this.changedManagedOnly)),
				on(dom.byId('originalOnly'), 'change', lang.hitch(this, this.changedOriginalOnly))
			);
			dom.byId('managedOnly').checked = true;
			dom.byId('originalOnly').checked = true;
			this.build();
			this.dialog.show();
			return this.deferred.promise;
		},
		build : function(){
			var managedOnly = dom.byId('managedOnly').checked;
			var originalOnly = dom.byId('originalOnly').checked;
			var area = query('div.tsext-holidays', this.dialog.domNode)[0];
			domConstruct.empty(area);
			var table = domConstruct.create('table', null, area);
			var thead = domConstruct.create('thead', null, table);
			var tr = domConstruct.create('tr', null, thead);
			domConstruct.create('th', { innerHTML:'休暇名'     }, tr);
			domConstruct.create('th', { innerHTML:'種類'       }, tr);
			domConstruct.create('th', { innerHTML:'範囲'       }, tr);
			domConstruct.create('th', { innerHTML:'有休消化'   }, tr);
			domConstruct.create('th', { innerHTML:'出勤率判定' }, tr);
			domConstruct.create('th', { innerHTML:'暦日表示'   }, tr);
			domConstruct.create('th', { innerHTML:'前日の勤務', title:'24時を超える勤務を禁止する' }, tr);
			domConstruct.create('th', { innerHTML:'日数管理'   }, tr);
			domConstruct.create('th', { innerHTML:'管理名'     }, tr);
			domConstruct.create('th', { innerHTML:'大分類名'   }, tr);
			domConstruct.create('th', { innerHTML:'並び順'     }, tr);
			var tbody = domConstruct.create('tbody', null, table);
			array.forEach(this.holidays.getAll(), function(holiday){
				if((!managedOnly || holiday.isManaged()) && (!originalOnly || holiday.isOriginal())){
					var tr = domConstruct.create('tr', null, tbody);
					domConstruct.create('div', { innerHTML:holiday.getName()                 }, domConstruct.create('td', { style:'text-align:left;', title:holiday.getJson() }, tr));
					domConstruct.create('div', { innerHTML:holiday.getType()                 }, domConstruct.create('td', { style:'text-align:left;'  }, tr));
					domConstruct.create('div', { innerHTML:holiday.getRange()                }, domConstruct.create('td', { style:'text-align:left;'  }, tr));
					domConstruct.create('div', { innerHTML:holiday.isYuqSpend()              }, domConstruct.create('td', { style:'text-align:left;'  }, tr));
					domConstruct.create('div', { innerHTML:holiday.isWorking()               }, domConstruct.create('td', { style:'text-align:left;'  }, tr));
					domConstruct.create('div', { innerHTML:holiday.isDisplayDaysOnCalendar() }, domConstruct.create('td', { style:'text-align:left;'  }, tr));
					domConstruct.create('div', { innerHTML:holiday.isProhibitOverNightWork() }, domConstruct.create('td', { style:'text-align:left;'  }, tr));
					domConstruct.create('div', { innerHTML:holiday.isManaged()               }, domConstruct.create('td', { style:'text-align:left;'  }, tr));
					domConstruct.create('div', { innerHTML:holiday.getManageName()           }, domConstruct.create('td', { style:'text-align:left;'  }, tr));
					domConstruct.create('div', { innerHTML:holiday.getSummaryName()          }, domConstruct.create('td', { style:'text-align:left;'  }, tr));
					domConstruct.create('div', { innerHTML:holiday.getOrder()                }, domConstruct.create('td', { style:'text-align:right;' }, tr));
				}
			}, this);
		},
		changedManagedOnly : function(){
			this.build();
		},
		changedOriginalOnly : function(){
			this.build();
		},
		onClose : function(){
			this.deferred.reject();
			this.hide();
		},
		hide : function(){
			if(this.dialog){
				this.dialog.hide().then(lang.hitch(this, function(){
					this.dialog.destroyRecursive();
					this.dialog = null;
				}));
			}
		}
	});
});
