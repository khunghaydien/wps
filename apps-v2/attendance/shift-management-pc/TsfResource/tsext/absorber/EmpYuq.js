define([
	"dojo/_base/declare",
	"dojo/_base/lang",
	"dojo/_base/array",
	"dojo/string",
	"tsext/absorber/YuqDays",
	"tsext/util/Util"
], function(declare, lang, array, str, YuqDays, Util){
	return declare("tsext.absorber.EmpYuq", null, {
		constructor : function(o){
			o.CreatedDate	   = Util.formatDateTime(o.CreatedDate);
			o.LastModifiedDate = Util.formatDateTime(o.LastModifiedDate);
			o.StartDate__c	   = Util.formatDate(o.StartDate__c);
			o.LimitDate__c	   = Util.formatDate(o.LimitDate__c);
			o.Date__c		   = Util.formatDate(o.Date__c);
			this.obj = o;
			this.dateRange = this.getDateRange();
			this.yd = new YuqDays(this.obj.BaseTime__c, Math.abs(this.obj.TotalTime__c));
			this.details = [];
			this.parents = [];
			this.children = [];
		},
		getId           : function(){ return this.obj.Id; },
		getName         : function(){ return this.obj.Name; },
		getEmpId        : function(){ return this.obj.EmpId__c; },
		getCreatedDate  : function(){ return this.obj.CreatedDate; },
		getTotalTime    : function(){ return this.obj.TotalTime__c || 0; },
		isLostFlag      : function(){ return this.obj.LostFlag__c || false; },
		isProvide       : function(){ return (this.getTotalTime() >= 0); },
		isSpend         : function(){ return (this.getTotalTime() < 0);  },
		getStartDate    : function(){ return this.isProvide() ? this.obj.StartDate__c : ''; },
		getLimitDate    : function(){ return this.isProvide() ? this.obj.LimitDate__c : ''; },
		getDate         : function(){ return this.isProvide() ? '' : this.obj.Date__c; },
		getCategory     : function(){ return this.isProvide() ? '付与' : '消化'; },
		getProvideTime  : function(){ return this.isProvide() ? this.getTotalTime() : ''; },
		getSpendTime    : function(){ return this.isProvide() ? '' : this.getTotalTime(); },
		getBaseTime     : function(){ return Util.formatTime(this.obj.BaseTime__c); },
		getSubject      : function(){ return this.obj.Subject__c || ''; },

		getDateRange: function(){
			var sd = null;
			var ed = null;
			var em = {};
			if(this.obj.EmpApplyId__r && this.obj.EmpApplyId__r.StartDate__c){
				sd = Util.formatDate(this.obj.EmpApplyId__r.StartDate__c);
			}
			if(this.obj.EmpApplyId__r && this.obj.EmpApplyId__r.EndDate__c){
				ed = Util.formatDate(this.obj.EmpApplyId__r.EndDate__c);
			}
			if(!sd || !ed){
				return null;
			}
			var v = (this.obj.EmpApplyId__r && this.obj.EmpApplyId__r.ExcludeDate__c) || null;
			if(v){
				var exds = v.split(':');
				for(var i = 0 ; i < exds.length ; i++){
					var exd = exds[i];
					if(exd && /^\d{8}$/.test(exd)){
						var d = moment(exd, 'YYYYMMDD');
						if(d.isValid()){
							em[d.format('YYYY-MM-DD')] = 1;
						}
					}
				}
			}
			return {
				sd: sd,
				ed: ed,
				exclude: em
			};
		},
		getProvideDays  : function(){
			var yd = (this.isProvide() ? this.yd : null);
			return {
				days:  yd ? yd.getDays()  : '',
				hours: yd ? yd.getHours() : ''
			};
		},
		getSpendDays : function(){
			var yd = (this.isSpend() ? this.yd : null);
			return {
				days:  yd ? yd.getDays()  : '',
				hours: yd ? yd.getHours() : ''
			};
		},
		getSpendYuqDaysInRange : function(sd, ed){
			var dr = this.dateRange;
			var hd = this.getDate();
			if(dr && dr.sd < dr.ed){
				var n = 0;
				var F = 'YYYY-MM-DD';
				var d = dr.sd;
				while(d <= dr.ed){
					if(!dr.exclude[d] && sd <= d && d <= ed){
						n++;
					}
					d = moment(d, F).add(1, 'd').format(F);
				}
				return new YuqDays(this.obj.BaseTime__c, this.obj.BaseTime__c * n);
			}else if((dr && sd <= dr.sd && dr.sd <= ed)
			|| (hd && sd <= hd && hd <= ed)){
				return this.yd;
			}
			return null;
		},

		getEmpApplyName : function(){
			if(this.isProvide() && !this.obj.EmpApplyId__c){
				return '(手動付与)';
			}else if(!this.isProvide() && this.isLostFlag()){
				return '(マイナス付与)';
			}
			return (this.obj.EmpApplyId__r && this.obj.EmpApplyId__r.Name) || '';
		},
		// 残数を返す（紐づけ情報を無視）
		getRemainOptimal : function(){
			var yd = new YuqDays(this.obj.BaseTime__c, Math.abs(this.obj.TotalTime__c));
			if(this.isProvide()){
				for(var i = 0 ; i < this.children.length ; i++){
					yd.subtract(this.children[i].yuq.yd.clone(this.children[i].time));
				}
			}else{
				for(var i = 0 ; i < this.parents.length ; i++){
					yd.subtract(this.parents[i].yuq.yd.clone(this.parents[i].time));
				}
			}
			return yd.getAllMinutes();
		},
		// 残数を返す
		getRemain : function(){
			var yd = new YuqDays(this.obj.BaseTime__c, Math.abs(this.obj.TotalTime__c));
			if(this.isProvide()){
				for(var i = 0 ; i < this.details.length ; i++){
					var detail = this.details[i];
					var empYuq = detail.getEmpYuq();
					if(empYuq.isSpend()){
						yd.subtract(empYuq.yd.clone(detail.getTime()));
					}
				}
			}
			return yd.getAllMinutes();
		},
		getProvideRemain : function(){
			var yd = (this.isProvide() ? this.yd.clone(this.getRemainOptimal()) : null);
			return {
				days:  yd ? yd.getDays()  : '',
				hours: yd ? yd.getHours() : ''
			};
		},
		isExpired : function(){
			if(this.isProvide()
			&& this.getRemainOptimal() > 0
			&& this.getLimitDate() <= Util.today()){
				return '失効';
			}
			return '';
		},
		inRange : function(spend){
			if(this.getStartDate() <= spend.getDate()
			&& spend.getDate() < this.getLimitDate()){
				return true;
			}
			return false;
		},
		addDetail : function(detail){
			this.details.push(detail);
		},
		addChild : function(yuq){
			var time = Math.min(this.getRemainOptimal(), yuq.getRemainOptimal());
			this.children.push({ time: time, yuq: yuq });
			yuq.addParent(this, time);
		},
		addParent : function(yuq, time){
			this.parents.push({ time: time, yuq: yuq });
		},
		getFork : function(){
			if(this.isProvide()){
				return '';
			}
			return this.parents.length;
		},
		isConnect : function(){
			return (this.isSpend() && this.obj.EmpYuqDetailR__r && this.obj.EmpYuqDetailR__r.length > 0);
		},
		isNgRecord : function(){
			return (this.isSpend() && this.obj.LimitDate__c) ? true : false;
		},
		getConnectStatus : function(){
			if(this.isProvide()){
				return '－';
			}else{
				return (this.isConnect() ? '' : '切断');
			}
		},
		// 関連する勤怠積休詳細レコードが存在しない消化レコードの日数
		getDisconnectDays : function(){
			if(this.isSpend() && !this.isConnect()){
				return this.getSpendDays();
			}
			return {
				days:  '',
				hours: ''
			};
		},
		getDetailById : function(obj){
			for(var i = 0 ; i < this.details.length ; i++){
				var detail = this.details[i];
				if(detail.getEmpYuqId() == obj.EmpYuqId__c
				&& detail.getGroupId()  == obj.GroupId__c){
					return detail;
				}
			}
			return null;
		},
		format : function(t){
			if(!t){
				return this.yd.format();
			}else{
				var yq = new YuqDays(this.obj.BaseTime__c, Math.abs(t));
				return yq.format();
			}
		}
	});
});
