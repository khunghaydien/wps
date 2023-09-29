/**
 * 画面表示の定義情報
 * @see teasp.Tsf.InfoBase.prototype.patchDef 定義情報を変更することがある
 */
teasp.Tsf = {
	ROOT_AREA_ID        : 'tsfArea',            // アプリケーションのルートエリア
	BODY_CELL           : 'bodyCell',           // Salesforce領域のアプリケーションセルのID
	HANDLEBAR_CONTAINER : 'handlebarContainer', // Salesforce領域のサイドバー開閉ボタンのID
	HKEY_HOLD_CSS       : 'ts-row-seq',         //
	JOB_CODE_NAME_DIV   : ' ',                  // ジョブコード＋ジョブ名の間に挟む文字
	EXP_PRE_FORM1       : '出張・交通費',
	EXP_PRE_FORM2       : '会議・交際費',
	EXP_PRE_FORM3       : '一般経費',
	EXP_PRE_FORM4       : '仮払申請',
	JPY                 : 'JPY',
	ITEM_EXTERNAL       : 'external',
	formParams : {
		//------------------------------------------
		// 経費事前申請一覧
		//------------------------------------------
		ListExpPreApply : {
			discernment : 'expPreApplyList',
			objectName  : 'AtkExpPreApply__c',
			type        : 'table',
			formCss     : 'ts-exp-pre-apply-list',
			rowLimit    : 20,
			stereoType  : true,
			piw         : true,
			fields : [
				{ label: 'ID'                                        , apiKey: 'Id'                          , domId: 'ExpPre{0}ListId'                       , domType: 'text'     , hidden: true },
				{ label: '経費事前申請名'                            , apiKey: 'Name'                        , domId: 'ExpPre{0}ListName'                     , domType: 'text'     , hidden: true },
				{ label: '生成日時'                                  , apiKey: 'CreatedDate'                 , domId: 'ExpPre{0}ListCreatedDate'              , domType: 'datetime' , hidden: true },
				{ label: '最終更新日時'                              , apiKey: 'LastModifiedDate'            , domId: 'ExpPre{0}ListLastModifiedDate'         , domType: 'datetime' , hidden: true },
				{ label: '社員ID'                                    , apiKey: 'EmpId__c'                    , domId: 'ExpPre{0}ListEmpId__c'                 , domType: 'text'     , hidden: true },
				{ label: '帰着予定日'                                , apiKey: 'EndDate__c'                  , domId: 'ExpPre{0}ListEndDate__c'               , domType: 'date'     , hidden: true },
				{ label: '精算申請状態'                              , apiKey: '_childStatus'                , domId: 'ExpPre{0}List_ChildStatus'             , domType: 'text'     , hidden: true },
				{ label: '申請'          , msgId: 'apply_btn_title'  , apiKey: 'StatusD__c'                  , domId: 'ExpPre{0}ListStatus'                   , domType: 'status'   , width:  24   , sortable:true },
				{ label: '申請日付'      , msgId: 'tf10001290'       , apiKey: 'ApplyTime__c'                , domId: 'ExpPre{0}ListApplyTime'                , domType: 'datetime', dspType: 'date', width:  76   , sortable:true },
				{ label: '申請番号'      , msgId: 'expApplyNo_label' , apiKey: 'ExpPreApplyNo__c'            , domId: 'ExpPre{0}ListExpPreApplyNo'            , domType: 'text'     , width:  76   , sortable:true, link: true },
				{ label: '件名'          , msgId: 'tk10004320'       , apiKey: 'Title__c'                    , domId: 'ExpPre{0}ListTitle'                    , domType: 'text'     , width: '25%' , sortable:true, link: true },
				{ label: '社員名'        , msgId: 'empName_label'    , apiKey: 'EmpId__r.Name'               , domId: 'ExpPre{0}ListEmpName'                  , domType: 'text'     , width: '10%' , sortable:true },
				{ label: '種別'          , msgId: 'tk10000262'       , apiKey: 'Type__c'                     , domId: 'ExpPre{0}ListType'                     , domType: 'select'   , width: '12%' , sortable:true, pickList: [{v:'',n:''},{v:'出張・交通費',msgId:'tf10001410'},{v:'会議・交際費',msgId:'tf10000600'},{v:'一般経費',msgId:'tf10001420'},{v:'仮払申請',msgId:'tf10006120'}] },
				{ label: '予定日'        , msgId: 'tf10000620'       , apiKey: 'StartDate__c'                , domId: 'ExpPre{0}ListStartDate'                , domType: 'date'     , width:  76   , sortable:true },
				{ label: '精算'          , msgId: 'tf10000630'       , apiKey: '_payStatus'                  , domId: 'ExpPre{0}ListPayStatus'                , domType: 'status'   , width:  24                   },
				{ label: '金額'          , msgId: 'expCost_head'     , apiKey: 'TotalAmount__c'              , domId: 'ExpPre{0}ListTotalAmount'              , domType: 'currency' , width:  50   , sortable:true },
				{ label: '仮払金額'      , msgId: 'tf10000530'       , apiKey: 'ProvisionalPaymentAmount__c' , domId: 'ExpPre{0}ListProvisionalPaymentAmount' , domType: 'currency' , width:  50   , sortable:true }
			],
			foots : [
				{ colSpan: 7 },
				{ colSpan: 2, name: '合計', align: 'center' },
				{  },
				{  }
			],
			sortKeys : [
				{ apiKey: 'ExpPreApplyNo__c', desc: true }
			],
			filts    : [
				{ apiKey: "_childStatus", value: '精算済み以外' } /** @see teasp.Tsf.ListExpPreApply constructor */
			],
			childFilts    : [
				{ filtVal: "StatusD__c = '精算済み'" , nega:true } /** @see teasp.Tsf.ListExpPreApply constructor */
			],
			children : {
				ExpApplications__r : {
					fields: [
						{ apiKey: 'Id'         },
						{ apiKey: 'StatusD__c' }
					]
				}
			}
		},
		//------------------------------------------
		// 経費申請一覧
		//------------------------------------------
		ListExpApply : {
			discernment   : 'expApplyList',
			objectName    : 'AtkExpApply__c',
			type          : 'table',
			formCss       : 'ts-exp-apply-list',
			rowLimit      : 20,
			stereoType    : true,
			irregularType : 'expApplyList',
			piw           : true,
			fields : [
				{ label: 'ID'                                        , apiKey: 'Id'                          , domId: 'ExpList{0}ListId'                       , domType: 'text'     , hidden: true },
				{ label: '経費申請名'                                , apiKey: 'Name'                        , domId: 'ExpList{0}ListName'                     , domType: 'text'     , hidden: true },
				{ label: '生成日時'                                  , apiKey: 'CreatedDate'                 , domId: 'ExpList{0}ListCreatedDate'              , domType: 'datetime' , hidden: true },
				{ label: '最終更新日時'                              , apiKey: 'LastModifiedDate'            , domId: 'ExpList{0}ListLastModifiedDate'         , domType: 'datetime' , hidden: true },
				{ label: '社員ID'                                    , apiKey: 'EmpId__c'                    , domId: 'ExpList{0}ListEmpId__c'                 , domType: 'text'     , hidden: true },
				{ label: 'ステータス'                                , apiKey: 'StatusC__c'                  , domId: 'ExpList{0}ListStatusC'                  , domType: 'status'   , hidden: true },
				{ label: '申請'          , msgId: 'apply_btn_title'  , apiKey: 'StatusD__c'                  , domId: 'ExpList{0}ListStatus'                   , domType: 'status'   , width:  30   , sortable:true, subType:'status' },
				{ label: '申請日付'      , msgId: 'tf10001290'       , apiKey: 'ApplyTime__c'                , domId: 'ExpList{0}ListApplyTime'                , domType: 'datetime', dspType: 'date', width:  76   , sortable:true },
				{ label: '申請番号'      , msgId: 'expApplyNo_label' , apiKey: 'ExpApplyNo__c'               , domId: 'ExpList{0}ListExpApplyNo'               , domType: 'text'     , width: 100   , sortable:true, link: true },
				{ label: '社員コード'    , msgId: 'empCode_label'    , apiKey: 'EmpId__r.EmpCode__c'         , domId: 'ExpList{0}ListEmpCode'                  , domType: 'text'     , width: '9%'  , sortable:true },
				{ label: '社員名'        , msgId: 'empName_label'    , apiKey: 'EmpId__r.Name'               , domId: 'ExpList{0}ListEmpName'                  , domType: 'text'     , width: '10%' , sortable:true },
				{ label: '支払日'        , msgId: 'tf10000590'       , apiKey: 'payDate__c'                  , domId: 'ExpList{0}payDate'                      , domType: 'date'     , width:  76   , sortable:true },
				{ label: '日付(from)'    , msgId: 'tf10000640'       , apiKey: 'StartDate__c'                , domId: 'ExpList{0}ListStartDate'                , domType: 'date'     , width:  76   , sortable:true },
				{ label: '日付(to)'      , msgId: 'tf10000650'       , apiKey: 'EndDate__c'                  , domId: 'ExpList{0}ListEndDate'                  , domType: 'date'     , width:  76   , sortable:true },
				{ label: '事前申請番号'  , msgId: 'tf10001100'       , apiKey: 'ExpPreApplyId__r.ExpPreApplyNo__c', domId: 'ExpList{0}ExpPreApplyNo'           , domType: 'text'     , width: 100   , sortable:true, align:'center' },
				{ label: '件名'          , msgId: 'tk10004320'       , apiKey: 'TitleD__c'                   , domId: 'ExpList{0}Title'                        , domType: 'text'     , width: 130   , sortable:true },
				{ label: '金額'          , msgId: 'expCost_head'     , apiKey: 'TotalCost__c'                , domId: 'ExpList{0}ListTotalCost'                , domType: 'currency' , width:  50   , sortable:true },
				{ label: '仮払金額'      , msgId: 'tf10000530'       , apiKey: 'ProvisionalPaymentAmount__c' , domId: 'ExpList{0}ListProvisionalPaymentAmount' , domType: 'currency' , width:  50   , sortable:true }
			],
			sortKeys : [
				{ apiKey: 'ExpApplyNo__c', desc: true }
			],
			filts    : [
				{ filtVal: "Removed__c = false", fix: true },
				{ apiKey: "StatusD__c", value: '精算済み以外' } /** @see teasp.Tsf.ListExpApply constructor */
			]
		},
		//------------------------------------------
		// 経費精算一覧
		//------------------------------------------
		// 経費精算/本人立替分
		//------------------------------------------
		ListExpPay1 : {
			discernment : 'expPayList1',
			objectName  : 'AtkExpApply__c',
			type        : 'table',
			formCss     : 'ts-exp-pay-list1',
			rowLimit    : 200,
			pageLimit   : 10,
			stereoType  : true,
			payManage   : 1,
			fields : [
				{ label: 'ID'                                        , apiKey: 'Id'                                           , domId: 'ExpPay1{0}Id'                       , domType: 'text'     , hidden: true },
				{ label: '経費申請名'                                , apiKey: 'Name'                                         , domId: 'ExpPay1{0}Name'                     , domType: 'text'     , hidden: true },
				{ label: '生成日時'                                  , apiKey: 'CreatedDate'                                  , domId: 'ExpPay1{0}CreatedDate'              , domType: 'datetime' , hidden: true },
				{ label: '最終更新日時'                              , apiKey: 'LastModifiedDate'                             , domId: 'ExpPay1{0}LastModifiedDate'         , domType: 'datetime' , hidden: true },
				{ label: '社員ID'                                    , apiKey: 'EmpId__c'                                     , domId: 'ExpPay1{0}EmpId__c'                 , domType: 'text'     , hidden: true },
				{ label: '日付'                                      , apiKey: 'EndDate__c'                                   , domId: 'ExpPay1{0}EndDate__c'               , domType: 'date'     , hidden: true },
				{ check: true                                                                                                 , domId: 'ExpPay1{0}_Check'                   , domType: 'checkbox' , width:  24   , paychk: true },
				{ label: '申請'          , msgId: 'apply_btn_title'  , apiKey: 'StatusD__c'                                   , domId: 'ExpPay1{0}Status'                   , domType: 'status'   , width:  24   , sortable:true },
				{ label: '申請日付'      , msgId: 'tf10001290'       , apiKey: 'ApplyTime__c'                                 , domId: 'ExpPay1{0}ApplyTime'                , domType: 'datetime', dspType: 'date', width:  76   , sortable:true },
				{ label: '申請番号'      , msgId: 'expApplyNo_label' , apiKey: 'ExpApplyNo__c'                                , domId: 'ExpPay1{0}ExpApplyNo'               , domType: 'text'     , width: '8%'  , sortable:true, link: true },
				{ label: '部署名'        , msgId: 'tk10000335'       , apiKey: 'DeptId__r.Name'                               , domId: 'ExpPay1{0}DeptName'                 , domType: 'text'     , width: '15%' , sortable:true },
				{ label: '社員コード'    , msgId: 'empCode_label'    , apiKey: 'EmpId__r.EmpCode__c'                          , domId: 'ExpPay1{0}EmpCode'                  , domType: 'text'     , width: '10%' , sortable:true },
				{ label: '社員名'        , msgId: 'empName_label'    , apiKey: 'EmpId__r.Name'                                , domId: 'ExpPay1{0}EmpName'                  , domType: 'text'     , width: '10%' , sortable:true },
				{ label: '本人立替金額'  , msgId: 'tf10000660'       , apiKey: 'AmountDueToPay__c'                            , domId: 'ExpPay1{0}AmountDueToPay'           , domType: 'currency' , width:  72   , sortable:true },
				{ label: '件名'          , msgId: 'tk10004320'       , apiKey: 'TitleD__c'                                    , domId: 'ExpPay1{0}Title'                    , domType: 'text'     , width: '20%' , sortable:true },
				{ label: '種別'          , msgId: 'tk10000262'       , apiKey: 'TypeD__c'                                     , domId: 'ExpPay1{0}Type'                     , domType: 'select'   , width: '12%' , sortable:true, pickList: [{v:'',n:''},{v:'出張・交通費',msgId:'tf10001410'},{v:'会議・交際費',msgId:'tf10000600'},{v:'一般経費',msgId:'tf10001420'},{v:'仮払申請',msgId:'tf10006120'}] },
				{ label: '利用日付'      , msgId: 'tf10000670'       , apiKey: 'StartDate__c'                                 , domId: 'ExpPay1{0}StartDate'                , domType: 'date'     , width:  76   , sortable:true },
				{ label: '仮払金額'      , msgId: 'tf10000530'       , apiKey: 'ProvisionalPaymentAmount__c'                  , domId: 'ExpPay1{0}ProvisionalPaymentAmount' , domType: 'currency' , width:  72   , sortable:true },
				{ label: '精算実行者'      , msgId: 'tf10011070'       , apiKey: 'SetPaidActorId__r.Name'                  , domId: 'ExpPay1{0}SetPaidActor' , domType: 'text' , width:  72   , sortable:true, mask:2 },
				{ label: '精算実行日時'   , msgId: 'tf10011080'       , apiKey: 'SetPaidTime__c'                  , domId: 'ExpPay1{0}SetPaidTime' , domType: 'datetime' , width:  76   , sortable:true , mask:2 }
			],
			foots : [],
			filts    : [
				{ filtVal: "Removed__c = false", fix: true },
				{ filtVal: "StatusC__c in ('承認済み','確定済み')", fix:true, mask: 1 },
				{ filtVal: "StatusC__c = '精算済み'"              , fix:true, mask: 2 }
			],
			sortKeys : [
				{ apiKey: 'ExpApplyNo__c', desc: true }
			]
		},
		// 経費精算/本人立替分の検索
		searchExpPay1 : {
			title       : ['tf10002070', 'tf10002080'], // 経費精算/本人立替分の検索
			formCss     : 'ts-dialog-search-expPay1',
			type        : 'searchCondition',
			fields      : [
				{ label: '申請日付範囲'    , msgId: 'tf10000680'       , apiKey: 'ApplyTime__c'                                , domId: 'SearchExpApplyTime'               , domType: 'dateRange'      , width: 108, name: 'pay1ApplyTime', dataType: 'dateTime' },
				{ label: '申請番号'        , msgId: 'expApplyNo_label' , apiKey: 'ExpApplyNo__c'                               , domId: 'SearchExpApplyNo'                 , domType: 'text'           , width: 300, matchType:2 },
				{ label: '部署名'          , msgId: 'tk10000335'       , apiKey: 'EmpId__r.DeptId__r.Name'                     , domId: 'SearchExpDeptName'                , domType: 'deptb'          , width: 350, matchType:3, defaultChks:{checkDeptApply:true,checkDeptLayer:true}, optKeys:["DeptId__r.Name like '%{0}%'","(EmpId__r.DeptId__r.Name like '%{0}%' or EmpId__r.DeptId__r.ParentId__r.Name like '%{0}%' or EmpId__r.DeptId__r.ParentId__r.ParentId__r.Name like '%{0}%' or EmpId__r.DeptId__r.ParentId__r.ParentId__r.ParentId__r.Name like '%{0}%')","(DeptId__r.Name like '%{0}%' or DeptId__r.ParentId__r.Name like '%{0}%' or DeptId__r.ParentId__r.ParentId__r.Name like '%{0}%' or DeptId__r.ParentId__r.ParentId__r.ParentId__r.Name like '%{0}%')"] },
				{ label: '社員コード'      , msgId: 'empCode_label'    , apiKey: 'EmpId__r.EmpCode__c'                         , domId: 'SearchExpEmpCode'                 , domType: 'text'           , width: 150, matchType:1 },
				{ label: '社員名'          , msgId: 'empName_label'    , apiKey: 'EmpId__r.Name'                               , domId: 'SearchExpEmpName'                 , domType: 'text'           , width: 300, matchType:3 },
				{ label: '本人立替金額範囲', msgId: 'tf10000690'       , apiKey: 'AmountDueToPay__c'                           , domId: 'SearchExpAmountDueToPay'          , domType: 'currencyRange'  , width: 120, minus:true },
				{ label: '件名'            , msgId: 'tk10004320'       , apiKey: 'TitleD__c'                                   , domId: 'SearchExpTitle'                   , domType: 'text'           , width: 350, matchType:3 },
				{ label: '種別'            , msgId: 'tk10000262'       , apiKey: 'TypeD__c'                                    , domId: 'SearchExpType'                    , domType: 'select'         , width: 200, pickList: [{v:'',n:''},{v:'出張・交通費',msgId:'tf10001410'},{v:'会議・交際費',msgId:'tf10000600'},{v:'一般経費',msgId:'tf10001420'},{v:'仮払申請',msgId:'tf10006120'}] },
				{ label: '利用日付範囲'    , msgId: 'tf10000700'       , apiKey: '_startEnd'                                   , domId: 'SearchExpDate'                    , domType: 'dateRange'      , width: 108, name: 'pay1Date', colNames: ['StartDate__c','EndDate__c'] },
				{ label: '仮払金額範囲'    , msgId: 'tf10000710'       , apiKey: 'ProvisionalPaymentAmount__c'                 , domId: 'SearchExpProvisionalPaymentAmount', domType: 'currencyRange'  , width: 120 },
				{ label: '精算実行者'          , msgId: 'tf10011070'    , apiKey: 'SetPaidActorId__r.Name'                               , domId: 'SearchSetPaidActorName'                 , domType: 'text'           , width: 300, matchType:3, mask:2 },
				{ label: '精算実行日範囲'          , msgId: 'tf10011090'    , apiKey: 'SetPaidTime__c'                               , domId: 'SearchSetPaidTime'                 , domType: 'dateRange'           , width: 108, name: 'pay1SetPaidTime', dataType: 'dateTime' , mask:2 }
			]
		},
		PrintExpPay1 : {
			discernment : 'printExpPay1',
			objectName  : 'AtkExpApply__c',
			type        : 'table',
			formCss     : 'ts-print-exp-pay-list1',
			rowLimit    : 2000,
			stereoType  : true,
			payManage   : 1,
			fields : [
				{ label: 'ID'                                        , apiKey: 'Id'                     , domId: 'PrintExpPay1{0}Id'                , hidden: true },
				{ label: '経費申請名'                                , apiKey: 'Name'                   , domId: 'PrintExpPay1{0}Name'              , hidden: true },
				{ label: '生成日時'                                  , apiKey: 'CreatedDate'            , domId: 'PrintExpPay1{0}CreatedDate'       , hidden: true },
				{ label: '最終更新日時'                              , apiKey: 'LastModifiedDate'       , domId: 'PrintExpPay1{0}LastModifiedDate'  , hidden: true },
				{ label: '社員ID'                                    , apiKey: 'EmpId__c'               , domId: 'PrintExpPay1{0}EmpId__c'          , hidden: true },
				{ label: '部署コード'                                , apiKey: 'EmpId__r.DeptId__r.DeptCode__c', domId: 'PrintExpPay1{0}DeptCode'          , hidden: true },
				{ label: '部署名'                                    , apiKey: 'EmpId__r.DeptId__r.Name'       , domId: 'PrintExpPay1{0}DeptName'          , hidden: true },
				{ label: '社員コード'                                , apiKey: 'EmpId__r.EmpCode__c'    , domId: 'PrintExpPay1{0}EmpCode'           , hidden: true },
				{ label: '社員名'                                    , apiKey: 'EmpId__r.Name'          , domId: 'PrintExpPay1{0}EmpName'           , hidden: true },
				{ label: 'StatusC'                                   , apiKey: 'StatusC__c'             , domId: 'PrintExpPay1{0}StatusC'           , hidden: true },
				{ label: 'StatusD'                                   , apiKey: 'StatusD__c'             , domId: 'PrintExpPay1{0}StatusD'           , hidden: true },
				{ label: '申請番号'      , msgId: 'expApplyNo_label' , apiKey: 'ExpApplyNo__c'          , domId: 'PrintExpPay1{0}ExpApplyNo'        , domType: 'text'     , width: '20%', align:'center' },
				{ label: '金額'          , msgId: 'expCost_head'     , apiKey: 'AmountDueToPay__c'      , domId: 'PrintExpPay1{0}TotalCost'         , domType: 'currency' , width: '10%' },
				{ label: '精算日'        , msgId: 'payDate_label'    , apiKey: 'payDate__c'             , domId: 'PrintExpPay1{0}payDate'           , domType: 'date'     , width: '10%' },
				{ label: '備考(精算時)'  , msgId: 'tf10000720'       , apiKey: 'payMethod__c'           , domId: 'PrintExpPay1{0}payMethod'         , domType: 'text'     , width: '30%' },
				{ label: '申請日時'      , msgId: 'applyTime_label'  , apiKey: 'ApplyTime__c'           , domId: 'PrintExpPay1{0}ApplyTime'         , domType: 'datetime' , width: '10%' },
				{ label: '承認日時'      , msgId: 'tk10000070'       , apiKey: 'ApproveTime__c'         , domId: 'PrintExpPay1{0}ApproveTime'       , domType: 'datetime' , width: '10%' },
				{ label: 'ステータス'    , msgId: 'status_btn_title' , apiKey: '_status'                , domId: 'PrintExpPay1{0}Status'            , domType: 'text'     , width: '10%', align:'center' }
			],
			sortKeys : [
				{ apiKey: 'EmpId__r.EmpCode__c' },
				{ apiKey: 'EmpId__r.Name' },
				{ apiKey: 'ExpApplyNo__c' }
			]
		},
		//------------------------------------------
		// 経費精算/請求書
		//------------------------------------------
		ListExpPay2 : {
			discernment : 'expPayList2',
			objectName  : 'AtkEmpExp__c',
			type        : 'table',
			formCss     : 'ts-exp-pay-list2',
			rowLimit    : 200,
			pageLimit   : 10,
			stereoType  : true,
			fields : [
				{ label: 'ID'                                        , apiKey: 'Id'                                     , domId: 'ExpPay2{0}Id'               , domType: 'text'     , hidden: true },
				{ label: '経費明細名'                                , apiKey: 'Name'                                   , domId: 'ExpPay2{0}Name'             , domType: 'text'     , hidden: true },
				{ label: '生成日時'                                  , apiKey: 'CreatedDate'                            , domId: 'ExpPay2{0}CreatedDate'      , domType: 'datetime' , hidden: true },
				{ label: '最終更新日時'                              , apiKey: 'LastModifiedDate'                       , domId: 'ExpPay2{0}LastModifiedDate' , domType: 'datetime' , hidden: true },
				{ label: '社員ID'                                    , apiKey: 'EmpId__c'                               , domId: 'ExpPay2{0}EmpId__c'         , domType: 'text'     , hidden: true },
				{ label: '経費申請ID'                                , apiKey: 'ExpApplyId__c'                          , domId: 'ExpPay2{0}ExpApplyId'       , domType: 'text'     , hidden: true },
				{ check: true                                                                                           , domId: 'ExpPay2{0}_Check'           , domType: 'checkbox' , width: 24   , paychk: true },
				{ label: '申請'          , msgId: 'apply_btn_title'  , apiKey: 'ExpApplyId__r.StatusD__c'               , domId: 'ExpPay2{0}Status'           , domType: 'status'   , width: 30   , sortable:true },
				{ label: '支払先'        , msgId: 'tf10000580'       , apiKey: 'PayeeId__r.Name'                        , domId: 'ExpPay2{0}PayeeName'        , domType: 'text'     , width: '15%', sortable:true },
				{ label: '支払日'        , msgId: 'tf10000590'       , apiKey: 'PaymentDate__c'                         , domId: 'ExpPay2{0}PaymentDate'      , domType: 'date'     , width: 76   , sortable:true },
				{ label: '申請番号'      , msgId: 'expApplyNo_label' , apiKey: 'ExpApplyId__r.ExpApplyNo__c'            , domId: 'ExpPay2{0}ExpApplyNo'       , domType: 'text'     , width: 100  , sortable:true, link: true },
				{ label: '部署名'        , msgId: 'tk10000335'       , apiKey: 'ExpApplyId__r.DeptId__r.Name'           , domId: 'ExpPay2{0}DeptName'         , domType: 'text'     , width: '15%', sortable:true },
				{ label: '社員コード'    , msgId: 'empCode_label'    , apiKey: 'EmpId__r.EmpCode__c'                    , domId: 'ExpPay2{0}EmpCode'          , domType: 'text'     , width: '10%', sortable:true },
				{ label: '社員名'        , msgId: 'empName_label'    , apiKey: 'EmpId__r.Name'                          , domId: 'ExpPay2{0}EmpName'          , domType: 'text'     , width: '10%', sortable:true },
				{ label: '金額'          , msgId: 'expCost_head'     , apiKey: 'Cost__c'                                , domId: 'ExpPay2{0}Cost'             , domType: 'currency' , width: 72   , sortable:true },
				{ label: '件名'          , msgId: 'tk10004320'       , apiKey: 'ExpApplyId__r.TitleD__c'                , domId: 'ExpPay2{0}Title'            , domType: 'text'     , width: '15%', sortable:true },
				{ label: '種別'          , msgId: 'tk10000262'       , apiKey: 'ExpApplyId__r.TypeD__c'                 , domId: 'ExpPay2{0}PreType'          , domType: 'select'   , width: '10%', sortable:true, pickList: [{v:'',n:''},{v:'出張・交通費',msgId:'tf10001410'},{v:'会議・交際費',msgId:'tf10000600'},{v:'一般経費',msgId:'tf10001420'},{v:'仮払申請',msgId:'tf10006120'}] },
				{ label: '利用日付'      , msgId: 'tf10000670'       , apiKey: 'Date__c'                                , domId: 'ExpPay2{0}Date'             , domType: 'date'     , width: 76   , sortable:true },
				{ label: '精算実行者'      , msgId: 'tf10011070'       , apiKey: 'SetPaidActorId__r.Name'                  , domId: 'ExpPay2{0}SetPaidActor' , domType: 'text' , width:  72   , sortable:true, mask:2 },
                { label: '精算実行日時'   , msgId: 'tf10011080'       , apiKey: 'SetPaidTime__c'                  , domId: 'ExpPay2{0}SetPaidTime' , domType: 'datetime' , width:  76   , sortable:true , mask:2 }
			],
			foots : [],
			filts    : [
				{ filtVal: "ExpApplyId__r.Removed__c = false"                              , fix:true },
				{ filtVal: "ExpApplyId__r.StatusC__c in ('承認済み','確定済み','精算済み')", fix:true },
				{ filtVal: "PayeeId__r.PayeeType__c = '2'"                                 , fix:true },
				{ filtVal: "IsPaid__c = false", fix:true, mask: 1 },
				{ filtVal: "IsPaid__c = true" , fix:true, mask: 2 }
			],
			sortKeys : [
				{ apiKey: 'ExpApplyId__r.ExpApplyNo__c', desc: true },
				{ apiKey: 'Date__c'   },
				{ apiKey: 'Order__c'  },
				{ apiKey: 'Id'        }
			]
		},
		// 経費精算/請求書の検索
		searchExpPay2 : {
			title       : ['tf10002070', 'tf10002090'], // 経費精算/請求書の検索
			formCss     : 'ts-dialog-search-expPay2',
			type        : 'searchCondition',
			fields      : [
				{ label: '支払先'        , msgId: 'tf10000580'       , apiKey: 'PayeeId__r.Name'                        , domId: 'SearchExpPayeeName'     , domType: 'text'           , width: 300, matchType:3 },
				{ label: '支払日範囲'    , msgId: 'tf10000730'       , apiKey: 'PaymentDate__c'                         , domId: 'SearchExpPaymentDate'   , domType: 'dateRange'      , width: 108, name: 'pay2PayDate' },
				{ label: '申請番号'      , msgId: 'expApplyNo_label' , apiKey: 'ExpApplyId__r.ExpApplyNo__c'            , domId: 'SearchExpApplyNo'       , domType: 'text'           , width: 300, matchType:2 },
				{ label: '部署名'        , msgId: 'tk10000335'       , apiKey: 'EmpId__r.DeptId__r.Name'                , domId: 'SearchExpDeptName'      , domType: 'deptb'          , width: 350, matchType:3, defaultChks:{checkDeptApply:true,checkDeptLayer:true}, optKeys:["ExpApplyId__r.DeptId__r.Name like '%{0}%'", "(EmpId__r.DeptId__r.Name like '%{0}%' or EmpId__r.DeptId__r.ParentId__r.Name like '%{0}%' or EmpId__r.DeptId__r.ParentId__r.ParentId__r.Name like '%{0}%' or EmpId__r.DeptId__r.ParentId__r.ParentId__r.ParentId__r.Name like '%{0}%')", "(ExpApplyId__r.DeptId__r.Name like '%{0}%' or ExpApplyId__r.DeptId__r.ParentId__r.Name like '%{0}%' or ExpApplyId__r.DeptId__r.ParentId__r.ParentId__r.Name like '%{0}%' or ExpApplyId__r.DeptId__r.ParentId__r.ParentId__r.ParentId__r.Name like '%{0}%')"] },
				{ label: '社員コード'    , msgId: 'empCode_label'    , apiKey: 'EmpId__r.EmpCode__c'                    , domId: 'SearchExpEmpCode'       , domType: 'text'           , width: 150, matchType:1 },
				{ label: '社員名'        , msgId: 'empName_label'    , apiKey: 'EmpId__r.Name'                          , domId: 'SearchExpEmpName'       , domType: 'text'           , width: 300, matchType:3 },
				{ label: '金額範囲'      , msgId: 'tf10000740'       , apiKey: 'Cost__c'                                , domId: 'SearchExpCost'          , domType: 'currencyRange'  , width: 120, minus:true },
				{ label: '件名'          , msgId: 'tk10004320'       , apiKey: 'ExpApplyId__r.TitleD__c'                , domId: 'SearchExpTitle'         , domType: 'text'           , width: 300, matchType:3 },
				{ label: '種別'          , msgId: 'tk10000262'       , apiKey: 'ExpApplyId__r.TypeD__c'                 , domId: 'SearchExpType'          , domType: 'select'         , width: 200, pickList: [{v:'',n:''},{v:'出張・交通費',msgId:'tf10001410'},{v:'会議・交際費',msgId:'tf10000600'},{v:'一般経費',msgId:'tf10001420'},{v:'仮払申請',msgId:'tf10006120'}] },
				{ label: '利用日付範囲'  , msgId: 'tf10000700'       , apiKey: 'Date__c'                                , domId: 'SearchExpDate'          , domType: 'dateRange'      , width: 108, name: 'date' },
				{ label: '精算実行者'          , msgId: 'tf10011070'    , apiKey: 'SetPaidActorId__r.Name'                               , domId: 'SearchSetPaidActorName'                 , domType: 'text'           , width: 300, matchType:3, mask:2 },
                { label: '精算実行日範囲'          , msgId: 'tf10011090'    , apiKey: 'SetPaidTime__c'                               , domId: 'SearchSetPaidTime'                 , domType: 'dateRange'           , width: 108, name: 'pay2SetPaidTime', dataType: 'dateTime' , mask:2 }
			]
		},
		PrintExpPay2 : {
			discernment : 'printExpPay2',
			objectName  : 'AtkEmpExp__c',
			type        : 'table',
			formCss     : 'ts-print-exp-pay-list2',
			rowLimit    : 2000,
			fields : [
				{ label: 'ID'                                        , apiKey: 'Id'                                   , domId: 'PrintExpPay2{0}Id'                , hidden: true },
				{ label: '経費申請名'                                , apiKey: 'ExpApplyId__r.Name'                   , domId: 'PrintExpPay2{0}Name'              , hidden: true },
				{ label: '生成日時'                                  , apiKey: 'CreatedDate'                          , domId: 'PrintExpPay2{0}CreatedDate'       , hidden: true },
				{ label: '最終更新日時'                              , apiKey: 'LastModifiedDate'                     , domId: 'PrintExpPay2{0}LastModifiedDate'  , hidden: true },
				{ label: '支払い済み'                                , apiKey: 'IsPaid__c'                            , domId: 'PrintExpPay2{0}IsPaid'            , hidden: true },
				{ label: '支払先'                                    , apiKey: 'PayeeId__r.Name'                      , domId: 'PrintExpPay2{0}PayeeName'         , hidden: true },
				{ label: '支払日'                                    , apiKey: 'PaymentDate__c'                       , domId: 'PrintExpPay2{0}PaymentDate'       , hidden: true },
				{ label: '社員ID'                                    , apiKey: 'EmpId__c'                             , domId: 'PrintExpPay2{0}EmpId__c'          , hidden: true },
				{ label: '部署コード'                                , apiKey: 'EmpId__r.DeptId__r.DeptCode__c'       , domId: 'PrintExpPay2{0}DeptCode'          , hidden: true },
				{ label: '部署名'                                    , apiKey: 'EmpId__r.DeptId__r.Name'              , domId: 'PrintExpPay2{0}DeptName'          , hidden: true },
				{ label: '社員コード'                                , apiKey: 'EmpId__r.EmpCode__c'                  , domId: 'PrintExpPay2{0}EmpCode'           , hidden: true },
				{ label: '社員名'                                    , apiKey: 'EmpId__r.Name'                        , domId: 'PrintExpPay2{0}EmpName'           , hidden: true },
				{ label: 'StatusC'                                   , apiKey: 'ExpApplyId__r.StatusC__c'             , domId: 'PrintExpPay2{0}StatusC'           , hidden: true },
				{ label: '申請番号'      , msgId: 'expApplyNo_label' , apiKey: 'ExpApplyId__r.ExpApplyNo__c'          , domId: 'PrintExpPay2{0}ExpApplyNo'        , domType: 'text'     , width: '20%', align:'center' },
				{ label: '金額'          , msgId: 'expCost_head'     , apiKey: 'Cost__c'                              , domId: 'PrintExpPay2{0}TotalCost'         , domType: 'currency' , width: '10%' },
				{ label: '精算日'        , msgId: 'payDate_label'    , apiKey: '_payDate'                             , domId: 'PrintExpPay2{0}payDate'           , domType: 'date'     , width: '10%' },
				{ label: '備考(精算時)'  , msgId: 'tf10000720'       , apiKey: '_payNote'                             , domId: 'PrintExpPay2{0}payMethod'         , domType: 'text'     , width: '30%' },
				{ label: '申請日時'      , msgId: 'applyTime_label'  , apiKey: 'ExpApplyId__r.ApplyTime__c'           , domId: 'PrintExpPay2{0}ApplyTime'         , domType: 'datetime' , width: '10%' },
				{ label: '承認日時'      , msgId: 'tk10000070'       , apiKey: 'ExpApplyId__r.ApproveTime__c'         , domId: 'PrintExpPay2{0}ApproveTime'       , domType: 'datetime' , width: '10%' },
				{ label: 'ステータス'    , msgId: 'status_btn_title' , apiKey: '_status'                              , domId: 'PrintExpPay2{0}Status'            , domType: 'text'     , width: '10%', align:'center' }
			],
			sortKeys : [
				{ apiKey: 'EmpId__r.EmpCode__c' },
				{ apiKey: 'EmpId__r.Name' },
				{ apiKey: 'ExpApplyId__r.ExpApplyNo__c' }
			]
		},
		//------------------------------------------
		// 経費精算/カード
		//------------------------------------------
		ListExpPay3 : {
			discernment : 'expPayList3',
			objectName  : 'AtkEmpExp__c',
			type        : 'table',
			formCss     : 'ts-exp-pay-list3',
			rowLimit    : 200,
			pageLimit   : 10,
			stereoType  : true,
			fields : [
				{ label: 'ID'                                        , apiKey: 'Id'                                     , domId: 'ExpPay3{0}Id'               , domType: 'text'     , hidden: true },
				{ label: '経費明細名'                                , apiKey: 'Name'                                   , domId: 'ExpPay3{0}Name'             , domType: 'text'     , hidden: true },
				{ label: '生成日時'                                  , apiKey: 'CreatedDate'                            , domId: 'ExpPay3{0}CreatedDate'      , domType: 'datetime' , hidden: true },
				{ label: '最終更新日時'                              , apiKey: 'LastModifiedDate'                       , domId: 'ExpPay3{0}LastModifiedDate' , domType: 'datetime' , hidden: true },
				{ label: '社員ID'                                    , apiKey: 'EmpId__c'                               , domId: 'ExpPay3{0}EmpId__c'         , domType: 'text'     , hidden: true },
				{ label: '経費申請ID'                                , apiKey: 'ExpApplyId__c'                          , domId: 'ExpPay3{0}ExpApplyId'       , domType: 'text'     , hidden: true },
				{ check: true                                                                                           , domId: 'ExpPay3{0}_Check'           , domType: 'checkbox' , width: 24   , paychk: true },
				{ label: '申請'          , msgId: 'apply_btn_title'  , apiKey: 'ExpApplyId__r.StatusD__c'               , domId: 'ExpPay3{0}Status'           , domType: 'status'   , width: 30   , sortable:true },
				{ label: 'カード名'      , msgId: 'tf10000750'       , apiKey: 'PayeeId__r.Name'                        , domId: 'ExpPay3{0}CardName'         , domType: 'text'     , width: '15%', sortable:true },
				{ label: '支払日'        , msgId: 'tf10000590'       , apiKey: 'PaymentDate__c'                         , domId: 'ExpPay3{0}PaymentDate'      , domType: 'date'     , width: 76   , sortable:true },
				{ label: '申請番号'      , msgId: 'expApplyNo_label' , apiKey: 'ExpApplyId__r.ExpApplyNo__c'            , domId: 'ExpPay3{0}ExpApplyNo'       , domType: 'text'     , width:100   , sortable:true, link: true },
				{ label: '部署名'        , msgId: 'tk10000335'       , apiKey: 'ExpApplyId__r.DeptId__r.Name'           , domId: 'ExpPay3{0}DeptName'         , domType: 'text'     , width: '15%', sortable:true },
				{ label: '社員コード'    , msgId: 'empCode_label'    , apiKey: 'EmpId__r.EmpCode__c'                    , domId: 'ExpPay3{0}EmpCode'          , domType: 'text'     , width: '10%', sortable:true },
				{ label: '社員名'        , msgId: 'empName_label'    , apiKey: 'EmpId__r.Name'                          , domId: 'ExpPay3{0}EmpName'          , domType: 'text'     , width: '10%', sortable:true },
				{ label: '金額'          , msgId: 'expCost_head'     , apiKey: 'Cost__c'                                , domId: 'ExpPay3{0}Cost'             , domType: 'currency' , width: 72   , sortable:true },
				{ label: '摘要'          , msgId: 'tk10000097'       , apiKey: 'Detail__c'                              , domId: 'ExpPay3{0}Note'             , domType: 'text'     , width: '15%', sortable:true },
				{ label: '利用日付'      , msgId: 'tf10000670'       , apiKey: 'Date__c'                                , domId: 'ExpPay3{0}Date'             , domType: 'date'     , width: 76   , sortable:true },
				{ label: '精算実行者'      , msgId: 'tf10011070'       , apiKey: 'SetPaidActorId__r.Name'                  , domId: 'ExpPay3{0}SetPaidActor' , domType: 'text' , width:  72   , sortable:true, mask:2 },
                { label: '精算実行日時'   , msgId: 'tf10011080'       , apiKey: 'SetPaidTime__c'                  , domId: 'ExpPay3{0}SetPaidTime' , domType: 'datetime' , width:  76   , sortable:true , mask:2 }
			],
			foots : [],
			filts    : [
				{ filtVal: "ExpApplyId__r.Removed__c = false"                              , fix:true },
				{ filtVal: "ExpApplyId__r.StatusC__c in ('承認済み','確定済み','精算済み')", fix:true },
				{ filtVal: "PayeeId__r.PayeeType__c = '3'"                                 , fix:true },
				{ filtVal: "IsPaid__c = false", fix:true, mask: 1 },
				{ filtVal: "IsPaid__c = true" , fix:true, mask: 2 }
			],
			sortKeys : [
				{ apiKey: 'ExpApplyId__r.ExpApplyNo__c', desc: true },
				{ apiKey: 'Date__c'   },
				{ apiKey: 'Order__c'  },
				{ apiKey: 'Id'        }
			]
		},
		// 経費精算/カードの検索
		searchExpPay3 : {
			title       : ['tf10002070', 'tf10002100'], // 経費精算/カードの検索
			formCss     : 'ts-dialog-search-expPay2',
			type        : 'searchCondition',
			fields      : [
				{ label: 'カード名'      , msgId: 'tf10000750'       , apiKey: 'PayeeId__r.Name'                , domId: 'SearchExpPayeeName'     , domType: 'text'           , width: 300, matchType:3 },
				{ label: '支払日範囲'    , msgId: 'tf10000730'       , apiKey: 'PaymentDate__c'                 , domId: 'SearchExpPaymentDate'   , domType: 'dateRange'      , width: 108, name: 'pay3PayDate' },
				{ label: '申請番号'      , msgId: 'expApplyNo_label' , apiKey: 'ExpApplyId__r.ExpApplyNo__c'    , domId: 'SearchExpApplyNo'       , domType: 'text'           , width: 300, matchType:2 },
				{ label: '部署名'        , msgId: 'tk10000335'       , apiKey: 'EmpId__r.DeptId__r.Name'        , domId: 'SearchExpDeptName'      , domType: 'deptb'          , width: 350, matchType:3, defaultChks:{checkDeptApply:true,checkDeptLayer:true}, optKeys:["ExpApplyId__r.DeptId__r.Name like '%{0}%'", "(EmpId__r.DeptId__r.Name like '%{0}%' or EmpId__r.DeptId__r.ParentId__r.Name like '%{0}%' or EmpId__r.DeptId__r.ParentId__r.ParentId__r.Name like '%{0}%' or EmpId__r.DeptId__r.ParentId__r.ParentId__r.ParentId__r.Name like '%{0}%')", "(ExpApplyId__r.DeptId__r.Name like '%{0}%' or ExpApplyId__r.DeptId__r.ParentId__r.Name like '%{0}%' or ExpApplyId__r.DeptId__r.ParentId__r.ParentId__r.Name like '%{0}%' or ExpApplyId__r.DeptId__r.ParentId__r.ParentId__r.ParentId__r.Name like '%{0}%')"] },
				{ label: '社員コード'    , msgId: 'empCode_label'    , apiKey: 'EmpId__r.EmpCode__c'            , domId: 'SearchExpEmpCode'       , domType: 'text'           , width: 150, matchType:1 },
				{ label: '社員名'        , msgId: 'empName_label'    , apiKey: 'EmpId__r.Name'                  , domId: 'SearchExpEmpName'       , domType: 'text'           , width: 300, matchType:3 },
				{ label: '金額範囲'      , msgId: 'tf10000740'       , apiKey: 'Cost__c'                        , domId: 'SearchExpCost'          , domType: 'currencyRange'  , width: 120, minus:true },
				{ label: '摘要'          , msgId: 'tk10000097'       , apiKey: 'Detail__c'                      , domId: 'SearchExpTitle'         , domType: 'text'           , width: 300, matchType:3 },
				{ label: '利用日付範囲'  , msgId: 'tf10000700'       , apiKey: 'Date__c'                        , domId: 'SearchExpDate'          , domType: 'dateRange'      , width: 108, name: 'pay3Date' },
				{ label: '精算実行者'          , msgId: 'tf10011070'    , apiKey: 'SetPaidActorId__r.Name'                               , domId: 'SearchSetPaidActorName'                 , domType: 'text'           , width: 300, matchType:3, mask:2 },
                { label: '精算実行日範囲'          , msgId: 'tf10011090'    , apiKey: 'SetPaidTime__c'                               , domId: 'SearchSetPaidTime'                 , domType: 'dateRange'           , width: 108, name: 'pay3SetPaidTime', dataType: 'dateTime' , mask:2 }
			]
		},
		PrintExpPay3 : {
			discernment : 'printExpPay3',
			objectName  : 'AtkEmpExp__c',
			type        : 'table',
			formCss     : 'ts-print-exp-pay-list3',
			rowLimit    : 2000,
			fields : [
				{ label: 'ID'                                        , apiKey: 'Id'                                   , domId: 'PrintExpPay3{0}Id'                , hidden: true },
				{ label: '経費申請名'                                , apiKey: 'ExpApplyId__r.Name'                   , domId: 'PrintExpPay3{0}Name'              , hidden: true },
				{ label: '生成日時'                                  , apiKey: 'CreatedDate'                          , domId: 'PrintExpPay3{0}CreatedDate'       , hidden: true },
				{ label: '最終更新日時'                              , apiKey: 'LastModifiedDate'                     , domId: 'PrintExpPay3{0}LastModifiedDate'  , hidden: true },
				{ label: '支払い済み'                                , apiKey: 'IsPaid__c'                            , domId: 'PrintExpPay3{0}IsPaid'            , hidden: true },
				{ label: '支払先'                                    , apiKey: 'PayeeId__r.Name'                      , domId: 'PrintExpPay3{0}PayeeName'         , hidden: true },
				{ label: '支払日'                                    , apiKey: 'PaymentDate__c'                       , domId: 'PrintExpPay3{0}PaymentDate'       , hidden: true },
				{ label: '社員ID'                                    , apiKey: 'EmpId__c'                             , domId: 'PrintExpPay3{0}EmpId__c'          , hidden: true },
				{ label: '部署コード'                                , apiKey: 'EmpId__r.DeptId__r.DeptCode__c'       , domId: 'PrintExpPay3{0}DeptCode'          , hidden: true },
				{ label: '部署名'                                    , apiKey: 'EmpId__r.DeptId__r.Name'              , domId: 'PrintExpPay3{0}DeptName'          , hidden: true },
				{ label: '社員コード'                                , apiKey: 'EmpId__r.EmpCode__c'                  , domId: 'PrintExpPay3{0}EmpCode'           , hidden: true },
				{ label: '社員名'                                    , apiKey: 'EmpId__r.Name'                        , domId: 'PrintExpPay3{0}EmpName'           , hidden: true },
				{ label: 'StatusC'                                   , apiKey: 'ExpApplyId__r.StatusC__c'             , domId: 'PrintExpPay3{0}StatusC'           , hidden: true },
				{ label: '申請番号'      , msgId: 'expApplyNo_label' , apiKey: 'ExpApplyId__r.ExpApplyNo__c'          , domId: 'PrintExpPay3{0}ExpApplyNo'        , domType: 'text'     , width: '20%', align:'center' },
				{ label: '金額'          , msgId: 'expCost_head'     , apiKey: 'Cost__c'                              , domId: 'PrintExpPay3{0}TotalCost'         , domType: 'currency' , width: '10%' },
				{ label: '精算日'        , msgId: 'payDate_label'    , apiKey: '_payDate'                             , domId: 'PrintExpPay3{0}payDate'           , domType: 'date'     , width: '10%' },
				{ label: '備考(精算時)'  , msgId: 'tf10000720'       , apiKey: '_payNote'                             , domId: 'PrintExpPay3{0}payMethod'         , domType: 'text'     , width: '30%' },
				{ label: '申請日時'      , msgId: 'applyTime_label'  , apiKey: 'ExpApplyId__r.ApplyTime__c'           , domId: 'PrintExpPay3{0}ApplyTime'         , domType: 'datetime' , width: '10%' },
				{ label: '承認日時'      , msgId: 'tk10000070'       , apiKey: 'ExpApplyId__r.ApproveTime__c'         , domId: 'PrintExpPay3{0}ApproveTime'       , domType: 'datetime' , width: '10%' },
				{ label: 'ステータス'    , msgId: 'status_btn_title' , apiKey: '_status'                              , domId: 'PrintExpPay3{0}Status'            , domType: 'text'     , width: '10%', align:'center' }
			],
			sortKeys : [
				{ apiKey: 'EmpId__r.EmpCode__c' },
				{ apiKey: 'EmpId__r.Name' },
				{ apiKey: 'ExpApplyId__r.ExpApplyNo__c' }
			]
		},
		//------------------------------------------
		// 経費精算/仮払い
		//------------------------------------------
		ListExpPay4 : {
			discernment : 'expPayList4',
			objectName  : 'AtkExpPreApply__c',
			type        : 'table',
			formCss     : 'ts-exp-pay-list4',
			rowLimit    : 200,
			pageLimit   : 10,
			stereoType  : true,
			fields : [
				{ label: 'ID'                                        , apiKey: 'Id'                          , domId: 'ExpPay4{0}Id'                       , domType: 'text'     , hidden: true },
				{ label: '経費事前申請名'                            , apiKey: 'Name'                        , domId: 'ExpPay4{0}Name'                     , domType: 'text'     , hidden: true },
				{ label: '生成日時'                                  , apiKey: 'CreatedDate'                 , domId: 'ExpPay4{0}CreatedDate'              , domType: 'datetime' , hidden: true },
				{ label: '最終更新日時'                              , apiKey: 'LastModifiedDate'            , domId: 'ExpPay4{0}LastModifiedDate'         , domType: 'datetime' , hidden: true },
				{ label: '社員ID'                                    , apiKey: 'EmpId__c'                    , domId: 'ExpPay4{0}EmpId__c'                 , domType: 'text'     , hidden: true },
				{ label: '帰着予定日'                                , apiKey: 'EndDate__c'                  , domId: 'ExpPay4{0}EndDate__c'               , domType: 'date'     , hidden: true },
				{ check: true                                                                                , domId: 'ExpPay4{0}_Check'                   , domType: 'checkbox' , width:  24   , paychk: true },
				{ label: '申請'          , msgId: 'apply_btn_title'  , apiKey: 'StatusD__c'                  , domId: 'ExpPay4{0}Status'                   , domType: 'status'   , width:  24   , sortable:true },
				{ label: '申請番号'      , msgId: 'expApplyNo_label' , apiKey: 'ExpPreApplyNo__c'            , domId: 'ExpPay4{0}ExpPreApplyNo'            , domType: 'text'     , width: 100   , sortable:true, link: true },
				{ label: '部署名'        , msgId: 'tk10000335'       , apiKey: 'DeptId__r.Name'              , domId: 'ExpPay4{0}DeptName'                 , domType: 'text'     , width: '15%' , sortable:true },
				{ label: '社員コード'    , msgId: 'empCode_label'    , apiKey: 'EmpId__r.EmpCode__c'         , domId: 'ExpPay4{0}EmpCode'                  , domType: 'text'     , width: '10%'  , sortable:true },
				{ label: '社員名'        , msgId: 'empName_label'    , apiKey: 'EmpId__r.Name'               , domId: 'ExpPay4{0}EmpName'                  , domType: 'text'     , width: '15%' , sortable:true },
				{ label: '仮払金額'      , msgId: 'tf10000530'       , apiKey: 'ProvisionalPaymentAmount__c' , domId: 'ExpPay4{0}ProvisionalPaymentAmount' , domType: 'currency' , width:  72   , sortable:true },
				{ label: '件名'          , msgId: 'tk10004320'       , apiKey: 'Title__c'                    , domId: 'ExpPay4{0}Title'                    , domType: 'text'     , width: '20%' , sortable:true },
				{ label: '種別'          , msgId: 'tk10000262'       , apiKey: 'Type__c'                     , domId: 'ExpPay4{0}Type'                     , domType: 'select'   , width: '6%'  , sortable:true, pickList: [{v:'',n:''},{v:'出張・交通費',msgId:'tf10001410'},{v:'会議・交際費',msgId:'tf10000600'},{v:'一般経費',msgId:'tf10001420'},{v:'仮払申請',msgId:'tf10006120'}] },
				{ label: '利用日付'      , msgId: 'tf10000670'       , apiKey: 'StartDate__c'                , domId: 'ExpPay4{0}StartDate'                , domType: 'date'     , width:  76   , sortable:true },
				{ label: '精算実行者'      , msgId: 'tf10011070'       , apiKey: 'SetPaidActorId__r.Name'                  , domId: 'ExpPay1{0}SetPaidActor' , domType: 'text' , width:  72   , sortable:true, mask:2 },
                { label: '精算実行日時'   , msgId: 'tf10011080'       , apiKey: 'SetPaidTime__c'                  , domId: 'ExpPay4{0}SetPaidTime' , domType: 'datetime' , width:  76   , sortable:true , mask:2 }
			],
			foots : [],
			filts    : [
				{ filtVal: "StatusC__c in ('承認済み','確定済み')", fix:true, mask: 1 },
				{ filtVal: "StatusC__c = '精算済み'"              , fix:true, mask: 2 },
				{ filtVal: "ProvisionalPaymentAmount__c > 0"      , fix:true }
			],
			sortKeys : [
				{ apiKey: 'ExpPreApplyNo__c', desc: true }
			]
		},
		// 経費精算/仮払いの検索
		searchExpPay4 : {
			title       : ['tf10002070', 'tf10002110'], // 経費精算/仮払いの検索
			formCss     : 'ts-dialog-search-expPay4',
			type        : 'searchCondition',
			fields      : [
				{ label: '申請番号'      , msgId: 'expApplyNo_label' , apiKey: 'ExpPreApplyNo__c'           , domId: 'SearchExpPreApplyNo'              , domType: 'text'           , width: 300, matchType:2 },
				{ label: '部署名'        , msgId: 'tk10000335'       , apiKey: 'EmpId__r.DeptId__r.Name'    , domId: 'SearchExpDeptName'                , domType: 'deptb'          , width: 350, matchType:3, defaultChks:{checkDeptApply:true,checkDeptLayer:true}, optKeys:["DeptId__r.Name like '%{0}%'","(EmpId__r.DeptId__r.Name like '%{0}%' or EmpId__r.DeptId__r.ParentId__r.Name like '%{0}%' or EmpId__r.DeptId__r.ParentId__r.ParentId__r.Name like '%{0}%' or EmpId__r.DeptId__r.ParentId__r.ParentId__r.ParentId__r.Name like '%{0}%')","(DeptId__r.Name like '%{0}%' or DeptId__r.ParentId__r.Name like '%{0}%' or DeptId__r.ParentId__r.ParentId__r.Name like '%{0}%' or DeptId__r.ParentId__r.ParentId__r.ParentId__r.Name like '%{0}%')"] },
				{ label: '社員コード'    , msgId: 'empCode_label'    , apiKey: 'EmpId__r.EmpCode__c'        , domId: 'SearchExpEmpCode'                 , domType: 'text'           , width: 150, matchType:1 },
				{ label: '社員名'        , msgId: 'empName_label'    , apiKey: 'EmpId__r.Name'              , domId: 'SearchExpEmpName'                 , domType: 'text'           , width: 300, matchType:3 },
				{ label: '仮払金額範囲'  , msgId: 'tf10000710'       , apiKey: 'ProvisionalPaymentAmount__c', domId: 'SearchExpProvisionalPaymentAmount', domType: 'currencyRange'  , width: 120 },
				{ label: '件名'          , msgId: 'tk10004320'       , apiKey: 'Title__c'                   , domId: 'SearchExpTitle'                   , domType: 'text'           , width: 300, matchType:3 },
				{ label: '種別'          , msgId: 'tk10000262'       , apiKey: 'Type__c'                    , domId: 'SearchExpType'                    , domType: 'select'         , width: 200, pickList: [{v:'',n:''},{v:'出張・交通費',msgId:'tf10001410'},{v:'会議・交際費',msgId:'tf10000600'},{v:'一般経費',msgId:'tf10001420'},{v:'仮払申請',msgId:'tf10006120'}] },
				{ label: '利用日付範囲'  , msgId: 'tf10000700'       , apiKey: '_startEnd'                  , domId: 'SearchExpDate'                    , domType: 'dateRange'      , width: 108, name: 'pay4Date', colNames: ['StartDate__c','EndDate__c'] },
				{ label: '精算実行者'          , msgId: 'tf10011070'    , apiKey: 'SetPaidActorId__r.Name'                               , domId: 'SearchSetPaidActorName'                 , domType: 'text'           , width: 300, matchType:3, mask:2 },
                { label: '精算実行日範囲'          , msgId: 'tf10011090'    , apiKey: 'SetPaidTime__c'                               , domId: 'SearchSetPaidTime'                 , domType: 'dateRange'           , width: 108, name: 'pay4SetPaidTime', dataType: 'dateTime' , mask:2 }
			]
		},
		PrintExpPay4 : {
			discernment : 'printExpPay4',
			objectName  : 'AtkExpPreApply__c',
			type        : 'table',
			formCss     : 'ts-print-exp-pay-list4',
			rowLimit    : 2000,
			fields : [
				{ label: 'ID'                                        , apiKey: 'Id'                          , domId: 'PrintExpPay4{0}Id'                , hidden: true },
				{ label: '経費申請名'                                , apiKey: 'Name'                        , domId: 'PrintExpPay4{0}Name'              , hidden: true },
				{ label: '生成日時'                                  , apiKey: 'CreatedDate'                 , domId: 'PrintExpPay4{0}CreatedDate'       , hidden: true },
				{ label: '最終更新日時'                              , apiKey: 'LastModifiedDate'            , domId: 'PrintExpPay4{0}LastModifiedDate'  , hidden: true },
				{ label: '社員ID'                                    , apiKey: 'EmpId__c'                    , domId: 'PrintExpPay4{0}EmpId__c'          , hidden: true },
				{ label: '部署コード'                                , apiKey: 'EmpId__r.DeptId__r.DeptCode__c', domId: 'PrintExpPay4{0}DeptCode'          , hidden: true },
				{ label: '部署名'                                    , apiKey: 'EmpId__r.DeptId__r.Name'       , domId: 'PrintExpPay4{0}DeptName'          , hidden: true },
				{ label: '社員コード'                                , apiKey: 'EmpId__r.EmpCode__c'         , domId: 'PrintExpPay4{0}EmpCode'           , hidden: true },
				{ label: '社員名'                                    , apiKey: 'EmpId__r.Name'               , domId: 'PrintExpPay4{0}EmpName'           , hidden: true },
				{ label: 'StatusC'                                   , apiKey: 'StatusC__c'                  , domId: 'PrintExpPay4{0}StatusC'           , hidden: true },
				{ label: 'StatusD'                                   , apiKey: 'StatusD__c'                  , domId: 'PrintExpPay4{0}StatusD'           , hidden: true },
				{ label: '申請番号'      , msgId: 'expApplyNo_label' , apiKey: 'ExpPreApplyNo__c'            , domId: 'PrintExpPay4{0}ExpApplyNo'        , domType: 'text'     , width: '20%', align:'center' },
				{ label: '金額'          , msgId: 'expCost_head'     , apiKey: 'ProvisionalPaymentAmount__c' , domId: 'PrintExpPay4{0}TotalCost'         , domType: 'currency' , width: '10%' },
				{ label: '精算日'        , msgId: 'payDate_label'    , apiKey: '_payDate'                    , domId: 'PrintExpPay4{0}payDate'           , domType: 'date'     , width: '10%' },
				{ label: '備考(精算時)'  , msgId: 'tf10000720'       , apiKey: '_payNote'                    , domId: 'PrintExpPay4{0}payMethod'         , domType: 'text'     , width: '30%' },
				{ label: '申請日時'      , msgId: 'applyTime_label'  , apiKey: 'ApplyTime__c'                , domId: 'PrintExpPay4{0}ApplyTime'         , domType: 'datetime' , width: '10%' },
				{ label: '承認日時'      , msgId: 'tk10000070'       , apiKey: 'ApproveTime__c'              , domId: 'PrintExpPay4{0}ApproveTime'       , domType: 'datetime' , width: '10%' },
				{ label: 'ステータス'    , msgId: 'status_btn_title' , apiKey: '_status'                     , domId: 'PrintExpPay4{0}Status'            , domType: 'text'     , width: '10%', align:'center' }
			],
			sortKeys : [
				{ apiKey: 'EmpId__r.EmpCode__c' },
				{ apiKey: 'EmpId__r.Name' },
				{ apiKey: 'ExpPreApplyNo__c' }
			]
		},
		// J'sNAVI Jr請求データ
		ListExpJsNavi : {
			discernment : 'expJsNavi',
			objectName  : 'AtkJsNaviInvoice__c',
			type        : 'table',
			formCss     : 'ts-exp-jsnavi-list',
			rowLimit    : 50,
			irregularType : 'jsNaviList',
			stereoType  : true,
			fields : [
				{ label: 'ID'                                       , apiKey: 'Id'						, domId: 'ExpJsNavi{0}Id'                       , domType: 'text'		, hidden: true },
				{ label: '経費申請名'                               , apiKey: 'Name'					, domId: 'ExpJsNavi{0}Name'                     , domType: 'text'		, hidden: true },
				{ label: '生成日時'                                 , apiKey: 'CreatedDate'				, domId: 'ExpJsNavi{0}CreatedDate'              , domType: 'datetime'	, hidden: true },
				{ label: '最終更新日時'                             , apiKey: 'LastModifiedDate'		, domId: 'ExpJsNavi{0}LastModifiedDate'			, domType: 'datetime'	, hidden: true },
				{ label: '社員ID'                                   , apiKey: 'EmpId__c'				, domId: 'ExpJsNavi{0}EmpId__c'					, domType: 'text'		, hidden: true },
				{ label: '事前申請ID'                               , apiKey: 'ExpPreApplyId__c'		, domId: 'ExpJsNavi{0}ExpPreApplyId'			, domType: 'text'		, hidden: true },
				{ label: '事前申請番号'                             , apiKey: 'ExpPreApplyNo__c'		, domId: 'ExpJsNavi{0}ExpPreApplyNo'			, domType: 'text'		, hidden: true },
				{ label: '経費申請ID'                               , apiKey: 'ExpApplyId__c'			, domId: 'ExpJsNavi{0}ExpApplyId'				, domType: 'text'		, hidden: true },
				{ label: '経費申請番号'                             , apiKey: 'ExpApplyNo__c'			, domId: 'ExpJsNavi{0}ExpApplyNo'				, domType: 'text'		, hidden: true },
				{ label: '経費申請ステータス'                       , apiKey: 'ExpApplyId__r.Status__c'	, domId: 'ExpJsNavi{0}ExpApplyStatus'			, domType: 'text'		, hidden: true },
				{ label: 'ステータス'		, msgId: 'status_btn_title' 	, apiKey: '_ApprovalStatus'		, domId: 'ExpJsNavi{0}ApprovalStatus'		, domType: 'text'		, width: 10 , align: 'center'},
				{ label: '請求明細'		, msgId: 'jt18000110'			, apiKey: '_DetailLink'			, domId: 'ExpJsNavi{0}DetailLink'			, domType: 'text'		, width: 15 , align: 'center', link: true },
				{ label: '経費申請番号'	, msgId: 'expApplyNo_label' 	, apiKey: '_ApplyNo'			, domId: 'ExpJsNavi{0}ApplyNo'				, domType: 'text'		, width: 15 , link: true },
				{ label: '事前申請番号'	, msgId: 'expPreApplyNo_label'	, apiKey: '_PreApplyNo'			, domId: 'ExpJsNavi{0}PreApplyNo'			, domType: 'text'		, width: 15 , link: true },
				{ label: '部署名'			, msgId: 'tk10000335'       	, apiKey: 'deptName'			, domId: 'ExpJsNavi{0}DeptName'				, domType: 'text'		, width: '15%'},
				{ label: '社員コード'		, msgId: 'empCode_label'    	, apiKey: 'EmpCode__c'			, domId: 'ExpJsNavi{0}EmpCode'				, domType: 'text'		, width: '10%'},
				{ label: '社員名'			, msgId: 'empName_label'    	, apiKey: 'empName'				, domId: 'ExpJsNavi{0}EmpName'				, domType: 'text'		, width: '15%'},
				{ label: '利用金額'		, msgId: 'jt18000050'       	, apiKey: 'useAmount'			, domId: 'ExpJsNavi{0}UseAmount'			, domType: 'currency'	, width:  72},
				{ label: '請求金額合計'	, msgId: 'jt18000060'       	, apiKey: 'totalInvoiceAmount'	, domId: 'ExpJsNavi{0}TotalInvoiceAmount'	, domType: 'currency' 	, width: 72}
			],
			foots : [],
			filts    : [
			//{ filtVal: "ExpApplyId__r.Status__c <> '精算済み'"   , fix:true }	// #5988対応
			],
			sortKeys : [
				{ apiKey: 'ExpApplyId__c', desc: false }
			]
		},
		// 請求データ
		searchExpJsNavi : {
			title       : ['jt18000090'], // 請求データの検索
			formCss     : 'ts-dialog-search-expJsNavi',
			type        : 'searchCondition',
			fields      : [
				{ label: '利用日付範囲'    , msgId: 'tf10000700'       , apiKey: '_startEnd'					, domId: 'SearchJsNaviDate'		, domType: 'dateRange'	, width: 108, name: 'useDate', colNames: ['Date__c','Date__c'] },
				{ label: '申請番号'       , msgId: 'expApplyNo_label' , apiKey: 'ExpApplyId__r.ExpApplyNo__c'	, domId: 'SearchJsNaviApplyNo'	, domType: 'text'		, width: 300, matchType:2 },
				{ label: '部署名'			, msgId: 'tk10000335'       , apiKey: 'EmpId__r.DeptId__r.Name'		, domId: 'SearchJsNaviDeptName'	, domType: 'depta'		, width: 350, matchType:3, optKey: 'ExpApplyId__r.DeptId__r.Name', defaultChk:true },
				{ label: '社員コード'		, msgId: 'empCode_label'    , apiKey: 'EmpId__r.EmpCode__c'			, domId: 'SearchJsNaviEmpCode'	, domType: 'text'		, width: 150, matchType:1 },
				{ label: '社員名'			, msgId: 'empName_label'    , apiKey: 'EmpId__r.Name'				, domId: 'SearchJsNaviEmpName'	, domType: 'text'		, width: 300, matchType:3 }
			]
		},
		// J'sNAVI Jr請求データの明細
		ListExpJsNaviDetail : {
			discernment : 'expJsNaviDetail',
			objectName  : 'AtkJsNaviInvoice__c',
			type        : 'table',
			formCss     : 'ts-exp-jsnavi-list',
			rowLimit    : 30,
			irregularType : 'jsNaviList',
			stereoType  : true,
			fields : [
				{ label: 'ID'                                       , apiKey: 'Id'						, domId: 'ExpJsNavi{0}Id'                       , domType: 'text'		, hidden: true },
				{ label: '経費申請名'                               , apiKey: 'Name'					, domId: 'ExpJsNavi{0}Name'                     , domType: 'text'		, hidden: true },
				{ label: '生成日時'                                 , apiKey: 'CreatedDate'				, domId: 'ExpJsNavi{0}CreatedDate'              , domType: 'datetime'	, hidden: true },
				{ label: '最終更新日時'                             , apiKey: 'LastModifiedDate'		, domId: 'ExpJsNavi{0}LastModifiedDate'			, domType: 'datetime'	, hidden: true },
				{ label: '社員ID'                                   , apiKey: 'EmpId__c'				, domId: 'ExpJsNavi{0}EmpId__c'					, domType: 'text'		, hidden: true },
				{ label: '事前申請ID'                               , apiKey: 'ExpPreApplyId__c'		, domId: 'ExpJsNavi{0}ExpPreApplyId'			, domType: 'text'		, hidden: true },
				{ label: '事前申請番号'                             , apiKey: 'ExpPreApplyNo__c'	, domId: 'ExpJsNavi{0}ExpPreApplyNo'	, domType: 'text'	, hidden: true },
				{ label: '経費申請ID'                               , apiKey: 'ExpApplyId__c'			, domId: 'ExpJsNavi{0}ExpApplyId'				, domType: 'text'		, hidden: true },
				{ label: '経費申請番号'                             , apiKey: 'ExpApplyNo__c'	, domId: 'ExpJsNavi{0}ExpApplyNo'			, domType: 'text'		, hidden: true },
				{ label: '経費申請ステータス'                       , apiKey: 'ExpApplyId__r.Status__c'	, domId: 'ExpJsNavi{0}ExpApplyStatus'			, domType: 'text'		, hidden: true },
				{ label: '利用日付'		, msgId: 'tf10000670'       , apiKey: 'Date__c'					, domId: 'ExpJsNavi{0}ApplyTime'				, domType: 'date'		, width:  80   , sortable:true },
//                { label: '申請番号'		, msgId: 'expApplyNo_label' , apiKey: '_ApplyNo'				, domId: 'ExpJsNavi{0}ApplyNo'					, domType: 'text'		, width: '10%' , sortable:true, link: true },
				{ label: '事前申請番号'	, msgId: 'expPreApplyNo_label'	, apiKey: '_PreApplyNo'				, domId: 'ExpJsNavi{0}PreApplyNo'		, domType: 'text'		, width: '10%' , link: true },
				{ label: '部署名'			, msgId: 'tk10000335'       	, apiKey: 'EmpId__r.DeptId__r.Name'	, domId: 'ExpJsNavi{0}DeptName'			, domType: 'text'		, width: '15%' , sortable:true },
				{ label: '社員コード'		, msgId: 'empCode_label'    	, apiKey: 'EmpId__r.EmpCode__c'		, domId: 'ExpJsNavi{0}EmpCode'			, domType: 'text'		, width: '5%'  , sortable:true },
				{ label: '社員名'			, msgId: 'empName_label'    	, apiKey: 'EmpId__r.Name'			, domId: 'ExpJsNavi{0}EmpName'			, domType: 'text'		, width: '10%' , sortable:true },
				{ label: '利用先名称'		, msgId: 'jt18000040'       	, apiKey: 'UseName__c'				, domId: 'ExpJsNavi{0}UseName'			, domType: 'text'		, width: '15%'},
				{ label: '出発地'			, msgId: 'jt18000160'       	, apiKey: 'StartPlace__c'			, domId: 'ExpJsNavi{0}StartPlace'		, domType: 'text'		, width: '10%'},
				{ label: '到着地'			, msgId: 'jt18000170'       	, apiKey: 'EndPlace__c'				, domId: 'ExpJsNavi{0}EndPlace'			, domType: 'text'		, width: '10%'},
				{ label: 'ステータス'		, msgId: 'status_btn_title' 	, apiKey: 'Status__c'				, domId: 'ExpJsNavi{0}Status'			, domType: 'text'		, width: '10%', sortable:true},
				{ label: '請求金額'		, msgId: 'jt18000060'       	, apiKey: 'InvoiceAmount__c'		, domId: 'ExpJsNavi{0}UseAmount'		, domType: 'currency'	, width:  72   , sortable:true },
				{ label: '備考'			, msgId: 'expNote_head'     	, apiKey: 'Note__c'					, domId: 'ExpJsNavi{0}Note'				, domType: 'text'   	, width: '25%'}
			],
			foots : [],
			filts    : [
			//{ filtVal: "ExpApplyId__r.Status__c <> '精算済み'"   , fix:true }	// #5988対応
			],
			sortKeys : [
				{ apiKey: 'Date__c', desc: false }
			]
		},
		//------------------------------------------
		// 社員選択用
		//------------------------------------------
		ListEmpTable : {
			discernment : 'ListEmpTable',
			objectName  : 'AtkEmp__c',
			type        : 'table',
			formCss     : 'ts-emp-list',
			rowLimit    : 50,
			empList     : true,
			fields : [
				{ label: 'ID'                                        , apiKey: 'Id'                          , domId: 'Emp{0}Id'                       , domType: 'text'     , hidden: true },
				{ label: '社員コード'    , msgId: 'empCode_label'    , apiKey: 'EmpCode__c'                  , domId: 'Emp{0}Code'                     , domType: 'text'     , width: 100 , sortable:true, link: true },
				{ label: '社員名'        , msgId: 'empName_label'    , apiKey: 'Name'                        , domId: 'Emp{0}Name'                     , domType: 'text'     , width: 120 , sortable:true, link: true },
				{ label: '上長'          , msgId: 'tm10011000'       , apiKey: 'Manager__r.Name'             , domId: 'Emp{0}Manager'                  , domType: 'text'     , width: 120 , sortable:true },
				{ label: '部署'          , msgId: 'dept_label'       , apiKey: 'DeptId__r.Name'              , domId: 'Emp{0}DeptName'                 , domType: 'text'     , width: 150 , sortable:true },
				{ label: '勤務体系'      , msgId: 'empType_label'    , apiKey: 'EmpTypeId__r.Name'           , domId: 'Emp{0}EmpTypeName'              , domType: 'text'     , width: 150 , sortable:true }
			],
			sortKeys : [
				{ apiKey: 'EmpCode__c' }
			],
			filts    : [
			],
			childFilts    : [
			],
			children : {
			}
		},
		ListEmpTable2 : {
			discernment : 'ListEmpTable2',
			objectName  : 'AtkEmp__c',
			type        : 'table',
			formCss     : 'ts-emp-list',
			rowLimit    : 50,
			empList     : true,
			fields : [
				{ label: 'ID'                                        , apiKey: 'Id'                          , domId: 'Emp{0}Id'                       , domType: 'text'     , hidden: true },
				{ label: 'UserId'                                    , apiKey: 'UserId__c'                   , domId: 'Emp{0}UserId'                   , domType: 'text'     , hidden: true },
				{ label: 'Manager'                                   , apiKey: 'Manager__c'                  , domId: 'Emp{0}Manager0'                 , domType: 'text'     , hidden: true },
				{ label: 'Dm0'        , apiKey: 'DeptId__r.ManagerId__c'                                     , domId: 'Emp{0}Dm0'                      , domType: 'text'     , hidden: true },
				{ label: 'Dm1'        , apiKey: 'DeptId__r.Manager1Id__c'                                    , domId: 'Emp{0}Dm1'                      , domType: 'text'     , hidden: true },
				{ label: 'Dm2'        , apiKey: 'DeptId__r.Manager2Id__c'                                    , domId: 'Emp{0}Dm2'                      , domType: 'text'     , hidden: true },
				{ label: 'Dpm0'       , apiKey: 'DeptId__r.ParentId__r.ManagerId__c'                         , domId: 'Emp{0}Dpm0'                     , domType: 'text'     , hidden: true },
				{ label: 'Dpm1'       , apiKey: 'DeptId__r.ParentId__r.Manager1Id__c'                        , domId: 'Emp{0}Dpm1'                     , domType: 'text'     , hidden: true },
				{ label: 'Dpm2'       , apiKey: 'DeptId__r.ParentId__r.Manager2Id__c'                        , domId: 'Emp{0}Dpm2'                     , domType: 'text'     , hidden: true },
				{ label: 'Dppm0'      , apiKey: 'DeptId__r.ParentId__r.ParentId__r.ManagerId__c'             , domId: 'Emp{0}Dppm0'                    , domType: 'text'     , hidden: true },
				{ label: 'Dppm1'      , apiKey: 'DeptId__r.ParentId__r.ParentId__r.Manager1Id__c'            , domId: 'Emp{0}Dppm1'                    , domType: 'text'     , hidden: true },
				{ label: 'Dppm2'      , apiKey: 'DeptId__r.ParentId__r.ParentId__r.Manager2Id__c'            , domId: 'Emp{0}Dppm2'                    , domType: 'text'     , hidden: true },
				{ label: 'Dpppm0'     , apiKey: 'DeptId__r.ParentId__r.ParentId__r.ParentId__r.ManagerId__c' , domId: 'Emp{0}Dpppm0'                   , domType: 'text'     , hidden: true },
				{ label: 'Dpppm1'     , apiKey: 'DeptId__r.ParentId__r.ParentId__r.ParentId__r.Manager1Id__c', domId: 'Emp{0}Dpppm1'                   , domType: 'text'     , hidden: true },
				{ label: 'Dpppm2'     , apiKey: 'DeptId__r.ParentId__r.ParentId__r.ParentId__r.Manager2Id__c', domId: 'Emp{0}Dpppm2'                   , domType: 'text'     , hidden: true },
				{ label: '社員コード'    , msgId: 'empCode_label'    , apiKey: 'EmpCode__c'                  , domId: 'Emp{0}Code'                     , domType: 'text'     , width:  95 , sortable:true, link: true },
				{ label: '社員名'        , msgId: 'empName_label'    , apiKey: 'Name'                        , domId: 'Emp{0}Name'                     , domType: 'text'     , width: 105 , sortable:true, link: true },
				{ label: 'ステータス'    , msgId: 'status_btn_title' , apiKey: '_status'                     , domId: 'Emp{0}Status'                   , domType: 'text'     , width:  70 , align: 'center' },
				{ label: '上長'          , msgId: 'tm10011000'       , apiKey: 'Manager__r.Name'             , domId: 'Emp{0}Manager'                  , domType: 'text'     , width: 105 , sortable:true },
				{ label: '部署'          , msgId: 'dept_label'       , apiKey: 'DeptId__r.Name'              , domId: 'Emp{0}DeptName'                 , domType: 'text'     , width: 135 , sortable:true },
				{ label: '勤務体系'      , msgId: 'empType_label'    , apiKey: 'EmpTypeId__r.Name'           , domId: 'Emp{0}EmpTypeName'              , domType: 'text'     , width: 130 , sortable:true }
			],
			sortKeys : [
				{ apiKey: 'EmpCode__c' }
			],
			filts    : [
			],
			childFilts    : [
			],
			children : {
			}
		},
		//------------------------------------------
		// メインフォーム
		//------------------------------------------
		// 事後申請用
		form0 : {
			areaId          : 'expApplyForm0',
			sectionTitle    : null,
			sectionTitles   : { detail : 'empExp_caption' },    // 経費精算
			objectName      : 'AtkExpApply__c',
			fields : [
				{ label: '_uniqKey'        , apiKey: '_uniqKey'                , domId: 'Form0_UNIQ'             , domType: 'text'    , hidden: true            },
				{ label: 'ID'              , apiKey: 'Id'                      , domId: 'Form0Id'                , domType: 'text'    , hidden: true, fix: 'Id' },
				{ label: '社員ID'          , apiKey: 'EmpId__c'                , domId: 'Form0EmpId'             , domType: 'text'    , hidden: true, fix: 'Id' },
				{ label: '経費費目表示区分', apiKey: 'EmpId__r.ExpItemClass__c', domId: 'Form0EmpExpItemClass'   , domType: 'text'    , hidden: true, fix: 'Id' },
				{ label: '経費事前申請ID'  , apiKey: 'ExpPreApplyId__c'        , domId: 'Form0ExpPreApplyId'     , domType: 'text'    , hidden: true, fix: 'Id' },
				{ label: '稟議ID'          , apiKey: 'ApplyId__c'              , domId: 'Form0ApplyId'           , domType: 'text'    , hidden: true, fix: 'Id' },
				{ label: '合計金額'        , apiKey: 'TotalAmount__c'          , domId: 'Form0TotalAmount'       , domType: 'currency', hidden: true, fix: 'Id' }
			]
		},
		// 出張・交通費申請
		form1 : {
			areaId          : 'expPreApplyForm1',
			title           : 'tf10002120',                 // 出張・交通費申請
			sectionTitle    : 'tf10002150',                 // 基本情報
			sectionTitles   : { detail : 'tf10002160' },    // 社員立替交通費
			objectName      : 'AtkExpPreApply__c',
			fields : [
				{ label: '_uniqKey'                                    , apiKey: '_uniqKey'                   , domId: 'Form1_UNIQ'             , domType: 'text'    , hidden: true            },
				{ label: 'ID'                                          , apiKey: 'Id'                         , domId: 'Form1Id'                , domType: 'text'    , hidden: true            },
				{ label: '社員ID'                                      , apiKey: 'EmpId__c'                   , domId: 'Form1EmpId'             , domType: 'text'    , hidden: true, fix: 'Id' },
				{ label: '経費費目表示区分'                            , apiKey: 'EmpId__r.ExpItemClass__c'   , domId: 'Form1EmpExpItemClass'   , domType: 'text'    , hidden: true            },
				{ label: '経費事前申請種別'                            , apiKey: 'Type__c'                    , domId: 'Form1Type'              , domType: 'text'    , hidden: true            },
				{ label: '合計金額'                                    , apiKey: 'TotalAmount__c'             , domId: 'Form1TotalAmount'       , domType: 'currency', hidden: true            },
				{ label: '仮払金額'                                    , apiKey: 'ProvisionalPaymentAmount__c', domId: 'Form1TotalProvisional'  , domType: 'currency', hidden: true            },
				{ label: '取引先ID'                                    , apiKey: 'AccountId__c'               , domId: 'Form1AccountId'         , domType: 'text'    , hidden: true            },
				{ label: 'ジョブコード'                                , apiKey: 'ChargeJobId__r.JobCode__c'  , domId: 'Form1JobCode'           , domType: 'text'    , hidden: true            },
				{ label: '有効開始日'                                  , apiKey: 'ChargeJobId__r.StartDate__c', domId: 'Form1JobStartDate'      , domType: 'date'    , hidden: true            },
				{ label: '有効終了日'                                  , apiKey: 'ChargeJobId__r.EndDate__c'  , domId: 'Form1JobEndDate'        , domType: 'date'    , hidden: true            },
				{ label: 'ジョブ有効'                                  , apiKey: 'ChargeJobId__r.Active__c'   , domId: 'Form1JobActive'         , domType: 'checkbox', hidden: true            },
				{ label: 'ステータス'                                  , apiKey: 'StatusD__c'                 , domId: 'Form1Status'            , domType: 'text'    , hidden: true            },
				{ label: '手配予定金額'                               , apiKey: 'PlannedAmount__c'            , domId: 'Form1PlannedAmount'    , domType: 'currency'    , hidden: true        },
				{ label: '出張種別'        , msgId: 'tf10000760'       , apiKey: 'DestinationType__c'         , domId: 'Form1DestinationType'   , domType: 'select'  , width: 440                   , required: 1   , pickList: [{v:'',n:''},{v:'1',msgId:'tf10001960'},{v:'2',msgId:'tf10001970'},{v:'3',msgId:'tf10001980'}] }, // 国内出張,海外出張,日帰り交通費
				{ label: '件名'            , msgId: 'tk10004320'       , apiKey: 'Title__c'                   , domId: 'Form1Title'             , domType: 'text'    , width: 440, maxLen:40        , required: 1    },
				{ label: '取引先'          , msgId: 'tk10000122'       , apiKey: 'AccountName__c'             , domId: 'Form1AccountName'       , domType: 'text'    , width: 440, maxLen:80        , browse: 'find' },
				{ label: 'ジョブ'          , msgId: 'job_label'        , apiKey: 'ChargeJobId__c'             , domId: 'Form1Job'               , domType: 'select'  , width: 440                   , browse: 'find', dispField: { apiKey: 'ChargeJobId__r.Name', codeKey: 'ChargeJobId__r.JobCode__c' } },
				{ label: '出発予定日'      , msgId: 'tf10000770'       , apiKey: 'StartDate__c'               , domId: 'Form1StartDate'         , domType: 'date'    , width: 108, maxLen:12, name: 'form1StartDate', browse: 'cal' , noNL: true , required: 2 },
				{ label: '出発予定時刻'    , msgId: 'tf10000780'       , apiKey: 'DepartureTime__c'           , domId: 'Form1DepartureTime'     , domType: 'time'    , width:  60, maxLen:5 , lw: 100               , noNL: true },
				{ label: '出発区分'        , msgId: 'tf10000790'       , apiKey: 'DepartureType__c'           , domId: 'Form1DepartureType'     , domType: 'select'  , width: 134           , lw:  70, required: 1  , pickList: [{v:'',n:''},{v:'0',msgId:'tf10001990'},{v:'1',msgId:'tk10004680'}] }, // 会社,直行
				{ label: '帰着予定日'      , msgId: 'tf10000800'       , apiKey: 'EndDate__c'                 , domId: 'Form1EndDate'           , domType: 'date'    , width: 108, maxLen:12, name: 'form1EndDate'  , browse: 'cal' , noNL: true , required: 2 },
				{ label: '帰着予定時刻'    , msgId: 'tf10000810'       , apiKey: 'ReturnTime__c'              , domId: 'Form1ReturnTime'        , domType: 'time'    , width:  60, maxLen:5 , lw: 100               , noNL: true },
				{ label: '帰着区分'        , msgId: 'tf10000820'       , apiKey: 'ReturnType__c'              , domId: 'Form1ReturnType'        , domType: 'select'  , width: 134           , lw:  70, required: 1  , pickList: [{v:'',n:''},{v:'0',msgId:'tf10001990'},{v:'1',msgId:'tk10004690'}] }, // 会社,直帰
				{ label: '出張先会社名'    , msgId: 'tf10000830'       , apiKey: 'DestinationName__c'         , domId: 'Form1DestinationName'   , domType: 'text'    , width: 440, maxLen:80                        },
				{ label: '出張先住所'      , msgId: 'tf10000840'       , apiKey: 'DestinationAddress__c'      , domId: 'Form1DestinationAddress', domType: 'text'    , width: 440, maxLen:255                       },
				{ label: '内容'            , msgId: 'tf10000850'       , apiKey: 'Content__c'                 , domId: 'Form1Content'           , domType: 'textarea', width: 440, maxLen:32768      , required: 1  }
			]
		},
		// 会議・交際費申請
		form2 : {
			areaId          : 'expPreApplyForm2',
			title           : 'tf10002130',             // 会議・交際費申請
			sectionTitle    : 'tf10002150',             // 基本情報
			objectName      : 'AtkExpPreApply__c',
			fields : [
				{ label: '_uniqKey'                                    , apiKey: '_uniqKey'                   , domId: 'Form2_UNIQ'             , domType: 'text'    , hidden: true            },
				{ label: 'ID'                                          , apiKey: 'Id'                         , domId: 'Form2Id'                , domType: 'text'    , hidden: true            },
				{ label: '社員ID'                                      , apiKey: 'EmpId__c'                   , domId: 'Form2EmpId'             , domType: 'text'    , hidden: true, fix: 'Id' },
				{ label: '経費費目表示区分'                            , apiKey: 'EmpId__r.ExpItemClass__c'   , domId: 'Form2EmpExpItemClass'   , domType: 'text'    , hidden: true            },
				{ label: '経費事前申請種別'                            , apiKey: 'Type__c'                    , domId: 'Form2Type'              , domType: 'text'    , hidden: true            },
				{ label: '仮払金額'                                    , apiKey: 'ProvisionalPaymentAmount__c', domId: 'Form1TotalProvisional'  , domType: 'currency', hidden: true            },
				{ label: '予定日'                                      , apiKey: 'EndDate__c'                 , domId: 'Form2EndDate'           , domType: 'date'    , hidden: true            },
				{ label: '取引先ID'                                    , apiKey: 'AccountId__c'               , domId: 'Form2AccountId'         , domType: 'text'    , hidden: true            },
				{ label: 'ジョブコード'                                , apiKey: 'ChargeJobId__r.JobCode__c'  , domId: 'Form2JobCode'           , domType: 'text'    , hidden: true            },
				{ label: '有効開始日'                                  , apiKey: 'ChargeJobId__r.StartDate__c', domId: 'Form2JobStartDate'      , domType: 'date'    , hidden: true            },
				{ label: '有効終了日'                                  , apiKey: 'ChargeJobId__r.EndDate__c'  , domId: 'Form2JobEndDate'        , domType: 'date'    , hidden: true            },
				{ label: 'ジョブ有効'                                  , apiKey: 'ChargeJobId__r.Active__c'   , domId: 'Form2JobActive'         , domType: 'checkbox', hidden: true            },
				{ label: 'ステータス'                                  , apiKey: 'StatusD__c'                 , domId: 'Form2Status'            , domType: 'text'    , hidden: true            },
				{ label: '件名'            , msgId: 'tk10004320'       , apiKey: 'Title__c'                   , domId: 'Form2Title'             , domType: 'text'    , width: 400, maxLen:40   , required: 1 },
				{ label: '取引先'          , msgId: 'tk10000122'       , apiKey: 'AccountName__c'             , domId: 'Form2AccountName'       , domType: 'text'    , width: 400, maxLen:80   , browse: 'find' },
				{ label: 'ジョブ'          , msgId: 'job_label'        , apiKey: 'ChargeJobId__c'             , domId: 'Form2Job'               , domType: 'select'  , width: 400              , browse: 'find', dispField: { apiKey: 'ChargeJobId__r.Name', codeKey: 'ChargeJobId__r.JobCode__c' } },
				{ label: '費目'            , msgId: 'expItem_head'     , apiKey: 'SocialExpItemId__c'         , domId: 'Form2SocialExpItemId'   , domType: 'select'  , width: 400, required: 1 , dispField: { apiKey: 'SocialExpItemId__r.Name' } },
				{ label: '予定日'          , msgId: 'tf10000620'       , apiKey: 'StartDate__c'               , domId: 'Form2StartDate'         , domType: 'date'    , width: 108, maxLen:12, name: 'form2Date', browse: 'cal' , required: 2 },
				{ label: '内容'            , msgId: 'tf10000850'       , apiKey: 'Content__c'                 , domId: 'Form2Content'           , domType: 'textarea', width: 400, maxLen:32768, required: 1 },
				{ label: '金額'            , msgId: 'expCost_head'     , apiKey: 'TotalAmount__c'             , domId: 'Form2TotalAmount'       , domType: 'currency', width: 120, maxLen:17   , required: 1 },
				
				//会議情報設定
				{ label: '社内参加者人数' , msgId: 'tf10000860'         , apiKey: 'OurNumber__c'            , domId: 'Form2OurNumber__c'            , domType: 'number'  , width:  80, maxLen:3    , required: 1, tooltipMsgId:'tf10001853' },
				{ label: '社内参加者'     , msgId: 'tf10011030'         , apiKey: 'InternalParticipants__c' , domId: 'Form2InternalParticipants__c' , domType: 'textarea', width:  400, maxLen:1000 },
				{ label: '社外参加者人数' , msgId: 'tf10000870'         , apiKey: 'TheirNumber__c'          , domId: 'Form2TheirNumber__c'          , domType: 'number'  , width:  80, maxLen:3    , required: 1 },
				{ label: '社外参加者'     , msgId: 'tf10011040'         , apiKey: 'ExternalParticipants__c' , domId: 'Form2ExternalParticipants__c' , domType: 'textarea', width:  400, maxLen:1000 },
				{ label: '店舗名'         , msgId: 'tf10011010'         , apiKey: 'PlaceName__c'            , domId: 'Form2PlaceName__c'            , domType: 'text'    , width:  400, maxLen:80   },
				{ label: '店舗所在地'     , msgId: 'tf10011020'         , apiKey: 'PlaceAddress__c'         , domId: 'Form2PlaceAddress__c'         , domType: 'textarea' , width: 400, maxLen:256 },

				{ label: '合計人数'        , msgId: 'tf10000880'       , apiKey: '_totalNumber'                 , domId: 'Form2TotalNumber'       , domType: 'number'  , width:  80, ro: true }
			]
		},
		// 一般経費申請
		form3 : {
			areaId          : 'expPreApplyForm3',
			title           : 'tf10002140',                 // 一般経費申請
			sectionTitle    : 'tf10002150',                 // 基本情報
			sectionTitles   : { detail : 'tf10002170' },    // 経費内容
			objectName      : 'AtkExpPreApply__c',
			fields : [
				{ label: '_uniqKey'                                    , apiKey: '_uniqKey'                   , domId: 'Form3_UNIQ'             , domType: 'text'    , hidden: true            },
				{ label: 'ID'                                          , apiKey: 'Id'                         , domId: 'Form3Id'                , domType: 'text'    , hidden: true            },
				{ label: '社員ID'                                      , apiKey: 'EmpId__c'                   , domId: 'Form3EmpId'             , domType: 'text'    , hidden: true, fix: 'Id' },
				{ label: '経費費目表示区分'                            , apiKey: 'EmpId__r.ExpItemClass__c'   , domId: 'Form3EmpExpItemClass'   , domType: 'text'    , hidden: true            },
				{ label: '経費事前申請種別'                            , apiKey: 'Type__c'                    , domId: 'Form3Type'              , domType: 'text'    , hidden: true            },
				{ label: '合計金額'                                    , apiKey: 'TotalAmount__c'             , domId: 'Form3TotalAmount'       , domType: 'currency', hidden: true            },
				{ label: '仮払金額'                                    , apiKey: 'ProvisionalPaymentAmount__c', domId: 'Form3TotalProvisional'  , domType: 'currency', hidden: true            },
				{ label: '予定日'                                      , apiKey: 'EndDate__c'                 , domId: 'Form3EndDate'           , domType: 'date'    , hidden: true            },
				{ label: '取引先ID'                                    , apiKey: 'AccountId__c'               , domId: 'Form3AccountId'         , domType: 'text'    , hidden: true            },
				{ label: 'ジョブコード'                                , apiKey: 'ChargeJobId__r.JobCode__c'  , domId: 'Form3JobCode'           , domType: 'text'    , hidden: true            },
				{ label: '有効開始日'                                  , apiKey: 'ChargeJobId__r.StartDate__c', domId: 'Form3JobStartDate'      , domType: 'date'    , hidden: true            },
				{ label: '有効終了日'                                  , apiKey: 'ChargeJobId__r.EndDate__c'  , domId: 'Form3JobEndDate'        , domType: 'date'    , hidden: true            },
				{ label: 'ジョブ有効'                                  , apiKey: 'ChargeJobId__r.Active__c'   , domId: 'Form3JobActive'         , domType: 'checkbox', hidden: true            },
				{ label: 'ステータス'                                  , apiKey: 'StatusD__c'                 , domId: 'Form3Status'            , domType: 'text'    , hidden: true            },
				{ label: '件名'            , msgId: 'tk10004320'       , apiKey: 'Title__c'                   , domId: 'Form3Title'             , domType: 'text'    , width: 400, maxLen:40                   , required: 1 },
				{ label: '取引先'          , msgId: 'tk10000122'       , apiKey: 'AccountName__c'             , domId: 'Form3AccountName'       , domType: 'text'    , width: 400, maxLen:80   , browse: 'find' },
				{ label: 'ジョブ'          , msgId: 'job_label'        , apiKey: 'ChargeJobId__c'             , domId: 'Form3Job'               , domType: 'select'  , width: 400              , browse: 'find', dispField: { apiKey: 'ChargeJobId__r.Name', codeKey: 'ChargeJobId__r.JobCode__c' } },
				{ label: '予定日'          , msgId: 'tf10000620'       , apiKey: 'StartDate__c'               , domId: 'Form3StartDate'         , domType: 'date'    , width: 108, name: 'form3Date', browse: 'cal' , required: 2 },
				{ label: '内容'            , msgId: 'tf10000850'       , apiKey: 'Content__c'                 , domId: 'Form3Content'           , domType: 'textarea', width: 400, maxLen:32768                , required: 1 }
			]
		},
		// 仮払い申請
		form4 : {
			areaId          : 'expPreApplyForm4',
			title           : 'tf10006120',                 // 一般経費申請
			sectionTitle    : 'tf10002150',                 // 基本情報
			sectionTitles   : { detail : 'tf10002170' },    // 経費内容
			objectName      : 'AtkExpPreApply__c',
			fields : [
				{ label: '_uniqKey'                                    , apiKey: '_uniqKey'                   , domId: 'Form4_UNIQ'             , domType: 'text'    , hidden: true            },
				{ label: 'ID'                                          , apiKey: 'Id'                         , domId: 'Form4Id'                , domType: 'text'    , hidden: true            },
				{ label: '社員ID'                                      , apiKey: 'EmpId__c'                   , domId: 'Form4EmpId'             , domType: 'text'    , hidden: true, fix: 'Id' },
				{ label: '経費費目表示区分'                            , apiKey: 'EmpId__r.ExpItemClass__c'   , domId: 'Form4EmpExpItemClass'   , domType: 'text'    , hidden: true            },
				{ label: '経費事前申請種別'                            , apiKey: 'Type__c'                    , domId: 'Form4Type'              , domType: 'text'    , hidden: true            },
				{ label: '合計金額'                                    , apiKey: 'TotalAmount__c'             , domId: 'Form4TotalAmount'       , domType: 'currency', hidden: true            },
				{ label: '仮払金額'                                    , apiKey: 'ProvisionalPaymentAmount__c', domId: 'Form1TotalProvisional'  , domType: 'currency', hidden: true            },
				{ label: '申請日'                                      , apiKey: 'StartDate__c'               , domId: 'Form4StartDate'         , domType: 'date'    , hidden: true            },
				{ label: '申請日'                                      , apiKey: 'EndDate__c'                 , domId: 'Form4EndDate'           , domType: 'date'    , hidden: true            },
				{ label: '取引先ID'                                    , apiKey: 'AccountId__c'               , domId: 'Form4AccountId'         , domType: 'text'    , hidden: true            },
				{ label: 'ジョブコード'                                , apiKey: 'ChargeJobId__r.JobCode__c'  , domId: 'Form4JobCode'           , domType: 'text'    , hidden: true            },
				{ label: '有効開始日'                                  , apiKey: 'ChargeJobId__r.StartDate__c', domId: 'Form4JobStartDate'      , domType: 'date'    , hidden: true            },
				{ label: '有効終了日'                                  , apiKey: 'ChargeJobId__r.EndDate__c'  , domId: 'Form4JobEndDate'        , domType: 'date'    , hidden: true            },
				{ label: 'ジョブ有効'                                  , apiKey: 'ChargeJobId__r.Active__c'   , domId: 'Form4JobActive'         , domType: 'checkbox', hidden: true            },
				{ label: 'ステータス'                                  , apiKey: 'StatusD__c'                 , domId: 'Form4Status'            , domType: 'text'    , hidden: true            },
				{ label: '件名'            , msgId: 'tk10004320'       , apiKey: 'Title__c'                   , domId: 'Form4Title'             , domType: 'text'    , width: 400, maxLen:40                   , required: 1 },
				{ label: '取引先'          , msgId: 'tk10000122'       , apiKey: 'AccountName__c'             , domId: 'Form4AccountName'       , domType: 'text'    , width: 400, maxLen:80   , browse: 'find' },
				{ label: 'ジョブ'          , msgId: 'job_label'        , apiKey: 'ChargeJobId__c'             , domId: 'Form4Job'               , domType: 'select'  , width: 400              , browse: 'find', dispField: { apiKey: 'ChargeJobId__r.Name', codeKey: 'ChargeJobId__r.JobCode__c' } },
				{ label: '処理日'          , msgId: 'tf10006100'       , apiKey: 'ApplyDate__c'               , domId: 'Form4ApplyDate'         , domType: 'date'    , width: 108, name: 'Form4Date', browse: 'cal' , required: 2 },
				{ label: '内容'            , msgId: 'tf10000850'       , apiKey: 'Content__c'                 , domId: 'Form4Content'           , domType: 'textarea', width: 400, maxLen:32768                , required: 1 }
			]
		},
		formT : {
			areaId          : 'expApplyFormT',
			sectionTitle    : 'empExp_caption'      // 経費精算
		},
		//------------------------------------------
		// フォーム内セクション
		//------------------------------------------
		// 出張明細
		sectionJtb    : {
			discernment         : 'jtbDetail',
			title               : 'jt12000060',     // J'sNAVI明細
			formCss             : 'ts-section-jtb',
			objectName          : 'AtkEmpExp__c',
			relationshipName    : 'ExpJsNavi__r',
			child               : true,
			fields : [
				{ label: '_uniqKey'                                  , apiKey: '_uniqKey'           , domId: 'SecJtb{0}_UNIQ'        , domType: 'text'   , hidden: true },
				{ label: 'ID'                                        , apiKey: 'Id'                 , domId: 'SecJtb{0}Id'           , domType: 'text'   , hidden: true },
				{ label: '経費事前申請ID'                            , apiKey: 'ExpPreApplyId__c'   , domId: 'SecJtb{0}ExpPreApplyId', domType: 'text'   , hidden: true },
				{ label: '処理番号'                                  , apiKey: 'OperationNo__c'     , domId: 'SecJtb{0}OperationNo'  , domType: 'text'   , hidden: true },
				{ label: '副番号'                                    , apiKey: 'SubNo__c'           , domId: 'SecJtb{0}SubNo'        , domType: 'text'   , hidden: true },
				{ label: '取得データ'                                , apiKey: 'Route__c'           , domId: 'SecJtb{0}Route'        , domType: 'text'   , hidden: true },
				{ label: '費目'                                      , apiKey: 'ExpItemId__c'       , domId: 'SecJtbl{0}ExpItem'     , domType: 'text'   , hidden:true},
				{ label: '日付'          , msgId: 'date_head'        , apiKey: 'Date__c'            , domId: 'SecJtb{0}Date'         , domType: 'date'   , width: 90, maxLen:12 , format:'M/d+', hiddenPlus: true, ro: true},
				{ label: '交通機関名'    , msgId: 'jt12000090'       , apiKey: 'Transport__c'       , domId: 'SecJtb{0}Type'         , domType: 'text'   , width: 150, ro: true},
				{ label: 'ステータス'    , msgId: 'status_btn_title' , apiKey: 'Status__c'          , domId: 'SecJtb{0}Status'       , domType: 'text'   , width: 100, ro: true},
				{ label: '金額'          , msgId: 'tf10000950'       , apiKey: 'Cost__c'            , domId: 'SecJtb{0}Cost'         , domType: 'currency' , width: 90, ro: true },
				{ label: '内容'          , msgId: 'tf10000850'       , apiKey: 'Content__c'         , domId: 'SecJtb{0}Content'      , domType: 'text'   , width: 300, maxLen:1000, ro: true},
				{ label: '備考'          , msgId: 'expNote_head'     , apiKey: 'Note__c'            , domId: 'SecJtb{0}Note'         , domType: 'text'   , width: 250, maxLen:1000, ro: true}
			]
		},
		// 日当・宿泊費
		sectionAllowance    : {
			discernment         : 'allowance',
			title               : 'tf10002180',             // 出張手当・宿泊手当
			formCss             : 'ts-section-allowance',
			objectName          : 'AtkExpPreApplyDay__c',
			relationshipName    : 'ExpPreApplyDay__r',
			child               : true,
			fields : [
				{ label: '_uniqKey'                                  , apiKey: '_uniqKey'           , domId: 'SecAllow{0}_UNIQ'        , domType: 'text'   , hidden: true             },
				{ label: 'ID'                                        , apiKey: 'Id'                 , domId: 'SecAllow{0}Id'           , domType: 'text'   , hidden: true             },
				{ label: '経費事前申請ID'                            , apiKey: 'ExpPreApplyId__c'   , domId: 'SecAllow{0}ExpPreApplyId', domType: 'text'   , hidden: true, fix: 'Id'  },
				{ label: '日付'          , msgId: 'date_head'        , apiKey: 'Date__c'            , domId: 'SecAllow{0}Date'         , domType: 'date'   , width: 108, maxLen:12 , format:'M/d+', hiddenPlus: true, ro: true           },
				{ label: '日当'          , msgId: 'tf10000890'       , apiKey: 'AllowanceItemId__c' , domId: 'SecAllow{0}Allow'        , domType: 'select' , width: 200               , dispField: { apiKey: 'AllowanceItemId__r.Name' } },
				{ label: '宿泊'          , msgId: 'tf10000900'       , apiKey: 'HotelItemId__c'     , domId: 'SecAllow{0}Hotel'        , domType: 'select' , width: 200               , dispField: { apiKey: 'HotelItemId__r.Name'     } },
				{ label: '備考'          , msgId: 'expNote_head'     , apiKey: 'Note__c'            , domId: 'SecAllow{0}Note'         , domType: 'text'   , width: 250, maxLen:255   }
			]
		},
		// 手配回数券
		sectionCoupon       : {
			discernment         : 'coupon',
			title               : 'tf10002190',             // 手配回数券
			formCss             : 'ts-section-coupon',
			objectName          : 'AtkExpPreApply__c',
			virChild            : true,
			virMax              : 2,
			fields : [
				{ label: '_uniqKey'                              , apiKey: '_uniqKey'                                       , domId: 'SectCoupon{0}_UNIQ', domType: 'text'   , hidden: true },
				{ check: true, domId: 'Coupon{0}Check_', domType: 'checkbox', width: 24 },
				{ label: '乗車日'    , msgId: 'tf10000910'       , apiKey: 'couponDate'    , apiName: 'Coupon{0}Date__c'    , domId: 'SectCoupon{0}Date' , domType: 'date'   , width: 108, maxLen:12 , name: 'coupon{0}Date', browse: 'cal' },
				{ label: '回数券種別', msgId: 'tf10000920'       , apiKey: 'couponName'    , apiName: 'Coupon{0}Name__c'    , domId: 'SectCoupon{0}Name' , domType: 'select' , width: 300            , required: 1, dispField: { apiKey: 'couponName' } },
				{ label: '枚数'      , msgId: 'tf10000930'       , apiKey: 'couponQuantity', apiName: 'Coupon{0}Quantity__c', domId: 'SectCoupon{0}Quant', domType: 'number' , width:  50, maxLen:2  , required: 1 },
				{ label: '備考'      , msgId: 'expNote_head'     , apiKey: 'couponNote'    , apiName: 'Coupon{0}Note__c'    , domId: 'SectCoupon{0}Note' , domType: 'text'   , width: 250, maxLen:255 }
			]
		},
		// 社員立替交通費・経費内容
		sectionDetail       : {
			discernment         : 'detail',
			title               : null,
			formCss             : 'ts-section-detail',
			objectName          : 'AtkEmpExp__c',
			relationshipName    : 'EmpExp__r',
			child               : true,
			fields : [
				{ label: '_uniqKey'                                  , apiKey: '_uniqKey'                      , domId: 'SectDetail{0}_UNIQ'               , domType: 'text'    , hidden: true },
				{ label: 'ID'                                        , apiKey: 'Id'                            , domId: 'SectDetail{0}Id'                  , domType: 'text'    , hidden: true },
				{ label: '削除フラグ'                                , apiKey: '_removed'                      , domId: 'SectDetail{0}_Removed'            , domType: 'checkbox', hidden: true },
				{ label: 'JsNavi差分フラグ'                          , apiKey: '_diffJsNavi'                   , domId: 'SectDetail{0}_DiffJsNavi'         , domType: 'checkbox', hidden: true },
				{ label: 'JsNavi追加フラグ'                          , apiKey: '_addJsNavi'                    , domId: 'SectDetail{0}_AddJsNavi'         , domType: 'checkbox', hidden: true },
				{ label: 'JsNavi実績データ'                          , apiKey: 'JsNaviActualId__c'             , domId: 'SectDetail{0}JsNaviActualId'      , domType: 'text'    , hidden: true },
				{ check: true, domId: 'SectDetail{0}Check_', domType: 'checkbox', width: 24 },
				{ label: '利用日'        , msgId: 'tf10000940'       , apiKey: 'Date__c'                       , domId: 'SectDetail{0}Date'                , domType: 'date'    , width: 108   , ro: true, required: 1, link: true, name: 'detail{0}Date', browse: 'cal' },
				{ label: '費目'          , msgId: 'expItem_head'     , apiKey: 'ExpItemId__c'                  , domId: 'SectDetail{0}ExpItem'             , domType: 'select'  , width: 100   , ro: true, required: 1, link: true, dispField: { apiKey: 'ExpItemId__r.Name' } },
				{ label: '内容'          , msgId: 'tf10000850'                                                 , domId: 'SectDetail{0}Content'             , domType: 'route'   , width:'30%'  , ro: true                 },
				{ label: '金額'          , msgId: 'tf10000950'       , apiKey: 'Cost__c'                       , domId: 'SectDetail{0}Cost'                , domType: 'currency', width: 110   , ro: true, required: 1    },
				{ label: 'ジョブ'        , msgId: 'job_label'        , apiKey: 'JobId__c'                      , domId: 'SectDetail{0}JobId'               , domType: 'select'  , width:'20%'  , ro: true, dispField: { apiKey: 'JobId__r.Name', codeKey: 'JobId__r.JobCode__c' } },
				{ label: '備考'          , msgId: 'expNote_head'     , apiKey: 'Detail__c'                     , domId: 'SectDetail{0}Detail'              , domType: 'text'    , width: 200   , ro: true                 }
			]
		},
		// 海外出張
		sectionForeign      : {
			discernment     : 'foreign',
			title           : 'tf10001970',             // 海外出張
			formCss         : 'ts-section-foreign',
			objectName      : 'AtkExpPreApply__c',
			fields : [
				{ label: '_uniqKey'                                  , apiKey: '_uniqKey'               , domId: 'SectForeign_UNIQ'               , domType: 'text'    , hidden: true },
				{ label: '現地受入部署'  , msgId: 'tf10000960'       , apiKey: 'OverseaOption1__c'      , domId: 'SectForeignOverseaOption1'      , domType: 'text'    , width: 200, maxLen:80, areaKey: 'z1' },
				{ label: 'パスポート申請', msgId: 'tf10000970'       , apiKey: 'OverseaCheckList1__c'   , domId: 'SectForeignOverseaCheckList1'   , domType: 'select'  , width: 120           , areaKey: 'z1', pickList: [{v:'',n:''},{v:'1',msgId:'tm10010590'},{v:'0',msgId:'tm10010600'}] }, // する,しない
				{ label: '健康診断実施'  , msgId: 'tf10000980'       , apiKey: 'OverseaCheckList3__c'   , domId: 'SectForeignOverseaCheckList3'   , domType: 'select'  , width: 120           , areaKey: 'z1', pickList: [{v:'',n:''},{v:'1',msgId:'tm10010590'},{v:'0',msgId:'tm10010600'}] }, // する,しない
				{ label: '産業医への確認', msgId: 'tf10000990'       , apiKey: 'OverseaCheckList4__c'   , domId: 'SectForeignOverseaCheckList4'   , domType: 'select'  , width: 120           , areaKey: 'z1', pickList: [{v:'',n:''},{v:'0',msgId:'tf10002000'},{v:'1',msgId:'tf10002010'}] }, // 未確認,確認済み
				{ label: '渡航準備金申請', msgId: 'tf10001000'       , apiKey: 'TravelAllowance__c'     , domId: 'SectForeignTravelAllowance'     , domType: 'currency', width: 120, maxLen:17, areaKey: 'z1' },
				{ label: '責任者名'      , msgId: 'tf10001010'       , apiKey: 'OverseaOption2__c'      , domId: 'SectForeignOverseaOption2'      , domType: 'text'    , width: 200, maxLen:80, areaKey: 'z2' },
				{ label: 'ビザ申請'      , msgId: 'tf10001020'       , apiKey: 'OverseaCheckList2__c'   , domId: 'SectForeignOverseaCheckList2'   , domType: 'select'  , width: 120           , areaKey: 'z2', pickList: [{v:'',n:''},{v:'1',msgId:'tm10010590'},{v:'0',msgId:'tm10010600'}] }, // する,しない
				{ label: '保険申請'      , msgId: 'tf10001030'       , apiKey: 'OverseaCheckList5__c'   , domId: 'SectForeignOverseaCheckList5'   , domType: 'select'  , width: 120           , areaKey: 'z2', pickList: [{v:'',n:''},{v:'1',msgId:'tm10010590'},{v:'0',msgId:'tm10010600'}] } // する,しない
			]
		},
		// 仮払い申請
		sectionProvisional  : {
			discernment     : 'provisional',
			title           : 'tf10002200',             // 仮払い申請
			formCss         : 'ts-section-provisional',
			objectName      : 'AtkExpPreApply__c',
			fields : [
				{ label: '_uniqKey'                                , apiKey: '_uniqKey'                        , domId: 'SectProvisional_UNIQ'             , domType: 'text'    , hidden: true },
				{ label: '仮払申請内容', msgId: 'tf10001040'       , apiKey: 'ProvisionalPaymentApplication__c', domId: 'SectProvisionalPaymentApplication', domType: 'textarea', width: 320, maxLen:255, areaKey: 'z1', required: 1 },
				{ label: '仮払希望日'  , msgId: 'tf10006130'       , apiKey: 'ExpectedPayDate__c'              , domId: 'SectProvisionalPaymentExPayDate'  , domType: 'date'    , width: 108, maxLen:17 , areaKey: 'z1', name: 'PaymentDate', browse: 'cal' },
				{ label: '仮払金額'    , msgId: 'tf10001050'       , apiKey: 'ProvisionalPaymentAmount__c'     , domId: 'SectProvisionalPaymentAmount'     , domType: 'currency', width: 120, maxLen:17 , areaKey: 'z2', required: 1 }
			]
		},
		// 手配チケット
		sectionTicket       : {
			discernment     : 'ticket',
			title           : 'tf10002210',             // 手配チケット
			formCss         : 'ts-section-ticket',
			objectName      : 'AtkExpPreApply__c',
			virChild        : true,
			virMax          : 5,
			fields : [
				{ label: '_uniqKey'                                   , apiKey: '_uniqKey'                                         , domId: 'SectTicket{0}_UNIQ'   , domType: 'text', hidden: true },
				{ check: true, domId: 'SectTicket{0}Check_', domType: 'checkbox', width: 24 },
				{ label: '乗車日'         , msgId: 'tf10000910'       , apiKey: 'ticketDate'    , apiName: 'Ticket{0}Date__c'      , domId: 'SectTicket{0}Date'    , domType: 'date'    , width: 108   , maxLen:17 , required: 1, name: 'ticket{0}Date', browse: 'cal' },
				{ label: '区間'           , msgId: 'tf10001060'       , apiKey: 'ticketRoute'   , apiName: 'Ticket{0}Route__c'     , domId: 'SectTicket{0}Route'   , domType: 'text'    , width: 200   , maxLen:80 , required: 1 },
				{ label: '希望列車名/便名', msgId: 'tf10001070'       , apiKey: 'ticketRequest1', apiName: 'Ticket{0}Request1st__c', domId: 'SectTicket{0}Request1', domType: 'text'    , width: 124   , maxLen:80 , headSpan: 3, placeholder:{msgId:'tf10002020'} },
				{ label: ''                                           , apiKey: 'ticketRequest2', apiName: 'Ticket{0}Request2nd__c', domId: 'SectTicket{0}Request2', domType: 'text'    , width: 124   , maxLen:80 , headSpan: 0, placeholder:{msgId:'tf10002030'} },
				{ label: ''                                           , apiKey: 'ticketRequest3', apiName: 'Ticket{0}Request3rd__c', domId: 'SectTicket{0}Request3', domType: 'text'    , width: 124   , maxLen:80 , headSpan: 0, placeholder:{msgId:'tf10002040'} },
				{ label: '希望席'         , msgId: 'tf10001080'       , apiKey: 'ticketSeat'    , apiName: 'Ticket{0}Seat__c'      , domId: 'SectTicket{0}Seat'    , domType: 'text'    , width: 180   , maxLen:80  },
				{ label: '備考'           , msgId: 'expNote_head'     , apiKey: 'ticketNote'    , apiName: 'Ticket{0}Note__c'      , domId: 'SectTicket{0}Note'    , domType: 'text'    , width: 'auto', maxLen:255 }
			]
		},
		// 社員情報
		sectionEmp : {
			discernment         : 'emp',
			title               : 'empInfo_label',      // 社員情報
			formCss             : 'ts-section-emp',
			objectName          : 'AtkEmp__c',
			readOnly            : true,
			fields : [
				{ label: '_uniqKey'                              , apiKey: '_uniqKey'               , domId: 'Emp_UNIQ'    , domType: 'text'   , hidden: true },
				{ label: 'EmpId'                                 , apiKey: 'Id'                     , domId: 'EmpId'       , domType: 'text'   , hidden: true },
				{ label: '写真'      , msgId: 'tf10001090'       , apiKey: 'UserId__r.SmallPhotoUrl', domId: 'EmpPhoto'    , domType: 'photo'  , width:  80  , areaKey: 'z1' },
				{ label: '社員名'    , msgId: 'empName_label'    , apiKey: 'Name'                   , domId: 'EmpName'     , domType: 'text'   , width: 200  , areaKey: 'z2' },
				{ label: '部署'      , msgId: 'dept_label'       , apiKey: 'DeptId__r.Name'         , domId: 'EmpDeptName' , domType: 'text'   , width: 300  , areaKey: 'z2' }
			]
		},
		// 経費情報
		sectionExpHead : {
			discernment         : 'expHead',
			title               : '',
			formCss             : 'ts-section-exp-head',
			objectName          : 'AtkExpPreApply__c',
			readOnly            : true,
			fields : [
				{ label: '_uniqKey'                                 , apiKey: '_uniqKey'                                    , domId: 'Emp_UNIQ'                           , domType: 'text'     , hidden: true },
				{ label: '事前申請番号' , msgId: 'tf10001100'       , apiKey: 'ExpPreApplyId__r.ExpPreApplyNo__c'           , domId: 'ExpPreApplyNo'                      , domType: 'text'     , width: 'auto' , areaKey: 'z1', link: true },
				{ label: '件名'         , msgId: 'tk10004320'       , apiKey: 'ExpPreApplyId__r.Title__c'                   , domId: 'ExpPreApplyTitle'                   , domType: 'text'     , width: 'auto' , areaKey: 'z2', link: true },
				{ label: '種別'         , msgId: 'tk10000262'       , apiKey: 'ExpPreApplyId__r.Type__c'                    , domId: 'ExpPreApplyType'                    , domType: 'select'   , width: 'auto' , areaKey: 'z3', pickList: [{v:'',n:''},{v:'出張・交通費',msgId:'tf10001410'},{v:'会議・交際費',msgId:'tf10000600'},{v:'一般経費',msgId:'tf10001420'},{v:'仮払申請',msgId:'tf10006120'}] },
				{ label: '合計金額'     , msgId: 'tf10001110'       , apiKey: 'ExpPreApplyId__r.TotalAmount__c'             , domId: 'ExpPreApplyTotalAmount'             , domType: 'currency' , width: 120    , areaKey: 'z2' },
				{ label: '仮払金額'     , msgId: 'tf10000530'       , apiKey: 'ExpPreApplyId__r.ProvisionalPaymentAmount__c', domId: 'ExpPreApplyProvisionalPaymentAmount', domType: 'currency' , width: 120    , areaKey: 'z3' }
			]
		},
		// 経費情報（J'sNAVI Jr利用時）
		sectionExpHeadJtb : {
			discernment         : 'expHeadJtb',
			title               : '',
			formCss             : 'ts-section-exp-head',
			objectName          : 'AtkExpPreApply__c',
			readOnly            : true,
			fields : [
				{ label: '_uniqKey'                                 , apiKey: '_uniqKey'                                    , domId: 'Emp_UNIQ'                           , domType: 'text'     , hidden: true },
				{ label: '事前申請番号' , msgId: 'tf10001100'       , apiKey: 'ExpPreApplyId__r.ExpPreApplyNo__c'           , domId: 'ExpPreApplyNo'                      , domType: 'text'     , width: 'auto' , areaKey: 'z1', link: true },
				{ label: '件名'         , msgId: 'tk10004320'       , apiKey: 'ExpPreApplyId__r.Title__c'                   , domId: 'ExpPreApplyTitle'                   , domType: 'text'     , width: 'auto' , areaKey: 'z2', link: true },
				{ label: '種別'         , msgId: 'tk10000262'       , apiKey: 'ExpPreApplyId__r.Type__c'                    , domId: 'ExpPreApplyType'                    , domType: 'select'   , width: 'auto' , areaKey: 'z3', pickList: [{v:'',n:''},{v:'出張・交通費',msgId:'tf10001410'},{v:'会議・交際費',msgId:'tf10000600'},{v:'一般経費',msgId:'tf10001420'},{v:'仮払申請',msgId:'tf10006120'}] },
				{ label: '合計金額'     , msgId: 'tf10001110'       , apiKey: 'ExpPreApplyId__r.TotalAmount__c'             , domId: 'ExpPreApplyTotalAmount'             , domType: 'currency' , width: 120    , areaKey: 'z1' },
				{ label: '仮払金額'     , msgId: 'tf10000530'       , apiKey: 'ExpPreApplyId__r.ProvisionalPaymentAmount__c', domId: 'ExpPreApplyProvisionalPaymentAmount', domType: 'currency' , width: 120    , areaKey: 'z2' },
				{ label: '内 手配予定金額', msgId: 'jt13000080'     , apiKey: 'ExpPreApplyId__r.PlannedAmount__c'           , domId: 'JsNaviPlannedAmount'                , domType: 'currency' , width: 120    , areaKey: 'z3' },
				{ label: '手配実績金額' , msgId: 'jt13000090'       , apiKey: '_jsNaviActualAmount'                         , domId: 'JsNaviActualAmount'                 , domType: 'currency' , width: 120    , areaKey: 'z3' }
			]
		},
		// 稟議情報
		sectionExpRingi : {
			discernment         : 'expRingi',
			title               : 'tk10004350',             // この経費に関連する稟議
			formCss             : 'ts-section-exp-ringi',
			objectName          : 'AtkExpApply__c',
			dock                : 'tail',
			readOnly            : true,
			fields : [
				{ label: '_uniqKey'                                 , apiKey: '_uniqKey'                      , domId: 'Apply_UNIQ'          , domType: 'text'     , hidden: true  },
				{ label: '申請No'       , msgId: 'tk10004310'       , apiKey: 'ApplyId__r.ApplicationNo__c'   , domId: 'ApplyApplicationNo'  , domType: 'text'     , width: 'auto', lw: 80, areaKey: 'z1', link: true },
				{ label: '種別'         , msgId: 'tk10000262'       , apiKey: 'ApplyId__r.Type__c'            , domId: 'ApplyType'           , domType: 'text'     , width: 'auto', lw: 80, areaKey: 'z2'             },
				{ label: '件名'         , msgId: 'tk10004320'       , apiKey: 'ApplyId__r.Name'               , domId: 'ApplyName'           , domType: 'text'     , width: 'auto', lw: 80, areaKey: 'z1', link: true }
			]
		},
		// 添付ファイル
		sectionExpAttach : {
			discernment         : 'expAttach',
			title               : 'tk10000077',             // 添付ファイル
			formCss             : 'ts-section-exp-attach',
			objectName          : 'AtkExpApply__c',
			dock                : 'tail',
			readOnly            : true,
			fields : [
				{ label: '_uniqKey'                                 , apiKey: '_uniqKey'                      , domId: 'Apply_UNIQ'          , domType: 'text'     , hidden: true  }
			]
		},
		// 経費コメント
		sectionExpComment : {
			discernment         : 'expComment',
			title               : '',
			formCss             : 'ts-section-exp-comment',
			objectName          : 'AtkExpApply__c',
			readOnly            : true,
			fields : [
				{ label: '_uniqKey'                                 , apiKey: '_uniqKey'   , domId: 'Emp_UNIQ'        , domType: 'text'     , hidden: true },
				{ label: 'コメント'     , msgId: 'comment_head'     , apiKey: 'Comment__c' , domId: 'ExpApplyComment' , domType: 'text'     , width: '700px', maxLen:32000, areaKey: 'z1' }
			]
		},
		// 経費入力補助
		sectionExpAssist : {
			discernment         : 'expAssist',
			title               : 'tk10004350',             // この経費に関連する稟議
			formCss             : 'ts-section-exp-assist',
			objectName          : 'AtkExpApply__c',
			fields : [
				{ label: '_uniqKey'                                 , apiKey: '_uniqKey'               , domId: 'Assist_UNIQ'               , domType: 'text'     , hidden: true  },
				{ label: '件名'         , msgId: 'tk10004320'       , apiKey: 'Title__c'               , domId: 'AssistTitle'               , domType: 'text'     , width: 400   , areaKey: 'z0' },
				{ label: '精算区分'     , msgId: 'tf10006080'       , apiKey: 'ExpenseType__c'         , domId: 'AssistExpenseType'         , domType: 'select'   , width: 200   , required: 1   },
				{ label: '精算方法'     , msgId: 'tf10006090'       , apiKey: 'PayExpItemId__c'        , domId: 'AssistPayExpItemId'        , domType: 'select'   , width: 200   , required: 1, dispField: { apiKey: 'PayExpItemId__r.Name' } },
				{ label: '処理日'       , msgId: 'tf10006100'       , apiKey: 'ApplyDate__c'           , domId: 'AssistApplyDate'           , domType: 'date'     , width: 108   , name: 'ApplyDate', browse: 'cal' },
				{ label: '支払予定日'   , msgId: 'tf10006110'       , apiKey: 'ExpectedPayDate__c'     , domId: 'AssistExPayDate'           , domType: 'date'     , width: 108   , name: 'PayDate'  , browse: 'cal' },
				{ label: '仮払申請'     , msgId: 'tf10006120'       , apiKey: 'ProvisionalPaymentId__c', domId: 'AssistProvisionalPaymentId', domType: 'select'   , width: 200   , browse: 'find', dispField: { apiKey: 'ProvisionalPaymentId__r.Title__c' } },
				{ label: '負担部署'     , msgId: 'tf10006000'       , apiKey: 'ChargeDeptId__c'        , domId: 'AssistChargeDeptId'        , domType: 'select'   , width: 200   , browse: 'find', dispField: { apiKey: 'ChargeDeptId__r.Name', codeKey: 'ChargeDeptId__r.DeptCode__c' } },
				{ label: 'ジョブ'       , msgId: 'job_label'        , apiKey: 'ChargeJobId__c'         , domId: 'AssistChargeJobId'         , domType: 'select'   , width: 200   , browse: 'find', dispField: { apiKey: 'ChargeJobId__r.Name', codeKey: 'ChargeJobId__r.JobCode__c' } },
				{ label: ''                                         , apiKey: 'ExtraItem1__c'          , domId: 'AssistExtraItem1'          , domType: 'text'     , width: 150   , maxLen:255                   },
				{ label: ''                                         , apiKey: 'ExtraItem2__c'          , domId: 'AssistExtraItem2'          , domType: 'text'     , width: 150   , maxLen:255                   }
			]
		},
		// 経費入力フィルター
		sectionExpFilter : {
			discernment         : 'expFilter',
			title               : 'ci00000200',             // 絞り込み
			formCss             : 'ts-section-exp-filter',
			fields : [
				{ label: '_uniqKey'                                 , apiKey: '_uniqKey'               , domId: 'Filter_UNIQ'               , domType: 'text'     , hidden: true  },
				{ label: '精算区分'     , msgId: 'tf10006080'       , apiKey: 'ExpenseType__c'         , domId: 'FilterExpenseType'         , domType: 'select'   , width: 200   , defaultIsTop: true }
			]
		},
		//------------------------------------------
		// ダイアログ
		//------------------------------------------
		// 経費事前申請の検索
		searchExpPreApply : {
			title           : ['tf10002070', 'tf10002220'],         // 経費事前申請の検索
			formCss         : 'ts-dialog-search-expPreApply',
			type            : 'searchCondition',
			fields          : [
				{ label: '申請番号'      , msgId: 'expApplyNo_label' , apiKey: 'ExpPreApplyNo__c'           , domId: 'SearchExpPreApplyNo'                 , domType: 'text'           , width: 300, matchType:2 },
				{ label: '社員名'        , msgId: 'empName_label'    , apiKey: 'EmpId__r.Name'              , domId: 'SearchExpPreEmpName'                 , domType: 'text'           , width: 300, matchType:3 },
				{ label: '申請日付範囲'  , msgId: 'tf10000680'       , apiKey: 'ApplyTime__c'               , domId: 'SearchExpPreApplyTime'               , domType: 'dateRange'      , width: 108, name: 'searchApplyTime', dataType: 'dateTime' },
				{ label: '件名'          , msgId: 'tk10004320'       , apiKey: 'Title__c'                   , domId: 'SearchExpPreTitle'                   , domType: 'text'           , width: 300, matchType:3 },
				{ label: '種別'          , msgId: 'tk10000262'       , apiKey: 'Type__c'                    , domId: 'SearchExpPreType'                    , domType: 'select'         , width: 280, pickList: [{v:'',n:''},{v:'出張・交通費',msgId:'tf10001410'},{v:'会議・交際費',msgId:'tf10000600'},{v:'一般経費',msgId:'tf10001420'},{v:'仮払申請',msgId:'tf10006120'}] },
				{ label: '利用日付範囲'  , msgId: 'tf10000700'       , apiKey: '_startEnd'                  , domId: 'SearchExpPreDate'                    , domType: 'dateRange'      , width: 108, name: 'searchDate', colNames: ['StartDate__c','EndDate__c'] },
				{ label: '事前申請状態'  , msgId: 'tf10001120'       , apiKey: 'StatusD__c'                 , domId: 'SearchExpPreStatus'                  , domType: 'select'         , width: 280, subType:'status', pickList: [{v:'',n:''},{v:'精算済み以外',msgId:'tf10001950'},{v:'精算済み',msgId:'reimbursement_label'},{v:'承認済み',msgId:'tm10003480'},{v:'承認待ち',msgId:'waitApproval_label'},{v:'申請取消',msgId:'tm10003500'},{v:'却下',msgId:'tm10003490'},{v:'未申請',msgId:'tm10003560'}] },
				{ label: '精算申請状態'  , msgId: 'tf10001130'       , apiKey: '_childStatus'               , domId: 'SearchExpPreExpApplyStatus'          , domType: 'select'         , width: 280, subType:'status', pickList: [{v:'',n:''},{v:'精算済み以外',msgId:'tf10001950'},{v:'精算済み',msgId:'reimbursement_label'},{v:'承認済み',msgId:'tm10003480'},{v:'承認待ち',msgId:'waitApproval_label'},{v:'申請取消',msgId:'tm10003500'},{v:'却下',msgId:'tm10003490'},{v:'未申請',msgId:'tm10003560'}] },
				{ label: '金額範囲'      , msgId: 'tf10000740'       , apiKey: 'TotalAmount__c'             , domId: 'SearchExpPreTotalAmount'             , domType: 'currencyRange'  , width: 120 },
				{ label: '仮払金額範囲'  , msgId: 'tf10000710'       , apiKey: 'ProvisionalPaymentAmount__c', domId: 'SearchExpPreProvisionalPaymentAmount', domType: 'currencyRange'  , width: 120 }
			]
		},
		// 経費申請の検索
		searchExpApply : {
			title           : ['tf10002070', 'empExp_caption'],       // 経費精算の検索
			formCss         : 'ts-dialog-search-expApply',
			type            : 'searchCondition',
			fields          : [
				{ label: '精算申請番号'  , msgId: 'tf10000550'       , apiKey: 'ExpApplyNo__c'                    , domId: 'SearchExpApplyNo'                 , domType: 'text'           , width: 300, matchType:2 },
				{ label: '申請日付範囲'  , msgId: 'tf10000680'       , apiKey: 'ApplyTime__c'                     , domId: 'SearchExpApplyTime'               , domType: 'dateRange'      , width: 108, name: 'searchApplyTime', dataType: 'dateTime' },
				{ label: '利用日付範囲'  , msgId: 'tf10000700'       , apiKey: '_startEnd'                        , domId: 'SearchExpDate'                    , domType: 'dateRange'      , width: 108, name: 'searchDate', colNames: ['StartDate__c','EndDate__c'] },
				{ label: '事前申請番号'  , msgId: 'tf10001100'       , apiKey: 'ExpPreApplyId__r.ExpPreApplyNo__c', domId: 'SearchExpPreApplyNo'              , domType: 'text'           , width: 300, matchType:2 },
				{ label: '件名'          , msgId: 'tk10004320'       , apiKey: 'TitleD__c'                        , domId: 'SearchTitle'                      , domType: 'text'           , width: 300, matchType:3 },
				{ label: '種別'          , msgId: 'tk10000262'       , apiKey: 'TypeD__c'                         , domId: 'SearchExpPreType'                 , domType: 'select'         , width: 280, pickList: [{v:'',n:''},{v:'出張・交通費',msgId:'tf10001410'},{v:'会議・交際費',msgId:'tf10000600'},{v:'一般経費',msgId:'tf10001420'},{v:'仮払申請',msgId:'tf10006120'}] },
				{ label: '精算申請状態'  , msgId: 'tf10001130'       , apiKey: 'StatusD__c'                       , domId: 'SearchExpStatus'                  , domType: 'select'         , width: 280, subType:'status', pickList: [{v:'',n:''},{v:'精算済み以外',msgId:'tf10001950'},{v:'精算済み',msgId:'reimbursement_label'},{v:'承認済み',msgId:'tm10003480'},{v:'承認待ち',msgId:'waitApproval_label'},{v:'申請取消',msgId:'tm10003500'},{v:'却下',msgId:'tm10003490'},{v:'未申請',msgId:'tm10003560'}] },
				{ label: '金額範囲'      , msgId: 'tf10000740'       , apiKey: 'TotalCost__c'                     , domId: 'SearchExpTotalCost'               , domType: 'currencyRange'  , width: 120 },
				{ label: '仮払金額範囲'  , msgId: 'tf10000710'       , apiKey: 'ProvisionalPaymentAmount__c'      , domId: 'SearchExpProvisionalPaymentAmount', domType: 'currencyRange'  , width: 120 }
			]
		},
		// 経費入力
		dialogDetail : {
			fields          : [
				{ label: 'ID'                                        , apiKey: 'Id'                            , domId: 'DlgDetailId'                  , domType: 'text'    , hidden: true },
				{ label: '支払先ID'                                  , apiKey: 'PayeeId__c'                    , domId: 'DlgDetailPayeeId'             , domType: 'text'    , hidden: true },
				{ label: '支払種別'                                  , apiKey: 'PayeeId__r.PayeeType__c'       , domId: 'DlgDetailPayeeType'           , domType: 'text'    , hidden: true },
				{ label: '支払先精算区分'                            , apiKey: 'PayeeId__r.ExpenseType__c'     , domId: 'DlgDetailPayExpenseType'      , domType: 'text'    , hidden: true },
				{ label: '消費税'                                    , apiKey: 'TaxRate__c'                    , domId: 'DlgDetailTaxRate'             , domType: 'text'    , hidden: true },
				{ label: '利用日'        , msgId: 'tf10000940'       , apiKey: 'Date__c'                       , domId: 'DlgDetailDate'                , domType: 'date'    , width: 108, maxLen:12, name: 'dlgDetailDate', browse: 'cal', required: 1 },
				{ label: '費目'          , msgId: 'expItem_head'     , apiKey: 'ExpItemId__c'                  , domId: 'DlgDetailExpItem'             , domType: 'select'  , width: 350, required: 1, browse: 'find', dispField: { apiKey: 'ExpItemId__r.Name' } },
				{ label: '経路'          , msgId: 'route_head'       , apiKey: '_route'                        , domId: 'DlgDetail_Route'              , domType: 'route'   , width: 350, required: 1               },
				{ label: '単価'          , msgId: 'tm20004720'       , apiKey: 'UnitPrice__c'                  , domId: 'DlgDetailUnitPrice'           , domType: 'currency', width: 120, maxLen:17, required: 1    },
				{ label: '数量'          , msgId: 'tm20004730'       , apiKey: 'Quantity__c'                   , domId: 'DlgDetailQuantity'            , domType: 'number'  , width:  80, maxLen:13, required: 1, suffix: { apiKey: 'ExpItemId__r.UnitName__c' } },
				{ label: '金額'          , msgId: 'expCost_head'     , apiKey: 'Cost__c'                       , domId: 'DlgDetailCost'                , domType: 'currency', width: 120, maxLen:17, required: 1    },
				{ label: '消費税'        , msgId: 'tax_label'        , apiKey: '_tax'                          , domId: 'DlgDetail_Tax'                , domType: 'tax'     , width: 350, required: 1               },
				{ label: '外貨'          , msgId: 'tf10001140'       , apiKey: '_foreign'                      , domId: 'DlgDetail_Foreign'            , domType: 'foreign' , width: 350, required: 1               },
				{ label: '発行者（店名）'  , msgId: 'expPublisher_head', apiKey: 'Publisher__c'                  , domId: 'DlgDetailPublisher'           , domType: 'text'    , width: 370, maxLen:255, required: 1},
				{ label: 'ジョブ'        , msgId: 'job_label'        , apiKey: 'JobId__c'                      , domId: 'DlgDetailJob'                 , domType: 'select'  , width: 350, required: 1, browse: 'find', dispField: { apiKey: 'JobId__r.Name', codeKey: 'JobId__r.JobCode__c' } },
				{ label: '支払種別'      , msgId: 'tf10001150'       , apiKey: '_payment'                      , domId: 'DlgDetail_Payment'            , domType: 'payment' , width: 200, required: 1                  },
				{ label: '支払先名'      , msgId: 'tf10001160'       , apiKey: 'PayeeId__r.Name'               , domId: 'DlgDetailPayeeName'           , domType: 'text'    , width: 350, maxLen:80 , browse: 'find', selectIn: 1, required: 1 },
				{ label: '支払日'        , msgId: 'tf10000590'       , apiKey: 'PaymentDate__c'                , domId: 'DlgDetailPaymentDate'         , domType: 'date'    , width: 108, maxLen:12 , name: 'dlgDetailPaymentDate', browse: 'cal'  },
				{ label: '請求書URL'     , msgId: 'ex00001241'       , apiKey: 'InvoiceURL__c'                 , domId: 'DlgDetailInvoiceURL'          , domType: 'text'    , width: 370, maxLen:2000               }, 
				{ label: '負担部署'      , msgId: 'tf10006000'       , apiKey: 'ChargeDeptId__c'               , domId: 'DlgDetailChargeDept'          , domType: 'select'  , width: 350, required: 1, browse: 'find', dispField: { apiKey: 'ChargeDeptId__r.Name', codeKey: 'ChargeDeptId__r.DeptCode__c' } },
				{ label: '社内参加者人数', msgId: 'tf10000860'       , apiKey: 'InternalParticipantsNumber__c' , domId: 'DlgDetailIntParticNumber'     , domType: 'number'    , width:  80, maxLen:3,  required: 1    },
				{ label: '社内参加者'    , msgId: 'tm20004741'       , apiKey: 'InternalParticipants__c'       , domId: 'DlgDetailIntPartic'           , domType: 'textarea', width: 370, maxLen:1000               },
				{ label: '社外参加者人数', msgId: 'tf10000870'       , apiKey: 'ExternalParticipantsNumber__c' , domId: 'DlgDetailExtParticNumber'     , domType: 'number'    , width:  80, maxLen:3,  required: 1    },
				{ label: '社外参加者'    , msgId: 'tm20004742'       , apiKey: 'ExternalParticipants__c'       , domId: 'DlgDetailExtPartic'           , domType: 'textarea', width: 370, maxLen:1000               },
				{ label: '店舗名'        , msgId: 'tf10011010'       , apiKey: 'PlaceName__c'                  , domId: 'DlgDetailPlaceName'           , domType: 'text'    , width: 370, maxLen:80                 },
				{ label: '店舗所在地'    , msgId: 'tf10011020'       , apiKey: 'PlaceAddress__c'               , domId: 'DlgDetailPlaceAddress'        , domType: 'textarea', width: 370, maxLen:255                },
				{ label: '人数割（税抜）' , msgId: 'tf10011020'       , apiKey: 'AmountPerParticipant__c'        , domId: 'DlgDetailAmountPerParticipant' , domType: 'currency', hidden: true },
				{ label: '拡張項目1'     , msgId: 'tk10000715'       , apiKey: 'ExtraItem1__c'                 , domId: 'DlgDetailExtraItem1'          , domType: 'text'    , width: 350, maxLen:255                },
				{ label: '拡張項目2'     , msgId: 'tk10000721'       , apiKey: 'ExtraItem2__c'                 , domId: 'DlgDetailExtraItem2'          , domType: 'text'    , width: 350, maxLen:255                },
				{ label: '備考'          , msgId: 'expNote_head'     , apiKey: 'Detail__c'                     , domId: 'DlgDetailDetail'              , domType: 'textarea', width: 370, maxLen:255                }
			]
		},
		// カード明細読み込み実行画面
		dialogExpImport : {
			fields : [
				{ label: '社員ID'                                    , apiKey: 'EmpId__c'               , domId: 'DlgExpImportEmpId'            , domType: 'text'    , hidden: true, fix: 'EmpId__c' },
				{ label: 'ジョブコード'                              , apiKey: 'JobId__r.JobCode__c'    , domId: 'DlgExpImportJobCode'          , domType: 'text'    , hidden: true },
				{ label: '有効開始日'                                , apiKey: 'JobId__r.StartDate__c'  , domId: 'DlgExpImportJobStartDate'     , domType: 'date'    , hidden: true },
				{ label: '有効終了日'                                , apiKey: 'JobId__r.EndDate__c'    , domId: 'DlgExpImportJobEndDate'       , domType: 'date'    , hidden: true },
				{ label: 'ジョブ有効'                                , apiKey: 'JobId__r.Active__c'     , domId: 'DlgExpImportJobActive'        , domType: 'checkbox', hidden: true },
				{ label: '負担部署コード'                            , apiKey: 'ChargeDeptId__r.DeptCode__c', domId: 'DlgExpImportChargeDeptCode', domType: 'text'   , hidden: true },
				{ label: '負担部署名'                                , apiKey: 'ChargeDeptId__r.Name'   , domId: 'DlgExpImportChargeDeptName'   , domType: 'text'    , hidden: true },
				{ label: '費目'          , msgId: 'expItem_head'     , apiKey: 'ExpItemId__c'           , domId: 'DlgExpImportItem'             , domType: 'select'  , width: 350 , browse: 'find', dispField: { apiKey: 'ExpItemId__r.Name' }, required: 1 },
				{ label: 'ジョブ'        , msgId: 'job_label'        , apiKey: 'JobId__c'               , domId: 'DlgExpImportJob'              , domType: 'select'  , width: 350, required: 1, browse: 'find', dispField: { apiKey: 'JobId__r.Name', codeKey: 'JobId__r.JobCode__c' } },
				{ label: '負担部署'      , msgId: 'tf10006000'       , apiKey: 'ChargeDeptId__c'        , domId: 'DlgExpImportChargeDept'       , domType: 'select'  , width: 350, required: 1, browse: 'find', dispField: { apiKey: 'ChargeDeptId__r.Name', codeKey: 'ChargeDeptId__r.DeptCode__c' } },
				{ label: '社内参加者人数', msgId: 'tf10000860'       , apiKey: 'InternalParticipantsNumber__c' , domId: 'DlgDetailIntParticNumber'     , domType: 'number'    , width:  80, maxLen:3,  required: 1    },
				{ label: '社内参加者'    , msgId: 'tm20004741'       , apiKey: 'InternalParticipants__c'       , domId: 'DlgDetailIntPartic'           , domType: 'textarea', width: 370, maxLen:1000               },
				{ label: '社外参加者人数', msgId: 'tf10000870'       , apiKey: 'ExternalParticipantsNumber__c' , domId: 'DlgDetailExtParticNumber'     , domType: 'number'    , width:  80, maxLen:3,  required: 1    },
				{ label: '社外参加者'    , msgId: 'tm20004742'       , apiKey: 'ExternalParticipants__c'       , domId: 'DlgDetailExtPartic'           , domType: 'textarea', width: 370, maxLen:1000               },
				{ label: '店舗名'        , msgId: 'tf10011010'       , apiKey: 'PlaceName__c'                  , domId: 'DlgDetailPlaceName'           , domType: 'text'    , width: 370, maxLen:80                 },
				{ label: '店舗所在地'    , msgId: 'tf10011020'       , apiKey: 'PlaceAddress__c'               , domId: 'DlgDetailPlaceAddress'        , domType: 'textarea', width: 370, maxLen:255                },
				{ label: '拡張項目1'     , msgId: 'tk10000715'       , apiKey: 'ExtraItem1__c'          , domId: 'DlgExpImportExtraItem1'       , domType: 'text'    , width: 350, maxLen:255                   },
				{ label: '拡張項目2'     , msgId: 'tk10000721'       , apiKey: 'ExtraItem2__c'          , domId: 'DlgExpImportExtraItem2'       , domType: 'text'    , width: 350, maxLen:255                   },
				{ label: '備考'          , msgId: 'expNote_head'     , apiKey: 'Detail__c'              , domId: 'DlgExpImportDetail'           , domType: 'textarea', width: 370, maxLen:255                   },
			]
		},
		// 出張手配実績読み込み実行画面
		dialogJsNaviImport : {
			fields : [
				{ label: '社員ID'                                    , apiKey: 'EmpId__c'               , domId: 'DlgJsNaviImportEmpId'            , domType: 'text'    , hidden: true, fix: 'EmpId__c' },
				{ label: 'ジョブコード'                              , apiKey: 'JobId__r.JobCode__c'    , domId: 'DlgJsNaviImportJobCode'          , domType: 'text'    , hidden: true },
				{ label: '有効開始日'                                , apiKey: 'JobId__r.StartDate__c'  , domId: 'DlgJsNaviImportJobStartDate'     , domType: 'date'    , hidden: true },
				{ label: '有効終了日'                                , apiKey: 'JobId__r.EndDate__c'    , domId: 'DlgJsNaviImportJobEndDate'       , domType: 'date'    , hidden: true },
				{ label: 'ジョブ有効'                                , apiKey: 'JobId__r.Active__c'     , domId: 'DlgJsNaviImportJobActive'        , domType: 'checkbox', hidden: true },
				{ label: '負担部署コード'                            , apiKey: 'ChargeDeptId__r.DeptCode__c', domId: 'DlgJsNaviImportChargeDeptCode', domType: 'text'   , hidden: true },
				{ label: '負担部署名'                                , apiKey: 'ChargeDeptId__r.Name'   , domId: 'DlgJsNaviImportChargeDeptName'   , domType: 'text'    , hidden: true },
				{ label: '費目'          , msgId: 'expItem_head'     , apiKey: 'ExpItemId__c'           , domId: 'DlgJsNaviImportItem'             , domType: 'select'  , width: 350 , browse: 'find', dispField: { apiKey: 'ExpItemId__r.Name' }, required: 1 },
				{ label: 'ジョブ'        , msgId: 'job_label'        , apiKey: 'JobId__c'               , domId: 'DlgJsNaviImportJob'              , domType: 'select'  , width: 350, required: 1, browse: 'find', dispField: { apiKey: 'JobId__r.Name', codeKey: 'JobId__r.JobCode__c' } },
				{ label: '負担部署'      , msgId: 'tf10006000'       , apiKey: 'ChargeDeptId__c'        , domId: 'DlgJsNaviImportChargeDept'       , domType: 'select'  , width: 350, required: 1, browse: 'find', dispField: { apiKey: 'ChargeDeptId__r.Name', codeKey: 'ChargeDeptId__r.DeptCode__c' } },
				{ label: '拡張項目1'     , msgId: 'tk10000715'       , apiKey: 'ExtraItem1__c'          , domId: 'DlgJsNaviImportExtraItem1'       , domType: 'text'    , width: 350, maxLen:255                   },
				{ label: '拡張項目2'     , msgId: 'tk10000721'       , apiKey: 'ExtraItem2__c'          , domId: 'DlgJsNaviImportExtraItem2'       , domType: 'text'    , width: 350, maxLen:255                   },
				{ label: '備考'          , msgId: 'expNote_head'     , apiKey: 'Detail__c'              , domId: 'DlgJsNaviImportDetail'           , domType: 'textarea', width: 370, maxLen:255                   }
			]
		},
		// 駅探設定
		dialogEkitanSetting : {
			fields : [
				{ label: '社員ID'                                              , apiKey: 'EmpId__c'               , domId: 'DlgExpImportEmpId'            , domType: 'text'    , hidden: true, fix: 'EmpId__c' },
				{ label: '登録定期区間コード'                                  , apiKey: 'commuterRouteCode'      , domId: 'DlgEkitanRouteCode'           , domType: 'text'    , hidden: true },
				{ label: '経由駅で乗り換え'                                    , apiKey: 'commuterRouteTransfer'  , domId: 'DlgEkitanRouteTransfer'       , domType: 'checkbox', hidden: true },
				{ label: '地域'              , msgId: 'area_label'             , apiKey: 'ekitanArea'             , domId: 'DlgEkitanArea'                , domType: 'select'  , width:'auto', pickList:[{v:'-1',msgId:'tm20007010'},{v:'0',msgId:'tm20007020'},{v:'1',msgId:'tm20007030'},{v:'2',msgId:'tm20007040'},{v:'3',msgId:'tm20007050'},{v:'4',msgId:'tm20007060'},{v:'5',msgId:'tm20007070'},{v:'6',msgId:'tm20007080'},{v:'7',msgId:'tm20007090'},{v:'8',msgId:'tm20007100'},{v:'9',msgId:'tm20007110'}] }, // 全国,首都圏,関西,東海,北海道,東北,北陸,甲信越,中国,四国,九州
				{ label: '特急/新幹線'       , msgId: 'paidExpress_label'      , apiKey: 'usePaidExpress'         , domId: 'DlgEkitanExpress'             , domType: 'radio'   , name: 'usePaidExpress'  , pickList:[{v:'1',msgId:'tk10000404'},{v:'0',msgId:'tk10000405'}] }, // 使う,使わない
				{ label: '特急料金'          , msgId: 'reservedSheet_label'    , apiKey: 'useReservedSheet'       , domId: 'DlgEkitanSheet'               , domType: 'radio'   , name: 'useReservedSheet', pickList:[{v:'0',msgId:'tk10000406'},{v:'1',msgId:'tk10000407'}] }, // 自由席,指定席
				{ label: '優先する航空会社'  , msgId: 'preferredAirLine_label' , apiKey: 'preferredAirLine'       , domId: 'DlgEkitanAirLine'             , domType: 'radio'   , name: 'preferredAirLine', pickList:[{v:'0',msgId:'tm10010150'},{v:'1',msgId:'tf10000240'},{v:'2',msgId:'tf10000241'},{v:'4',msgId:'tf10000242'}] }, // なし,JAL,ANA,JALとANA以外
				{ label: '検索結果のソート'  , msgId: 'routePreference_label'  , apiKey: 'routePreference'        , domId: 'DlgEkitanPreference'          , domType: 'select'  , width:'auto', pickList:[{v:'0',msgId:'routeSortTime_label'},{v:'1',msgId:'routeSortCost_label'},{v:'2',msgId:'routeSortChange_label'},{v:'3',msgId:'routeSortCommuter_label'}] }, // 時間優先,料金優先,乗換回数優先,定期料金優先
				{ label: '定期区間の取扱'    , msgId: 'excludeCommuter_label'  , apiKey: 'excludeCommuterRoute'   , domId: 'DlgEkitanExclude'             , domType: 'radio'   , name: 'excludeCommuterRoute', pickList:[{v:'0',msgId:'tk10000408'},{v:'1',msgId:'tk10000409'}] }, // 考慮しない,除いた交通費を計算
				{ label: '登録定期区間'      , msgId: 'commuterRoute_label'    , apiKey: 'commuterRouteNote'      , domId: 'DlgEkitanRouteNote'           , domType: 'text'    , width:200, ro: true },
				{ label: '経路'              , msgId: 'route_head'             , apiKey: 'commuterRouteRoute'     , domId: 'DlgEkitanRouteRoute'          , domType: 'text'    , width:400, ro: true }
			]
		},
		// 精算実行オプション
		payOption : {
			fields : [
				{ label: '精算方法'          , msgId: 'tk10000781'       , apiKey: 'expItemId'          , domId: 'PayOptionExpItem'             , domType: 'select'  , width: 300, required: 1, dispField: { apiKey: 'ExpItemId__r.Name' } },
				{ label: '精算日'            , msgId: 'payDate_label'    , apiKey: 'payDate'            , domId: 'PayOptionPayDate'             , domType: 'date'    , width: 108, required: 1, maxLen:12, name: 'payDate', browse: 'cal'  },
				{ label: '備考(精算時)'      , msgId: 'tf10000720'       , apiKey: 'payMethod'          , domId: 'PayOptionPayMethod'           , domType: 'textarea', width: 300, maxLen:80   },
				{ label: '全銀データ出力'    , msgId: 'tk10000779'       , apiKey: 'zgDataCheck'        , domId: 'PayOptionZgDataCheck'         , domType: 'checkbox', width:  32              },
				{ label: '振込元'            , msgId: 'tk10000786'       , apiKey: 'sourceAccountId'    , domId: 'PayOptionZgAccount'           , domType: 'select'  , width: 300, required: 1, dispField: { apiKey: 'Name' } },
				{ label: '仕訳データCSV出力' , msgId: 'tf10010810'       , apiKey: 'outputJournal'      , domId: 'PayOptionOutputJournal'       , domType: 'checkbox', width:  32              }
			]
		},
		// カード明細
		cardStatement  : {
			discernment : 'cardStatement',
			objectName  : 'AtkCardStatementLine__c',
			type        : 'table',
			title       : 'tf10001500',                 // カード明細読込
			formCss     : 'ts-dialog-card-state',
			rowLimit    : 50,
			fields      : [
				{ label: 'ID'                                       , apiKey: 'Id'                     , domId: 'CardState{0}Id'          , domType: 'text'    , hidden: true },
				{ label: '名称'                                     , apiKey: 'Name'                   , domId: 'CardState{0}Name'        , domType: 'text'    , hidden: true },
				{ label: 'レコードタイプ名'                         , apiKey: 'RecordType.Name'        , domId: 'CardState{0}RecordType'  , domType: 'text'    , hidden: true },
				{ label: '支払種別'                                 , apiKey: 'PayeeId__r.PayeeType__c', domId: 'CardState{0}PayeeType'   , domType: 'text'    , hidden: true },
				{ label: '精算区分'                                 , apiKey: 'PayeeId__r.ExpenseType__c',domId:'CardState{0}ExpenseType' , domType: 'text'    , hidden: true },
				{ check: true                                                                          , domId: 'CardState{0}_Check'      , domType: 'checkbox', width: 24    },
				{ label: '利用日付'     , msgId: 'tf10000670'       , apiKey: 'Date__c'                , domId: 'CardState{0}Date'        , domType: 'date'    , width:  90 , sortable:true },
				{ label: '摘要'         , msgId: 'tk10000097'       , apiKey: 'Note__c'                , domId: 'CardState{0}Note'        , domType: 'text'    , width: 120 , sortable:true },
				{ label: '金額'         , msgId: 'expCost_head'     , apiKey: 'Amount__c'              , domId: 'CardState{0}Amount'      , domType: 'currency', width:  90 , sortable:true },
				{ label: '発行者（店名）', msgId: 'expPublisher_head', apiKey: 'Publisher__c'           , domId: 'CardState{0}Publisher'   , domType: 'text'    , width: 120 , sortable:true },
				{ label: '支払先名'     , msgId: 'tf10001160'       , apiKey: 'PayeeId__r.Name'        , domId: 'CardState{0}PayeeName'   , domType: 'text'    , width: 100 , sortable:true },
				{ label: '支払日'       , msgId: 'tf10000590'       , apiKey: 'PaymentDate__c'         , domId: 'CardState{0}PaymentDate' , domType: 'date'    , width:  90 , sortable:true },
				{ label: '通貨名'       , msgId: 'currency_label'   , apiKey: 'FCName__c'              , domId: 'CardState{0}FCName'      , domType: 'text'    , width:  60 , sortable:true },
				{ label: '外貨金額'     , msgId: 'tf10001170'       , apiKey: 'FCAmount__c'            , domId: 'CardState{0}FCAmount'    , domType: 'currency', width: 120 , decimal: '6,2', sortable:true },
				{ label: 'レート'       , msgId: 'tf10001180'       , apiKey: 'FCRate__c'              , domId: 'CardState{0}FCRate'      , domType: 'currency', width: 100 , decimal: '6,2', sortable:true },
				{ label: 'レート適用日' , msgId: 'tf10001190'       , apiKey: 'FCDate__c'              , domId: 'CardState{0}FCDate'      , domType: 'date'    , width:  90 , sortable:true },
				{ label: '処理日付'     , msgId: 'tf10001200'       , apiKey: 'ProcessDate__c'         , domId: 'CardState{0}ProcessDate' , domType: 'date'    , width:  90 , sortable:true }
			],
			searchFields : [
				{ label: '支払日', msgId: 'tf10000590', apiKey: 'PaymentDate__c' , domId: 'CardStateDate', domType: 'dateFrom' , width: 108, name: 'paymentDate', lw: 'auto', wr: true }
			],
			filts       : [
				{ filtVal: "EmpId__c = '{0}'"                       , filtKey: 'empId'     , fix: true },
				{ filtVal: "RecordType.Name in ('カード明細', null)", filtKey: 'recordType', fix: true },
				{ filtVal: "Removed__c = false"                     , filtKey: 'removed'   , fix: true }
			],
			sortKeys : [
				{ apiKey: 'Date__c'         , desc: true },
				{ apiKey: 'PaymentDate__c'  , desc: true },
				{ apiKey: 'Id'              , desc: true }
			],
			children : {
				EmpExp__r : {
					fields: [
						{ apiKey: 'Id'        }
					]
				}
			},
			buttons : [
				{ key:'expImport' , labelId:'tf10002260'       }, // 読み込み
				{ key:'close'     , labelId:'cancel_btn_title' }  // キャンセル
			]
		},
		// 領収書入力
		receipts  : {
			discernment : 'receipts',
			objectName  : 'AtkCardStatementLine__c',
			type        : 'table',
			title       : 'tf10004950',                 // 領収書読込
			formCss     : 'ts-dialog-receipts',
			rowLimit    : 50,
			fields      : [
				{ label: 'ID'                                       , apiKey: 'Id'                     , domId: 'Receipt{0}Id'           , domType: 'text'    , hidden: true },
				{ label: '名称'                                     , apiKey: 'Name'                   , domId: 'Receipt{0}Name'         , domType: 'text'    , hidden: true },
				{ label: 'レコードタイプ名'                         , apiKey: 'RecordType.Name'        , domId: 'Receipt{0}RecordType'   , domType: 'text'    , hidden: true },
				{ label: 'リクエストID'                             , apiKey: 'ForeignId__c'           , domId: 'Receipt{0}ForeignId'    , domType: 'text'    , hidden: true },
				{ label: 'ステータス'                               , apiKey: 'Status__c'              , domId: 'Receipt{0}Status'       , domType: 'text'    , hidden: true },
				{ label: '削除フラグ'                               , apiKey: 'Removed__c'             , domId: 'Receipt{0}Removed'      , domType: 'checkbox', hidden: true },
				{ check: true                                                                          , domId: 'Receipt{0}_Check'       , domType: 'checkbox', width: 24    },
				{ label: '利用日付'      , msgId: 'tf10000670'      , apiKey: 'Date__c'                , domId: 'Receipt{0}Date'         , domType: 'date'    , width:  90 , sortable:true },
				{ label: '発行者（店名）', msgId: 'tf10004960'      , apiKey: 'Publisher__c'           , domId: 'Receipt{0}Publisher'    , domType: 'text'    , width: 180 , sortable:true },
				{ label: '摘要'          , msgId: 'tk10000097'      , apiKey: 'Note__c'                , domId: 'Receipt{0}Note'         , domType: 'text'    , width: 160 , sortable:true },
				{ label: '金額'          , msgId: 'expCost_head'    , apiKey: 'Amount__c'              , domId: 'Receipt{0}Amount'       , domType: 'currency', width:  90 , sortable:true },
				{ label: '添付'          , msgId: 'tf10005020'      , apiKey: 'Attachments'            , domId: 'Receipt{0}Attachments'  , domType: 'children', width: 50 },
				{ label: '連絡欄'        , msgId: 'tf10004970'      , apiKey: 'Message__c'             , domId: 'Receipt{0}Message'      , domType: 'text'    , width: 180 , sortable:true, headCss: 'head-caution' },
				{ label: '領収書画像の縦幅', apiKey: 'ImageHeight__c', domId: 'Receipt{0}ImageHeight', domType: 'text', hidden: true },
				{ label: '領収書画像の横幅', apiKey: 'ImageWidth__c', domId: 'Receipt{0}ImageWidth', domType: 'text', hidden: true },
				{ label: '領収書画像の階調', apiKey: 'BitsPerSample__c', domId: 'Receipt{0}BitsPerSample', domType: 'text', hidden: true },
				{ label: '領収書画像の色情報', apiKey: 'ColorType__c', domId: 'Receipt{0}ColorType', domType: 'text', hidden: true }
			],
			searchFields : [
				{ label: 'ステータス', msgId: 'status_btn_title', apiKey: 'Status__c', domId: 'ReceiptStatus', domType: 'select'   , width:'auto', lw: 'auto', wr: true, noNL: true, pickList: [{v:'2',msgId:'tf10004990'/*完了*/},{v:'0',msgId:'tf10005000'/*処理中*/},{v:'9',msgId:'tf10005010'/*エラー*/}] }
			],
			filts       : [
				{ filtVal: "EmpId__c = '{0}'"            , filtKey: 'empId'     , fix: true },
				{ filtVal: "RecordType.Name = '領収書'"  , filtKey: 'recordType', fix: true },
				{ filtVal: "Removed__c = false"          , filtKey: 'removed'   , fix: true }
			],
			sortKeys : [
				{ apiKey: 'Date__c'  , desc: true },
				{ apiKey: 'Id'       , desc: true }
			],
			children : {
				EmpExp__r : {
					fields: [
						{ apiKey: 'Id'        }
					]
				},
				Attachments : {
					fields: [
						{ apiKey: 'Id'        }
					]
				}
			}
		},
		// J'sNAVI実績読込
		actualExpense  : {
			discernment : 'actualExpense',
			objectName  : 'AtkJsNaviActual__c',
			type        : 'table',
			title       : 'jt13000010',		// 出張手配実績読込
			formCss     : 'ts-dialog-jtb',
			rowLimit    : 100,
			fields      : [
				{ label: 'ID'                                       , apiKey: 'Id'                 , domId: 'Jtb{0}Id'           , domType: 'text'    , hidden: true },
				{ label: '名称'                                     , apiKey: 'Name'               , domId: 'Jtb{0}Name'         , domType: 'text'    , hidden: true },
				{ label: '支払先ID'                                 , apiKey: 'PayeeId__c'              , domId: 'Jtb{0}PayeeId'             , domType: 'text'    , hidden: true },
				{ label: '支払種別'                                 , apiKey: 'PayeeId__r.PayeeType__c' , domId: 'Jtb{0}PayeeType'               , domType: 'text'    , hidden: true },
				{ label: '支払先名'                                 , apiKey: 'PayeeId__r.Name'         , domId: 'Jtb{0}PayeeName'               , domType: 'text'    , hidden: true },
				{ label: '支払先精算区分'                           , apiKey: 'PayeeId__r.ExpenseType__c' , domId: 'Jtb{0}PayeeExpenseType'      , domType: 'text'    , hidden: true },
				{ label: 'ユーザーID'                               , apiKey: 'JsNaviId__c'          , domId: 'Jtb{0}UserId'    , domType: 'text'    , hidden: true },
				{ label: '処理番号'                                 , apiKey: 'OperationNo__c'     , domId: 'Jtb{0}OperationNo'    , domType: 'text'    , hidden: true },
				{ label: '副番号'                                   , apiKey: 'SubNo__c'           , domId: 'Jtb{0}SubNo'       , domType: 'text'    , hidden: true },
				{ label: '出張手配SeqNo'                            , apiKey: 'SeqNo__c'           , domId: 'Jtb{0}SeqNo'       , domType: 'text'    , hidden: true },
				{ label: '旅行番号'                                 , apiKey: 'TravelNo__c'        , domId: 'Jtb{0}TravelNo'    , domType: 'text'    , hidden: true },
				{ label: '枝番'                                     , apiKey: 'BranchNo__c'        , domId: 'Jtb{0}BranchNo'    , domType: 'text'    , hidden: true },
				{ label: '発注機能コード'                           , apiKey: 'FunctionCode__c'    , domId: 'Jtb{0}FunctionCode' , domType: 'text'   , hidden: true },
				{ label: 'システム区分'                             , apiKey: 'SystemType__c'      , domId: 'Jtb{0}SystemType'  , domType: 'text'    , hidden: true },
				{ label: 'サービス名称'                             , apiKey: 'Data01__c'        , domId: 'Jtb{0}ServiceName'     , domType: 'text'    , hidden: true },
				{ label: '出発地'                                   , apiKey: 'Data03__c'      , domId: 'Jtb{0}StartName'   , domType: 'text'    , hidden: true },
				{ label: '到着地'                                   , apiKey: 'Data04__c'        , domId: 'Jtb{0}EndName'     , domType: 'text'    , hidden: true },
				{ label: 'ステータス'                                  , apiKey: 'Data11__c'        , domId: 'Jtb{0}Status'      , domType: 'text'    , hidden: true },
				{ label: '削除フラグ'                               , apiKey: 'Removed__c'         , domId: 'Jtb{0}Removed'      , domType: 'checkbox', hidden: true },
				{ check: true                                                                     , domId: 'Jtb{0}_Check'       , domType: 'checkbox', width: 24    },
				{ label: '出発日'         , msgId: 'jt13000150'       , apiKey: 'StartDate__c'        , domId: 'Jtb{0}Date'          , domType: 'date'    , width:  90 , sortable:true },
				{ label: '内容'         , msgId: 'tf10000850'      , apiKey: 'PayContent__c'      , domId: 'Jtb{0}Content'       , domType: 'text'    , width: 300},
				{ label: '金額'         , msgId: 'expCost_head'    , apiKey: 'Amount__c'         , domId: 'Jtb{0}Amount'        , domType: 'currency', width:  90 , sortable:true }
			],
			searchFields : [
				{ label: '出発日', msgId: 'jt13000150', apiKey: 'StartDate__c' , domId: 'startDate', domType: 'dateFrom' , width: 108, name: 'startDate', lw: 'auto', wr: true, noNL: true }
			],
			filts       : [
				{ filtVal: "EmpId__c = '{0}'"			, filtKey: 'empId'     , fix: true },
				{ filtVal: "ExpPreApplyId__c = null"	, filtKey: 'expPreApplyId' , fix: true },
				{ filtVal: "Removed__c = false"			, filtKey: 'removed'   , fix: true }
			],
			sortKeys : [
				{ apiKey: 'StartDate__c'  , desc: true },
				{ apiKey: 'Id'       , desc: true }
			],

			children : {
			},
			buttons : [
					{ key:'expImport' , labelId:'tf10002260'       }, // 読み込み
					{ key:'close'     , labelId:'cancel_btn_title' }  // キャンセル
			]

		},
		// 経費履歴
		expHistory  : {
			discernment : 'expHistory',
			objectName  : 'AtkEmpExp__c',
			type        : 'table',
			title       : 'tf10003570',             // 履歴から入力
			selType     : 'radio',
			formCss     : 'ts-dialog-exp-history',
			rowLimit    : 20,
			rowDisp     : 12,
			fields      : [
				{ label: 'ID'                                        , apiKey: 'Id'                            , domId: 'HistExp{0}Id'                  , domType: 'text'    , hidden: true },
				{ label: '社員ID'                                    , apiKey: 'EmpId__c'                      , domId: 'HistExp{0}EmpId'               , domType: 'text'    , hidden: true, fix: 'EmpId__c' },
				{ label: '名称'                                      , apiKey: 'Name'                          , domId: 'HistExp{0}Name'                , domType: 'text'    , hidden: true },
				{ label: '経費申請ID'                                , apiKey: 'ExpApplyId__c'                 , domId: 'HistExp{0}ExpApplyId'          , domType: 'text'    , hidden: true },
				{ label: '経費事前申請ID'                            , apiKey: 'ExpApplyId__r.ExpPreApplyId__c', domId: 'HistExp{0}ExpPreApplyId'       , domType: 'text'    , hidden: true },
				{ label: 'カード明細ID'                              , apiKey: 'CardStatementLineId__c'        , domId: 'HistExp{0}CardStatementLineId' , domType: 'text'    , hidden: true },
				{ label: '交通費種別'                                , apiKey: 'TransportType__c'              , domId: 'HistExp{0}TransportType'       , domType: 'text'    , hidden: true },
				{ label: '発駅コード'                                , apiKey: 'startCode__c'                  , domId: 'HistExp{0}startCode'           , domType: 'text'    , hidden: true },
				{ label: '着駅コード'                                , apiKey: 'endCode__c'                    , domId: 'HistExp{0}endCode'             , domType: 'text'    , hidden: true },
				{ label: '往復フラグ'                                , apiKey: 'roundTrip__c'                  , domId: 'HistExp{0}roundTrip'           , domType: 'checkbox', hidden: true },
				{ label: '経路'                                      , apiKey: 'Route__c'                      , domId: 'HistExp{0}Route'               , domType: 'text'    , hidden: true },
				{ label: '通貨名'                                    , apiKey: 'CurrencyName__c'               , domId: 'HistExp{0}CurrencyName'        , domType: 'text'    , hidden: true },
				{ label: '換算レート'                                , apiKey: 'CurrencyRate__c'               , domId: 'HistExp{0}CurrencyRate'        , domType: 'currency', hidden: true, decimal: '6,2' },
				{ label: '現地金額'                                  , apiKey: 'ForeignAmount__c'              , domId: 'HistExp{0}ForeignAmount'       , domType: 'currency', hidden: true, decimal: '6,2' },
				{ label: '領収書あり'                                , apiKey: 'Receipt__c'                    , domId: 'HistExp{0}Receipt'             , domType: 'checkbox', hidden: true },
				{ label: '消費税自動計算'                            , apiKey: 'TaxAuto__c'                    , domId: 'HistExp{0}TaxAuto'             , domType: 'checkbox', hidden: true },
				{ label: '消費税率'                                  , apiKey: 'TaxRate__c'                    , domId: 'HistExp{0}TaxRate'             , domType: 'number'  , hidden: true },
				{ label: '消費税タイプ'                              , apiKey: 'TaxType__c'                    , domId: 'HistExp{0}TaxType'             , domType: 'text'    , hidden: true },
				{ label: '消費税額'                                  , apiKey: 'Tax__c'                        , domId: 'HistExp{0}Tax'                 , domType: 'currency', hidden: true },
				{ label: '税抜金額'                                  , apiKey: 'WithoutTax__c'                 , domId: 'HistExp{0}WithoutTax'          , domType: 'currency', hidden: true },
				{ label: '拡張項目1'                                 , apiKey: 'ExtraItem1__c'                 , domId: 'HistExp{0}ExtraItem1'          , domType: 'text'    , hidden: true },
				{ label: '拡張項目2'                                 , apiKey: 'ExtraItem2__c'                 , domId: 'HistExp{0}ExtraItem2'          , domType: 'text'    , hidden: true },
				{ label: '外部入力元'                                , apiKey: 'Item__c'                       , domId: 'HistExp{0}Item'                , domType: 'text'    , hidden: true },
				{ label: 'ジョブ'                                    , apiKey: 'JobId__c'                      , domId: 'HistExp{0}JobId'               , domType: 'text'    , hidden: true },
				{ label: '支払先ID'                                  , apiKey: 'PayeeId__c'                    , domId: 'HistExp{0}PayeeId'             , domType: 'text'    , hidden: true },
				{ label: '支払先名'                                  , apiKey: 'PayeeId__r.Name'               , domId: 'HistExp{0}PayeeName'           , domType: 'text'    , hidden: true },
				{ label: '支払日'                                    , apiKey: 'PaymentDate__c'                , domId: 'HistExp{0}PaymentDate'         , domType: 'date'    , hidden: true },
				{ label: '支払種別'                                  , apiKey: 'PayeeId__r.PayeeType__c'       , domId: 'HistExp{0}PayeeType'           , domType: 'text'    , hidden: true },
				{ label: '支払先精算区分'                            , apiKey: 'PayeeId__r.ExpenseType__c'     , domId: 'HistExp{0}PayeeExpenseType'    , domType: 'text'    , hidden: true },
				{ label: '数量'                                      , apiKey: 'Quantity__c'                   , domId: 'HistExp{0}Quantity'            , domType: 'number'  , hidden: true },
				{ label: '単価'                                      , apiKey: 'UnitPrice__c'                  , domId: 'HistExp{0}UnitPrice'           , domType: 'currency', hidden: true },
				{ label: 'ジョブコード'                              , apiKey: 'JobId__r.JobCode__c'           , domId: 'HistExp{0}JobCode'             , domType: 'text'    , hidden: true },
				{ label: '有効開始日'                                , apiKey: 'JobId__r.StartDate__c'         , domId: 'HistExp{0}JobStartDate'        , domType: 'date'    , hidden: true },
				{ label: '有効終了日'                                , apiKey: 'JobId__r.EndDate__c'           , domId: 'HistExp{0}JobEndDate'          , domType: 'date'    , hidden: true },
				{ label: 'ジョブ有効'                                , apiKey: 'JobId__r.Active__c'            , domId: 'HistExp{0}JobActive'           , domType: 'checkbox', hidden: true },
				{ label: '並び順'                                    , apiKey: 'Order__c'                      , domId: 'HistExp{0}Order'               , domType: 'number'  , hidden: true },
				{ label: '数量単位'                                  , apiKey: 'ExpItemId__r.UnitName__c'      , domId: 'HistExp{0}UnitName'            , domType: 'text'    , hidden: true },
				{ label: '支払い済み'                                , apiKey: 'IsPaid__c'                     , domId: 'HistExp{0}IsPaid'              , domType: 'checkbox', hidden: true },
				{ label: '削除フラグ'                                , apiKey: '_removed'                      , domId: 'HistExp{0}_Removed'            , domType: 'checkbox', hidden: true },
				{ label: '事前申請明細ID'                            , apiKey: 'PreEmpExpId__c'                , domId: 'HistExp{0}PreEmpExpId'         , domType: 'text'    , hidden: true },
				{ label: '事前申請費目ID'                            , apiKey: 'PreExpItemId__c'               , domId: 'HistExp{0}PreExpItemId'        , domType: 'text'    , hidden: true },
				{ label: 'ジョブ'        , msgId: 'job_label'        , apiKey: 'JobId__r.Name'                 , domId: 'HistExp{0}JobName'             , domType: 'text'    , hidden: true },
				{ label: '出発'          , msgId: 'stationFrom_label', apiKey: 'startName__c'                  , domId: 'HistExp{0}startName'           , domType: 'text'    , hidden: true },
				{ label: '到着'          , msgId: 'stationTo_label'  , apiKey: 'endName__c'                    , domId: 'HistExp{0}endName'             , domType: 'text'    , hidden: true },
//                { label: '備考'          , msgId: 'expNote_head'     , apiKey: 'Detail__c'                     , domId: 'HistExp{0}Detail'              , domType: 'text'    , hidden: true },
				{ label: '負担部署'                                  , apiKey: 'ChargeDeptId__c'               , domId: 'HistExp{0}ChargeDeptId'        , domType: 'text'    , hidden: true },
				{ label: '負担部署コード'                            , apiKey: 'ChargeDeptId__r.DeptCode__c'   , domId: 'HistExp{0}ChargeDeptCode'      , domType: 'text'    , hidden: true },
				{ label: '負担部署名'                                , apiKey: 'ChargeDeptId__r.Name'          , domId: 'HistExp{0}ChargeDeptName'      , domType: 'text'    , hidden: true },
				{ check: true, domId: 'HistExp{0}Check_', domType: 'checkbox', width: 24 },
				{ label: '利用日'        , msgId: 'tf10000940'       , apiKey: 'Date__c'                       , domId: 'HistExp{0}Date'                , domType: 'date'    , width:  90 , sortable:true  },
				{ label: '費目'          , msgId: 'expItem_head'     , apiKey: 'ExpItemId__r.Name'             , domId: 'HistExp{0}ExpItem'             , domType: 'select'  , width: 130 , sortable:true  },
//                { label: '出発'          , msgId: 'stationFrom_label', apiKey: 'startName__c'                  , domId: 'HistExp{0}startName'           , domType: 'text'    , width:  72 , sortable:true  },
//                { label: '到着'          , msgId: 'stationTo_label'  , apiKey: 'endName__c'                    , domId: 'HistExp{0}endName'             , domType: 'text'    , width:  72 , sortable:true  },
				{ label: '内容'          , msgId: 'tf10000850'                                                 , domId: 'HistExp{0}Content'             , domType: 'route'   , width: 280                  },
				{ label: '金額'          , msgId: 'tf10000950'       , apiKey: 'Cost__c'                       , domId: 'HistExp{0}Cost'                , domType: 'currency', width: 110 , sortable:true  },
//                { label: 'ジョブ'        , msgId: 'job_label'        , apiKey: 'JobId__r.Name'                 , domId: 'HistExp{0}JobName'             , domType: 'text'    , width: 200 , sortable:true  },
				{ label: '備考'          , msgId: 'expNote_head'     , apiKey: 'Detail__c'                     , domId: 'HistExp{0}Detail'              , domType: 'text'    , width: 170 , sortable:true  },
				{ label: '社内参加者人数', msgId: 'tf10000860'       , apiKey: 'InternalParticipantsNumber__c' , domId: 'HistExp{0}InternalParticipantsNumber'     , domType: 'number'    , hidden: true },
				{ label: '社内参加者'    , msgId: 'tm20004741'       , apiKey: 'InternalParticipants__c'       , domId: 'HistExp{0}InternalParticipants'           , domType: 'textarea', hidden: true },
				{ label: '社外参加者人数', msgId: 'tf10000870'       , apiKey: 'ExternalParticipantsNumber__c' , domId: 'HistExp{0}ExternalParticipantsNumber'     , domType: 'number'    , hidden: true },
				{ label: '社外参加者'    , msgId: 'tm20004742'       , apiKey: 'ExternalParticipants__c'       , domId: 'HistExp{0}ExternalParticipants'           , domType: 'textarea', hidden: true },
				{ label: '店舗名'        , msgId: 'tf10011010'       , apiKey: 'PlaceName__c'                  , domId: 'HistExp{0}PlaceName'           , domType: 'text'    , hidden: true },
				{ label: '店舗所在地'    , msgId: 'tf10011020'       , apiKey: 'PlaceAddress__c'               , domId: 'HistExp{0}PlaceAddress'        , domType: 'textarea', hidden: true },
				{ label: '人数割金額'    , msgId: 'tf10000871'       , apiKey: 'AmountPerParticipant__c'        , domId: 'HistExp{0}AmountPerParticipant' , domType: 'currency', hidden: true },
				{ label: '発行者（店名）'    , msgId: 'expPublisher_head'       , apiKey: 'Publisher__c'        , domId: 'HistExp{0}Publisher' , domType: 'text', hidden: true }
			],
			searchFields : [
				{ label: '範囲'     , msgId: 'tk10001028'  , apiKey: 'ExpPreApplyId__c' , domId: 'HistExpPreApply', domType: 'select'  , width:'auto', lw: 'auto', wr: true, noNL: true, subType:'noope', pickList: [{v:'!=null',msgId:'tk10004031'/*事前申請*/},{v:'=null',msgId:'empExp_label'/*経費精算*/}] },
				{ label: '費目'     , msgId: 'expItem_head', apiKey: 'ExpItemId__c'     , domId: 'HistExpItem'    , domType: 'select'  , width:   160, lw: 'auto', wr: true, noNL: true, optall: true },
				{ label: '駅名'     , msgId: 'tf10003580'  , apiKey: '_station'         , domId: 'HistStation'    , domType: 'text'    , width:    90, lw: 'auto', wr: true, noNL: true },
				{ label: '備考'     , msgId: 'expNote_head', apiKey: 'Detail__c'        , domId: 'HistDetail'     , domType: 'text'    , width:   140, lw: 'auto', wr: true, noNL: true, matchType:3 }
			],
			filts       : [
				{ filtVal: "EmpId__c = '{0}'"       , filtKey: 'empId'     , fix: true },
				{ filtVal: "Item__c <> 'JTB'"                              , fix: true }
			],
			sortKeys : [
				{ apiKey: 'Date__c'         , desc: true },
				{ apiKey: 'Order__c'                     },
				{ apiKey: 'Id'                           }
			],
			buttons : [
				{ key:'histImport' , labelId:'tf10002260'       }, // 読み込み
				{ key:'close'      , labelId:'cancel_btn_title' }  // キャンセル
			]
		},
		// 経費連携（ピットタッチ）
		externalExpense  : {
			discernment : 'externalExpense',
			objectName  : 'ExternalICExpense__c',
			type        : 'table',
			title       : 'pit10001010', // IC交通費読込
			formCss     : 'ts-dialog-pitt-state',
			rowLimit    : 50,
			fields      : [
				{ label: 'ID'                                       , apiKey: 'Id'                     , domId: 'ExtExp{0}Id'              , domType: 'text'    , hidden: true },
				{ label: 'Name'                                     , apiKey: 'Name'                   , domId: 'ExtExp{0}Name'            , domType: 'text'    , hidden: true },
				{ label: '登録日時'                                 , apiKey: 'RegistrationDate__c'    , domId: 'ExtExp{0}RegistrationDate', domType: 'datetime', hidden: true },
				{ label: 'ステータス'                               , apiKey: 'Status__c'              , domId: 'ExtExp{0}Status'          , domType: 'text'    , hidden: true },
				{ check: true                                                                          , domId: 'ExtExp{0}_Check'          , domType: 'checkbox', width: 24    },
				{ label: '利用日'       , msgId: 'tf10000940'       , apiKey: 'UsageDate__c'           , domId: 'ExtExp{0}UsageDate'       , domType: 'date'    , width: 100 , sortable:true },
				{ label: '経費種別'     , msgId: 'pit10001020'      , apiKey: 'UsageType__c'           , domId: 'ExtExp{0}UsageType'       , domType: 'text'    , width: 130 , sortable:true },
				{ label: '利用金額'     , msgId: 'jt18000050'       , apiKey: 'Amount__c'              , domId: 'ExtExp{0}Amount'          , domType: 'currency', width:  90 , sortable:true },
				{ label: '入場駅'       , msgId: 'pit10001030'      , apiKey: 'StationNameFrom__c'     , domId: 'ExtExp{0}StationNameFrom' , domType: 'text'    , width: 140 , sortable:true },
				{ label: '出場駅'       , msgId: 'pit10001050'      , apiKey: 'StationNameTo__c'       , domId: 'ExtExp{0}StationNameTo'   , domType: 'text'    , width: 140 , sortable:true }
			],
			filts       : [
				{ filtVal: "EmpId__c = '{0}'"                       , filtKey: 'empId'     , fix: true },
				{ filtVal: "UsageType__c != '物販'"                 , filtKey: 'usageType' , fix: true },
				{ filtVal: "Status__c = '未処理'"                   , filtKey: 'status'    , fix: true }
			],
			sortKeys : [
				{ apiKey: 'UsageDate__c'         , desc: true },
				{ apiKey: 'RegistrationDate__c'  , desc: true },
				{ apiKey: 'Id'                   , desc: true }
			],
			children : {
				EmpExps__r : {
					fields: [
						{ apiKey: 'Id'        }
					]
				}
			},
			buttons : [
				{ key:'expImport' , labelId:'tf10002260'       }, // 読み込み
				{ key:'close'     , labelId:'cancel_btn_title' }  // キャンセル
			]
		},
		// ジョブリスト
		jobs  : {
			discernment : 'jobs',
			objectName  : 'AtkJob__c',
			type        : 'table',
			title       : 'searchJob_label',        // ジョブ検索
			selType     : 'radio',
			formCss     : 'ts-dialog-job',
			rowLimit    : 50,
			jobList     : true,
			fields      : [
				{ label: 'ID'                                        , apiKey: 'Id'             , domId: 'Job{0}Id'          , domType: 'text'    , hidden: true },
				{ label: 'アクティブ'                                , apiKey: 'Active__c'      , domId: 'Job{0}Active'      , domType: 'checkbox', hidden: true },
				{ check: true, domId: 'Job{0}_Check', domType: 'checkbox', width: 24 },
				{ label: '主担当部署'   , msgId: 'tk10000849'        , apiKey: 'DeptId__r.Name' , domId: 'Job{0}DeptName'    , domType: 'text'    , width: 180  , sortable:true },
				{ label: 'ジョブコード' , msgId: 'tm20001020'        , apiKey: 'JobCode__c'     , domId: 'Job{0}Code'        , domType: 'text'    , width: 130  , sortable:true },
				{ label: 'ジョブ名'     , msgId: 'jobName_head'      , apiKey: 'Name'           , domId: 'Job{0}Name'        , domType: 'text'    , width: 250  , sortable:true },
				{ label: '有効開始日'   , msgId: 'yuqStartDate_head' , apiKey: 'StartDate__c'   , domId: 'Job{0}StartDate'   , domType: 'date'    , width:  90  , sortable:true },
				{ label: '有効終了日'   , msgId: 'tk10000356'        , apiKey: 'EndDate__c'     , domId: 'Job{0}EndDate'     , domType: 'date'    , width:  90  , sortable:true }
			],
			sortKeys : [
				{ apiKey: 'JobCode__c' }
			],
			searchFields : [
				{ label: '主担当部署'  , msgId: 'tk10000849'   , apiKey: 'DeptId__c'      , domId: 'JobListDeptId'  , domType: 'select', width: 300, lw: 'auto', wr: true, noNL: true, minusIsNull: true, dispField: { apiKey: 'DeptId__r.Name', codeKey: 'DeptId__r.DeptCode__c' } },
				{ label: '日付'        , msgId: 'date_head'    , apiKey: '_date'          , domId: 'JobListDate'    , domType: 'date'  , width: 108, lw: 'auto', wr: true, name: 'jobValidDate', browse: 'cal', colNames: ['StartDate__c','EndDate__c'] },
				{ label: 'ジョブコード', msgId: 'tm20001020'   , apiKey: 'JobCode__c'     , domId: 'JobListCode'    , domType: 'text'  , width: 100, lw: 'auto', wr: true, matchType:1, noNL: true },
				{ label: 'ジョブ名'    , msgId: 'jobName_head' , apiKey: 'Name'           , domId: 'JobListName'    , domType: 'text'  , width: 240, lw: 'auto', wr: true, matchType:3 },
				{ label: 'ジョブ割当区分'                      , apiKey: '_jobAssignClass', domId: 'JobListClass'   , domType: 'filt'  , hidden: true }
			]
		},
		// 部署リスト
		depts  : {
			discernment : 'depts',
			objectName  : 'AtkDept__c',
			type        : 'table',
			title       : 'tk10001038',        // 部署検索
			selType     : 'radio',
			formCss     : 'ts-dialog-dept',
			rowLimit    : 50,
			fields      : [
				{ label: 'ID'                                        , apiKey: 'Id'              , domId: 'Dept{0}Id'          , domType: 'text'    , hidden: true },
				{ label: '経費費目表示区分'                          , apiKey: 'ExpItemClass__c' , domId: 'Dept{0}ExpItemClass', domType: 'text'    , hidden: true },
				{ check: true, domId: 'Dept{0}_Check', domType: 'checkbox', width: 24 },
				{ label: '部署コード'   , msgId: 'tk10000069'        , apiKey: 'DeptCode__c'     , domId: 'Dept{0}Code'        , domType: 'text'    , width: 110  , sortable:true },
				{ label: '部署名'       , msgId: 'tk10000335'        , apiKey: 'Name'            , domId: 'Dept{0}Name'        , domType: 'text'    , width: 210  , sortable:true },
				{ label: '上位部署名'   , msgId: 'tk10000337'        , apiKey: 'ParentId__r.Name', domId: 'Dept{0}ParentName'  , domType: 'text'    , width: 200  , sortable:true },
				{ label: '有効開始日'   , msgId: 'yuqStartDate_head' , apiKey: 'StartDate__c'    , domId: 'Dept{0}StartDate'   , domType: 'date'    , width:  90  , sortable:true },
				{ label: '有効終了日'   , msgId: 'tk10000356'        , apiKey: 'EndDate__c'      , domId: 'Dept{0}EndDate'     , domType: 'date'    , width:  90  , sortable:true }
			],
			sortKeys : [
				{ apiKey: 'DeptCode__c' }
			],
			searchFields : [
				{ label: '部署コード'  , msgId: 'tk10000069'   , apiKey: 'DeptCode__c'     , domId: 'DeptListCode' , domType: 'text' , width:  80, lw: 'auto', wr: true, matchType:1, noNL: true },
				{ label: '部署名'      , msgId: 'tk10000335'   , apiKey: 'Name'            , domId: 'DeptListName' , domType: 'text' , width: 100, lw: 'auto', wr: true, matchType:3, noNL: true },
				{ label: '上位部署名'  , msgId: 'tk10000337'   , apiKey: 'ParentId__r.Name', domId: 'DeptListPname', domType: 'text' , width: 100, lw: 'auto', wr: true, matchType:3, noNL: true },
				{ label: '日付'        , msgId: 'date_head'    , apiKey: '_date'           , domId: 'DeptListDate' , domType: 'date' , width: 108, lw: 'auto', wr: true, name: 'deptValidDate', browse: 'cal', colNames: ['StartDate__c','EndDate__c'] }
			]
		},
		// 取引先リスト
		accounts  : {
			discernment : 'accounts',
			objectName  : 'Account',
			type        : 'table',
			selType     : 'radio',
			title       : 'tf10002230',             // 取引先検索
			formCss     : 'ts-dialog-account',
			rowLimit    : 50,
			fields      : [
				{ label: 'ID'                                       , apiKey: 'Id'             , domId: 'Account{0}Id'          , domType: 'text'    , hidden: true },
				{ check: true                                                                  , domId: 'Account{0}_Check'      , domType: 'checkbox', width: 24 },
				{ label: '取引先名'     , msgId: 'tk10003250'       , apiKey: 'Name'           , domId: 'Account{0}Name'        , domType: 'text'    , width: 500  , sortable:true }
			],
			sortKeys : [
				{ apiKey: 'Name' }
			],
			searchFields : [
				{ label: '取引先名'     , msgId: 'tk10003250'       , apiKey: 'Name'           , domId: 'AccountListName'       , domType: 'text' , width: 150, lw: 'auto', wr: true, matchType:3 }
			]
		},
		// 承認履歴
		processInstanceSteps  : {
			discernment : 'processInstanceStep',
			objectName  : 'ProcessInstanceStep',
			type        : 'table',
			title       : 'approvalHistory_label',          // 承認履歴
			formCss     : 'ts-dialog-processIntanceStep',
			rowLimit    : 100,
			rowDisp     : 6,
			fields      : [
				{ label: 'Id'                                        , apiKey: 'Id'                             , domId: 'ProcessInstance{0}Id'                 , domType: 'text'    , hidden: true },
				{ label: 'TargetObjectId'                            , apiKey: 'ProcessInstance.TargetObjectId' , domId: 'ProcessInstance{0}TargetObjectId'     , domType: 'text'    , hidden: true },
				{ label: '承認者ID'                                  , apiKey: 'ActorId'                        , domId: 'ProcessInstance{0}ActorId'            , domType: 'text'    , hidden: true },
				{ label: '割当先ID'                                  , apiKey: 'OriginalActorId'                , domId: 'ProcessInstance{0}OriginalActorId'    , domType: 'text'    , hidden: true },
				{ label: '日付'          , msgId: 'date_head'        , apiKey: 'CreatedDate'                    , domId: 'ProcessInstance{0}CreatedDate'        , domType: 'datetime', width: 130   },
				{ label: '状況'          , msgId: 'statusj_head'     , apiKey: 'StepStatus'                     , domId: 'ProcessInstance{0}StepStatus'         , domType: 'text'    , width: 130  , align: 'center' },
				{ label: '割り当て先'    , msgId: 'tf10001210'       , apiKey: 'OriginalActor.Name'             , domId: 'ProcessInstance{0}OriginalActorName'  , domType: 'text'    , width: 100  , align: 'center' },
				{ label: '承認者'        , msgId: 'tk10000071'       , apiKey: 'Actor.Name'                     , domId: 'ProcessInstance{0}ActorName'          , domType: 'text'    , width: 100  , align: 'center' },
				{ label: 'コメント'      , msgId: 'comment_head'     , apiKey: 'Comments'                       , domId: 'ProcessInstance{0}Comments'           , domType: 'text'    , width: 240   }
			],
			sortKeys : [
				{ apiKey: 'CreatedDate', desc: true }
			]
		},
		// 経費申請リスト
		expApplyList : {
			discernment   : 'AtkExpApply',
			objectName    : 'AtkExpApply__c',
			type          : 'table',
			selType       : 'radio',
			title         : 'expApplyList_caption',       // 経費申請一覧
			formCss       : 'ts-dialog-expApply',
			rowLimit      : 8,
			rowDisp       : 8,
			irregularType : 'expApplyList',
			fields          : [
				{ check: true, domId: 'ExpApply{0}_Check', domType: 'checkbox', width: 24 },
				{ label: 'Id'                                        , apiKey: 'Id'                               , domId: 'ExpApply{0}Id'             , domType: 'text'     , hidden: true },
				{ label: 'Name'                                      , apiKey: 'Name'                             , domId: 'ExpApply{0}Name'           , domType: 'text'     , hidden: true },
				{ label: '状態'          , msgId: 'tf10001230'       , apiKey: 'StatusC__c'                       , domId: 'ExpApply{0}Status'         , domType: 'status'   , width:  30  , sortable:true },
				{ label: '精算申請番号'  , msgId: 'tf10000550'       , apiKey: 'ExpApplyNo__c'                    , domId: 'ExpApply{0}ExpApplyNo'     , domType: 'text'     , width: 100  , sortable:true, align:'center' },
				{ label: '精算申請日付'  , msgId: 'tf10001220'       , apiKey: 'ApplyTime__c'                     , domId: 'ExpApply{0}ApplyTime'      , domType: 'datetime' , width: 124  , sortable:true },
//                { label: '状態'          , msgId: 'tf10001230'       , apiKey: 'StatusC__c'                       , domId: 'ExpApply{0}Status'         , domType: 'select'   , width:  70  , sortable:true, align:'center', pickList: [{v:'',n:''},{v:'未確定' ,msgId:'notFix_label' },{v:'未申請' ,msgId:'tm10003560' },{v:'精算済み',msgId:'reimbursement_label'},{v:'承認済み',msgId:'tm10003480' },{v:'確定済み',msgId:'fixed_label' },{v:'承認待ち',msgId:'waitApproval_label' },{v:'申請取消',msgId:'tm10003500' },{v:'確定取消',msgId:'cancelFix_btn_title'},{v:'却下' ,msgId:'tm10003490' },{v:'却下済み',msgId:'rejected_label' }] },
				{ label: '事前申請番号'  , msgId: 'tf10001100'       , apiKey: 'ExpPreApplyId__r.ExpPreApplyNo__c', domId: 'ExpApply{0}ExpPreApplyNo'  , domType: 'text'     , width: 100  , sortable:true, align:'center' },
				{ label: '件名'          , msgId: 'tk10004320'       , apiKey: 'TitleD__c'                        , domId: 'ExpApply{0}ExpTitle'       , domType: 'text'     , width: 130  , sortable:true },
				{ label: '日付(from)'    , msgId: 'tf10000640'       , apiKey: 'StartDate__c'                     , domId: 'ExpApply{0}StartDate'      , domType: 'date'     , width:  82  , sortable:true },
				{ label: '日付(to)'      , msgId: 'tf10000650'       , apiKey: 'EndDate__c'                       , domId: 'ExpApply{0}EndDate'        , domType: 'date'     , width:  82  , sortable:true },
				{ label: '件数'          , msgId: 'rowCount_head'    , apiKey: 'Count__c'                         , domId: 'ExpApply{0}Count'          , domType: 'number'   , width:  46  , sortable:false},
				{ label: '金額'          , msgId: 'expCost_head'     , apiKey: 'TotalCost__c'                     , domId: 'ExpApply{0}TotalCost'      , domType: 'currency' , width: 108  , sortable:true }
//                { label: 'コメント'      , apiKey: 'Comment__c'                       , domId: 'ExpApply{0}Comment'        , domType: 'text'     , width: 180                  }
			],
			sortKeys : [
				{ apiKey: 'ApplyTime__c', desc: true }
			],
			children : {
				EmpExp__r : {
					fields: [
						{ apiKey: 'Id' }
					]
				}
			}
		},
		// 支払先リスト
		payeeList : {
			discernment : 'AtkPayee',
			objectName  : 'AtkPayee__c',
			type        : 'table',
			selType     : 'radio',
			title       : 'tf10000580',         // 支払先
			formCss     : 'ts-dialog-payee',
			rowLimit    : 20,
			rowDisp     : 10,
			fields          : [
				{ check: true, domId: 'Payee{0}_Check', domType: 'checkbox', width: 24 },
				{ label: 'Id'                                           , apiKey: 'Id'                      , domId: 'Payee{0}Id'                    , domType: 'text'    , hidden: true },
				{ label: '精算区分'                                     , apiKey: 'ExpenseType__c'          , domId: 'Payee{0}ExpenseType'           , domType: 'text'    , hidden: true },
				{ label: '支払先コード'     , msgId: 'ci00000150'       , apiKey: 'ZGRecipientCode__c'      , domId: 'Payee{0}ZGRecipientCode'       , domType: 'text'    , width: 110  , sortable:true },
				{ label: '支払先名'         , msgId: 'tf10001160'       , apiKey: 'Name'                    , domId: 'Payee{0}Name'                  , domType: 'text'    , width: 120  , sortable:true },
				{ label: '自動引落'         , msgId: 'tf10001240'       , apiKey: 'AutoWithdrawal__c'       , domId: 'Payee{0}AutoWithdrawal'        , domType: 'checkbox', width:  60  , sortable:true },
				{ label: '支払種別'         , msgId: 'tf10001150'       , apiKey: 'PayeeType__c'            , domId: 'Payee{0}PayeeType'             , domType: 'select'  , width: 120  , sortable:true, pickList:[{v:'1',msgId:'tf10001350'},{v:'2',msgId:'tf10001370'},{v:'3',msgId:'tf10001380'}] }, // 本人立替,請求書,法人カード
				{ label: '支払日'           , msgId: 'tf10000590'       , apiKey: 'PaymentDay__c'           , domId: 'Payee{0}PaymentDay'            , domType: 'text'    , width:  50  , sortable:true, align:'center' },
				{ label: '支払条件'         , msgId: 'tf10001250'       , apiKey: 'PaymentTerms__c'         , domId: 'Payee{0}PaymentTerms'          , domType: 'text'    , width: 100  , sortable:true },
				{ label: '振込先口座番号'   , msgId: 'tk10000427'       , apiKey: 'ZGRecipientAccountNo__c' , domId: 'Payee{0}ZGRecipientAccountNo'  , domType: 'text'    , width: 100  , sortable:true },
				{ label: '振込先銀行名'     , msgId: 'tk10000421'       , apiKey: 'ZGRecipientBankName__c'  , domId: 'Payee{0}ZGRecipientBankName'   , domType: 'text'    , width: 130  , sortable:true },
				{ label: '振込先支店名'     , msgId: 'tk10000423'       , apiKey: 'ZGRecipientBranchName__c', domId: 'Payee{0}ZGRecipientBranchName' , domType: 'text'    , width: 120  , sortable:true }
			],
			sortKeys : [
				{ apiKey: 'ZGRecipientCode__c' }
			],
			searchFields : [
				{ label: '支払先コード', msgId: 'ci00000150'  , apiKey: 'ZGRecipientCode__c', domId: 'PayeeRecipientCode', domType: 'text'  , width: 100, lw: 'auto', wr: true, matchType:0, noNL: true },
				{ label: '支払先名'    , msgId: 'tf10001160'  , apiKey: 'Name'              , domId: 'PayeeSearchName'   , domType: 'text'  , width: 120, lw: 'auto', wr: true, matchType:3, noNL: true },
				{ label: '支払種別'                           , apiKey: 'PayeeType__c'      , domId: 'PayeePayeeType'    , domType: 'text' , hidden: true },
				{ label: '精算区分'                           , apiKey: 'ExpenseType__c'    , domId: 'PayeeExpenseType'  , domType: 'text' , hidden: true, nullspec: true, findmid: ',' }
			],
			filts    : []
		},
		// 定期区間申請
		commuterPass : {
			fields : [
				{ label: '社員ID'                                        , apiKey: 'empId'               , domId: 'CommuterPassEmpId'               , domType: 'text'    , hidden:true },
				{ label: '定期区間履歴ID'                                , apiKey: 'id'                  , domId: 'CommuterPassId'                  , domType: 'text'    , hidden:true },
				{ label: '経路コード'                                    , apiKey: 'routeCode'           , domId: 'CommuterPassRouteCode'           , domType: 'text'    , hidden:true },
				{ label: '定期券金額'                                    , apiKey: 'passFare'            , domId: 'CommuterPassFare'                , domType: 'currency', hidden:true },
				{ label: '定期券期間'                                    , apiKey: 'passPeriod'          , domId: 'CommuterPassPeriod'              , domType: 'text'    , hidden:true },
				{ label: 'ステータス'                                    , apiKey: 'status'              , domId: 'CommuterPassStatus'              , domType: 'text'    , hidden:true },
				{ label: '定期区間の取扱'                                , apiKey: 'excludeCommuterRoute', domId: 'CommuterPassExcludeCommuterRoute', domType: 'text'    , hidden:true },
				{ label: '経由駅で乗り換え'                              , apiKey: 'transfer'            , domId: 'CommuterPassTransfer'            , domType: 'checkbox', hidden:true },
				{ label: '開始日'            , msgId: 'tf10000180'       , apiKey: 'startDate'           , domId: 'CommuterPassStartDate'           , domType: 'date'    , width: 108, maxLen:12, name: 'commuterStartDate', browse: 'cal', required: 1 },
				{ label: '種別'              , msgId: 'tk10000262'       , apiKey: 'purpose'             , domId: 'CommuterPassPurpose'             , domType: 'radio'   , name: 'commuterPassPurpose' , pickList:[{v:'1',msgId:'tf10000440'},{v:'0',msgId:'tf10000450'}] }, // 変更または新規, 停止
				{ label: '定期区間'          , msgId: 'tk10000447'       , apiKey: 'routeDescription'    , domId: 'CommuterPassRouteDescription'    , domType: 'text'    , width: 280, ro: true  },
				{ label: '経路'              , msgId: 'route_head'       , apiKey: 'route'               , domId: 'CommuterPassRouteText'           , domType: 'text'    , width: 340, ro: true  },
				{ label: 'コメント'          , msgId: 'comment_head'     , apiKey: 'note'                , domId: 'CommuterPassComment'             , domType: 'textarea', width: 300, maxLen:255  }
			]
		},
		// 定期区間申請リスト
		commuterPassList : {
			discernment : 'AtkCommuterPass',
			objectName  : 'AtkCommuterPass__c',
			type        : 'table',
			title       : 'tf10002240',                 // 定期区間申請履歴
			formCss     : 'ts-dialog-commuter-pass',
			rowLimit    : 20,
			rowDisp     : 6,
			fields : [
				{ label: 'ID'                                            , apiKey: 'Id'                  , domId: 'CommuterPass{0}Id'                , domType: 'text'    , hidden:true },
				{ label: '経路コード'                                    , apiKey: 'RouteCode__c'        , domId: 'CommuterPass{0}RouteCode'         , domType: 'text'    , hidden:true },
				{ label: '経路'                                          , apiKey: 'Route__c'            , domId: 'CommuterPass{0}Route'             , domType: 'text'    , hidden:true },
				{ label: '定期券金額'                                    , apiKey: 'PassFare__c'         , domId: 'CommuterPass{0}Fare'              , domType: 'currency', hidden:true },
				{ label: '定期券期間'                                    , apiKey: 'PassPeriod__c'       , domId: 'CommuterPass{0}Period'            , domType: 'text'    , hidden:true },
				{ label: '開始日'            , msgId: 'tf10000180'       , apiKey: 'StartDate__c'        , domId: 'CommuterPass{0}StartDate'         , domType: 'date'    , width: 108, sortable:true },
				{ label: '定期区間'          , msgId: 'tk10000447'       , apiKey: 'RouteDescription__c' , domId: 'CommuterPass{0}RouteDescription'  , domType: 'text'    , width: 180, sortable:true },
				{ label: 'コメント'          , msgId: 'comment_head'     , apiKey: 'Note__c'             , domId: 'CommuterPass{0}Note'              , domType: 'text'    , width: 200  },
				{ label: 'ステータス'        , msgId: 'status_btn_title' , apiKey: 'Status__c'           , domId: 'CommuterPass{0}Status'            , domType: 'select'  , width:  90, sortable:true, align: 'center', link: true, pickList: [{v:'',n:''},{v:'未確定',msgId:'notFix_label'},{v:'未申請',msgId:'tm10003560'},{v:'精算済み',msgId:'reimbursement_label'},{v:'承認済み',msgId:'tm10003480'},{v:'確定済み',msgId:'fixed_label'},{v:'承認待ち',msgId:'waitApproval_label'},{v:'申請取消',msgId:'tm10003500'},{v:'確定取消',msgId:'cancelFix_btn_title'},{v:'却下',msgId:'tm10003490'},{v:'却下済み',msgId:'rejected_label'}] }
			],
			sortKeys : [
				{ apiKey: 'StartDate__c', desc: true },
				{ apiKey: 'CreatedDate' , desc: true }
			],
			filts    : [
				{ filtVal: "EmpId__c = '{0}'", filtKey: 'empId', fix: true }
			]
		},
		// 稟議
		ringiInfo : {
			fields : [
				{ label: '稟議ID'                                        , apiKey: 'Id'                  , domId: 'RingiId'                  , domType: 'text'    , hidden:true },
				{ label: '所有者ID'                                      , apiKey: 'OwnerId'             , domId: 'RingiOwnerId'             , domType: 'text'    , hidden:true },
				{ label: '申請No'            , msgId: 'tk10004310'       , apiKey: 'ApplicationNo__c'    , domId: 'RingiApplicationNo'       , domType: 'text'    , width: 'auto', lw: 100, ro: true, link: true },
				{ label: '種別'              , msgId: 'tk10000262'       , apiKey: 'Type__c'             , domId: 'RingiType'                , domType: 'text'    , width: 'auto', lw: 100, ro: true },
				{ label: '件名'              , msgId: 'tk10004320'       , apiKey: 'Name'                , domId: 'RingiName'                , domType: 'text'    , width: 'auto', lw: 100, ro: true }
			]
		},
		// 稟議検索
		ringiList : {
			discernment : 'AtkApply',
			objectName  : 'AtkApply__c',
			type        : 'table',
			selType     : 'radio',
			title       : 'tf10002250',         // 稟議検索
			formCss     : 'ts-dialog-ringo',
			rowLimit    : 20,
			rowDisp     : 10,
			fields          : [
				{ check: true, domId: 'Ringi{0}_Check', domType: 'checkbox', width: 24 },
				{ label: 'Id'                                         , apiKey: 'Id'                      , domId: 'Ringi{0}Id'                    , domType: 'text'    , hidden: true },
				{ label: '申請No'         , msgId: 'tk10004310'       , apiKey: 'ApplicationNo__c'        , domId: 'Ringi{0}ApplicationNo'         , domType: 'text'    , width: 110  , sortable:true, link: true },
				{ label: '種別'           , msgId: 'tk10000262'       , apiKey: 'Type__c'                 , domId: 'Ringi{0}Type'                  , domType: 'select'  , width: 100  , sortable:true },
				{ label: '件名'           , msgId: 'tk10004320'       , apiKey: 'Name'                    , domId: 'Ringi{0}Name'                  , domType: 'text'    , width: 200  , sortable:true },
				{ label: '申請者'         , msgId: 'tk10000067'       , apiKey: 'Owner.Name'              , domId: 'Ringi{0}OwnerName'             , domType: 'text'    , width: 100  , sortable:true, align: 'center' },
				{ label: '作成日時'       , msgId: 'tf10001270'       , apiKey: 'CreatedDate'             , domId: 'Ringi{0}CreatedDate'           , domType: 'datetime', width: 132  , sortable:true },
				{ label: '決裁日'         , msgId: 'tf10001280'       , apiKey: 'ApplicationDate__c'      , domId: 'Ringi{0}ApplicationDate'       , domType: 'date'    , width:  80  , sortable:true },
				{ label: 'ステータス'     , msgId: 'status_btn_title' , apiKey: 'Status__c'               , domId: 'Ringi{0}Status'                , domType: 'select'  , width:  80  , sortable:true, align: 'center', pickList: [{v:'',n:''},{v:'未確定',msgId:'notFix_label'},{v:'未申請',msgId:'tm10003560'},{v:'精算済み',msgId:'reimbursement_label'},{v:'承認済み',msgId:'tm10003480'},{v:'確定済み',msgId:'fixed_label'},{v:'承認待ち',msgId:'waitApproval_label'},{v:'申請取消',msgId:'tm10003500'},{v:'確定取消',msgId:'cancelFix_btn_title'},{v:'却下',msgId:'tm10003490'},{v:'却下済み',msgId:'rejected_label'}] }
			],
			sortKeys : [
				{ apiKey: 'CreatedDate', desc: true }
			],
			searchFields : [
				{ label: '申請No'      , msgId: 'tk10004310'  , apiKey: 'ApplicationNo__c', domId: 'RingiSearchApplicationNo' , domType: 'text'  , width:  90, lw: 'auto', wr: true, matchType:1, noNL: true },
				{ label: '種別'        , msgId: 'tk10000262'  , apiKey: 'Type__c'         , domId: 'RingiSearchType'          , domType: 'select', width: 140, lw: 'auto', wr: true             , noNL: true },
				{ label: '件名'        , msgId: 'tk10004320'  , apiKey: 'Name'            , domId: 'RingiSearchName'          , domType: 'text'  , width: 120, lw: 'auto', wr: true, matchType:3, noNL: true },
				{ label: '申請者'      , msgId: 'tk10000067'  , apiKey: 'Owner.Name'      , domId: 'RingiSearchOwnerName'     , domType: 'text'  , width:  90, lw: 'auto', wr: true, matchType:3, noNL: true }
			]
		},
		// 仮払申請検索
		provisionalPayments  : {
			discernment : 'provisionalPayments',
			objectName  : 'AtkExpPreApply__c',
			type        : 'table',
			title       : 'tf10006140',        // 仮払申請検索
			selType     : 'radio',
			formCss     : 'ts-dialog-provisional-pays',
			rowLimit    : 20,
			fields      : [
				{ label: 'ID'                                        , apiKey: 'Id'                         , domId: 'ProvisionalPay{0}Id'           , domType: 'text'    , hidden: true },
				{ label: '申請名'                                    , apiKey: 'Name'                       , domId: 'ProvisionalPay{0}Name'         , domType: 'text'    , hidden: true },
				{ check: true, domId: 'Dept{0}_Check', domType: 'checkbox', width: 24 },
				{ label: '事前申請番号' , msgId: 'tf10001100'        , apiKey: 'ExpPreApplyNo__c'           , domId: 'ProvisionalPay{0}ExpPreApplyNo', domType: 'text'    , width: 100  , sortable:true },
				{ label: '件名'         , msgId: 'tk10004320'        , apiKey: 'Title__c'                   , domId: 'ProvisionalPay{0}Title'        , domType: 'text'    , width: 210  , sortable:true },
				{ label: '仮払希望日'   , msgId: 'tf10006130'        , apiKey: 'ExpectedPayDate__c'         , domId: 'ProvisionalPay{0}ExPayDate'    , domType: 'date'    , width:  90  , sortable:true },
				{ label: '仮払金額'     , msgId: 'tf10001050'        , apiKey: 'ProvisionalPaymentAmount__c', domId: 'ProvisionalPay{0}Amount'       , domType: 'currency', width: 120  , sortable:true }
			],
			sortKeys : [
				{ apiKey: 'ExpPreApplyNo__c' }
			],
			searchFields : [
			],
			filts    : [
				{ filtVal: "EmpId__c = '{0}'"            , filtKey: 'empId'               , fix: true },
				{ filtVal: "RecordType.Name = '仮払申請'", filtKey: 'recordType'          , fix: true },
				{ filtVal: "StatusC__c in ('承認済み','確定済み', '精算済み', '仕訳済み')", fix: true },
				{ filtVal: "AdjustmentDone__c = false"                                    , fix: true }
			],
			children : {
				AdjustmentExpApply__r : {
					fields: [
						{ apiKey: 'Id' }
					]
				},
				ExpApplications__r : {
					fields: [
						{ apiKey: 'Id' }
					]
				}
			}
		},
		// 経費の費目検索
		expItems : {
			discernment : 'expItems',
			objectName  : 'AtkExpItem__c',
			type        : 'table',
			selType     : 'radio',
			title       : 'tf10006790',         // 費目検索
			formCss     : 'ts-dialog-expItem',
			rowLimit    : 20,
			rowDisp     : 12,
			fields          : [
				{ check: true, domId: 'ExpItem{0}_Check', domType: 'checkbox', width: 24 },
				{ label: 'Id'                                         , apiKey: 'Id'                       , domId: 'ExpItem{0}Id'                    , domType: 'text'    , hidden: true },
				{ label: '費目種別'                                   , apiKey: 'TransportType__c'         , domId: 'ExpItem{0}TransportType'         , domType: 'text'    , notUse: true },
				{ label: '手当種別'                                   , apiKey: 'AllowanceFlag__c'         , domId: 'ExpItem{0}AllowanceFlag'         , domType: 'text'    , notUse: true },
				{ label: '精算区分'                                   , apiKey: 'ExpenseType__c'           , domId: 'ExpItem{0}ExpenseType'           , domType: 'text'    , notUse: true },
				{ label: '使用制限あり'                               , apiKey: 'RestrictTargetEmployee__c', domId: 'ExpItem{0}RestrictTargetEmployee', domType: 'text'    , notUse: true },
				{ label: '使用可能社員'                               , apiKey: 'TargetEmployee__c'        , domId: 'ExpItem{0}TargetEmployee'        , domType: 'text'    , notUse: true },
				{ label: '表示名'         , msgId: 'tk10000690'       , apiKey: 'Name'                     , domId: 'ExpItem{0}Name'                  , domType: 'text'    , width: 150  , sortable:true },
				{ label: 'コード'         , msgId: 'code_head'        , apiKey: 'Code__c'                  , domId: 'ExpItem{0}Code'                  , domType: 'text'    , width: 110  , sortable:true },
				{ label: '費目名'         , msgId: 'tm20004560'       , apiKey: 'ItemName__c'              , domId: 'ExpItem{0}ItemName'              , domType: 'text'    , width: 150  , sortable:true },
				{ label: '補助科目コード' , msgId: 'tk10000707'       , apiKey: 'AuxCode__c'               , domId: 'ExpItem{0}AuxCode'               , domType: 'text'    , width: 110  , sortable:true },
				{ label: '補助科目名'     , msgId: 'tm20004575'       , apiKey: 'AuxTitle__c'              , domId: 'ExpItem{0}AuxTitle'              , domType: 'text'    , width: 150  , sortable:true }
			],
			sortKeys : [
				{ apiKey: 'Code__c' }
			],
			searchFields : [
				{ label: '表示名'      , msgId: 'tk10000690'  , apiKey: 'Name'            , domId: 'ExpItemSearchName'          , domType: 'text'  , width: 110, lw: 'auto', wr: true, matchType:3, noNL: true },
				{ label: '費目名'      , msgId: 'tm20004560'  , apiKey: 'ItemName__c'     , domId: 'ExpItemSearchItemName'      , domType: 'text'  , width: 110, lw: 'auto', wr: true, matchType:3, noNL: true },
				{ label: 'コード'      , msgId: 'code_head'   , apiKey: 'Code__c'         , domId: 'ExpItemSearchCode'          , domType: 'text'  , width: 100, lw: 'auto', wr: true, matchType:3, noNL: true },
				{ label: '費目ID'                             , apiKey: 'Id'              , domId: 'ExpItemSearchId'            , domType: 'array' , hidden: true }
			],
			filts : [
				{ filtVal: "Removed__c = false"           , fix: true },
				{ filtVal: "ForAdjustment__c = false"     , fix: true },
				{ filtVal: "ForPayable__c = false"        , fix: true }
			]
		},
		// CSVインポート
		csvUpload  : {
			discernment : 'csvUpload',
			objectName  : 'AtkEmpExp__c',
			type        : 'table',
			title       : 'tf10001500',                 // カード明細読込
			formCss     : 'ts-csv-upload',
			fields      : [
			]
		}
	}
};
