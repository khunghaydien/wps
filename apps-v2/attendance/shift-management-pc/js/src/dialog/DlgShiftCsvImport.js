teasp.provide('teasp.dialog.ShiftCsvImport');
/**
 * シフトCSVインポートダイアログ
 * ※注 このクラスは teasp.dialog.Base を継承しない（同フォルダの他のダイアログと作法が異なる）
 */
teasp.dialog.ShiftCsvImport = function(){
	this.DISP_INIT = 0;
	this.DISP_ING = 1;
	this.DISP_END = 2;
	this.DISP_ERROR_RETRY = 3;
	this.DISP_ERROR_END   = 4;
	this.ERROR_PH = 'エラー: ${0}';
	this.ERROR_STOP = 'インポートを中止しました。<br/>'
		+ 'アップロードしたファイルにエラーがあります。<br/>'
		+ 'エラーの詳細は下記リンクからダウンロードしてご覧ください。';
	this.id = 'shiftCsvImportDialog';
	this.contents = null;
	this.downloadHandle = null;
	dojo.byId(this.id + '_title').innerHTML = 'CSVインポート';
	dojo.attr('shiftImportStart', 'disabled', true); // [インポート開始]ボタンを非活性にする

	dojo.connect(dojo.byId('shiftImportStart') , 'click', this, this.importStart); // インポート開始
	dojo.connect(dojo.byId('shiftImportCancel'), 'click', this, this.hide); // キャンセル
	dojo.connect(dojo.byId('shiftImportClose') , 'click', this, this.hide); // 閉じる
	dojo.connect(dojo.byId('shiftImportResult'), 'click', this, this.showImportResult); // インポート結果を表示する
	dojo.connect(dojo.byId('shiftImportChangeRange') , 'click', this, this.changedRangeType); // 月度・期間変更
	dojo.connect(dojo.byId('shiftCsvUpload'), 'change', this, this.upload); // アップロード
	dojo.connect(dijit.byId('impYear')		, 'onChange', this, this.changeYearMonth); // 年
	dojo.connect(dijit.byId('impMonth') 	, 'onChange', this, this.changeYearMonth); // 月
	dojo.connect(dijit.byId('impStartYear') , 'onChange', this, this.changeRange); // 開始年
	dojo.connect(dijit.byId('impStartMonth'), 'onChange', this, this.changeRange); // 開始月
	dojo.connect(dijit.byId('impStartDate') , 'onChange', this, this.changeRange); // 開始日
	dojo.connect(dijit.byId('impEndYear')	, 'onChange', this, this.changeRange); // 終了年
	dojo.connect(dijit.byId('impEndMonth')	, 'onChange', this, this.changeRange); // 終了月
	dojo.connect(dijit.byId('impEndDate')	, 'onChange', this, this.changeRange); // 終了日

	new dijit.Tooltip({
		connectId: 'shiftFileHelp',
		position: ['below'],
		label: '<div class="shift-file-help">'
			+ '<div>下記の条件を満たすファイルを指定してください。</div>'
			+ '<div>* 文字コード = UTF-8</div>'
			+ '<div>* 日付が指定月度（または期間）の範囲内である。</div>'
			+ '<div>* 対象社員数が200人以内である。</div>'
			+ '</div>'
	});
};

/**
 * ダイアログを開く
 * @param {Object} emp 社員情報
 * @param {Object} range メイン画面から引き継いだ期間指定の値
 */
teasp.dialog.ShiftCsvImport.prototype.open = function(emp, range, callback){
	this.emp = emp;
	this.callback = callback;
	this.showError();
	this.displayByStatus(this.DISP_INIT);
	this.contents = null;

	var d = new Date();
	var m = range._month;
	var my = m ? Math.floor(m / 100) : d.getFullYear();
	var mm = m ? (m % 100) : d.getMonth() + 1;
	var sm = null, em = null;
	var od = this.convertYearMonth2Range(my * 100 + mm);
	if(range.startDate || od){
		sm = moment(range.startDate || od.startDate, 'YYYY-MM-DD');
	}else{
		sm = moment([my, mm - 1, 1]);
	}
	if(range.endDate || od){
		em = moment(range.endDate || od.endDate, 'YYYY-MM-DD');
	}else{
		em = moment([my, mm - 1, 1]).add(1, 'M').add(-1, 'd');
	}
	// 月度の初期値セット
	dijit.byId('impYear' ).setValue(my);
	dijit.byId('impMonth').setValue(mm);
	// 期間の初期値セット
	dijit.byId('impStartYear' ).setValue(sm.year());
	dijit.byId('impStartMonth').setValue(sm.month() + 1);
	dijit.byId('impStartDate' ).setValue(sm.date());
	dijit.byId('impEndYear'   ).setValue(em.year());
	dijit.byId('impEndMonth'  ).setValue(em.month() + 1);
	dijit.byId('impEndDate'   ).setValue(em.date());

	this.displayRangeOfYearMonth(od);
	this.displayRangeType(range.rangeType);

	dijit.byId(this.id).show();
};

// ダイアログを閉じる
teasp.dialog.ShiftCsvImport.prototype.hide = function(){
	dijit.byId(this.id).hide();
};

// エラー表示
teasp.dialog.ShiftCsvImport.prototype.showError = function(msg){
	dojo.byId('shiftImportError').innerHTML = (msg || '');
};

// 年月から日付の期間を返す
teasp.dialog.ShiftCsvImport.prototype.convertYearMonth2Range = function(ym){
	return (this.emp ? teasp.util.searchYearMonthDate(
		this.emp.EmpTypeId__r.ConfigBaseId__r.InitialDateOfMonth__c,
		this.emp.EmpTypeId__r.ConfigBaseId__r.MarkOfMonth__c,
		ym) : null);
};

// 日付の期間を表示
teasp.dialog.ShiftCsvImport.prototype.displayRangeOfYearMonth = function(od){
	dojo.byId('impYearMonth').innerHTML = od ?
		dojo.string.substitute('（${0} ～ ${1}）',[
			moment(od.startDate, 'YYYY-MM-DD').format('YYYY/MM/DD'),
			moment(od.endDate  , 'YYYY-MM-DD').format('YYYY/MM/DD')
		]) : '';
};

// 月度<->期間変更
teasp.dialog.ShiftCsvImport.prototype.displayRangeType = function(rangeType){
	dojo.style('shiftImportRange1', 'display', (rangeType == 0 ? '' : 'none'));
	dojo.style('shiftImportRange2', 'display', (rangeType == 0 ? 'none' : ''));
	dojo.byId('shiftImportChangeRange').value = (rangeType == 0 ? '期間で指定する' : '月度で指定する');
};

/**
 * 月度指定か期間指定かを返す
 * @returns 0:月度指定	1:期間指定
 */
teasp.dialog.ShiftCsvImport.prototype.getRangeType = function(){
	return (dojo.style('shiftImportRange1', 'display') != 'none' ? 0 : 1);
};

// 月度(期間)の値を得る
teasp.dialog.ShiftCsvImport.prototype.getRangeValue = function(){
	var range = {
		rangeType: this.getRangeType()
	};
	if(!range.rangeType){
		if(!dijit.byId('impYear' ).isValid()
		|| !dijit.byId('impMonth').isValid()
		){
			return null;
		}
		var y = dijit.byId('impYear' ).getValue();
		var m = dijit.byId('impMonth').getValue();
		range.month = y * 100 + m;
		var tmp = this.convertYearMonth2Range(range.month);
		range.startDate = tmp.startDate;
		range.endDate   = tmp.endDate;
	}else{
		if(!dijit.byId('impStartYear' ).isValid()
		|| !dijit.byId('impStartMonth').isValid()
		|| !dijit.byId('impStartDate' ).isValid()
		|| !dijit.byId('impEndYear'   ).isValid()
		|| !dijit.byId('impEndMonth'  ).isValid()
		|| !dijit.byId('impEndDate'   ).isValid()
		){
			return null;
		}
		var sy = dijit.byId('impStartYear' ).getValue();
		var sm = dijit.byId('impStartMonth').getValue();
		var sd = dijit.byId('impStartDate' ).getValue();
		var ey = dijit.byId('impEndYear'   ).getValue();
		var em = dijit.byId('impEndMonth'  ).getValue();
		var ed = dijit.byId('impEndDate'   ).getValue();
		var smt = moment([sy, sm - 1, sd]);
		var emt = moment([ey, em - 1, ed]);
		range.month = null;
		range.startDate = smt.format('YYYY-MM-DD');
		range.endDate   = emt.format('YYYY-MM-DD');
	}
	return range;
};

// 月度<->期間変更
teasp.dialog.ShiftCsvImport.prototype.changedRangeType = function(){
	var rangeType = this.getRangeType();
	if(!rangeType && !this.reflectMonthToRange()){
		return;
	}
	this.displayRangeType(rangeType ? 0 : 1);
	if(this.contents){
		dojo.attr('shiftImportStart', 'disabled', false);
	}
};

// 月度変更時の処理
teasp.dialog.ShiftCsvImport.prototype.changeYearMonth = function(){
	var rg = this.reflectMonthToRange();
	if(!rg){
		return;
	}
	this.displayRangeOfYearMonth(rg);
	if(this.contents){
		dojo.attr('shiftImportStart', 'disabled', false);
	}
};

// 月度の値を期間のUIに反映させる
teasp.dialog.ShiftCsvImport.prototype.reflectMonthToRange = function(){
	if(!dijit.byId('impYear' ).isValid()
	|| !dijit.byId('impMonth').isValid()
	){
		return null;
	}
	var ym = parseInt(dojo.byId('impYear' ).value, 10) * 100
		   + parseInt(dojo.byId('impMonth').value, 10);
	var rg = this.convertYearMonth2Range(ym);
	var sm = moment(rg.startDate, 'YYYY-MM-DD');
	var em = moment(rg.endDate  , 'YYYY-MM-DD');
	dijit.byId('impStartYear' ).setValue(sm.year());
	dijit.byId('impStartMonth').setValue(sm.month() + 1);
	dijit.byId('impStartDate' ).setValue(sm.date());
	dijit.byId('impEndYear'   ).setValue(em.year());
	dijit.byId('impEndMonth'  ).setValue(em.month() + 1);
	dijit.byId('impEndDate'   ).setValue(em.date());
	return rg;
};

// 期間変更時の処理
teasp.dialog.ShiftCsvImport.prototype.changeRange = function(){
	if(this.contents){
		dojo.attr('shiftImportStart', 'disabled', false);
	}
};

// UI活性/非活性
teasp.dialog.ShiftCsvImport.prototype.displayByStatus = function(stat){
	switch(stat){
	case this.DISP_INIT: // 初期表示
		dojo.byId('shiftCsvUpload').value = ''; 			 // アップロードクリア
		dojo.byId('shiftFileName').innerHTML = '';			 // ファイル名クリア
		dojo.attr('shiftImportStart', 'disabled', true);	 // [インポート開始]非活性
		dojo.style('shiftImportCommand', 'display', '');	 // [インポート開始][キャンセル]表示
		dojo.style('shiftImportEnd'    , 'display', 'none'); // [閉じる]非表示
		dojo.query('.shift-upload-area', dojo.byId(this.id)).forEach(function(el){ // アップロードエリア非表示
			dojo.style(el, 'display', '');
		});
		dojo.query('.shift-importing,.shift-import-end,.shift-import-error', dojo.byId(this.id)).forEach(function(el){ // 処理中,終了,エラーエリア非表示
			dojo.style(el, 'display', 'none');
		});
		this.busy(false); // UI活性
		break;
	case this.DISP_ING: // インポート中の表示
		this.busy(true); // UI非活性
		dojo.attr('shiftImportStart', 'disabled', true); // [インポート開始]非活性
		dojo.query('.shift-upload-area,.shift-import-error', dojo.byId(this.id)).forEach(function(el){ // アップロード、エラーエリア非表示
			dojo.style(el, 'display', 'none');
		});
		dojo.byId('shiftImportingMsg').innerHTML = 'CSVファイルをチェックしています。';
		dojo.query('.shift-importing', dojo.byId(this.id)).forEach(function(el){ // 処理中エリア表示
			dojo.style(el, 'display', '');
		});
		break;
	case this.DISP_END: // インポート完了の表示
		dojo.style('shiftImportCommand', 'display', 'none'); // [インポート開始][キャンセル]非表示
		dojo.style('shiftImportEnd'    , 'display', '');	 // [閉じる]表示
		dojo.query('.shift-importing', dojo.byId(this.id)).forEach(function(el){ // 処理中エリア非表示
			dojo.style(el, 'display', 'none');
		});
		dojo.query('.shift-import-end', dojo.byId(this.id)).forEach(function(el){ // 終了エリア表示
			dojo.style(el, 'display', '');
		});
		break;
	case this.DISP_ERROR_RETRY: // インポートエラー（リトライ可）
		this.busy(false); // UI活性
		dojo.attr('shiftImportStart', 'disabled', true); // [インポート開始]非活性
		dojo.query('.shift-upload-area,.shift-import-error', dojo.byId(this.id)).forEach(function(el){ // アップロード、エラーエリア表示
			dojo.style(el, 'display', '');
		});
		dojo.query('.shift-importing', dojo.byId(this.id)).forEach(function(el){ // 処理中エリア非表示
			dojo.style(el, 'display', 'none');
		});
		break;
	case this.DISP_ERROR_END: // インポートエラー（リトライ不可）
		dojo.style('shiftImportCommand', 'display', 'none'); // [インポート開始][キャンセル]非表示
		dojo.style('shiftImportEnd'    , 'display', ''); // [閉じる]表示
		dojo.query('.shift-importing', dojo.byId(this.id)).forEach(function(el){ // 処理中エリア非表示
			dojo.style(el, 'display', 'none');
		});
		dojo.query('.shift-import-error', dojo.byId(this.id)).forEach(function(el){ // エラーエリア表示
			dojo.style(el, 'display', '');
		});
		break;
	}
};

teasp.dialog.ShiftCsvImport.prototype.busy = function(flag){
	dojo.attr('shiftImportCancel'	  , 'disabled', flag); // [キャンセル]
	dojo.attr('shiftCsvUpload'		  , 'disabled', flag); // [ファイル選択]
	dojo.attr('shiftImportChangeRange', 'disabled', flag); // [月度(期間)で指定する]
	// 月度
	dijit.byId('impYear'	  ).set('disabled', flag);
	dijit.byId('impMonth'	  ).set('disabled', flag);
	// 期間
	dijit.byId('impStartYear' ).set('disabled', flag);
	dijit.byId('impStartMonth').set('disabled', flag);
	dijit.byId('impStartDate' ).set('disabled', flag);
	dijit.byId('impEndYear'   ).set('disabled', flag);
	dijit.byId('impEndMonth'  ).set('disabled', flag);
	dijit.byId('impEndDate'   ).set('disabled', flag);
};

// ファイルアップロード
teasp.dialog.ShiftCsvImport.prototype.upload = function(){
	var files = dojo.byId('shiftCsvUpload').files;
	if(!files.length){
		return;
	}
	this.fileName = files[0].name;

	this.clearDownloadLink();

	dojo.byId('shiftFileName').innerHTML = '';
	var x = this.fileName.lastIndexOf('.');
	if(x < 0 || this.fileName.substring(x + 1).toLowerCase() != 'csv'){
		this.contents = null;
		dojo.byId('shiftCsvUpload').value = '';
		this.showError('ファイルの拡張子が csv ではありません。');
		this.displayByStatus(this.DISP_ERROR_RETRY);
		return;
	}
	var reader = new FileReader();
	reader.readAsText(files[0]);
	reader.onload = dojo.hitch(this, function(){
		this.showError();
		dojo.attr('shiftImportStart', 'disabled', false);
		this.contents = reader.result;
	});
};

// ダウンロードリンク
teasp.dialog.ShiftCsvImport.prototype.createDownloadLink = function(errorCsv){
	if(this.downloadHandle){
		dojo.disconnect(this.downloadHandle);
		this.downloadHandle = null;
	}
	var linkDiv = dojo.byId('shiftImportErrorLink');
	dojo.empty(linkDiv);
	if(!errorCsv){
		return;
	}
	if(typeof(Blob) !== "undefined"){
		var bom = new Uint8Array([0xEF, 0xBB, 0xBF]);
		var blob = new Blob([bom, errorCsv], { "type" : "text/csv" });
		if(window.navigator.msSaveBlob){
			var a = dojo.create('a', {
				innerHTML: this.fileName,
				target: '_blank'
			}, linkDiv);
			this.downloadHandle = dojo.connect(a, 'click', this, function(e){
				window.navigator.msSaveBlob(blob, this.fileName);
			});
		}else{
			dojo.create('a', {
				href: (window.URL || window.webkitURL).createObjectURL(blob),
				download: this.fileName,
				innerHTML: this.fileName,
				target: '_blank'
			}, linkDiv);
		}
	}
};

// ダウンロードリンクをクリア
teasp.dialog.ShiftCsvImport.prototype.clearDownloadLink = function(errorCsv){
	if(this.downloadHandle){
		dojo.disconnect(this.downloadHandle);
		this.downloadHandle = null;
	}
	var linkDiv = dojo.byId('shiftImportErrorLink');
	dojo.empty(linkDiv);
};

// インポート開始
teasp.dialog.ShiftCsvImport.prototype.importStart = function(){
	this.showError();
	var range = this.getRangeValue();
	if(!range){
		return;
	}
	var sd = moment(range.startDate);
	var ed = moment(range.endDate);
	if(ed.isBefore(sd)){
		this.showError('期間の設定が正しくありません');
		this.displayByStatus(this.DISP_ERROR_RETRY);
		return;
	}
	if(ed.diff(sd, 'days') >= 32){
		this.showError('期間の日数が最大32日間を超えないように範囲を指定してください');
		this.displayByStatus(this.DISP_ERROR_RETRY);
		return;
	}
	dojo.byId('shiftCsvUpload').value = '';
	dojo.byId('shiftFileName').innerHTML = this.fileName;
	this.range = range;
	this.empIds = [];
	this.displayByStatus(this.DISP_ING);
	var req = dojo.toJson({
		startDate: this.range.startDate,
		endDate:   this.range.endDate,
		csv:	   this.contents
	});
	console.log('csv check start');
	Visualforce.remoting.Manager.invokeAction(tsCONST.API_INIT_SHIFT_CSV, req,
		dojo.hitch(this, function(result, event){
			if(event.status){
				if(result.result == 'NG'){
					this.importError(dojo.string.substitute(this.ERROR_PH, [((result.error && result.error.message) || '')]));
				}else if(!result.isSuccess){
					this.importError(this.ERROR_STOP, result.errorCsv);
				}else{
					this.importLoopStart(result.shift);
				}
			}else{
				this.importError(dojo.string.substitute(this.ERROR_PH, [(event.message || '')]));
			}
		}),
		{ escape : false }
	);
};

// インポート対象を分割してインポート開始
teasp.dialog.ShiftCsvImport.prototype.importLoopStart = function(resultShift){
	dojo.byId('shiftImportingMsg').innerHTML = 'インポート実行中です。';
	this.targets = [];
	var target = {};
	var n = 0;
	var empN = 0;
	Object.keys(resultShift).forEach(function(empId){
		this.empIds.push(empId);
		var obj = resultShift[empId];
		target[empId] = obj;
		empN++;
		n += Object.keys(obj).length;
		if(n > 31*15 || empN > 30){ // 1トランザクションでシフト件数=31*15件、社員数=30件まで
			this.targets.push(target);
			target = {};
			empN = 0;
			n = 0;
		}
	}, this);
	if(Object.keys(target).length){
		this.targets.push(target);
	}
	this.importLoop(0);
};

// インポートエラー
teasp.dialog.ShiftCsvImport.prototype.importError = function(message, errorCsv){
	this.showError(message || '');
	this.createDownloadLink(errorCsv ? errorCsv.join('\n') : null);
	this.displayByStatus(this.DISP_ERROR_RETRY);
};

//インポート完了
teasp.dialog.ShiftCsvImport.prototype.importEnd = function(){
	this.displayByStatus(this.DISP_END);
};

teasp.dialog.ShiftCsvImport.prototype.showImportResult = function(){
	this.callback(this.range, this.empIds);
	this.hide();
};

// インポート実行
teasp.dialog.ShiftCsvImport.prototype.importLoop = function(index){
	if(index >= this.targets.length){
		console.log('update finish');
		this.importEnd();
		return;
	}
	var req = dojo.toJson({
		target: this.targets[index],
		isRealShift: true
	});
	console.log('update shift ' + (index + 1) + '/' + this.targets.length);
	Visualforce.remoting.Manager.invokeAction(tsCONST.API_UPDATE_SHIFT, req,
		dojo.hitch(this, function(result, event){
			if(event.status){
				if(result.result == 'NG'){
					this.importError(dojo.string.substitute(this.ERROR_PH, [((result.error && result.error.message) || '')]));
				}else{
					this.importLoop(++index);
				}
			}else{
				this.importError(dojo.string.substitute(this.ERROR_PH, [(event.message || '')]));
			}
		}),
		{ escape : false }
	);
};
