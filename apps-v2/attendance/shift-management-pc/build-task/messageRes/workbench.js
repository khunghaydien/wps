// メッセージリソース生成モジュール
// 下記のファイルの作成を目的とする
// translations/ts_en_US.stf
var fs = require('fs');

function Workbench(){
};

Workbench.prototype.init = function(obj){
	this.stf = (obj || {}).stf || {};
};

Workbench.prototype.output = function(master){
	var templts  = fs.readFileSync(this.stf.template, 'utf-8').split(/\r?\n/); // テンプレート
	var ignores  = fs.readFileSync(this.stf.ignore  , 'utf-8').split(/\r?\n/); // 無視リスト
	var srcLines = fs.readFileSync(this.stf.src     , 'utf-8').split(/\r?\n/); // ソース_ja.stf
	var mp = {};
	var don = [];
	var not = [];
	for(var i = 0 ; i < srcLines.length ; i++){
		var pts = srcLines[i].split(/\t/); // タブ区切り行を読み込み
		if(pts.length <= 1 || pts[0].startsWith('#') || ignores.indexOf(pts[0]) >= 0){
			// コメント、タブ区切りでない行、無視リストに含まれるものはスキップ
			continue;
		}
		var s = pts[0];
		if(mp[s]){
			mp[s] = 2; // 重複行（普通はない..？）
			continue;
		}
		mp[s] = 1;
		if(pts.length == 4){ // 翻訳済みである
			don.push(pts);
			continue;
		}
		if(pts.length == 2){
			var en = master.getByJa(pts[1]) || master.getById(pts[1]) || null; // 日本語（またはID）から英訳を取得
			if(en){
				if(en.length <= 40){ // 40文字を超えるものはインポートできないのでスキップする
					pts[2] = en;
					pts[3] = '-';
				}
			}
		}
		if(pts.length == 4){
			don.push(pts.join('\t')); // 翻訳したもの
		}else{
			not.push(pts.join('\t')); // 未翻訳のもの
		}
	}
	// テンプレートから翻訳ファイルを作成
	var buf = '';
	for(var i = 0 ; i < templts.length ; i++){
		var s = templts[i];
		if(s == '####ja####'){
			buf += don.join('\n');
		}else if(s == '####en####'){
			buf += not.join('\n');
		}else{
			buf += s;
		}
		buf += '\n';
	}
	fs.writeFileSync(this.stf.dst, buf);
	console.log('出力:' + this.stf.dst);
};

module.exports = new Workbench();
