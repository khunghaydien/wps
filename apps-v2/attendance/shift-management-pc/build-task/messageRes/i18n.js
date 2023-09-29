// メッセージリソース生成モジュール
// 下記のファイルの作成を目的とする
// src/classes/AtkI18n.cls
var fs = require('fs');

function i18nMan(){
};

i18nMan.prototype.init = function(obj){
	this.src = ((obj || {}).i18n  || null);  // 読み込み元の AtkI18n.cls
	this.dst = ((obj || {}).i18nOut || null); // 出力先（基本は読み込み元と同じ）
	if(!this.dst){
		this.dst = this.src;
	}
	this.heads = [];
	this.foots = [];
	this.jas = [];
	this.ens = [];
	var lst = fs.readFileSync(this.src, 'utf-8').split(/\r?\n/); // AtkI18n.cls を読みこむ
	var headIn = true;
	var footIn = false;
	var cnt = 0;
	// 下記のブロックを2個探しだし、その前の部分を heads に、後ろを foots に格納しておく
	// private static Map<String,String> getMessages*
	// ・・・・
	// ・・・・
	// };}
	for(var i = 0 ; i < lst.length ; i++){
		var line = lst[i];
		if(line.startsWith('private static Map<String,String> getMessages')){
			headIn = false;
		}else if(!headIn && !footIn && line == '};}'){
			footIn = (cnt++ > 0);
		}else{
			if(headIn){
				this.heads.push(line);
			}
			if(footIn){
				this.foots.push(line);
			}
		}
	}
};

i18nMan.prototype.addLine = function(srcType, o){
	// 日本語、英語それぞれで '{ID}' => '{メッセージ}' 行を作成
	if(o.type == 'APP' && (o.use == 'C' || o.use == 'B')){
		if(srcType == 0){
			this.jas.push("'" + o.id + "'=>'" + o.ja.replace(/\n/g, '\\n').replace(/'/g, "\\'") + "'");
			this.ens.push("'" + o.id + "'=>'" + o.en.replace(/\n/g, '\\n').replace(/'/g, "\\'") + "'");
		}else if(srcType == 1){
			this.jas.push("'" + o.id + "'=>'" + o.message.replace(/\n/g, '\\n').replace(/'/g, "\\'") + "'");
		}
	}
};

i18nMan.prototype.output = function(){
	// heads + {日本語メッセージ} + {英語メッセージ} + foots のテキストを作成してファイルに出力
	var contents = this.heads.join('\n');
	contents += '\nprivate static Map<String,String> getMessagesJa(){return new Map<String,String>{\n';
	contents += this.jas.join('\n,');
	contents += '\n};}';
	contents += '\nprivate static Map<String,String> getMessagesEn(){return new Map<String,String>{\n';
	contents += this.ens.join('\n,');
	contents += '\n};}\n';
	contents += this.foots.join('\n');
	fs.writeFileSync(this.dst, contents);
	console.log('出力:' + this.dst);
};

module.exports = new i18nMan();
