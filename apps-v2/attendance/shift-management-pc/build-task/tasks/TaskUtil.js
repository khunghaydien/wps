const fs = require('fs');

// ファイルからJSの結合順を取得する関数
function getSrcList(path){
	return fs.readFileSync(path, 'utf-8').split(/\r?\n/).filter(p => p);
};

exports.getSrcList = getSrcList