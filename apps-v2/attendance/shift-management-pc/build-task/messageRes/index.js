var through   = require('through2');
var fs        = require('fs');
var masterTbl = require('./master.js');
var messageJs = require('./messageJs.js');
var i18n_apex = require('./i18n.js');
var translate = require('./translation.js');
var workbench = require('./workbench.js');

// メッセージリソース生成
module.exports = function(options){
	// 生成クラスのインスタンスを初期化
	masterTbl.init(options); // CSVから作成したマップ
	messageJs.init(options); // resource/AtkResource/nls/ja/messages.js, resource/AtkResource/nls/en_US/messages.js
	i18n_apex.init(options); // src/classes/Atki18n.cls
	translate.init(options); // src/translates/en_US.translation
	workbench.init(options); // translation/ts_en_US.stf

	var transform = function(file, enc, callback){
		console.log('読込:' + file.path.substring(file.base.length));
		var srcType = (file.path.endsWith('TSLANG-対訳.json') ? 0 : 1);
		var lst = JSON.parse(file.contents.toString('utf8')); // CSV読み込み、JSONオブジェクト化
		for(var i = 0 ; i < lst.length ; i++){ // 1件ずつ
			var o = lst[i];
			masterTbl.addLine(srcType, o);
			messageJs.addLine(srcType, o);
			i18n_apex.addLine(srcType, o);
		}
		callback();
	};

	var flush = function(callback){
		messageJs.output();
		i18n_apex.output();
		workbench.output(masterTbl);
		translate.output(masterTbl, function(){ callback(null); });
	};

	return through.obj(transform, flush)
}
