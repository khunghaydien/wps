teasp.provide('teasp.hrm.HrmQuestionSelect');

/**
 * 諸届ナビ質問選択肢
 * TemNaviQuestionSelect__c オブジェクト１レコードに相当
 *
 * @constructor
 * @param {teasp.hrm.HrmNavi} navi
 * @param {Object} obj
 */
teasp.hrm.HrmQuestionSelect = function(navi, obj){
	this.navi = navi;
	this.obj = obj;
	this.nextQuestionId = obj.nextQuestionId;
	this.languageKey =
		teasp.message.getLanguageLocaleKey() === 'ja'
		|| teasp.message.getLanguageLocaleKey() === 'ja_JP'
			? 'ja_JP' : 'en_US';
};

teasp.hrm.HrmQuestionSelect.prototype.getId             = function(){ return this.obj.id; };
teasp.hrm.HrmQuestionSelect.prototype.getName           = function(){
	return (this.obj.name && this.obj.name[this.languageKey]) || this.obj.name['ja_JP'];
};
teasp.hrm.HrmQuestionSelect.prototype.getNextQuestionId = function(){ return this.nextQuestionId || null; };
teasp.hrm.HrmQuestionSelect.prototype.getNextQuestion   = function(){ return this.nextQuestionId ? this.navi.createQuestionById(this.nextQuestionId) : null; };
