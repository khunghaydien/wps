define([
	"dojo/_base/declare",
	"dojo/_base/lang",
	"dojo/_base/array",
	"dojo/string",
	"tsext/util/Util"
], function(declare, lang, array, str, Util){
	return declare("tsext.check8661.EmpType", null, {
		constructor : function(obj){
			this.obj = obj;
			this.obj.CreatedDate = Util.formatDateTime(obj.CreatedDate);
			this.obj.LastModifiedDate = Util.formatDateTime(obj.LastModifiedDate);
		},
		getId: function(){
			return this.obj.Id;
		},
		getName: function(){
			return this.obj.Name;
		},
		getObj: function(){
			return this.obj;
		},
		// 有休自動付与
		isYuqProvideAuto: function(){
			var v = this.obj.YuqOption__c;
			return (v == '1' || v == '2');
		},
		// 有休自動付与：付与方法
		getYuqProvideType: function(){
			var v = this.obj.YuqOption__c;
			return (v == '2' ? '指定日に定期付与' : (v == '1' ? '入社日を基準に付与' : ''));
		},
		// 有休自動付与：指定日
		getYuqProvideDate: function(){
			var v = this.obj.YuqOption__c;
			var md = (v == '2' && this.obj.YuqDate1__c) || 0;
			var m = (md >= 100 ? Math.floor(md / 100) : 0);
			var d = md % 100;
			return (m > 0 && d > 0) ? (m + '/' + d) : '';
		},
		// 有休自動付与：付与日数
		getYuqProvideDays: function(){
			var vs = [];
			array.forEach(this.obj.AtkEmpTypeYuqR1__r || [], function(o){
				var v = '';
				if(o.Year__c){
					v += o.Year__c + '年';
				}
				if(o.Month__c){
					v += o.Month__c + 'ヵ月';
				}
				if(o.Days__c == -1){
					v += 'm';
				}
				v += ':' + o.Provide__c + '日';
				vs.push(v);
			});
			return vs.join(', ');
		},
		// 有休自動付与：付与の通知不要
		isYuqAssignNoMessages: function(){
			return this.obj.YuqAssignNoMessages__c || false;
		},
		getProvideByElapsed: function(entryDate, fuyoDate){
			if(!entryDate || !fuyoDate){
				return '';
			}
			var F = 'YYYY-MM-DD';
			var realNextDate = moment(fuyoDate, F).add(1, 'Y').add(-1, 'd');
			var yuqs = this.obj.AtkEmpTypeYuqR1__r || [];
			for(var i = yuqs.length - 1 ; i >= 0 ; i--){
				var yuq = yuqs[i];
				var d = moment(entryDate, F).add(yuq.Year__c || 0, 'Y').add(yuq.Month__c || 0, 'M').add(yuq.Days__c || 0, 'd');
				if(d.isSameOrBefore(realNextDate)){
					return yuq.Provide__c;
				}
			}
			return 0;
		},
		// CSV用
		getLine: function(){
			var lst = [];
			lst.push(this.obj.Id);
			lst.push(this.obj.Name);
			lst.push(this.obj.CreatedDate);
			lst.push(this.obj.LastModifiedDate);
			lst.push(this.isYuqProvideAuto());
			lst.push(this.getYuqProvideType());
			lst.push(this.getYuqProvideDate());
			lst.push(this.getYuqProvideDays());
			lst.push(this.isYuqAssignNoMessages());
			lst.push(this.isTarget());
			return '"' + lst.join('","') + '"';
		},
		// 付与日数設定の間隔が1年超のものがあればtrueを返す
		isTarget: function(){
			var yuqs = this.obj.AtkEmpTypeYuqR1__r || [];
			var prv = null;
			var hit = false;
			for(var i = 0 ; i < yuqs.length ; i++){
				var yuq = yuqs[i];
				if(prv){
					var m = yuq.Year__c * 12 + yuq.Month__c;
					var n = prv.Year__c * 12 + prv.Month__c;
					if((m - n) > 12){
						hit = true;
						break;
					}
				}
				prv = yuq;
			}
			return hit;
		}
	});
});
