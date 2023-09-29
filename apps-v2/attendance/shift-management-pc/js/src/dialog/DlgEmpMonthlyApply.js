teasp.provide('teasp.dialog.EmpMonthlyApply');
/**
 * 月次勤怠関連申請ダイアログ
 *
 * @constructor
 * @extends {teasp.dialog.Base}
 */
teasp.dialog.EmpMonthlyApply = function(){
	teasp.dialog.EmpApply.call(this);
};

teasp.dialog.EmpMonthlyApply.prototype = new teasp.dialog.EmpApply();

teasp.dialog.EmpMonthlyApply.prototype.initParam = function(){
	this.title = teasp.message.getLabel('mo00000010'); // 月次の勤怠関連申請
	this.dialogManageKey = 'EmpMonthlyApply';
	this.initHeight = 300;
	this.applyMenus = [
		'monthlyOverTime'
	];
	this.applyTypes = {
		'monthlyOverTime' : {
			name  : teasp.constant.APPLY_TYPE_MONTHLYOVERTIME,
			title : teasp.message.getLabel('mo00000001'), // 月次残業申請
			create : this.createMonthlyOverTimeForm,
			descript : teasp.message.getLabel('mo00000005'), // 当月度の見込み残業時間を申請します。
			getMenuFlag : function(){
				if(this.pouch.isShowMonthlyOverTimeApplyButton()){
					return (this.pouch.canSelectMonthlyOverTime() ? 1 : 0);
				}else{
					return -1;
				}
			}
		}
	};
};

/**
 * @override
 */
teasp.dialog.EmpMonthlyApply.prototype.ready = function(){
	this.applyList = this.pouch.getMonthlyOverTimeApplys();
	this.monthFix = this.pouch.isEmpMonthFixed();
};

/**
 * @override
 */
teasp.dialog.EmpMonthlyApply.prototype.postShow = function(){
	this.tc.startup();
};

/**
 * @override
 */
teasp.dialog.EmpMonthlyApply.prototype.isShowApply = function(apply){
	return true;
};

/**
 * 承認者種別を返す
 * @override
 * @param {string} key 申請タイプキー
 * @return {string} '勤怠月次申請'
 */
teasp.dialog.EmpMonthlyApply.prototype.getApproverType = function(key){
	return teasp.constant.APPROVER_TYPE_MONTHLY;
};

/**
 * 【勤怠】取消できるか
 * @override
 * @return {number} 0:不可  1:可（ステータス≠承認済み）  2:可（ステータス＝承認済み）  3:可（ステータス＝確定済み） -1:可（ステータス＝却下）
 */
teasp.dialog.EmpMonthlyApply.prototype.canCancelApply  = function(applyObj){
	if(!teasp.constant.STATUS_APPROVES.contains(applyObj.status)){
		if(teasp.constant.STATUS_REJECTS.contains(applyObj.status)){
			return -1;
		}else{
			return 1;
		}
	}
	if(this.pouch.canCancelDayApply()){
		return (applyObj.status == teasp.constant.STATUS_ADMIT ? 3 : 2);
	}
	return 0;
};

/**
 * 申請オブジェクトから申請種類キーを得る
 * @override
 * @param {Object} applyObj 申請オブジェクト
 * @return {string|null}
 */
teasp.dialog.EmpMonthlyApply.prototype.getApplyKey = function(applyObj){
	for(var key in this.applyTypes){
		if(this.applyTypes.hasOwnProperty(key)
		&& this.applyTypes[key].name == applyObj.applyType){
			return key;
		}
	}
	return null;
};

/**
 * @override
 */
teasp.dialog.EmpMonthlyApply.prototype.isReadOnly = function(){
	return (this.monthFix || this.pouch.isReadOnly());
};

/**
 * リードオンリーの理由を返す
 *
 * @return {number} bit-1:月次確定、bit-2:モード
 */
teasp.dialog.EmpMonthlyApply.prototype.getReadOnlyReason = function(){
	var n = 0;
	if(this.monthFix          ){ n |= 1; }
	if(this.pouch.isReadOnly()){ n |= 2; }
	return n;
};

/**
 * @override
 */
teasp.dialog.EmpMonthlyApply.prototype.isReapplyType = function(key){
	return true;
};

/**
 * 申請タブを作成してフォーカスを移す
 * @override
 * @param {string} id
 * @returns {Function}
 */
teasp.dialog.EmpMonthlyApply.prototype.createNewApply = function(id){
	var key = id.substring(9);
	return function(){
		for(var k in this.newEntry){
			if(this.newEntry.hasOwnProperty(k)){
				this.deleteTabChild(this.tc, dijit.byId(this.newEntry[k]));
				delete this.newEntry[k];
				break;
			}
		}
		var cp = this.createContentPane(key);
		this.newEntry[key] = cp.id;
		this.tc.selectChild(cp);
	};
};

/**
 * 再申請可能か
 * @override
 * @param {Object} applyObj 申請オブジェクト
 * @param {number} -1 or 0:不可  1:可
 */
teasp.dialog.EmpMonthlyApply.prototype.checkReapplyable = function(applyObj){
	var applyType = (applyObj ? applyObj.applyType : '');
	if(applyType == teasp.constant.APPLY_TYPE_MONTHLYOVERTIME){ // 月次残業申請
		return (this.pouch.isUseMonthlyOverTimeApply() ? 1 : 0);
	}
	return 1;
};

/**
 * 申請取消
 * @override
 * @param {string} contId IDに使用する番号
 * @param {Object} applyObj 申請オブジェクト
 */
teasp.dialog.EmpMonthlyApply.prototype.cancelApply = function(contId, applyObj){
	var applyWrap = this.pouch.getEmpApply(applyObj);
	var rejected = applyWrap.isReject();
	var canceled = applyWrap.isCancel();
	var msg = teasp.message.getLabel(((rejected || canceled) ? 'tm10003011' : 'tm10003010'), applyWrap.getDisplayApplyType()) ; // {0}を取り消しますか？
	var req = {
		action           : ((applyWrap.isReject() || applyWrap.isCancel()) ? 'closeApplyEmpDay' : 'cancelApplyEmpDay'),
		empId            : this.pouch.getEmpId(),
		date             : this.args.date,
		month            : this.pouch.getYearMonth(),
		startDate        : this.pouch.getStartDate(),
		lastModifiedDate : this.pouch.getLastModifiedDate(),
		appId            : applyWrap.getId(),
		clearTime        : false,
		client           : null,
		noDelay          : true
	};
	var checkObj = {};
	if(applyWrap.isReject() && !applyWrap.isClose() && !this.pouch.getHandleInvalidApply()){
		checkObj.nohist = { checked: false, title: teasp.message.getLabel('tk10001177') };
	}
	var what = '';
	if(applyWrap.isApprove()){
		what = teasp.message.getLabel('tk10000741'); // 承認取消
	}else if(rejected || canceled){
		what = teasp.message.getLabel('retractApply_label'); // 申請取下
	}else{
		what = teasp.message.getLabel('cancelApply_btn_title'); // 申請取消
	}
	teasp.manager.dialogOpen(
		'MessageBox',
		{
			title   : teasp.message.getLabel('tk10004240', what), // {0}の確認
			message : msg,
			check   : checkObj
		},
		this.pouch,
		this,
		function(obj){
			req.clearTime = false;
			req.remove = ((obj.nohist && obj.nohist.checked) || false);
			teasp.manager.dialogOpen('BusyWait');
			teasp.manager.request(
				'cancelApplyEmpDay',
				req,
				this.pouch,
				{ hideBusy : true },
				this,
				function(){
					this.onfinishfunc();
					this.close();
					teasp.manager.dialogClose('BusyWait');
				},
				function(event){
					teasp.manager.dialogClose('BusyWait');
					teasp.message.alertError(event);
				}
			);
		}
	);
};

/**
 * サーバへ送信
 * @override
 * @param {string} contId IDに使用する番号
 * @param {Object} req 送信内容を持つオブジェクト
 * @param {boolean=} nobusy =true:お待ちくださいダイアログを非表示にする
 *
 * 勤務表から申請ダイアログが呼び出された時、勤怠時刻修正申請で自動承認されるケースを
 * 考慮してクリーンアップ（teasp.view.Monthly.prototype.disposeInit）が呼ばれるようにする。
 */
teasp.dialog.EmpMonthlyApply.prototype.requestSend = function(contId, req, nobusy){
	if(!nobusy){
		teasp.manager.dialogOpen('BusyWait');
	}
	teasp.manager.request(
		'applyEmpDay',
		req,
		this.pouch,
		{ hideBusy : true },
		this,
		function(){
			this.onfinishfunc(true);
			this.close();
			teasp.manager.dialogClose('BusyWait');
		},
		function(event){
			teasp.manager.dialogClose('BusyWait');
			teasp.dialog.EmpApply.showError(contId, teasp.message.getErrorMessage(event));
		},
		function(){
			this.onfinishfunc();
			this.close();
			teasp.manager.dialogClose('BusyWait');
		}
	);
};
/**
 * @override
 * @param {Object} applyObj 
 * @param {string} dt 
 */
teasp.dialog.EmpMonthlyApply.prototype.isNotTheDayApply = function(applyObj, dt){
	return false;
};