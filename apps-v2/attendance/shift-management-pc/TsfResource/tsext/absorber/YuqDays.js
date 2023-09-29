define([
	"dojo/_base/declare",
	"dojo/_base/lang",
	"dojo/_base/array",
	"dojo/string",
	"tsext/util/Util"
], function(declare, lang, array, str, Util){
	return declare("tsext.absorber.YuqDays", null, {
		constructor : function(bt, mt){
			this.mix = true;
			this.setValue((bt || 0), (mt || 0));
		},
		setValue: function(bt, mt){
			this.baseTime = bt;
			var hbt = (this.baseTime ? (this.baseTime / 2) : 0);
			this.days = ((hbt && mt >= hbt) ? Math.floor(mt / hbt) / 2 : 0);
			this.minutes = (hbt ? (mt % hbt) : 0);
			if(this.minutes && (this.minutes % 60) > 0 && this.days > 0 && (hbt % 60) > 0){
				this.days -= 0.5;
				this.minutes += hbt;
			}
		},
		append: function(yq){
			if(this.baseTime == 0){
				this.baseTime = yq.getBaseTime();
			}
			if(!this.mix || this.baseTime != yq.getBaseTime()){
				this.mix = false;
				this.days += yq.getDays();
				this.minutes += yq.getMinutes();
			}else{
				this.setValue(this.baseTime, ((this.days + yq.getDays()) * this.baseTime + (this.minutes + yq.getMinutes())));
			}
		},
		subtract: function(yq){
			if(!this.baseTime){
				return;
			}
			var z = this.getAllMinutes() - yq.calcMinutesByBaseTime(this.baseTime);
			if(z < 0){
				z = 0;
			}
			this.setValue(this.baseTime, z);
		},
		calcMinutesByBaseTime: function(bt){
			return (bt * this.days) + this.minutes;
		},
		format: function(){
			var d = this.days;
			var t = this.minutes;
			if(!d && !t){ return '0'; }
			if(!t){ return '' + d; }
			if(!d){ return Util.formatTime(t); }
			return '' + d + '+' + Util.formatTime(t);
		},
		getDays 	 : function(){ return this.days; },
		getMinutes	 : function(){ return this.minutes; },
		getHours	 : function(){ return (this.minutes ? this.minutes / 60 : 0); },
		getBaseTime  : function(){ return this.baseTime; },
		getAllMinutes: function(){ return this.calcMinutesByBaseTime(this.baseTime); },
		min: function(yq){
		    return Math.min(this.getAllMinutes(), yq.calcMinutesByBaseTime(this.baseTime));
		},
		clone: function(t){
			var time = (typeof(t) == 'number' ? Math.abs(t) : this.calcMinutesByBaseTime(this.baseTime));
		    return new tsext.absorber.YuqDays(this.baseTime, time);
		}
	});
});
