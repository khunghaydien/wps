teasp.provide('teasp.dialog.Note');
/**
 * 経費申請コメント入力ダイアログ
 *
 * @constructor
 * @extends {teasp.dialog.Base}
 */
teasp.dialog.Note = function(){
	this.widthHint = 410;
	this.heightHint = 225;
	this.id = 'dialogNote';
	this.title = teasp.message.getLabel('note_caption'); // 備考
	this.duration = 1;
	this.content = '<table class="pane_table" id="dialogNoteArea" style="width:390px;"><tr><td style="padding-bottom:4px;"><table border="0" cellpadding="0" cellspacing="0"><tr><td style="padding-left:4px;white-space:nowrap;"><span id="dialogNoteDate"></span></td><td style="padding-left:4px;"><span id="dialogNoteEvent" style="word-break:break-all;"></span></td></tr></table></td></tr><tr><td style="vertical-align:top;text-align:left;font-size:0.85em;padding:1px 4px;" id="dialogNoteRevise"></td></tr><tr><td style="vertical-align:top;text-align:center;"><textarea id="dialogNoteText1" disabled=true style="width:97%;height:60px;margin-bottom:6px;background-color:#EBEBE4;" class="inputarea"></textarea></td></tr><tr><td style="vertical-align:top;text-align:center;"><textarea id="dialogNoteText2" style="width:97%;height:80px;" class="inputarea" maxLength="255"></textarea></td></tr><tr id="dialogNoteCtrl1" class="ts-buttons-row"><td style="text-align:center;padding-top:10px;"><div><button class="std-button1" id="dialogNoteOk" ><div></div></button><button class="std-button2" id="dialogNoteCancel" ><div></div></button></div></td></tr><tr id="dialogNoteCtrl2" class="ts-buttons-row"><td style="text-align:center;padding-top:10px;"><div><button class="std-button2" id="dialogNoteClose" ><div></div></button></div></td></tr></table>';
	this.okLink = {
		id       : 'dialogNoteOk',
		callback : this.ok
	};
	this.cancelLink = {
		id       : 'dialogNoteCancel',
		callback : this.hide
	};
	this.closeLink = {
		id       : 'dialogNoteClose',
		callback : this.hide
	};
	this.eventHandles = [];
};

teasp.dialog.Note.prototype = new teasp.dialog.Base();

/**
 *
 * @override
 */
teasp.dialog.Note.prototype.ready = function(){
	this.dayWrap = this.pouch.getEmpDay(this.args.date);
};

/**
 * 画面生成
 *
 * @override
 */
teasp.dialog.Note.prototype.preShow = function(){
	// 前回のイベントハンドルをクリアする
	for(var i = 0 ; i < this.eventHandles.length ; i++){
		dojo.disconnect(this.eventHandles[i]);
		delete this.eventHandles[i];
	}
	this.eventHandles = [];

	dojo.style('dialogNoteCtrl1', 'display', (this.isReadOnly() ? 'none' : ''));
	dojo.style('dialogNoteCtrl2', 'display', (this.isReadOnly() ? '' : 'none'));

	dojo.byId('dialogNoteDate' ).innerHTML = teasp.util.date.formatDate(this.args.date, 'JP1');
	dojo.byId('dialogNoteEvent').innerHTML = this.dayWrap.getCalendarEvent();
	dojo.byId('dialogNoteText2' ).value     = this.dayWrap.getDayNote(true);

	var s = this.dayWrap.getTimeCaution();
	dojo.byId('dialogNoteRevise').innerHTML = s;
	dojo.style('dialogNoteRevise', 'background-color', (s.length > 0 ? '#FFFFD6' : '#FFFFFF'));

	var applyNotes = this.dayWrap.getApplyNotes();
	if(applyNotes && this.pouch.isSeparateDailyNote()){
		dojo.byId('dialogNoteText1' ).value = this.dayWrap.getApplyNotes();
		dojo.style('dialogNoteText1', 'display', '');
	}else{
		dojo.style('dialogNoteText1', 'display', 'none');
	}
	dojo.byId('dialogNoteOk'    ).firstChild.innerHTML = teasp.message.getLabel('save_btn_title');
	dojo.byId('dialogNoteCancel').firstChild.innerHTML = teasp.message.getLabel('cancel_btn_title');
	dojo.byId('dialogNoteClose' ).firstChild.innerHTML = teasp.message.getLabel('close_btn_title');

	dojo.byId('dialogNoteText2').readOnly = (this.isReadOnly() ? 'readOnly' : '');
	dojo.toggleClass(dojo.byId('dialogNoteText2'), 'inputab', !this.isReadOnly());
	dojo.toggleClass(dojo.byId('dialogNoteText2'), 'inputro',  this.isReadOnly());

	if(teasp.isNarrow()){
		dojo.style('dialogNoteArea', 'width', '100%');
		dojo.query('textarea', dojo.byId('dialogNoteArea')).forEach(function(el){
			dojo.style(el, 'height', '120px');
		});
	}
	return true;
};

/**
 * 登録
 *
 * @override
 */
teasp.dialog.Note.prototype.ok = function(){
	teasp.manager.request(
		'saveEmpNoteByDay',
		{
			empId            : this.pouch.getEmpId(),
			month            : this.pouch.getYearMonth(),
			startDate        : this.pouch.getStartDate(),
			lastModifiedDate : this.pouch.getLastModifiedDate(),
			date             : this.args.date,
			note             : dojo.byId('dialogNoteText2').value.trim()
		},
		this.pouch,
		{},
		this,
		function(){
			this.onfinishfunc();
			this.close();
		},
		function(event){
			teasp.message.alertError(event);
		}
	);
};

/**
 * 参照モードか
 *
 * @return {boolean} true:参照モード
 */
teasp.dialog.Note.prototype.isReadOnly = function(){
	return (this.pouch.isEmpMonthReadOnly() || this.dayWrap.isDailyFix());
};
