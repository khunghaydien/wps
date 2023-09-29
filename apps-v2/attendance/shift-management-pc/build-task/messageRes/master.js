// メッセージリソース生成モジュール
// 日本語、ID と英語メッセージのマッピングテーブル生成
var fs = require('fs');

function masterTable(){
};

masterTable.prototype.init = function(obj){
	this.idmap = {}; // ID => 英訳のマップ
	this.jamap = {}; // 日本語 => 英訳のマップ
};

masterTable.prototype.addLine = function(srcType, o){
	// idmap, jamap に値をセットする
	if(srcType == 0){ // TSLANG-対訳のデータが対象
		if(o.id){
			this.idmap[o.id] = o.en;
		}
		if(o.ja){
			var v = this.jamap[o.ja];
			if(!v){
				this.jamap[o.ja] = o.en;
			}else if(typeof(v) == 'string' && v != o.en){
				// 1件の日本語に複数の英訳がある場合、とりあえず全部格納する
				// ただし、使うのは1つめだけ (@see getByJa)
				this.jamap[o.ja] = [];
				this.jamap[o.ja].push(v);
				this.jamap[o.ja].push(o.en);
			}else if(v.length){
				if(v.indexOf(o.en) < 0){
					this.jamap[o.ja].push(o.en);
				}
			}
		}
	}
};

masterTable.prototype.getById = function(id){
	return this.idmap[id];
};

masterTable.prototype.getByJa = function(ja){
	var v = this.jamap[ja];
	if(Array.isArray(v)){ // 複数の英訳がある
		return (v.length ? v[0] : ''); // 1つめを返す
	}
	return (v || '');
};

module.exports = new masterTable();
