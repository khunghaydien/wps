teasp.provide('teasp.dialog.RequestHRMList');
/**
 * TSHRM用社員情報変更申請一覧ダイアログ
 *
 * @constructor
 * @extends {teasp.dialog.Base}
 */
teasp.dialog.RequestHRMList = function(){
	this.widthHint = 588;
	this.heightHint = 334;
	this.id = 'dialogRequestHRMList';
	this.title = teasp.message.getLabel('applyList_btn_title'); // 申請一覧
	this.duration = 1;
	this.content = '<table id="requestList_DialogRequestListTable" class="dialogApplyTable" border="0" cellspacing="0" cellpadding="0" style="padding:0px 10px;">' +
				'<tr>' +
				'<td id="RequestList_Title">' +
				'</td>' +
				'</tr>' +
				'<tr>' +
				'<td>' +
				'<div>' +
				'<table style="width:548px; border-collapse: collapse;">' +
				'<tbody id="RequestListTable_Header">' +
				'</tbody>' +
				'</table>' +
				'</div>' +
				'<div style="width:548px;overflow-y:scroll;height:280px;">' +
				'<table style="width:100%; border-collapse: collapse;">' +
				'<tbody id="RequestListTable_Body">' +
				'</tbody>' +
				'</table>' +
				'</div>' +
				'</td>' +
				'</tr>' +
				'</table>';
	this.readOnlyCnt = 0;
	this.contentSeq = 0;
	this.client = null;
	this.eventHandles = [];
	this.applyHandle = {};
	this.requests = [];

	this.colList = [
		{ width: 320, label: teasp.message.getLabel('em10001110')     , type: "text"    , align: "left"  , field: "name"          }, // 申請内容
		{ width: 130, label: teasp.message.getLabel('applyDate_label'), type: "dateTime", align: "center", field: "applyDatetime" }, // 申請日
		{ width:  80, label: teasp.message.getLabel('statusj_head')   , type: "text"    , align: "center", field: "status"        } // 状況
	];
};

teasp.dialog.RequestHRMList.prototype = new teasp.dialog.Base();

/**
 * @override
 */
teasp.dialog.RequestHRMList.prototype.preInit = function(){
	require(["dijit/layout/TabContainer", "dijit/layout/ContentPane", "dijit/Tooltip"]);
};

/**
 * @override
 */
teasp.dialog.RequestHRMList.prototype.ready = function(){
	this.client	   = this.args.client;
};

/**
 * 画面生成
 *
 * @override
 */
teasp.dialog.RequestHRMList.prototype.preStart = function(){
	dojo.query('.dijitDialogPaneContent', this.dialog.domNode).forEach( function( elem ) {
		dojo.style( elem, "background", "#F0F0E1" );
	} );
	var td = dojo.byId( "RequestList_Title" );
	var tbody = dojo.create( "tbody", null, dojo.create( "table", { style : "margin-left:auto;margin-right:0px;" }, td ) );
	var tr = dojo.create( "tr", null, tbody );

	var td = dojo.create( "td", { style : "text-align: right;" }, tr );
	div = dojo.create( 'div', null, dojo.create( 'button', { className: 'std-button1 gry-button1', style: { width: "100%", margin: "4px", marginLeft: "auto" } }, td ) );
	div.innerHTML = teasp.message.getLabel('close_btn_title'); // 閉じる
	dojo.connect( td.firstChild, "onclick", this, this.close );

	// ヘッダ設定
	tr = dojo.create("tr", null, dojo.byId( "RequestListTable_Header" ));
	for(var i = 0 ; i < this.colList.length ; i++) {
		var colObj = this.colList[i];
		dojo.create("th", {
			className: (this.colList.length == (i + 1) ? 'last' : (!i ? 'first' : '')),
			innerHTML: colObj.label || '',
			style    : 'width:' + (colObj.width + (this.colList.length == (i + 1) ? 16 : 0)) + 'px'
		}, tr);
	}
};

/**
 *
 * @override
 */
teasp.dialog.RequestHRMList.prototype.postShow = function(){
	// 一覧の内容をクリア
	var tbody = dojo.byId( 'RequestListTable_Body' );
	dojo.empty(tbody);

	// 前回のイベントハンドルをクリア
	for(var i = 0 ; i < this.eventHandles.length ; i++){
		dojo.disconnect(this.eventHandles[i]);
		delete this.eventHandles[i];
	}
	this.eventHandles = [];

	this.getRequestList();
};

/**
 *
 * 申請一覧を取得取得
 */
teasp.dialog.RequestHRMList.prototype.getRequestList = function() {
	teasp.manager.request(
		'getHRMRequestList',
		[],
		this.pouch,
		{ hideBusy : false },
		this,
		function(lst) {
			this.createRequestList(lst);
		},
		function(event){
			teasp.message.alertError(event);
		}
	);
};

/**
 *
 * 申請一覧表示
 */
teasp.dialog.RequestHRMList.prototype.createRequestList = function(lst) {
	this.requests = lst;
	var tbody = dojo.byId( 'RequestListTable_Body' );
	for ( var i = 0 ; i < 10 || i < this.requests.length ; i++ ) {
		var tr = dojo.create( "tr", { className : i % 2 == 1 ? "odd" : "even" }, tbody );
		for (var j = 0 ; j < this.colList.length ; j++ ) {
			var colObj = this.colList[j];
			var className = "";
			if ( j == 0 ) className = "first";
			if ( this.colList.length == j + 1 ) className = "last";
			if ( this.requests.length == i + 1 ) className += " lastRow";
			var td = dojo.create( "td", { className : className, style : "text-align: " + colObj.align }, tr );
			dojo.style( td, "width", colObj.width + "px" );
			if(colObj.type == 'action'){
				continue;
			}
			var requestObj = (i < this.requests.length ? this.requests[i] : null);
			if (requestObj && requestObj[colObj.field]) {
				switch( colObj.field ) {
				case "name":
					var div = dojo.create( "div", null, td );
					var aObj = dojo.create( "a", null, div );
					aObj.innerHTML = requestObj["name"];
					aObj.href = "javascript: void( 0 );";
					this.eventHandles.push(dojo.connect( aObj, "onclick", this, this.openRequestEdit( requestObj["id"], requestObj["isHRMversion1"] ) ));
					break;
				case "applyDatetime":
					var v = requestObj[colObj.field];
					td.innerHTML = (v ? teasp.util.date.formatDateTime(v, 'SLA-HM') : '');
					break;
				case "status":
					td.innerHTML = teasp.constant.getDisplayStatus(requestObj[colObj.field]);
					break;
				default:
					td.innerHTML = requestObj[colObj.field];
					break;
				}
			} else if (colObj.field == 'name') {
				dojo.create("div", { innerHTML:'&nbsp;' }, td); // 空行でも１文字分の高さになるようにする
			}
		}
	}
};

/**
 *
 * 申請編集画面表示
 */
teasp.dialog.RequestHRMList.prototype.openRequestEdit = function( requestId, isHRMversion1 ) {
	return function() {
		var req = {
			client   : teasp.constant.APPLY_CLIENT_CHANGE_HRM_EMP
			 ,requestId : requestId
			 ,isHRMversion1: isHRMversion1 // HRM Version1と接続時に作成された諸届かどうか
		};
		dojo.hitch(this, function(e){
			// 条件によって使用されるダイアログを分岐する
			if(e){
				e.preventDefault();
				e.stopPropagation();
			}
			// HRM Version1と接続時に作成された諸届を閲覧する場合はEM用のダイアログ
			if(isHRMversion1) {
				dojo.hitch(this, function(){
					teasp.manager.dialogOpen(
						'ChangeEmp',
						req,
						this.pouch,
						this,
						function(){
							this.postShow();
						}
					);
				})();
			} else{
			// HRM Version1.2 以降と接続時に作成された諸届を閲覧する場合はHRM用のダイアログ
				dojo.hitch(this, function(){
					teasp.manager.dialogOpen(
						'ChangeHRMEmp',
						req,
						this.pouch,
						this,
						function(){
							this.postShow();
						}
					);
				})();
			}
		})();
	};
};