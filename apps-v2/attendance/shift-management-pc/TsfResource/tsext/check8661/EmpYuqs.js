define([
	"dojo/_base/declare",
	"dojo/_base/lang",
	"dojo/_base/array",
	"dojo/string",
	"tsext/check8661/Emp",
	"tsext/util/Util"
], function(declare, lang, array, str, Emp, Util){
	return declare("tsext.check8661.EmpYuqs", null, {
		constructor : function(){
			this.yuqs = [];
		},
		getSize:function(){
			return this.yuqs.length;
		},
		get:function(index){
			return this.yuqs[index];
		},
		addEmpYuq:function(yuq){
			if(!yuq.isAdjustHourlyHoliday()){
				this.yuqs.push(yuq);
			}
		},
		getYuqById: function(id){
			for(var i = 0 ; i < this.yuqs.length ; i++){
				var yuq = this.yuqs[i];
				if(yuq.getId() == id){
					return yuq;
				}
			}
			return null;
		},
		addEmpYuqDetail: function(detail){
			var groupYuq = this.getYuqById(detail.getGroupId());
			var empYuq   = this.getYuqById(detail.getEmpYuqId());
			detail.setEmpYuq(empYuq);
			detail.setGroupYuq(groupYuq);
			if(groupYuq){
				groupYuq.addDetail(detail);
				if(empYuq.isSpend()){
					groupYuq.addChild(empYuq);
				}
				if(detail.isLostFlag()){
					groupYuq.addChild(empYuq);
				}
			}
		},
		build: function(){
			// 勤怠積休をソート
			// 付与なら失効日＞有効開始日＞生成日時
			// 消化なら発生日＞生成日時
			this.yuqs = this.yuqs.sort(function(a, b){
				if(a.isProvide() && b.isProvide()){
					if(a.getLimitDate() == b.getLimitDate()){
						if(a.getStartDate() == b.getStartDate()){
							return (a.getCreatedDate() < b.getCreatedDate() ? -1 : 1);
						}else{
							return (a.getStartDate() < b.getStartDate() ? -1 : 1);
						}
					}else if(a.getStartDate() == b.getStartDate()){
						return (a.getCreatedDate() < b.getCreatedDate() ? -1 : 1);
					}else{
						return (a.getStartDate() < b.getStartDate() ? -1 : 1);
					}
				}else if(a.isSpend() && b.isSpend()){
					if(a.getDate() == b.getDate()){
						return (a.getCreatedDate() < b.getCreatedDate() ? -1 : 1);
					}else{
						return (a.getDate() < b.getDate() ? -1 : 1);
					}
				}else if(a.isProvide()){
					return -1;
				}else{
					return 1;
				}
			});
		},
		// 出力対象リスト
		getOutputList: function(){
			var list = [];
			array.forEach(this.yuqs, function(yuq){
				if(yuq.isProvide()){
					list.push({ yuq: yuq });
					for(var i = 0 ; i < yuq.children.length ; i++){
						list.push(yuq.children[i]);
					}
				}
			}, this);
			array.forEach(this.yuqs, function(yuq){
				if(!yuq.isProvide() && yuq.getRemainOptimal() > 0){
					var tgt = { yuq: yuq, time: yuq.getRemainOptimal(), invalid: true };
					var pushed = false;
					for(var i = 0 ; i < list.length ; i++){
						var o = list[i];
						if((o.yuq.isSpend()   && tgt.yuq.getDate() < o.yuq.getDate())
						|| (o.yuq.isProvide() && tgt.yuq.getDate() < o.yuq.getStartDate())){
							list.splice(i, 0, tgt);
							pushed = true;
							break;
						}
					}
					if(!pushed){
						list.push(tgt);
					}
				}
			}, this);
			return list;
		},
		// 付与の合計日数
		getProvideDays: function(){
			var yd = null;
			array.forEach(this.yuqs, function(yuq){
				if(yuq.isProvide()){
					if(!yd){
						yd = yuq.yd.clone();
					}else{
						yd.append(yuq.yd);
					}
				}
			}, this);
			return {
				days:  yd ? yd.getDays()  : '',
				hours: yd ? yd.getHours() : ''
			};
		},
		// 失効分した付与の合計日数
		getExpiredDays: function(){
			var yd = null;
			array.forEach(this.yuqs, function(yuq){
				var t = yuq.getRemainOptimal();
				if(yuq.isProvide() && t > 0 && yuq.isExpired()){
					if(!yd){
						yd = yuq.yd.clone(t);
					}else{
						yd.append(yuq.yd.clone(t));
					}
				}
			}, this);
			return {
				days:  yd ? yd.getDays()  : '',
				hours: yd ? yd.getHours() : ''
			};
		},
		// ロジックで算出した失効分を除いた残日数
		getRemainDays: function(){
			var yd = null;
			array.forEach(this.yuqs, function(yuq){
				var t = yuq.getRemainOptimal();
				if(yuq.isProvide() && t > 0 && !yuq.isExpired()){
					if(!yd){
						yd = yuq.yd.clone(t);
					}else{
						yd.append(yuq.yd.clone(t));
					}
				}
			}, this);
			return {
				days:  yd ? yd.getDays()  : '',
				hours: yd ? yd.getHours() : ''
			};
		},
		// 消化の合計日数
		getSpendDays: function(){
			var yd = null;
			array.forEach(this.yuqs, function(yuq){
				if(yuq.isSpend()){
					if(!yd){
						yd = yuq.yd.clone();
					}else{
						yd.append(yuq.yd.clone());
					}
				}
			}, this);
			return {
				days:  yd ? yd.getDays()  : '',
				hours: yd ? yd.getHours() : ''
			};
		},
		// 範囲内の残日数
		getYuqRemainDaysInRange: function(sd, ed){
			var yd = null;
			array.forEach(this.yuqs, function(yuq){
				var t = yuq.getRemain();
				if(yuq.isProvide() && t > 0
				&& yuq.getStartDate() <= ed && yuq.getLimitDate() > sd){
					if(!yd){
						yd = yuq.yd.clone(t);
					}else{
						yd.append(yuq.yd.clone(t));
					}
				}
			}, this);
			return {
				dispValue: yd ? yd.format() : '0',
				days:  yd ? yd.getDays()  : 0,
				hours: yd ? yd.getHours() : 0
			};
		},
		// 範囲内の残日数のある付与を返す
		getRemainYuqDaysInRange: function(sd, ed){
			var yds = [];
			array.forEach(this.yuqs, function(yuq){
				var t = yuq.getRemain();
				if(yuq.isProvide() && t > 0
				&& yuq.getStartDate() <= ed && yuq.getLimitDate() > sd){
					yds.push({
						empYuq: yuq,
						yd: yuq.yd.clone(t)
					});
				}
			}, this);
			return yds;
		},
		// 範囲内の消化の合計日数
		getYuqSpendDaysInRange: function(sd, ed){
			var yd = null;
			array.forEach(this.yuqs, function(yuq){
				if(yuq.isSpend()){
					var y = yuq.getSpendYuqDaysInRange(sd, ed);
//console.log(yuq.getName() + ', ' + yuq.getSubject() + ', ' + yuq.format() + ' -> ' + y.format());
					if(y && y.getAllMinutes() > 0){
						if(!yd){
							yd = y.clone();
						}else{
							yd.append(y.clone());
						}
					}
				}
			}, this);
			return {
				dispValue: yd ? yd.format() : '0',
				days:  yd ? yd.getDays()  : 0,
				hours: yd ? yd.getHours() : 0
			};
		},
		// 付与レコードに紐づけられない消化レコードの合計日数
		getInvalidDays: function(){
			var yd = null;
			array.forEach(this.yuqs, function(yuq){
				var t = yuq.getRemainOptimal();
				if(yuq.isSpend() && t > 0){
					if(!yd){
						yd = yuq.yd.clone(t);
					}else{
						yd.append(yuq.yd.clone(t));
					}
				}
			}, this);
			return {
				days:  yd ? yd.getDays()  : '',
				hours: yd ? yd.getHours() : ''
			};
		},
		// 関連する勤怠積休詳細レコードが存在しない消化レコードの合計日数
		getDisconnectDays: function(){
			var yd = null;
			array.forEach(this.yuqs, function(yuq){
				if(yuq.isSpend() && !yuq.isConnect()){
					if(!yd){
						yd = yuq.yd.clone();
					}else{
						yd.append(yuq.yd.clone());
					}
				}
			}, this);
			return {
				days:  yd ? yd.getDays()  : '',
				hours: yd ? yd.getHours() : ''
			};
		}
	});
});
