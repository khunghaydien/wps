teasp.provide('teasp.hrm.HrmNavi');

/**
 * 諸届ナビイベント
 * TemNavi__c オブジェクト１レコードに相当
 *
 * @constructor
 * @param {Object} obj
 *
 */
teasp.hrm.HrmNavi = function(group, obj){
	this.group = group;
	this.obj = obj;
	this.startQuestion = this.createQuestionById(obj.startQuestionId);
	this.answerList = []; // 質問＆回答リスト
	this.languageKey =
		teasp.message.getLanguageLocaleKey() === 'ja'
		|| teasp.message.getLanguageLocaleKey() === 'ja_JP'
		? 'ja_JP' : 'en_US';
};

teasp.hrm.HrmNavi.prototype.getId              = function(){ return this.obj.id; };
teasp.hrm.HrmNavi.prototype.getName = function () {
	return (this.obj.name && this.obj.name[this.languageKey]) || this.obj.name['ja_JP'];
};
teasp.hrm.HrmNavi.prototype.getStartQuestionId = function(){ return this.obj.startQuestionId || null; };
teasp.hrm.HrmNavi.prototype.getStartQuestion   = function(){ return this.startQuestion || null; };

/**
 * 次の質問を返す
 * @param {teasp.hrm.HrmQuestion|null} question
 * @returns {teasp.hrm.HrmQuestion}
 */
teasp.hrm.HrmNavi.prototype.getNextQuestion = function(question){
	if(!question){
		this.answerList = [];
		return this.getStartQuestion();
	}else{
		this.answerList.push(question);
		return question.getNextQuestion();
	}
};

/**
 * 前の質問に戻る
 * @returns {teasp.hrm.HrmQuestion}
 */
teasp.hrm.HrmNavi.prototype.getPrevQuestion = function(){
	if(this.answerList.length){
		var prevQuestion = this.answerList.pop();
		prevQuestion.setSelect(null);

		return prevQuestion;
	}
	return null;
}

/**
 * 特定の時点の質問に戻る
 * @param {integer} 何問目に戻るか (starts from 1)
 */
teasp.hrm.HrmNavi.prototype.getAnsweredQuestion = function(index){
	if(this.answerList.length >= index){
		var questionToBack = this.answerList.length - index + 1; // 何問戻るか
		var prevQuestion;
		for(var i = 0; i < questionToBack; i++){
			prevQuestion = this.answerList.pop();
			prevQuestion.setSelect(null);
		}

		return prevQuestion;
	}
	return null;
}

/**
 * idから質問を返す
 * @param {string} id
 * @returns {teasp.hrm.HrmQuestion}
 */
teasp.hrm.HrmNavi.prototype.createQuestionById = function(id){
	var q = (id ? this.obj.questions[id] : null);
	return (q ? new teasp.hrm.HrmQuestion(this, q) : null);
};

/**
 * 質問＆回答リストを返す
 * @returns {Array.<teasp.hrm.HrmQuestion>}
 */
teasp.hrm.HrmNavi.prototype.getAnswerList = function(){
	return this.answerList;
};