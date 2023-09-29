define([
	"dojo/_base/declare",
	"dojo/_base/lang",
	"dojo/_base/array",
	"dojo/string",
	"tsext/util/Util"
], function(declare, lang, array, str, Util){
	return declare("tsext.leave.StockTransition", null, {
		constructor : function(obj){
			this.obj = obj;
			this.remains = [];
			this.sn = 0;
			this.timeSn = 0;
			this.seqno = 0;
		},
		getName: function(){
			return (this.obj.stock && this.obj.stock.getName()) || '';
		},
		getMark: function(flag){
			if(flag){
				return (this.obj.pstock && this.obj.pstock.getMark()) || '';
			}
			return (this.obj.stock && this.obj.stock.getMark()) || '';
		},
		isProvide: function(){ // 付与
			return (this.obj.stock && this.obj.stock.isProvide() || false);
		},
		isSpend: function(){ // 消化
			return (this.obj.stock && this.obj.stock.isSpend() || false);
		},
		isLostFlag: function(){ // マイナス付与
			return (this.obj.stock && this.obj.stock.isLostFlag() || false);
		},
		isChanged: function(){ // 基準時間変更
			return this.obj.changed || false;
		},
		isExpired: function(){ // 失効
			return this.obj.expired || false;
		},
		isSolo: function(){
			return (this.obj.stock && this.obj.stock.isSolo()) || false;
		},
		isEditable: function(){ // 編集可
			return (this.isSolo() || this.isProvide());
		},
		isDeletable: function(){ // 削除可
			return (this.isSolo());
		},
		isReleasable: function(){ // 解除可
			return (this.obj.stock ? true : false);
		},
		getStock: function(){ // 勤怠積休情報
			return this.obj.stock || null;
		},
		getDate: function(){ // 発生日
			return this.obj.date || null;
		},
		getPstock: function(){ // 消化元または失効または基準時間変更の付与
			return this.obj.pstock || null;
		},
		getBaseTime: function(){ // 基準時間
			if(this.isExpired() || this.isChanged()){
				return this.obj.baseTime;
			}else if(this.obj.stock){
				return this.obj.stock.getBaseTime();
			}
			return null;
		},
		getBaseTimeHMM: function(){
			var bt = this.getBaseTime();
			return (typeof(bt) == 'number' ? Util.formatTime(bt) : '');
		},
		setBaseTime: function(bt){ // 失効数を算出するための基準時間
			this.obj.baseTime = bt;
		},
		getSpendType: function(){
			return (this.isSpend() && this.obj.stock.getSpendType()) || '';
		},
		syncClass: function(bt){
			return (this.obj.stock && this.obj.stock.syncClass()) || '';
		},
		setExpiredObj: function(o){ // 失効数を持つオブジェクトをセット
			this.expiredObj = o;
		},
		getFluct: function(){ // 増減値を返す
			return this.fluct || 0;
		},
		setFluct: function(f){ // 増減値をセット
			this.fluct = f;
		},
		getSeqno: function(){ //
			return this.seqno;
		},
		setSeqno: function(seqno){ //
			this.seqno = seqno;
		},
		getSn: function(){ // 付与別順
			return this.sn;
		},
		setSn: function(n){ // 付与別順をセット
			this.sn = n;
		},
		getTimeSn: function(){ // 時系列順
			return this.timeSn;
		},
		setTimeSn: function(n){ // 時系列順をセット
			this.timeSn = n;
		},
		getStartDate: function(){ // 有効開始日
			if(this.isChanged() || this.isExpired()){
				return this.obj.startDate;
			}
			return (this.isProvide() && this.getStock().getStartDate()) || '';
		},
		getEndDate: function(){ // 終了日
			if(this.isChanged() || this.isExpired()){
				return this.obj.endDate;
			}
			return '';
		},
		getLimitDate: function(){ // 失効日
			return (this.isProvide() && this.getStock().getLimitDate()) || '';
		},
		getProvideDate: function(){ // 付与日
			return (this.isProvide() && this.getStock().getProvideDate()) || '';
		},
		getProvideDays: function(){ // 付与日数
			return (this.isProvide() && this.getStock().getDays()) || '';
		},
		getProvideTime: function(){ // 付与時間
			return (this.isProvide() && this.getStock().getHoursHMM()) || '';
		},
		getProvideRaw5: function(){ // 付与日数＋時間を日数換算値で返す
			return (this.isProvide() && this.getStock().getDayHours(true)) || '';
		},
		getRemain: function(){ // 残
			return Util.dispNum(this.isProvide() && this.getStock().getRemain(true), '');
		},
		getSpendDays: function(){ // 消化日数
			if(this.isExpired()){ // 失効による消化
				return this.expiredObj.days;
			}else if(this.isSpend()){
				if(this.isSolo()){
					return (new Decimal(this.getStock().getDays())).abs().toDecimalPlaces(5).toNumber();
				}else{
					return this.getStock().getDaysByProvide(this.getPstock());
				}
			}else{
				return '';
			}
		},
		getSpendTime: function(){ // 消化時間
			if(this.isExpired()){ // 失効による消化
				return this.expiredObj.time;
			}else if(this.isSpend()){
				if(this.isSolo()){
					return Util.formatTime(this.getStock().getMinutes());
				}else{
					return this.getStock().getHoursByProvideHMM(this.getPstock());
				}
			}else{
				return '';
			}
		},
		getSpendRaw5: function(){ // 消化日数＋時間を日数換算値で返す
			if(this.isExpired()){ // 失効による消化
				return this.expiredObj.raw5;
			}else if(this.isSpend()){
				return this.getStock().getDayHoursByProvide(this.getPstock(), true)
			}else{
				return '';
			}
		},
		getJson: function(flag){
			if(flag){
				return (this.obj.pstock && this.obj.pstock.getJson()) || '';
			}
			return (this.obj.stock && this.obj.stock.getJson()) || '';
		},
		getDetailJson: function(){
			if(this.isSpend()){
				return this.getStock().getDetailJson(this.getPstock());
			}else{
				return '';
			}
		},
		/**
		 * @param {{
		 *   {number} raw      ex.1.733333333
		 *   {number} raw5     ex.1.73333
		 *   {number} days     ex.1
		 *   {string} time     ex."2:00"
		 *   {number} minutes  ex.120
		 *   {string} disp     ex."1日+2:00"
		 * }} o
		 */
		setRemain1: function(o){ // 付与別の残日数をセット
			this.remains[0] = o;
		},
		setRemain2: function(o){ // 時系列順の残日数をセット
			this.remains[1] = o;
		},
		getRemainDays: function(vm){
			return Util.dispNum((this.remains[(vm ? 0 : 1)] || {}).days, '');
		},
		getRemainTime: function(vm){
			return (this.remains[(vm ? 0 : 1)] || {}).time || '';
		},
		getRemainRaw5: function(vm){
			return Util.dispNum((this.remains[(vm ? 0 : 1)] || {}).raw5, '');
		}
	});
});
