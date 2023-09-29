teasp.provide('teasp.view.HRMEmpConfig');
/**
 * TSHRM用社員情報画面
 * （teasp.view.EMEmpConfig.prototype.initの定義情報以外はViewEMEmpConfig.jsのコピー）
 * @constructor
 * @extends {teasp.view.Base}
 */
teasp.view.HRMEmpConfig = function(){
};

teasp.view.HRMEmpConfig.prototype = new teasp.view.Base();

/**
 * 画面初期化
 *
 * @param {Object} messageMap メッセージテーブル
 * @param {Function} onSuccess 正常受信時の処理
 * @param {Function} onFailure 異常受信時の処理
 */
teasp.view.HRMEmpConfig.prototype.init = function(messageMap, onSuccess, onFailure){
	teasp.message.mergeLabels(globalMessages || {});
	teasp.message.mergeLabels(messageMap ? (messageMap[teasp.message.getLanguageLocaleKey()] || {}) : {});

	// 表示項目一覧
	this.employeeFieldList = [
		// 1.社員情報 = employeeInformation
		{ id : "employeeInformation", label : teasp.message.getLabel('em10000240'), fields :[
			 { fieldName : "EmpCode__c", label : teasp.message.getLabel('tk10000068') }
			,{ fieldName : "Name", label : teasp.message.getLabel('empName_label') }
			,{ fieldName : "EmpName_Kana__c", label : teasp.message.getLabel('em10000260') }
			,{ fieldName : "EmpName_Document__c", label : teasp.message.getLabel('em10000270') }
			,{ fieldName : "EmpName_Document_Kana__c", label : teasp.message.getLabel('em10001920') }
			,{ fieldName : "BusinessName__c", label : teasp.message.getLabel('em10003160') }
			,{ fieldName : "BusinessNameKana__c", label : teasp.message.getLabel('em10003170') }
			,{ fieldName : "EmpName_English__c", label : teasp.message.getLabel('em10004320') }
//			,{ fieldName : "Reason_ChangeName__c", label : teasp.message.getLabel('em10003180') }
			,{ fieldName : "DepartmentId__r.DeptCode__c", label : teasp.message.getLabel('tk10000069') }
			,{ fieldName : "DepartmentId__r.Name", label : teasp.message.getLabel('dept_label') }
			,{ fieldName : "Title__c", label : teasp.message.getLabel('title_label') }
			,{ fieldName : "Manager__r.Name", label : teasp.message.getLabel('empManager_label') }
			,{ fieldName : "Phone__c", label : teasp.message.getLabel('em10000280') }
			,{ fieldName : "ExtentionNumber__c", label : teasp.message.getLabel('em10000290') }
			,{ fieldName : "MobilePhone__c", label : teasp.message.getLabel('em10000300') }
			,{ fieldName : "CellularPhone__c", label : teasp.message.getLabel('em10003190') }
			,{ fieldName : "Email__c", label : teasp.message.getLabel('em10000310') }
			,{ fieldName : "SalesforceUserName__c", label : teasp.message.getLabel('empUser_label') }
			,{ fieldName : "EnteringDate__c", label : teasp.message.getLabel('empEntryDate_label'), format : "date" }
		]}
		// 2.個人連絡先 = selfContactInformation
		,{ id : "selfContactInformation", label : teasp.message.getLabel('em10004590'), fields :[
			{ fieldName : "SelfPhone__c", label : teasp.message.getLabel('em10000350') }
			,{ fieldName : "SelfMobilePhone__c", label : teasp.message.getLabel('em10000360') }
			,{ fieldName : "SelfEmail__c", label : teasp.message.getLabel('em10000370') }
		]}
		// 3.個人情報 = selfInformation
		,{ id : "selfInformation", label : teasp.message.getLabel('em10000320'), fields :[
			 { fieldName : "Gender__c", label : teasp.message.getLabel('em10000330'),  convertList : true }
			,{ fieldName : "Birth__c", label : teasp.message.getLabel('em10000340'), format : "date" }
			,{ fieldName : "SpouseFlg__c", label : teasp.message.getLabel('em10004450'), convert : { "true" : teasp.message.getLabel('em10000610'), "default" : teasp.message.getLabel('em10000620') }}
			,{ fieldName : "DeductionSpouse__c", label : teasp.message.getLabel('em10004460'), convert : { "true" : teasp.message.getLabel('em10001150'), "default" : teasp.message.getLabel('em10001160') }}
			,{ fieldName : "WidowKbn__c", label : teasp.message.getLabel('em10004470'), convert : { "寡婦・寡夫" : teasp.message.getLabel('em10004510'), "特別の寡婦" : teasp.message.getLabel('em10004520') } }
			,{ fieldName : "DisabilityGrade__c", label : teasp.message.getLabel('em10000390'), convert : { 
				"第1級" : teasp.message.getLabel('em10001450'), 
				"第2級" : teasp.message.getLabel('em10001440'), "第3級" : teasp.message.getLabel('em10001430'), 
				"第4級" : teasp.message.getLabel('em10001420'), "第5級" : teasp.message.getLabel('em10001410'), 
				"第6級" : teasp.message.getLabel('em10001400'), "第7級" : teasp.message.getLabel('em10001390'), 
				"第8級" : teasp.message.getLabel('em10001380'), "第9級" : teasp.message.getLabel('em10001370'), 
				"第10級" : teasp.message.getLabel('em10001360'), "第11級" : teasp.message.getLabel('em10001350'), 
				"第12級" : teasp.message.getLabel('em10001340'), "第13級" : teasp.message.getLabel('em10001330'),
				"第14級" : teasp.message.getLabel('em10001320') }}	
			,{ fieldName : "DisabilityKbn__c", label : teasp.message.getLabel('em10004350'), convert : { "一般" : teasp.message.getLabel('em10001460'), "特別" : teasp.message.getLabel('em10004360') }}
			,{ fieldName : "HandicappedKbn__c", label : teasp.message.getLabel('em10004480'), convert : {
				"区分1" : teasp.message.getLabel('em10004530'), "区分2" : teasp.message.getLabel('em10004540'),
				"区分3" : teasp.message.getLabel('em10004550'), "区分4" : teasp.message.getLabel('em10004560'),
				"区分5" : teasp.message.getLabel('em10004570'), "区分6" : teasp.message.getLabel('em10004580') }}
			,{ fieldName : "WorkingStudent__c", label : teasp.message.getLabel('em10004490'), format : "checkbox", convert : { "true" : teasp.message.getLabel('em10004280'), "default" : teasp.message.getLabel('em10004290') } }
			,{ fieldName : "TsDisplayMyNumber__c", label : teasp.message.getLabel('em10000400'),  convertList : true } //登録済み,未登録
		]}
		// 3.住所情報 = addressInformation
		,{ id : "addressInformation", label : teasp.message.getLabel('em10000410'), fields :[
			 { fieldName : "PostalCode__c", label : teasp.message.getLabel('em10000420') }
			,{ fieldName : "State__c", label : teasp.message.getLabel('em10000430') }
			,{ fieldName : "City__c", label : teasp.message.getLabel('em10000440') }
			,{ fieldName : "Street__c", label : teasp.message.getLabel('em10000450') }
			,{ fieldName : "State_Kana__c", label : teasp.message.getLabel('em10000460') }
			,{ fieldName : "City_Kana__c", label : teasp.message.getLabel('em10000470') }
			,{ fieldName : "Street_Kana__c", label : teasp.message.getLabel('em10000480') }
			,{ fieldName : "CompanyHouse__c", label : teasp.message.getLabel('em10003200') }
			,{ fieldName : "EqualResident__c", label : teasp.message.getLabel('em10000490'), format : "checkbox", convert : { "true" : teasp.message.getLabel('em10000500'), "default" : teasp.message.getLabel('em10000510') } }
			,{ fieldName : "PostalCode_Resident__c", label : teasp.message.getLabel('em10000520') }
			,{ fieldName : "State_Resident__c", label : teasp.message.getLabel('em10000530') }
			,{ fieldName : "City_Resident__c", label : teasp.message.getLabel('em10000540') }
			,{ fieldName : "Street_Resident__c", label : teasp.message.getLabel('em10000550') }
			,{ fieldName : "State_Resident_Kana__c", label : teasp.message.getLabel('em10004390') }
			,{ fieldName : "City_Resident_Kana__c", label : teasp.message.getLabel('em10004400') }
			,{ fieldName : "Street_Resident_Kana__c", label : teasp.message.getLabel('em10004410') }
			,{ fieldName : "HeadOfFamilyName__c", label : teasp.message.getLabel('em10003210') }
			,{ fieldName : "HeadOfFamilyNameKana__c", label : teasp.message.getLabel('em10003220') }
			,{ fieldName : "Rel_HeadOfFamily__c", label : teasp.message.getLabel('em10003230') }
			,{ fieldName : "HometownFlg__c", label : teasp.message.getLabel('em10003240'), format : "checkbox", convert : { "true" : teasp.message.getLabel('em10000500'), "default" : teasp.message.getLabel('em10000510') } }
			,{ fieldName : "PostalCode_Hometown__c", label : teasp.message.getLabel('em10003250') }
			,{ fieldName : "State_Hometown__c", label : teasp.message.getLabel('em10003260') }
			,{ fieldName : "City_Hometown__c", label : teasp.message.getLabel('em10003270') }
			,{ fieldName : "Street_Hometown__c", label : teasp.message.getLabel('em10003280') }
		]}
		// 4.緊急連絡先情報 = emergencyInformation
		,{ id : "emergencyInformation", label : teasp.message.getLabel('em10003290'), fields :[
			 { fieldName : "Name_Emergency__c", label : teasp.message.getLabel('em10003300') }
			,{ fieldName : "NameKana_Emergency__c", label : teasp.message.getLabel('em10003310') }
			,{ fieldName : "Rel_Emergency__c", label : teasp.message.getLabel('em10003320') }
			,{ fieldName : "EmergencyContact__c", label : teasp.message.getLabel('em10003330') }
			,{ fieldName : "Tel_Emergency__c", label : teasp.message.getLabel('em10004220') }
			,{ fieldName : "PostalCode_Emergency__c", label : teasp.message.getLabel('em10003340') }
			,{ fieldName : "State_Emergency__c", label : teasp.message.getLabel('em10003350') }
			,{ fieldName : "City_Emergency__c", label : teasp.message.getLabel('em10003360') }
			,{ fieldName : "Street_Emergency__c", label : teasp.message.getLabel('em10003370') }
			,{ fieldName : "State_Emergency_Kana__c", label : teasp.message.getLabel('em10004420') }
			,{ fieldName : "City_Emergency_Kana__c", label : teasp.message.getLabel('em10004430') }
			,{ fieldName : "Street_Emergency_Kana__c", label : teasp.message.getLabel('em10004440') }
		]}
		// 5.出張先情報 = businessTripInformation
		,{ id : "businessTripInformation", label : teasp.message.getLabel('em10003380'), fields :[
			 { fieldName : "DestinationPostalCode__c", label : teasp.message.getLabel('em10003390') }
			,{ fieldName : "DestinationState__c", label : teasp.message.getLabel('em10003400') }
			,{ fieldName : "DestinationCity__c", label : teasp.message.getLabel('em10003410') }
			,{ fieldName : "DestinationStreet__c", label : teasp.message.getLabel('em10003420') }
			,{ fieldName : "DestinationPhone__c", label : teasp.message.getLabel('em10003430') }
		]}
		// 6.パスポート情報 = passportInformation
		,{ id : "passportInformation", label : teasp.message.getLabel('em10003440'), fields :[
			 { fieldName : "PassportName__c", label : teasp.message.getLabel('em10003450') }
			,{ fieldName : "PassportPublishCountry__c", label : teasp.message.getLabel('em10003460') }
			,{ fieldName : "PassportNo__c", label : teasp.message.getLabel('em10003470') }
			,{ fieldName : "PermanentResidence__c", label : teasp.message.getLabel('em10003480') }
			,{ fieldName : "Nationality__c", label : teasp.message.getLabel('em10003490') }
			,{ fieldName : "PassportPublishDate__c", label : teasp.message.getLabel('em10003500'), format : "date" }
			,{ fieldName : "PassportAvailable__c", label : teasp.message.getLabel('em10003510'), format : "date" }
		]}
		// 7.外国籍情報 = nationalityInformation
		,{ id : "nationalityInformation", label : teasp.message.getLabel('em10000560'), fields :[
			 { fieldName : "ResidencePeriod__c", label : teasp.message.getLabel('em10000580'), format : "date" }
			,{ fieldName : "ResidenceStatus__c", label : teasp.message.getLabel('em10000590') }
			,{ fieldName : "IsPermissionEngage__c", label : teasp.message.getLabel('em10000600'), format : "checkbox", convert : { "true" : teasp.message.getLabel('em10000610'), "default" : teasp.message.getLabel('em10000620') } }
			,{ fieldName : "PermissionEngageDetail__c", label : teasp.message.getLabel('em10000630') }
		]}
		// 8.家族情報 = dependentInformation
		,{ id : "dependentInformation", label : teasp.message.getLabel('em10003670'), relationName : "Dependents__r", fields :[
			 { fieldName : "Name", label : teasp.message.getLabel('em10003680') }
			,{ fieldName : "Name_Kana__c", label : teasp.message.getLabel('em10003690') }
			,{ fieldName : "Relation__c", label : teasp.message.getLabel('em10000670'), convertList : true }
			,{ fieldName : "OtherRelation__c", label : teasp.message.getLabel('em10000680') }
			,{ fieldName : "NotificationDate__c", label : teasp.message.getLabel('em10003520'), format : "date" }
			,{ fieldName : "DivorceBereavementKbn__c", label : teasp.message.getLabel('em10003530') }
			,{ fieldName : "Gender__c", label : teasp.message.getLabel('em10000330'), convertList : true }
			,{ fieldName : "Birth__c", label : teasp.message.getLabel('em10000340'), format : "date" }
			,{ fieldName : "Job__c", label : teasp.message.getLabel('em10000690') }
			,{ fieldName : "EqualAddress__c", label : teasp.message.getLabel('em10000700'), format : "checkbox", convert : { "true" : teasp.message.getLabel('em10000710'), "default" : teasp.message.getLabel('em10000720') } }
			,{ fieldName : "PostalCode__c", label : teasp.message.getLabel('em10000420') }
			,{ fieldName : "State__c", label : teasp.message.getLabel('em10000430') }
			,{ fieldName : "City__c", label : teasp.message.getLabel('em10000440') }
			,{ fieldName : "Street__c", label : teasp.message.getLabel('em10000450') }
			,{ fieldName : "State_Kana__c", label : teasp.message.getLabel('em10000460') }
			,{ fieldName : "City_Kana__c", label : teasp.message.getLabel('em10000470') }
			,{ fieldName : "Street_Kana__c", label : teasp.message.getLabel('em10000480') }
			,{ fieldName : "IsNonresident__c", label : teasp.message.getLabel('em10004740'), format : "checkbox", convert : { "true" : teasp.message.getLabel('em10004750'), "default" : teasp.message.getLabel('em10004760') } }
			,{ fieldName : "DependentsPhone__c", label : teasp.message.getLabel('em10003540') }
			,{ fieldName : "Income__c", label : teasp.message.getLabel('em10004230') }
			,{ fieldName : "FamilyAllowance__c", label : teasp.message.getLabel('em10004240'), convert : { "対象" : teasp.message.getLabel('em10001150'), "対象外" : teasp.message.getLabel('em10001160') } }
			,{ fieldName : "IsNationalPensionNo3__c", label : teasp.message.getLabel('em10000730'), format : "checkbox", convert : { "true" : teasp.message.getLabel('em10001150'), "default" : teasp.message.getLabel('em10001160') } } // 対象, 対象外
			,{ fieldName : "HealthInsuranceSubscription__c", label : teasp.message.getLabel('em10001900'), convert : { "対象" : teasp.message.getLabel('em10001150'), "対象外" : teasp.message.getLabel('em10001160') } }
			,{ fieldName : "SocialInsuranceDivision__c", label : teasp.message.getLabel('em10000970'), convertList : true }
			,{ fieldName : "DisabilityGrade__c", label : teasp.message.getLabel('em10000740'), convertList : true  }
			,{ fieldName : "DisabilityKbn__c", label : teasp.message.getLabel('em10004350'), convert : { "一般" : teasp.message.getLabel('em10001460'), "特別" : teasp.message.getLabel('em10004360'), "同居特別" : teasp.message.getLabel('em10004370') } }
			,{ fieldName : "TsDisplayMyNumber__c", label : teasp.message.getLabel('em10000400'), convertList : true } //登録済み,未登録
		]}
		// 9.口座情報 = accountsInformation
		,{ id : "accountsInformation", label : teasp.message.getLabel('em10003550'), relationName : "Bank__r", fields :[
			 { fieldName : "Kbn__c", label : teasp.message.getLabel('em10003560') }
			,{ fieldName : "Name", label : teasp.message.getLabel('em10003570') }
			,{ fieldName : "BankCode__c", label : teasp.message.getLabel('em10003580') }
			,{ fieldName : "BranchName__c", label : teasp.message.getLabel('em10003590') }
			,{ fieldName : "BranchCode__c", label : teasp.message.getLabel('em10003600') }
			,{ fieldName : "AccountType__c", label : teasp.message.getLabel('em10003610') }
			,{ fieldName : "AccountNo__c", label : teasp.message.getLabel('em10003620') }
			,{ fieldName : "AccountHolder__c", label : teasp.message.getLabel('em10003630') }
			,{ fieldName : "BankAccountMemo__c", label : teasp.message.getLabel('em10003650') }
			,{ fieldName : "MaximumAmount__c", label : teasp.message.getLabel('em10003660') }
			,{ fieldName : "ValidFlag__c", label : teasp.message.getLabel('em10004270'), format : "checkbox", convert : { "true" : teasp.message.getLabel('em10004280'), "default" : teasp.message.getLabel('em10004290') } }
		]}
	];

	this.readParams();

	dojo.connect( window, "resize", this.resizeEmployeeContents );

	// サーバへリクエスト送信
	teasp.manager.request(
		'loadHRMEmployee',
		this.viewParams,
		this.pouch,
		{ hideBusy : true },
		this,
		function(){
			this.displayValue();
			onSuccess();
		},
		function(event){
			onFailure(event);
		}
	);
};

/**
 * 高さ調整
 */
teasp.view.HRMEmpConfig.prototype.resizeEmployeeContents = function() {
	require(["dojo/window"], function( win ) {
		var contentsObj = dojo.byId( "employeeContents" );
		var vs = win.getBox();
		var pos = dojo.position( contentsObj );
		dojo.style( contentsObj, "height", ( ( vs.h - pos.y ) - 30 ) + "px" );
	} );
};

/**
 * 社員情報を出力(画面ヘッダー部の生成)
 */
teasp.view.HRMEmpConfig.prototype.displayValue = function(){
    var empInfoTbl = dojo.query('#expTopView td.ts-top-empinfo table');
    var empInfoCols = [
         teasp.message.getLabel('dept_label'),        // 部署
         null,
         teasp.message.getLabel('empType_label'),     // 勤務体系
         teasp.message.getLabel('empName_label')      // 社員名
    ];

    // タイトル
    dojo.query('td.ts-top-title > div.main-title').forEach(function(elem){
        elem.innerHTML = teasp.message.getLabel('em10000240'); // 社員情報
    }, this);
    dojo.query('td.ts-top-title > div.sub-title').forEach(function(elem){
        elem.innerHTML = teasp.message.getLabel('em10000250'); // 社員情報(英語)
    }, this);

    var colX = 0;
    dojo.query('td.ts-top-info-l > div', empInfoTbl[0]).forEach(function(el){
        el.innerHTML = empInfoCols[colX++] || '';
    });

    var pDiv = dojo.query('#expTopView td.ts-top-photo > div')[0];
    var photoUrl = this.pouch.getSmallPhotoUrl();
    var photoDiv = null;
    if(photoUrl){
        photoDiv = dojo.create('img', {
            src       : photoUrl,
            className : 'smallPhoto'
        }, pDiv);
    }else{
        photoDiv = dojo.create('img', {
            className : 'pp_base pp_default_photo'
        }, pDiv);
    }

    var helpLinks = dojo.query('td.ts-top-button3 > a', dojo.byId('expTopView'));
    if(helpLinks.length > 0){
        helpLinks[0].href = this.pouch.getHelpLink();
    }

    dojo.byId('empTypeName').innerHTML      = this.pouch.getEmpTypeName();
    dojo.byId('department').innerHTML       = this.pouch.getDeptName();
    dojo.byId('empName').innerHTML          = this.pouch.getName();

	this.settingButton();
	this.settingEmployee();
};

/**
 * 社員情報画面のボタン生成
 */
teasp.view.HRMEmpConfig.prototype.settingButton = function(){
	// 変更申請ボタン
	dojo.byId('changeRequest').firstChild.innerHTML = teasp.message.getLabel('em10000020');
	dojo.connect( dojo.byId('changeRequest'), 'onclick', this, function() {
		this.openChangeRequest();
	} );

	// 申請一覧ボタン
	dojo.byId('submitRequest').firstChild.innerHTML = teasp.message.getLabel('applyList_btn_title');
	dojo.connect( dojo.byId('submitRequest'), 'onclick', this, function() {
		this.openRequestList();
	} );

	// プリンタへ出力ボタン
	dojo.byId('configPrint').firstChild.innerHTML = teasp.message.getLabel('printOut_btn_title');
	dojo.connect(dojo.byId('configPrint'), 'onclick', function(){
		jPrintArea( dojo.byId( "employeeContents" ) );
		return false;
	});
};

/**
 * 画面の表示項目にTSHRから取得した値を設定する
 */
teasp.view.HRMEmpConfig.prototype.settingEmployee = function(){
	var empObj = this.pouch.getKeyObj( "HRMEmployee" );
	var contentsObj = dojo.byId( "employeeContents" );
	var navigationObj = dojo.byId( "employeeNavigation" );
	for ( var i = 0 ; i < this.employeeFieldList.length ; i++ ) {
		var categoryObj = this.employeeFieldList[i];
		var fieldsList = categoryObj.fields;
		var targetObj = empObj;
		var naviObj = dojo.create( "div", { innerHTML : categoryObj.label, className : "CategoryNavi", navigateId : categoryObj.id }, navigationObj );
		dojo.connect( naviObj, "onclick", function( eve ) { selectNavigation( eve.target, true ); event.preventDefault(); return false; } );
		var contentDivObj = dojo.create( "div", { id : "employeeInformation_" + categoryObj.id, className : " closeInfo" }, contentsObj );
		dojo.create( "div", { innerHTML : categoryObj.label, className : "CategoryLabel" }, contentDivObj );
		var tableObj = dojo.create( "table", null, dojo.create( "div", { className : "FieldList" }, contentDivObj ) );
		var trObj = dojo.create( "tr", { className: "FieldHead" }, tableObj );
		dojo.create( "th", { className : "FieldLabel", innerHTML : teasp.message.getLabel('em10001170') }, trObj ); // 項目
		if ( categoryObj.relationName ) {
			var minLength = 4;
			var length = minLength;
			if ( targetObj[categoryObj.relationName] ) {
				length = targetObj[categoryObj.relationName].records.length;
				if ( length < minLength ) length = minLength;
			}
			for ( var index = 0 ; index < length ; index++ ) {
				dojo.create( "th", { className : "FieldValue" }, trObj );
			}
			this.settingFieldList( categoryObj, tableObj, targetObj, fieldsList, length );
		}
		else {
			dojo.create( "th", { className : "FieldValue" }, trObj );
			this.settingField( tableObj, targetObj, fieldsList );
		}
	}
	dojo.create( "div", { id : "navigationCursor", innerHTML : "▶", style : "display: none;" }, navigationObj ); // ▶
};

teasp.view.HRMEmpConfig.prototype.settingField = function( tableObj, targetObj, fieldsList ) {
	for ( var i = 0 ; i < fieldsList.length ; i++ ) {
		var fieldObj = fieldsList[i];
		var value = this.settingFieldValue( targetObj, fieldObj );
		var rowClassName = i % 2 == 1 ? "odd" : "even";
		rowClassName += i == 0 ? " firstRow" : "";
		rowClassName += ( i + 1 ) == fieldsList.length ? " lastRow" : "";
		var trObj = dojo.create( "tr", { className : rowClassName }, tableObj );
		var labelObj = dojo.create( "div", null, dojo.create( "td", { className : "FieldLabel" }, trObj ) );
		var valueObj = dojo.create( "div", null, dojo.create( "td", { className : "FieldValue" }, trObj ) );
		labelObj.innerHTML = fieldObj.label;
		valueObj.innerHTML = value;
	}
};

teasp.view.HRMEmpConfig.prototype.settingFieldList = function( categoryObj, tableObj, targetObjList, fieldsList, length ) {
	for ( var i = 0 ; i < fieldsList.length ; i++ ) {
		var fieldObj = fieldsList[i];
		var rowClassName = i % 2 == 1 ? "odd" : "even";
		rowClassName += i == 0 ? " firstRow" : "";
		rowClassName += ( i + 1 ) == fieldsList.length ? " lastRow" : "";

		var trObj = dojo.create( "tr", { className : rowClassName }, tableObj );
		var labelObj = dojo.create( "div", null, dojo.create( "td", { className : "FieldLabel" }, trObj ) );
		labelObj.innerHTML = fieldObj.label;

		for ( var index = 0 ; index < length ; index++ ) {
			var value = "";
			if ( targetObjList[categoryObj.relationName] ) {
				var relationsObj = targetObjList[categoryObj.relationName];
				if ( relationsObj.records.length > index ) {
					var targetObj = relationsObj.records[index];
					value = this.settingFieldValue( targetObj, fieldObj );
				}
			}
			var valueObj = dojo.create( "div", null, dojo.create( "td", { className : "FieldValue" }, trObj ) );
			valueObj.innerHTML = value;
		}
	}
};

/**
 * 値変換
 */
teasp.view.HRMEmpConfig.prototype.settingFieldValue = function( targetObj, fieldObj ) {
	var value = "";
	var fieldRelations = fieldObj.fieldName.split( '.' );
	for ( var j = 0 ; j < fieldRelations.length ; j++ ) {
		var fieldRelation = fieldRelations[j];
		if ( j == 0 ) {
			if ( targetObj.hasOwnProperty(fieldRelation) ) {
				value = targetObj[fieldRelation];
			}
		}
		else if ( value[fieldRelation] ) {
			value = value[fieldRelation];
		}
	}
	if ( fieldObj.format ) {
		switch ( fieldObj.format ) {
			case "date":
				value = teasp.util.date.formatDate( value, 'SLA' );
				break;
		}
	}
	if ( fieldObj.convert ) {
		if ( fieldObj.convert[value] ) {
			value = fieldObj.convert[value];
		}
		else if ( fieldObj.convert["default"] ) {
			value = fieldObj.convert["default"];
		}
	}
	if ( fieldObj.empty ) {
		if(value == null
		|| value.length == 0 ) {
			value = fieldObj.empty["true"];
		} else {
			value = fieldObj.empty["false"];
		}
	}
	if ( fieldObj.convertList ) {
		value = teasp.dialog.ChangeEmp.prototype.getDispListValue(fieldObj.fieldName, value);
	}
	return value;
}

/**
 * 変更申請ボタンをクリックした時の処理
 * ・申請作成ダイアログを開く（クロージャ）
 *
 * @return {Function}
 * @this {teasp.view.HRMEmpConfig}
 */
teasp.view.HRMEmpConfig.prototype.openChangeRequest = function(){
	var req = {
		client : teasp.constant.APPLY_CLIENT_CHANGE_HRM_EMP
	};
	dojo.hitch(this, function(e){
		if(e){
			e.preventDefault();
			e.stopPropagation();
		}
		dojo.hitch(this, function(){
			teasp.manager.dialogOpen(
				'ChangeHRMEmp',
				req,
				this.pouch,
				this,
				function(flag, opt){
				}
			);
		})();
	})();
};

/**
 * 申請一覧ボタンをクリックした時の処理
 * ・申請一覧ダイアログを開く（クロージャ）
 *
 * @return {Function}
 * @this {teasp.view.HRMEmpConfig}
 */
teasp.view.HRMEmpConfig.prototype.openRequestList = function(){
	var req = {
		client : teasp.constant.APPLY_CLIENT_REQUEST_HRM_LIST
	};
	dojo.hitch(this, function(e){
		if(e){
			e.preventDefault();
			e.stopPropagation();
		}
		dojo.hitch(this, function(){
			teasp.manager.dialogOpen(
				'RequestHRMList',
				req,
				this.pouch,
				this,
				function(flag, opt){
				}
			);
		})();
	})();
};