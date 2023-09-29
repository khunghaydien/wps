teasp.provide('teasp.dialog.ChangeHRMEmp');
/**
 * TSHRM用社員情報変更申請ダイアログ
 *
 * @constructor
 * @extends {teasp.dialog.Base}
 */
teasp.dialog.ChangeHRMEmp = function(){
	console.log(teasp);
	this.widthHint = 870;
	this.heightHint = 434;
	this.id = 'dialogChangeHRMEmp';
	this.title = teasp.message.getLabel('em10000000'); // 社員情報変更申請
	this.duration = 1;
	this.content = '<table id="requestEdit_DialogChangeHRMEmpTable" class="dialogApplyTable" border="0" cellspacing="0" cellpadding="0"><!--tr><td id="Request_Title"></td></tr--><tr><td><div id="ChangeRequestTable"><table style="width: 100%"><tr><td id="GroupCategory" style="display:none;"><div><select style="min-width:200px;"></select></div></td><td id="ChangeRequestInfo"></td><td style="text-align: right;"><table style="margin-left:auto;margin-right:0px;"><tbody id="Buttons"></tbody></table></td></tr><tr><td colspan="2"><table style="width: 100%;"><tbody><tr><td style="width:210px;height:400px;text-align: left; padding: 0px; vertical-align: top;"><div id="RequestView" style="height: 100%; position: relative; overflow-x: hidden"><div id="RequestEvent" style="width: 100%; position: absolute;"><table style="width: 100%;"><tbody id="RequestEventTable"></tbody></table></div><div id="RequestFlow" style="width: 100%; position: absolute;"><table style="width: 100%; height: 400px;"><tbody id="RequestFlowTable"></tbody></table></div></div></td><td style="text-align: left; padding: 0px 0px 0px 10px;"><div id="ChangeRequest"><table class="requestedit_form" style="width: 100%;"><tbody id="RequestEditForm"></tbody></table></div></td></tr></tbody></table></td></tr></table></div><div id="SubmitRequestTable"><table><tbody id="SubmitRequest"></tbody></table></div></td></tr></table>';
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
	this.isMynumberAttached = false;
	this.constInvalidValuePickListFields = []; // 無効な選択リスト値で申請が保存されていた場合に対象の項目と値を保持する(ダイアログで固定)
	this.invalidValuePickListFields = []; // 無効な選択リスト値で申請が保存されていた場合に対象の項目と値を保持する(申請・保存時の判定に利用)
	this.hasOpenedRequestFlow = false; // 初回表示時のみ無効な選択リスト値を表示するダイアログを表示するためのフラグ
	this.isPickListLimitedRelease = false; // 選択リスト値をAPIから取得する限定リリースかどうか
	if(this.activatePickListLimitedRelease) {
		// 差し込み用のスクリプトに関数が定義されている場合は実行する(フラグ有効化)
		this.activatePickListLimitedRelease();
	}
	this.OLD_PEOPLE_ENGLISH_LABEL = 'Old people'; // 選択リスト値をAPIから取得しない場合は扶養控除区分の老人に対応する英語ラベルが未定義のため暫定対応
	this.isPickListAlertInNewChangeRequest; // 〜を変更する申請において無効な選択リスト値が含まれていてアラート表示の必要があるか
	this.SECTION_LIST_TO_REMOVE_TARGET = ['RemoveAccounts']; // 削除申請に該当するセクション(フロー名)のリスト
	// 社員情報変更申請オブジェクトとマスタオブジェクトの項目API参照名に差異がある場合の対応表
	// 形式:社員情報変更申請のAPI参照名: マスタオブジェクトのAPI参照名
	this.CHANGE_REQUEST_FIELD_NAME_MAP = {
		Dependents__r : {
			DependentsDisabilityKbn__c: 'DisabilityKbn__c'
		}
	}

	this.fieldList = {
		// *** 個人番号を登録する ***
		// 1 個人番号の利用目的
		MyNumber1 : {
			 label : teasp.message.getLabel('em10000400')
			,fields : [
				{ name : "MyNumberPurposeUse", type : "label" }
			]
			,foreignKey : "1"
		}
		// 2 登録対象の選択
		,SelectTarget : {
			 label : teasp.message.getLabel('em10000820')
			,fields : [
				{ name : "SelectTarget__c", label : teasp.message.getLabel('em10000830'), type : "SelectTarget", isRequired: true }
			]
			,foreignKey : "1"
		}
		// 3 個人番号の登録
		,MyNumber : {
			 label : teasp.message.getLabel('em10000400') // 個人番号
			,fields : [
				 { name : "MyNumber__c", label : teasp.message.getLabel('em10000400'), type : "text", dataType : "String", length : 12, isRequired: true }
				,{ name : "MyNumberAttachment0", label : teasp.message.getLabel('em10000870'), type : "myNumberFile", filedescription : "1", dataType : "File", isRequired: true }
				,{ name : "MyNumberAttachmentLabel0", label : teasp.message.getLabel('tk10000110'), type : "myNumberLabel", filedescription : "1" }
				,{ name : "MyNumberAttachment1", label : teasp.message.getLabel('em10000880'), type : "myNumberFile", filedescription : "2", dataType : "File", isRequired: true }
				,{ name : "MyNumberAttachmentLabel1", label : teasp.message.getLabel('tk10000110'), type : "myNumberLabel", filedescription : "2" }
			]
			,foreignKey : "1"
		}

		// *** 氏名を変更する ***
		// 1 有効開始日を入力
		,AverableDateforName : {
			 label : teasp.message.getLabel('em10003700')
			,fields : [
				 { name : "AverableDate__c", label : teasp.message.getLabel('em10003700'), dataType : "Date", isRequired: true }
			]
			,foreignKey : "3"
		}
		// 2 変更後の氏名を入力
		,Name : {
			 label : teasp.message.getLabel('empName_label')
			,fields : [
				 { name : "EmpName_LastName__c", label : teasp.message.getLabel('em10000910'), dataType : "String", length : 80, fieldName : "LastName__c", isRequired: true }
				,{ name : "EmpName_FirstName__c", label : teasp.message.getLabel('empName_label'), dataType : "String", length : 40, fieldName : "FirstName__c" }
				,{ name : "EmpName_Kana_LastName__c", label : teasp.message.getLabel('em10000920'), dataType : "String", length : 80 }
				,{ name : "EmpName_Kana_FirstName__c", label : teasp.message.getLabel('em10000260'), dataType : "String", length : 40 }
				,{ name : "EmpName_Document_LastName__c", label : teasp.message.getLabel('em10000930'), dataType : "String", length : 80 }
				,{ name : "EmpName_Document_FirstName__c", label : teasp.message.getLabel('em10000270'), dataType : "String", length : 40 }
				,{ name : "EmpName_Document_Kana_LastName__c", label : teasp.message.getLabel('em10001910'), dataType : "String", length : 80 }
				,{ name : "EmpName_Document_Kana_FirstName__c", label : teasp.message.getLabel('em10001920'), dataType : "String", length : 40 }
				,{ name : "BusinessLastName__c", label : teasp.message.getLabel('em10003710'), dataType : "String", length : 80 }
				,{ name : "BusinessFirstName__c", label : teasp.message.getLabel('em10003720'), dataType : "String", length : 40 }
				,{ name : "BusinessLastNameKana__c", label : teasp.message.getLabel('em10003730'), dataType : "String", length : 80 }
				,{ name : "BusinessFirstNameKana__c", label : teasp.message.getLabel('em10003740'), dataType : "String", length : 40 }
				,{ name : "EmpName_English_LastName__c", label : teasp.message.getLabel('em10004330'), dataType : "String", length : 80 }
				,{ name : "EmpName_English_FirstName__c", label : teasp.message.getLabel('em10004340'), dataType : "String", length : 40 }
				,{ name : "Reason_ChangeName__c", label : teasp.message.getLabel('em10003180'), type : "TextArea", dataType : "String", length : 255 }
			]
			,foreignKey : "3"
		}
		// 3 公的証書を添付
		,PublicDeed : {
			 label : teasp.message.getLabel('em10003750')
			,fields : [
				 { name : "PublicDeed__c", label : teasp.message.getLabel('em10003750'), type : "File", filedescription : "1", dataType : "File" }
			]
			,foreignKey : "3"
		}
		// 4 再発行情報を入力
		,ReissueInfo : {
			 label : teasp.message.getLabel('em10003760')
			,fields : [
				 { name : "ReissueIdCard__c", label : teasp.message.getLabel('em10003770'), type : "SelectReissue" }
				,{ name : "ReissueNameTag__c", label : teasp.message.getLabel('em10003780'), type : "SelectReissue" }
				,{ name : "ReissueBusinessCard__c", label : teasp.message.getLabel('em10003790'), type : "SelectReissue" }
				,{ name : "ReissueRemarks__c", label : teasp.message.getLabel('em10003800'), type : "TextArea", dataType : "String", length : 255 }
			]
			,foreignKey : "3"
		}
		// *** 連絡先を変更する ***
		,Contact : {
			 label : teasp.message.getLabel('em10000850')
			,fields : [
				 { name : "AverableDate__c", label : teasp.message.getLabel('em10003700'), dataType : "Date", isRequired: true }
				,{ name : "Phone__c", label : teasp.message.getLabel('em10000280'), dataType : "String", length : 255 }
				,{ name : "ExtentionNumber__c", label : teasp.message.getLabel('em10000290'), dataType : "String", length : 80 }
				,{ name : "MobilePhone__c", label : teasp.message.getLabel('em10000300'), dataType : "String", length : 255 }
				,{ name : "CellularPhone__c", label : teasp.message.getLabel('em10003190'), dataType : "String", length : 255 }
				,{ name : "Email__c", label : teasp.message.getLabel('em10000310'), dataType : "String", length : 255 }
			]
			,foreignKey : "2"
		}
		// *** 個人用連絡先を変更する ***
		,SelfContact : {
			 label : teasp.message.getLabel('em10000860')
			,fields : [
				 { name : "AverableDate__c", label : teasp.message.getLabel('em10003700'), dataType : "Date", isRequired: true }
				,{ name : "SelfPhone__c", label : teasp.message.getLabel('em10000350'), dataType : "String", length : 255 }
				,{ name : "SelfMobilePhone__c", label : teasp.message.getLabel('em10000360'), dataType : "String", length : 255 }
				,{ name : "SelfEmail__c", label : teasp.message.getLabel('em10000370'), dataType : "String", length : 255 }
			]
			,foreignKey : "5"
		}
		// *** 住所を変更する ***
		// 1 有効開始日を入力
		,AverableDateforAddress : {
			 label : teasp.message.getLabel('em10003700')
			,fields : [
				 { name : "AverableDate__c", label : teasp.message.getLabel('em10003700'), dataType : "Date", isRequired: true }
			]
			,foreignKey : "4"
		}
		// 2 変更後の住所を入力
		,Address : {
			 label : teasp.message.getLabel('em10000410')
			,fields : [
				 { name : "PostalCode__c", label : teasp.message.getLabel('em10000420'), dataType : "String", length : 8 }
				,{ name : "State__c", label : teasp.message.getLabel('em10000430'), dataType : "String", length : 80 }
				,{ name : "City__c", label : teasp.message.getLabel('em10000440'), dataType : "String", length : 80 }
				,{ name : "Street__c", label : teasp.message.getLabel('em10000450'), type : "TextArea", dataType : "String", length : 255 }
				,{ name : "State_Kana__c", label : teasp.message.getLabel('em10000460'), dataType : "String", length : 80 }
				,{ name : "City_Kana__c", label : teasp.message.getLabel('em10000470'), dataType : "String", length : 80 }
				,{ name : "Street_Kana__c", label : teasp.message.getLabel('em10000480'), type : "TextArea", dataType : "String", length : 255 }
				,{ name : "CompanyHouse__c", label : teasp.message.getLabel('em10003200'), dataType : "String", length : 255 }
			]
			,foreignKey : "4"
		}
		// 3 変更後の住民票住所を入力
		,ResidentAddress : {
			 label : teasp.message.getLabel('em10000840')
			,fields : [
				 { name : "EqualResident__c", label : teasp.message.getLabel('em10000490'), dataType : "Boolean" }
				,{ name : "copyAddressbutton", label : ' ',buttonlabel:teasp.message.getLabel('em10004730'), type : "button", dataType : "button", eventHandlesRegisterFnc : function(_this, target){ _this.setEventHandles('flow', dojo.connect( target, 'onclick', _this, _this.copyToInputFormResidentAddressInfo ));} }
				,{ name : "PostalCode_Resident__c", label : teasp.message.getLabel('em10000520'), dataType : "String", length : 8 }
				,{ name : "State_Resident__c", label : teasp.message.getLabel('em10000530'), dataType : "String", length : 80 }
				,{ name : "City_Resident__c", label : teasp.message.getLabel('em10000540'), dataType : "String", length : 80 }
				,{ name : "Street_Resident__c", label : teasp.message.getLabel('em10000550'), type : "TextArea", dataType : "String", length : 255 }
				,{ name : "State_Resident_Kana__c", label : teasp.message.getLabel('em10004390'), dataType : "String", length : 250 }
				,{ name : "City_Resident_Kana__c", label : teasp.message.getLabel('em10004400'), dataType : "String", length : 250 }
				,{ name : "Street_Resident_Kana__c", label : teasp.message.getLabel('em10004410'), type : "TextArea", dataType : "String", length : 255 }
				,{ name : "HeadOfFamilyLastName__c", label : teasp.message.getLabel('em10003810'), dataType : "String", length : 80 }
				,{ name : "HeadOfFamilyFirstName__c", label : teasp.message.getLabel('em10003820'), dataType : "String", length : 40 }
				,{ name : "HeadOfFamilyLastNameKana__c", label : teasp.message.getLabel('em10003830'), dataType : "String", length : 80 }
				,{ name : "HeadOfFamilyFirstNameKana__c", label : teasp.message.getLabel('em10003840'), dataType : "String", length : 40 }
				,{ name : "Rel_HeadOfFamily__c", label : teasp.message.getLabel('em10003230'), dataType : "String", length : 255 }
			]
			,foreignKey : "4"
		}
		// 4 変更後の帰省先住所を入力
		,HomecomingAddress : {
			 label : teasp.message.getLabel('em10003850')
			,fields : [
				 { name : "HometownFlg__c", label : teasp.message.getLabel('em10003240'), dataType : "Boolean" }
				,{ name : "PostalCode_Hometown__c", label : teasp.message.getLabel('em10003250'), dataType : "String", length : 8 }
				,{ name : "State_Hometown__c", label : teasp.message.getLabel('em10003260'), dataType : "String", length : 80 }
				,{ name : "City_Hometown__c", label : teasp.message.getLabel('em10003270'), dataType : "String", length : 80 }
				,{ name : "Street_Hometown__c", label : teasp.message.getLabel('em10003280'), type : "TextArea", dataType : "String", length : 255 }
			]
			,foreignKey : "4"
		}
		// *** 個人情報を変更する ***
		// 1 個人情報を入力
		,PersonalInfo : {
			 label : teasp.message.getLabel('em10000320')
			,fields : [
				 { name : "AverableDate__c", label : teasp.message.getLabel('em10003700'), dataType : "Date", isRequired: true }
				,{ name : "SpouseFlg__c", label : teasp.message.getLabel('em10004450'), dataType : "Boolean" }
				,{ name : "DeductionSpouse__c", label : teasp.message.getLabel('em10004460'), dataType : "Boolean" }
				,{ name : "WidowKbn__c", label : teasp.message.getLabel('em10004470'), type : "Select", dataType : "String" }
				,{ name : "DisabilityGrade__c", label : teasp.message.getLabel('em10000390'), type : "Select", dataType : "String" }
				,{ name : "DisabilityKbn__c", label : teasp.message.getLabel('em10004350'), type : "Select", dataType : "String" }
				,{ name : "HandicappedKbn__c", label : teasp.message.getLabel('em10004480'), type : "Select", dataType : "String" }
				,{ name : "Disability__c", label : teasp.message.getLabel('em10004380'), type : "File", filedescription : "1", dataType : "File" }
				,{ name : "WorkingStudent__c", label : teasp.message.getLabel('em10004490'), dataType : "Boolean" }
				,{ name : "StudentCard__c", label : teasp.message.getLabel('em10004500'), type : "File", filedescription : "2", dataType : "File" }
			]
			,foreignKey : "16"
		}
		// *** 緊急連絡先を変更する ***
		,Emergency : {
			 label : teasp.message.getLabel('em10000380')
			,fields : [
				 { name : "AverableDate__c", label : teasp.message.getLabel('em10003700'), dataType : "Date", isRequired: true }
				,{ name : "LastName_Emergency__c", label : teasp.message.getLabel('em10003860'), dataType : "String", length : 80 }
				,{ name : "FirstName_Emergency__c", label : teasp.message.getLabel('em10003870'), dataType : "String", length : 80 }
				,{ name : "LastNameKana_Emergency__c", label : teasp.message.getLabel('em10003880'), dataType : "String", length : 80 }
				,{ name : "FirstNameKana_Emergency__c", label : teasp.message.getLabel('em10003890'), dataType : "String", length : 80 }
				,{ name : "Rel_Emergency__c", label : teasp.message.getLabel('em10003320'), dataType : "String", length : 255 }
				,{ name : "EmergencyContact__c", label : teasp.message.getLabel('em10003330'), dataType : "String", length : 255 }
				,{ name : "Tel_Emergency__c", label : teasp.message.getLabel('em10004220'), dataType : "String", length : 255 }
				,{ name : "PostalCode_Emergency__c", label : teasp.message.getLabel('em10003340'), dataType : "String", length : 8 }
				,{ name : "State_Emergency__c", label : teasp.message.getLabel('em10003350'), dataType : "String", length : 80 }
				,{ name : "City_Emergency__c", label : teasp.message.getLabel('em10003360'), dataType : "String", length : 80 }
				,{ name : "Street_Emergency__c", label : teasp.message.getLabel('em10003370'), type : "TextArea", dataType : "String", length : 255 }
				,{ name : "State_Emergency_Kana__c", label : teasp.message.getLabel('em10004420'), dataType : "String", length : 250 }
				,{ name : "City_Emergency_Kana__c", label : teasp.message.getLabel('em10004430'), dataType : "String", length : 250 }
				,{ name : "Street_Emergency_Kana__c", label : teasp.message.getLabel('em10004440'), type : "TextArea", dataType : "String", length : 255 }
			]
			,foreignKey : "6"
		}
		// *** 出張先を変更する ***
		,BusinessTrip : {
			 label : teasp.message.getLabel('em10003380')
			,fields : [
				 { name : "AverableDate__c", label : teasp.message.getLabel('em10003700'), dataType : "Date", isRequired: true }
				,{ name : "DestinationPostalCode__c", label : teasp.message.getLabel('em10003390'), dataType : "String", length : 8 }
				,{ name : "DestinationState__c", label : teasp.message.getLabel('em10003400'), dataType : "String", length : 80 }
				,{ name : "DestinationCity__c", label : teasp.message.getLabel('em10003410'), dataType : "String", length : 80 }
				,{ name : "DestinationStreet__c", label : teasp.message.getLabel('em10003420'), type : "TextArea", dataType : "String", length : 255 }
				,{ name : "DestinationPhone__c", label : teasp.message.getLabel('em10003430'), dataType : "String", length : 255 }
			]
			,foreignKey : "11"
		}
		// *** 外国籍情報を変更する ***
		// 1 有効開始日を入力
		,AverableDateforNationality : {
			 label : teasp.message.getLabel('em10003700')
			,fields : [
				 { name : "AverableDate__c", label : teasp.message.getLabel('em10003700'), dataType : "Date", isRequired: true }
			]
			,foreignKey : "7"
		}
		// 2 変更後の外国籍情報を入力
		,Nationality : {
			 label : teasp.message.getLabel('em10000560')
			,fields : [
				 { name : "ResidencePeriod__c", label : teasp.message.getLabel('em10000580'), dataType : "Date" }
				,{ name : "ResidenceStatus__c", label : teasp.message.getLabel('em10000590'), dataType : "String", length : 250 }
				,{ name : "IsPermissionEngage__c", label : teasp.message.getLabel('em10000600'), dataType : "Boolean" }
				,{ name : "PermissionEngageDetail__c", label : teasp.message.getLabel('em10000630'), type : "TextArea", dataType : "String", length : 32768 }
			]
			,foreignKey : "7"
		}
		// 3 在留カード写真を添付
		,ResidenceCard : { label : teasp.message.getLabel('em10003900')
			,fields : [
				 { name: "ResidenceCardObverse__c", label : teasp.message.getLabel('em10003910'), type : "File", filedescription : "1", dataType : "File" }
				,{ name: "ResidenceCardReverse__c", label : teasp.message.getLabel('em10003920'), type : "File", filedescription : "2", dataType : "File" }
			]
			,foreignKey : "7"
		}
		// *** パスポート情報を変更する ***
		// 1 有効開始日を入力
		,AverableDateforPassport : {
			 label : teasp.message.getLabel('em10003700')
			,fields : [
				 { name : "AverableDate__c", label : teasp.message.getLabel('em10003700'), dataType : "Date", isRequired: true }
			]
			,foreignKey : "12"
		}
		// 2 変更後のパスポート情報を入力
		,Passport : {
			 label : teasp.message.getLabel('em10003440')
			,fields : [
				  { name : "PassportLastName__c", label : teasp.message.getLabel('em10003930'), dataType : "String", length : 80 }
				 ,{ name : "PassportFirstName__c", label : teasp.message.getLabel('em10003940'), dataType : "String", length : 80 }
				 ,{ name : "PassportPublishCountry__c", label : teasp.message.getLabel('em10003460'), dataType : "String", length : 250 }
				 ,{ name : "PassportNo__c", label : teasp.message.getLabel('em10003470'), dataType : "String", length : 80 }
				 ,{ name : "PermanentResidence__c", label : teasp.message.getLabel('em10003480'), dataType : "String", length : 80 }
				 ,{ name : "Nationality__c", label : teasp.message.getLabel('em10003490'), dataType : "String", length : 80 }
				 ,{ name : "PassportPublishDate__c", label : teasp.message.getLabel('em10003500'), dataType : "Date" }
				 ,{ name : "PassportAvailable__c", label : teasp.message.getLabel('em10003510'), dataType : "Date" }
			]
			,foreignKey : "12"
		}
		// 3 パスポート写真を添付
		,PassportPic : {
			 label : teasp.message.getLabel('em10003950')
			,fields : [
				 { name : "Passport__c", label : teasp.message.getLabel('em10003950'), type : "File", filedescription : "1", dataType : "File" }
			]
			,foreignKey : "12"
		}
		// *** 家族情報を登録する ***
		// 1 有効開始日を入力
		,AverableDateforInsertDependents : {
			 label : teasp.message.getLabel('em10003700')
			,fields : [
				 { name : "AverableDate__c", label : teasp.message.getLabel('em10003700'), dataType : "Date", isRequired: true }
			]
			,foreignKey : "8"
		}
		// 2 追加する家族情報を入力
		,InsertDependents : {
			 label : teasp.message.getLabel('em10003960')
			,fields : [
				 { name : "DependentName_LastName__c", label : teasp.message.getLabel('em10003970'), dataType : "String", length : 80, fieldName : "LastName__c", isRequired: true }
				,{ name : "DependentName_FirstName__c", label : teasp.message.getLabel('em10003980'), dataType : "String", length : 40, fieldName : "FirstName__c" }
				,{ name : "DependentName_Kana_LastName__c", label : teasp.message.getLabel('em10003990'), dataType : "String", length : 80, fieldName : "Name_Kana_LastName__c" }
				,{ name : "DependentName_Kana_FirstName__c", label : teasp.message.getLabel('em10004000'), dataType : "String", length : 40, fieldName : "Name_Kana_FirstName__c" }
				,{ name : "Relation__c", label : teasp.message.getLabel('em10000670'), type : "Select", dataType : "String", isRequired: true }
				,{ name : "OtherRelation__c", label : teasp.message.getLabel('em10000680'), dataType : "String", length : 80 }
				,{ name : "NotificationDate__c", label : teasp.message.getLabel('em10003520'), dataType : "Date" }
				,{ name : "DivorceBereavementKbn__c", label : teasp.message.getLabel('em10003530'), type : "Select", dataType : "String" }
				,{ name : "Gender__c", label : teasp.message.getLabel('em10000330'), type : "Select", dataType : "String" }
				,{ name : "Birth__c", label : teasp.message.getLabel('em10000340'), dataType : "Date" }
				,{ name : "Job__c", label : teasp.message.getLabel('em10000690'), dataType : "String", length : 255 }
				,{ name : "EqualAddress__c", label : teasp.message.getLabel('em10000700'), dataType : "Boolean" }
				,{ name : "copyAddressbutton", label : ' ',buttonlabel:teasp.message.getLabel('em10004720'), type : "button", dataType : "button", eventHandlesRegisterFnc : function(_this,target){ _this.setEventHandles('flow', dojo.connect( target, 'onclick', _this, _this.copyToInputFormAddressInfo ));} }
				,{ name : "PostalCode__c", label : teasp.message.getLabel('em10000420'), dataType : "String", length : 8 }
				,{ name : "State__c", label : teasp.message.getLabel('em10000430'), dataType : "String", length : 80 }
				,{ name : "City__c", label : teasp.message.getLabel('em10000440'), dataType : "String", length : 80 }
				,{ name : "Street__c", label : teasp.message.getLabel('em10000450'), type : "TextArea", dataType : "String", length : 255 }
				,{ name : "State_Kana__c", label : teasp.message.getLabel('em10000460'), dataType : "String", length : 250 }
				,{ name : "City_Kana__c", label : teasp.message.getLabel('em10000470'), dataType : "String", length : 250 }
				,{ name : "Street_Kana__c", label : teasp.message.getLabel('em10000480'), type : "TextArea", dataType : "String", length : 255 }
				,{ name : "IsNonresident__c", label : teasp.message.getLabel('em10004740'), dataType : "Boolean" }
				,{ name : "DependentsPhone__c", label : teasp.message.getLabel('em10003540'), dataType : "String", length : 80 }
				,{ name : "Income__c", label : teasp.message.getLabel('em10004230'), type : "Integer", dataType : "String", length : 10 }
				,{ name : "FamilyAllowance__c", label : teasp.message.getLabel('em10004240'), type : "Select", dataType : "String" }
				,{ name : "IsNationalPensionNo3__c", label : teasp.message.getLabel('em10000730'), dataType : "Boolean" }
				,{ name : "HealthInsuranceSubscription__c", label : teasp.message.getLabel('em10001900'), type : "Select", dataType : "String" }
				,{ name : "SocialInsuranceDivision__c", label : teasp.message.getLabel('em10000970'), type : "Select", dataType : "String", isRequired: true}
				,{ name : "DisabilityGrade__c", label : teasp.message.getLabel('em10000740'), type : "Select", dataType : "String" }
				,{ name : "DependentsDisabilityKbn__c", label : teasp.message.getLabel('em10004350'), type : "Select", dataType : "String" }
				,{ name : "Reason__c", label : teasp.message.getLabel('em10004310'), type : "TextArea", dataType : "String", length : 255 }
			]
			,foreignKey : "8"
		}
		// 3 公的証書を添付
		,InsertSpousePublicDeed : {
			 label : teasp.message.getLabel('em10003750')
			,fields : [
				 { name : "DependentsPublicDeed__c", label : teasp.message.getLabel('em10003750'), type : "File", filedescription : "1", dataType : "File" }
				 ,{ name : "DependentsDisability__c", label : teasp.message.getLabel('em10004380'), type : "File", filedescription : "2", dataType : "File" }
			]
			,foreignKey : "8"
		}
		// *** 家族情報を変更する ***
		// 1 有効開始日を入力
		,AverableDateforUpdateDependents : {
			 label : teasp.message.getLabel('em10003700')
			,fields : [
				 { name : "AverableDate__c", label : teasp.message.getLabel('em10003700'), dataType : "Date", isRequired: true }
			]
			,foreignKey : "9"
		}
		// 2 変更後の家族情報を入力
		,UpdateDependents : {
			 label : teasp.message.getLabel('em10004010')
			,fields : [
				 { name : "SelectTarget__c", label : teasp.message.getLabel('em10004010'), type : "SelectDependents", isRequired: true }
				,{ name : "DependentName_LastName__c", label : teasp.message.getLabel('em10003970'), dataType : "String", length : 80, fieldName : "LastName__c", isRequired: true }
				,{ name : "DependentName_FirstName__c", label : teasp.message.getLabel('em10003980'), dataType : "String", length : 40, fieldName : "FirstName__c" }
				,{ name : "DependentName_Kana_LastName__c", label : teasp.message.getLabel('em10003990'), dataType : "String", length : 80, fieldName : "Name_Kana_LastName__c" }
				,{ name : "DependentName_Kana_FirstName__c", label : teasp.message.getLabel('em10004000'), dataType : "String", length : 40, fieldName : "Name_Kana_FirstName__c" }
				,{ name : "Relation__c", label : teasp.message.getLabel('em10000670'), type : "Select", dataType : "String", isRequired: true }
				,{ name : "OtherRelation__c", label : teasp.message.getLabel('em10000680'), dataType : "String", length : 80 }
				,{ name : "NotificationDate__c", label : teasp.message.getLabel('em10003520'), dataType : "Date" }
				,{ name : "DivorceBereavementKbn__c", label : teasp.message.getLabel('em10003530'), type : "Select", dataType : "String" }
				,{ name : "Gender__c", label : teasp.message.getLabel('em10000330'), type : "Select", dataType : "String" }
				,{ name : "Birth__c", label : teasp.message.getLabel('em10000340'), dataType : "Date" }
				,{ name : "Job__c", label : teasp.message.getLabel('em10000690'), dataType : "String", length : 255 }
				,{ name : "EqualAddress__c", label : teasp.message.getLabel('em10000700'), dataType : "Boolean" }
				,{ name : "copyAddressbutton", label : ' ',buttonlabel:teasp.message.getLabel('em10004720'), type : "button", dataType : "button", eventHandlesRegisterFnc : function (_this,target){ _this.setEventHandles('flow', dojo.connect( target, 'onclick', _this, _this.copyToInputFormAddressInfo ));} }
				,{ name : "PostalCode__c", label : teasp.message.getLabel('em10000420'), dataType : "String", length : 8 }
				,{ name : "State__c", label : teasp.message.getLabel('em10000430'), dataType : "String", length : 80 }
				,{ name : "City__c", label : teasp.message.getLabel('em10000440'), dataType : "String", length : 80 }
				,{ name : "Street__c", label : teasp.message.getLabel('em10000450'), type : "TextArea", dataType : "String", length : 255 }
				,{ name : "State_Kana__c", label : teasp.message.getLabel('em10000460'), dataType : "String", length : 250 }
				,{ name : "City_Kana__c", label : teasp.message.getLabel('em10000470'), dataType : "String", length : 250 }
				,{ name : "Street_Kana__c", label : teasp.message.getLabel('em10000480'), type : "TextArea", dataType : "String", length : 255 }
				,{ name : "IsNonresident__c", label : teasp.message.getLabel('em10004740'), dataType : "Boolean" }
				,{ name : "DependentsPhone__c", label : teasp.message.getLabel('em10003540'), dataType : "String", length : 80 }
				,{ name : "Income__c", label : teasp.message.getLabel('em10004230'), type : "Integer", dataType : "String", length : 10 }
				,{ name : "FamilyAllowance__c", label : teasp.message.getLabel('em10004240'), type : "Select", dataType : "String" }
				,{ name : "IsNationalPensionNo3__c", label : teasp.message.getLabel('em10000730'), dataType : "Boolean" }
				,{ name : "HealthInsuranceSubscription__c", label : teasp.message.getLabel('em10001900'), type : "Select", dataType : "String" }
				,{ name : "SocialInsuranceDivision__c", label : teasp.message.getLabel('em10000970'), type : "Select", dataType : "String", isRequired: true }
				,{ name : "DisabilityGrade__c", label : teasp.message.getLabel('em10000740'), type : "Select", dataType : "String" }
				,{ name : "DependentsDisabilityKbn__c", label : teasp.message.getLabel('em10004350'), type : "Select", dataType : "String" }
				,{ name : "Reason__c", label : teasp.message.getLabel('em10004310'), type : "TextArea", dataType : "String", length : 255 }
			]
			,foreignKey : "9"
		}
		// 3 公的証書を添付
		,UpdateSpousePublicDeed : {
			 label : teasp.message.getLabel('em10003750')
			,fields : [
				 { name : "DependentsPublicDeed__c", label : teasp.message.getLabel('em10003750'), type : "File", filedescription : "1", dataType : "File" }
				,{ name : "DependentsDisability__c", label : teasp.message.getLabel('em10004380'), type : "File", filedescription : "2", dataType : "File" }
			]
			,foreignKey : "9"
		}
		// *** 家族情報を削除する ***
//		,DeleteDependents : {
//			 label : teasp.message.getLabel('em10004020')
//			,fields : [
//				 { name : "AverableDate__c", label : teasp.message.getLabel('em10003700'), dataType : "Date", isRequired: true }
//				,{ name : "SelectTarget__c", label : teasp.message.getLabel('em10004020'), type : "SelectDependents", isRequired: true }
//			]
//		}
		// *** 口座情報を登録する ***
		// 1 有効開始日を入力
		,AverableDateforInsertAccounts : {
			 label : teasp.message.getLabel('em10003700')
			,fields : [
				 { name : "AverableDate__c", label : teasp.message.getLabel('em10003700'), dataType : "Date", isRequired: true }
			]
			,foreignKey : "13"
		}
		// 2 追加する口座情報を入力
		,InsertAccounts : {
			 label : teasp.message.getLabel('em10003550')
			,fields : [
				 { name : "Kbn__c", label : teasp.message.getLabel('em10003560'), type : "Select", dataType : "String", isRequired: true }
				,{ name : "BankName__c", label : teasp.message.getLabel('em10003570'), dataType : "String", length : 80, fieldName : "Name", isRequired: true }
				,{ name : "BankCode__c", label : teasp.message.getLabel('em10003580'), dataType : "String", length : 80 }
				,{ name : "BranchName__c", label : teasp.message.getLabel('em10003590'), dataType : "String", length : 80 }
				,{ name : "BranchCode__c", label : teasp.message.getLabel('em10003600'), dataType : "String", length : 80 }
				,{ name : "AccountType__c", label : teasp.message.getLabel('em10003610'), type : "Select", dataType : "String" }
				,{ name : "AccountNo__c", label : teasp.message.getLabel('em10003620'), dataType : "String", length : 80 }
				,{ name : "AccountHolder__c", label : teasp.message.getLabel('em10003630'), dataType : "String", length : 80 }
				,{ name : "BankAccountMemo__c", label : teasp.message.getLabel('em10003650'), type : "TextArea", dataType : "String", length : 255 }
				,{ name : "MaximumAmount__c", label : teasp.message.getLabel('em10003660'), type : "Integer", dataType : "String", length : 17 }
			]
			,foreignKey : "13"
		}
		// 3 口座証明書類を添付
		,InsertAccountDocs : {
			 label : teasp.message.getLabel('em10004030')
			,fields : [
				 { name: "BankAccountsDocument__c", label : teasp.message.getLabel('em10004030'), type : "File", filedescription : "1", dataType : "File" }
//				,{ name : "BankAccountsDoclabel", label : teasp.message.getLabel('em10004030'), type : "accoutLabel", filedescription : "1"}
			]
			,foreignKey : "13"
		}
		// *** 口座情報を変更する ***
		// 1 有効開始日を入力
		,AverableDateforUpdateAccounts : {
			 label : teasp.message.getLabel('em10003700')
			,fields : [
				 { name : "AverableDate__c", label : teasp.message.getLabel('em10003700'), dataType : "Date", isRequired: true }
			]
			,foreignKey : "14"
		}
		// 2 変更後の口座情報を入力
		,UpdateAccounts : {
			 label : teasp.message.getLabel('em10004040')
			,fields : [
				 { name : "SelectTarget__c", label : teasp.message.getLabel('em10004040'), type : "SelectAccounts", isRequired: true }
				,{ name : "Kbn__c", label : teasp.message.getLabel('em10003560'), type : "Select", dataType : "String", isRequired: true }
				,{ name : "BankName__c", label : teasp.message.getLabel('em10003570'), dataType : "String", length : 80, fieldName : "Name", isRequired: true }
				,{ name : "BankCode__c", label : teasp.message.getLabel('em10003580'), dataType : "String", length : 80 }
				,{ name : "BranchName__c", label : teasp.message.getLabel('em10003590'), dataType : "String", length : 80 }
				,{ name : "BranchCode__c", label : teasp.message.getLabel('em10003600'), dataType : "String", length : 80 }
				,{ name : "AccountType__c", label : teasp.message.getLabel('em10003610'), type : "Select", dataType : "String" }
				,{ name : "AccountNo__c", label : teasp.message.getLabel('em10003620'), dataType : "String", length : 80 }
				,{ name : "AccountHolder__c", label : teasp.message.getLabel('em10003630'), dataType : "String", length : 80 }
				,{ name : "BankAccountMemo__c", label : teasp.message.getLabel('em10003650'), type : "TextArea", dataType : "String", length : 255 }
				,{ name : "MaximumAmount__c", label : teasp.message.getLabel('em10003660'), type : "Integer", dataType : "String", length : 17 }
			]
			,foreignKey : "14"
		}
		// 3 口座証明書類を添付
		,UpdateAccountDocs : {
			 label : teasp.message.getLabel('em10004030')
			,fields : [
				 { name: "BankAccountsDocument__c", label : teasp.message.getLabel('em10004030'), type : "File", filedescription : "1", dataType : "File" }
//				,{ name : "BankAccountsDoclabel", label : teasp.message.getLabel('em10004030'), type : "accoutLabel", filedescription : "1"}
			]
			,foreignKey : "14"
		}
		// *** 口座情報を削除する ***
		,RemoveAccounts : {
			 label : teasp.message.getLabel('em10004050')
			,fields : [
				 { name : "AverableDate__c", label : teasp.message.getLabel('em10003700'), dataType : "Date", isRequired: true }
				,{ name : "SelectTarget__c", label : teasp.message.getLabel('em10004050'), type : "SelectAccounts", isRequired: true }
			]
			,foreignKey : "15"
		}
	};
};

teasp.dialog.ChangeHRMEmp.prototype = new teasp.dialog.Base();

/**
 * 選択リスト値の設定
 */
teasp.dialog.ChangeHRMEmp.prototype.getOptionsList = function(){
	var opList;
	// 限定リリースかどうかで選択リスト値の定義の取得を切り替える
	if(this.isPickListLimitedRelease) {
		// APIを通じてHRMから取得した選択リスト値定義
		opList = this.getMaster('pickList');

		// 個人番号登録の申請において表示用に利用するため追加
		opList.TsDisplayMyNumber__c = [
			{ value : "登録済み" , label : teasp.message.getLabel('em10001640') }
			,{ value : "未登録", label : teasp.message.getLabel('em10001650') }
		];

	} else {
		// 一般リリースの場合
		opList = {
			// 家族情報：続柄
			Relation__c : [
				 { value : "妻", label : teasp.message.getLabel('em10001180') }
				,{ value : "夫", label : teasp.message.getLabel('em10001190') }
				,{ value : "子", label : teasp.message.getLabel('em10001200') }
				,{ value : "父", label : teasp.message.getLabel('em10001210') }
				,{ value : "母", label : teasp.message.getLabel('em10001220') }
				,{ value : "祖父", label : teasp.message.getLabel('em10001230') }
				,{ value : "祖母", label : teasp.message.getLabel('em10001240') }
				,{ value : "兄", label : teasp.message.getLabel('em10001250') }
				,{ value : "弟", label : teasp.message.getLabel('em10001260') }
				,{ value : "姉", label : teasp.message.getLabel('em10001270') }
				,{ value : "妹", label : teasp.message.getLabel('em10001280') }
				,{ value : "その他", label : teasp.message.getLabel('em10001290') }
			]
			// 家族情報：性別
			,Gender__c : [
				 { value : "", label : "" }
				,{ value : "女性"	, label : teasp.message.getLabel('em10001310') }
				,{ value : "男性"	, label : teasp.message.getLabel('em10001300') }
			]
			// 家族情報：障害等級、個人情報を変更する：障害等級
			,DisabilityGrade__c : [
				 { value : "", label : "" }
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
			// 家族情報： 障害者控除区分
			,DependentsDisabilityKbn__c : [
				 { value : "", label : "" }
				,{ value : "一般", label : teasp.message.getLabel('em10001460') }
				,{ value : "特別", label : teasp.message.getLabel('em10004360') }
				,{ value : "同居特別", label : teasp.message.getLabel('em10004370') }
			]
			// 家族情報：扶養控除区分
			,SocialInsuranceDivision__c : [
				 { value : "対象外", label : teasp.message.getLabel('em10001490') }
				,{ value : "一般", label : teasp.message.getLabel('em10001460') }
				,{ value : "特定", label : teasp.message.getLabel('em10001470') }
				,{ value : "同居老親等", label : teasp.message.getLabel('em10004190') }
				,{ value : "同居老親等以外の者", label : teasp.message.getLabel('em10004200') }
				,{ value : "配偶者特別控除", label : teasp.message.getLabel('em10004210') }
				//,{ value : "老人", label : teasp.message.getLabel('em10001480') }
			]
			// 家族情報：健康保険加入対象
			,HealthInsuranceSubscription__c : [
				 { value : "", label : "" }
				,{ value : "対象", label : teasp.message.getLabel('em10001150') }
				,{ value : "対象外", label : teasp.message.getLabel('em10001160') }
			]
			// 家族情報：結婚離婚死別区分
			,DivorceBereavementKbn__c : [
				 { value : "", label : "" }
				,{ value : "結婚", label : teasp.message.getLabel('em10004080') }
				,{ value : "離縁", label : teasp.message.getLabel('em10004090') }
				,{ value : "死別", label : teasp.message.getLabel('em10004100') }
				,{ value : "失踪", label : teasp.message.getLabel('em10004110') }
			]
			// 家族情報：家族手当
			,FamilyAllowance__c : [
				 { value : "", label : "" }
				,{ value : "対象", label : teasp.message.getLabel('em10001150') }
				,{ value : "対象外", label : teasp.message.getLabel('em10001160') }
			]
			// 個人番号
			,TsDisplayMyNumber__c : [
				 { value : "登録済み" , label : teasp.message.getLabel('em10001640') }
				,{ value : "未登録", label : teasp.message.getLabel('em10001650') }
			]
			// 氏名を変更する：社員証再発行
			,ReissueIdCard__c : [
				 { value : "", label : "" }
				,{ value : "不要", label : teasp.message.getLabel('em10004070') }
				,{ value : "必要" , label : teasp.message.getLabel('em10004060') }
			]
			// 氏名を変更する：名札再発行
			,ReissueNameTag__c : [
				 { value : "", label : "" }
				,{ value : "不要", label : teasp.message.getLabel('em10004070') }
				,{ value : "必要" , label : teasp.message.getLabel('em10004060') }
			]
			// 氏名を変更する：名刺再発行
			,ReissueBusinessCard__c : [
				 { value : "", label : "" }
				,{ value : "不要", label : teasp.message.getLabel('em10004070') }
				,{ value : "必要" , label : teasp.message.getLabel('em10004060') }
			]
			// 口座情報：区分
			,Kbn__c : [
				 { value : "給与", label : teasp.message.getLabel('em10004120') }
				,{ value : "賞与" , label : teasp.message.getLabel('em10004130') }
				,{ value : "経費" , label : teasp.message.getLabel('em10004140') }
				,{ value : "キャッシュレス" , label : teasp.message.getLabel('em10004150') }
				,{ value : "その他" , label : teasp.message.getLabel('em10004160') }
			]
			// 口座情報：口座種別
			,AccountType__c : [
				 { value : "", label : "" }
				,{ value : "普通", label : teasp.message.getLabel('em10004170') }
				,{ value : "当座" , label : teasp.message.getLabel('em10004180') }
			]
			// 個人情報を変更する：寡婦・寡夫区分
			,WidowKbn__c : [
				 { value : "", label : "" }
				,{ value : "寡婦・寡夫", label : teasp.message.getLabel('em10004510') }
				,{ value : "特別の寡婦" , label : teasp.message.getLabel('em10004520') }
			]
			// 個人情報を変更する：障害者控除区分
			,DisabilityKbn__c : [
				 { value : "", label : "" }
				,{ value : "一般", label : teasp.message.getLabel('em10001460') }
				,{ value : "特別", label : teasp.message.getLabel('em10004360') }
			]
			// 個人情報を変更する：障害支援区分
			,HandicappedKbn__c : [
				 { value : "", label : "" }
				,{ value : "区分1", label : teasp.message.getLabel('em10004530') }
				,{ value : "区分2" , label : teasp.message.getLabel('em10004540') }
				,{ value : "区分3" , label : teasp.message.getLabel('em10004550') }
				,{ value : "区分4" , label : teasp.message.getLabel('em10004560') }
				,{ value : "区分5" , label : teasp.message.getLabel('em10004570') }
				,{ value : "区分6" , label : teasp.message.getLabel('em10004580') }
			]
		};
	}

	return opList;
};

/**
 * @override
 */
teasp.dialog.ChangeHRMEmp.prototype.ready = function(){
	this.client	   = this.args.client;
	this.loadRequestId = this.args.requestId;
	this.firstForeignKey = this.args.firstForeignKey;
};

/**
 * @override
 */
teasp.dialog.ChangeHRMEmp.prototype.preInit = function(){
	require(["dijit/layout/TabContainer", "dijit/layout/ContentPane", "dijit/Tooltip"]);
	dojo.require( "dojo.fx" );
};

/**
 * ダイアログ画面生成
 * @override
 */
teasp.dialog.ChangeHRMEmp.prototype.preStart = function(){
	// キャンセルボタン押下時の処理とダイアログの×ボタンの処理を共通化
	dojo.connect(this.dialog, 'onCancel', this, function() { this.onfinishfunc(); this.close(); });

	// ダイアログのサイズや背景色の設定
	dojo.style( dojo.byId( 'requestEdit_DialogChangeHRMEmpTable' ), "width", "870px" );
	dojo.style( dojo.byId( 'requestEdit_DialogChangeHRMEmpTable' ), "height", "420px" );
	dojo.query('.dijitDialogPaneContent', this.dialog.domNode).forEach( function( elem ) {
		dojo.style( elem, "background", "#F0F0E1" );
	} );

	// 申請・削除・キャンセルボタン表示エリア
	var tbody = dojo.byId( "Buttons" );
	var tr = dojo.create( "tr", null, tbody );
	var cc = dojo.create( "td", null, tr );

	// 申請ボタン
	cc	= dojo.create( "td",  { id: 'requestEventForm_SubmitBtn' }, tr );
	div = dojo.create( 'div', { innerHTML: teasp.message.getLabel('em10000980') }
		, dojo.create( 'button', { className: 'std-button1-disabled', style: { margin: "4px 2px" }, disabled: true }, cc ) );
	dojo.connect(cc.firstChild, "onclick", this, this.submitRequestEvent);

	// 削除ボタン
	cc	= dojo.create( "td",  { id: 'requestEventForm_DeleteBtn' }, tr );
	div = dojo.create( 'div', { innerHTML: teasp.message.getLabel('tf10005040') }
		, dojo.create( 'button', { className: 'red-button1-disabled', style: { margin: "4px 2px" }, disabled: true }, cc ) );
	dojo.connect(cc.firstChild, "onclick", this, this.deleteRequestEvent);

	// キャンセルボタン
	cc	= dojo.create( "td",  { id: 'requestEventForm_CancelBtn' }, tr );
	div = dojo.create( 'div', { innerHTML: teasp.message.getLabel('cancel_btn_title') }
		, dojo.create( 'button', { className: 'std-button1 gry-button1', style: { margin: "4px 2px" } }, cc ) );
	dojo.connect(cc.firstChild, "onclick", this, function() { this.onfinishfunc(); this.close(); });

	// 申請フォームエリア（入力項目を表示するエリア）
	tbody = dojo.byId( "RequestEditForm" );
	tr	= dojo.create( "tr", null, tbody );
	cc	= dojo.create( "td", { colSpan : 5 }, tr );
	div = dojo.create( "div", { style : "height: 340px; overflow-y: auto;" }, cc );
	dojo.create( "tbody", { id : "requestEditForm_tbody" }, dojo.create( "table", { className : "pane_table" }, div ) );

	tbody = dojo.byId( "RequestEditForm" );
	tr = dojo.create( "tr", null, tbody );
	cc = dojo.create( "td", null, tr );
	tr = dojo.create( "tr", null, dojo.create( "tbody", null, dojo.create( "table", { style:'margin-left:auto;margin-right:0px;' }, cc ) ) );

	// 保存ボタン
	cc	= dojo.create( "td",  { style : "display:none;", id: 'requestFlowForm_SaveBtn' }, tr );
	div = dojo.create( 'div', { innerHTML: teasp.message.getLabel('tk10000289') }
		, dojo.create( 'button', { className: 'std-button1', style: { margin: "4px 2px" } }, cc ) );
	dojo.connect(cc.firstChild, "onclick", this, function() { this.saveRequestFlow( false ); });

	// 保存＆次へボタン
	cc	= dojo.create( "td",  { style : "display:none;", id: 'requestFlowForm_SaveNextBtn' }, tr );
	div = dojo.create( 'div', { innerHTML: teasp.message.getLabel('em10000990') }
		, dojo.create( 'button', { className: 'std-button1', style: { margin: "4px 2px" } }, cc ) );
	dojo.connect(cc.firstChild, "onclick", this, function() { this.saveRequestFlow( true ); });

	// 次へボタン
	cc	= dojo.create( "td",  { style : "display:none;", id: 'requestFlowForm_NextBtn' }, tr );
	div = dojo.create( 'div', { innerHTML: teasp.message.getLabel('next_btn_title') }
		, dojo.create( 'button', { className: 'std-button1', style: { margin: "4px 2px" } }, cc ) );
	dojo.connect(cc.firstChild, "onclick", this, this.nextRequestFlow);
};

/**
 * ダイアログの初期化処理？
 * @override
 */
teasp.dialog.ChangeHRMEmp.prototype.preShow = function() {

	// グループの内容をクリア
	dojo.empty(dojo.query('#GroupCategory select')[0]);

	// イベントの内容をクリア
	// 申請メニューを初期化
	dojo.empty(dojo.byId('RequestEventTable'));

	// フローの内容をクリア
	// 申請メニュー選択後のフローメニューを初期化
	dojo.empty(dojo.byId('RequestFlowTable' ));

	// 申請内容、申請日時、状態表示をクリア
	// true = グループリスト等を非表示にする
	this.clearInfoArea(true);

	// 申請フォームエリア（入力項目を表示するエリア）クリア
	dojo.empty(dojo.byId( "requestEditForm_tbody" ));

	// 社員情報を取得
	this.employee = this.getMaster("HRMEmployee");

	this.showEvent = null;
	this.showFlow = null;
	this.requestCache = null;
	this.saveBtnDwnFlg = false;
	this.mskMyNumber = null;

	// ダイアログのボタンの表示可否制御
	this.settingVisibleEventButton();

	return true;
};

/**
 * 申請内容、申請日時、状態表示をクリア
 * @param {boolean} flag trueなら、グループのプルダウンを非表示にして属性エリアを表示
 */
teasp.dialog.ChangeHRMEmp.prototype.clearInfoArea = function(flag) {

	// 申請内容、申請日時、状態表示エリアをクリア
	var infoArea = dojo.byId('ChangeRequestInfo');
	dojo.empty(infoArea);

	if (flag) {
		dojo.style('GroupCategory', 'display', 'none');
		dojo.style(infoArea 	  , 'display', '');
	}
};

/**
 *
 * @override
 */
teasp.dialog.ChangeHRMEmp.prototype.postShow = function(){

	// 前回のイベントハンドルをクリアする
	this.clearEventHandles();

	// 諸届定義、変更申請情報、HRM設定を取得
	this.getRequestTemplate();

	// 添付ファイルアップロード後の処理を割り当て
	globalAttachedEvent = dojo.hitch(this, this.attachedEvent);
};

/**
 * 諸届定義、変更申請情報、HRM設定を取得
 */
teasp.dialog.ChangeHRMEmp.prototype.getRequestTemplate = function() {
	teasp.manager.dialogOpen('BusyWait');
	teasp.manager.request(
		'getHRMEmployeeMaster',
		[ this.loadRequestId ],
		this.pouch,
		{ hideBusy : false },
		this,
		function(obj) {
			this.setMaster(obj);
			// HRMから取得した選択リスト定義を格納
			this.optionsList = this.getOptionsList();
			var info = this.getRequestInfo();

			// info.EventId__c = TSHRMの諸届定義Id
			if (!info.Id || info.EventId__c) {

				// 申請選択時のイベント設定
				this.createRequestTemplate();

				// 申請メニューとフローの切り替え処理
				this.swapEventFlow( true, false );

				this.loadRequestFlowParts();

				// 外部キーが指定されていた場合は、その外部キーを持つ申請を表示する
				if (this.firstForeignKey) {
					this.openRequestEventFromForeignKey(this.firstForeignKey);
				}

				teasp.manager.dialogClose('BusyWait');
			} else {
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
 * getHRMEmployeeMaster()で取得する申請情報（request = HRM社員情報変更申請, setting = HRM設定, events = HRM諸届定義情報）
 * @param {Object} obj
 */
teasp.dialog.ChangeHRMEmp.prototype.setMaster = function(obj) {
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
			name  : masterName,
			foreignKey : ge.ForeignKey__c
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
	this.master["pickList"] = this.master.pickList[0];
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
 * 申請情報を取得（request = HRM社員情報変更申請, setting = HRM設定, events = HRM諸届定義情報）
 * @param {string} key
 * @returns {*}
 */
teasp.dialog.ChangeHRMEmp.prototype.getMaster = function(key) {
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
teasp.dialog.ChangeHRMEmp.prototype.initRequestCache = function(requestObj, eventObj) {

	// this.getMaster( "sessionInfo" ).emp.id = TSの勤怠社員Id
	// this.employee.Id = TSHRMの社員情報Id
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

	if (requestObj) {
		this.requestCache.EventRequestId = requestObj.Id;	// TSの社員情報変更申請Id
		this.requestCache.EventId = requestObj.HRMEventId__c;	// TS側のTSHRM諸届定義Id
		this.requestCache._status = (requestObj.TSHRM && requestObj.TSHRM.Status__c) || null;	// TS側の社員情報変更申請ステータス

		// ステータスが承認待ち or 承認済み
		if(teasp.constant.STATUS_FIX.contains(this.requestCache._status)){
			this.requestCache._readOnly = true;
		}

		// fb = 社員情報変更申請の項目ごとの入力値
		var fb = (requestObj.TSHRM && requestObj.TSHRM.FlowBody__c) || requestObj.FlowBody__c || null;
		if (fb) {
			try{
				this.requestCache.FlowBody = dojo.fromJson(fb);
			} catch(e) {}
		}

		// 諸届の添付ファイル処理（個人番号以外）
		//var attaches = (requestObj.TSHRM && requestObj.TSHRM.Attachments && requestObj.TSHRM.Attachments.records) || [];
		var attaches = (requestObj.TSHRM && requestObj.TSHRM.Attachments) || [];
		for (var i = 0 ; i < attaches.length ; i++) {
			var attach = attaches[i];
			if (attach.Description) {
				this.requestCache._attached[attach.Description] = attach;
			}
		}

		var mnAttachements = (requestObj.TSHRM && requestObj.TSHRM.MyNumberAttachments && requestObj.TSHRM.MyNumberAttachments) || null;
		if (mnAttachements) {
			for (var index = 0 ; index < mnAttachements.length ; index++) {
				var mnAttache = mnAttachements[index];
				if(mnAttache && mnAttache.Type){
					this.requestCache._mnAttached[mnAttache.Type] = mnAttache;
				}
			}
		}

	} else if (eventObj) {
		this.requestCache.EventId = eventObj.id;
	}
	this.storeRequiredAttach();
};

/**
 * ファイル添付が必須の項目を探して記憶
 */
teasp.dialog.ChangeHRMEmp.prototype.storeRequiredAttach = function() {
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
teasp.dialog.ChangeHRMEmp.prototype.isLackAttach = function(req) {
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
 * HRM社員情報変更申請を取得
 * @returns {Object}
 */
teasp.dialog.ChangeHRMEmp.prototype.getRequestInfo = function() {
	var requestObj = this.getMaster("request");
	return (requestObj && requestObj.TSHRM) || {};
};

teasp.dialog.ChangeHRMEmp.prototype.getApplyDatetime = function( status ) {
	var requestObj = this.getMaster("request");
	var dt = (requestObj && requestObj.ApplyDatetime__c);
	if(	!dt
	&& requestObj
	&& requestObj.TSHRM
	&& (teasp.constant.STATUS_FIX.contains(status)
	|| teasp.constant.STATUS_REJECTS.contains(status) )
	&& requestObj.TSHRM.ApplyDatetime__c) {
		dt = moment(requestObj.TSHRM.ApplyDatetime__c.replace('T', ' '));
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
teasp.dialog.ChangeHRMEmp.prototype.getProcessInstanceStep = function() {
	var requestObj = this.getMaster("request");
	return teasp.logic.convert.convTSEMApplySteps((requestObj && requestObj.TSHRM && requestObj.TSHRM.ProcessInstanceStep) || []);
};

/**
 * リクエスト情報を返す
 * @param {boolean} flag trueの場合、クローンを作って返す
 * @returns {Object}
 */
teasp.dialog.ChangeHRMEmp.prototype.getRequestCache = function(flag) {
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
teasp.dialog.ChangeHRMEmp.prototype.setApiName = function(name, alias) {
	if(name && alias){
		this.requestCache._alias[name] = alias;
	}
};

/**
 * API名（別名）を返す。API名がなければ引数をそのまま返す
 * @param {string} name
 * @returns {string}
 */
teasp.dialog.ChangeHRMEmp.prototype.getApiName = function(name) {
	return this.requestCache._alias[name] || name;
};

/**
 * 保存済みか
 * 保存済み＝添付ファイルをアップロードできる
 * @returns {boolean}
 */
teasp.dialog.ChangeHRMEmp.prototype.isSaved = function() {
	return (this.requestCache && this.requestCache.EventRequestId);
};

/**
 * 個人番号関連資料をアップロードできるか
 * （リクエストID!=nullなら、保存済みということでアップロードできる）
 * @returns {Object}
 */
teasp.dialog.ChangeHRMEmp.prototype.isMyNumberAttachable = function() {
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
teasp.dialog.ChangeHRMEmp.prototype.isLock = function() {
	return (this.requestCache
		&& this.requestCache.EventRequestId
		&& teasp.constant.STATUS_FIX.contains(this.requestCache._status));
};

/**
 * 申請できるか
 * @returns {boolean}
 */
teasp.dialog.ChangeHRMEmp.prototype.canRequest = function() {
	if (!this.showEvent || !this.requestCache || !this.requestCache.EventRequestId || this.isLock()) {
		return false;
	}

	for (var i = 0 ; i < this.showEvent.flows.length ; i++) {
		var flow = this.showEvent.flows[i];

		// 必須フローが保存されてない場合は申請不可
		if(flow.isRequired && !this.isFlowSaved(i)){
			return false;
		}
	}

	// 必須のファイル添付がない
	if (this.isLackAttach()) {
		return false;
	}

	return true;
};

/**
 * 削除できるか
 * @returns {Boolean}
 */
teasp.dialog.ChangeHRMEmp.prototype.canDelete = function() {
	return (this.requestCache
		&& this.requestCache.EventRequestId
		&& !teasp.constant.STATUS_FIX.contains(this.requestCache._status));
};

/**
 * 申請取消できるか
 * @returns {boolean}
 */
teasp.dialog.ChangeHRMEmp.prototype.canCancel = function() {
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
teasp.dialog.ChangeHRMEmp.prototype.getAttachObj = function(description) {
	return (this.requestCache && this.requestCache._attached && this.requestCache._attached[description]) || null;
};

/**
 * 個人番号用の添付ファイルの情報を返す
 * @param {string} description
 * @returns {boolean}
 */
teasp.dialog.ChangeHRMEmp.prototype.getMnAttachObj = function(description) {
	return (this.requestCache && this.requestCache._mnAttached && this.requestCache._mnAttached[description]) || null;
};

/**
 * 保存を行ったことを記録する
 * @param {number} index
 * @param {Object=} req
 */
teasp.dialog.ChangeHRMEmp.prototype.setFlowSaved = function(index, req) {
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
 * @param {number} index = フロー番号
 * @param {Object=} req =
 * @returns {Boolean} true = 保存済み、false = 未保存
 */
teasp.dialog.ChangeHRMEmp.prototype.isFlowSaved = function(index, req) {
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
teasp.dialog.ChangeHRMEmp.prototype.canFlowSave = function(changed){

	//必須項目が空の場合は保存不可
	if (this.isLack()) {
		//return false;
		return -1
	}

	// フロー未保存、入力内容に変更がある場合は保存可能
	if ((this.showFlow && !this.isFlowSaved(this.showFlow.index)) || changed) {
		//return true;
		return 1;
	}

	//return false;
	return 0
};

/**
 * 保存値または元の値を返す(flow単位)
 * @param {flow} flow
 * @returns {object}
 */
teasp.dialog.ChangeHRMEmp.prototype.getOrgValueMap = function (flow) {
	if (this.requestCache && this.requestCache.FlowBody) {
		return this.requestCache.FlowBody;
	}
	var org = {};
	var fields = [];

	// flowに含まれる項目一覧を抽出
	flow.flowParts.forEach(function (flowPart) {
		this.fieldList[flowPart.showSection].fields.forEach(function (field) {
			fields.push(field);
		}, this);
	}, this);

	// 項目名, dataType, value を返却値に格納
	fields.forEach(function (field) {
		if (this.employee.hasOwnProperty(field.name)) {
			org[field.name] = {
				dataType: field.dataType,
				value: this.employee[field.name]
			};
		}
	}, this);

	return org;
};

/**
 * 保存値または元の値を返す
 * @param {string} fieldName
 * @returns {string|boolean}
 */
teasp.dialog.ChangeHRMEmp.prototype.getOrgValue = function(fieldName){
	var org = this.employee || {};
	var o = this.getSavedValue(fieldName);

	if (!o) {
		var key = this.getApiName(fieldName);
		if (fieldName == 'MyNumber__c') {
			var os = this.getSavedValue('SelectTarget__c');
			if (os) {
				if (org.Id == os.value) {
					return org[key];
				} else {
					var dependent = this.getRefer('Dependents__r', os.value);
					if(dependent){
						return dependent[key];
					}
					var bank = this.getRefer('Bank__r', os.value);
					if(bank){
						return bank[key];
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
teasp.dialog.ChangeHRMEmp.prototype.getSavedValue = function(fieldName){
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
teasp.dialog.ChangeHRMEmp.prototype.setSavedValue = function(fieldName, dataType, value){
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
teasp.dialog.ChangeHRMEmp.prototype.getRefer = function(refKey, id){
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
teasp.dialog.ChangeHRMEmp.prototype.getDispValue = function(fieldName, dataType, refer) {
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
		return ( typeof v !== 'undefined' && v !== null ) ? v : '';
	}
};

/**
 * 一時保存をリセット
 */
teasp.dialog.ChangeHRMEmp.prototype.resetTemporary = function(){
	this.requestCache._tmp = { FlowBody: {} };
};

/**
 * 一時保存のテーブルを返す
 */
teasp.dialog.ChangeHRMEmp.prototype.getTemporary = function(){
	return (this.requestCache._tmp && this.requestCache._tmp.FlowBody);
};

/**
 * 一時保存の値を返す
 * @param {string} fieldName
 * @returns {string|boolean|null}
 */
teasp.dialog.ChangeHRMEmp.prototype.getTempValue = function(fieldName){
	var o = this.getTemporary();
	return (o && o[fieldName] && o[fieldName].value) || null;
};

/**
 * 保存用の値に変換して一時保存
 */
teasp.dialog.ChangeHRMEmp.prototype.setDispValue = function(fieldName, dataType, value){
	var v = value || null;
	var type = dataType.toLowerCase();
	if (type == 'date' && v) {
        v = teasp.util.date.formatDate(v);

        // 不正な値の場合は入力値を設定する
		if (v == '???') {
			v = value
		}
	} else if (type == 'boolean') {
		v = (v ? true : false);
	}
	var tmp = this.getTemporary();
	tmp[fieldName] = {
		type	: dataType,
		value	: v
	};
};

/**
 * 保存内容と入力内容を比較して変更があるかのチェック
 * @returns true = 変更あり、false = 変更なし
 */
teasp.dialog.ChangeHRMEmp.prototype.isChanged = function() {
	if (!this.showFlow) {
		return false;
	}

	// 入力内容を取得
	var tmp = this.getTemporary();

	for (var key in tmp) {
		if(!tmp.hasOwnProperty(key)){
			continue;
		}

		// tv = 入力内容
		// ov = 保存値
		var tv = (tmp[key] && tmp[key].value);
		var ov = this.getOrgValue(key);

		// 変更がある場合はtrue
		if (tv != ov) {
			return true;
		}
	}

	return false;
};

/**
 * 必須項目に値が入ってなかったら true を返す
 * @returns {boolean}
 */
teasp.dialog.ChangeHRMEmp.prototype.isLack = function() {
	if(!this.showFlow){
		return false;
	}

	var tmp = this.getTemporary();

	for(var key in tmp){
		if(!tmp.hasOwnProperty(key) || !this.isRequiredField(key)){
			continue;
		}

		// 必須項目が未入力の場合はtrue
		if (tmp[key] && tmp[key].value == null) {
			return true;
		}
	}

	return false;
};

/**
 * 必須項目をクリア
 */
teasp.dialog.ChangeHRMEmp.prototype.clearRequiredField = function() {
	this.requestCache._required = {};
};

/**
 * 必須項目をセット
 * @param {string} key
 */
teasp.dialog.ChangeHRMEmp.prototype.setRequiredField = function(key) {
	this.requestCache._required[key] = 1;
};

/**
 * 必須項目か
 * @param {string} key
 * @returns {boolean}
 */
teasp.dialog.ChangeHRMEmp.prototype.isRequiredField = function(key) {
	return (this.requestCache._required[key] ? true : false);
};

/**
 * 個人番号の変更フラグをセット
 */
teasp.dialog.ChangeHRMEmp.prototype.resetMyNumber = function() {
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
teasp.dialog.ChangeHRMEmp.prototype.resetMyNumberAttachment = function() {
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
teasp.dialog.ChangeHRMEmp.prototype.mergeValue = function(req, res) {
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
teasp.dialog.ChangeHRMEmp.prototype.blurField = function(e) {
	this.settingFlowValue();
	this.settingVisibleEventButton(this.isChanged());
};

/**
 * Enter キー押下時に入力値に応じてボタンの状態を変更する
 * その他のキー押下時は変更ありとしてボタンの状態を変更する
 * @param e
 */
teasp.dialog.ChangeHRMEmp.prototype.keypressField = function(e) {
	if (e.keyChar === "" && e.keyCode === 13) { // keyCharが空の場合は特殊なキー＆コードがENTERキー
		this.settingFlowValue();
		this.settingVisibleEventButton(this.isChanged());
	} else {
		this.settingFlowValue();
		this.settingVisibleEventButton(true);
	}
};

/**
 * イベントリソースを記録
 * @param {string} key
 * @param {Object} handle
 */
teasp.dialog.ChangeHRMEmp.prototype.setEventHandles = function(key, handle){
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
teasp.dialog.ChangeHRMEmp.prototype.clearEventHandles = function(key){
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
teasp.dialog.ChangeHRMEmp.prototype.loadRequestFlowParts = function() {
	var infoArea = dojo.byId('ChangeRequestInfo');
	dojo.empty(infoArea);

	// this.loadRequestId = 社員情報変更申請Id
	// グループ選択リスト、申請内容/申請日/状況の表示制御
	dojo.style('GroupCategory', 'display', (this.loadRequestId ? 'none' : ''));
	dojo.style(infoArea 	  , 'display', (this.loadRequestId ? '' : 'none'));

	// 社員情報変更申請Idがない（変更申請ボタンから開かれた）場合は、グループ選択リスト、戻るリンクを使用可能にする
	if(!this.loadRequestId) {
		this.lockEventButton(false);
		return;
	}

	// 変更一覧からダイアログが表示された場合
	// 社員情報変更申請を取得
	var requestObj = this.getMaster("request");

	// ダイアログ表示時の社員情報変更申請データを保持
	this.initRequestCache(requestObj);

	var info = this.getRequestInfo();
	var kl = teasp.message.getLabel('tm10001590'); // ：

	// 申請内容
	var grp = dojo.create('div', { className: 'request-info-group' }, infoArea);
	dojo.create('div', { className: 'request-info-c', innerHTML: teasp.message.getLabel('em10001110') + kl }, grp);
	dojo.create('span', { innerHTML: info.Name || '&nbsp;' }, dojo.create('div', { className: 'request-info-v' }, grp));

	// 申請日
	grp = dojo.create('div', { className: 'request-info-group' }, infoArea);
	dojo.create('div', { className: 'request-info-c', innerHTML: teasp.message.getLabel('applyDate_label') + kl }, grp);
	dojo.create('span', { innerHTML: this.getApplyDatetime(info.Status__c) || '&nbsp;' }, dojo.create('div', { className: 'request-info-v' }, grp));

	// 状況
	dojo.create('div', { className: 'request-info-c', innerHTML: teasp.message.getLabel('statusj_head') + kl }, grp);
	var btn = dojo.create('button', { className: 'std-button2' }, dojo.create('div', { className: 'request-info-btn' }, grp));
	dojo.create('div', { innerHTML: teasp.constant.getDisplayStatus(info.Status__c) || '&nbsp;' }, btn);
	this.setEventHandles('top', dojo.connect(btn, 'onclick', this, this.showSteps));

	// 諸届定義を取得
	var events = this.getMaster("events");
	var eventObj = events[this.requestCache.EventId];

	// 諸届定義を取得できた場合は、ダイアログの表示をメニューから選択された申請に切り替える
	if(eventObj){
		dojo.hitch( this, this.openRequestEvent( eventObj, false ) )();
	}

	// ボタン制御
	this.settingVisibleEventButton();

	// グループ選択リストと戻るボタンの表示制御
	this.lockEventButton( true );
};

/**
 * グループ選択リストのイベント設定
 */
teasp.dialog.ChangeHRMEmp.prototype.createRequestTemplate = function() {
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
teasp.dialog.ChangeHRMEmp.prototype.changeGroup = function() {
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
 * 申請メニューの申請リンクのクリックイベントを設定する
 */
teasp.dialog.ChangeHRMEmp.prototype.settingEvent = function( tbody, eventObj ) {
	var row = dojo.create( "tr", null, tbody );
	var span = dojo.create( "span", { innerHTML : eventObj.name } ,dojo.create( "td", { className : "SelectEvent", id : "event_" + eventObj.id }, row ) );
	this.setEventHandles('group', dojo.connect(span, "onclick", this, this.openRequestEvent( eventObj, true )));
};

/**
 * ダイアログの表示をメニューから選択された申請に切り替える
 */
teasp.dialog.ChangeHRMEmp.prototype.openRequestEvent = function( eventObj, isAnimation ) {
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

		// 戻るリンク
		var span = dojo.create( "span"
				  ,{ innerHTML : teasp.message.getLabel('em10001010') } // ＜戻る
				  ,dojo.create( "td", { className : "RequestReturnEvent", id : "RequestReturnEvent" }, row ) );

		this.setEventHandles('group2', dojo.connect( span, "onclick", this, function() {
			this.swapEventFlow( true, true );
			dojo.hitch( this, this.openRequestFlow( null ) )(); }
		));

		row = dojo.create( "tr", null, tbody );

		// 申請のタイトル
		var div = dojo.create( "div", { innerHTML : eventObj.name }, dojo.create( "td", { className : "RequestEventTitle" }, row ) );
		row = dojo.create( "tr", { style : "height: 100%;" }, tbody );

		// 申請フロー表示エリア
		var flowList = dojo.create( "div", { className : "RequestFlowList" }, dojo.create( "td", { style: 'vertical-align:top;' }, row ) );
		row = dojo.create( "tr", null, tbody );

		// 申請フロー表示エリアの下部に表示される「* 必須項目」の文字
		div = dojo.create( "div", null, dojo.create( "td", { className : "RequestFlowRequiredAnnotation", colspan : 4 }, row ) );
		div.innerHTML = teasp.message.getLabel('em10001020', teasp.message.getLabel('em10001030')); // * 必須項目

		tbody = dojo.create( "tbody", null, dojo.create( "table", { style : "width: 100%;" }, flowList ) );
		for ( var i = 0 ; i < flows.length ; i++ ) {
			var flowObj = flows[i];
			row = dojo.create( "tr", null, tbody );
			var td = dojo.create( "td", { style : "vertical-align: top; height: 24px;" }, row );

			// 申請フローのチェックボックスを表示する
			if	(!flowObj.isRead) {
				div = dojo.create( "div", { className : "RequestFlowCheck", id : "flowCheck_" + flowObj.id }, td );
				if(this.isFlowSaved(i)){
					dojo.addClass( div, "png-sts005" );
				}
			}

			// 必須フローに「*」をつける
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

			// 申請フローを生成
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
		// 限定リリースの場合
		if(this.isPickListLimitedRelease) {
			// 保存されている選択リスト値と定義されている選択リスト値を比較し
			// 無効な選択リスト値を持つ項目の一覧を生成する
			this.validatePickListField(this.getSavedValue(), this.master['pickList']);
		}
		dojo.hitch( this, this.openRequestFlow( this.getFirstFlow() ) )();
	};
};


/**
 * 外部キーを指定して特定の申請に切り替える(諸届ナビから呼び出す)
 */
teasp.dialog.ChangeHRMEmp.prototype.openRequestEventFromForeignKey = function(foreignKey){
	var events = this.getMaster("events");
	var eventIdList = Object.keys(events);
	for(var i = 0; i < eventIdList.length; i++){
		var event = events[ eventIdList[i] ];
		if (event.foreignKey === foreignKey) {
			dojo.hitch(this, this.openRequestEvent(event, false))();
			break;
		}
	}

	// 戻るリンクを非表示にする
	dojo.style(dojo.query('#RequestReturnEvent span')[0], 'display', 'none');

	// カテゴリ選択リストを非表示にする
	dojo.style(dojo.query('#GroupCategory select')[0], 'display', 'none');
}

/**
 * フロー選択時
 */
teasp.dialog.ChangeHRMEmp.prototype.openRequestFlow = function( flowObj ) {
	return function() {
		this.clearEventHandles('flow');
		this.clearRequiredField();
		this.showFlow = flowObj;
		this.hasSelectedTargetRecord = false;

		// selectTargetを使用しない申請 かつ 申請未保存の場合
		if(flowObj && Object.keys(this.getSavedValue()).length === 0){
			this.validatePickListField(this.getOrgValueMap(flowObj), this.getOptionsList());
		}
		// 〜を変更する申請において無効な選択リスト値が存在していて
		// フローを切り替える場合は無効な選択リスト値の記録をリセットする
		// (未保存で切り替えならば変更対象がリセットされるため)
		else if(this.isPickListAlertInNewChangeRequest) {
			this.invalidValuePickListFields = [];
			// 申請時の値を元に無効な選択リスト値を検出する
			// (無効な選択リスト値を持ちながらフロー切替時に申請可能となることを防ぐ)
			this.validatePickListField(this.getSavedValue(), this.getOptionsList());
		}

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
			// 限定リリースの場合
			if(this.isPickListLimitedRelease) {
				// 入力フォームの値と申請レコードに保存されている値を比較する
				this.validateInvalidFieldForm(this.constInvalidValuePickListFields);

				// 無効な選択リスト値が存在し、下記の条件を満たす場合は通知するダイアログを表示する
				// 1. ダイアログを初めて開いた場合
				// 2. 該当する項目が存在するフローを開いた場合
				if (this.invalidValuePickListFields.length !== 0) {
					if (!this.hasOpenedRequestFlow // 変更申請ダイアログの初回表示時の場合
						|| (this.invalidFlow
							&& this.invalidFlow.showSection === this.showFlow.flowParts[0].showSection)) {

						var delay = teasp.manager.dialogs.BusyWait ? 200 : 0;
						setTimeout(function () {
							this.openInvalidFieldAlert(this.invalidValuePickListFields);
						}.bind(this), delay); // レンダリングのブロックを回避
					}
				}

				if(!this.hasOpenedRequestFlow) {
					// 初回表示終了後はフラグを切り替える
					this.hasOpenedRequestFlow = true;
				}
			}
		}
		this.settingVisibleEventButton();

	};
};

/**
 * ダイアログのフォーム部分を生成する
 * @param tbody
 * @param flowParts = 諸届定義
 */
teasp.dialog.ChangeHRMEmp.prototype.createRequestEditForm = function( tbody, flowParts ) {
	var localeKey =
		teasp.message.getLanguageLocaleKey()
		&& (teasp.message.getLanguageLocaleKey() === 'en' || teasp.message.getLanguageLocaleKey() === 'en_US')
			? 'en_US' : 'ja_JP';

	// セクション表示
	if ( flowParts.isShowParts == true ) {
		var tr = dojo.create( "tr", null, tbody );
		var cc = dojo.create( "td", { style : "padding-bottom: 2px; text-align: left;" }, tr );
		cc.innerHTML = teasp.message.getLabel('tf10006410', flowParts.name); // ■ {0}
		if (localeKey === 'en_US') {
			cc.innerHTML = teasp.message.getLabel('tf10006410', flowParts.name_eng); // ■ {0}
		}
	}

	// 各項目
	var tr = dojo.create( "tr", null, tbody );
	var cc = dojo.create( "td", { style : "padding-bottom: 8px;" }, tr );
	var fieldtbody = dojo.create( "tbody", null, dojo.create( "table", { className: "request_Form", style: "border-collapse:separate;border-spacing:3px;" }, cc ) );
	// 現在表示しているセクションを保持する
	this.showSection = flowParts.showSection;

	switch (flowParts.recordType) {

	// 社員情報変更申請ダイアログ
	// （諸届定義のrecordTypeにはすべてEmployeeEditが設定されている）
	case "EmployeeEdit":

		dijit.Tooltip.showDelay = 0;
		dijit.Tooltip.hideDelay = 0;

		// セクション情報がない場合は処理しない
		if (!flowParts.showSection) {
			break;
		}

		// this.fieldListからshowSection(= 諸届定義のshowSectionに設定した値)の情報を取得
		var section = this.fieldList[flowParts.showSection];
		// 無効な選択リスト値をダイアログで表示する際に
		// 現在開いている変更申請のforeignKeyが一致する項目から項目名を出力する
		this.foreignKey = section.foreignKey;

		// APIから取得した項目設定(ツールチップ)情報を取得
		var fieldSetting = this.master['fieldSetting'] && this.master['fieldSetting'][section.foreignKey] ?
		                   this.master['fieldSetting'][section.foreignKey] : null;

		// 各セクションに定義された項目（this.fieldListに定義された項目）毎に処理
		for (var j = 0 ; j < section.fields.length ; j++) {
			var field = section.fields[j];
			var type = field.type;
			var rawTooltipStr = fieldSetting && fieldSetting[field.name] ?
			                 fieldSetting[field.name]['tooltip'][localeKey] : '';
			var tooltipStr = rawTooltipStr ? teasp.util.entitize(rawTooltipStr).replace(/\n/g, '<br>') : ''; // HTML特殊文字をエスケープ & 改行を<br>にする


			// 表示非表示チェック
			if (this.checkShowIdentityDocument(type, field.filedescription) == false) {
				continue;
			}

			// 項目のAPI参照名を取得する
			// 例）家族姓：field.name = DependentName_LastName__c、field.fieldName = LastName__c が定義されている
			//    field.fieldNameに値が設定されている場合は、field.fieldNameの値がAPI参照名として設定される
			this.setApiName(field.name, field.fieldName);
			tr = dojo.create("tr", null, fieldtbody);

			// 必須項目に「*」を設定する
			cc = dojo.create("td", { className: "RequestFieldRequired" }, tr);

			if(field.isRequired){
				dojo.create("div", { innerHTML: '*' }, cc);
				this.setRequiredField(field.name);
			}
			// 項目の表示ラベルを設定する
			// 「label:""」としていると、ツールチップ付与パターンの時、ツールチップの有無にかかわらず表示がズレるので注意。
			if (field.label) {
				dojo.create("div", { innerHTML: field.label }, dojo.create("td", { className: "left", style: "padding-bottom:2px;text-align:left;" }, tr));
			}

			// ツールチップを付与する
			var tooltipTd = dojo.create('td', null, tr);
			if (tooltipStr) {
				var tooltipField = dojo.create('div', { className: 'common-set-help-on' }, tooltipTd);
				new dijit.Tooltip({ connectId: [tooltipField], label: tooltipStr, position: ['below'], hideDelay: 10, style: "margin: 20px;background-color:blue;" });
			}

			cc = dojo.create("td", { className: "right", colSpan: (field.label ? "1" : "2"), style: "padding-bottom:2px;text-align:left;" }, tr);
			var div = dojo.create("div", null, cc);

			// field.typeが定義されていない場合のtype値の設定
			// typeが定義されている場合はそのまま使用
			if (!type) {
				switch (field.dataType) {
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
			} else {
				type = type.toLowerCase();
			}


			// type定義によって入力項目の表示を行う
			switch(type) {

			// 1 個人番号の利用目的
			case "label":
				if (field.name == "MyNumberPurposeUse") {
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

			// 個人番号登録
			// 2 登録対象の選択 の 登録対象者選択リスト
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

			// 3 個人番号の登録
			// 添付ファイル項目
			case "mynumberfile":
				// 保存済みの場合、ファイル添付が可能
				this.settingMyNumberFileAttach(div, field.filedescription);
				break;

			// 3 個人番号の登録
			// 添付ファイル用コメント？
			case "mynumberlabel":
				// 資料のコメントを表示
				this.settingMyNumberLabelAttach(div, field.filedescription);
				break;

			// 氏名変更
			// 再発行関連の選択リスト
			case "selectreissue":

				// 選択リスト生成
				var obj = dojo.create("select", {
					id		  : field.name,
					fieldName : field.name,
					dataType  : "String"
				}, div);

				// 選択リストの選択肢を取得
				var options = this.optionsList[field.name] || [];

				// 選択リストに選択肢を設定する
				for (var i = 0 ; i < options.length ; i++) {
					var optionObj = options[i];
					dojo.create("option", {
						value	 : optionObj.value,
						innerHTML: optionObj.label
					}, obj);
				}

				// 未保存の場合は1つ目の選択肢を選択状態にする
				if (!this.isFlowSaved(this.showFlow.index) && options.length){
					obj.value = options[0].value;
					this.setSavedValue(field.name, 'String', options[0].value || null);
				}
				break;

			// 家族情報変更・削除
			// 変更する家族・削除する家族選択リスト
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
						this.settingSelectTargetField('Dependents__r', 'SelectTarget__c');
					}));
					if(!this.isFlowSaved(this.showFlow.index)){ // 未保存
						// デフォルトで一番上の要素を選択状態にするため、保存値にIDをセット
						obj.value = dependents[0].Id;
						this.setSavedValue(field.name, 'String', dependents[0].Id);
					}
				}
				break;

			// 口座情報変更・削除
			// 変更する口座・削除する口座選択リスト
			case "selectaccounts":
				var obj = dojo.create("select", {
					id		  : field.name,
					fieldName : field.name,
					dataType  : "String"
				}, div);

				// 口座情報取得
				var accounts = this.employee.Bank__r && this.employee.Bank__r.records || [];

				// 未保存の場合は有効フラグがTrueの口座のみを選択可能にする
				// 承認待ち・承認済みの場合は全ての口座を格納する
				if (accounts.length !== 0 &&
					(this.requestCache._status !== '承認待ち' && this.requestCache._status !== '承認済み')) {
					accounts = accounts.filter(function(account) {
						return account.ValidFlag__c;
					});
				}

				for (var i = 0 ; i < accounts.length; i++) {
					var acc = accounts[i];

					// 選択リストから区分の値を取得
					// 選択リストに値がない場合はHRMから取得した値をそのまま設定
					var kbn = this.getDispListValue('Kbn__c', acc.Kbn__c);

					// [銀行名 支店名：区分]形式の値を選択リストアイテムに設定
					var item = acc.Name + " " + (acc.BranchName__c || "") + (kbn ?  "：" + kbn : '');
					dojo.create("option", {
						value	 : acc.Id,
						innerHTML: item
					}, obj);
				}

				if (accounts.length) {
					// 変更する口座選択リストで選択された口座情報をダイアログに表示する処理
					// SelectTarget__c = 変更する口座選択リスト
					this.setEventHandles('flow', dojo.connect(obj, 'onchange', this, function() {
						this.settingSelectTargetField('Bank__r', 'SelectTarget__c');
					}));

					// 変更する口座選択リストの先頭を選択状態にする
					if (!this.isFlowSaved(this.showFlow.index)) {
						obj.value = accounts[0].Id;
						this.setSavedValue(field.name, 'String', accounts[0].Id);
					}
				}
				break;
			// 共通部品
			// 日付入力欄
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
			// 数値(整数)
			case "integer":
				var obj = dojo.create("input", {
					type	  : 'text',
					id		  : field.name,
					fieldName : field.name,
					maxlength : field.length,
					dataType  : field.dataType
				}, div);

				// 数字以外の文字が入力された場合はクリアする
				this.setEventHandles('flow', dojo.connect(obj, 'onchange', this, function(e) {
					var val = parseInt(e.target.value, 10);
					e.target.value = val === val ? val : ''; // NaNの場合は空文字にする
				}));
				break;

			// 選択リスト項目
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

				// 未保存時
				if (!this.isFlowSaved(this.showFlow.index) && options.length) {
					// デフォルトで一番上を選択状態にする(保存値には値をセットしない)
					obj.value = options[0].value;
					// this.setSavedValue(field.name, 'String', options[0].value || null);
				}
				break;

			// 添付ファイル項目
			case "file":

				this.settingFileAttachNoSave(div, field.filedescription);
				//this.settingFileAttach(div, field.filedescription);
				break;

			// 複数行入力項目
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

			// ボタン
			case "button":
				if(!this.isLock()){
					field.eventHandlesRegisterFnc(
						this,
						dojo.create("input",{
							type  : field.type,
							value : field.buttonlabel,
							id    : field.name
						}, div)
					);
					
				}else{
					//ツールチップがあるときは削除
					dojo.query(".common-set-help-on",tr).forEach(function(div){
						dojo.destroy(div);
					});
					//ボタン非表示に変なスペースが残るため、行の高さを調整
					dojo.style( tr, 'height', '0' );
				}
				break;
				
			// 上記以外
			default:
				var obj = dojo.create("input", {
					type	  : type,
					id		  : field.name,
					fieldName : field.name,
					maxlength : field.length,
					dataType  : field.dataType
				}, div);

				// 個人番号は非表示
				if ( field.name == "MyNumber__c" ) {
					this.setEventHandles('flow', dojo.connect(obj, 'onkeyup', this, function(){ this.changedMyNumber(); } ) );
					dojo.create("div", { id: "myNumberInfo", style: 'display: none;' }, div);
				}
				break;
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

	// 繰り返し項目：選択リストで選択された情報をフォームにセットする処理
	switch (flowParts.showSection) {

	// 家族情報を登録する
	case "InsertDependents":
		if (!this.isFlowSaved(this.showFlow.index)) {
			// 値をフォームに設定
			this.settingLoadDataFlowParts(this.getSavedValue());
		} else {
			this.settingLoadDataFlowParts();
		}
		this.settingFlowValue();
		break;

	// 家族情報変更する
	case "UpdateDependents":
		this.settingLoadDataFlowParts();

		if (!this.isFlowSaved(this.showFlow.index)) {
			this.settingSelectTargetField('Dependents__r', 'SelectTarget__c');
		} else {
			this.settingFlowValue();
		}
		break;

	// 口座情報を登録する
	case "InsertAccounts":

		// 申請未保存の場合
		if (!this.isFlowSaved(this.showFlow.index)) {
			// getSavedValue = this.requestCache.FlowBodyを返す
			// settingLoadDataFlowParts = 各項目のイベント設定、getSavedValue()で取得した値を申請フォームの入力項目に設定する
			this.settingLoadDataFlowParts(this.getSavedValue());

		// 保存済みの場合
		} else {
			// settingLoadDataFlowParts = 各項目のイベント設定、保存された元の値を申請フォームの入力項目に設定する
			this.settingLoadDataFlowParts();
		}
		// 入力値を申請フォームから取得し、this.requestCache._tmpに格納する
		this.settingFlowValue();
		break;

	// 口座情報を変更する
	case "UpdateAccounts":
		this.settingLoadDataFlowParts();

		if (!this.isFlowSaved(this.showFlow.index)) {
			this.settingSelectTargetField('Bank__r', 'SelectTarget__c');
		} else {
			this.settingFlowValue();
		}
		break;

	case "MyNumber":
		this.settingLoadDataFlowParts();

	// それ以外の場合
	default:
		// requestCacheの値をフォームに設定する
		this.settingLoadDataFlowParts();

		// 保存済みの場合は入力項目に値を設定する
		//if (this.isFlowSaved(this.showFlow.index)) {
			this.settingFlowValue();
		//}
		break;
	}

	// ダイアログのボタンの表示・使用可否制御
	this.settingVisibleEventButton();


};

/**
 * 被扶養者の選択
 * @param {Object} dependentId 被扶養者Id
 */
teasp.dialog.ChangeHRMEmp.prototype.selectDependent = function( dependentId ) {
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
teasp.dialog.ChangeHRMEmp.prototype.checkShowIdentityDocument = function( type, fileDescription ) {
	var dependentObj = null;
	if ( this.requestCache.FlowBody &&
		 this.requestCache.FlowBody["SelectTarget__c"] ) {
		dependentObj = this.selectDependent( this.requestCache.FlowBody["SelectTarget__c"].value );
	}
	// 本人確認資料添付であるか
	if ( type && ( type.toLowerCase() == "mynumberlabel" || type.toLowerCase() == "mynumberfile" ) && fileDescription == "2" ) {
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
 * 口座情報：対象口座選択時の処理
 * 家族情報：被扶養者選択時の情報選択
 * @param {Object} fieldName 選択リスト名
 */
teasp.dialog.ChangeHRMEmp.prototype.settingSelectTargetField = function (refKey, selKey) {
	// 削除申請の場合はフォームの値をリセットしない(有効開始日)
	if (this.SECTION_LIST_TO_REMOVE_TARGET.indexOf(this.showSection) >= 0) {
		return;
	}

	this.settingFlowValue();

	var refer = this.getRefer(refKey, this.getTempValue(selKey));
	var tbody = dojo.byId("requestEditForm_tbody");

	// selectDOMを初期化する
	// 無効な選択リスト値として記録されている値が存在する場合は対応するoptionDOMが生成されている
	dojo.query('select', tbody).forEach(function (el) {
		var fieldName = dojo.getAttr(el, "fieldName");
		dojo.query('option', el).forEach(function (option) {
			this.constInvalidValuePickListFields.forEach(function (field) {
				if (field.value === option.value && field.fieldName === fieldName) {
					dojo.destroy(option);
				}
			});
		}, this);
	}, this);

	// 対象の切り替えの度に無効な選択リスト値のリストを初期化する
	this.invalidValuePickListFields = [];
	this.isPickListAlertInNewChangeRequest = false; // 保存・申請時にエラーダイアログを表示するかどうか

	// 保存されている値と定義されている選択リスト値を比較し無効な選択リスト値を検出する
	// constInvalidValuePickListFieldsはinvalidValuePickListFieldsのコピーとして上書きされる
	this.validatePickListField(refer, this.getOptionsList(), true);

	// 無効な選択リスト値に対してDOM生成とフラグの有効化を行う
	dojo.query('select', tbody).forEach(function (el) {
		var fieldName = dojo.getAttr(el, "fieldName");

		this.invalidValuePickListFields.forEach(function (field) {
			if (field.fieldName === fieldName) {
				// 無効な選択リスト値のリストに含まれる場合

				// 保存・申請時にエラーダイアログを表示するようにフラグを有効化
				this.isPickListAlertInNewChangeRequest = true;

				// 無効な選択リスト値を選択可能なようにする
				var label =
					this.isEnglishAndOldPeople(field)
						? this.OLD_PEOPLE_ENGLISH_LABEL // 言語設定が英語かつ扶養控除区分が老人の場合
						: field.value; // それ以外の場合

				dojo.create("option", {
					value: field.value,
					innerHTML: label
				}, el);

			}
		}, this);
	}, this);

	dojo.query('input[type="text"],input[type="date"],select,textarea', tbody).forEach(function (el) {
		var fieldName = dojo.getAttr(el, "fieldName");
		var dataType = dojo.getAttr(el, "dataType");

		if (fieldName && dataType && fieldName != selKey) {
			// 選択リスト値を保存されている値が選択されている状態に変更する

			// 社員情報変更申請の項目API参照名とマスタの項目API参照名に差異がある場合は
			// マスタの項目API参照名に変換する
			fieldName = this.convertChangeRequestFieldNameToMaster(fieldName, refKey);
			el.value = this.getDispValue(fieldName, dataType, refer);

		}
	}, this);
	dojo.query('input[type="checkbox"]', tbody).forEach(function (el) {
		var fieldName = dojo.getAttr(el, "fieldName");
		var dataType = dojo.getAttr(el, "dataType");
		if (fieldName && dataType) {
			el.checked = this.getDispValue(fieldName, dataType, refer);
		}
	}, this);

	/** エラーダイアログの表示条件は無効な選択リスト値が存在し1または2または3を満たす場合
	 * 1. 新規に家族情報を変更する等の変更申請を作成し、申請対象の家族情報を切り替えた場合
	 * 2. 変更一覧から未申請の家族情報変更申請を開き、申請対象の家族情報を切り替えた場合
	 * 3. 選択リスト値のAPI取得機能が有効化されていない(=差し込み対応が行われていない場合) **/
	if (this.invalidValuePickListFields.length !== 0 &&
		(this.hasSelectedTargetRecord || this.isFlowSaved(this.showFlow.index)
			|| !this.isPickListLimitedRelease)) {
		setTimeout(function () {
			this.openInvalidFieldAlert(this.invalidValuePickListFields);
		}.bind(this), 50); // レンダリングのブロックを回避
	}
	// 未保存の申請においてフローを初回表示時(=変更申請の対象が自動選択されている場合)以降は
	// ダイアログを表示するためフラグを有効化
	if (!this.hasSelectedTargetRecord) {
		this.hasSelectedTargetRecord = true;
	}
};

/**
 * 個人番号変更時の処理
 */
teasp.dialog.ChangeHRMEmp.prototype.changedMyNumber = function() {
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
 * 添付ファイルのUI部作成（保存チェックなし）
 * @param {Object} div 領域
 * @param {string} description 識別名
 */
teasp.dialog.ChangeHRMEmp.prototype.settingFileAttachNoSave = function(div, description) {
	dojo.attr(div, 'filedescription', description); // showAttachedFileName() で使用する

	var attach = this.getAttachObj(description);
	if (attach) {
		dojo.create("span", { innerHTML: attach.Name || '', style: 'margin-right:8px;color:#666;' }, div);
	} else if(this.isLock()) {
		dojo.create("div", { innerHTML: teasp.message.getLabel('em10001140'), style:'color:#666;' }, div); // 添付ファイルなし
	}
	if(!this.isLock()){
		var btn = dojo.create("input", { type : "button", value : teasp.message.getLabel('em10001080') }, div); // ファイル添付
		this.setEventHandles('flow', dojo.connect(btn, 'onclick', this, this.openAttachmentWindow(description)));
	}
};

/**
 * 添付ファイルのUI部作成
 * @param {Object} div 領域
 * @param {string} description 識別名
 */
teasp.dialog.ChangeHRMEmp.prototype.settingFileAttach = function(div, description) {
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
teasp.dialog.ChangeHRMEmp.prototype.settingMyNumberFileAttach = function(div, description) {
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
teasp.dialog.ChangeHRMEmp.prototype.settingMyNumberLabelAttach = function(div, description) {
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
teasp.dialog.ChangeHRMEmp.prototype.openAttachmentWindow = function(description) {
	return function(){
		openAttachmentWindow(description, this.requestCache.EventRequestId, this.requestCache.EventId, this.requestCache.EmpId);
	};
};

/**
 * 個人番号関連資料ファイルアップロードウィンドウを開く
 * @param description
 * @returns {Function}
 */
teasp.dialog.ChangeHRMEmp.prototype.openMyNumberAttachmentWindow = function(description) {
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
teasp.dialog.ChangeHRMEmp.prototype.attachedEvent = function(obj) {
	this.isMynumberAttached = false;

	if(this.requestCache && (this.requestCache.EventRequestId == obj.requestId || obj.requestId)){
		var at;

		// 社員情報変更申請が保存されていない状態でファイル添付ステップを開いてファイル添付を行った時の対応
		if (this.requestCache.EventRequestId == null) {
			this.requestCache.EventRequestId = obj.requestId;
		}

		if(obj.isMyNumber){
			at = this.requestCache._mnAttached;
			if(!at){
				at = this.requestCache._mnAttached = {};
			}
			this.isMynumberAttached = true;
			at[obj.description] = { Name: obj.fname };
			dojo.hitch( this, this.openRequestFlow( this.showFlow ) )(); // フロー再読込
		}else{
			at = this.requestCache._attached;
			if(!at){
				at = this.requestCache._attached = {};
			}
			at[obj.description] = { Name: obj.fname };
			this.showAttachedFileName(obj.description, obj.fname); // フローを再読込せず、添付ファイル項目にファイル名のみ表示させる
		}
		// at[obj.description] = { Name: obj.fname };
		// dojo.hitch( this, this.openRequestFlow( this.showFlow ) )();
	}
	this.settingVisibleEventButton(true);
};

/**
 * ファイル添付の直後に、添付したファイルの名前をファイル項目に表示させる
 * @param obj
 */
teasp.dialog.ChangeHRMEmp.prototype.showAttachedFileName = function(fileDescription, fileName){
	var parentDiv = dojo.query('div[filedescription="' + fileDescription + '"]', dojo.byId("requestEditForm_tbody"))[0];
	if(!parentDiv) return;

	var spans = dojo.query('span', parentDiv);
	if(spans.length){
		spans[0].textContent = fileName;
	} else {
		dojo.create('span', { textContent: fileName }, parentDiv, 'first');
	}
};

/**
 * カレンダーボタンがクリックされた時の処理
 */
teasp.dialog.ChangeHRMEmp.prototype.settingCalendar = function(nodeId) {
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
 * @param: refer = getSavedValue()で取得した値
 */
teasp.dialog.ChangeHRMEmp.prototype.settingLoadDataFlowParts = function(refer) {
	var lock = this.isLock();
	var tbody = dojo.byId( "requestEditForm_tbody" );

	dojo.query('input[type="text"],input[type="date"],select,textarea', tbody).forEach(function(el){
		var fieldName = dojo.getAttr(el, "fieldName");
		var dataType  = dojo.getAttr(el, "dataType" );

		// イベントの設定
		this.setEventHandles('flow', dojo.connect(el, 'onblur', this, this.blurField));
		if(el.nodeName == 'SELECT'){
			this.setEventHandles('flow', dojo.connect(el, 'onchange'  , this, this.blurField));
		}else{
			this.setEventHandles('flow', dojo.connect(el, 'onkeypress', this, this.keypressField));
		}

		if(fieldName && dataType){
			// マイナンバー
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

			// マイナンバー以外
			// 表示用に変換した値を入力項目に設定
			} else if(el.nodeName == "SELECT" && fieldName != "SelectTarget__c") {
				var value = this.getDispValue(fieldName, dataType, refer);
				// 限定リリースの場合は定義されていない選択リスト値を選択可能なようにする
				if(this.isPickListLimitedRelease && value) {
					var isFound = false;
					dojo.query('option', el).forEach(function(optionEL) {
						if(optionEL.innerHTML === value) {
							isFound = true;
						}
					});
					// 定義された選択リスト値に現在の値が含まれているか
					if(!isFound) {
						// 定義された選択リスト値に値が含まれていない場合は表示させるために一時的に要素を生成する
						dojo.create("option", {
							value: value,
							innerHTML: value
						}, el);
					}
				}
				// セレクトボックスで選択されている値を社員情報変更申請レコードの値にする
				// 値が無ければ先頭の選択リスト値を選択状態にする
				el.value = value ? value : dojo.query('option', el)[0].value;
			}
			else {
				el.value = this.getDispValue(fieldName, dataType, refer);
			}
		}

		// 入力不可の場合
		// 承認待ち、承認済みの場合
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

	// チェックボックスの対応
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
 * 値をフォームから取り出す
 * 取り出した値をgetRequestCache_tmpに格納する
 */
teasp.dialog.ChangeHRMEmp.prototype.settingFlowValue = function() {
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
 * 変更申請を行う
 * 申請ボタンがクリックされたときの処理
 */
teasp.dialog.ChangeHRMEmp.prototype.submitRequestEvent = function() {
	// 無効な選択リスト値が存在するか検証する
	if(!this.isLock() && (this.isPickListLimitedRelease || this.isPickListAlertInNewChangeRequest)) {
		// 変更申請が申請済み・未申請でない場合
		this.validateInvalidFieldForm(this.constInvalidValuePickListFields);
		if(this.invalidValuePickListFields.length !== 0) {
			// 無効な選択リスト値が選択されている場合
			this.openInvalidFieldAlert(this.invalidValuePickListFields); // エラーダイアログを表示
			return
		}
	}

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
 * 申請の削除
 * 削除ボタンがクリックされたときの処理
 */
teasp.dialog.ChangeHRMEmp.prototype.deleteRequestEvent = function() {
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
 * 申請の保存
 * 保存ボタン、保存＆次へボタンクリック次の処理
 */
teasp.dialog.ChangeHRMEmp.prototype.saveRequestFlow = function( isNext ) {
	// 無効な選択リスト値が存在するか検証する
	if(!this.isLock() && (this.isPickListLimitedRelease || this.isPickListAlertInNewChangeRequest)) {
		// 変更申請が申請済み・未申請でない場合
		this.validateInvalidFieldForm(this.constInvalidValuePickListFields);
		if(this.invalidValuePickListFields.length !== 0) {
			// 無効な選択リスト値が選択されている場合
			this.openInvalidFieldAlert(this.invalidValuePickListFields); // エラーダイアログを表示
			return
		}
	}

	teasp.manager.dialogOpen('BusyWait');

	// 入力値をフォームから取得する
	this.settingFlowValue();

	// 個人番号の変更フラグをセット
	this.resetMyNumber();

	// グループやイベント変更のロック
	this.lockEventButton(true);

	var req = this.getRequestCache(true);
	this.mergeValue(req);
	this.setFlowSaved(this.showFlow.index, req);

	req.Action = "eventsavehrm";
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

teasp.dialog.ChangeHRMEmp.prototype.finishSaveFlow = function(isNext) {
	dojo.addClass( dojo.byId( "flowCheck_" + this.showFlow.id ), "png-sts005" );
	this.settingVisibleEventButton();
	teasp.manager.dialogClose('BusyWait');
	if (isNext) {
		dojo.hitch( this, this.openRequestFlow( this.getNextFlow() ) )(); // 次のフローに移動
	} else {
		dojo.hitch( this, this.openRequestFlow( this.showFlow ) )();
	}
};

/**
 * 次へボタンクリック時の処理
 */
teasp.dialog.ChangeHRMEmp.prototype.nextRequestFlow = function() {
	dojo.hitch( this, this.openRequestFlow( this.getNextFlow() ) )(); // 次のフローに移動
};

/**
 * 次のフローを表示する
 * 保存＆次へボタンクリック時に次のフローがある場合にcallされる
 */
teasp.dialog.ChangeHRMEmp.prototype.getNextFlow = function() {
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

/**
 * １つめのフローを表示する
 * 申請メニューから申請を選択された時の処理
 */
teasp.dialog.ChangeHRMEmp.prototype.getFirstFlow = function() {
	return (this.showEvent.flows.length > 0 ? this.showEvent.flows[0] : null);
};

/**
 * 申請とフローの切替
 */
teasp.dialog.ChangeHRMEmp.prototype.swapEventFlow = function( isEventShow, isAnimation ) {
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
 * グループ選択リストと戻るボタンの表示制御
 * フローがロック中の場合はグループ選択リストを変更不可、戻るボタンを非表示にする
 * @param isLock: true = ロック状態、false = ロック解除状態
 */
teasp.dialog.ChangeHRMEmp.prototype.lockEventButton = function(isLock) {
	var groupSelect = dojo.query('#GroupCategory select')[0];	// グループ選択リスト
	var returnBtn	= dojo.byId("RequestReturnEvent");			// 戻るボタン

	// グループ選択リストの使用可否制御
	// 承認待ちか承認済みの場合は使用不可
	if(groupSelect){
		groupSelect.disabled = isLock;
	}

	// 戻るボタンの表示制御
	// 承認待ちか承認済みの場合は非表示
	if(returnBtn){
		dojo.style(returnBtn, "visibility", (isLock ? "hidden" : ""));
	}
};

/**
 * ボタンのスタイル設定（settingVisibleEventButtonからのみcall）
 * @param {string|Object} node
 * @param {boolean|number} flag
 * @param {string} baseCss
 */
teasp.dialog.ChangeHRMEmp.activeButton = function(node, flag, baseCss) {
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
 * ボタンの表示切替
 * @param changed：true = 入力内容に変更あり、false = 入力内容の変更なし
 */
teasp.dialog.ChangeHRMEmp.prototype.settingVisibleEventButton = function(changed) {
	var locked       = this.isLock();										// true: 申請済み、承認済み、false: それ以外
	var lastFlow     = (this.showFlow && this.showFlow.last) || false;		// true: 最後のステップ、false: それ以外のステップ
	var flowSave     = this.canFlowSave(changed);							// -1: 必須未入力、1: 変更あり/フロー未保存、0: その他
	var deleteFlag   = (this.canDelete() ? 1 : 0);							// 削除ボタン
	var submitFlag   = (!changed && this.canRequest()) ? 1 : 0;				// 申請ボタン
	var nextFlag     = ((locked && !lastFlow) ? 1 : -1);					// 次へボタン
	var flowSaved    = false;

	// 必須項目未入力
	// 申請ボタン使用不可、保存ボタン使用不可、保存＆次へボタン使用不可
	if (flowSave == -1) {
		flowSaved = false;
		submitFlag = 0;

		// 個人番号を登録する申請の3フロー目において申請ボタンが活性化しない不具合の対応
		if (dojo.byId("myNumberInfo")) {
			// 個人番号が保存済みかどうか(個人番号入力フォームの下に登録済みと表示される場合と同じ条件)
			var isMyNumberSaved =
				this.requestCache
				&& this.requestCache.FlowBody
				&& this.requestCache.FlowBody.MyNumber__c;

			var myNumberAttachmentNodeList
				= dojo.query(".myNumberAttachment");
			// 必須の添付ファイルが全て表示されているか
			var isMynumberAttachementDisplayed =
				myNumberAttachmentNodeList.filter(function(attachmentNode) {
					return dojo.getStyle(attachmentNode, "display") === "none";
				}).length === 0;

			/* 未申請・却下・申請取消の場合は例外的に下記の条件を満たす時に申請ボタンを活性化する
			 * 1.申請が可能な状態(他の必須フロー・必須項目が保存されている)
			 * 2.個人番号入力フォームの下に登録済みと表示されている(個人番号が保存済み)
			 * 3.添付ファイルが全て画面に表示されている */
			if((this.requestCache._status === "未申請"
				|| this.requestCache._status === "却下" || this.requestCache._status === "申請取消")
				&& this.canRequest()
				&& isMyNumberSaved
				&& isMynumberAttachementDisplayed) {
				submitFlag = 1;
			}
		}

	// 変更あり、フロー未保存
	// 申請ボタン使用不可、保存ボタン使用可、保存＆次へボタン使用可
	} else if (flowSave == 1) {
		flowSaved = true;
		submitFlag = 0;

	// それ以外
	// 申請ボタン使用可、保存ボタン使用不可、保存＆次へボタン使用不可
	} else {
		flowSaved = false;
	}

	var saveFlag     = (locked ? -1 : (flowSaved ? 1 : 0));					// 保存ボタン
	var saveNextFlag = ((locked || lastFlow) ? -1 : (flowSaved ? 1 : 0));	// 保存＆次へボタン

	if (this.isMynumberAttached) {
		submitFlag = 1;
	}
	this.isMynumberAttached = false;

	teasp.dialog.ChangeHRMEmp.activeButton("requestEventForm_DeleteBtn" , deleteFlag  , 'red-button1'); // 削除ボタン
	teasp.dialog.ChangeHRMEmp.activeButton("requestEventForm_SubmitBtn" , submitFlag  , 'std-button1'); // 申請ボタン
	teasp.dialog.ChangeHRMEmp.activeButton("requestFlowForm_SaveBtn"    , saveFlag    , 'std-button1'); // 保存ボタン
	teasp.dialog.ChangeHRMEmp.activeButton("requestFlowForm_SaveNextBtn", saveNextFlag, 'std-button1'); // 保存＆次へボタン
	teasp.dialog.ChangeHRMEmp.activeButton("requestFlowForm_NextBtn"    , nextFlag    , 'std-button1'); // 次へボタン
};

/**
 * ステータスのリンクのクリックで承認履歴画面を開く
 */
teasp.dialog.ChangeHRMEmp.prototype.showSteps = function() {
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
teasp.dialog.ChangeHRMEmp.prototype.cancelRequest = function(steps, callback) {
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
teasp.dialog.ChangeHRMEmp.prototype.doCancelRequest = function(comment) {
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

teasp.dialog.ChangeHRMEmp.prototype.getDispListValue = function(fieldNaame, orgValue) {
	var opList = this.optionsList;
	var options = opList[fieldNaame];
	for ( var i = 0 ; i < options.length ; i++ ) {
		var optionObj = options[i];
		if(optionObj.value == orgValue) {
			return optionObj.label;
		}
	}
	return (typeof orgValue !== 'undefined' && orgValue !== null) ? orgValue : '';
};

/**
 * @override
 */
teasp.dialog.ChangeHRMEmp.prototype.hide = function(){
	this.free();
	this.dialog.destroy();
	teasp.manager.dialogRemove('ChangeHRMEmp');
};

/**
 * validateInvalidFieldForm
 * 現在のフローの入力フォームから無効な選択リスト値が選択されている項目を返す
 * @param registeredFields フローを開いた時に無効な選択リスト値を含んでいた項目
 */
teasp.dialog.ChangeHRMEmp.prototype.validateInvalidFieldForm = function(registeredFields){
	var tbody = dojo.byId( "requestEditForm_tbody" );

	dojo.query('select', tbody).forEach(function(el){
		var fieldName = dojo.getAttr(el, "fieldName");
		if(fieldName !== 'SelectTarget__c') {
			// 変更対象を選択する選択リスト以外を対象とする(口座情報の変更、家族情報の変更の変更対象)
			var isFound = false;
			registeredFields.forEach(function(registeredField, index){
				if(registeredField.fieldName === fieldName && registeredField.value === el.value) {
					// 無効な選択リスト値と一致している場合
					isFound = true;
					// 無効な選択リスト値を含むフローの情報を保持する
					// 選択リスト型項目が1つの変更申請の中で1フローにしか存在しないことを前提としている
					var showSection = this.showFlow.flowParts[0].showSection;
					var flowName = this.showFlow.name;
					this.invalidFlow = {
						showSection: showSection,
						name: flowName
					}
					var isFoundInFields = false;
					// 無効な選択リスト値を持つ項目として保持されているかを確認する
					this.invalidValuePickListFields.forEach(function(invalidField) {
						if(invalidField.fieldName === registeredField.fieldName) {
							// 既に無効な値を持つ項目として登録されているので何もしない
							isFoundInFields = true;
						}
					});
					if(!isFoundInFields) {
						// 無効な値を持つ項目として登録する
						this.invalidValuePickListFields.push(registeredField);
					}
				}
			}, this);
			if(!isFound) {
				// 無効な値が選択されていなかった場合
				this.invalidValuePickListFields.forEach(function(invalidField, index) {
					if(invalidField.fieldName === fieldName) {
						// 無効な値が選択されていなかった選択リスト項目が無効な値を持つ項目として保持されている場合は消去する
						// spliceはループ中で1度だけ実行される
						this.invalidValuePickListFields.splice(index, 1);
					}
				}, this);
			}
		}
	}, this);

}

/**
 * openInvalidFieldAlert 無効な選択リスト値が含まれている場合にダイアログを表示する
 * @param invalidFieldList 無効な選択リスト項目
 */
teasp.dialog.ChangeHRMEmp.prototype.openInvalidFieldAlert = function(invalidFieldList){
	var message = teasp.message.getLabel('em10004300');

	var requestEventFields = [];
	// 現在ダイアログで開いている変更申請に属する項目を集約する
	Object.keys(this.fieldList).forEach(function(flowName) {
		if(this.fieldList[flowName].foreignKey === this.foreignKey) {
			this.fieldList[flowName].fields.forEach(function(field) {
				requestEventFields.push(field);
			});
		}
	}, this);

	var invalidFieldLabelValueMaps = []; // 無効な選択リスト型項目の項目名(ラベル)と値

	// 無効な選択リスト値を持つ項目のラベルと値のセットを作成する
	requestEventFields.forEach(function(field) {
		invalidFieldList.forEach(function(invalidField) {
			if(field.fieldName === invalidField.fieldName ||
				field.name === invalidField.fieldName) {
				// 項目名が一致する場合にラベルと値を格納
				if(this.isEnglishAndOldPeople(invalidField)) {
					invalidFieldLabelValueMaps.push({label:field.label, value:this.OLD_PEOPLE_ENGLISH_LABEL});
				} else {
					invalidFieldLabelValueMaps.push({label:field.label, value:invalidField.value});
				}
			}
		}, this);
	}, this);

	// ダイアログに表示するための項目ラベルと値のペアの文字列を生成する
	invalidFieldLabelValueMaps.forEach(function(map) {
		message += map.label + ' : ' + map.value + '\n'
	});

	// ダイアログを表示する
	window.alert(message);
}

/**
 * validatePickListField 保存されている選択リスト値と定義されている選択リスト値を比較し
 * 無効な選択リスト値を持つ項目の一覧を生成する(保存済みのダイアログを開いた際にのみ実行)
 * @param savedFields
 * @param definedFields
 * @param isSelectingTarget
 */
teasp.dialog.ChangeHRMEmp.prototype.validatePickListField = function(savedFields, definedFields, isSelectingTarget){
	if(!this.isLock()) {
		// 申請済み・申請待ちでない場合

		// refKeyの形式に変換する
		// Ex) TemDependents__c => Dependents__r

		var nameSeparetor = '__';
		var rawType;
		var type;
		if(savedFields.attributes && savedFields.attributes.type &&
			savedFields.attributes.type.split(nameSeparetor).length > 2) {
				// 名前空間が先頭に付与されている場合は除去する
				// Ex) TSHRM__TemDependents__c => TemDependents__c
				rawType = savedFields.attributes.type;
				type = rawType.substring(rawType.indexOf(nameSeparetor) + nameSeparetor.length);
		}

		var ref;
		if(type) {
			ref = type.slice(3);
		} else {
			ref = savedFields.attributes && savedFields.attributes.type && savedFields.attributes.type.slice(3);
		}

		var refKey = ref && ref.slice(0, ref.length-1) + 'r';

		Object.keys(savedFields).forEach(function(savedFieldName) {
			// マスタの項目API参照名と社員情報変更申請の項目API参照名に差異がある場合は
			// 社員情報変更申請の項目API参照名に変換する
			var definedFieldName = this.convertMasterFieldNameToChangeRequest(savedFieldName, refKey)

			if(definedFields[definedFieldName] && savedFieldName !== 'TsDisplayMyNumber__c') {
				// 個人番号項目は検証対象外
				// (家族情報の個人番号がマスク化されている場合に選択リスト値定義外の値が含まれるため)
					var isFound = false;
					var savedValue =
						isSelectingTarget ? savedFields[savedFieldName] : savedFields[savedFieldName].value;

					definedFields[definedFieldName].forEach(function(definedPickListValue) {
						if(definedPickListValue.value === savedValue
							|| savedValue === null) {
							// 定義された選択リスト値と保存された選択リスト値が一致する場合
							// または家族情報・口座情報の変更申請の場合に空の選択リスト値が保存されている
							// (=値が保存されていない場合は無効な選択リスト値として登録しない)
							isFound = true;
						}
					});
				// 無効な選択リスト値を持つ項目を保持する
				if(!isFound) {
					// 定義された選択リスト値と保存された選択リスト値が一致しない場合(=無効)

					this.invalidValuePickListFields.push(
						{
							fieldName: definedFieldName,
							value: savedValue
						});
				}
			}
		},this);

		// 検証に利用する無効な選択リスト値を持つ項目(不変)
		this.constInvalidValuePickListFields = dojo.clone(this.invalidValuePickListFields);
	}

}

/**
 * isEnglishAndOldPeople 言語設定が英語かつ扶養控除区分項目の値が老人かどうかを判定する
 * @param field 検証対象の項目
 */
teasp.dialog.ChangeHRMEmp.prototype.isEnglishAndOldPeople = function(field) {
	if((teasp.message.getLanguageLocaleKey() !== 'ja'
		&& teasp.message.getLanguageLocaleKey() !== 'ja_JP')
		&& (field.fieldName === 'SocialInsuranceDivision__c'
		&& field.value === '老人')) {
			return true;
	} else {
		return false;
	}
}

/**
 * マスタオブジェクトの項目API参照名を社員情報変更申請オブジェクトのAPI参照名に変換する
 * @param {String} fieldName マスタオブジェクトの項目API参照名
 * @param {String} refKey マスタオブジェクトのAPI参照名(r) (ex Dependents__r)
 * @return {String} fieldName 社員情報変更申請オブジェクトのAPI参照名
 */
teasp.dialog.ChangeHRMEmp.prototype.convertMasterFieldNameToChangeRequest = function(fieldName, refKey) {
	var nameMap = this.CHANGE_REQUEST_FIELD_NAME_MAP;
	if(nameMap.hasOwnProperty(refKey)) {
		// マッピングにオブジェクトのAPI参照名が定義されている場合
		var changeRequestFieldName = Object.keys(nameMap[refKey])
			.reduce(
				function(acc, key) { return nameMap[refKey][key] === fieldName ? key : acc }, null
			);
		// マッピングにAPI参照名が定義されていなければ変換の必要がないため
		// マスタオブジェクトのAPI参照名を格納する
		fieldName = changeRequestFieldName ? changeRequestFieldName : fieldName;
	}

	return fieldName;
}

/**
 * 社員情報変更申請オブジェクトの項目API参照名をマスタオブジェクトのAPI参照名に変換する
 * @param {String} fieldName 社員情報変更申請オブジェクトの項目API参照名
 * @param {String} refKey マスタオブジェクトのAPI参照名(r) (ex Dependents__r)
 * @return {String} fieldName マスタオブジェクトのAPI参照名
 */
teasp.dialog.ChangeHRMEmp.prototype.convertChangeRequestFieldNameToMaster = function(fieldName, refKey) {
	var nameMap = this.CHANGE_REQUEST_FIELD_NAME_MAP;

	if(nameMap.hasOwnProperty(refKey)
		&& nameMap[refKey].hasOwnProperty(fieldName)) {
		// マッピングにオブジェクトのAPI参照名と項目のAPI参照名が定義されている場合
		fieldName = nameMap[refKey][fieldName];
	}

	return fieldName;
}

/**
 * 家族情報登録申請、家族情報変更申請時の、入力補助機能。
 * 住所を家族の住所入力欄へコピーする。
 */
teasp.dialog.ChangeHRMEmp.prototype.copyToInputFormAddressInfo = function(){
	dojo.byId('PostalCode__c').value =   this.getEmployeeAddressInfo('PostalCode__c' );
	dojo.byId('State__c').value =        this.getEmployeeAddressInfo('State__c'      );
	dojo.byId('City__c').value =         this.getEmployeeAddressInfo('City__c'       );
	dojo.byId('Street__c').value =       this.getEmployeeAddressInfo('Street__c'     );
	dojo.byId('State_Kana__c').value =   this.getEmployeeAddressInfo('State_Kana__c' );
	dojo.byId('City_Kana__c').value =    this.getEmployeeAddressInfo('City_Kana__c'  );
	dojo.byId('Street_Kana__c').value =  this.getEmployeeAddressInfo('Street_Kana__c');
	this.blurField();
}

/**
 * 住所変更申請時の、入力補助機能。
 * 住所を住所（住民票）入力欄へコピーする。
 */
teasp.dialog.ChangeHRMEmp.prototype.copyToInputFormResidentAddressInfo = function(){
	dojo.byId('PostalCode_Resident__c').value =  this.getDispValue('PostalCode__c' , 'String');
	dojo.byId('State_Resident__c').value =       this.getDispValue('State__c'      , 'String');
	dojo.byId('City_Resident__c').value =        this.getDispValue('City__c'       , 'String');
	dojo.byId('Street_Resident__c').value =      this.getDispValue('Street__c'     , 'String');
	dojo.byId('State_Resident_Kana__c').value =  this.getDispValue('State_Kana__c' , 'String');
	dojo.byId('City_Resident_Kana__c').value =   this.getDispValue('City_Kana__c'  , 'String');
	dojo.byId('Street_Resident_Kana__c').value = this.getDispValue('Street_Kana__c', 'String');
	this.blurField();
}

/**
 * 現在のmaster情報を返す。
 * 局所的に使用するため、文字列型以外は考慮しない。
 * @param infield 取得したいフィールド名
 * @return 現在のmaster値。masterデータ取得失敗時は空文字。
 */
teasp.dialog.ChangeHRMEmp.prototype.getEmployeeAddressInfo = function(infield){

	var value;
	var employee = this.employee;

	if(employee && employee.hasOwnProperty(infield)) {
		value = employee[infield];
	}

	return ( typeof value !== 'undefined' && value !== null ) ? value : '';
}
