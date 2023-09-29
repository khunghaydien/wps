teasp.provide('teasp.dialog.ChangeEmp');
/**
 * 社員情報変更申請ダイアログ
 *
 * @constructor
 * @extends {teasp.dialog.Base}
 */
teasp.dialog.ChangeEmp = function(){
	this.widthHint = 870;
	this.heightHint = 434;
	this.id = 'dialogChangeEmp';
	this.title = teasp.message.getLabel('em10000000'); // 社員情報変更申請
	this.duration = 1;
	this.content = '<table id="requestEdit_DialogChangeEmpTable" class="dialogApplyTable" border="0" cellspacing="0" cellpadding="0"><!--tr><td id="Request_Title"></td></tr--><tr><td><div id="ChangeRequestTable"><table style="width: 100%"><tr><td id="GroupCategory" style="display:none;"><div><select style="min-width:200px;"></select></div></td><td id="ChangeRequestInfo"></td><td style="text-align: right;"><table style="margin-left:auto;margin-right:0px;"><tbody id="Buttons"></tbody></table></td></tr><tr><td colspan="2"><table style="width: 100%;"><tbody><tr><td style="width:210px;height:400px;text-align: left; padding: 0px; vertical-align: top;"><div id="RequestView" style="height: 100%; position: relative; overflow-x: hidden"><div id="RequestEvent" style="width: 100%; position: absolute;"><table style="width: 100%;"><tbody id="RequestEventTable"></tbody></table></div><div id="RequestFlow" style="width: 100%; position: absolute;"><table style="width: 100%; height: 400px;"><tbody id="RequestFlowTable"></tbody></table></div></div></td><td style="text-align: left; padding: 0px 0px 0px 10px;"><div id="ChangeRequest"><table class="requestedit_form" style="width: 100%;"><tbody id="RequestEditForm"></tbody></table></div></td></tr></tbody></table></td></tr></table></div><div id="SubmitRequestTable"><table><tbody id="SubmitRequest"></tbody></table></div></td></tr></table>';
	this.client = null;
	this.eventHandles = {};
	this.applyHandle = {};
	this.editPattern = { CLEAR: 0, NEW: 1, EDIT: 2, APPLYING: 3, APPROVED: 4 };		// 編集パターン（CLEAR:初期,NEW:新規,EDIT:一時保存編集,APPLYING:申請中,APPROVED:承認済み）
	this.loadRequestId = null;
	this.showEvent = null;
	this.showFlow = null;
	this.localAutoId = 1;
	this.requestCache = {};
	this.saveBtnDwnFlg = false;
	this.mskMyNumber = null;

	this.fieldList = {
		SelectTarget : { label : teasp.message.getLabel('em10000820') // 変更対象者
			,fields : [ { name : "SelectTarget__c", label : teasp.message.getLabel('em10000830'), type : "SelectTarget", isRequired: true } // 格納対象者
			]
		}
		,Name : { label : teasp.message.getLabel('empName_label')
			,fields : [ { name : "EmpName_LastName__c"				 , label : teasp.message.getLabel('em10000910')	  , dataType : "String", length : 80, fieldName : "LastName__c" ,isRequired: true}
					   ,{ name : "EmpName_FirstName__c" 			 , label : teasp.message.getLabel('empName_label'), dataType : "String", length : 40, fieldName : "FirstName__c" }
					   ,{ name : "EmpName_Kana_LastName__c" 		 , label : teasp.message.getLabel('em10000920')	  , dataType : "String", length : 80 }
					   ,{ name : "EmpName_Kana_FirstName__c"		 , label : teasp.message.getLabel('em10000260')	  , dataType : "String", length : 40 }
					   ,{ name : "EmpName_Document_LastName__c"		 , label : teasp.message.getLabel('em10000930')	  , dataType : "String", length : 80 }
					   ,{ name : "EmpName_Document_FirstName__c"	 , label : teasp.message.getLabel('em10000270')	  , dataType : "String", length : 40 }
					   ,{ name : "EmpName_Document_Kana_LastName__c" , label : teasp.message.getLabel('em10001910')	  , dataType : "String", length : 80 }
					   ,{ name : "EmpName_Document_Kana_FirstName__c", label : teasp.message.getLabel('em10001920')	  , dataType : "String", length : 40 }
			]
		}
		,Address : { label : teasp.message.getLabel('em10000410')
			,fields : [ { name : "PostalCode__c" , label : teasp.message.getLabel('em10000420'),					dataType : "String", length : 8 }
					   ,{ name : "State__c" 	 , label : teasp.message.getLabel('em10000430'),					dataType : "String", length : 80 }
					   ,{ name : "City__c"		 , label : teasp.message.getLabel('em10000440'),					dataType : "String", length : 80 }
					   ,{ name : "Street__c"	 , label : teasp.message.getLabel('em10000450'), type : "TextArea", dataType : "String", length : 255 }
					   ,{ name : "State_Kana__c" , label : teasp.message.getLabel('em10000460'),					dataType : "String", length : 80 }
					   ,{ name : "City_Kana__c"  , label : teasp.message.getLabel('em10000470'),					dataType : "String", length : 80 }
					   ,{ name : "Street_Kana__c", label : teasp.message.getLabel('em10000480'), type : "TextArea", dataType : "String", length : 255 }
			]
		}
		,ResidentAddress : { label : teasp.message.getLabel('em10000840') // 住民票住所
			,fields : [ { name : "EqualResident__c" 	 , label : teasp.message.getLabel('em10000490'),					dataType : "Boolean" }
					   ,{ name : "PostalCode_Resident__c", label : teasp.message.getLabel('em10000520'),					dataType : "String", length : 8 }
					   ,{ name : "State_Resident__c"	 , label : teasp.message.getLabel('em10000530'),					dataType : "String", length : 80 }
					   ,{ name : "City_Resident__c" 	 , label : teasp.message.getLabel('em10000540'),					dataType : "String", length : 80 }
					   ,{ name : "Street_Resident__c"	 , label : teasp.message.getLabel('em10000550'), type : "TextArea", dataType : "String", length : 255 }
			]
		}
		,Contact : { label : teasp.message.getLabel('em10000850') // 連絡先
			,fields : [ { name : "Phone__c" 		 , label : teasp.message.getLabel('em10000280'), dataType : "String", length : 255 }
					   ,{ name : "ExtentionNumber__c", label : teasp.message.getLabel('em10000290'), dataType : "String", length : 80 }
					   ,{ name : "MobilePhone__c"	 , label : teasp.message.getLabel('em10000300'), dataType : "String", length : 255 }
					   ,{ name : "Email__c" 		 , label : teasp.message.getLabel('em10000310'), dataType : "String", length : 255 }
			]
		}
		,SelfContact : { label : teasp.message.getLabel('em10000860') // 個人用連絡先
			,fields : [ { name : "SelfPhone__c" 	  , label : teasp.message.getLabel('em10000350'), dataType : "String", length : 255 }
					   ,{ name : "SelfMobilePhone__c" , label : teasp.message.getLabel('em10000360'), dataType : "String", length : 255 }
					   ,{ name : "SelfEmail__c" 	  , label : teasp.message.getLabel('em10000370'), dataType : "String", length : 255 }
			]
		}
		,Emergency   : { label : teasp.message.getLabel('em10000380') // 緊急連絡先
			,fields : [{ name : "EmergencyContact__c", label : teasp.message.getLabel('em10000380'), dataType : "String", length : 255 }
			]
		}
		,MyNumber1 : { label : teasp.message.getLabel('em10000400') // 個人番号
			,fields : [ { name : "MyNumberPurposeUse", type : "label"																						}
			]
		}
		,MyNumber : { label : teasp.message.getLabel('em10000400') // 個人番号
			,fields : [ { name : "MyNumber__c", label : teasp.message.getLabel('em10000400'), type : "text" 							  , dataType : "String", length : 12, isRequired: true }
					   ,{ name : "filebody0"  , label : teasp.message.getLabel('em10000870'), type : "myNumberFile" , filedescription : "1", dataType : "File", isRequired: true } // 番号確認用資料
					   ,{ name : "filelabel0" , label : teasp.message.getLabel('tk10000110'), type : "myNumberLabel", filedescription : "1"}
					   ,{ name : "filebody1"  , label : teasp.message.getLabel('em10000880'), type : "myNumberFile" , filedescription : "2", dataType : "File", isRequired: true } // 本人確認用資料
					   ,{ name : "filelabel1" , label : teasp.message.getLabel('tk10000110'), type : "myNumberLabel", filedescription : "2"}
			]
		}
		,Nationality : { label : teasp.message.getLabel('em10000560')
			,fields : [ { name : "Nationality__c"			, label : teasp.message.getLabel('em10000570'), 				   dataType : "String", length : 80 }
					   ,{ name : "ResidencePeriod__c"		, label : teasp.message.getLabel('em10000580'), 				   dataType : "Date"	}
					   ,{ name : "ResidenceStatus__c"		, label : teasp.message.getLabel('em10000590'), 				   dataType : "String", length : 250 }
					   ,{ name : "IsPermissionEngage__c"	, label : teasp.message.getLabel('em10000600'), 				   dataType : "Boolean" }
					   ,{ name : "PermissionEngageDetail__c", label : teasp.message.getLabel('em10000630'), type : "TextArea", dataType : "String", length : 32768 }
			]
		}
		,InsertDependents : { label : teasp.message.getLabel('em10000640')
			,fields : [ { name : "DependentName_LastName__c"	  , label : teasp.message.getLabel('em10000940'),					 dataType : "String", length : 80, fieldName : "LastName__c", isRequired: true }
					   ,{ name : "DependentName_FirstName__c"	  , label : teasp.message.getLabel('em10000650'),					 dataType : "String", length : 40, fieldName : "FirstName__c" }
					   ,{ name : "DependentName_Kana_LastName__c" , label : teasp.message.getLabel('em10000950'),					 dataType : "String", length : 80, fieldName : "Name_Kana_LastName__c" }
					   ,{ name : "DependentName_Kana_FirstName__c", label : teasp.message.getLabel('em10000660'),					 dataType : "String", length : 40, fieldName : "Name_Kana_FirstName__c" }
					   ,{ name : "Relation__c"					  , label : teasp.message.getLabel('em10000670'), type : "Select",	 dataType : "String", isRequired: true }
					   ,{ name : "OtherRelation__c" 			  , label : teasp.message.getLabel('em10000680'),					 dataType : "String", length : 80 }
					   ,{ name : "Gender__c"					  , label : teasp.message.getLabel('em10000330'), type : "Select",	 dataType : "String" }
					   ,{ name : "Birth__c" 					  , label : teasp.message.getLabel('em10000340'),					 dataType : "Date" }
					   ,{ name : "Job__c"						  , label : teasp.message.getLabel('em10000690'),					 dataType : "String", length : 255 }
					   ,{ name : "EqualAddress__c"				  , label : teasp.message.getLabel('em10000700'),					 dataType : "Boolean" }
					   ,{ name : "PostalCode__c"				  , label : teasp.message.getLabel('em10000420'),					 dataType : "String", length : 8 }
					   ,{ name : "State__c" 					  , label : teasp.message.getLabel('em10000430'),					 dataType : "String", length : 80 }
					   ,{ name : "City__c"						  , label : teasp.message.getLabel('em10000440'),					 dataType : "String", length : 80 }
					   ,{ name : "Street__c"					  , label : teasp.message.getLabel('em10000450'), type : "TextArea", dataType : "String", length : 255 }
					   ,{ name : "IsNationalPensionNo3__c"		  , label : teasp.message.getLabel('em10000730'),					 dataType : "Boolean" }
					   ,{ name : "DisabilityGrade__c"			  , label : teasp.message.getLabel('em10000740'), type : "Select",	 dataType : "String" }
					   ,{ name : "HealthInsuranceSubscription__c" , label : teasp.message.getLabel('em10001900'), type : "Select",	 dataType : "String" }
					   ,{ name : "SocialInsuranceDivision__c"	  , label : teasp.message.getLabel('em10000970'), type : "Select",	 dataType : "String" }
			]
		}
		,UpdateDependents : { label : teasp.message.getLabel('em10000640')
			,fields : [ { name : "SelectTarget__c"				  , label : teasp.message.getLabel('em10000900'), type : "SelectDependents", isRequired: true }
					   ,{ name : "DependentName_LastName__c"	  , label : teasp.message.getLabel('em10000940'),					 dataType : "String", length : 80, fieldName : "LastName__c", isRequired: true }
					   ,{ name : "DependentName_FirstName__c"	  , label : teasp.message.getLabel('em10000650'),					 dataType : "String", length : 40, fieldName : "FirstName__c" }
					   ,{ name : "DependentName_Kana_LastName__c" , label : teasp.message.getLabel('em10000950'),					 dataType : "String", length : 80, fieldName : "Name_Kana_LastName__c" }
					   ,{ name : "DependentName_Kana_FirstName__c", label : teasp.message.getLabel('em10000660'),					 dataType : "String", length : 40, fieldName : "Name_Kana_FirstName__c" }
					   ,{ name : "Relation__c"					  , label : teasp.message.getLabel('em10000670'), type : "Select",	 dataType : "String", isRequired: true }
					   ,{ name : "OtherRelation__c" 			  , label : teasp.message.getLabel('em10000680'),					 dataType : "String", length : 80 }
					   ,{ name : "Gender__c"					  , label : teasp.message.getLabel('em10000330'), type : "Select",	 dataType : "String" }
					   ,{ name : "Birth__c" 					  , label : teasp.message.getLabel('em10000340'),					 dataType : "Date" }
					   ,{ name : "Job__c"						  , label : teasp.message.getLabel('em10000690'),					 dataType : "String", length : 255 }
					   ,{ name : "EqualAddress__c"				  , label : teasp.message.getLabel('em10000700'),					 dataType : "Boolean" }
					   ,{ name : "PostalCode__c"				  , label : teasp.message.getLabel('em10000420'),					 dataType : "String", length : 8 }
					   ,{ name : "State__c" 					  , label : teasp.message.getLabel('em10000430'),					 dataType : "String", length : 80 }
					   ,{ name : "City__c"						  , label : teasp.message.getLabel('em10000440'),					 dataType : "String", length : 80 }
					   ,{ name : "Street__c"					  , label : teasp.message.getLabel('em10000450'), type : "TextArea", dataType : "String", length : 255 }
					   ,{ name : "IsNationalPensionNo3__c"		  , label : teasp.message.getLabel('em10000730'),					 dataType : "Boolean" }
					   ,{ name : "DisabilityGrade__c"			  , label : teasp.message.getLabel('em10000740'), type : "Select",	 dataType : "String" }
					   ,{ name : "HealthInsuranceSubscription__c" , label : teasp.message.getLabel('em10001900'), type : "Select",	 dataType : "String" }
					   ,{ name : "SocialInsuranceDivision__c"	  , label : teasp.message.getLabel('em10000970'), type : "Select",	 dataType : "String" }
			]
		}
		,DeleteDependents : { label : teasp.message.getLabel('em10000640')
			,fields : [ { name : "SelectTarget__c"				  , label : teasp.message.getLabel('em10000960'), type : "SelectDependents", isRequired: true }
			]
		}
		,DisabilityGrade : { label : teasp.message.getLabel('em10000890') // 障害情報
			,fields : [ { name : "DisabilityGrade__c", label : teasp.message.getLabel('em10000390'), type : "Select", dataType : "String" }
			]
		}
	};
	this.optionsList = this.getOptionsList();
};

teasp.dialog.ChangeEmp.prototype = new teasp.dialog.Base();

teasp.dialog.ChangeEmp.prototype.getOptionsList = function(){
	var opList = {
		Relation__c : [ { value : "妻"	  , label : teasp.message.getLabel('em10001180') }
					   ,{ value : "夫"	  , label : teasp.message.getLabel('em10001190') }
					   ,{ value : "子"    , label : teasp.message.getLabel('em10001200') }
					   ,{ value : "父"	  , label : teasp.message.getLabel('em10001210') }
					   ,{ value : "母"	  , label : teasp.message.getLabel('em10001220') }
					   ,{ value : "祖父"  , label : teasp.message.getLabel('em10001230') }
					   ,{ value : "祖母"  , label : teasp.message.getLabel('em10001240') }
					   ,{ value : "兄"	  , label : teasp.message.getLabel('em10001250') }
					   ,{ value : "弟"	  , label : teasp.message.getLabel('em10001260') }
					   ,{ value : "姉"	  , label : teasp.message.getLabel('em10001270') }
					   ,{ value : "妹"	  , label : teasp.message.getLabel('em10001280') }
					   ,{ value : "その他", label : teasp.message.getLabel('em10001290') }
		]
	   ,Gender__c : [ { value : "女性"	, label : teasp.message.getLabel('em10001310') }
					 ,{ value : "男性"	, label : teasp.message.getLabel('em10001300') }
		]
	   ,DisabilityGrade__c : [ { value : "" 	 , label : "" }
							  ,{ value : "第14級", label : teasp.message.getLabel('em10001320') }
							  ,{ value : "第13級", label : teasp.message.getLabel('em10001330') }
							  ,{ value : "第12級", label : teasp.message.getLabel('em10001340') }
							  ,{ value : "第11級", label : teasp.message.getLabel('em10001350') }
							  ,{ value : "第10級", label : teasp.message.getLabel('em10001360') }
							  ,{ value : "第9級" , label : teasp.message.getLabel('em10001370') }
							  ,{ value : "第8級" , label : teasp.message.getLabel('em10001380') }
							  ,{ value : "第7級" , label : teasp.message.getLabel('em10001390') }
							  ,{ value : "第6級" , label : teasp.message.getLabel('em10001400') }
							  ,{ value : "第5級" , label : teasp.message.getLabel('em10001410') }
							  ,{ value : "第4級" , label : teasp.message.getLabel('em10001420') }
							  ,{ value : "第3級" , label : teasp.message.getLabel('em10001430') }
							  ,{ value : "第2級" , label : teasp.message.getLabel('em10001440') }
							  ,{ value : "第1級" , label : teasp.message.getLabel('em10001450') }
		]
	   ,SocialInsuranceDivision__c : [ { value : "一般"  , label : teasp.message.getLabel('em10001460') }
									  ,{ value : "特定"  , label : teasp.message.getLabel('em10001470') }
									  ,{ value : "老人"  , label : teasp.message.getLabel('em10001480') }
									  ,{ value : "対象外", label : teasp.message.getLabel('em10001490') }
		]
	   ,HealthInsuranceSubscription__c : [ { value : "対象"  , label : teasp.message.getLabel('em10001150') }
										  ,{ value : "対象外", label : teasp.message.getLabel('em10001160') }
		]
		,TsDisplayMyNumber__c :  [ { value : "登録済み" , label : teasp.message.getLabel('em10001640') }
						 		  ,{ value : "未登録"   , label : teasp.message.getLabel('em10001650') }
		]
	};
	return opList;
};

/**
 * @override
 */
teasp.dialog.ChangeEmp.prototype.preInit = function(){
	require(["dijit/layout/TabContainer", "dijit/layout/ContentPane", "dijit/Tooltip"]);
	dojo.require( "dojo.fx" );
};

/**
 * @override
 */
teasp.dialog.ChangeEmp.prototype.ready = function(){
	this.client	   = this.args.client;
	this.loadRequestId = this.args.requestId;
};

/**
 * 画面生成
 *
 * @override
 */
teasp.dialog.ChangeEmp.prototype.preStart = function(){
	// キャンセルボタン押下時の処理とダイアログの×ボタンの処理を共通化
	dojo.connect(this.dialog, 'onCancel', this, function() { this.onfinishfunc(); this.close(); });

	dojo.style( dojo.byId( 'requestEdit_DialogChangeEmpTable' ), "width", "870px" );
	dojo.style( dojo.byId( 'requestEdit_DialogChangeEmpTable' ), "height", "420px" );
	dojo.query('.dijitDialogPaneContent', this.dialog.domNode).forEach( function( elem ) {
		dojo.style( elem, "background", "#F0F0E1" );
	} );

	var tbody = dojo.byId( "Buttons" );
	var tr = dojo.create( "tr", null, tbody );
	var cc = dojo.create( "td", null, tr );

	cc	= dojo.create( "td",  { id: 'requestEventForm_SubmitBtn' }, tr );
	div = dojo.create( 'div', { innerHTML: teasp.message.getLabel('em10000980') }  // 申 請
		, dojo.create( 'button', { className: 'std-button1-disabled', style: { margin: "4px 2px" }, disabled: true }, cc ) );
	dojo.connect(cc.firstChild, "onclick", this, this.submitRequestEvent);

	cc	= dojo.create( "td",  { id: 'requestEventForm_DeleteBtn' }, tr );
	div = dojo.create( 'div', { innerHTML: teasp.message.getLabel('tf10005040') }  // 削 除
		, dojo.create( 'button', { className: 'red-button1-disabled', style: { margin: "4px 2px" }, disabled: true }, cc ) );
	dojo.connect(cc.firstChild, "onclick", this, this.deleteRequestEvent);

	cc	= dojo.create( "td",  { id: 'requestEventForm_CancelBtn' }, tr );
	div = dojo.create( 'div', { innerHTML: teasp.message.getLabel('cancel_btn_title') }  // キャンセル
		, dojo.create( 'button', { className: 'std-button1 gry-button1', style: { margin: "4px 2px" } }, cc ) );
	dojo.connect(cc.firstChild, "onclick", this, function() { this.onfinishfunc(); this.close(); });

	tbody = dojo.byId( "RequestEditForm" );
	tr	= dojo.create( "tr", null, tbody );
	cc	= dojo.create( "td", { colSpan : 5 }, tr );
	div = dojo.create( "div", { style : "height: 340px; overflow-y: auto;" }, cc );
	dojo.create( "tbody", { id : "requestEditForm_tbody" }, dojo.create( "table", { className : "pane_table" }, div ) ); // （フォームエリア）

	// ボタン配置
	tbody = dojo.byId( "RequestEditForm" );
	tr = dojo.create( "tr", null, tbody );
	cc = dojo.create( "td", null, tr );

	tr = dojo.create("tr", null, dojo.create("tbody", null, dojo.create("table", { style:'margin-left:auto;margin-right:0px;' }, cc)));

	cc	= dojo.create( "td",  { style : "display:none;", id: 'requestFlowForm_SaveBtn' }, tr );
	div = dojo.create( 'div', { innerHTML: teasp.message.getLabel('tk10000289') }  // 保存
		, dojo.create( 'button', { className: 'std-button1', style: { margin: "4px 2px" } }, cc ) );
	dojo.connect(cc.firstChild, "onclick", this, function() { this.saveRequestFlow( false ); });

	cc	= dojo.create( "td",  { style : "display:none;", id: 'requestFlowForm_SaveNextBtn' }, tr );
	div = dojo.create( 'div', { innerHTML: teasp.message.getLabel('em10000990') }  // 保存＆次へ
		, dojo.create( 'button', { className: 'std-button1', style: { margin: "4px 2px" } }, cc ) );
	dojo.connect(cc.firstChild, "onclick", this, function() { this.saveRequestFlow( true ); });

	cc	= dojo.create( "td",  { style : "display:none;", id: 'requestFlowForm_NextBtn' }, tr );
	div = dojo.create( 'div', { innerHTML: teasp.message.getLabel('next_btn_title') }  // 次へ
		, dojo.create( 'button', { className: 'std-button1', style: { margin: "4px 2px" } }, cc ) );
	dojo.connect(cc.firstChild, "onclick", this, this.nextRequestFlow);
};

/**
 *
 * @override
 */
teasp.dialog.ChangeEmp.prototype.preShow = function() {
	dojo.empty(dojo.query('#GroupCategory select')[0]); // グループの内容をクリア
	dojo.empty(dojo.byId('RequestEventTable')); // イベントの内容をクリア
	dojo.empty(dojo.byId('RequestFlowTable' )); // フローの内容をクリア
	this.clearInfoArea(true);

	dojo.empty(dojo.byId( "requestEditForm_tbody" ));
	this.settingVisibleEventButton();

	this.employee = this.getMaster("EMEmployee");
	this.showEvent = null;
	this.showFlow = null;
	this.requestCache = null;
	this.saveBtnDwnFlg = false;
	this.mskMyNumber = null;
	this.settingVisibleEventButton();

	return true;
};

/**
 *
 * @override
 */
teasp.dialog.ChangeEmp.prototype.postShow = function(){
	// 前回のイベントハンドルをクリアする
	this.clearEventHandles();

	this.getRequestTemplate();

	globalAttachedEvent = dojo.hitch(this, this.attachedEvent);
};

/**
 *
 * テンプレート取得
 */
teasp.dialog.ChangeEmp.prototype.getRequestTemplate = function() {
	teasp.manager.dialogOpen('BusyWait');
	teasp.manager.request(
		'getEmployeeMaster',
		[ this.loadRequestId ],
		this.pouch,
		{ hideBusy : false },
		this,
		function(obj) {
			this.setMaster(obj);
			var info = this.getRequestInfo();
			if(!info.Id || info.EventId__c){
				this.createRequestTemplate();
				// イベント側を表示
				this.swapEventFlow( true, false );
				this.loadRequestFlowParts();
				teasp.manager.dialogClose('BusyWait');
			}else{
				// ここにくるということは、EventId__c が空＝イベント情報が削除されている。
				teasp.manager.dialogClose('BusyWait');
				this.close();
			}
		},
		function(event){
			teasp.message.alertError(event);
			teasp.manager.dialogClose('BusyWait');
		}
	);
};

/**
 * マスター関連情報やリクエスト情報を管理用の変数に格納
 * @param {Object} obj
 */
teasp.dialog.ChangeEmp.prototype.setMaster = function(obj) {
	this.master = obj;
	var ges = this.master.events || []; // このリストは OrderBy__c 順になっているはず
	var groups = [];
	var events = {};
	var gm = {};
	for(var i = 0 ; i < ges.length ; i++){
		var ge = ges[i];
		if(!ge.Contents__c || !ge.Group__c){
			continue;
		}
		var masterName = ge.Name;
		if(teasp.message.getLanguageLocaleKey()) {
			if(teasp.message.getLanguageLocaleKey() == 'en'
			|| teasp.message.getLanguageLocaleKey() == 'en_US') {
				masterName = ge.Name_Eng__c;
			}
		}
		var event = {
			id	  : ge.Id,
			name  : masterName
		};
		try {
			var o = dojo.fromJson(ge.Contents__c);
			event.flows = o.flows || [];
		}catch(e){
			console.log('fromJson failed!');
			console.log(ge.Contents__c);
		}
		if(!event.flows){
			event.flows = [];
		}
		dojo.forEach(event.flows, function(flow, index){
			flow.id    = 'f' + this.localAutoId++;
			flow.index = index;
		}, this);

		var groupName = ge.Group__c;
		if(teasp.message.getLanguageLocaleKey()) {
			if(teasp.message.getLanguageLocaleKey() == 'en'
			|| teasp.message.getLanguageLocaleKey() == 'en_US') {
				groupName = ge.Group_Eng__c;
			}
		}

		var group = gm[groupName];
		if(!group){
			group = {
				id	   : 'g' + this.localAutoId++,
				name   : groupName,
				events : []
			};
			gm[groupName] = group;
			groups.push(group);
		}
		group.events.push(event);
		events[event.id] = event;
		dojo.forEach(event.flows || [], function(flow){
			var flowParts = flow.flowParts || [];
			for(var j = 0 ; j < flowParts.length ; j++){
				var p = flowParts[j];
				p.id = 'p' + this.localAutoId++;
			}
		}, this);
	}
	this.master["groups"] = groups;
	this.master["events"] = events;
	for(var i = 0 ; i < groups.length ; i++){
		var group = groups[i];
		for(var j = 0 ; j < group.events.length ; j++){
			var event = group.events[j];
			var flows = event.flows || [];
			for(var k = 0 ; k < flows.length ; k++){
				var flow = flows[k];
				if(k == (flows.length - 1)){
					flow.last = true;
				}
			}
		}
	}
};

/**
 * マスター関連情報やリクエスト情報を返す
 * @param {string} key
 * @returns {*}
 */
teasp.dialog.ChangeEmp.prototype.getMaster = function(key) {
	var v = (this.master && this.master[key]) || null;
	if(!v){
		v = this.pouch.getKeyObj(key);
	}
	return v;
};

/**
 * リクエスト情報を作成
 * @param {Object} requestObj 保存済みの申請を開いた場合、サーバから返されたリクエスト情報
 * @param {Object} eventObj イベント情報
 */
teasp.dialog.ChangeEmp.prototype.initRequestCache = function(requestObj, eventObj) {
	this.requestCache = {
		EventRequestId : null,
		EmpId		   : this.getMaster( "sessionInfo" ).emp.id,
		EMEmpId		   : this.employee.Id,
		EventId 	   : null,
		FlowBody	   : null,
		_status 	   : null,
		_alias		   : {},
		_attached	   : {},
		_mnAttached	   : {},
		_required	   : {},
		_requiredAttach: {},
		_tmp		   : {}
	};
	if(requestObj){
		this.requestCache.EventRequestId = requestObj.Id;
		this.requestCache.EventId = requestObj.EventId__c;
		this.requestCache._status = (requestObj.TSEM && requestObj.TSEM.Status__c) || null;
		if(teasp.constant.STATUS_FIX.contains(this.requestCache._status)){ // ステータスが承認待ちor承認済み
			this.requestCache._readOnly = true;
		}
		var fb = (requestObj.TSEM && requestObj.TSEM.FlowBody__c) || requestObj.FlowBody__c || null;
		if(fb){
			try{
				this.requestCache.FlowBody = dojo.fromJson(fb);
			}catch(e){}
		}
		var attaches = (requestObj.TSEM && requestObj.TSEM.Attachments && requestObj.TSEM.Attachments.records) || [];
		for(var i = 0 ; i < attaches.length ; i++){
			var attach = attaches[i];
			if(attach.Description){
				this.requestCache._attached[attach.Description] = attach;
			}
		}
		var mnAttachements = (requestObj.TSEM && requestObj.TSEM.MyNumberAttachments && requestObj.TSEM.MyNumberAttachments) || null;
		if ( mnAttachements ) {
			for ( var index = 0 ; index < mnAttachements.length ; index++ ) {
				var mnAttache = mnAttachements[index];
				if(mnAttache && mnAttache.Type){
					this.requestCache._mnAttached[mnAttache.Type] = mnAttache;
				}
			}
		}
	}else if(eventObj){
		this.requestCache.EventId = eventObj.id;
	}
	this.storeRequiredAttach();
};

/**
 * ファイル添付が必須の項目を探して記憶
 */
teasp.dialog.ChangeEmp.prototype.storeRequiredAttach = function() {
	if(!this.requestCache){
		return;
	}
	this.requestCache._requiredAttach = {};
	var events = this.getMaster("events");
	var eventObj = events[this.requestCache.EventId];
	dojo.forEach(eventObj.flows || [], function(flow){
		var flowParts = flow.flowParts || [];
		for(var i = 0 ; i < flowParts.length ; i++) {
			var flowPart = flowParts[i];
			switch(flowPart.recordType) {
			case "Attachment":
				if(flowPart.isRequired){
					this.requestCache._requiredAttach[flowPart.attachmentDescription] = { type: 'file' };
				}
				break;
			case "EmployeeEdit":
				var section = this.fieldList[flowPart.showSection];
				for(var j = 0 ; j < section.fields.length ; j++){
					var field = section.fields[j];
					var type = (field.type || field.dataType || '').toLowerCase();
					if(field.isRequired && (type == 'file' || type == 'mynumberfile')){
						this.requestCache._requiredAttach[field.filedescription]  = { type: type };
					}
				}
				break;
			}
		}
	}, this);
};

/**
 * ファイル添付が必須の項目がある場合、ファイルが添付されているかチェックする
 * @param {Object=} req
 * @returns {boolean}
 */
teasp.dialog.ChangeEmp.prototype.isLackAttach = function(req) {
	var obj = (req || this.requestCache);
	var ra = obj._requiredAttach || {};
	for(var d in ra){
		if ( this.checkShowIdentityDocument( ra[d].type, d ) == false ) {
			continue;
		}
		if(!ra.hasOwnProperty(d)){
			continue;
		}
		var o = ra[d];
		var attach = (o.type == 'file' ? this.getAttachObj(d) : this.getMnAttachObj(d));
		if(!attach){
			return true;
		}
	}
	return false;
};

/**
 * 申請情報
 * @returns {Object}
 */
teasp.dialog.ChangeEmp.prototype.getRequestInfo = function() {
	var requestObj = this.getMaster("request");
	return (requestObj && requestObj.TSEM) || {};
};

teasp.dialog.ChangeEmp.prototype.getApplyDatetime = function( status ) {
	var requestObj = this.getMaster("request");
	var dt = (requestObj && requestObj.ApplyDatetime__c);
	if(	!dt
	&& requestObj
	&& requestObj.TSEM
	&& (teasp.constant.STATUS_FIX.contains(status)
	|| teasp.constant.STATUS_REJECTS.contains(status) )
	&& requestObj.TSEM.ApplyDatetime__c) {
		dt = moment(requestObj.TSEM.ApplyDatetime__c.replace('T', ' '));
		dt = teasp.util.date.formatDateTime(dt.toDate(), 'SLA-HM', true);
	} else if( dt ) {
		dt = teasp.util.date.formatDateTime(dt, 'SLA-HM');
	}
	return (dt ? dt : '');
};

/**
 * 承認履歴
 * @returns {Array.<Object>}
 */
teasp.dialog.ChangeEmp.prototype.getProcessInstanceStep = function() {
	var requestObj = this.getMaster("request");
	return teasp.logic.convert.convTSEMApplySteps((requestObj && requestObj.TSEM && requestObj.TSEM.ProcessInstanceStep) || []);
};

/**
 * 申請内容、申請日時、状態表示をクリア
 * @param {boolean} flag trueなら、グループのプルダウンを非表示にして属性エリアを表示
 */
teasp.dialog.ChangeEmp.prototype.clearInfoArea = function(flag) {
	var infoArea = dojo.byId('ChangeRequestInfo');
	dojo.empty(infoArea);
	if(flag){
		dojo.style('GroupCategory', 'display', 'none');
		dojo.style(infoArea 	  , 'display', '');
	}
};

/**
 * リクエスト情報を返す
 * @param {boolean} flag trueの場合、クローンを作って返す
 * @returns {Object}
 */
teasp.dialog.ChangeEmp.prototype.getRequestCache = function(flag) {
	if(flag){
		var req = dojo.clone(this.requestCache);
		for(var key in req){
			if(req.hasOwnProperty(key) && key.substring(0, 1) == '_'){
				delete req[key];
			}
		}
		if(req.FlowBody
		&& req.FlowBody.MyNumber__c
		&& this.mskMyNumber) {
			req.FlowBody.MyNumber__c = this.mskMyNumber;
		}
		// 接続IPを格納
		req.connectIP = connectIP;
		return req;
	}else{
		return this.requestCache;
	}
};

/**
 * API名が定義されていれば、別名としてセットする
 * @param {string} name
 * @param {string} alias
 */
teasp.dialog.ChangeEmp.prototype.setApiName = function(name, alias) {
	if(name && alias){
		this.requestCache._alias[name] = alias;
	}
};

/**
 * API名（別名）を返す。API名がなければ引数をそのまま返す
 * @param {string} name
 * @returns {string}
 */
teasp.dialog.ChangeEmp.prototype.getApiName = function(name) {
	return this.requestCache._alias[name] || name;
};

/**
 * 保存済みか
 * 保存済み＝添付ファイルをアップロードできる
 * @returns {boolean}
 */
teasp.dialog.ChangeEmp.prototype.isSaved = function() {
	return (this.requestCache && this.requestCache.EventRequestId);
};

/**
 * 個人番号関連資料をアップロードできるか
 * （リクエストID!=nullなら、保存済みということでアップロードできる）
 * @returns {Object}
 */
teasp.dialog.ChangeEmp.prototype.isMyNumberAttachable = function() {
	if(this.requestCache
	&& this.requestCache.EventRequestId
	&& this.requestCache.FlowBody
	&& this.requestCache.FlowBody.MyNumberId__c
	){
		return true;
	}
	return false;
};

/**
 * ロック状態か（承認待ち、承認済みならロック）
 * @returns {boolean}
 */
teasp.dialog.ChangeEmp.prototype.isLock = function() {
	return (this.requestCache
		&& this.requestCache.EventRequestId
		&& teasp.constant.STATUS_FIX.contains(this.requestCache._status));
};

/**
 * 申請できるか
 * @returns {boolean}
 */
teasp.dialog.ChangeEmp.prototype.canRequest = function() {
	if(!this.showEvent || !this.requestCache || !this.requestCache.EventRequestId || this.isLock()){
		return false;
	}
	for ( var i = 0 ; i < this.showEvent.flows.length ; i++ ) {
		var flow = this.showEvent.flows[i];
		if(flow.isRequired && !this.isFlowSaved(i)){ // 必須フローかつ保存されてない
			return false;
		}
	}
	if(this.isLackAttach()){ // 必須のファイル添付がない
		return false;
	}
	return true;
};

/**
 * 削除できるか
 * @returns {Boolean}
 */
teasp.dialog.ChangeEmp.prototype.canDelete = function() {
	return (this.requestCache
		&& this.requestCache.EventRequestId
		&& !teasp.constant.STATUS_FIX.contains(this.requestCache._status));
};

/**
 * 申請取消できるか
 * @returns {boolean}
 */
teasp.dialog.ChangeEmp.prototype.canCancel = function() {
	// ステータスが承認待ちの場合だけ真を返す
	return (this.requestCache
		&& this.requestCache.EventRequestId
		&& teasp.constant.STATUS_WAIT == this.requestCache._status);
};

/**
 * 添付ファイルの情報を返す
 * @param {string} description
 * @returns {boolean}
 */
teasp.dialog.ChangeEmp.prototype.getAttachObj = function(description) {
	return (this.requestCache && this.requestCache._attached && this.requestCache._attached[description]) || null;
};

/**
 * 個人番号用の添付ファイルの情報を返す
 * @param {string} description
 * @returns {boolean}
 */
teasp.dialog.ChangeEmp.prototype.getMnAttachObj = function(description) {
	return (this.requestCache && this.requestCache._mnAttached && this.requestCache._mnAttached[description]) || null;
};

/**
 * 保存を行ったことを記録する
 * @param {number} index
 * @param {Object=} req
 */
teasp.dialog.ChangeEmp.prototype.setFlowSaved = function(index, req) {
	var obj = (req || this.requestCache);
	if(!obj){
		return;
	}
	if(!obj.FlowBody){
		obj.FlowBody = {};
	}
	if(!obj.FlowBody._flowSaved){
		obj.FlowBody._flowSaved = [];
	}
	if(obj.FlowBody._flowSaved.indexOf(index) < 0){
		obj.FlowBody._flowSaved.push(index);
	}
};

/**
 * 保存を行ったかどうかを返す
 * @param {number} index
 * @param {Object=} req
 * @returns {Boolean}
 */
teasp.dialog.ChangeEmp.prototype.isFlowSaved = function(index, req) {
	var obj = (req || this.requestCache);
	if(obj && obj.FlowBody && obj.FlowBody._flowSaved){
		return (obj.FlowBody._flowSaved.indexOf(index) >= 0);
	}
	return false;
};

/**
 * フロー保存可否
 * @param {boolean} changed
 * @returns {boolean}
 */
teasp.dialog.ChangeEmp.prototype.canFlowSave = function(changed){
	if(this.isLack()){ // 必須項目が空
		return false;
	}
	if((this.showFlow && !this.isFlowSaved(this.showFlow.index)) // 未保存
	|| changed){ // 変更あり
		return true;
	}
	return false;
};

/**
 * 保存値または元の値を返す
 * @param {string} fieldName
 * @returns {string|boolean}
 */
teasp.dialog.ChangeEmp.prototype.getOrgValue = function(fieldName){
	var org = this.employee || {};
	var o = this.getSavedValue(fieldName);
	if(!o){
		var key = this.getApiName(fieldName);
		if(fieldName == 'MyNumber__c'){
			var os = this.getSavedValue('SelectTarget__c');
			if(os){
				if(org.Id == os.value){
					return org[key];
				}else{
					var dependent = this.getRefer('Dependents__r', os.value);
					if(dependent){
						return dependent[key];
					}
				}
			}
			return '';
		}
		return org[key];
	}
	return o.value || (typeof(o.value) == 'boolean' ? false : null);
};

/**
 * 保存値を返す
 * @param {string=} fieldName 省略の場合、テーブルごと返す
 * @returns {Object|undefined}
 */
teasp.dialog.ChangeEmp.prototype.getSavedValue = function(fieldName){
	var o = (this.requestCache.FlowBody || {});
	if(!fieldName){
		return o;
	}
	return o[fieldName];
};

/**
 * 保存値をセット（デフォルト値をセットしたい場合、これを呼ぶ）
 * @param {string} fieldName
 * @param {*} value
 */
teasp.dialog.ChangeEmp.prototype.setSavedValue = function(fieldName, dataType, value){
	if(!this.requestCache.FlowBody){
		this.requestCache.FlowBody = {};
	}
	this.requestCache.FlowBody[fieldName] = { dataType: dataType, value: value };
};

/**
 * 関連リストからIDが一致するレコードを取得
 * （該当がなければ空のオブジェクトを返す）
 * @param {string} refKey
 * @param {string} id
 * @returns {Object}
 */
teasp.dialog.ChangeEmp.prototype.getRefer = function(refKey, id){
	var org = this.employee || {};
	var records = (org[refKey] || {})['records'] || [];
	for(var i = 0 ; i < records.length ; i++){
		if(records[i].Id == id){
			return records[i];
		}
	}
	return {};
};

/**
 * 値を表示用の形式に変換
 * @param {string} fieldName
 * @param {string} dataType
 * @returns {string|boolean}
 */
teasp.dialog.ChangeEmp.prototype.getDispValue = function(fieldName, dataType, refer) {
	var v = (refer ? refer[this.getApiName(fieldName)] : this.getOrgValue(fieldName));
	if(v && typeof(v) == 'object'){
		v = v.value || null;
	}
	var type = dataType.toLowerCase();
	if(type == 'date'){
		//return (v ? teasp.util.date.formatDate(v, 'SLA') : '');

		// #8072対応
		var dt = '';
		if (v) {
			dt = teasp.util.date.formatDate(v, 'SLA');
		}

		// 不正な値が入力された場合は、入力値を返す
		if (dt == '???') {
			return v;
		} else {
			return dt
		}
	}else if(type == 'boolean'){
		return (v ? true : false);
	}else{
		return v || '';
	}
};

/**
 * 一時保存をリセット
 */
teasp.dialog.ChangeEmp.prototype.resetTemporary = function(){
	this.requestCache._tmp = { FlowBody: {} };
};

/**
 * 一時保存のテーブルを返す
 */
teasp.dialog.ChangeEmp.prototype.getTemporary = function(){
	return (this.requestCache._tmp && this.requestCache._tmp.FlowBody);
};

/**
 * 一時保存の値を返す
 * @param {string} fieldName
 * @returns {string|boolean|null}
 */
teasp.dialog.ChangeEmp.prototype.getTempValue = function(fieldName){
	var o = this.getTemporary();
	return (o && o[fieldName] && o[fieldName].value) || null;
};

/**
 * 保存用の値に変換して一時保存
 */
teasp.dialog.ChangeEmp.prototype.setDispValue = function(fieldName, dataType, value){
	var v = value || null;
	var type = dataType.toLowerCase();
	if(type == 'date' && v){
        v = teasp.util.date.formatDate(v);

        // #8072対応
        // 不正な値の場合は入力値を設定する
		if (v == '???') {
			v = value
		}
	}else if(type == 'boolean'){
		v = (v ? true : false);
	}
	var tmp = this.getTemporary();
	tmp[fieldName] = {
		type	: dataType,
		value	: v
	};
};

/**
 * 一時保存の値と保存値（または元の値）を比較
 */
teasp.dialog.ChangeEmp.prototype.isChanged = function() {
	if(!this.showFlow){
		return false;
	}
	var tmp = this.getTemporary();
	for(var key in tmp){
		if(!tmp.hasOwnProperty(key)){
			continue;
		}
		var tv = (tmp[key] && tmp[key].value);
		var ov = this.getOrgValue(key);
		if(tv != ov){ // 変更あり
			return true;
		}
	}
	return false;
};

/**
 * 必須項目に値が入ってなかったら true を返す
 * @returns {boolean}
 */
teasp.dialog.ChangeEmp.prototype.isLack = function() {
	if(!this.showFlow){
		return false;
	}
	var tmp = this.getTemporary();
	for(var key in tmp){
		if(!tmp.hasOwnProperty(key) || !this.isRequiredField(key)){
			continue;
		}
		var tv = (tmp[key] && tmp[key].value);
		if(!tv){ // 必須項目が空
			return true;
		}
	}
	return false;
};

/**
 * 必須項目をクリア
 */
teasp.dialog.ChangeEmp.prototype.clearRequiredField = function() {
	this.requestCache._required = {};
};

/**
 * 必須項目をセット
 * @param {string} key
 */
teasp.dialog.ChangeEmp.prototype.setRequiredField = function(key) {
	this.requestCache._required[key] = 1;
};

/**
 * 必須項目か
 * @param {string} key
 * @returns {boolean}
 */
teasp.dialog.ChangeEmp.prototype.isRequiredField = function(key) {
	return (this.requestCache._required[key] ? true : false);
};

/**
 * 個人番号の変更フラグをセット
 */
teasp.dialog.ChangeEmp.prototype.resetMyNumber = function() {
	var tmp = this.getTemporary();
	// 個人番号が変更されているステータスの初期化
	tmp.IsChangeMyNumber = false;
	if ( this.requestCache.FlowBody ) {
		var myNumberId = this.requestCache.FlowBody.MyNumberId__c;
		var myNumberValue = this.requestCache.FlowBody.MyNumber__c;
		// 個人番号が変更されている場合は、個人番号Keyをリセットする
		dojo.query('input[fieldName="MyNumber__c"]').forEach(function(el){
			if(myNumberId && myNumberValue.value != el.value) {
				tmp.IsChangeMyNumber = true;
				this.mskMyNumber = null;
			}
		});
	}
};

/**
 * 個人番号の添付ファイルをセット
 */
teasp.dialog.ChangeEmp.prototype.resetMyNumberAttachment = function() {
	if ( this.requestCache.FlowBody ) {
		var myNumberId = this.requestCache.FlowBody.MyNumberId__c;
		var myNumberValue = this.requestCache.FlowBody.MyNumber__c;
		var myNumberObj = dojo.query('input[fieldName="MyNumber__c"]')[0];
		if ( myNumberObj ) {
			if ( myNumberId && myNumberValue.value != myNumberObj.value ) {
				this.requestCache._mnAttached = {};
			}
		}
	}
};

/**
 * 一時保存の値をマージ
 */
teasp.dialog.ChangeEmp.prototype.mergeValue = function(req, res) {
	var obj = (req || this.requestCache);
	if(!obj){
		return;
	}
	if(!obj.FlowBody){
		obj.FlowBody = {};
	}
	var tmp = this.getTemporary();
	for(var key in tmp){
		if(tmp.hasOwnProperty(key)){
			obj.FlowBody[key] = tmp[key] || null;
		}
	}
	if(res){
		for(var key in res){
			if(key == 'result' || !res.hasOwnProperty(key)){
				continue;
			}
			obj.FlowBody[key] = res[key];
		}
	}
};

/**
 * 入力値に応じてボタンの状態を変更する
 * @param e
 */
teasp.dialog.ChangeEmp.prototype.blurField = function(e) {
	this.settingFlowValue();
	this.settingVisibleEventButton(this.isChanged());
};

/**
 * Enter キー押下時に入力値に応じてボタンの状態を変更する
 * その他のキー押下時は変更ありとしてボタンの状態を変更する
 * @param e
 */
teasp.dialog.ChangeEmp.prototype.keypressField = function(e) {
	if (e.keyChar === "" && e.keyCode === 13){ // keyCharが空の場合は特殊なキー＆コードがENTERキー
		this.settingFlowValue();
		this.settingVisibleEventButton(this.isChanged());
	}else{
		this.settingFlowValue();
		this.settingVisibleEventButton(true);
	}
};

/**
 * イベントリソースを記録
 * @param {string} key
 * @param {Object} handle
 */
teasp.dialog.ChangeEmp.prototype.setEventHandles = function(key, handle){
	var handles = this.eventHandles[key];
	if(!handles){
		handles = this.eventHandles[key] = [];
	}
	handles.push(handle);
};

/**
 * イベントリソースをクリアする
 * @param {string} key
 */
teasp.dialog.ChangeEmp.prototype.clearEventHandles = function(key){
	if(key){
		var handles = this.eventHandles[key] || [];
		for(var i = handles.length - 1 ; i >= 0 ; i--){
			dojo.disconnect(handles[i]);
			delete handles[i];
		}
		delete this.eventHandles[key];
	}else{
		for(var k in this.eventHandles){
			if(k && this.eventHandles.hasOwnProperty(k)){
				this.clearEventHandles(k);
			}
		}
	}
};

/**
 *
 * データ読み込み
 */
teasp.dialog.ChangeEmp.prototype.loadRequestFlowParts = function() {
	var infoArea = dojo.byId('ChangeRequestInfo');
	dojo.empty(infoArea);

	dojo.style('GroupCategory', 'display', (this.loadRequestId ? 'none' : ''));
	dojo.style(infoArea 	  , 'display', (this.loadRequestId ? '' : 'none'));

	if(!this.loadRequestId) {
		this.lockEventButton(false);
		return;
	}
	var requestObj = this.getMaster("request");
	this.initRequestCache(requestObj);

	var info = this.getRequestInfo();
	var kl = teasp.message.getLabel('tm10001590'); // ：

	var grp = dojo.create('div', { className: 'request-info-group' }, infoArea);
	dojo.create('div', { className: 'request-info-c', innerHTML: teasp.message.getLabel('em10001110') + kl }, grp); // 申請内容
	dojo.create('span', { innerHTML: info.Name || '&nbsp;' }, dojo.create('div', { className: 'request-info-v' }, grp));

	grp = dojo.create('div', { className: 'request-info-group' }, infoArea);
	dojo.create('div', { className: 'request-info-c', innerHTML: teasp.message.getLabel('applyDate_label') + kl }, grp); // 申請日
	dojo.create('span', { innerHTML: this.getApplyDatetime(info.Status__c) || '&nbsp;' }, dojo.create('div', { className: 'request-info-v' }, grp));

	dojo.create('div', { className: 'request-info-c', innerHTML: teasp.message.getLabel('statusj_head') + kl }, grp); // 状況
	var btn = dojo.create('button', { className: 'std-button2' }, dojo.create('div', { className: 'request-info-btn' }, grp));
	dojo.create('div', { innerHTML: teasp.constant.getDisplayStatus(info.Status__c) || '&nbsp;' }, btn);
	this.setEventHandles('top', dojo.connect(btn, 'onclick', this, this.showSteps));

	var events = this.getMaster("events");
	var eventObj = events[this.requestCache.EventId];
	if(eventObj){
		dojo.hitch( this, this.openRequestEvent( eventObj, false ) )();
	}
	this.settingVisibleEventButton();
	// グループやイベント変更のロック
	this.lockEventButton( true );
};

/**
 *
 * グループ一覧表示
 */
teasp.dialog.ChangeEmp.prototype.createRequestTemplate = function() {
	var selectObj = dojo.query('#GroupCategory select')[0];
	dojo.create( "option", { value : "", innerHTML: teasp.message.getLabel('em10001000') }, selectObj ); // （すべて表示）
	var tbody = dojo.byId( "RequestEventTable" );
	var groups = this.getMaster("groups");
	var eventSets = {};
	for ( var i = 0 ; i < groups.length ; i++ ) {
		var groupObj = groups[i];
		dojo.create( "option", { value : groupObj.id, innerHTML : groupObj.name }, selectObj );
		for ( var j = 0 ; j < groupObj.events.length ; j++ ) {
			var eventObj = groupObj.events[j];
			if ( !eventSets[eventObj.id] ) {
				this.settingEvent( tbody, eventObj );
				eventSets[eventObj.id] = true;
			}
		}
	}
	this.setEventHandles('top', dojo.connect(selectObj, "onchange", this, this.changeGroup));
};

/**
 *
 * グループ選択
 */
teasp.dialog.ChangeEmp.prototype.changeGroup = function() {
	var selectGroupId = dojo.query('#GroupCategory select')[0].value;
	var targetEvents = new Array();
	var eventSets = {};
	var groupReset = false;
	var groups = this.getMaster("groups");
	for ( var i = 0 ; i < groups.length ; i++ ) {
		var groupObj = groups[i];
		if ( groupObj.id == selectGroupId || selectGroupId == "" ) {
			for ( var j = 0 ; j < groupObj.events.length ; j++ ) {
				var eventObj = groupObj.events[j];
				if ( !eventSets[eventObj.id] ) {
					targetEvents.push( eventObj );
					eventSets[eventObj.id] = true;
				}
			}
			groupReset = true;
		}
	}
	if(groupReset){
		// イベントの内容をクリア
		var tbody = dojo.byId( 'RequestEventTable' );
		dojo.empty(tbody);
		this.clearEventHandles('group');
		for ( var j = 0 ; j < targetEvents.length ; j++ ) {
			var eventObj = targetEvents[j];
			this.settingEvent( tbody, eventObj );
		}
	}
};

/**
 *
 * イベント情報の設定
 */
teasp.dialog.ChangeEmp.prototype.settingEvent = function( tbody, eventObj ) {
	var row = dojo.create( "tr", null, tbody );
	var span = dojo.create( "span", { innerHTML : eventObj.name } ,dojo.create( "td", { className : "SelectEvent", id : "event_" + eventObj.id }, row ) );
	this.setEventHandles('group', dojo.connect(span, "onclick", this, this.openRequestEvent( eventObj, true )));
};

/**
 *
 * イベント選択時
 */
teasp.dialog.ChangeEmp.prototype.openRequestEvent = function( eventObj, isAnimation ) {
	return function() {
		this.clearEventHandles('group2');
		if(!this.requestCache || isAnimation){
			this.initRequestCache(null, eventObj);
		}
		// 対象となるフローを取得
		var events = this.getMaster("events");
		var flows = eventObj.flows;
		// フローの内容をクリア
		var tbody = dojo.byId( 'RequestFlowTable' );
		dojo.empty(tbody);
		var row = dojo.create( "tr", null, tbody );
		var span = dojo.create( "span"
				  ,{ innerHTML : teasp.message.getLabel('em10001010') } // ＜戻る
				  ,dojo.create( "td", { className : "RequestReturnEvent", id : "RequestReturnEvent" }, row ) );
		this.setEventHandles('group2', dojo.connect( span, "onclick", this, function() {
			this.swapEventFlow( true, true );
			dojo.hitch( this, this.openRequestFlow( null ) )(); }
		));
		row = dojo.create( "tr", null, tbody );
		var div = dojo.create( "div", { innerHTML : eventObj.name }, dojo.create( "td", { className : "RequestEventTitle" }, row ) );
		row = dojo.create( "tr", { style : "height: 100%;" }, tbody );
		var flowList = dojo.create( "div", { className : "RequestFlowList" }, dojo.create( "td", { style: 'vertical-align:top;' }, row ) );
		row = dojo.create( "tr", null, tbody );
		div = dojo.create( "div", null, dojo.create( "td", { className : "RequestFlowRequiredAnnotation", colspan : 4 }, row ) );
		div.innerHTML = teasp.message.getLabel('em10001020', teasp.message.getLabel('em10001030')); // * 必須項目
		tbody = dojo.create( "tbody", null, dojo.create( "table", { style : "width: 100%;" }, flowList ) );
		for ( var i = 0 ; i < flows.length ; i++ ) {
			var flowObj = flows[i];
			row = dojo.create( "tr", null, tbody );
			var td = dojo.create( "td", { style : "vertical-align: top; height: 24px;" }, row );
			if	(!flowObj.isRead) {
				div = dojo.create( "div", { className : "RequestFlowCheck", id : "flowCheck_" + flowObj.id }, td );
				if(this.isFlowSaved(i)){
					dojo.addClass( div, "png-sts005" );
				}
			}
			td = dojo.create( "td", { style : "vertical-align: top;" }, row );
			if (!flowObj.isRead) {
				div = dojo.create( "div", { innerHTML : flowObj.isRequired ? "*" : "", className : "RequestFlowRequired" }, td );
			}
			var eventName = '';
			if( flowObj.name_msgId ) {
				eventName = teasp.message.getLabel(flowObj.name_msgId)
			} else {
				eventName = flowObj.name;
				if(teasp.message.getLanguageLocaleKey()) {
					if(teasp.message.getLanguageLocaleKey() == 'en'
					|| teasp.message.getLanguageLocaleKey() == 'en_US') {
						eventName = flowObj.name_eng;
					}
				}
			}
			div = dojo.create( "div"
							 ,{ innerHTML : ( i + 1 ) + " " + eventName }
							 ,dojo.create( "td", { className : "RequestSelectFlow", id : "FlowName_" + flowObj.id, style : "vertical-align: top; text-align: left;" }, row ) );
			this.setEventHandles('group2', dojo.connect( div, "onclick", this, this.openRequestFlow( flowObj ) ));
			div = dojo.create( "div"
							 ,{ innerHTML : "▶", style : "visibility: hidden;" } //
							 ,dojo.create( "td", { className : "RequestSelectMarkFlow", id : "FlowSelect_" + flowObj.id, style : "text-align: right;" }, row ) );
		}
		this.swapEventFlow( false, isAnimation );
		this.showEvent = events[eventObj.id];
		dojo.hitch( this, this.openRequestFlow( this.getFirstFlow() ) )();
	};
};

/**
 *
 * フロー選択時
 */
teasp.dialog.ChangeEmp.prototype.openRequestFlow = function( flowObj ) {
	return function() {
		this.clearEventHandles('flow');
		this.clearRequiredField();
		this.showFlow = flowObj;
		var tbody = dojo.byId( "requestEditForm_tbody" );
		dojo.empty(tbody);
		// 選択クリア
		dojo.query( ".RequestSelectMarkFlow div", dojo.byId( "RequestFlowList" ) ).forEach( function( elem ) {
			dojo.style( elem, "visibility", "hidden" );
		} );

		if ( flowObj ) {
			// 選択されたフローを選択状態にする
			dojo.style( dojo.byId( "FlowSelect_" + flowObj.id ).firstChild, "visibility", "visible" );
			// フローパーツを表示
			var flowParts = flowObj.flowParts || [];
			for ( var i = 0 ; i < flowParts.length ; i++ ) {
				this.createRequestEditForm( tbody, flowParts[i] );
			}
		}
		this.settingVisibleEventButton();
	};
};

teasp.dialog.ChangeEmp.prototype.createRequestEditForm = function( tbody, flowParts ) {
	// セクション表示
	if ( flowParts.isShowParts == true ) {
		var tr = dojo.create( "tr", null, tbody );
		var cc = dojo.create( "td", { style : "padding-bottom: 2px; text-align: left;" }, tr );
		cc.innerHTML = teasp.message.getLabel('tf10006410', flowParts.name); // ■ {0}
		if(teasp.message.getLanguageLocaleKey()) {
			if(teasp.message.getLanguageLocaleKey() == 'en'
			|| teasp.message.getLanguageLocaleKey() == 'en_US') {
				cc.innerHTML = teasp.message.getLabel('tf10006410', flowParts.name_eng); // ■ {0}
			}
		}
	}

	// 各項目
	var tr = dojo.create( "tr", null, tbody );
	var cc = dojo.create( "td", { style : "padding-bottom: 8px;" }, tr );
	var fieldtbody = dojo.create( "tbody", null, dojo.create( "table", { className: "request_Form", style: "border-collapse:separate;border-spacing:3px;" }, cc ) );
	switch ( flowParts.recordType ) {
		case "InputParts":
			// 入力部品
			tr = dojo.create( "tr", null, fieldtbody );
			cc = dojo.create("td", { className: "RequestFieldRequired" }, tr);
			if(flowParts.isRequired){
				dojo.create("div", { innerHTML: '*' }, cc);
				this.setRequiredField(flowParts.name);
			}
			if ( flowParts.labelName ) {
				dojo.create("div", { innerHTML: flowParts.labelName }, dojo.create("td", { className: "left", style: "padding-bottom:2px;text-align:left;" }, tr));
			}
			cc = dojo.create("td", { className: "right", colSpan: flowParts.labelName ? "1" : "2", style: "padding-bottom:2px;text-align:left;" }, tr);
			var div = dojo.create( "div", null, cc );
			var type = (flowParts.inputType || "text").toLowerCase();
			switch( type ) {
				case "text":
					dojo.create("input", {
						type	  : type,
						style	  : "width:300px;",
						id		  : flowParts.id,
						fieldName : flowParts.name,
						dataType  : "String"
					}, div);
					break;
				case "checkbox":
					dojo.create("input", {
						type	  : type,
						id		  : flowParts.id,
						fieldName : flowParts.name,
						dataType  : "Boolean"
					}, div);
					break;
				case "textarea":
					dojo.create("textarea", {
						rows	  : 5,
						cols	  : 75,
						style	  : "width:300px;",
						maxlength : 32768,
						id		  : flowParts.id,
						fieldName : flowParts.name,
						dataType  : "String"
					}, div);
					break;
				case "selectlist":
					var obj = dojo.create("select", {
						id		  : flowParts.id,
						fieldName : flowParts.name,
						dataType  : "String"
					}, div);
					var selectOptions = flowParts.selectValueList || [];
					dojo.create("option", { value: "", label: teasp.message.getLabel('em10001050') }, obj); // -- なし --
					for ( var i = 0 ; i < selectOptions.length ; i++ ) {
						var optionsValue = selectOptions[i];
						dojo.create("option", { value: optionsValue, label: optionsValue }, obj);
					}
					break;
				case "date":
					dojo.create("input", {
						type	  : 'text',
						style	  : "width:96px;text-align:center;",
						id		  : flowParts.id,
						fieldName : flowParts.name,
						dataType  : "Date"
					}, div);
					if(!this.isLock()){
						var btn = dojo.create( "input", { type : "button", style: "margin:2px;", className: 'pp_base pp_btn_cal' }, div );
						this.setEventHandles('flow', dojo.connect( btn, 'onclick', this, this.settingCalendar(flowParts.id) ) );
					}
					break;
			}
			this.setApiName(flowParts.name, flowParts.fieldName);
			break;
		case "Attachment":
			// 添付ファイル
			tr = dojo.create( "tr", null, fieldtbody );
			cc = dojo.create("td", { className: "RequestFieldRequired" }, tr);
			if(flowParts.isRequired){
				dojo.create("div", { innerHTML: '*' }, cc);
				this.setRequiredField(flowParts.name);
			}
			if ( flowParts.labelName ) {
				dojo.create("div", { innerHTML: flowParts.labelName }, dojo.create("td", { className: "left", style: "padding-bottom:2px;text-align:left;" }, tr));
			}
			cc = dojo.create("td", { className: "right", colSpan: flowParts.labelName ? "1" : "2", style: "padding-bottom:2px;text-align:left;" }, tr);
			var div = dojo.create( "div", null, cc );
			this.settingFileAttach(div, flowParts.attachmentDescription);
			this.setApiName(flowParts.name, flowParts.fieldName);
			break;
		case "EmployeeEdit":
			if ( flowParts.showSection ) {
				var section = this.fieldList[flowParts.showSection];
				for ( var j = 0 ; j < section.fields.length ; j++ ) {
					var field = section.fields[j];
					var type = field.type;

					// 表示非表示チェック
					if ( this.checkShowIdentityDocument( type, field.filedescription ) == false ) {
						continue;
					}

					this.setApiName(field.name, field.fieldName);
					tr = dojo.create( "tr", null, fieldtbody );
					cc = dojo.create("td", { className: "RequestFieldRequired" }, tr);

					if(field.isRequired){
						dojo.create("div", { innerHTML: '*' }, cc);
						this.setRequiredField(field.name);
					}
					if (field.label) {
						dojo.create("div", { innerHTML: field.label }, dojo.create("td", { className: "left", style: "padding-bottom:2px;text-align:left;" }, tr));
					}
					cc = dojo.create("td", { className: "right", colSpan: (field.label ? "1" : "2"), style: "padding-bottom:2px;text-align:left;" }, tr);
					var div = dojo.create( "div", null, cc );
					if (!type) {
						switch ( field.dataType ) {
						case "Boolean":
							type = "checkbox";
							break;
						case "Date":
							type = "date";
							break;
						default:
							type = "text";
							break;
						}
					}
					else {
						type = type.toLowerCase();
					}
					switch( type ) {
						case "selecttarget":
							var obj = dojo.create("select", {
								id		  : field.name,
								fieldName : field.name,
								dataType  : "String"
							}, div);
							var MyNumberLbl = this.getDispListValue('TsDisplayMyNumber__c', this.employee.TsDisplayMyNumber__c);
							dojo.create("option", {
								value	 : this.employee.Id,
								innerHTML: teasp.message.getLabel( 'em10001060', this.employee.Name, MyNumberLbl || "" ) // {0} 続柄：本人 個人番号：{1}
							}, obj);
							var dependents = this.employee.Dependents__r;
							if ( dependents ) {
								for ( var i = 0 ; i < dependents.records.length ; i++ ) {
									var dependent = dependents.records[i];
									MyNumberLbl = this.getDispListValue('TsDisplayMyNumber__c', dependent.TsDisplayMyNumber__c);
									var RelationLbl = this.getDispListValue('Relation__c', dependent.Relation__c);
									dojo.create("option", {
										value	 : dependent.Id,
										innerHTML: teasp.message.getLabel( 'em10001070', dependent.Name, RelationLbl || "", MyNumberLbl || "" ) // {0} 続柄：{1} 個人番号：{2}
									}, obj);
								}
							}
							if(!this.isFlowSaved(this.showFlow.index)){ // 未保存
								// デフォルトで本人を選択状態にするため、保存値にIDをセット
								obj.value = this.employee.Id;
								this.setSavedValue(field.name, 'String', this.employee.Id);
							}
							break;
						case "selectdependents":
							var obj = dojo.create("select", {
								id		  : field.name,
								fieldName : field.name,
								dataType  : "String"
							}, div);
							var dependents = (this.employee.Dependents__r && this.employee.Dependents__r.records) || [];
							for ( var i = 0 ; i < dependents.length ; i++ ) {
								var dependent = dependents[i];
								var RelationLbl = this.getDispListValue('Relation__c', dependent.Relation__c);
								dojo.create("option", {
									value	 : dependent.Id,
									innerHTML: teasp.message.getLabel( 'em10001500', dependent.Name, RelationLbl || "" ) // {0} 続柄：{1}
								}, obj);
							}
							if(dependents.length){
								this.setEventHandles('flow', dojo.connect(obj, 'onchange', this, function(){
									this.settingDependentField('Dependents__r', 'SelectTarget__c');
								}));
								if(!this.isFlowSaved(this.showFlow.index)){ // 未保存
									// デフォルトで一番上の要素を選択状態にするため、保存値にIDをセット
									obj.value = dependents[0].Id;
									this.setSavedValue(field.name, 'String', dependents[0].Id);
								}
							}
							break;
						case "select":
							var obj = dojo.create("select", {
								id		  : field.name,
								fieldName : field.name,
								dataType  : "String"
							}, div);
							var options = this.optionsList[field.name] || [];
							for ( var i = 0 ; i < options.length ; i++ ) {
								var optionObj = options[i];
								dojo.create("option", {
									value	 : optionObj.value,
									innerHTML: optionObj.label
								}, obj);
							}
							if(!this.isFlowSaved(this.showFlow.index) && options.length){ // 未保存
								// デフォルトで一番上を選択状態にするため、保存値に値をセット
								obj.value = options[0].value;
								this.setSavedValue(field.name, 'String', options[0].value || null);
							}
							break;
						case "date":
							dojo.create("input", {
								type	  : 'text',
								style	  : "width:96px;text-align:center;",
								id		  : field.name,
								fieldName : field.name,
								dataType  : "Date"
							}, div);
							if(!this.isLock()){
								var btn = dojo.create("input", { type: "button", style: "margin:2px;", className: 'pp_base pp_btn_cal' }, div );
								this.setEventHandles('flow', dojo.connect( btn, 'onclick', this, this.settingCalendar(field.name) ));
							}
							break;
						case "file":
							// 保存済みの場合、ファイル添付が可能
							this.settingFileAttach(div, field.filedescription);
							break;
						case "mynumberfile":
							// 保存済みの場合、ファイル添付が可能
							this.settingMyNumberFileAttach(div, field.filedescription);
							break;
						case "mynumberlabel":
							// 資料のコメントを表示
							this.settingMyNumberLabelAttach(div, field.filedescription);
							break;
						case "textarea":
							dojo.create("textarea", {
								rows	  : 5,
								cols	  : 75,
								style	  : "width:300px;",
								id		  : field.name,
								fieldName : field.name,
								maxlength : field.length,
								dataType  : "String"
							}, div);
							break;
						case "label":
							if ( field.name == "MyNumberPurposeUse" ) {
								var outputLabel = this.master["setting"].MyNumberPurposeUse || "";
								outputLabel = teasp.message.getLabel('em10001630') + ":<br />" + outputLabel;
								outputLabel = outputLabel.replace( /\r\n/g, "<br />" );
								outputLabel = outputLabel.replace( /\n/g, "<br />" );
								outputLabel = outputLabel.replace( /\r/g, "<br />" );
								dojo.create("div", {
									id        : field.name,
									innerHTML : outputLabel,
									style     : "font-size: 125%;"
								}, div );
							}
							break;
						default:
							var obj = dojo.create("input", {
								type	  : type,
								id		  : field.name,
								fieldName : field.name,
								maxlength : field.length,
								dataType  : field.dataType
							}, div);
							if ( field.name == "MyNumber__c" ) {
 								this.setEventHandles('flow', dojo.connect(obj, 'onkeyup', this, function(){ this.changedMyNumber(); } ) );

 								dojo.create("div", { id: "myNumberInfo", style: 'display: none;' }, div);
							}
							break;
					}
				}
			}
			break;
		case "Description":
			var descriptionMsg = '';
			if(flowParts.description_msgId) {
				descriptionMsg = teasp.message.getLabel(flowParts.description_msgId);
			} else {
				descriptionMsg = flowParts.description;
				if(teasp.message.getLanguageLocaleKey()) {
					if(teasp.message.getLanguageLocaleKey() == 'en'
					|| teasp.message.getLanguageLocaleKey() == 'en_US') {
						descriptionMsg = flowParts.description_eng;
					}
				}
			}
			tr = dojo.create( "tr", null, fieldtbody );
			dojo.create("td", { style: "width:8px;" }, tr);
			dojo.create("div", { innerHTML : descriptionMsg }, dojo.create("td", { className : "right", colSpan : "2", style: "padding-bottom:2px;text-align:left;" }, tr));
			break;
	}
	if(flowParts.showSection == "InsertDependents" && !this.isFlowSaved(this.showFlow.index)) {
		this.settingLoadDataFlowParts(this.getSavedValue()); // 扶養家族の追加＋未保存
	}else{
		this.settingLoadDataFlowParts();
	}
	if(flowParts.showSection == "UpdateDependents" && !this.isFlowSaved(this.showFlow.index)){
		this.settingDependentField('Dependents__r', 'SelectTarget__c'); // 扶養家族の更新＋未保存
	}else{
		this.settingFlowValue();
	}
	this.settingVisibleEventButton();
};

/**
 * 被扶養者の選択
 * @param {Object} dependentId 被扶養者Id
 */
teasp.dialog.ChangeEmp.prototype.selectDependent = function( dependentId ) {
	var dependentObj = null;
	if ( dependentId &&
		 this.employee.Dependents__r ) {
		for ( var index = 0 ; index < this.employee.Dependents__r.records.length ; index++ ) {
			if ( this.employee.Dependents__r.records[index].Id == dependentId ) {
				dependentObj = this.employee.Dependents__r.records[index];
			}
		}
	}
	return dependentObj;
};

/**
 * 本人確認資料添付表示のチェック
 */
teasp.dialog.ChangeEmp.prototype.checkShowIdentityDocument = function( type, fileDescription ) {
	var dependentObj = null;
	if ( this.requestCache.FlowBody &&
		 this.requestCache.FlowBody["SelectTarget__c"] ) {
		dependentObj = this.selectDependent( this.requestCache.FlowBody["SelectTarget__c"].value );
	}
	// 本人確認資料添付であるか
	if ( type &&
		 fileDescription == "2" ) {
		// 各設定に応じて非表示条件に一致しているか検査
		if ( ( this.master["setting"].IsRequiredIdentityDocument == false && !dependentObj ) ||
			 ( this.master["setting"].IsRequiredIdentityDocumentDependent == false && dependentObj && dependentObj.IsNationalPensionNo3__c == false ) ||
			 ( this.master["setting"].IsRequiredIdentityDocumentDependentNo3 == false && dependentObj && dependentObj.IsNationalPensionNo3__c == true ) ) {
			return false;
		}
	}
	return true;
};

/**
 * 被扶養者選択時の情報選択
 * @param {Object} fieldName 選択リスト名
 */
teasp.dialog.ChangeEmp.prototype.settingDependentField = function(refKey, selKey) {
	this.settingFlowValue();
	var refer = this.getRefer(refKey, this.getTempValue(selKey));
	var tbody = dojo.byId( "requestEditForm_tbody" );
	dojo.query('input[type="text"],input[type="date"],select,textarea', tbody).forEach(function(el){
		var fieldName = dojo.getAttr(el, "fieldName");
		var dataType  = dojo.getAttr(el, "dataType" );
		if(fieldName && dataType && fieldName != selKey){
			el.value = this.getDispValue(fieldName, dataType, refer);
		}
	}, this);
	dojo.query('input[type="checkbox"]', tbody).forEach(function(el){
		var fieldName = dojo.getAttr(el, "fieldName");
		var dataType  = dojo.getAttr(el, "dataType" );
		if(fieldName && dataType){
			el.checked = this.getDispValue(fieldName, dataType, refer);
		}
	}, this);
};

/**
 * 個人番号変更時の処理
 */
teasp.dialog.ChangeEmp.prototype.changedMyNumber = function() {
	var myNumberValue = dojo.byId( "MyNumber__c" ).value;
	var myNumberAttachmentObjs = dojo.query( ".myNumberAttachment" );
	var myNumberAttachmentHideObjs = dojo.query( ".myNumberAttachmentHide" );
	if(this.requestCache.FlowBody
	&& this.requestCache.FlowBody.MyNumber__c
	&& this.requestCache.FlowBody.MyNumber__c.value == myNumberValue
	&& this.isMyNumberAttachable() ) {
		for ( var index = 0 ; index < myNumberAttachmentObjs.length ; index++ ) {
			dojo.style( myNumberAttachmentObjs[index], "display", "" );
		}
		for ( var index = 0 ; index < myNumberAttachmentHideObjs.length ; index++ ) {
			dojo.style( myNumberAttachmentHideObjs[index], "display", "none" );
		}
	}
	else {
		for ( var index = 0 ; index < myNumberAttachmentObjs.length ; index++ ) {
			dojo.style( myNumberAttachmentObjs[index], "display", "none" );
		}
		for ( var index = 0 ; index < myNumberAttachmentHideObjs.length ; index++ ) {
			dojo.style( myNumberAttachmentHideObjs[index], "display", "" );
		}
	}

	this.settingFlowValue();
	this.settingVisibleEventButton(true);
};

/**
 * 添付ファイルのUI部作成
 * @param {Object} div 領域
 * @param {string} description 識別名
 */
teasp.dialog.ChangeEmp.prototype.settingFileAttach = function(div, description) {
	if(this.isSaved()) {
		var attach = this.getAttachObj(description);
		if(attach){
			dojo.create("span", { innerHTML: attach.Name || '', style: 'margin-right:8px;color:#666;' }, div);
		}else if(this.isLock()){
			dojo.create("div", { innerHTML: teasp.message.getLabel('em10001140'), style:'color:#666;' }, div); // 添付ファイルなし
		}
		if(!this.isLock()){
			var btn = dojo.create("input", { type : "button", value : teasp.message.getLabel('em10001080') }, div); // ファイル添付
			this.setEventHandles('flow', dojo.connect(btn, 'onclick', this, this.openAttachmentWindow(description)));
		}
	}else{
		dojo.create("div", { innerHTML: teasp.message.getLabel('em10001090'), style:'color:#666;' }, div); // 保存後にファイルをアップロードできます。
	}
};

/**
 * 個人番号資料のUI部作成
 * @param {Object} div 領域
 * @param {string} description 識別名
 */
teasp.dialog.ChangeEmp.prototype.settingMyNumberFileAttach = function(div, description) {
	var isMyNumberAttachable = this.isMyNumberAttachable();
	var attach = this.getMnAttachObj(description);
	var attachDiv = dojo.create( "div", { className: "myNumberAttachment" }, div );
	if(attach){
		dojo.create("span", { innerHTML: attach.Name || '', style: isMyNumberAttachable ? 'margin-right:8px;color:#666;' : + 'margin-right:8px;color:#666;display: none;' }, attachDiv);
	}else if(this.isLock()){
		dojo.create("div", { innerHTML: teasp.message.getLabel('em10001140'), style: isMyNumberAttachable ? 'color:#666;' : 'color:#666;display: none;' }, attachDiv); // 添付ファイルなし
	}
	if(!this.isLock()){
		var btn = dojo.create("input", { type : "button", value : teasp.message.getLabel('em10001080'), style: isMyNumberAttachable ? "" : "display: none;" }, attachDiv); // ファイル添付
		this.setEventHandles('flow', dojo.connect(btn, 'onclick', this, this.openMyNumberAttachmentWindow(description)));
	}
	dojo.create("div", { className: "myNumberAttachmentHide", innerHTML: teasp.message.getLabel('em10001580'), style: isMyNumberAttachable ? 'color:#666;display: none;' : 'color:#666;' }, div); // 個人番号を保存後にファイルをアップロードできます。
};

/**
 * 確認資料のコメント作成
 * @param {Object} div 領域
 * @param {string} description 識別名
 */
teasp.dialog.ChangeEmp.prototype.settingMyNumberLabelAttach = function(div, description) {
	var isMyNumberAttachable = this.isMyNumberAttachable();
	var attach = this.getMnAttachObj(description);
/*
	var attachDiv = dojo.create( "div", { className: "myNumberAttachment" }, div );
	if(attach){
		dojo.create("span", { innerHTML: attach.Name || '', style: isMyNumberAttachable ? 'margin-right:8px;color:#666;' : + 'margin-right:8px;color:#666;display: none;' }, attachDiv);
	}
*/
	if (description == 1){
		dojo.create("div", { className: "myNumberAttachmentHide", innerHTML: teasp.message.getLabel('em10001670'), style: 'color:#666;' }, div); // 番号確認用資料の説明
	} else {
		dojo.create("div", { className: "myNumberAttachmentHide", innerHTML: teasp.message.getLabel('em10001680'), style: 'color:#666;' }, div); // 本人確認用資料の説明
	}
};

/**
 * ファイルアップロードウィンドウを開く
 * @param description
 * @returns {Function}
 */
teasp.dialog.ChangeEmp.prototype.openAttachmentWindow = function(description) {
	return function(){
		openAttachmentWindow(description, this.requestCache.EventRequestId);
	};
};

/**
 * 個人番号関連資料ファイルアップロードウィンドウを開く
 * @param description
 * @returns {Function}
 */
teasp.dialog.ChangeEmp.prototype.openMyNumberAttachmentWindow = function(description) {
	return function(){
		if ( this.requestCache.EventRequestId &&
			 this.requestCache.FlowBody.MyNumberId__c &&
			 this.employee.Id ) {
			var selectTarget = "";
			if ( this.requestCache.FlowBody && this.requestCache.FlowBody["SelectTarget__c"] ) {
				selectTarget = this.requestCache.FlowBody["SelectTarget__c"].value;
			}
			openMyNumberAttachmentWindow( description, this.requestCache.EventRequestId, this.requestCache.FlowBody.MyNumberId__c, this.employee.Id, selectTarget );
		}
	};
};

/**
 * 添付ファイルがアップロードされた直後に呼ばれる
 * @param obj
 */
teasp.dialog.ChangeEmp.prototype.attachedEvent = function(obj) {
	console.log(obj);
	if(this.requestCache && this.requestCache.EventRequestId == obj.requestId){
		var at;
		if(obj.isMyNumber){
			at = this.requestCache._mnAttached;
			if(!at){
				at = this.requestCache._mnAttached = {};
			}
		}else{
			at = this.requestCache._attached;
			if(!at){
				at = this.requestCache._attached = {};
			}
		}
		at[obj.description] = { Name: obj.fname };
		dojo.hitch( this, this.openRequestFlow( this.showFlow ) )();
	}
	this.settingVisibleEventButton();
};

/**
 * カレンダーボタンがクリックされた時の処理
 */
teasp.dialog.ChangeEmp.prototype.settingCalendar = function(nodeId) {
	return function(e) {
		var n = teasp.util.date.parseDate(dojo.byId(nodeId).value); // 日付の入力値を取得
		var bd = (n || this.args.date || new Date());
		teasp.manager.dialogOpen("Calendar", {
				date : bd,
				isDisabledDateFunc: function(d){ return false; }
			},
			null,
			this,
			function(o) {
				dojo.byId(nodeId).value = teasp.util.date.formatDate(o, 'SLA');
				this.blurField();
			}
		);
	};
};

/**
 * 値をフォームにセット
 */
teasp.dialog.ChangeEmp.prototype.settingLoadDataFlowParts = function(refer) {
	var lock = this.isLock();
	var tbody = dojo.byId( "requestEditForm_tbody" );
	dojo.query('input[type="text"],input[type="date"],select,textarea', tbody).forEach(function(el){
		var fieldName = dojo.getAttr(el, "fieldName");
		var dataType  = dojo.getAttr(el, "dataType" );
		this.setEventHandles('flow', dojo.connect(el, 'onblur'    , this, this.blurField));
		if(el.nodeName == 'SELECT'){
			this.setEventHandles('flow', dojo.connect(el, 'onchange'  , this, this.blurField));
		}else{
			this.setEventHandles('flow', dojo.connect(el, 'onkeypress', this, this.keypressField));
		}
		if(fieldName && dataType){
			if(fieldName == "MyNumber__c") {
				if(this.requestCache
				&& this.requestCache.FlowBody
				&& this.requestCache.FlowBody.MyNumber__c ) {
					if( this.saveBtnDwnFlg ) {
						el.value = this.requestCache.FlowBody.MyNumber__c.value;
						if( this.requestCache.FlowBody.MskMyNumber ) {
							this.mskMyNumber = this.requestCache.FlowBody.MskMyNumber;
						}
					} else {
						this.mskMyNumber = this.requestCache.FlowBody.MyNumber__c;
						el.value = '';
					}
					dojo.byId( "myNumberInfo" ).innerHTML = teasp.message.getLabel('em10001640'); //登録済み
					dojo.style( "myNumberInfo" , "display", "" );
				} else {
					this.mskMyNumber = null;
					el.value = '';
					dojo.style( 'myNumberInfo', 'display', 'none' );
				}
				if( this.requestCache.FlowBody.MskMyNumber ) {
					delete this.requestCache.FlowBody['MskMyNumber'];
				}
			} else {
				el.value = this.getDispValue(fieldName, dataType, refer);
			}
		}
		if(lock){
			el.disabled = true;
			if(el.nodeName == 'INPUT' || el.nodeName == 'TEXTAREA'){
				// 非活性のテキスト入力欄の背景色を変える
				dojo.style(el, 'background-color', '#EEEEEE');
				dojo.style(el, 'border', '1px solid #EEEEEE');
				dojo.style(el, 'padding', '1px 2px');
			}
		}
	}, this);
	dojo.query('input[type="checkbox"]', tbody).forEach(function(el){
		var fieldName = dojo.getAttr(el, "fieldName");
		var dataType  = dojo.getAttr(el, "dataType" );
		this.setEventHandles('flow', dojo.connect(el, 'onclick', this, this.blurField));
		if(fieldName && dataType){
			el.checked = this.getDispValue(fieldName, dataType, refer);
		}
		if(lock){
			el.disabled = true;
		}
	}, this);
};

/**
 *
 * 値をフォームから取り出す
 */
teasp.dialog.ChangeEmp.prototype.settingFlowValue = function() {
	if(!this.requestCache){
		return;
	}
	this.resetTemporary();
	var tbody = dojo.byId( "requestEditForm_tbody" );
	dojo.query('input[type="text"],input[type="date"],select,textarea', tbody).forEach(function(el){
		var fieldName = dojo.getAttr(el, "fieldName");
		var dataType  = dojo.getAttr(el, "dataType" );
		if(fieldName && dataType){
			this.setDispValue(fieldName, dataType, el.value);
		}
	}, this);
	dojo.query('input[type="checkbox"]', tbody).forEach(function(el){
		var fieldName = dojo.getAttr(el, "fieldName");
		var dataType  = dojo.getAttr(el, "dataType" );
		if(fieldName && dataType){
			this.setDispValue(fieldName, dataType, el.checked);
		}
	}, this);
};

/**
 *
 * イベントの申請
 */
teasp.dialog.ChangeEmp.prototype.submitRequestEvent = function() {
	var req = this.getRequestCache(true);
	req.Action = "checksubmit";
	teasp.manager.request(
		'executeAPIChangeRequest',
		req,
		this.pouch,
		{ hideBusy : false },
		this,
		function( obj ) {
			teasp.manager.dialogOpen('Comment',
				{
					dialogTitle   : teasp.message.getLabel('applyx_btn_title'), // 承認申請
					okButtonTitle : teasp.message.getLabel('applyx_btn_title'), // 承認申請
					okButtonCss   : 'std-button1' // （青）
				},
				this.pouch,
				this,
				function(obj){
					req.Action = "eventsubmit";
					req.Comment = obj.comment;
					// フィールド名の配列を作成
					var fieldNameList = [];
					var flowParts = this.showEvent.flows[this.showFlow.index].flowParts || [];
					for ( var i = 0 ; i < flowParts.length ; i++ ) {
						var section = this.fieldList[flowParts[i].showSection];
						for(var j = 0 ; j < section.fields.length ; j++){
							var field = section.fields[j];
							fieldNameList.push(this.getApiName(field.name));
						}
					}
					req.FieldNameList = fieldNameList;
					console.log(req);
					teasp.manager.request(
						'executeChangeRequest',
						req,
						this.pouch,
						{ hideBusy : false },
						this,
						function( obj ) {
							if ( obj.isExecuteProcess == false ) {
								// TS側の承認プロセスが実行されない場合は、すぐにEM側の承認プロセスを実行する
								teasp.manager.request(
									'executeAPIChangeRequest',
									req,
									this.pouch,
									{ hideBusy : false },
									this,
									function( obj ) {
										this.onfinishfunc();
										// ダイアログを閉じる
										this.close();
									},
									function(event){
										teasp.message.alertError(event);
									}
								);
							}
							else {
								this.onfinishfunc();
								// ダイアログを閉じる
								this.close();
							}
						},
						function(event){
							teasp.message.alertError(event);
						}
					);
				}
			);
		},
		function(event){
			teasp.message.alertError(event);
		}
	);
};

/**
 *
 * イベントの削除
 */
teasp.dialog.ChangeEmp.prototype.deleteRequestEvent = function() {
	teasp.tsConfirmA(teasp.message.getLabel('em10001130'), this, function(){ // 申請を削除してよろしいですか？
		var req = this.getRequestCache(true);
		req.FlowBody = null;
		req.Action = "eventdelete";
		teasp.manager.request(
			'executeAPIChangeRequest',
			req,
			this.pouch,
			{ hideBusy : false },
			this,
			function( obj ) {
				teasp.manager.request(
					'executeChangeRequest',
					req,
					this.pouch,
					{ hideBusy : false },
					this,
					function( obj ) {
						this.onfinishfunc();
						// ダイアログを閉じる
						this.close();
					},
					function(event){
						teasp.message.alertError(event);
					}
				);
			},
			function(event){
				teasp.message.alertError(event);
			}
		);
	});
};

/**
 *
 * フローの保存
 */
teasp.dialog.ChangeEmp.prototype.saveRequestFlow = function( isNext ) {
	teasp.manager.dialogOpen('BusyWait');

	this.settingFlowValue();
	this.resetMyNumber();
	this.lockEventButton( true ); // グループやイベント変更のロック

	var req = this.getRequestCache(true);
	this.mergeValue(req);
	this.setFlowSaved(this.showFlow.index, req);

	req.Action = "eventsave";
	var isNew = req.EventRequestId ? false : true;

	var flowParts = this.showEvent.flows[this.showFlow.index].flowParts || [];
	for ( var i = 0 ; i < flowParts.length ; i++ ) {
		if(flowParts[i].showSection == "MyNumber") {
			this.saveBtnDwnFlg = true;
			break;
		}
	}

	teasp.manager.request(
		'executeChangeRequest',
		req,
		this.pouch,
		{ hideBusy : true },
		this,
		function( obj ) {
			this.requestCache.EventRequestId = obj.requestEventId;
			req.EventRequestId = obj.requestEventId;
			req.Action = "eventsave";
			teasp.manager.request(
				'executeAPIChangeRequest',
				req,
				this.pouch,
				{ hideBusy : true },
				this,
				function( obj ) {
					this.resetMyNumberAttachment();
					this.mergeValue(null, obj);
					this.setFlowSaved(this.showFlow.index);
					this.finishSaveFlow( isNext );
				},
				function(event){
					if ( isNew == true ) {
						req.Action = "eventdelete";
						teasp.manager.request(
							'executeChangeRequest',
							req,
							this.pouch,
							{ hideBusy : false },
							this,
							function( obj ) {
								this.requestCache.EventRequestId = null;
								teasp.message.alertError( event );
								teasp.manager.dialogClose('BusyWait');
							},
							function(event){
								teasp.message.alertError(event);
								teasp.manager.dialogClose('BusyWait');
							}
						);
					}
					else {
						teasp.message.alertError( event );
						teasp.manager.dialogClose('BusyWait');
					}
				}
			);
		},
		function(event){
			if ( this.requestCache.EventRequestId == null ) {
				this.lockEventButton( false ); // グループやイベント変更のロック
			}
			teasp.message.alertError(event);
			teasp.manager.dialogClose('BusyWait');
		}
	);
};

teasp.dialog.ChangeEmp.prototype.finishSaveFlow = function(isNext) {
	dojo.addClass( dojo.byId( "flowCheck_" + this.showFlow.id ), "png-sts005" );
	this.settingVisibleEventButton();
	teasp.manager.dialogClose('BusyWait');
	if (isNext) {
		dojo.hitch( this, this.openRequestFlow( this.getNextFlow() ) )(); // 次のフローに移動
	}else {
		dojo.hitch( this, this.openRequestFlow( this.showFlow ) )();
	}
};

teasp.dialog.ChangeEmp.prototype.nextRequestFlow = function() {
	dojo.hitch( this, this.openRequestFlow( this.getNextFlow() ) )(); // 次のフローに移動
};

teasp.dialog.ChangeEmp.prototype.getNextFlow = function() {
	for ( var i = 0 ; i < this.showEvent.flows.length ; i++ ) {
		var flowObj = this.showEvent.flows[i];
		if ( flowObj.id == this.showFlow.id ) {
			if ( this.showEvent.flows.length > i + 1 ) {
				return this.showEvent.flows[i + 1];
			}
		}
	}
	return null;
};

teasp.dialog.ChangeEmp.prototype.getFirstFlow = function() {
	return (this.showEvent.flows.length > 0 ? this.showEvent.flows[0] : null);
};

/**
 *
 * イベントとフローの切替
 */
teasp.dialog.ChangeEmp.prototype.swapEventFlow = function( isEventShow, isAnimation ) {
	var viewObj  = dojo.byId( "RequestView" );
	var eventObj = dojo.byId( "RequestEvent" );
	var flowObj  = dojo.byId( "RequestFlow" );
	var viewWidth = viewObj.clientWidth;
	var duration = 350;

	if ( isAnimation == false ) {
		if ( isEventShow == true ) {
			dojo.style( eventObj, "left", "0px" );
			dojo.style( eventObj, "display", "" );
			dojo.style( flowObj, "left", viewWidth + "px" );
			dojo.style( flowObj, "display", "none" );
		}
		else {
			dojo.style( eventObj, "left", "-" + viewWidth + "px" );
			dojo.style( eventObj, "display", "none" );
			dojo.style( flowObj, "left", "0px" );
			dojo.style( flowObj, "display", "" );
		}
	}
	else {
		var eventSlide;
		var flowSlide;
		if ( isEventShow == true ) {
			eventSlide = dojo.fx.slideTo( { node: eventObj
										   ,duration: duration
										   ,left: 0
										   ,unit: "px"
										   ,onBegin: function() { dojo.style( eventObj, "display", "" ); } } );
			this.setEventHandles('group', dojo.connect( eventSlide, "onBegin", function() { dojo.style( eventObj, "display", "" ); } ));
			flowSlide = dojo.fx.slideTo( { node: flowObj
										  ,duration: duration
										  ,left: viewWidth
										  ,unit: "px"
										  ,onEnd: function() { dojo.style( flowObj, "display", "none" ); } } );
			this.setEventHandles('group', dojo.connect( flowSlide, "onEnd", function() { dojo.style( flowObj, "display", "none" ); } ));
		}
		else {
			eventSlide = dojo.fx.slideTo( { node: eventObj
										   ,duration: duration
										   ,left: ( viewWidth * -1 )
										   ,unit: "px" } );
			this.setEventHandles('group', dojo.connect( eventSlide, "onEnd", function() { dojo.style( eventObj, "display", "none" ); } ));
			flowSlide = dojo.fx.slideTo( { node: flowObj
										  ,duration: duration
										  ,left: 0
										  ,unit: "px" } );
			this.setEventHandles('group', dojo.connect( flowSlide, "onBegin", function() { dojo.style( flowObj, "display", "" ); } ));
		}
		eventSlide.play();
		flowSlide.play();
	}
};

/**
 *
 * グループ変更とイベント移動のロック切替
 */
teasp.dialog.ChangeEmp.prototype.lockEventButton = function( isLock ) {
	var groupSelect = dojo.query('#GroupCategory select')[0]; // グループ選択
	var returnBtn	= dojo.byId( "RequestReturnEvent" );  // 戻るボタン
	if(groupSelect){
		groupSelect.disabled = isLock;
	}
	if(returnBtn){
		dojo.style(returnBtn, "visibility", (isLock ? "hidden" : ""));
	}
};

/**
 * ボタンの活性／非活性切り替え
 * @param {string|Object} node
 * @param {boolean|number} flag
 * @param {string} baseCss
 */
teasp.dialog.ChangeEmp.activeButton = function(node, flag, baseCss) {
	if(typeof(flag) == 'number' && flag < 0){
		dojo.style(node, 'display', 'none');
		return;
	}
	dojo.style(node, 'display', '');
	dojo.query('button', (typeof(nodeId) == 'string' ? dojo.byId(node) : node)).forEach(function(el){
		dojo.toggleClass(el, baseCss              , flag);
		dojo.toggleClass(el, baseCss + '-disabled', !flag);
		el.disabled = !flag;
	});
};

/**
 * ボタン表示切替
 */
teasp.dialog.ChangeEmp.prototype.settingVisibleEventButton = function(changed) {
	var locked       = this.isLock();                                                     // ロック（申請済み）の状態
	var lastFlow     = (this.showFlow && this.showFlow.last) || false;                    // 最後のフローか
	var flowSaved    = this.canFlowSave(changed);

	var deleteFlag   = (this.canDelete() ? 1 : 0);                             // 削除ボタン
	var submitFlag   = (!changed && this.canRequest()) ? 1 : 0;                // 申請ボタン
	var saveFlag     = (locked ? -1 : (flowSaved ? 1 : 0));                    // 保存ボタン
	var saveNextFlag = ((locked || lastFlow) ? -1 : (flowSaved ? 1 : 0));      // 保存＆次へボタン
	var nextFlag     = ((locked && !lastFlow) ? 1 : -1);                       // 次へボタン

	teasp.dialog.ChangeEmp.activeButton("requestEventForm_DeleteBtn" , deleteFlag  , 'red-button1'); // 削除ボタン
	teasp.dialog.ChangeEmp.activeButton("requestEventForm_SubmitBtn" , submitFlag  , 'std-button1'); // 申請ボタン
	teasp.dialog.ChangeEmp.activeButton("requestFlowForm_SaveBtn"    , saveFlag    , 'std-button1'); // 保存ボタン
	teasp.dialog.ChangeEmp.activeButton("requestFlowForm_SaveNextBtn", saveNextFlag, 'std-button1'); // 保存＆次へボタン
	teasp.dialog.ChangeEmp.activeButton("requestFlowForm_NextBtn"    , nextFlag    , 'std-button1'); // 次へボタン
};

/**
 * ステータスのリンクのクリックで承認履歴画面を開く
 */
teasp.dialog.ChangeEmp.prototype.showSteps = function() {
	teasp.manager.dialogOpen('Status',
		{
			apply			  : { steps: this.getProcessInstanceStep() }, // 承認履歴のリスト
			removable		  : this.canCancel(),
			removeButtonType  : 1,
			cancelApply 	  : this.cancelRequest,
			showCancelComment : true
		},
		this.pouch,
		this,
		function(obj){
			this.doCancelRequest(obj.comment); // 申請取消実行
		}
	);
};

/**
 * 申請取消のコメント入力ダイアログを開く
 * @param {Array.<Object>} steps
 * @param {Function} callback
 */
teasp.dialog.ChangeEmp.prototype.cancelRequest = function(steps, callback) {
	teasp.manager.dialogOpen('Comment',
		{
			dialogTitle   : teasp.message.getLabel('cancelApply_btn_title'), // 申請取消
			okButtonTitle : teasp.message.getLabel('cancelApply_btn_title'), // 申請取消
			okButtonCss   : 'red-button1' // （赤）
		},
		this.pouch,
		this,
		function(obj){
			callback(obj);
		}
	);
};

/**
 * 申請取消実行
 */
teasp.dialog.ChangeEmp.prototype.doCancelRequest = function(comment) {
	var req = this.getRequestCache(true);
	req.Action  = "eventremove";
	req.Comment = comment;
	if ( this.employee.Id &&
		 this.requestCache.FlowBody &&
		 this.requestCache.FlowBody["SelectTarget__c"] ) {
		 req.EMEmp = this.employee.Id == this.requestCache.FlowBody["SelectTarget__c"].value ? "true" : "false";
	}
	if ( this.requestCache.FlowBody &&
		 this.requestCache.FlowBody.MyNumberId__c ) {
		 req.MyNumberId = this.requestCache.FlowBody.MyNumberId__c;
	}
	teasp.manager.request(
		'executeChangeRequest',
		req,
		this.pouch,
		{ hideBusy : false },
		this,
		function( obj ) {
			teasp.manager.request(
				'executeAPIChangeRequest',
				req,
				this.pouch,
				{ hideBusy : false },
				this,
				function( obj ) {
					this.onfinishfunc();
					this.close(); // ダイアログを閉じる
				},
				function(event){
					teasp.message.alertError(event);
				}
			);
		},
		function(event){
			teasp.message.alertError(event);
		}
	);
};

teasp.dialog.ChangeEmp.prototype.getDispListValue = function(fieldNaame, orgValue) {
	var opList = this.getOptionsList();
	var options = opList[fieldNaame];
	for ( var i = 0 ; i < options.length ; i++ ) {
		var optionObj = options[i];
		if(optionObj.value == orgValue) {
			return optionObj.label;
		}
	}
	return orgValue;
};

/**
 * @override
 */
teasp.dialog.ChangeEmp.prototype.hide = function(){
	this.free();
	this.dialog.destroy();
	teasp.manager.dialogRemove('ChangeEmp');
};