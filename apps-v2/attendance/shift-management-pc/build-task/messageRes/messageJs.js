// メッセージリソース生成モジュール
// 下記のファイルの作成を目的とする
// resource/AtkResource/nls/ja/messages.js
// resource/AtkResource/nls/en_US/messages.js
var fs = require('fs');

function messageJs(){
};

messageJs.prototype.init = function(obj){
	this.jsja  = ((obj || {}).ja || './messagesJa.js'); // 出力先の日本語用メッセージファイル
	this.jsen  = ((obj || {}).en || './messagesEn.js'); // 出力先の英語用メッセージファイル
	this.jsjas = [];
	this.jsens = [];
};

messageJs.prototype.addLine = function(srcType, o){
	// 日本語、英語それぞれで "{ID}":"{メッセージ}" 行を作成
	if(o.type == 'APP'){
		if(srcType == 0){
			this.jsjas.push('"' + o.id + '":"' + o.ja.replace(/\n/g, '\\n').replace(/"/g, '\\"') + '"');
			this.jsens.push('"' + o.id + '":"' + o.en.replace(/\n/g, '\\n').replace(/"/g, '\\"') + '"');
		}else if(srcType == 1 && o.use == 'J'){
			this.jsjas.push('"' + o.id + '":"' + o.message.replace(/\n/g, '\\n').replace(/"/g, '\\"') + '"');
			this.jsens.push('"' + o.id + '":"' + o.message.replace(/\n/g, '\\n').replace(/"/g, '\\"') + '"');
		}
	}
};

messageJs.prototype.output = function(){
	// 出力先へファイル出力
	fs.writeFileSync(this.jsja, 'var globalMessages={\n' + this.jsjas.join('\n,') + '\n};\n');
	console.log('出力:' + this.jsja);
	fs.writeFileSync(this.jsen, 'var globalMessages={\n' + this.jsens.join('\n,') + '\n};\n');
	console.log('出力:' + this.jsen);
};

module.exports = new messageJs();
