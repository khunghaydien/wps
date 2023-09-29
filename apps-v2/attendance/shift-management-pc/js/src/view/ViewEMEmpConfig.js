teasp.provide('teasp.view.EMEmpConfig');
/**
 * EM用社員情報画面
 *
 * @constructor
 * @extends {teasp.view.Base}
 * @author 古川
 */
teasp.view.EMEmpConfig = function(){
};

teasp.view.EMEmpConfig.prototype = new teasp.view.Base();

/**
 * 画面初期化
 *
 * @param {Object} messageMap メッセージテーブル
 * @param {Function} onSuccess 正常受信時の処理
 * @param {Function} onFailure 異常受信時の処理
 */
teasp.view.EMEmpConfig.prototype.init = function(messageMap, onSuccess, onFailure){

	teasp.message.mergeLabels(globalMessages || {});
	teasp.message.mergeLabels(messageMap ? (messageMap[teasp.message.getLanguageLocaleKey()] || {}) : {});

	// 表示項目一覧
	this.employeeFieldList =
	[ { id : "employeeInformation", label : teasp.message.getLabel('em10000240'), fields :
		[ { fieldName : "EmpCode__c", label : teasp.message.getLabel('tk10000068') }
		 ,{ fieldName : "Name", label : teasp.message.getLabel('empName_label') }
		 ,{ fieldName : "EmpName_Kana__c", label : teasp.message.getLabel('em10000260') }
		 ,{ fieldName : "EmpName_Document__c", label : teasp.message.getLabel('em10000270') }
		 ,{ fieldName : "EmpName_Document_Kana__c", label : teasp.message.getLabel('em10001920') }
		 ,{ fieldName : "DepartmentId__r.DeptCode__c", label : teasp.message.getLabel('tk10000069') }
		 ,{ fieldName : "DepartmentId__r.Name", label : teasp.message.getLabel('dept_label') }
		 ,{ fieldName : "Title__c", label : teasp.message.getLabel('title_label') }
		 ,{ fieldName : "Manager__r.Name", label : teasp.message.getLabel('empManager_label') }
		 ,{ fieldName : "Phone__c", label : teasp.message.getLabel('em10000280') }
		 ,{ fieldName : "ExtentionNumber__c", label : teasp.message.getLabel('em10000290') }
		 ,{ fieldName : "MobilePhone__c", label : teasp.message.getLabel('em10000300') }
		 ,{ fieldName : "Email__c", label : teasp.message.getLabel('em10000310') }
		 ,{ fieldName : "SalesforceUserName__c", label : teasp.message.getLabel('empUser_label') }
		 ,{ fieldName : "EnteringDate__c", label : teasp.message.getLabel('empEntryDate_label'), format : "date" }
		] }
	 ,{ id : "selfInformation", label : teasp.message.getLabel('em10000320'), fields :
		[ { fieldName : "Gender__c", label : teasp.message.getLabel('em10000330'),  convertList : true }
		 ,{ fieldName : "Birth__c", label : teasp.message.getLabel('em10000340'), format : "date" }
		 ,{ fieldName : "SelfPhone__c", label : teasp.message.getLabel('em10000350') }
		 ,{ fieldName : "SelfMobilePhone__c", label : teasp.message.getLabel('em10000360') }
		 ,{ fieldName : "SelfEmail__c", label : teasp.message.getLabel('em10000370') }
		 ,{ fieldName : "EmergencyContact__c", label : teasp.message.getLabel('em10000380') }
		 ,{ fieldName : "DisabilityGrade__c", label : teasp.message.getLabel('em10000390') }
		 ,{ fieldName : "TsDisplayMyNumber__c", label : teasp.message.getLabel('em10000400'),  convertList : true } //登録済み,未登録
		] }
	 ,{ id : "addressInformation", label : teasp.message.getLabel('em10000410'), fields :
		[ { fieldName : "PostalCode__c", label : teasp.message.getLabel('em10000420') }
		 ,{ fieldName : "State__c", label : teasp.message.getLabel('em10000430') }
		 ,{ fieldName : "City__c", label : teasp.message.getLabel('em10000440') }
		 ,{ fieldName : "Street__c", label : teasp.message.getLabel('em10000450') }
		 ,{ fieldName : "State_Kana__c", label : teasp.message.getLabel('em10000460') }
		 ,{ fieldName : "City_Kana__c", label : teasp.message.getLabel('em10000470') }
		 ,{ fieldName : "Street_Kana__c", label : teasp.message.getLabel('em10000480') }
		 ,{ fieldName : "EqualResident__c", label : teasp.message.getLabel('em10000490'), format : "checkbox", convert : { "true" : teasp.message.getLabel('em10000500'), "default" : teasp.message.getLabel('em10000510') } }
		 ,{ fieldName : "PostalCode_Resident__c", label : teasp.message.getLabel('em10000520') }
		 ,{ fieldName : "State_Resident__c", label : teasp.message.getLabel('em10000530') }
		 ,{ fieldName : "City_Resident__c", label : teasp.message.getLabel('em10000540') }
		 ,{ fieldName : "Street_Resident__c", label : teasp.message.getLabel('em10000550') }
		] }
	 ,{ id : "nationalityInformation", label : teasp.message.getLabel('em10000560'), fields :
		[ { fieldName : "Nationality__c", label : teasp.message.getLabel('em10000570') }
		 ,{ fieldName : "ResidencePeriod__c", label : teasp.message.getLabel('em10000580'), format : "date" }
		 ,{ fieldName : "ResidenceStatus__c", label : teasp.message.getLabel('em10000590') }
		 ,{ fieldName : "IsPermissionEngage__c", label : teasp.message.getLabel('em10000600'), format : "checkbox", convert : { "true" : teasp.message.getLabel('em10000610'), "default" : teasp.message.getLabel('em10000620') } }
		 ,{ fieldName : "PermissionEngageDetail__c", label : teasp.message.getLabel('em10000630') }
		] }
	 ,{ id : "dependentInformation", label : teasp.message.getLabel('em10000640'), relationName : "Dependents__r", fields :
		[ { fieldName : "Name", label : teasp.message.getLabel('em10000650') }
		 ,{ fieldName : "Name_Kana__c", label : teasp.message.getLabel('em10000660') }
		 ,{ fieldName : "Relation__c", label : teasp.message.getLabel('em10000670'), convertList : true }
		 ,{ fieldName : "OtherRelation__c", label : teasp.message.getLabel('em10000680') }
		 ,{ fieldName : "Gender__c", label : teasp.message.getLabel('em10000330'), convertList : true }
		 ,{ fieldName : "Birth__c", label : teasp.message.getLabel('em10000340'), format : "date" }
		 ,{ fieldName : "Job__c", label : teasp.message.getLabel('em10000690') }
		 ,{ fieldName : "EqualAddress__c", label : teasp.message.getLabel('em10000700'), format : "checkbox", convert : { "true" : teasp.message.getLabel('em10000710'), "default" : teasp.message.getLabel('em10000720') } }
		 ,{ fieldName : "PostalCode__c", label : teasp.message.getLabel('em10000420') }
		 ,{ fieldName : "State__c", label : teasp.message.getLabel('em10000430') }
		 ,{ fieldName : "City__c", label : teasp.message.getLabel('em10000440') }
		 ,{ fieldName : "Street__c", label : teasp.message.getLabel('em10000450') }
		 ,{ fieldName : "IsNationalPensionNo3__c", label : teasp.message.getLabel('em10000730'), format : "checkbox", convert : { "true" : teasp.message.getLabel('em10001150'), "default" : teasp.message.getLabel('em10001160') } } // 対象, 対象外
		 ,{ fieldName : "DisabilityGrade__c", label : teasp.message.getLabel('em10000740'), convertList : true  }
		 ,{ fieldName : "HealthInsuranceSubscription__c", label : teasp.message.getLabel('em10001900'), convert : { "対象" : teasp.message.getLabel('em10001150'), "対象外" : teasp.message.getLabel('em10001160') } }
		 ,{ fieldName : "SocialInsuranceDivision__c", label : teasp.message.getLabel('em10000970'), convertList : true }
		 ,{ fieldName : "TsDisplayMyNumber__c", label : teasp.message.getLabel('em10000400'), convertList : true } //登録済み,未登録
		] }
	];

	this.readParams();

	dojo.connect( window, "resize", this.resizeEmployeeContents );

	// サーバへリクエスト送信
	teasp.manager.request(
		'loadEMEmployee',
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
teasp.view.EMEmpConfig.prototype.resizeEmployeeContents = function() {
	require(["dojo/window"], function( win ) {
		var contentsObj = dojo.byId( "employeeContents" );
		var vs = win.getBox();
		var pos = dojo.position( contentsObj );
		dojo.style( contentsObj, "height", ( ( vs.h - pos.y ) - 30 ) + "px" );
	} );
};

/**
 * 社員情報を出力
 */
teasp.view.EMEmpConfig.prototype.displayValue = function(){
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

teasp.view.EMEmpConfig.prototype.settingButton = function(){
	dojo.byId('changeRequest').firstChild.innerHTML = teasp.message.getLabel('em10000020'); // 変更申請
	dojo.connect( dojo.byId('changeRequest'), 'onclick', this, function() {
		this.openChangeRequest();
	} );

	dojo.byId('submitRequest').firstChild.innerHTML = teasp.message.getLabel('applyList_btn_title'); // 申請一覧
	dojo.connect( dojo.byId('submitRequest'), 'onclick', this, function() {
		this.openRequestList();
	} );

	dojo.byId('configPrint').firstChild.innerHTML = teasp.message.getLabel('printOut_btn_title'); // プリンタへ出力
	dojo.connect(dojo.byId('configPrint'), 'onclick', function(){
		jPrintArea( dojo.byId( "employeeContents" ) );
		return false;
	});
};

teasp.view.EMEmpConfig.prototype.settingEmployee = function(){
	var empObj = this.pouch.getKeyObj( "EMEmployee" );
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

teasp.view.EMEmpConfig.prototype.settingField = function( tableObj, targetObj, fieldsList ) {
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

teasp.view.EMEmpConfig.prototype.settingFieldList = function( categoryObj, tableObj, targetObjList, fieldsList, length ) {
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
teasp.view.EMEmpConfig.prototype.settingFieldValue = function( targetObj, fieldObj ) {
	var value = "";
	var fieldRelations = fieldObj.fieldName.split( '.' );
	for ( var j = 0 ; j < fieldRelations.length ; j++ ) {
		var fieldRelation = fieldRelations[j];
		if ( j == 0 ) {
			if ( targetObj[fieldRelation] ) {
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
 * 申請作成ダイアログを開く（クロージャ）
 *
 * @return {Function}
 * @this {teasp.view.EMEmpConfig}
 */
teasp.view.EMEmpConfig.prototype.openChangeRequest = function(){
	var req = {
		client   : teasp.constant.APPLY_CLIENT_CHANGE_EMP
	};
	dojo.hitch(this, function(e){
		if(e){
			e.preventDefault();
			e.stopPropagation();
		}
		dojo.hitch(this, function(){
			teasp.manager.dialogOpen(
				'ChangeEmp',
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
 * 申請	一覧ダイアログを開く（クロージャ）
 *
 * @return {Function}
 * @this {teasp.view.EMEmpConfig}
 */
teasp.view.EMEmpConfig.prototype.openRequestList = function(){
	var req = {
		client   : teasp.constant.APPLY_CLIENT_REQUEST_LIST
	};
	dojo.hitch(this, function(e){
		if(e){
			e.preventDefault();
			e.stopPropagation();
		}
		dojo.hitch(this, function(){
			teasp.manager.dialogOpen(
				'RequestList',
				req,
				this.pouch,
				this,
				function(flag, opt){
				}
			);
		})();
	})();
};