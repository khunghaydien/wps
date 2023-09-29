/**
 * シフト設定フォーム（通知のみ）生成
 *
 * @param {string} key 申請キー
 * @param {Object} node フォームの親ノード
 * @param {string} contId IDに使用する番号
 * @param {Object=} applyObj 申請データ
 */
teasp.dialog.EmpApply.prototype.createShiftSettingForm = function(key, node, contId, applyObj){
	var tbody = dojo.create('div', null, node);

    // 平日・休日
	var row = dojo.create('div', { className: 'empApply2Div' }, tbody);
    dojo.create('div', {
        className : 'empApply2CL',
        innerHTML : teasp.message.getLabel('dayType_label')
    }, row); // 平日/休日の切替
    dojo.create('div', {
        className : 'empApply2VL',
        innerHTML : this.pouch.getDisplayDayType(applyObj.dayType, teasp.message.getLabel('tm10003890')),
        style     : { margin: "2px" }
    }, row);

    if(applyObj.dayType != '1' && applyObj.dayType != '2'){
        // 勤務パターン
        row = dojo.create('div', { id: 'dlgApplyPatternRow' + contId, className: 'empApply2Div' }, tbody);
        dojo.create('div', {
            className : 'empApply2CL',
            innerHTML : teasp.message.getLabel('patterns_label')
        }, row); // 勤務パターン
        dojo.create('div', {
            className : 'empApply2VL',
            innerHTML : (applyObj.pattern ? applyObj.pattern.name : teasp.message.getLabel('tm10003890')),
            style     : { margin:"2px" }
        }, row);

        // 配置部署
        row = dojo.create('div', { id: 'dlgApplyWorkPlaceRow' + contId, className: 'empApply2Div' }, tbody);
        dojo.create('div', {
            className : 'empApply2CL',
            innerHTML : teasp.message.getLabel('workPlace_label')
        }, row); // 配置部署
        dojo.create('div', {
            className : 'empApply2VL',
            innerHTML : ((!applyObj.workPlace || applyObj.workPlace.Id == this.pouch.getDeptId()) ? teasp.message.getLabel('tm10003860') : applyObj.workPlace.name),
            style     : { margin:"2px" }
        }, row);
    }

    // 時間
    this.createTimeParts(key, tbody, contId, applyObj); // 時間
    if(typeof(applyObj.startTime) != 'number' && typeof(applyObj.endTime) != 'number'){
        dojo.style(dojo.byId('dialogApplyTimeRow' + contId), 'display', 'none');
    }
    // 備考
	this.createNoteParts(key, tbody, contId, applyObj); // 備考

    // 設定日時
    row = dojo.create('div', { id: 'dialogApplyAppTimeRow' + contId, className: 'empApply2Div' }, tbody);
    dojo.create('div', {
        className : 'empApply2CL',
        innerHTML : teasp.message.getLabel('setTime_label')
    }, row);
    dojo.create('div', {
        id        : 'dialogApplyAppTime' + contId,
        innerHTML : teasp.util.date.formatDateTime(applyObj.applyTime, 'SLA-HM'),
        className : 'empApply2VL'
    }, row);
};

