teasp.provide('teasp.hrm.HrmNaviGroup');

/**
 * 諸届ナビグループ
 * TemNaviGroup__c オブジェクト１レコードに相当
 *
 * @constructor
 * @param {teasp.hrm.HrmNaviManager} manager
 * @param {Object} obj
 *
 */
teasp.hrm.HrmNaviGroup = function(manager, obj){
	this.manager = manager;
	this.obj = obj;
	this.events = []; // 質問＆回答リスト
	this.languageKey =
		teasp.message.getLanguageLocaleKey() === 'ja'
		|| teasp.message.getLanguageLocaleKey() === 'ja_JP'
        ? 'ja_JP' : 'en_US';

    if(obj.eventList && obj.eventList.length){
        this.setEvents(obj.eventList);
    }
};

teasp.hrm.HrmNaviGroup.prototype.getId   = function(){ return this.obj.id || null; };
teasp.hrm.HrmNaviGroup.prototype.getName = function(){
    if(this.obj.name && this.obj.name[this.languageKey]){
        return this.obj.name[this.languageKey];
    } else if(this.getId() !== null) {
        return this.obj.name['ja_JP']; // 必須項目である日本語を表示
    } else {
        return teasp.message.getLabel('hr10012020'); // 指定なし
    }
};
teasp.hrm.HrmNaviGroup.prototype.getEvents = function(){ return this.events; };
teasp.hrm.HrmNaviGroup.prototype.setEvents = function(events){ 
    events.forEach(function(eventObj){
        this.events.push( new teasp.hrm.HrmNavi(this, eventObj) );
    }, this);
 };

teasp.hrm.HrmNaviGroup.prototype.getEventById = function (eventId) {
    for (var i = 0; i < this.events.length; i++) {
        var event = this.events[i];
        if (event.getId() == eventId) {
            return event;
        }
    }
    return null;
};