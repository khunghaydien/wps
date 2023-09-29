teasp.provide('teasp.helper.ScheduleGroup');

/**
 * 行動グループクラス
 *
 * @constructor
 */
teasp.helper.ScheduleGroup = function(ev){
	this.evs = []; // 行動の配列
	this.lanes = []; // レーンの配列
	if(ev){
		this.addEv(ev);
	}
};

teasp.helper.ScheduleGroup.prototype.getEvs = function(){ return this.evs; };
teasp.helper.ScheduleGroup.prototype.getLaneSize = function(){ return this.lanes.length; };

/**
 * 引数の行動を所有する行動に追加する
 * 同時に所有するレーンに行動を追加（レーン内の行動に重なる場合はレーンを増やして追加）
 * @param {Object} ev
 */
teasp.helper.ScheduleGroup.prototype.addEv = function(ev){
	this.evs.push(ev);
	if(!this.lanes.length){
		this.lanes.push(new teasp.helper.ScheduleLane(0, ev));
	}else{
		var x = 0;
		while(x < this.lanes.length){
			if(!this.lanes[x].isOverlaps(ev)){
				this.lanes[x].addEv(ev);
				break;
			}
			x++;
		}
		if(x >= this.lanes.length){
			this.lanes.push(new teasp.helper.ScheduleLane(x, ev));
		}
	}
};

/**
 * 引数の行動と所有する行動のいずれかとの重なりをチェック
 * @param {Object} ev
 *
 */
teasp.helper.ScheduleGroup.prototype.isOverlap = function(ev){
	for(var i = 0 ; i < this.evs.length ; i++){
		if(this.evs[i].isOverlap(ev)){
			return true;
		}
	}
	return false;
};

/**
 * レーン毎に行動の終端レーンを検索して（右方向に重なる行動があるかどうかで）セット
 * 右方向に重なる行動がない行動は、最後のレーンを終端とする。
 *
 */
teasp.helper.ScheduleGroup.prototype.buildEndPos = function(){
	for(var i = 0 ; i < this.lanes.length ; i++){
		var lane = this.lanes[i];
		var x = i + 1;
		while(x < this.lanes.length){
			lane.searchEndPos(this.lanes[x]);
			x++;
		}
	}
	for(var i = 0 ; i < this.evs.length ; i++){
		var ev = this.evs[i];
		if(ev.getEndPos() < 0){
			ev.setEndPos(this.getLaneSize() - 1);
		}
	}
};

/**
 * 全行動の終端レーンをセット
 *
 * @param {Array.<Object>} grps
 */
teasp.helper.ScheduleGroup.buildEndPosAll = function(grps){
	for(var i = 0 ; i < grps.length ; i++){
		grps[i].buildEndPos();
	}
};
