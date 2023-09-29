teasp.provide('teasp.helper.ScheduleLanes');

/**
 * レーンクラス
 * @constructor
 * @param {number} pos レーンのインデックス（0～）
 * @param {Object} ev
 */
teasp.helper.ScheduleLane = function(pos, ev){
	this.pos = pos;
	this.evs = [];
	if(ev){
		this.addEv(ev);
	}
};

teasp.helper.ScheduleLane.prototype.getPos = function(){ return this.pos; };

teasp.helper.ScheduleLane.prototype.addEv = function(ev){
	ev.setPos(this.pos);
	this.evs.push(ev);
};

/**
 * 引数の行動と当レーン内の行動との重なりをチェック
 * @param ev
 * @returns {Boolean}
 */
teasp.helper.ScheduleLane.prototype.isOverlaps = function(ev){
	for(var i = 0 ; i < this.evs.length ; i++){
		if(this.evs[i].isOverlap(ev)){
			return true;
		}
	}
	return false;
};

/**
 * 当レーン内の行動１件ごとに引数のレーンの行動との重なりをチェック
 * 重なる場合は引数のレーンの1つ手前を終端レーンとする。
 *
 * @param {Object} lane
 */
teasp.helper.ScheduleLane.prototype.searchEndPos = function(lane){
	for(var i = 0 ; i < this.evs.length ; i++){
		var ev = this.evs[i];
		if(ev.getEndPos() < 0 && lane.isOverlaps(ev)){
			ev.setEndPos(lane.getPos() - 1);
		}
	}
};
