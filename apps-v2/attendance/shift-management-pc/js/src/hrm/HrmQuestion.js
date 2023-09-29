teasp.provide('teasp.hrm.HrmQuestion');

/**
 * 諸届ナビ質問
 * TemNaviQuestion__c オブジェクト１レコードに相当
 *
 * @constructor
 * @param {teasp.hrm.HrmNavi} navi
 * @param {Object} obj
 */
teasp.hrm.HrmQuestion = function(navi, obj){
	this.navi = navi;
	this.obj = obj;
	this.selects = []; // 質問選択肢
	this.selected = null; // 回答用
	var selects = obj.selects || [];
	for(var i = 0 ; i < selects.length ; i++){
		this.selects.push(new teasp.hrm.HrmQuestionSelect(this.navi, selects[i]));
	}
	this.languageKey =
		teasp.message.getLanguageLocaleKey() === 'ja'
		|| teasp.message.getLanguageLocaleKey() === 'ja_JP'
			? 'ja_JP' : 'en_US';
};

teasp.hrm.HrmQuestion.prototype.getId      = function(){ return this.obj.id; };
teasp.hrm.HrmQuestion.prototype.getName    = function(){
	return (this.obj.name && this.obj.name[this.languageKey]) || this.obj.name['ja_JP'];
};
teasp.hrm.HrmQuestion.prototype.getRemarks = function(){ return ((this.obj.remarks && this.obj.remarks[this.languageKey]) || this.obj.remarks['ja_JP']) || ''; };
teasp.hrm.HrmQuestion.prototype.getSelects = function(){ return this.selects; };

/**
 * 回答をセット
 * @param {string} selectId
 */
teasp.hrm.HrmQuestion.prototype.setSelect = function(selectId){
	this.selected = null;
	for(var i = 0 ; i < this.selects.length ; i++){
		var select = this.selects[i];
		if(select.getId() == selectId){
			this.selected = select;
		}
	}
};

/**
 * 次の質問
 * @returns {teasp.hrm.HrmQuestion|null}
 */
teasp.hrm.HrmQuestion.prototype.getNextQuestion = function(){
	if(this.selected){
		return this.selected.getNextQuestion();
	}
	return null;
};

/**
 * 質問の回答の文字列を返す
 * @returns {string}
 */
teasp.hrm.HrmQuestion.prototype.getAnswer = function(){
	if(this.selected){
		return this.selected.getName();
	}
	return null;
};
