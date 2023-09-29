teasp.provide('teasp.logic.EmpTime');

teasp.logic.YuqDays = function(bt, mt){
    this.mix = true;
    this.setValue((bt || 0), (mt || 0));
};

teasp.logic.YuqDays.prototype.setValue = function(bt, mt){
    this.baseTime = bt;
    var hbt = (this.baseTime ? (this.baseTime / 2) : 0);
    this.days = ((hbt && mt >= hbt) ? Math.floor(mt / hbt) / 2 : 0);
    this.minutes = (hbt ? (mt % hbt) : 0);
    if(this.minutes && (this.minutes % 60) > 0 && this.days > 0 && (hbt % 60) > 0){
        this.days -= 0.5;
        this.minutes += hbt;
    }
};

teasp.logic.YuqDays.prototype.append = function(yq){
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
};

teasp.logic.YuqDays.prototype.subtract = function(yq){
    if(!this.baseTime){
        return;
    }
    var z = this.getAllMinutes() - yq.calcMinutesByBaseTime(this.baseTime);
    if(z < 0){
        z = 0;
    }
    this.setValue(this.baseTime, z);
};

teasp.logic.YuqDays.prototype.calcMinutesByBaseTime = function(bt){
    return (bt * this.days) + this.minutes;
};

teasp.logic.YuqDays.prototype.format = function(){
    var d = this.days;
    var t = this.minutes;
    if(!d && !t){ return '0'; }
    if(!t){ return '' + d; }
    if(!d){ return teasp.util.time.timeValue(t); }
    return '' + d + '+' + teasp.util.time.timeValue(t);
};

teasp.logic.YuqDays.prototype.getDays       = function(){ return this.days; };
teasp.logic.YuqDays.prototype.getMinutes    = function(){ return this.minutes; };
teasp.logic.YuqDays.prototype.getHours      = function(){ return (this.minutes ? this.minutes / 60 : 0); };
teasp.logic.YuqDays.prototype.getBaseTime   = function(){ return this.baseTime; };
teasp.logic.YuqDays.prototype.getAllMinutes = function(){ return this.calcMinutesByBaseTime(this.baseTime); };
