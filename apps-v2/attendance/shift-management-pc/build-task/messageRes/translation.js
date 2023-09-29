// メッセージリソース生成モジュール
// 下記のファイルの作成を目的とする
// src/translations/en_US.translation
var fs = require('fs');
var xml2js = require('xml2js');

function Translation(){
};

Translation.prototype.init = function(obj){
	this.src = ((obj || {}).enUs	|| null); // ソースファイル
	this.dst = ((obj || {}).enUsOut || null); // 出力先（基本はソースと同じ）
	if(!this.dst){
		this.dst = this.src;
	}
};

Translation.prototype.output = function(master, callback){
	var parser = new xml2js.Parser();
	var that = this;
	// ソースを読み込み、XML解析をして build に渡す
	fs.readFile(this.src, function(err, data){
		parser.parseString(data, function(err, result){
			that.build(result, master, callback);
		});
	});
};

// 翻訳をセットする（階層構造なので再帰的に呼び出す）
Translation.prototype.conv = function(obj, tgts, master){
	if(Array.isArray(obj)){
		for(var i = 0 ; i < obj.length ; i++){
			this.conv(obj[i], tgts, master);
		}
	}else{
		// name, label 要素がある場合、name に対応した英訳があれば label を更新
		if(obj.name && obj.label){
			var name = obj.name;
			var label = master.getByJa(name) || master.getById(name) || null; // name(日本語またはID)から英訳を取得
			if(label){
				obj.label = label;
			}
		}
		for(var key in obj){
			if(tgts.indexOf(key) >= 0){
				this.conv(obj[key], tgts, master);
			}
		}
	}
};

Translation.prototype.build = function(result, master, callback){
	var obj = result.Translations || {};
	var tgts = [
		'customApplications',
		'customLabels',
		'customTabs',
		'quickActions',
		'reportTypes',
		'sections',
		'columns'
	];
	// 翻訳
	this.conv(obj, tgts, master);
	// XMLに変換してファイルに出力
	var builder = new xml2js.Builder();
	fs.writeFileSync(this.dst, builder.buildObject(result));
	console.log('出力:' + this.dst);
	callback();
}

module.exports = new Translation();
