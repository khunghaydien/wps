teasp.provide('teasp.logic.convert');
/**
 * コンバート関数クラス.<br/>
 *
 * サーバから受信したJSONデータを内部管理用オブジェクトの形式に変換する。<br/>
 * パッケージ版の場合、カスタム項目の変数名にネームスペース（teamspirit__）がプレフィックスで付与されて渡されるため、
 * ネームスペースの除去を行っている。<br/>
 *
 * @constructor
 * @author DCI小島
 */
teasp.logic.convert = function(){
};

/**
 * セッションユーザ情報変換.
 *
 * @param {Object} sessionEmp セッションユーザオブジェクト
 * @param {Object} targetEmp (使用しない）
 */
teasp.logic.convert.convSessionInfoObj = function(sessionEmp, targetEmp, rights){
	teasp.logic.convert.excludeNameSpace(sessionEmp);
	return {
		user : {
			id                   : sessionEmp.UserId__c,
			name                 : (sessionEmp.UserId__r ? sessionEmp.UserId__r.Name : null),
			profileName          : (sessionEmp.UserId__r ? (sessionEmp.UserId__r.Profile.Name) : false),
			sysAdmin             : (sessionEmp.UserId__r ? (sessionEmp.UserId__r.Profile.PermissionsModifyAllData) : false),
			rights               : (rights || 0)
		},
		emp : {
			id                   : (sessionEmp.Id             || null ),
			name                 : (sessionEmp.Name           || null ),
			isAdmin              : (sessionEmp.IsAdmin__c     || false),
			isAllEditor          : (sessionEmp.IsAllEditor__c || false),
			isAllReader          : (sessionEmp.IsAllReader__c || false),
			isExpAdmin           : (sessionEmp.IsExpAdmin__c  || false)
		}
	};
};

/**
 * 共通設定情報変換.
 *
 * @param {Array.<Object>} commons 共通設定オブジェクトの配列
 * @param {?string} borderRevNo リビジョンチェック境界値
 */
teasp.logic.convert.convCommonObj = function(commons, borderRevNo){
	teasp.logic.convert.excludeNameSpace(commons);
	var common = (commons.length > 0 ? commons[0] : null);
	var c = common ? {
		taxRate                    : common.TaxRate__c,
		taxRoundFlag               : common.TaxRoundFlag__c,
		helpLink                   : common.HelpLink__c,
		infoLink                   : common.InfoLink__c,
		useFixedButton             : common.UseFixedButton__c,
		useEkitan                  : (common.UseEkitan__c == '利用する'),
		useRestartable             : common.UseRestartable__c,
		treatLateStart             : teasp.logic.convert.valNumber(common.TreatLateStart__c, 0),
		treatEarlyEnd              : teasp.logic.convert.valNumber(common.TreatEarlyEnd__c , 0),
		ekitanArea                 : common.EkitanArea__c,
		localKey                   : common.LocalKey__c,
		commentIfAbsence           : common.CommentIfAbsence__c,
		commentIfNoPushTime        : common.CommentIfNoPushTime__c,
		indicateNoPushTime         : common.IndicateNoPushTime__c,
		cancelMonthApply           : common.CancelMonthApply__c,
		cancelDayApply             : common.CancelDayApply__c,
		mailEmpApplyCanceled       : common.mailEmpApplyCanceled__c,
		flexGraph                  : (common.FlexGraph__c           == '表示する'),
		discretionaryOption        : (common.DiscretionaryOption__c == '表示する'),
		borderTime                 : common.BorderTime__c,
		legalTimeOfDay             : common.LegalTimeOfDay__c,
		nightStartTime             : common.NightStartTime__c,
		nightEndTime               : common.NightEndTime__c,
		jobWorkflow                : common.JobWorkflow__c,
		jobInitialDateHistory      : dojo.fromJson(common.JobInitialDateHistory__c || '[]'),
		jobInitialDayOfMonth       : teasp.logic.convert.valNumber(common.JobInitialDayOfMonth__c),
		jobMarkOfMonth             : teasp.logic.convert.valNumber(common.JobMarkOfMonth__c),
		progressList               : teasp.logic.convert.valArray(common.ProgressList__c, /\r?\n/, teasp.logic.convert.convValidList),
		processList                : teasp.logic.convert.valArray(common.ProcessList__c, /\r?\n/, teasp.logic.convert.convValidList),
		expWorkflow                : common.ExpWorkflow__c,
		ticketPeriod               : common.TicketPeriod__c,
		expApplyPrefix             : common.ExpApplyPrefix__c,
		revision                   : common.Revision__c,
		keepExteriorTime           : common.KeepExteriorTime__c,
		borderRevNo                : borderRevNo,
		expStartDate               : (common.ExpStartDate__c || 0),
		requireNote                : common.RequireNote__c,
		requireNoteOption          : teasp.logic.convert.valArray(common.RequireNoteOption__c),
		checkDefaultDailyFix       : common.CheckDefaultDailyFix__c,
		jobLeaderFilter            : common.JobLeaderFilter__c,
		nonDialogKey               : common.NonDialogKey__c,
		notInfoAutoView            : common.NotInfoAutoView__c,
		msDailyWorkTimeIsReal      : common.MsDailyWorkTimeIsReal__c,
		dailyApprover              : common.DailyApprover__c,
		useDailyApply              : common.UseDailyApply__c,
		allowEditManager           : common.AllowEditManager__c,
		allowEditExpAdmin          : common.AllowEditExpAdmin__c,
		disabledTimeReport         : common.DisabledTimeReport__c,
		disabledEmpExp             : common.DisabledEmpExp__c,
		disabledEmpJob             : common.DisabledEmpJob__c,
		workNoteCrlfOn             : common.WorkNoteCrlfOn__c,
		handleInvalidApply         : common.HandleInvalidApply__c,
		clarifyAfterApply          : common.ClarifyAfterApply__c,
		hideMonthlySummary         : common.HideMonthlySummary__c,
		hideBottomSummary          : common.HideBottomSummary__c,
		hideTimeGraphPopup         : common.HideTimeGraphPopup__c,
		permitLeavingPush24hours   : common.permitLeavingPush24hours__c,
		permitStartBtnDateChange   : common.PermitStartBtnDateChange__c,
		separateDailyNote          : common.SeparateDailyNote__c,
		permitDeptFixWoMonthFix    : common.PermitDeptFixWoMonthFix__c,
		leftoverJobId              : common.LeftoverJobId__c,
		leftoverJobCode            : ((common.LeftoverJobId__r && common.LeftoverJobId__r.JobCode__c) || ''),
		leftoverJobName            : ((common.LeftoverJobId__r && common.LeftoverJobId__r.Name) || ''),
		leftoverJobStartDate       : teasp.logic.convert.valDate(common.LeftoverJobId__r && common.LeftoverJobId__r.StartDate__c),
		leftoverJobEndDate         : teasp.logic.convert.valDate(common.LeftoverJobId__r && common.LeftoverJobId__r.EndDate__c),
		leftoverJobActive          : ((common.LeftoverJobId__r && common.LeftoverJobId__r.Active__c) || false),
		leftoverJobAssignClass     : ((common.LeftoverJobId__r && common.LeftoverJobId__r.JobAssignClass__c) || null),
		useJobApproverSet          : common.UseJobApproverSet__c,
		useExpApproverSet          : common.UseExpApproverSet__c,
		dontFixJobMonthly          : common.DontFixJobMonthly__c,
		limitToMainteJob           : common.LimitToMainteJob__c,
		useJobExtraItem1           : common.UseJobExtraItem1__c,
		permitDuplicateJobProcess  : common.PermitDuplicateJobProcess__c,
		jobExtraItem1Name          : (common.JobExtraItem1Name__c   || ''),
		jobExtraItem1Length        : (common.JobExtraItem1Length__c || 0),
		jobExtraItem1Width         : (common.JobExtraItem1Width__c  || 0),
		useJobExtraItem2           : common.UseJobExtraItem2__c,
		jobExtraItem2Name          : (common.JobExtraItem2Name__c   || ''),
		jobExtraItem2Length        : (common.JobExtraItem2Length__c || 0),
		jobExtraItem2Width         : (common.JobExtraItem2Width__c  || 0),
		workNoteTemplate           : (common.WorkNoteTemplate__c || null),
		prohibitAcrossMonthApply   : common.ProhibitAcrossMonthApply__c,
		expLinkDocument            : common.ExpLinkDocument__c,
		requireExpLinkJob          : common.RequireExpLinkJob__c,
		recalcByLatestExchangeRate : common.RecalcByLatestExchangeRate__c,
		limitedTimeDistance        : teasp.logic.convert.valFloat(common.LimitedTimeDistance__c, 48),
		permitChangeLeftoverJob    : common.PermitChangeLeftoverJob__c,
		namingRule                 : common.NamingRule__c,           // 内部メッセージフォーマット
		expPreApplyConfig          : teasp.constant.getExpPreApplyConfig(common.ExpPreApplyConfig__c ? dojo.fromJson(common.ExpPreApplyConfig__c) : null),
		extraItemOutPutDataName1   : common.ExtraItemOutputDataName1__c || '',
		extraItemOutPutDataName2   : common.ExtraItemOutputDataName2__c || '',
		useAccessControlSystem     : common.UseAccessControlSystem__c, // 入退館管理機能を使用する
		divergenceReasonList       : teasp.logic.convert.valArray(common.DivergenceReasonList__c, /\r?\n/, teasp.logic.convert.convValidList), // 乖離理由候補
		defaultWorkLocationId      : common.DefaultWorkLocationId__c || null,
		config                     : dojo.fromJson(common.Config__c || '{}'),
		permitMonthlySummaryHelpURL: common.DisableMonthlySummaryHelpURL__c,
		fixedWorkMSHelpURL         : common.FixedWorkMSHelpURL__c,
		flextimeMSHelpURL          : common.FlextimeMSHelpURL__c,
		variableWorkMSHelpURL      : common.VariableWorkMSHelpURL__c,
		managerMSHelpURL		   : common.ManagerMSHelpURL__c,
		discretionaryWorkMSHelpURL : common.DiscretionaryWorkMSHelpURL__c
	} : {
		revision                 : null
	};
	teasp.setTs1OptimizeOnBrowser((c.config && c.config.ts1OptimizeOnBrowser) || false);
	teasp.setTs1OptimizeWidth((c.config && c.config.ts1OptimizeWidth) || null);
	teasp.setTs1OptimizeOption((c.config && c.config.ts1OptimizeOption) || teasp.ts1OptimizeOptionValue.OptimizedTs1);
	return c;
};

/**
 * 対象社員情報変換.
 *
 * @param {Object} targetEmp 社員オブジェクト
 * @param {string} mode モード
 */
teasp.logic.convert.convTargetEmpObj = function(targetEmp, mode){
	teasp.logic.convert.excludeNameSpace(targetEmp);
	var o = {
		id                       : (targetEmp.Id            || null),
		name                     : (targetEmp.Name          || null),
		code                     : (targetEmp.EmpCode__c       || ''  ),
		empTypeId                : (targetEmp.EmpTypeId__c  || null),
		empTypeName              : (targetEmp.EmpTypeId__r ? targetEmp.EmpTypeId__r.Name : ''  ),
		userId                   : (targetEmp.UserId__r    ? targetEmp.UserId__r.Id      : null),
		userName                 : (targetEmp.UserId__r    ? targetEmp.UserId__r.Name    : ''  ),
		managerId                : (targetEmp.Manager__r   ? targetEmp.Manager__r.Id     : null),
		managerName              : (targetEmp.Manager__r   ? targetEmp.Manager__r.Name   : ''  ),
		entryDate                : teasp.logic.convert.valDate(targetEmp.EntryDate__c),
		endDate                  : teasp.logic.convert.valDate(targetEmp.EndDate__c),
		deptId                   : (targetEmp.DeptId__r   ? targetEmp.DeptId__r.Id      : null),
		deptCode                 : (targetEmp.DeptId__r   ? targetEmp.DeptId__r.DeptCode__c : ''  ),
		deptName                 : (targetEmp.DeptId__r   ? targetEmp.DeptId__r.Name    : ''  ),
		deptStartDate            : teasp.logic.convert.valDate(targetEmp.DeptStartDate__c),
		deptStartMonth           : teasp.logic.convert.valNumber(targetEmp.DeptStartMonth__c),
		isAdmin                  : (targetEmp.IsAdmin__c     || false),
		isAllEditor              : (targetEmp.IsAllEditor__c || false),
		isAllReader              : (targetEmp.IsAllReader__c || false),
		isExpAdmin               : (targetEmp.IsExpAdmin__c  || false),
		workInputType            : teasp.logic.convert.valNumber(targetEmp.WorkInputType__c),
		workNoteOption           : (targetEmp.WorkNoteOption__c === undefined ? true : targetEmp.WorkNoteOption__c),
		taskNoteOption           : (targetEmp.TaskNoteOption__c    || false),
		jobAssignClass           : (targetEmp.JobAssignClass__c || null),
		expConfig                : (targetEmp.ExpConfig__c         || null ),
		commuterRouteLock        : (targetEmp.CommuterRouteLock__c || false),
		commuterRouteNote        : (targetEmp.CommuterRouteNote__c || ''   ),
		nextYuqProvideDate       : teasp.logic.convert.valDate(targetEmp.NextYuqProvideDate__c),
		hidden                   : (targetEmp.Hidden__c || false),
		title                    : (targetEmp.Title__c  || null ),
		mode                     : (mode || 'edit'),
		inputFlag                : teasp.logic.convert.valNumber(targetEmp.InputFlag__c, 0),
		inputAccessControlFlag   : teasp.logic.convert.valNumber(targetEmp.InputAccessControlFlag__c, 0), // 入退館管理対象者フラグ
		inputAccessControlFlagHistory: function(hists){
			var lst = [];
			try{
				l = dojo.fromJson(hists || '[]');
				for(var i = 0 ; i < l.length ; i++){
					var o = l[i];
					if(o.date){
						o.inputAccessControlFlag = teasp.logic.convert.valNumber(o.inputAccessControlFlag, 0);
						lst.push(o);
					}
				}
				lst = lst.sort(function(a, b){ return (a.date < b.date ? -1 : 1); });
			}catch(e){}
			return lst;
		}(targetEmp.InputAccessControlFlagHistory__c),
		inputAccessControlFlagLock   : (targetEmp.InputAccessControlFlagLock__c ? true : false),
		smallPhotoUrl            : ((targetEmp.UserId__r && targetEmp.UserId__r.SmallPhotoUrl) || null),
		leftoverJobId            : (targetEmp.LeftoverJobId__c || null),
		leftoverJobCode          : ((targetEmp.LeftoverJobId__r && targetEmp.LeftoverJobId__r.JobCode__c) || ''),
		leftoverJobName          : ((targetEmp.LeftoverJobId__r && targetEmp.LeftoverJobId__r.Name) || ''),
		leftoverJobStartDate     : teasp.logic.convert.valDate(targetEmp.LeftoverJobId__r && targetEmp.LeftoverJobId__r.StartDate__c),
		leftoverJobEndDate       : teasp.logic.convert.valDate(targetEmp.LeftoverJobId__r && targetEmp.LeftoverJobId__r.EndDate__c),
		leftoverJobActive        : ((targetEmp.LeftoverJobId__r && targetEmp.LeftoverJobId__r.Active__c) || false),
		leftoverJobAssignClass   : ((targetEmp.LeftoverJobId__r && targetEmp.LeftoverJobId__r.JobAssignClass__c) || null),
		configBase               : (targetEmp.EmpTypeId__r ? {
			id                       : targetEmp.EmpTypeId__r.ConfigBaseId__r.Id,
			initialDayOfWeek         : teasp.logic.convert.valNumber(targetEmp.EmpTypeId__r.ConfigBaseId__r.InitialDayOfWeek__c),
			initialDateOfMonth       : teasp.logic.convert.valNumber(targetEmp.EmpTypeId__r.ConfigBaseId__r.InitialDateOfMonth__c),
			markOfMonth              : teasp.logic.convert.valNumber(targetEmp.EmpTypeId__r.ConfigBaseId__r.MarkOfMonth__c),
			initialDateOfYear        : teasp.logic.convert.valNumber(targetEmp.EmpTypeId__r.ConfigBaseId__r.InitialDateOfYear__c),
			markOfYear               : teasp.logic.convert.valNumber(targetEmp.EmpTypeId__r.ConfigBaseId__r.MarkOfYear__c)
		} : null),
		daiqManage              : (targetEmp.EmpTypeId__r ? {
			daiqLimit                : targetEmp.EmpTypeId__r.DaiqLimit__c,                           // 代休の有効期限
			daiqAllBorderTime        : targetEmp.EmpTypeId__r.DaiqAllBorderTime__c,                   // 代終日休可能な休日労働時間
			daiqHalfBorderTime       : targetEmp.EmpTypeId__r.DaiqHalfBorderTime__c,                  // 代半日休可能な休日労働時間
			useDaiqLegalHoliday      : targetEmp.EmpTypeId__r.UseDaiqLegalHoliday__c,                 // 法定休日出勤の代休を許可
			useDaiqManage            : targetEmp.EmpTypeId__r.UseDaiqManage__c,                       // 代休管理を行う
			useDaiqReserve           : targetEmp.EmpTypeId__r.UseDaiqReserve__c,                      // 申請時に代休有無を指定
			useHalfDaiq              : targetEmp.EmpTypeId__r.UseHalfDaiq__c,                         // 半日代休
			useRegulateHoliday       : targetEmp.EmpTypeId__r.UseRegulateHoliday__c,                  // 休日出勤の勤怠を平日扱いする
			noDaiqExchanged          : targetEmp.EmpTypeId__r.NoDaiqExchanged__c                      // 振替休日に出勤した場合は代休不可
		} : null),
		holidayStock            : (targetEmp.EmpTypeId__r ? {
			enableStockHoliday       : targetEmp.EmpTypeId__r.EnableStockHoliday__c,                  // 失効した有給休暇を積立休暇として積立てる
			maxStockHoliday          : targetEmp.EmpTypeId__r.MaxStockHoliday__c,                     // 積立休暇の最大日数
			maxStockHolidayPerYear   : targetEmp.EmpTypeId__r.MaxStockHolidayPerYear__c               // 1年で積立できる最大日数
		} : null)
	};
	o.configBaseOrg = o.configBase;
	return o;
};

/**
 * 承認者設定情報変換.
 *
 * @param {Array.<Object>} approverSet 承認者設定情報オブジェクトの配列
 */
teasp.logic.convert.convApproverSetObjs = function(approverSet){
	teasp.logic.convert.excludeNameSpace(approverSet);
	var lst = (approverSet || []);
	var o = {};
	for(var i = 0 ; i < lst.length ; i++){
		var a = lst[i];
		o[a.Type__c] = {
			id        : a.Id,
			type      : a.Type__c,
			approvers : [
			(a.Approver1__r  ? { id : a.Approver1__r.Id , name : a.Approver1__r.Name  } : null)
			, (a.Approver2__r  ? { id : a.Approver2__r.Id , name : a.Approver2__r.Name  } : null)
			, (a.Approver3__r  ? { id : a.Approver3__r.Id , name : a.Approver3__r.Name  } : null)
			, (a.Approver4__r  ? { id : a.Approver4__r.Id , name : a.Approver4__r.Name  } : null)
			, (a.Approver5__r  ? { id : a.Approver5__r.Id , name : a.Approver5__r.Name  } : null)
			, (a.Approver6__r  ? { id : a.Approver6__r.Id , name : a.Approver6__r.Name  } : null)
			, (a.Approver7__r  ? { id : a.Approver7__r.Id , name : a.Approver7__r.Name  } : null)
			, (a.Approver8__r  ? { id : a.Approver8__r.Id , name : a.Approver8__r.Name  } : null)
			, (a.Approver9__r  ? { id : a.Approver9__r.Id , name : a.Approver9__r.Name  } : null)
			, (a.Approver10__r ? { id : a.Approver10__r.Id, name : a.Approver10__r.Name } : null)
			]
		};
	}
	var types = [
		teasp.constant.APPROVER_TYPE_MONTH
	, teasp.constant.APPROVER_TYPE_MONTHLY
	, teasp.constant.APPROVER_TYPE_DAILY
	, teasp.constant.APPROVER_TYPE_DAILYFIX
	, teasp.constant.APPROVER_TYPE_JOB
	, teasp.constant.APPROVER_TYPE_EXP
	];
	for(i = 0 ; i < types.length ; i++){
		var t = types[i];
		if(!o[t]){
			o[t] = { id : null, type : t, approvers : [null, null, null, null, null, null, null, null, null, null] };
		}
	}
	return o;
};

/**
 * 勤怠月度情報変換.
 *
 * @param {Array.<Object>} empMonths 勤怠月度オブジェクトの配列
 */
teasp.logic.convert.convEmpMonthObjs = function(_empMonths, _deptMonths, customKeys){
	var empMonths  = (_empMonths  || []);
	var deptMonths = (_deptMonths || []);
	teasp.logic.convert.excludeNameSpace(empMonths);
	teasp.logic.convert.excludeNameSpace(deptMonths);
	var months = [];
	for(var i = 0 ; i < empMonths.length ; i++){
		var em = empMonths[i];
		var o = {
			id                           : em.Id,
			yearMonth                    : em.YearMonth__c,
			apply                        : {
				id                       : (em.EmpApplyId__r ? em.EmpApplyId__r.Id : null),
				status                   : (em.EmpApplyId__r ? em.EmpApplyId__r.Status__c : null),
				close                    : (em.EmpApplyId__r ? em.EmpApplyId__r.Close__c : null)
			},
			deptMonth                    : (em.DeptMonthId__c ? {
				id                       : em.DeptMonthId__c,
				status                   : (em.DeptMonthId__r.Status__c || null),
				deptId                   : (em.DeptMonthId__r.DeptId__c || null),
				deptName                 : ((em.DeptMonthId__r.DeptId__r && em.DeptMonthId__r.DeptId__r.Name) || null),
				deptCode                 : ((em.DeptMonthId__r.DeptId__r && em.DeptMonthId__r.DeptId__r.DeptCode__c) || null),
				histDept                 : (em.DeptMonthId__r.HistDeptId__c ? {
					deptId               : em.DeptMonthId__r.HistDeptId__c,
					deptName             : (em.DeptMonthId__r.HistDeptId__r.Name || null),
					deptCode             : (em.DeptMonthId__r.HistDeptId__r.DeptCode__c || em.DeptMonthId__r.HistDeptId__r.Code__c || null)
				} : null)
			} : null),
			inputFlag                    : teasp.logic.convert.valNumber(em.InputFlag__c, 0),
			inputAccessControlFlag       : teasp.logic.convert.valNumber(em.InputAccessControlFlag__c, 0),
			startDate                    : teasp.logic.convert.valDate(em.StartDate__c),
			endDate                      : teasp.logic.convert.valDate(em.EndDate__c),
			lastModifiedDate             : em.LastModifiedDate,
			legalWorkTimeOfPeriod        : em.LegalWorkTimeOfPeriod__c,
			attributeAtConfirm           : teasp.decode(em.AttributeAtConfirm__c, 1),
			configId                     : em.ConfigId__c,
			periodWorkOverTime36         : em.PeriodWorkOverTime36__c,
			empTypeId                    : (em.EmpTypeId__c || null),
			empTypeName                  : (em.EmpTypeId__r ? em.EmpTypeId__r.Name : null),
			configBase                   : (em.EmpTypeId__r ? {
				id                       : em.EmpTypeId__r.ConfigBaseId__r.Id,
				initialDayOfWeek         : teasp.logic.convert.valNumber(em.EmpTypeId__r.ConfigBaseId__r.InitialDayOfWeek__c),
				initialDateOfMonth       : teasp.logic.convert.valNumber(em.EmpTypeId__r.ConfigBaseId__r.InitialDateOfMonth__c),
				markOfMonth              : teasp.logic.convert.valNumber(em.EmpTypeId__r.ConfigBaseId__r.MarkOfMonth__c),
				initialDateOfYear        : teasp.logic.convert.valNumber(em.EmpTypeId__r.ConfigBaseId__r.InitialDateOfYear__c),
				markOfYear               : teasp.logic.convert.valNumber(em.EmpTypeId__r.ConfigBaseId__r.MarkOfYear__c)
			} : null),
			daiqManage                   : (em.EmpTypeId__r ? {
				daiqLimit                : em.EmpTypeId__r.DaiqLimit__c,                           // 代休の有効期限
				daiqAllBorderTime        : em.EmpTypeId__r.DaiqAllBorderTime__c,                   // 代終日休可能な休日労働時間
				daiqHalfBorderTime       : em.EmpTypeId__r.DaiqHalfBorderTime__c,                  // 代半日休可能な休日労働時間
				useDaiqLegalHoliday      : em.EmpTypeId__r.UseDaiqLegalHoliday__c,                 // 法定休日出勤の代休を許可
				useDaiqManage            : em.EmpTypeId__r.UseDaiqManage__c,                       // 代休管理を行う
				useDaiqReserve           : em.EmpTypeId__r.UseDaiqReserve__c,                      // 申請時に代休有無を指定
				useHalfDaiq              : em.EmpTypeId__r.UseHalfDaiq__c,                         // 半日代休
				useRegulateHoliday       : em.EmpTypeId__r.UseRegulateHoliday__c,                  // 休日出勤の勤怠を平日扱いする
				noDaiqExchanged          : em.EmpTypeId__r.NoDaiqExchanged__c                      // 振替休日に出勤した場合は代休不可
			} : null),
			holidayStock                 : (em.EmpTypeId__r ? {
				enableStockHoliday       : em.EmpTypeId__r.EnableStockHoliday__c,                  // 失効した有給休暇を積立休暇として積立てる
				maxStockHoliday          : em.EmpTypeId__r.MaxStockHoliday__c,                     // 積立休暇の最大日数
				maxStockHolidayPerYear   : em.EmpTypeId__r.MaxStockHolidayPerYear__c               // 1年で積立できる最大日数
			} : null)
		};
		if(customKeys){
			for(var c = 0 ; c < customKeys.length ; c++){
				var k = (customKeys[c] || '').split('.')[0];
				if(em.hasOwnProperty(k)){
					o[k] = (typeof(em[k]) == 'number' ? em[k] : (em[k] || null));
				}
			}
		}
		months.push(o);
	}
	var dMonths = [];
	for(i = 0 ; i < deptMonths.length ; i++){
		var dm = deptMonths[i];
		var o = {
			id          : dm.Id,
			yearMonth   : dm.YearMonth__c,
			status      : (dm.Status__c || null),
			deptId      : (dm.DeptId__c || null),
			deptName     : ((dm.DeptId__r && dm.DeptId__r.Name) || null),
			histDept     : (dm.HistDeptId__c ? {
				deptId   : dm.HistDeptId__c,
				deptName : dm.HistDeptId__r.Name,
				deptCode : (dm.HistDeptId__r.DeptCode__c || dm.HistDeptId__r.Code__c || null)
			} : null)
		};
		dMonths.push(o);
	}
	return { months: months, deptMonths: dMonths };
};

/**
 * 部署情報取得用の勤怠月度情報変換.
 *
 * @param {Array.<Object>} empMonthSimple
 */
teasp.logic.convert.convEmpMonthSimpleObjs = function(_empMonthSimple){
	var empMonthSimple  = (_empMonthSimple  || []);
	teasp.logic.convert.excludeNameSpace(empMonthSimple);
	var months = [];
	for(var i = 0 ; i < empMonthSimple.length ; i++){
		var em = empMonthSimple[i];
		var o = {
			id            : em.Id,
			yearMonth     : em.YearMonth__c,
			startDate     : teasp.logic.convert.valDate(em.StartDate__c),
			endDate       : teasp.logic.convert.valDate(em.EndDate__c),
			apply         : {
				id        : (em.EmpApplyId__r ? em.EmpApplyId__r.Id : null),
				status    : (em.EmpApplyId__r ? em.EmpApplyId__r.Status__c : null),
				close     : (em.EmpApplyId__r ? em.EmpApplyId__r.Close__c : null)
			},
			deptMonth     : (em.DeptMonthId__c ? {
				id        : em.DeptMonthId__c,
				status    : (em.DeptMonthId__r.Status__c || null),
				deptId    : (em.DeptMonthId__r.DeptId__c || null),
				deptName  : ((em.DeptMonthId__r.DeptId__r && em.DeptMonthId__r.DeptId__r.Name) || null),
				deptCode  : ((em.DeptMonthId__r.DeptId__r && em.DeptMonthId__r.DeptId__r.DeptCode__c) || null)
			} : null)
		};
		months.push(o);
	}
	return months;
};

/**
 * 勤怠設定情報変換.
 *
 * @param {Array.<Object>} configs 勤怠設定オブジェクトの配列
 */
teasp.logic.convert.convConfigObjs = function(configs){
	teasp.logic.convert.excludeNameSpace(configs);
	var confs = [];
	for(var i = 0 ; i < configs.length ; i++){
		var config = configs[i];
		var o = {
			id                                       : config.Id,
			workSystem                               : config.WorkSystem__c,                                                  // 労働時間制
			holidays                                 : config.Holidays__c,                                                    // 休日
			autoLegalHoliday                         : config.AutoLegalHoliday__c,                                            // 法定休日自動判定フラグ
			defaultLegalHoliday                      : teasp.logic.convert.valNumber(config.DefaultLegalHoliday__c, null),    // 優先される法定休日の曜日
			useWorkFlow                              : config.UseWorkFlow__c,                                                 // 承認ワークフロー使用
			useMakeupHoliday                         : config.UseMakeupHoliday__c,                                            // 個人単位の振替許可
			changePattern                            : (config.ChangePattern__c == '1'),                                      // パターン変更
			changeShift                              : (config.ChangeShift__c   == '1'),                                      // シフト変更
			flexStartTime                            : config.FlexStartTime__c,                                               // フレックス開始時間
			flexEndTime                              : config.FlexEndTime__c,                                                 // フレックス終了時間
			coreStartTime                            : config.CoreStartTime__c,                                               // コア開始時刻
			coreEndTime                              : config.CoreEndTime__c,                                                 // コア終了時刻
			useCoreTime                              : config.UseCoreTime__c,                                                 // コア時間帯の有無
			flexFixOption                            : config.FlexFixOption__c,                                               // フレックス所定オプション
			flexFixMonthTime                         : config.FlexFixMonthTime__c,                                            // フレックス固定所定労働時間
			flexFixDayTime                           : config.FlexFixDayTime__c,                                              // フレックス１日当り所定労働時間
			flexLegalWorkTimeOption                  : config.FlexLegalWorkTimeOption__c,                                     // フレックスでの法定労働時間の計算方法
			variablePeriod                           : teasp.logic.convert.valNumber(config.VariablePeriod__c, 1),            // 変形労働時間期間
			timeRound                                : config.TimeRound__c,                                                   // 時刻丸め
			timeRoundBegin                           : config.TimeRoundBegin__c,                                              // 出社時刻の端数処理
			timeRoundEnd                             : config.TimeRoundEnd__c,                                                // 退社時刻の端数処理
			timeFormat                               : config.TimeFormat__c,                                                  // 時刻表示形式
			legalTimeOfWeek                          : config.LegalTimeOfWeek__c,                                             // 法定労働時間/週
			validStartMonth                          : (config.ValidStartMonth__c || null),                                   // 有効開始月
			validEndMonth                            : (config.ValidEndMonth__c   || null),                                   // 有効終了月
			validStartDate                           : teasp.logic.convert.valDate(config.ValidStartDate__c),                 // 有効開始日
			validEndDate                             : teasp.logic.convert.valDate(config.ValidEndDate__c),                   // 有効終了日
			generation                               : config.Generation__c,                                                  // 世代番号
			baseTime                                 : config.BaseTime__c,                                                    // 時間単位休の基準時間（年次有給休暇用）
			baseTimeForStock                         : config.BaseTimeForStock__c,                                            // 時間単位休の基準時間（日数管理休暇用）
			standardFixTime                          : config.StandardFixTime__c,                                             // １日の標準労働時間
			coreTimeGraph                            : config.CoreTimeGraph__c,                                               // 勤怠グラフにコア時間を表示
			restTimeCheck                            : dojo.fromJson(config.RestTimeCheck__c || '[]'),                        // 法定休憩時間のチェック
			roundMonthlyTime                         : teasp.logic.convert.valNumber(config.RoundMonthlyTime__c),             // 月単位の端数処理
			useEarlyEndApply                         : config.UseEarlyEndApply__c,                                            // 早退申請を使用する
			useLateStartApply                        : config.UseLateStartApply__c,                                           // 遅刻申請を使用する
			useEarlyWorkFlag                         : teasp.logic.convert.convOverFlag(config.UseEarlyWorkFlag__c || 0),     // 早朝勤務申請を使用する
			useOverTimeFlag                          : teasp.logic.convert.convOverFlag(config.UseOverTimeFlag__c || 0),      // 残業申請を使用する
			useDailyApply                            : config.UseDailyApply__c,                                               // 日次確定申請を使用する
			// 201208版
			useReviseTimeApply                       : config.UseReviseTimeApply__c,                                          // 勤怠時刻修正申請を使用する
			useHolidayWorkFlag                       : config.UseHolidayWorkFlag__c,                                          // 休日出勤申請を使用する
			pastTimeOnly                             : config.PastTimeOnly__c,                                                // 未来の時刻は入力不可とする
			changeDayType                            : config.ChangeDayType__c,                                               // 個人単位で平日・休日を設定できる
			exchangeLimit                            : teasp.logic.convert.valNumber(config.ExchangeLimit__c, null),          // 振替の期間制限（休日出勤前）
			exchangeLimit2                           : teasp.logic.convert.valNumber(config.ExchangeLimit2__c, null),         // 振替の期間制限（休日出勤後）
			checkDailyFixLeak                        : config.CheckDailyFixLeak__c,                                           // 日次確定申請漏れをチェックする
			checkWorkingTimeMonthly                  : config.CheckWorkingTimeMonthly__c,                                     // 工数入力時間のチェックする（月次確定時）
			nonPublicHoliday                         : config.NonPublicHoliday__c,                                            // 祝日は休日ではない
			halfDaiqReckontoWorked                   : config.HalfDaiqReckontoWorked__c,                                      // 半日代休を勤務時間とみなす
			daiqReckontoWorked                       : config.HalfDaiqReckontoWorked__c,                                      // 終日代休を勤務時間とみなす
			// JRI版
			inputWorkingTimeOnWorkTimeView           : config.InputWorkingTimeOnWorkTimeView__c,                              // 勤務表に工数入力ボタンを表示
			leavingAcrossNextDay                     : config.LeavingAcrossNextDay__c,                                        // 24:00を超えた退社時間の入力
			prohibitApplicantEliminatingLegalHoliday : config.ProhibitApplicantEliminatingLegalHoliday__c,                    // 法定休日がなくなる申請を禁止
			prohibitInputTimeUntilApproved           : config.ProhibitInputTimeUntilApproved__c,                              // 承認されるまで時間入力を禁止
			separateDailyFixButton                   : config.SeparateDailyFixButton__c,                                      // 日次確定ボタンを独立させる
			summary36TimePeriod                      : config.Summary36TimePeriod__c,                                         // 期間の36協定時間を集計する
			useApplyApproverTemplate                 : config.UseApplyApproverTemplate__c,                                    // 承認者設定を使用する
			// 201301版
			overTimeBorderTime                       : teasp.logic.convert.valNumber(config.OverTimeBorderTime__c, -1),       // 残業申請を必要とする時刻
			earlyWorkBorderTime                      : teasp.logic.convert.valNumber(config.EarlyWorkBorderTime__c, -1),      // 早朝勤務申請を必要とする時刻
			permitUpdateTimeLevel                    : teasp.logic.convert.valNumber(config.PermitUpdateTimeLevel__c, 0),     // 勤務時間を修正できる社員
			highlightLateEarly                       : config.HighlightLateEarly__c,                                          // 遅刻・早退を強調表示する
			nightChargeOnly                          : config.NightChargeOnly__c,                                             // 裁量の場合の残業は夜間割増のみ認める
			// 201302版
			useDirectApply                           : config.UseDirectApply__c,                                              // 直行・直帰申請を使用する
			workTypeList                             : config.WorkTypeList__c,                                                // 作業区分
			// V5.14
			config                                   : teasp.decode(config.Config__c, 1),                                     // 設定
			// V5.42(入退館管理)
			weekDayAccessBaseTime                    : config.WeekDayAccessBaseTime__c,                                       // 入退館基準時間(平日)
			holidayAccessBaseTime                    : config.HolidayAccessBaseTime__c,                                       // 入退館基準時間(休日)
			permitDailyApply                         : config.PermitDailyApply__c,                                            // 日次確定は乖離判定前でも申請を可能とする
			permitMonthlyApply                       : config.PermitMonthlyApply__c,                                          // 月次確定は乖離が発生していても申請を可能とする
			permitDivergenceTime                     : config.PermitDivergenceTime__c,                                        // 乖離許容時間(分)
			useAccessControlSystem                   : config.UseAccessControlSystem__c,                                      // 入退館管理機能を使用する
			msAccessInfo                             : config.MsAccessInfo__c,                                                // 月次サマリに入退館情報を表示する
			// テレワーク勤務
			useWorkLocation                          : config.UseWorkLocation__c,                                             // 勤務場所の管理を行う
			requireWorkLocation                      : config.RequireWorkLocation__c,                                         // 勤務場所入力必須
			// --------
			dailyApprover                            : teasp.logic.convert.valNumber(config.DailyApprover__c, 0),             // 日次確定申請の承認者
			checkWorkingTime                         : config.CheckWorkingTime__c,                                            // 工数入力時間をチェックする
			deductWithFixedTime                      : config.DeductWithFixedTime__c,                                         // 残業と控除の相殺をしない
			extendDayType                            : config.ExtendDayType__c,                                               // ２暦日にまたがる労働を１暦日扱いする
			originalId                               : config.OriginalId__c,                                                  // オリジナルID
			configBaseId                             : config.ConfigBaseId__c,                                                // 勤怠基本設定ID
			removed                                  : config.Removed__c,                                                     // 削除フラグ
			defaultPattern                           : {
				stdStartTime                         : config.StdStartTime__c,                                                // 始業時刻
				stdEndTime                           : config.StdEndTime__c,                                                  // 終業時刻
				restTimes                            : teasp.util.extractTimes(config.RestTimes__c),                          // 休憩時間
				standardFixTime                      : config.StandardFixTime__c,                                             // １日の標準労働時間
				useHalfHoliday                       : config.UseHalfHoliday__c,                                              // 半日休暇制度の採用
				amHolidayStartTime                   : config.AmHolidayStartTime__c,                                          // 午前半休開始時間
				amHolidayEndTime                     : config.AmHolidayEndTime__c,                                            // 午前半休終了時間
				pmHolidayStartTime                   : config.PmHolidayStartTime__c,                                          // 午後半休開始時間
				pmHolidayEndTime                     : config.PmHolidayEndTime__c,                                            // 午後半休終了時間
				igonreNightWork                      : config.IgonreNightWork__c,                                             // 夜間労働時間不使用
				useDiscretionary                     : config.UseDiscretionary__c,                                            // 裁量労働制の採用
				useHalfHolidayRestTime               : config.UseHalfHolidayRestTime__c,                                      // 半休取得時の休憩時間
				amHolidayRestTimes                   : teasp.util.extractTimes(config.AmHolidayRestTimes__c),                 // 午前半休時休憩時間
				pmHolidayRestTimes                   : teasp.util.extractTimes(config.PmHolidayRestTimes__c)                  // 午後半休時休憩時間
			}
		};
		if(o.workSystem == teasp.constant.WORK_SYSTEM_MANAGER){
			// 管理監督者の場合、代休を勤務時間とみなすは強制オフ
			o.halfDaiqReckontoWorked = false;
			o.daiqReckontoWorked     = false;
		}
		if(o.workSystem == teasp.constant.WORK_SYSTEM_MUTATE && o.variablePeriod > 1){
			// 変形労働かつ変形期間が1ヶ月超の場合、週の法定労働時間は強制で40Hとする
			o.legalTimeOfWeek = 40 * 60;
		}
		if(!o.config){
			o.config = {};
		}
		if(!o.config.empApply){
			o.config.empApply = {};
		}
		confs.push(o);
	}
	return confs;
};

/**
 * 日タイプ判定用の要素を持つ勤怠設定情報変換
 *
 * @param {Array.<Object>} configMins 勤怠設定オブジェクトの配列
 */
teasp.logic.convert.convConfigMinObjs = function(configMins){
	teasp.logic.convert.excludeNameSpace(configMins);
	var confs = [];
	for(var i = 0 ; i < configMins.length ; i++){
		var config = configMins[i];
		var o = {
			id                       : config.Id,
			holidays                 : config.Holidays__c,                                     // 休日
			autoLegalHoliday         : config.AutoLegalHoliday__c,                             // 法定休日自動判定フラグ
			defaultLegalHoliday      : (config.DefaultLegalHoliday__c || null),                // 優先される法定休日の曜日
			validStartMonth          : (config.ValidStartMonth__c || null),                    // 有効開始月
			validEndMonth            : (config.ValidEndMonth__c   || null),                    // 有効終了月
			validStartDate           : teasp.logic.convert.valDate(config.ValidStartDate__c),  // 有効開始日
			validEndDate             : teasp.logic.convert.valDate(config.ValidEndDate__c),    // 有効終了日
			generation               : config.Generation__c,                                   // 世代番号
			nonPublicHoliday         : config.NonPublicHoliday__c                              // 祝日は休日ではない
		};
		confs.push(o);
	}
	return confs;
};

/**
 * 工数実績申請情報変換.
 *
 * @param {Array.<Object>|Object} _jobApply 工数実績申請オブジェクト
 */
teasp.logic.convert.convJobApplyObj = function(_jobApply){
	teasp.logic.convert.excludeNameSpace(_jobApply);
	var jobApply = (_jobApply && _jobApply.length ? _jobApply[0] : _jobApply);
	return jobApply ? {
		id                       : jobApply.Id,
		yearMonth                : jobApply.YearMonth__c,
		subNo                    : jobApply.SubNo__c || null,
		status                   : jobApply.Status__c,
		startDate                : teasp.logic.convert.valDate(jobApply.StartDate__c),
		endDate                  : teasp.logic.convert.valDate(jobApply.EndDate__c)
	} : null;
};

/**
 * 工数実績申請情報変換.
 *
 * @param {Array.<Object>|Object} _jobApply 工数実績申請オブジェクト
 */
teasp.logic.convert.convJobApplysObj = function(jobApplys){
	teasp.logic.convert.excludeNameSpace(jobApplys);
	var lst = [];
	for(var i = 0 ; i < jobApplys.length ; i++){
		var jobApply = jobApplys[i];
		lst.push({
			id                       : jobApply.Id,
			yearMonth                : jobApply.YearMonth__c,
			subNo                    : jobApply.SubNo__c || null,
			status                   : jobApply.Status__c,
			startDate                : teasp.logic.convert.valDate(jobApply.StartDate__c),
			endDate                  : teasp.logic.convert.valDate(jobApply.EndDate__c)
		});
	}
	return lst;
};

/**
 * カレンダー情報変換.
 *
 * @param {Object} calendar 日付('yyyy-MM-dd')をキーとしたカレンダーオブジェクトのマップ
 */
teasp.logic.convert.convCalendarObjs = function(calendar){
	teasp.logic.convert.excludeNameSpace(calendar);
	var cals = [];
	for(var i = 0 ; i < calendar.length ; i++){
		var ca = calendar[i];
		cals.push({
			date                    : teasp.logic.convert.valDate(ca.Date__c),
			type                    : ca.Type__c,
			empTypeId               : ca.EmpTypeId__c,
			deptId                  : ca.DeptId__c,
			event                   : ca.Event__c,
			plannedHoliday          : ca.PlannedHoliday__c,
			priority                : (ca.Priority__c == '1'),
			pattern                 : (ca.PatternId__r ? {
				id                  : ca.PatternId__r.Id,
				name                : ca.PatternId__r.Name,
				stdStartTime        : ca.PatternId__r.StdStartTime__c,
				stdEndTime          : ca.PatternId__r.StdEndTime__c,
				restTimes           : teasp.util.extractTimes(ca.PatternId__r.RestTimes__c),
				standardFixTime     : ca.PatternId__r.StandardFixTime__c,
				useHalfHoliday      : ca.PatternId__r.UseHalfHoliday__c,
				amHolidayStartTime  : ca.PatternId__r.AmHolidayStartTime__c,
				amHolidayEndTime    : ca.PatternId__r.AmHolidayEndTime__c,
				pmHolidayStartTime  : ca.PatternId__r.PmHolidayStartTime__c,
				pmHolidayEndTime    : ca.PatternId__r.PmHolidayEndTime__c,
				igonreNightWork     : ca.PatternId__r.IgonreNightWork__c,
				useDiscretionary    : ca.PatternId__r.UseDiscretionary__c,
				enableRestTimeShift      : ca.PatternId__r.EnableRestTimeShift__c,
				workTimeChangesWithShift : ca.PatternId__r.WorkTimeChangesWithShift__c,
				disableCoreTime          : ca.PatternId__r.DisableCoreTime__c,
				useHalfHolidayRestTime   : ca.PatternId__r.UseHalfHolidayRestTime__c,
				amHolidayRestTimes       : teasp.util.extractTimes(ca.PatternId__r.AmHolidayRestTimes__c),
				pmHolidayRestTimes       : teasp.util.extractTimes(ca.PatternId__r.PmHolidayRestTimes__c)
			} : null)
		});
	}
	var calMap = {};
	for(var i = 0 ; i < cals.length ; i++){
		var o = cals[i];
		if(o.deptId){
			if(!calMap[o.deptId]){
				calMap[o.deptId] = {};
			}
			calMap[o.deptId][o.date] = o;
			continue;
		}
		var c = calMap[o.date];
		if(c){
			if(!o.empTypeId){
				if(o.event){
					c.event = o.event + ((c.event || '') != '' ? (teasp.message.getLabel('tm10001470') + c.event) : '');
				}
				if(o.priority && o.type){
					c.type = o.type;
					c.plannedHoliday = o.plannedHoliday;
				}
			}else{
				if(o.event){
					c.event = ((c.event || '') != '' ? (c.event + teasp.message.getLabel('tm10001470')) : '') + o.event;
				}
				c.pattern = o.pattern;
				if(!c.priority && o.type){
					c.type = o.type;
					c.plannedHoliday = o.plannedHoliday;
				}
			}
		}else{
			calMap[o.date] = o;
		}
	}
	return calMap;
};

/**
 * 勤怠日次情報変換.
 *
 * @param {Array.<Object>} empDays 勤怠日次オブジェクトの配列
 */
teasp.logic.convert.convEmpDayObjs = function(empDays){
	teasp.logic.convert.excludeNameSpace(empDays);
	var days = {};
	for(var i = 0 ; i < empDays.length ; i++){
		var ed = empDays[i];
		days[teasp.logic.convert.valDate(ed.Date__c)] = {
			dayType                   : parseInt(ed.DayType__c, 10),
			dbOrgDayType              : ed.OrgDayType__c,
			holiday1                  : (ed.HolidayId1__r ? {
				id                    : ed.HolidayId1__r.Id,
				name                  : teasp.logic.convert.excludeCopyTag(ed.HolidayId1__r.Name),
				type                  : ed.HolidayId1__r.Type__c,
				range                 : ed.HolidayId1__r.Range__c,
				plannedHoliday        : ed.HolidayId1__r.PlannedHoliday__c,
				displayDaysOnCalendar : ed.HolidayId1__r.DisplayDaysOnCalendar__c,
				yuqSpend              : ed.HolidayId1__r.YuqSpend__c,
				config                : dojo.fromJson(ed.HolidayId1__r.Config__c || '{}')
			}                         : (ed.HolidayApplyId1__r && ed.HolidayApplyId1__r.FilterValid__c == '1' ? {
				id                    : ed.HolidayApplyId1__r.HolidayId__r.Id,
				name                  : teasp.logic.convert.excludeCopyTag(ed.HolidayApplyId1__r.HolidayId__r.Name),
				type                  : ed.HolidayApplyId1__r.HolidayId__r.Type__c,
				range                 : ed.HolidayApplyId1__r.HolidayId__r.Range__c,
				displayDaysOnCalendar : ed.HolidayApplyId1__r.HolidayId__r.DisplayDaysOnCalendar__c,
				yuqSpend              : ed.HolidayApplyId1__r.HolidayId__r.YuqSpend__c,
				config                : dojo.fromJson(ed.HolidayApplyId1__r.HolidayId__r.Config__c || '{}')
			} : null)),
			holiday2                  : (ed.HolidayId2__r ? {
				id                    : ed.HolidayId2__r.Id,
				name                  : teasp.logic.convert.excludeCopyTag(ed.HolidayId2__r.Name),
				type                  : ed.HolidayId2__r.Type__c,
				range                 : ed.HolidayId2__r.Range__c,
				plannedHoliday        : ed.HolidayId2__r.PlannedHoliday__c,
				displayDaysOnCalendar : ed.HolidayId2__r.DisplayDaysOnCalendar__c,
				yuqSpend              : ed.HolidayId2__r.YuqSpend__c,
				config                : dojo.fromJson(ed.HolidayId2__r.Config__c || '{}')
			}                         : (ed.HolidayApplyId2__r && ed.HolidayApplyId2__r.FilterValid__c == '1' ? {
				id                    : ed.HolidayApplyId2__r.HolidayId__r.Id,
				name                  : teasp.logic.convert.excludeCopyTag(ed.HolidayApplyId2__r.HolidayId__r.Name),
				type                  : ed.HolidayApplyId2__r.HolidayId__r.Type__c,
				range                 : ed.HolidayApplyId2__r.HolidayId__r.Range__c,
				displayDaysOnCalendar : ed.HolidayApplyId2__r.HolidayId__r.DisplayDaysOnCalendar__c,
				yuqSpend              : ed.HolidayApplyId2__r.HolidayId__r.YuqSpend__c,
				config                : dojo.fromJson(ed.HolidayApplyId2__r.HolidayId__r.Config__c || '{}')
			} : null)),
			pattern                   : (ed.PatternId__r ? {
				id                    : ed.PatternId__r.Id,
				name                  : teasp.logic.convert.excludeCopyTag(ed.PatternId__r.Name),
				stdStartTime          : ed.PatternId__r.StdStartTime__c,
				stdEndTime            : ed.PatternId__r.StdEndTime__c,
				restTimes             : teasp.util.extractTimes(ed.PatternId__r.RestTimes__c),
				standardFixTime       : ed.PatternId__r.StandardFixTime__c,
				useHalfHoliday        : ed.PatternId__r.UseHalfHoliday__c,
				amHolidayStartTime    : ed.PatternId__r.AmHolidayStartTime__c,
				amHolidayEndTime      : ed.PatternId__r.AmHolidayEndTime__c,
				pmHolidayStartTime    : ed.PatternId__r.PmHolidayStartTime__c,
				pmHolidayEndTime      : ed.PatternId__r.PmHolidayEndTime__c,
				igonreNightWork       : ed.PatternId__r.IgonreNightWork__c,
				useDiscretionary      : ed.PatternId__r.UseDiscretionary__c,
				enableRestTimeShift      : ed.PatternId__r.EnableRestTimeShift__c,
				workTimeChangesWithShift : ed.PatternId__r.WorkTimeChangesWithShift__c,
				disableCoreTime          : ed.PatternId__r.DisableCoreTime__c,
				useHalfHolidayRestTime   : ed.PatternId__r.UseHalfHolidayRestTime__c,
				amHolidayRestTimes       : teasp.util.extractTimes(ed.PatternId__r.AmHolidayRestTimes__c),
				pmHolidayRestTimes       : teasp.util.extractTimes(ed.PatternId__r.PmHolidayRestTimes__c)
			} : null),
			startTime                 : ed.StartTime__c,
			endTime                   : ed.EndTime__c,
			pushStartTime             : ed.PushStartTime__c,
			pushEndTime               : ed.PushEndTime__c,
			timeTable                 : teasp.util.extractTimes(ed.TimeTable__c),
			workLegalTime             : ed.WorkLegalTime__c,
			workLegalOverTime         : ed.WorkLegalOverTime__c,
			workChargeTime            : ed.WorkChargeTime__c,
			note                      : ed.Note__c,
			dairyDivergenceJudgement  : ed.DairyDivergenceJudgement__c, // 日単位乖離判定
			enterDivergenceJudgement  : teasp.logic.convert.valNumber(ed.EnterDivergenceJudgement__c, null), // 入館乖離判定
			enterDivergenceReason     : ed.EnterDivergenceReason__c,    // 入館乖離理由
			enterTime                 : ed.EnterTime__c,                // 入館時間
			exitDivergenceJudgement   : teasp.logic.convert.valNumber(ed.ExitDivergenceJudgement__c, null),  // 退館乖離判定
			exitDivergenceReason      : ed.ExitDivergenceReason__c,     // 退館乖離理由
			exitTime                  : ed.ExitTime__c,                 // 退館時間
			event                     : ed.Event__c,
			exchangeDate              : teasp.logic.convert.valDate(
										(ed.ExchangeSApplyId__r && ed.ExchangeSApplyId__r.FilterValid__c == '1' ?
												ed.ExchangeSApplyId__r.ExchangeDate__c :
													(ed.ExchangeEApplyId__r && ed.ExchangeEApplyId__r.FilterValid__c == '1' ?
															ed.ExchangeEApplyId__r.StartDate__c :
																null))),
			plannedHoliday            : ed.PlannedHoliday__c,
			workNote                  : ed.WorkNote__c,
			workLocationId            : ed.WorkLocationId__c,
			applyId                   : {
				holidayApplyId1       : ed.HolidayApplyId1__c,
				holidayApplyId2       : ed.HolidayApplyId2__c,
				exchangeSApplyId      : ed.ExchangeSApplyId__c,
				exchangeEApplyId      : ed.ExchangeEApplyId__c,
				patternSApplyId       : ed.PatternSApplyId__c,
				patternLApplyId       : ed.PatternLApplyId__c,
				zangyoApplyId         : ed.ZangyoApplyId__c,
				earlyStartApplyId     : ed.EarlyStartApplyId__c,
				holidayWorkApplyId    : ed.HolidayWorkApplyId__c,
				lateStartApplyId      : ed.LateStartApplyId__c,
				earlyEndApplyId       : ed.EarlyEndApplyId__c,
				dailyApplyId          : ed.DailyApplyId__c
			}
		};
		// holiday1->PM, holiday2->AM になっていたら holiday1->AM, holiday2->PM になるように入れ替える
		var o = days[teasp.logic.convert.valDate(ed.Date__c)];
		if(o.holiday1 && o.holiday2
		&& o.holiday1.range == teasp.constant.RANGE_PM
		&& o.holiday2.range == teasp.constant.RANGE_AM){
			var th = o.holiday1;
			o.holiday1 = o.holiday2;
			o.holiday2 = th;
		}
	}
	return days;
};

/**
 * 勤怠日次（簡易）情報変換.
 *
 * @param {Array.<Object>} simpleEmpDays 勤怠日次オブジェクトの配列
 */
teasp.logic.convert.convSimpleEmpDayObjs = function(simpleEmpDays){
	teasp.logic.convert.excludeNameSpace(simpleEmpDays);
	var days = {};
	for(var i = 0 ; i < simpleEmpDays.length ; i++){
		var ed = simpleEmpDays[i];
		days[teasp.logic.convert.valDate(ed.Date__c)] = {
			dayType                 : parseInt(ed.DayType__c, 10),
			startTime               : ed.StartTime__c,
			endTime                 : ed.EndTime__c,
			plannedHoliday          : ed.PlannedHoliday__c
		};
	}
	return days;
};

/**
 * 勤怠申請情報変換.
 *
 * @param {Array.<Object>} empApplys 勤怠申請オブジェクトの配列
 */
teasp.logic.convert.convEmpApplyObjs = function(empApplys){
	teasp.logic.convert.excludeNameSpace(empApplys);
	var applys = [];
	for(var i = 0 ; i < empApplys.length ; i++){
		var ea = empApplys[i];
		var o = {
			id                      : ea.Id,
			applyType               : ea.ApplyType__c,
			yearMonth               : ea.YearMonth__c,
			startDate               : teasp.logic.convert.valDate(ea.StartDate__c),
			endDate                 : teasp.logic.convert.valDate(ea.EndDate__c),
			startTime               : ea.StartTime__c,
			endTime                 : ea.EndTime__c,
			exchangeDate            : teasp.logic.convert.valDate(ea.ExchangeDate__c),
			originalStartDate       : teasp.logic.convert.valDate(ea.OriginalStartDate__c),
			status                  : ea.Status__c,
			close                   : ea.Close__c,
			decree                  : ea.Decree__c,
			content                 : ea.Content__c,
			dayType                 : (ea.DayType__c || null),
			holiday                 : (ea.HolidayId__r ? {
				id                    : ea.HolidayId__r.Id,
				name                  : ea.HolidayId__r.Name,
				type                  : ea.HolidayId__r.Type__c,
				range                 : ea.HolidayId__r.Range__c,
				managed               : ea.HolidayId__r.Managed__c,
				manageName            : ea.HolidayId__r.ManageName__c,
				displayDaysOnCalendar : ea.HolidayId__r.DisplayDaysOnCalendar__c,
				yuqSpend              : ea.HolidayId__r.YuqSpend__c,
				config                : dojo.fromJson(ea.HolidayId__r.Config__c || '{}'),
				order                 : (ea.HolidayId__r.Order__c || 0)
			} : null),
			pattern                 : (ea.PatternId__r ? {
				id                  : ea.PatternId__c,
				name                : ea.PatternId__r.Name,
				stdStartTime        : ea.PatternId__r.StdStartTime__c,
				stdEndTime          : ea.PatternId__r.StdEndTime__c,
				restTimes           : teasp.util.extractTimes(ea.PatternId__r.RestTimes__c),
				standardFixTime     : ea.PatternId__r.StandardFixTime__c,
				useHalfHoliday      : ea.PatternId__r.UseHalfHoliday__c,
				amHolidayStartTime  : ea.PatternId__r.AmHolidayStartTime__c,
				amHolidayEndTime    : ea.PatternId__r.AmHolidayEndTime__c,
				pmHolidayStartTime  : ea.PatternId__r.PmHolidayStartTime__c,
				pmHolidayEndTime    : ea.PatternId__r.PmHolidayEndTime__c,
				igonreNightWork     : ea.PatternId__r.IgonreNightWork__c,
				useDiscretionary    : ea.PatternId__r.UseDiscretionary__c,
				enableRestTimeShift      : ea.PatternId__r.EnableRestTimeShift__c,
				workTimeChangesWithShift : ea.PatternId__r.WorkTimeChangesWithShift__c,
				disableCoreTime          : ea.PatternId__r.DisableCoreTime__c,
				useHalfHolidayRestTime   : ea.PatternId__r.UseHalfHolidayRestTime__c,
				amHolidayRestTimes       : teasp.util.extractTimes(ea.PatternId__r.AmHolidayRestTimes__c),
				pmHolidayRestTimes       : teasp.util.extractTimes(ea.PatternId__r.PmHolidayRestTimes__c)
			} : null),
			workPlace               : (ea.WorkPlaceId__r ? {
				id                  : ea.WorkPlaceId__c,
				code                : ea.WorkPlaceId__r.DeptCode__c,
				name                : ea.WorkPlaceId__r.Name,
				symbol              : ea.WorkPlaceId__r.Symbol__c
			} : null),
			applyTime               : teasp.logic.convert.valDateTime(ea.ApplyTime__c),
			note                    : ea.Note__c,
			contact                 : ea.Contact__c,
			ownReason               : ea.OwnReason__c,
			daiqReserve             : ea.DaiqReserve__c,
			daiqDate1               : teasp.logic.convert.valDate(ea.DaiqDate1__c),
			daiqDate1Range          : teasp.logic.convert.valNumber(ea.DaiqDate1Range__c),
			daiqDate2               : teasp.logic.convert.valDate(ea.DaiqDate2__c),
			daiqDate2Range          : teasp.logic.convert.valNumber(ea.DaiqDate2Range__c),
			useRegulateHoliday      : ea.UseRegulateHoliday__c,
			treatDeduct             : teasp.logic.convert.valNumber(ea.TreatDeduct__c, 0),
			excludeDate             : teasp.logic.convert.valArray(ea.ExcludeDate__c, /:/, teasp.logic.convert.convFormatDate),
			timeTable               : (ea.TimeTable__c || null),
			oldValue                : (ea.OldValue__c || null),
			reviseType              : (ea.ReviseType__c || null),
			entered                 : (ea.Entered__c || false),
			afterFlag               : (ea.AfterFlag__c || false),
			content                 : (ea.Content__c || null),
			directFlag              : (ea.DirectFlag__c || false),
			workType                : (ea.WorkType__c || null),
			travelTime              : ea.TravelTime__c,
			estimatedOverTime       : ea.EstimatedOverTime__c,
			holidayTime             : ea.HolidayTime__c,
			approvers               : [
										(ea.Approver1__r  ? { id : ea.Approver1__r.Id , name : ea.Approver1__r.Name  } : null)
									, (ea.Approver2__r  ? { id : ea.Approver2__r.Id , name : ea.Approver2__r.Name  } : null)
									, (ea.Approver3__r  ? { id : ea.Approver3__r.Id , name : ea.Approver3__r.Name  } : null)
									, (ea.Approver4__r  ? { id : ea.Approver4__r.Id , name : ea.Approver4__r.Name  } : null)
									, (ea.Approver5__r  ? { id : ea.Approver5__r.Id , name : ea.Approver5__r.Name  } : null)
									, (ea.Approver6__r  ? { id : ea.Approver6__r.Id , name : ea.Approver6__r.Name  } : null)
									, (ea.Approver7__r  ? { id : ea.Approver7__r.Id , name : ea.Approver7__r.Name  } : null)
									, (ea.Approver8__r  ? { id : ea.Approver8__r.Id , name : ea.Approver8__r.Name  } : null)
									, (ea.Approver9__r  ? { id : ea.Approver9__r.Id , name : ea.Approver9__r.Name  } : null)
									, (ea.Approver10__r ? { id : ea.Approver10__r.Id, name : ea.Approver10__r.Name } : null)
									]
		};
		if(o.applyType == '勤務確定'){
			o.startDate = null;
			o.endDate   = null;
		}
		applys.push(o);
	}
	return applys;
};

/**
 * 勤怠申請情報変換.
 *
 * @param {Object} empApply 勤怠申請オブジェクト
 */
teasp.logic.convert.convEmpMonthApplyObjs = function(empApply){
	teasp.logic.convert.excludeNameSpace(empApply);
	return empApply ? {
		id                       : empApply.Id,
		yearMonth                : empApply.YearMonth__c,
		status                   : empApply.Status__c,
		close                    : empApply.Close__c,
		applyType                : empApply.ApplyType__c,
		applyTime                : teasp.logic.convert.valDateTime(empApply.ApplyTime__c)
	} : null;
};

/**
 * 行動情報変換.
 *
 * @param {Array.<Object>} events 行動オブジェクトの配列
 */
teasp.logic.convert.convEvents = function(events){
	var sfcals = [];
	if(!events){
		return sfcals;
	}
	teasp.logic.convert.excludeNameSpace(events);
	for(var i = 0 ; i < events.length ; i++){
		var sc = events[i];
		sfcals.push({
			id                      : sc.id,
			startDateTime           : teasp.logic.convert.valDateTime(sc.StartDateTime),
			endDateTime             : teasp.logic.convert.valDateTime(sc.EndDateTime),
			subject                 : sc.Subject,
			isAllDayEvent           : sc.IsAllDayEvent,
			description             : sc.Description,
			what                    : sc.what
		});
	}
	sfcals = sfcals.sort(function(a, b){
		if(a.isAllDayEvent && !b.isAllDayEvent){
			return -1;
		}else if(!a.isAllDayEvent && b.isAllDayEvent){
			return 1;
		}else if(a.isAllDayEvent && b.isAllDayEvent){
			return 0;
		}
		return (a.startDateTime < b.startDateTime) ? -1 : 1;
	});
	return sfcals;
};

/**
 * 行動ログ変換.
 *
 * @param {Object} txsLogs 行動オブジェクトの配列
 */
teasp.logic.convert.convTxsLogs = function(txsLogs){
	var lst = [];
	if(!txsLogs || !txsLogs.logs){
		return lst;
	}
	teasp.logic.convert.excludeNameSpace(txsLogs);
	var logs = txsLogs.logs;
	for(var i = 0 ; i < logs.length ; i++){
		var log = logs[i];
		lst.push({
			id          : log.Id,
			targetTime  : teasp.logic.convert.valDateTimeObj(log.TargetTime__c),
			endTime     : teasp.logic.convert.valDateTimeObj(log.endTime__c),
			stauts      : log.Status__c,
			target      : (log.TargetId__c ? txsLogs[log.TargetId__c] : null)
		});
	}
	return lst;
};

/**
 * カレンダーサービス情報変換
 *
 * @param {String} accessService 利用しているカレンダーサービス
 */
teasp.logic.convert.convCalAccessService = function(accessService){
	var service;
	if(!accessService){
		return service;
	}
	teasp.logic.convert.excludeNameSpace(accessService);
	service = accessService;
	return service;
}

/**
 * 外部カレンダーステータス情報変換
 *
 * @param {Object} authResult 利用しているカレンダーサービスのデータ取得ステータス
 */
teasp.logic.convert.convCalAuthResult = function(authResult){
	if(authResult){
		teasp.logic.convert.excludeNameSpace(authResult);
	}
	return authResult;
}

/**
 * お知らせ情報変換.
 *
 * @param {Array.<Object>} infos お知らせオブジェクトの配列
 */
teasp.logic.convert.convInfoObjs = function(infos){
	teasp.logic.convert.excludeNameSpace(infos);
	var infs = [];
	for(var i = 0 ; i < infos.length ; i++){
		var io = infos[i];
		infs.push({
			id                      : io.Id,
			createdDate             : teasp.logic.convert.valDateTime(io.CreatedDate),
			text                    : io.Text__c,
			agree                   : io.Agree__c
		});
	}
	return infs;
};

/**
 * ジョブアサイン情報変換.
 *
 * @param {Array.<Object>} jobAssigns ジョブアサインオブジェクトの配列
 */
teasp.logic.convert.convJobAssignObjs = function(jobAssigns){
	teasp.logic.convert.excludeNameSpace(jobAssigns);
	var jobs = [];
	for(var i = 0 ; i < jobAssigns.length ; i++){
		var jo = jobAssigns[i];
		jobs.push({
			id                      : jo.Id,
			jobId                   : (jo.JobId__r ? jo.JobId__r.Id : null),
			job                     : {
				code                : jo.JobId__r.JobCode__c,
				name                : jo.JobId__r.Name,
				deptId              : jo.JobId__r.DeptId__c,
				deptCode            : (jo.JobId__r.DeptId__r && jo.JobId__r.DeptId__r.DeptCode__c || null),
				deptName            : (jo.JobId__r.DeptId__r && jo.JobId__r.DeptId__r.Name || null),
				startDate           : teasp.logic.convert.valDate(jo.JobId__r.StartDate__c),
				endDate             : teasp.logic.convert.valDate(jo.JobId__r.EndDate__c),
				assignLimit         : jo.JobId__r.AssignLimit__c,
				accountId           : jo.JobId__r.AccountId__c,
				jobLeaderId         : jo.JobId__r.JobLeaderId__c,
				jobLeader           : (jo.JobId__r.JobLeaderId__r ? jo.JobId__r.JobLeaderId__r.Name : ''),
				explain             : jo.JobId__r.Explain__c,
				active              : jo.JobId__r.Active__c,
				jobAssignClass      : (jo.JobId__r.JobAssignClass__c || null),
				processList         : jo.JobId__r.ProcessList__c
			},
			isAssigned              : jo.IsAssigned__c,
			order                   : (jo.Order__c || 0),
			process                 : jo.Process__c?jo.Process__c:null
		});
	}
	return jobs;
};

/**
 * 工数実績情報変換.
 *
 * @param {Array.<Object>} empWorks 工数実績オブジェクトの配列
 */
teasp.logic.convert.convWorkObjs = function(empWorks){
	teasp.logic.convert.excludeNameSpace(empWorks);
	var works = [];
	for(var i = 0 ; i < empWorks.length ; i++){
		var wk = empWorks[i];
		works.push({
			id                      : wk.Id,
			date                    : teasp.logic.convert.valDate(wk.EmpDayId__r.Date__c),
			jobId                   : wk.JobId__r.Id,
			job                     : {
				code                : wk.JobId__r.JobCode__c,
				name                : wk.JobId__r.Name,
				deptId              : wk.JobId__r.DeptId__c,
				deptCode            : (wk.JobId__r.DeptId__r && wk.JobId__r.DeptId__r.DeptCode__c || null),
				deptName            : (wk.JobId__r.DeptId__r && wk.JobId__r.DeptId__r.Name || null),
				startDate           : teasp.logic.convert.valDate(wk.JobId__r.StartDate__c),
				endDate             : teasp.logic.convert.valDate(wk.JobId__r.EndDate__c),
				assignLimit         : wk.JobId__r.AssignLimit__c,
				accountId           : wk.JobId__r.AccountId__c,
				jobLeaderId         : wk.JobId__r.JobLeaderId__c,
				jobLeader           : (wk.JobId__r.JobLeaderId__r)?wk.JobId__r.JobLeaderId__r.Name:'',
				explain             : wk.JobId__r.Explain__c,
				active              : wk.JobId__r.Active__c
			},
			jobApply                : {
				id                  : wk.JobApplyId__c,
				yearMonth           : (wk.JobApplyId__r ? wk.JobApplyId__r.YearMonth__c : null),
				subNo               : ((wk.JobApplyId__r && wk.JobApplyId__r.SubNo__c) || null),
				status              : (wk.JobApplyId__r ? wk.JobApplyId__r.Status__c : null),
				startDate           : (wk.JobApplyId__r ? teasp.logic.convert.valDate(wk.JobApplyId__r.StartDate__c) : null),
				endDate             : (wk.JobApplyId__r ? teasp.logic.convert.valDate(wk.JobApplyId__r.EndDate__c) : null)
			},
			volume                  : wk.Volume__c,
			percent                 : wk.Percent__c,
			time                    : wk.CalcTime__c,
			timeFix                 : wk.TimeFix__c,
			taskNote                : (wk.TaskNote__c || null),
			progress                : (wk.Progress__c || null),
			process                 : (wk.Process__c || null),
			extraItem1              : (wk.ExtraItem1__c || null),
			extraItem2              : (wk.ExtraItem2__c || null),
			extraItem1Name          : (wk.ExtraItem1Name__c || null),
			extraItem2Name          : (wk.ExtraItem2Name__c || null),
			order                   : (wk.Order__c || 0)
		});
	}
	return works;
};

/**
 * メンバー制限のないジョブ情報変換.
 *
 * @param {Array.<Object>} jobs ジョブオブジェクトの配列
 */
teasp.logic.convert.convUnlimitedJobObjs = function(jobs){
	teasp.logic.convert.excludeNameSpace(jobs);
	var lst = [];
	for(var i = 0 ; i < jobs.length ; i++){
		var job = jobs[i];
		lst.push({
			jobId               : job.Id,
			jobCode             : job.JobCode__c,
			jobName             : job.Name,
			deptId              : job.DeptId__c,
			deptCode            : (job.DeptId__r && job.DeptId__r.DeptCode__c || null),
			deptName            : (job.DeptId__r && job.DeptId__r.Name || null),
			startDate           : teasp.logic.convert.valDate(job.StartDate__c),
			endDate             : teasp.logic.convert.valDate(job.EndDate__c),
			assignLimit         : job.AssignLimit__c,
			accountId           : job.AccountId__c,
			jobLeaderId         : job.JobLeaderId__c,
			jobLeader           : (job.JobLeaderId__r)?job.JobLeaderId__r.Name:'',
			explain             : (job.Explain__c || ''),
			active              : job.Active__c,
			assignLimit         : job.AssignLimit__c,
			assignSelf          : (job.JobR1__r && job.JobR1__r.length),
			jobAssignClass      : job.JobAssignClass__c,
			processList         : job.ProcessList__c
		});
	}
	return lst;
};

/**
 * 経費情報変換.
 *
 * @param {Array.<Object>} empExps 経費オブジェクトの配列
 */
teasp.logic.convert.convExpLogObjs = function(empExps){
	teasp.logic.convert.excludeNameSpace(empExps);
	var expLogs = [];
	for(var i = 0 ; i < empExps.length ; i++){
		var ex = empExps[i];
		expLogs.push({
			id                        : ex.Id,
			date                      : teasp.logic.convert.valDate(ex.Date__c),
			jobId                     : (ex.JobId__r ? ex.JobId__r.Id : null),
			job                       : (ex.JobId__r ? {
				code                  : ex.JobId__r.JobCode__c,
				name                  : ex.JobId__r.Name
			} : null),
			expApplyId                : (ex.ExpApplyId__r ? ex.ExpApplyId__r.Id : null),
			expApply                  : (ex.ExpApplyId__r ? {
				id                    : ex.ExpApplyId__r.Id,
				expApplyNo            : ex.ExpApplyId__r.ExpApplyNo__c,
				status                : ex.ExpApplyId__r.Status__c
			} : null),
			expItemId                 : (ex.ExpItemId__r ? ex.ExpItemId__r.Id : null),
			expItem                   : (ex.ExpItemId__r ? {
				id                    : ex.ExpItemId__r.Id,
				code                  : ex.ExpItemId__r.Code__c,
				note                  : ex.ExpItemId__r.Note__c,
				itemName              : ex.ExpItemId__r.ItemName__c,
				name                  : ex.ExpItemId__r.Name,
				cost                  : ex.ExpItemId__r.Cost__c,
				receipt               : ex.ExpItemId__r.Receipt__c,
				useExtraItem1         : ex.ExpItemId__r.UseExtraItem1__c,
				useExtraItem2         : ex.ExpItemId__r.UseExtraItem2__c,
				extraItem1Name        : (ex.ExpItemId__r.ExtraItem1Name__c || teasp.message.getLabel('tk10005100')), // (未使用)
				extraItem2Name        : (ex.ExpItemId__r.ExtraItem2Name__c || teasp.message.getLabel('tk10005100')), // (未使用)
				extraItem1Width       : ex.ExpItemId__r.ExtraItem1Width__c,
				extraItem2Width       : ex.ExpItemId__r.ExtraItem2Width__c,
				extraItem1LimitLength : ex.ExpItemId__r.ExtraItem1LimitLength__c,
				extraItem2LimitLength : ex.ExpItemId__r.ExtraItem2LimitLength__c,
				transportType         : teasp.logic.convert.valNumber(ex.ExpItemId__r.TransportType__c),
				foreignFlag           : ex.ExpItemId__r.ForeignFlag__c,
				removed               : ex.ExpItemId__r.Removed__c,
				enableQuantity        : ex.ExpItemId__r.EnableQuantity__c || false,
				unitName              : ex.ExpItemId__r.UnitName__c || ''
			} : null),
			foreignFlag               : (!ex.CurrencyName__c ? false : true),
			currencyName              : (ex.CurrencyName__c  || null),
			currencyRate              : (ex.CurrencyRate__c  || 0),
			foreignAmount             : (ex.ForeignAmount__c || 0),

			taxFlag                   : (ex.ExpItemId__r.TaxFlag__c || false),
			tax                       : (ex.Tax__c        || 0),
			taxAuto                   : (typeof(ex.TaxAuto__c) == 'boolean' ? ex.TaxAuto__c : true),
			taxType                   : (ex.TaxType__c    || '0'),
			withoutTax                : (ex.WithoutTax__c || 0),

			startName                 : (ex.startName__c  || null),
			startCode                 : (ex.startCode__c  || null),
			endName                   : (ex.endName__c    || null),
			endCode                   : (ex.endCode__c    || null),
			cost                      : (ex.Cost__c       || 0),
			receipt                   : (ex.Receipt__c    || false),
			roundTrip                 : (ex.roundTrip__c  || false),
			transportType             : teasp.logic.convert.valNumber(ex.TransportType__c),
			detail                    : (ex.Detail__c     || null),
			route                     : (ex.Route__c      || null),
			extraItem1                : (ex.ExtraItem1__c || null),
			extraItem2                : (ex.ExtraItem2__c || null),
			useExtraItem1             : (ex.ExtraItem1__c ? true : false),
			useExtraItem2             : (ex.ExtraItem2__c ? true : false),
			item                      : (ex.Item__c || null),
			icInfo                    : function(item, cost, sn, en){
											if(teasp.constant.IC_INPUTS.contains(item) && cost){
												return {
													item  : item,
													cost  : (cost || 0),
													start : (sn || null),
													end   : (en || null)
												};
											}else{
												return null;
											}
										}(ex.Item__c, ex.Cost__c, ex.startName__c, ex.endName__c),
			order                     : (ex.Order__c      || 0),
			attachments               : (ex.Attachments && ex.Attachments.length > 0 ? [{
											id          : ex.Attachments[0].Id,
											name        : ex.Attachments[0].Name,
											contentType : ex.Attachments[0].ContentType
										}] : null),
			unitPrice                 : ex.UnitPrice__c   || null,
			quantity                  : ex.Quantity__c    || null,
			paymentDate               : teasp.logic.convert.valDate(ex.PaymentDate__c),
			isPaid                    : ex.IsPaid__c      || null,
			payeeId                   : ex.PayeeId__c     || null,
			payee                     : (ex.PayeeId__r ? {
				name                  : ex.PayeeId__r.Name || '',
				payeeType             : ex.PayeeId__r.PayeeType__c
			} : null),
			chargeDept                : (ex.ChargeDeptId__r ? {
				id                    : ex.ChargeDeptId__c || null,
				code                  : ex.ChargeDeptId__r.DeptCode__c || '',
				name                  : ex.ChargeDeptId__r.Name || ''
			} : null),
			cardStatementLineId       : ex.CardStatementLineId__c || null,
			cardStatementLine         : (ex.CardStatementLineId__r ? {
				recordTypeName        : (ex.CardStatementLineId__r.RecordType && ex.CardStatementLineId__r.RecordType.Name || '')
			} : null)
		});
	}
	return expLogs;
};

/**
 * 経費申請情報変換.
 *
 * @param {Array.<Object>} orgs 経費申請オブジェクトの配列
 */
teasp.logic.convert.convExpApplyObjs = function(orgs){
	teasp.logic.convert.excludeNameSpace(orgs);
	var lst = [];
	for(var i = 0 ; i < orgs.length ; i++){
		var o = orgs[i];
		lst.push({
			id                       : o.Id,
			expApplyNo               : o.ExpApplyNo__c,
			deptId                   : o.DeptId__c,
			deptCode                 : (o.DeptCode__c || ''),
			deptName                 : (o.DeptName__c || ''),
			status                   : o.Status__c,
			comment                  : o.Comment__c,
			applyTime                : teasp.logic.convert.valDateTime(o.ApplyTime__c),
			approveTime              : teasp.logic.convert.valDateTime(o.ApproveTime__c),
			approverName             : (o.ApproverId__r ? o.ApproverId__r.Name : ''),
			payDate                  : teasp.logic.convert.valDate(o.payDate__c),
			totalCost                : (o.TotalCost__c      || 0),
			amountDueToPay           : (o.AmountDueToPay__c || 0),
			expPreApplyId            : (o.ExpPreApplyId__c || null),
			provisionalPaymentAmount : (o.ProvisionalPaymentAmount__c || 0),
			expPreApplyNo            : ((o.ExpPreApplyId__r && o.ExpPreApplyId__r.ExpPreApplyNo__c) || null),
			expPreApplyTitle         : ((o.ExpPreApplyId__r && o.ExpPreApplyId__r.Title__c) || null),
			expPreApplyPpAmount      : ((o.ExpPreApplyId__r && o.ExpPreApplyId__r.ProvisionalPaymentAmount__c) || 0),
			statusC                  : (o.StatusC__c || null),
			statusD                  : (o.StatusD__c || null),
			expenseType              : o.ExpenseType__c,
			payExpItemId             : o.PayExpItemId__c,
			payExpItemName           : (o.PayExpItemId__r && o.PayExpItemId__r.Name || null),
			applyDate                : teasp.logic.convert.valDate(o.ApplyDate__c),
			provisionalPaymentId     : o.ProvisionalPaymentId__c,
			provisionalPaymentTitle  : (o.ProvisionalPaymentId__r && o.ProvisionalPaymentId__r.Title__c || ''),
			extraItem1               : o.ExtraItem1__c,
			extraItem2               : o.ExtraItem2__c,
			chargeDeptId             : o.ChargeDeptId__c,
			chargeDeptCode           : (o.ChargeDeptId__r && o.ChargeDeptId__r.DeptCode__c || ''),
			chargeDeptName           : (o.ChargeDeptId__r && o.ChargeDeptId__r.Name        || ''),
			chargeJobId              : o.ChargeJobId__c,
			chargeJobCode            : (o.ChargeJobId__r && o.ChargeJobId__r.JobCode__c || ''),
			chargeJobName            : (o.ChargeJobId__r && o.ChargeJobId__r.Name       || ''),
			expCancelApplyId         : o.ExpCancelApplyId__c,
			expCancelApplyStatus     : (o.ExpCancelApplyId__r && o.ExpCancelApplyId__r.Status__c || ''),
			expCancelApproveTime     : teasp.logic.convert.valDateTime(o.ExpCancelApplyId__r && o.ExpCancelApplyId__r.ApproveTime__c || null),
			expCancelApproverName    : (o.ExpCancelApplyId__r && o.ExpCancelApplyId__r.ApproverId__r && o.ExpCancelApplyId__r.ApproverId__r.Name || ''),
			ringi                    : o.ApplyId__r ? {
				id                   : o.ApplyId__r.Id,
				applyNo              : o.ApplyId__r.ApplicationNo__c,
				type                 : o.ApplyId__r.Type__c,
				name                 : o.ApplyId__r.Name,
				applicationDate      : teasp.logic.convert.valDate(o.ApplyId__r.ApplicationDate__c),
				ownerId              : o.ApplyId__r.Owner.Id,
				ownerName            : o.ApplyId__r.Owner.Name,
				status               : o.ApplyId__r.Status__c,
				amount               : o.ApplyId__r.Amount__c
			} : null,
			attachments              : o.Attachments || []
		});
	}
	return lst;
};

/**
 * 費目情報変換.
 *
 * @param {Array.<Object>} expItems 費目オブジェクトの配列
 */
teasp.logic.convert.convExpItemObjs = function(expItems){
	teasp.logic.convert.excludeNameSpace(expItems);
	var items = [];
	for(var i = 0 ; i < expItems.length ; i++){
		var ei = expItems[i];
		items.push({
			id                  : ei.Id,
			code                : ei.Code__c,
			note                : ei.Note__c,
			itemName            : ei.ItemName__c,
			name                : ei.Name,
			cost                : ei.Cost__c,
			receipt             : ei.Receipt__c,
			transportType       : teasp.logic.convert.valNumber(ei.TransportType__c),
			removed             : ei.Removed__c,
			order               : (ei.Order__c || 0),
			foreignFlag         : ei.ForeignFlag__c,
			taxFlag             : ei.TaxFlag__c,
			taxAuto             : true,
			taxType             : (ei.TaxType__c  || '1'),
			taxCode             : (ei.TaxCode__c  || null),
			auxCode             : (ei.AuxCode__c  || null),
			auxTitle            : (ei.AuxTitle__c || null),
			fixAmount           : ei.FixAmount__c,
			allowMinus          : ei.AllowMinus__c,
			group               : (ei.Group__c    || null),
			forAdjustment       : ei.ForAdjustment__c,
			useExtraItem1       : ei.UseExtraItem1__c,
			useExtraItem2       : ei.UseExtraItem2__c,
			extraItem1Name       : (ei.ExtraItem1Name__c||'(未使用)'),
			extraItem2Name       : (ei.ExtraItem2Name__c||'(未使用)'),
			extraItem1Width      : (ei.ExtraItem1Width__c||null),
			extraItem2Width      : (ei.ExtraItem2Width__c||null),
			extraItem1LimitLength: (ei.ExtraItem1LimitLength__c||null),
			extraItem2LimitLength: (ei.ExtraItem2LimitLength__c||null),
			enableQuantity       : ei.EnableQuantity__c || false,
			unitName             : ei.UnitName__c || ''

		});
	}
	items = items.sort(function(a, b){
		return (a.order - b.order);
	});
	return items;
};

/**
 * 外貨情報変換.
 *
 * @param {Array.<Object>} foreignCurrency 外貨情報オブジェクトの配列
 */
teasp.logic.convert.convForeignCurrencyObjs  = function(foreignCurrency){//ch todo
	teasp.logic.convert.excludeNameSpace(foreignCurrency);
	var items = [];
	for(var i = 0 ; i < foreignCurrency.length ; i++){
		var fc = foreignCurrency[i];
		items.push({
			id                  : fc.Id,
			name                : fc.Name,
			yomi                : fc.Yomi__c,
			rate                : fc.Rate__c,
			removed             : fc.Removed__c
		});
	}
	items = items.sort(function(a, b){
		return (a.order - b.order);
	});
	return items;
};
/**
 * 有休残日数情報変換.
 *
 * @param {Array.<Object>} yuqRemains 有休残日数オブジェクトの配列
 */
teasp.logic.convert.convYuqRemainObjs = function(yuqRemains){
	teasp.logic.convert.excludeNameSpace(yuqRemains);
	var yuqs = [];
	for(var i = 0 ; i < yuqRemains.length ; i++){
		var yq = yuqRemains[i];
		var o = {
			id                  : yq.Id,
			baseTime            : yq.BaseTime__c,
			subject             : yq.Subject__c,
			createdDate         : teasp.logic.convert.valDateTime(yq.CreatedDate),
			date                : teasp.logic.convert.valDate(yq.Date__c),
			startDate           : teasp.logic.convert.valDate(yq.StartDate__c),
			limitDate           : teasp.logic.convert.valDate(yq.LimitDate__c),
			tempFlag            : yq.TempFlag__c,
			autoFlag            : yq.AutoFlag__c,
			provideDays         : 0,
			provideTime         : 0,
			spendDays           : 0,
			spendTime           : 0,
			remainDays          : 0,
			remainTime          : 0,
			remainMinutes       : 0,
			children            : []
		};
		for(var j = 0 ; j < yq.EmpYuqGroupR__r.length ; j++){
			var yr = yq.EmpYuqGroupR__r[j];
			if(yr.Time__c > 0 || yr.lostFlag){
				o.provideTime += yr.Time__c;
			}else{
				o.spendTime += yr.Time__c;
			}
			o.children.push({
				date        : teasp.logic.convert.valDate(yr.EmpYuqId__r.Date__c),
				time        : yr.Time__c,
				empApplyId  : (yr.EmpYuqId__r.EmpApplyId__c || null),
				lostFlag    : yr.EmpYuqId__r.LostFlag__c,
				startDate   : (yr.EmpYuqId__r.EmpApplyId__r ? teasp.logic.convert.valDate(yr.EmpYuqId__r.EmpApplyId__r.StartDate__c)   : null),
				endDate     : (yr.EmpYuqId__r.EmpApplyId__r ? teasp.logic.convert.valDate(yr.EmpYuqId__r.EmpApplyId__r.EndDate__c)     : null),
				excludeDate : (yr.EmpYuqId__r.EmpApplyId__r ? yr.EmpYuqId__r.EmpApplyId__r.ExcludeDate__c : null)
			});
		}
		o.remainTime = o.provideTime + o.spendTime;

		var pd = o.provideTime / o.baseTime;
		o.provideDays = Math.floor(pd * 2) / 2;
		o.provideTime -= (o.provideDays * o.baseTime);

		o.spendTime *= (-1);
		var sd = o.spendTime / o.baseTime;
		o.spendDays = Math.floor(sd * 2) / 2;
		o.spendTime -= (o.spendDays * o.baseTime);

		var rd = o.remainTime / o.baseTime;
		o.remainMinutes = o.remainTime;
		o.remainDays = Math.floor(rd * 2) / 2;
		o.remainTime -= (o.remainDays * o.baseTime);

		yuqs.push(o);
	}
	return yuqs;
};

/**
 * 積休情報変換.
 *
 * @param {Array.<Object>} stocks 勤怠積休オブジェクトの配列
 */
teasp.logic.convert.convStockObjs = function(stocks){
	teasp.logic.convert.excludeNameSpace(stocks);
	var lst = [];
	for(var i = 0 ; i < stocks.length ; i++){
		var stock = stocks[i];
		var o = {
			id              : stock.Id,
			name            : stock.Name,
			createdDate     : teasp.logic.convert.valDateTime(stock.CreatedDate),
			type            : stock.Type__c,
			lostFlag        : stock.LostFlag__c || false,
			date            : teasp.logic.convert.valDate(stock.Date__c),
			startDate       : teasp.logic.convert.valDate(stock.StartDate__c),
			limitDate       : teasp.logic.convert.valDate(stock.LimitDate__c),
			days            : (new Decimal(stock.Days__c || 0)).plus(new Decimal(stock.Hours__c || 0)).toNumber(),
			consumedDays    : (stock.ConsumedDays__c ? parseFloat(stock.ConsumedDays__c) : 0),
			remainDays      : (stock.RemainDaysAndHours__c   ? parseFloat(stock.RemainDaysAndHours__c  ) : 0),
			workRealTime    : (typeof(stock.WorkRealTime__c) == 'number' ? stock.WorkRealTime__c : null),
			timeUnit        : (!stock.Days__c && stock.Hours__c != 0),
			baseTime        : stock.BaseTime__c,
			consumers       : function(){
				var l = [];
				if(stock.Consumers__r){
					for(var m = 0 ; m < stock.Consumers__r.length ; m++){
						var d = stock.Consumers__r[m];
						l.push({
							id                : d.Id,
							cdays             : (new Decimal(d.Days__c || 0)).plus(new Decimal(d.Hours__c || 0)).toNumber(),
							consumedByStockId : d.ConsumedByStockId__c,
							name              : (d.ConsumedByStockId__r && d.ConsumedByStockId__r.Name || ''),
							lostFlag          : (d.ConsumedByStockId__r && d.ConsumedByStockId__r.LostFlag__c || false),
							date              : (d.ConsumedByStockId__r && teasp.logic.convert.valDate(d.ConsumedByStockId__r.Date__c) || null),
							days              : (new Decimal(d.ConsumedByStockId__r && d.ConsumedByStockId__r.Days__c  || 0))
							                  .plus(new Decimal(d.ConsumedByStockId__r && d.ConsumedByStockId__r.Hours__c || 0)).toNumber(),
							startDate         : (d.ConsumedByStockId__r && teasp.logic.convert.valDate(d.ConsumedByStockId__r.StartDate__c) || null),
							limitDate         : (d.ConsumedByStockId__r && teasp.logic.convert.valDate(d.ConsumedByStockId__r.LimitDate__c) || null),
							empApplyId        : (d.ConsumedByStockId__r && d.ConsumedByStockId__r.EmpApplyId__c || null),
							applyType         : (d.ConsumedByStockId__r && d.ConsumedByStockId__r.EmpApplyId__r && d.ConsumedByStockId__r.EmpApplyId__r.ApplyType__c || null),
							status            : (d.ConsumedByStockId__r && d.ConsumedByStockId__r.EmpApplyId__r && d.ConsumedByStockId__r.EmpApplyId__r.Status__c    || null),
							close             : (d.ConsumedByStockId__r && d.ConsumedByStockId__r.EmpApplyId__r && d.ConsumedByStockId__r.EmpApplyId__r.Close__c     || null),
							applyTime         : (d.ConsumedByStockId__r && d.ConsumedByStockId__r.EmpApplyId__r && teasp.logic.convert.valDateTime(d.ConsumedByStockId__r.EmpApplyId__r.ApplyTime__c) || null),
							holidayId         : (d.ConsumedByStockId__r && d.ConsumedByStockId__r.EmpApplyId__r && d.ConsumedByStockId__r.EmpApplyId__r.HolidayId__c || null),
							holidayName       : (d.ConsumedByStockId__r && d.ConsumedByStockId__r.EmpApplyId__r && d.ConsumedByStockId__r.EmpApplyId__r.HolidayId__r && d.ConsumedByStockId__r.EmpApplyId__r.HolidayId__r.Name || null),
							holidayType       : (d.ConsumedByStockId__r && d.ConsumedByStockId__r.EmpApplyId__r && d.ConsumedByStockId__r.EmpApplyId__r.HolidayId__r && d.ConsumedByStockId__r.EmpApplyId__r.HolidayId__r.Type__c || null),
							holidayRange      : (d.ConsumedByStockId__r && d.ConsumedByStockId__r.EmpApplyId__r && d.ConsumedByStockId__r.EmpApplyId__r.HolidayId__r && d.ConsumedByStockId__r.EmpApplyId__r.HolidayId__r.Range__c || null),
							timeUnit          : (d.ConsumedByStockId__r && !d.ConsumedByStockId__r.Days__c && d.ConsumedByStockId__r.Hours__c != 0),
							baseTime          : (d.ConsumedByStockId__r && (d.ConsumedByStockId__r.BaseTime || 0))
						});
					}
				}
				return l;
			}(),
			apply                         : (stock.EmpApplyId__r ? {
				id                        : stock.EmpApplyId__r.Id,
				status                    : stock.EmpApplyId__r.Status__c,
				applyType                 : stock.EmpApplyId__r.ApplyType__c,
				close                     : stock.EmpApplyId__r.Close__c,
				holiday                   : (stock.EmpApplyId__r.HolidayId__r ? {
					name                  : stock.EmpApplyId__r.HolidayId__r.Name,
					type                  : stock.EmpApplyId__r.HolidayId__r.Type__c,
					range                 : stock.EmpApplyId__r.HolidayId__r.Range__c,
					displayDaysOnCalendar : stock.EmpApplyId__r.HolidayId__r.DisplayDaysOnCalendar__c,
					yuqSpend              : stock.EmpApplyId__r.HolidayId__r.YuqSpend__c
				} : null)
			} : null)
		};
		lst.push(o);
	}
	return lst;
};

/**
 * 勤務体系毎勤務パターン情報変換.
 *
 * @param {Array.<Object>} empTypePatterns 勤務体系毎勤務パターンオブジェクトの配列
 */
teasp.logic.convert.convEmpTypePatternObjs = function(empTypePatterns){
	teasp.logic.convert.excludeNameSpace(empTypePatterns);
	var patterns = [];
	for(var i = 0 ; i < empTypePatterns.length ; i++){
		var ep = empTypePatterns[i];
		patterns.push({
			id                        : ep.Id,
			schedOption               : ep.SchedOption__c,
			schedMonthlyDate          : (ep.SchedMonthlyDate__c || null),
			schedMonthlyLine          : (ep.SchedMonthlyLine__c || null),
			schedMonthlyWeek          : (ep.SchedMonthlyWeek__c || null),
			schedWeekly               : (ep.SchedWeekly__c || null),
			order                     : (ep.Order__c || 0),
			pattern                   : (ep.PatternId__r ? {
				id                              : ep.PatternId__r.Id,
				name                            : ep.PatternId__r.Name,
				stdStartTime                    : ep.PatternId__r.StdStartTime__c,
				stdEndTime                      : ep.PatternId__r.StdEndTime__c,
				restTimes                       : teasp.util.extractTimes(ep.PatternId__r.RestTimes__c),
				standardFixTime                 : ep.PatternId__r.StandardFixTime__c,
				useHalfHoliday                  : ep.PatternId__r.UseHalfHoliday__c,
				amHolidayStartTime              : ep.PatternId__r.AmHolidayStartTime__c,
				amHolidayEndTime                : ep.PatternId__r.AmHolidayEndTime__c,
				pmHolidayStartTime              : ep.PatternId__r.PmHolidayStartTime__c,
				pmHolidayEndTime                : ep.PatternId__r.PmHolidayEndTime__c,
				useDiscretionary                : ep.PatternId__r.UseDiscretionary__c,
				igonreNightWork                 : ep.PatternId__r.IgonreNightWork__c,
				range                           : ep.PatternId__r.Range__c,
				prohibitChangeExchangedWorkTime : ep.PatternId__r.ProhibitChangeExchangedWorkTime__c,
				prohibitChangeHolidayWorkTime   : ep.PatternId__r.ProhibitChangeHolidayWorkTime__c,
				prohibitChangeWorkTime          : ep.PatternId__r.ProhibitChangeWorkTime__c,
				enableRestTimeShift             : ep.PatternId__r.EnableRestTimeShift__c,
				workTimeChangesWithShift        : ep.PatternId__r.WorkTimeChangesWithShift__c,
				disableCoreTime                 : ep.PatternId__r.DisableCoreTime__c,
				useHalfHolidayRestTime          : ep.PatternId__r.UseHalfHolidayRestTime__c,
				amHolidayRestTimes              : teasp.util.extractTimes(ep.PatternId__r.AmHolidayRestTimes__c),
				pmHolidayRestTimes              : teasp.util.extractTimes(ep.PatternId__r.PmHolidayRestTimes__c)
			} : null)
		});
	}
	patterns = patterns.sort(function(a, b){
		return (a.order - b.order);
	});
	return patterns;
};

/**
 * 勤務パターン情報変換.
 *
 * @param {Array.<Object>} empTypePatterns 勤務パターンオブジェクトの配列
 */
teasp.logic.convert.convPatternObjs = function(empTypePatterns){
	teasp.logic.convert.excludeNameSpace(empTypePatterns);
	var patterns = [];
	for(var i = 0 ; i < empTypePatterns.length ; i++){
		var ep = empTypePatterns[i];
		if(ep.PatternId__r){
			patterns.push({
				id                              : ep.PatternId__r.Id,
				name                            : ep.PatternId__r.Name,
				stdStartTime                    : ep.PatternId__r.StdStartTime__c,
				stdEndTime                      : ep.PatternId__r.StdEndTime__c,
				restTimes                       : teasp.util.extractTimes(ep.PatternId__r.RestTimes__c),
				standardFixTime                 : ep.PatternId__r.StandardFixTime__c,
				useHalfHoliday                  : ep.PatternId__r.UseHalfHoliday__c,
				amHolidayStartTime              : ep.PatternId__r.AmHolidayStartTime__c,
				amHolidayEndTime                : ep.PatternId__r.AmHolidayEndTime__c,
				pmHolidayStartTime              : ep.PatternId__r.PmHolidayStartTime__c,
				pmHolidayEndTime                : ep.PatternId__r.PmHolidayEndTime__c,
				useDiscretionary                : ep.PatternId__r.UseDiscretionary__c,
				igonreNightWork                 : ep.PatternId__r.IgonreNightWork__c,
				range                           : ep.PatternId__r.Range__c,
				order                           : (ep.Order__c || 0),
				prohibitChangeExchangedWorkTime : ep.PatternId__r.ProhibitChangeExchangedWorkTime__c,
				prohibitChangeHolidayWorkTime   : ep.PatternId__r.ProhibitChangeHolidayWorkTime__c,
				prohibitChangeWorkTime          : ep.PatternId__r.ProhibitChangeWorkTime__c,
				enableRestTimeShift             : ep.PatternId__r.EnableRestTimeShift__c,
				workTimeChangesWithShift        : ep.PatternId__r.WorkTimeChangesWithShift__c,
				disableCoreTime                 : ep.PatternId__r.DisableCoreTime__c,
				useHalfHolidayRestTime          : ep.PatternId__r.UseHalfHolidayRestTime__c,
				amHolidayRestTimes              : teasp.util.extractTimes(ep.PatternId__r.AmHolidayRestTimes__c),
				pmHolidayRestTimes              : teasp.util.extractTimes(ep.PatternId__r.PmHolidayRestTimes__c)
			});
		}
	}
	patterns = patterns.sort(function(a, b){
		return (a.order - b.order);
	});
	return patterns;
};

/**
 * 休暇情報変換.
 *
 * @param {Array.<Object>} empTypeHolidays 休暇オブジェクトの配列
 */
teasp.logic.convert.convEmpTypeHolidayObjs = function(empTypeHolidays){
	teasp.logic.convert.excludeNameSpace(empTypeHolidays);
	var holidays = [];
	for(var i = 0 ; i < empTypeHolidays.length ; i++){
		var eh = empTypeHolidays[i];
		holidays.push({
			id                    : eh.HolidayId__r.Id,
			name                  : eh.HolidayId__r.Name,
			type                  : eh.HolidayId__r.Type__c,
			range                 : eh.HolidayId__r.Range__c,
			description           : eh.HolidayId__r.Description__c,
			isWorking             : eh.HolidayId__r.IsWorking__c,
			yuqSpend              : eh.HolidayId__r.YuqSpend__c,
			plannedHolida         : eh.HolidayId__r.PlannedHoliday__c,
			managed               : eh.HolidayId__r.Managed__c,
			manageName            : eh.HolidayId__r.ManageName__c,
			displayDaysOnCalendar : eh.HolidayId__r.DisplayDaysOnCalendar__c,
			yuqSpend              : eh.HolidayId__r.YuqSpend__c,
			config                : dojo.fromJson(eh.HolidayId__r.Config__c || '{}'),
			timeUnit              : eh.HolidayId__r.TimeUnit__c,
			order                 : (eh.Order__c || 0)
		});
	}
	holidays = holidays.sort(function(a, b){
		return (a.order - b.order);
	});
	return holidays;
};

/**
 * 定期券区間情報変換.
 *
 * @param {Array.<Object>} commuterPasses 定期券区間情報の配列
 */
teasp.logic.convert.convCommuterPasses = function(commuterPasses){
	teasp.logic.convert.excludeNameSpace(commuterPasses);
	var cps = [];
	for(var i = 0 ; i < commuterPasses.length ; i++){
		var cp = commuterPasses[i];
		cps.push({
			id               : cp.Id,
			name             : cp.Name,
			routeCode        : cp.RouteCode__c,
			routeDescription : cp.RouteDescription__c,
			passFare         : cp.PassFare__c,
			passPeriod       : cp.PassPeriod__c,
			startDate        : teasp.logic.convert.valDate(cp.StartDate__c),
			note             : cp.Note__c,
			status           : cp.Status__c
		});
	}
	return cps;
};

/**
 * 承認履歴情報変換.
 *
 * @param {Array.<Object>} orgs 承認履歴オブジェクトの配列
 */
teasp.logic.convert.convApplySteps = function(orgs){
	teasp.logic.convert.excludeNameSpace(orgs);
	var steps = [];
	for(var i = 0 ; i < orgs.length ; i++){
		var step = orgs[i];
		if(step.StepStatus && step.StepStatus.toLowerCase() == 'noresponse'){
			continue;
		}
		var d = teasp.util.date.longToDate(step.CreatedDate, 1);
		steps.push({
			applyId      : step.ProcessInstance.TargetObjectId,
			actorName    : step.Actor.Name,
			createdDate  : teasp.util.date.formatDateTime(d),
			stepStatus   : teasp.constant.getStepStatus(step.StepStatus),
			comments     : step.Comments
		});
	}
	return steps;
};

/**
 * 勤怠月度集計情報変換.
 *
 * @param {Array.<Object>} orgs 勤怠月度集計オブジェクトの配列
 */
teasp.logic.convert.convEmpMonthObj = function(orgs){
	if(orgs.length <= 0){
		return null;
	}
	teasp.logic.convert.excludeNameSpace(orgs);
	var em = orgs[0];
	return {
		id                       : em.Id,
		lastModifiedDate         : em.LastModifiedDate,
		startDate                : em.StartDate__c,
		endDate                  : em.EndDate__c,
		configId                 : em.ConfigId__c,
		empApplyId               : em.EmpApplyId__c,
		absentCount              : em.AbsentCount__c,
		amountTime               : em.AmountTime__c,
		averageEndTime           : em.AverageEndTime__c,
		averageStartTime         : em.AverageStartTime__c,
		daiqHolidayCount         : em.DaiqHolidayCount__c,
		earlyCount               : em.EarlyCount__c,
		earlyLostTime            : em.EarlyLostTime__c,
		earlyTime                : em.EarlyTime__c,
		holidayDayTime           : em.HolidayDayTime__c,
		holidayNightTime         : em.HolidayNightTime__c,
		lateCount                : em.LateCount__c,
		lateLostTime             : em.LateLostTime__c,
		lateTime                 : em.LateTime__c,
		legalWorkTime            : em.LegalWorkTime__c,
		lostTime                 : em.LostTime__c,
		paidHolidayCount         : em.PaidHolidayCount__c,
		paidRestTime             : em.PaidRestTime__c,
		plannedHolidayCount      : em.PlannedHolidayCount__c,
		privateCount             : em.PrivateCount__c,
		privateInnerCount        : em.PrivateInnerCount__c,
		privateInnerLostTime     : em.PrivateInnerLostTime__c,
		privateInnerTime         : em.PrivateInnerTime__c,
		privateOuterTime         : em.PrivateOuterTime__c,
		totalWorkOverCount36     : em.TotalWorkOverCount36__c,
		totalWorkOverTime36      : em.TotalWorkOverTime36__c,
		weekDayDayLegalExtTime   : em.WeekDayDayLegalExtTime__c,
		weekDayDayLegalFixTime   : em.WeekDayDayLegalFixTime__c,
		weekDayDayLegalOutTime   : em.WeekDayDayLegalOutTime__c,
		weekDayNightLegalExtTime : em.WeekDayNightLegalExtTime__c,
		weekDayNightLegalFixTime : em.WeekDayNightLegalFixTime__c,
		weekDayNightLegalOutTime : em.WeekDayNightLegalOutTime__c,
		weekEndDayLegalOutTime   : em.WeekEndDayLegalOutTime__c,
		weekEndDayLegalTime      : em.WeekEndDayLegalTime__c,
		weekEndNightLegalOutTime : em.WeekEndNightLegalOutTime__c,
		weekEndNightLegalTime    : em.WeekEndNightLegalTime__c,
		workAwayTime             : em.WorkAwayTime__c,
		workChargeTime           : em.WorkChargeTime__c,
		workFixedDay             : em.WorkFixedDay__c,
		workFixedTime            : em.WorkFixedTime__c,
		workHolidayCount         : em.WorkHolidayCount__c,
		workLegalHolidayCount    : em.WorkLegalHolidayCount__c,
		workLegalOutOverTime     : em.WorkLegalOutOverTime__c,
		workLegalOverTime        : em.WorkLegalOverTime__c,
		workNetTime              : em.WorkNetTime__c,
		workOffTime              : em.WorkOffTime__c,
		workOver40perWeek        : em.WorkOver40perWeek__c,
		workOver45Time           : em.WorkOver45Time__c,
		workOver60Time           : em.WorkOver60Time__c,
		workPublicHolidayCount   : em.WorkPublicHolidayCount__c,
		workRealDay              : em.WorkRealDay__c,
		workRealTime             : em.WorkRealTime__c,
		workWholeTime            : em.WorkWholeTime__c
	};
};

/**
 * 勤怠有休情報変換.
 *
 * @param {Array.<Object>} orgs 勤怠有休オブジェクトの配列
 */
teasp.logic.convert.convEmpYuqObj = function(orgs){
	teasp.logic.convert.excludeNameSpace(orgs);
	var lst = [];
	for(var i = 0 ; i < orgs.length ; i++){
		var yq = orgs[i];
		var o = {
			id                       : yq.Id
			, name                     : yq.Name
			, createdDate              : teasp.logic.convert.valDateTime(yq.CreatedDate)
			, lastModifiedDate         : teasp.logic.convert.valDateTime(yq.LastModifiedDate)
			, systemModstamp           : teasp.logic.convert.valDateTime(yq.SystemModstamp)
			, date                     : teasp.logic.convert.valDate(yq.Date__c)
			, subject                  : yq.Subject__c
			, startDate                : teasp.logic.convert.valDate(yq.StartDate__c)
			, limitDate                : teasp.logic.convert.valDate(yq.LimitDate__c)
			, baseTime                 : yq.BaseTime__c
			, autoFlag                 : (yq.AutoFlag__c   || '(null)')
			, batchId                  : (yq.BatchId__c    || '(null)')
			, empApplyId               : (yq.EmpApplyId__c || '(null)')
			, lostFlag                 : (yq.LostFlag__c   || '(null)')
			, oldNextYuqProvideDate    : teasp.logic.convert.valDate(yq.oldNextYuqProvideDate__c)
			, provideDay               : (yq.ProvideDay__c || '(null)')
			, spendDay                 : (yq.SpendDay__c   || '(null)')
			, totalTime                : (yq.TotalTime__c  || '(null)')
			, tempFlag                 : (yq.TempFlag__c   || '(null)')
			, timeUnit                 : (yq.TimeUnit__c   || '(null)')
		};
		lst.push(o);
	}
	return lst;
};

/**
 * 勤怠有休情報変換.
 *
 * @param {Array.<Object>} orgs 勤怠有休オブジェクトの配列
 */
teasp.logic.convert.convEmpYuqDetailObj = function(orgs){
	teasp.logic.convert.excludeNameSpace(orgs);
	var lst = [];
	for(var i = 0 ; i < orgs.length ; i++){
		var yd = orgs[i];
		var o = {
			id                : yd.Id
			, name              : yd.Name
			, createdDate       : teasp.logic.convert.valDateTime(yd.CreatedDate)
			, lastModifiedDate  : teasp.logic.convert.valDateTime(yd.LastModifiedDate)
			, systemModstamp    : teasp.logic.convert.valDateTime(yd.SystemModstamp)
			, empYuqId          : yd.EmpYuqId__c
			, groupId           : yd.GroupId__c
			, days              : yd.Days__c
			, provideDays       : yd.ProvideDays__c
			, spendDays         : yd.SpendDays__c
			, time              : yd.Time__c
			, parent            : yd.EmpYuqId__r ? {
				id            : yd.EmpYuqId__c
				, date          : teasp.logic.convert.valDate(yd.EmpYuqId__r.Date__c)
				, subject       : yd.EmpYuqId__r.Subject__c
				, startDate     : teasp.logic.convert.valDate(yd.EmpYuqId__r.StartDate__c)
				, limitDate     : teasp.logic.convert.valDate(yd.EmpYuqId__r.LimitDate__c)
				, baseTime      : yd.EmpYuqId__r.BaseTime__c
				, empApplyId    : (yd.EmpYuqId__r.EmpApplyId__c || '(null)')
				, lostFlag      : (yd.EmpYuqId__r.LostFlag__c   || '(null)')
				, totalTime     : (yd.EmpYuqId__r.TotalTime__c  || '(null)')
			} : null
		};
		lst.push(o);
	}
	return lst;
};

/**
 * ステータスを承認履歴表示用に変換.
 *
 * @param {string} status ステータス
 * @param {boolean=} flag trueなら'確定取消'→'申請取消'に読み替える
 * @return {string} ステータス
 */
teasp.logic.convert.filterStatus = function(status, flag){
	if(flag && status == '確定取消'){
		return '申請取消';
	}else if(status == '却下済み'){
		return '却下';
	}
	return status;
};

/**
 * ステータスを承認履歴表示用に変換.
 *
 * @param {string} status ステータス
 * @return {string} ステータス
 */
teasp.logic.convert.getStatusType = function(status){
	if(status == '承認待ち'){
		return teasp.constant.getDisplayStatus('申請済み');
	}
	return teasp.constant.getDisplayStatus(status);
};

/**
 * プロセスインスタンスの承認履歴と申請オブジェクトのステータスをマージ
 *
 * @param {Object} org 元データ
 * @param {boolean=} flag
 * @param {boolean=} exflag trueならステータス'確定取消'→'申請取消'に読み替え
 * @return {Array.<Object>} 承認履歴
 */
teasp.logic.convert.convMixApplySteps = function(org, flag, exflag){
	teasp.logic.convert.excludeNameSpace(org);
	var steps = [];
	if(org.steps){
		for(var i = 0 ; i < org.steps.length ; i++){
			var step = org.steps[i];
			if(step.StepStatus && step.StepStatus.toLowerCase() == 'noresponse'){
				continue;
			}
			var t = (step.CreatedDate ? step.CreatedDate : step.LastModifiedDate);
			var d = teasp.util.date.longToDate(t, 1);
			var applyId = (step.ProcessInstance ? step.ProcessInstance.TargetObjectId : step.Id);
			steps.push({
				applyId      : applyId,
				actorName    : (step.StepStatus && step.StepStatus.toLowerCase() == 'noresponse' && step.OriginalActor ? step.OriginalActor.Name : (step.Actor ? step.Actor.Name : (step.LastModifiedBy ? step.LastModifiedBy.Name : ''))),
				createdDate  : teasp.util.date.formatDateTime(d),
				createdDateN : t,
				stepStatus   : (step.StepStatus ? teasp.constant.getStepStatus(step.StepStatus) : teasp.logic.convert.getStatusType(teasp.logic.convert.filterStatus(step.Status__c, exflag))),
				statusType   : teasp.logic.convert.getStatusType(step.StepStatus ? teasp.constant.getStepStatus(step.StepStatus) : teasp.logic.convert.filterStatus(step.Status__c, exflag)),
				stepType     : (step.StepStatus ? 0 : 1),
				comments     : (step.Comments ? step.Comments : (step.Note__c || ''))
			});
			if(step.Log__c && step.Log__c.length > 0){
				var logs = dojo.fromJson('[' + step.Log__c + ']');
				for(var j = 0 ; j < logs.length ; j++){
					var log =logs[j];
					if(!log){
						continue;
					}
					steps.push({
						applyId      : applyId,
						actorName    : log.actorName,
						createdDate  : log.createdDate,
						createdDateN : teasp.util.date.parseDate(log.createdDate).getTime(),
						stepStatus   : teasp.logic.convert.filterStatus(log.stepStatus, exflag),
						statusType   : teasp.logic.convert.getStatusType(log.stepStatus),
						stepType     : 1,
						comments     : log.comments
					});
				}
			}
		}
	}
	steps = steps.sort(function(a, b){
		if(a.createdDateN == b.createdDateN){
			if(a.actorName == b.actorName){
				return (a.stepType - b.stepType);
			}
			return (a.actorName < b.actorName ? -1 : 1);
		}
		return (a.createdDateN - b.createdDateN);
	});
	if(flag){
		return {
			steps : teasp.logic.convert.mergeApplySteps(steps),
			items : (org.items || [])
		};
	}
	return steps;
};

/**
 * 承認履歴のマージ。ステータスが連続したら１つを残して他を削除する。
 *
 * @param {Array.<Object>} steps 承認履歴（複数の申請、履歴の種類が混ざっている）
 * @return {Array.<Object>} 処理済みの承認履歴の配列
 */
teasp.logic.convert.mergeApplySteps = function(lst){
	var steps = lst;
	// 複数の申請が混ざっているので、まず申請ごとに分ける
	var mp = {};
	for(var i = 0 ; i < steps.length ; i++){
		var s = steps[i];
		var l = mp[s.applyId];
		if(!l){
			l = mp[s.applyId] = [];
		}
		l.push(s);
	}
	// 申請毎にダブりを検索
	for(var key in mp){
		var l = mp[key];
		// 単純な連番と、statusType の固まり毎の連番を振る。
		var cn = 1;
		var ix = 1;
		var p = null;
		for(i = 0 ; i < l.length ; i++){
			var s = l[i];
			if(p && p.statusType != s.statusType){
				cn++; // statusType が前行と違う時だけインクリメント
			}
			s._cn = cn;
			s._ix = ix++;
			p = s;
		}
		// 連番でソート、statusType の固まり内では stepType 昇順にする
		l = l.sort(function(a, b){
			if(a._cn == b._cn){
				if(a.stepType == b.stepType){
					return a._ix - b._ix;
				}
				return a.stepType - b.stepType;
			}
			return a._cn - b._cn;
		});
		// 上からなめて、{statusType ＆ 承認者名}または{stepType が異なれば statusType だけ}が連続したら重複フラグをセット
		p = null;
		for(i = 0 ; i < l.length ; i++){
			var s = l[i];
			if(p
			&& p.statusType == s.statusType
			&& (p.actorName == s.actorName || p.stepType != s.stepType)){
				s._dupl = true;
			}else if(s.stepStatus == teasp.message.getLabel('notFix_label')){ // 未確定
				s._none = true;
			}
			p = s;
		}
	}
	// フラグがついたものを配列から削除
	for(i = steps.length - 1 ; i >= 0 ; i--){
		if(steps[i]._dupl || steps[i]._none){
			steps.splice(i, 1);
		}
	}
	return steps;
};

/**
 * 却下の申請情報を変換＆マージ
 *
 * @param {Object} obj 勤怠・経費・工数それぞれの却下申請オブジェクト配列を格納したオブジェクト
 * @return {Array.<Object>} マージ済みの却下申請オブジェクト配列
 */
teasp.logic.convert.convRejectApplyList = function(obj){
	teasp.logic.convert.excludeNameSpace(obj);
	var rejects = [];
	for(var i = 0 ; i < obj.rejectEmpApplys.length ; i++){
		var o = obj.rejectEmpApplys[i];
		rejects.push({
			id         : o.Id,
			objectType : 0,
			status     : o.Status__c,
			applyType  : o.ApplyType__c,
			yearMonth  : o.YearMonth__c,
			subNo      : (o.AtkEmpMonthR1__r && o.AtkEmpMonthR1__r.length ? o.AtkEmpMonthR1__r[0].SubNo__c : null),
			holidayId  : o.HolidayId__c,
			directFlag : o.DirectFlag__c,
			entered    : o.Entered__c,
			yuqSpend   : (o.HolidayId__r ? o.HolidayId__r.YuqSpend__c : false),
			managed    : (o.HolidayId__r ? o.HolidayId__r.Managed__c : false),
			manageName : (o.HolidayId__r ? o.HolidayId__r.ManageName__c : null),
			applyTime  : teasp.logic.convert.valDateTime(o.ApplyTime__c),
			rejectTime : teasp.logic.convert.valDateTimeBiggest((o.ProcessSteps || []), 'CreatedDate'),
			startDate  : teasp.logic.convert.valDate(o.AtkEmpMonthR1__r && o.AtkEmpMonthR1__r.length ? o.AtkEmpMonthR1__r[0].StartDate__c : o.StartDate__c),
			endDate    : teasp.logic.convert.valDate(o.AtkEmpMonthR1__r && o.AtkEmpMonthR1__r.length ? o.AtkEmpMonthR1__r[0].EndDate__c   : o.EndDate__c  )
		});
	}
	for(var i = 0 ; i < obj.rejectExpApplys.length ; i++){
		var o = obj.rejectExpApplys[i];
		rejects.push({
			id         : o.Id,
			objectType : 1,
			status     : o.Status__c,
			applyTime  : teasp.logic.convert.valDateTime(o.ApplyTime__c),
			rejectTime : teasp.logic.convert.valDateTimeBiggest((o.ProcessSteps || []), 'CreatedDate'),
			expApplyNo  : o.ExpApplyNo__c
		});
	}
	for(var i = 0 ; i < obj.rejectJobApplys.length ; i++){
		var o = obj.rejectJobApplys[i];
		rejects.push({
			id         : o.Id,
			objectType : 2,
			status     : o.Status__c,
			yearMonth  : o.YearMonth__c,
			subNo      : o.SubNo__c,
			applyTime  : teasp.logic.convert.valDateTime(o.ApplyTime__c),
			rejectTime : teasp.logic.convert.valDateTimeBiggest((o.ProcessSteps || []), 'CreatedDate'),
			startDate  : teasp.logic.convert.valDate(o.StartDate__c),
			endDate    : teasp.logic.convert.valDate(o.EndDate__c)
		});
	}
	rejects = rejects.sort(function(a, b){
		return (a.rejectTime < b.rejectTime ? 1 : (a.rejectTime > b.rejectTime ? -1 : 0));
	});
	return rejects;
};

/**
 * 申請取消かつClose==falseの申請情報を変換＆マージ
 *
 * @param {Object} obj 勤怠それぞれの取消申請オブジェクト配列を格納したオブジェクト
 * @return {Array.<Object>} マージ済みの取消申請オブジェクト配列
 */
teasp.logic.convert.convCancelApplyList = function(obj){
	teasp.logic.convert.excludeNameSpace(obj);
	var cancels = [];
	for(var i = 0 ; i < obj.cancelHolidayApplys.length ; i++){
		var o = obj.cancelHolidayApplys[i];
		cancels.push({
			id         : o.Id,
			objectType : 0,
			status     : o.Status__c,
			applyType  : o.ApplyType__c,
			yearMonth  : o.YearMonth__c,
			holidayId  : o.HolidayId__c,
			directFlag : o.DirectFlag__c,
			entered    : o.Entered__c,
			yuqSpend   : (o.HolidayId__r ? o.HolidayId__r.YuqSpend__c : false),
			managed    : (o.HolidayId__r ? o.HolidayId__r.Managed__c : false),
			manageName : (o.HolidayId__r ? o.HolidayId__r.ManageName__c : null),
			applyTime  : teasp.logic.convert.valDateTime(o.ApplyTime__c),
			startDate  : teasp.logic.convert.valDate(o.StartDate__c),
			endDate    : teasp.logic.convert.valDate(o.EndDate__c)
		});
	}
	return cancels;
};

/**
 * 期間内の前月までの法定時間内労働、当年度の前月までの超過時間・超過回数の変換
 *
 * @param {Object} obj 期間内の前月までの法定時間内労働、当年度の前月までの超過時間・超過回数の変換を格納したオブジェクト
 */
teasp.logic.convert.convSumTimeObjs = function(obj){
	teasp.logic.convert.excludeNameSpace(obj);
	return {
		periodWorkTime        : obj.periodWorkTime,
		periodDayCount        : obj.periodDayCount,
		carryforwardMap       : obj.carryforwardMap,     // 繰越時間（複数月のフレックスで使用）
		realWorkTimeWoLHMap   : obj.realWorkTimeWoLHMap, // 実労働ー法休（〃）
		amountTimeMap         : obj.amountTimeMap,       // 実労働時間（〃）
		settlementTimeMap     : obj.settlementTimeMap,   // 当月清算時間（〃）
		totalWorkOverTime36   : obj.periodWorkOverTime36,
		totalWorkOverCount36  : obj.periodWorkOverCount36,
		quartWorkOverTime36   : obj.quartWorkOverTime36
	};
};

/**
 * 駅探検索履歴の変換
 *
 * @param {Array.<Object>} orgs 駅探検索履歴オブジェクトの配列
 */
teasp.logic.convert.convExpApplyHistory = function(orgs){
	teasp.logic.convert.excludeNameSpace(orgs);
	var lst = [];
	for(var i = 0 ; i < orgs.length ; i++){
		var o = orgs[i];
		lst.push({
			id         : o.Id,
			expApplyNo : o.ExpApplyNo__c,
			name       : o.Name,
			deptId     : o.DeptId__c,
			deptCode   : (o.DeptCode__c || ''),
			deptName   : (o.DeptName__c || ''),
			totalCost  : o.TotalCost__c,
			count      : o.Count__c,
			applyTime  : teasp.logic.convert.valDateTime(o.ApplyTime__c),
			startDate  : teasp.logic.convert.valDate(o.StartDate__c),
			endDate    : teasp.logic.convert.valDate(o.EndDate__c),
			status     : o.Status__c,
			expDetails : (o.EmpExp__r ? o.EmpExp__r : [])
		});
	}
	lst = lst.sort(function(a, b){
		return (a.id < b.id ? 1 : (a.id > b.id ? -1 : 0));
	});
	return lst;
};

/**
 * 期間内の前月までの法定時間内労働、当年度の前月までの超過時間・超過回数の変換
 *
 * @param {Object} obj 期間内の前月までの法定時間内労働、当年度の前月までの超過時間・超過回数の変換を格納したオブジェクト
 */
teasp.logic.convert.convHolidayHistoryObjs = function(obj){
	return {
		startDate : obj.startDate,
		empApplys : teasp.logic.convert.convEmpApplyObjs(obj.empApplys),
		empDays   : teasp.logic.convert.convEmpDayObjs(obj.empDays),
		empYuqs   : teasp.logic.convert.convEmpYuqObj(obj.empYuqs)
	};
};

/**
 * 作業報告・実労働時間情報の変換
 *
 * @param {Array.<Object>} orgs 作業報告・実労働時間情報オブジェクトの配列
 */
teasp.logic.convert.convWorkNoteList = function(orgs){
	teasp.logic.convert.excludeNameSpace(orgs);
	var map = {};
	for(var i = 0 ; i < orgs.length ; i++){
		var o = orgs[i];
		map[teasp.logic.convert.valDate(o.Date__c)] = {
			workNetTime         : o.WorkNetTime__c,
			workRealTime        : o.WorkRealTime__c,
			startTime           : o.StartTime__c,
			endTime             : o.EndTime__c,
			workNote            : o.WorkNote__c,
			dailyApplyStatus    : (o.DailyApplyId__r ? (o.DailyApplyId__r.Status__c || null) : null),
			monthApplyStatus    : ((o.EmpMonthId__r && o.EmpMonthId__r.EmpApplyId__r) ? (o.EmpMonthId__r.EmpApplyId__r.Status__c || null) : null)
		};
	}
	return map;
};

/**
 * 部署リストの変換
 *
 * @param {Array.<Object>} orgs 部署の配列
 */
teasp.logic.convert.convDeptList = function(orgs){
	teasp.logic.convert.excludeNameSpace(orgs);
	var lst = [];
	for(var i = 0 ; i < orgs.length ; i++){
		var o = orgs[i];
		lst.push({
			id         : o.Id,
			deptCode   : (o.DeptCode__c || null),
			name       : o.Name,
			parentId   : (o.ParentId__c || null),
			startDate  : teasp.logic.convert.valDate(o.StartDate__c),
			endDate    : teasp.logic.convert.valDate(o.EndDate__c)
		});
	}
	return lst;
};

/**
 * 部署変更履歴の変換
 *
 * @param {Array.<Object>} orgs
 */
teasp.logic.convert.convDeptHist = function(org){
	teasp.logic.convert.excludeNameSpace(org);
	var empDeptHistOrg = (org.empDeptHist || []);
	var deptOwnHistOrg = (org.deptOwnHist || []);
	var empDeptHist = [];
	var deptOwnHist = [];
	for(var i = 0 ; i < empDeptHistOrg.length ; i++){
		var o = empDeptHistOrg[i];
		empDeptHist.push({
			id         : o.Id,
			deptId     : (o.DeptId__c || null),
			deptName   : (o.DeptId__r ? o.DeptId__r.Name : null),
			deptCode   : (o.DeptId__r ? o.DeptId__r.DeptCode__c : null),
			startDate  : teasp.logic.convert.valDate(o.StartDate__c),
			endDate    : teasp.logic.convert.valDate(o.EndDate__c),
			startMonth : teasp.logic.convert.valNumber(o.StartMonth__c),
			endMonth   : teasp.logic.convert.valNumber(o.EndMonth__c)
		});
	}
	for(var i = 0 ; i < deptOwnHistOrg.length ; i++){
		var o = deptOwnHistOrg[i];
		deptOwnHist.push({
			id         : null,
			deptId     : (o.Id || null),
			deptName   : o.Name,
			deptCode   : (o.Code__c || null),
			startDate  : teasp.logic.convert.valDate(o.StartDate__c),
			endDate    : teasp.logic.convert.valDate(o.EndDate__c)
		});
	}
	return {
		empDeptHist : empDeptHist,
		deptOwnHist : deptOwnHist
	};
};

/**
 * 勤務体系リストの変換
 *
 * @param {Object} org
 * @param {string|number} ym
 * @param {number} sn
 * @param {string} dt
 * @returns {Object|null}
 */
teasp.logic.convert.convEmpTypeInfo = function(org, ym, dt){
	if(!org){
		return null;
	}
	teasp.logic.convert.excludeNameSpace(org);
	var eth = (org.empTypeHistory || []);
	var empTypes = (org.empTypes || []);
	var l = [];
	var m = {};
	for(var i = 0 ; i < empTypes.length ; i++){
		var o = empTypes[i];
		var et = {
			empTypeId                : (o.Id  || null),
			empTypeName              : (o.Name || ''),
			configBase               : {
				id                       : o.ConfigBaseId__r.Id,
				initialDayOfWeek         : teasp.logic.convert.valNumber(o.ConfigBaseId__r.InitialDayOfWeek__c),
				initialDateOfMonth       : teasp.logic.convert.valNumber(o.ConfigBaseId__r.InitialDateOfMonth__c),
				markOfMonth              : teasp.logic.convert.valNumber(o.ConfigBaseId__r.MarkOfMonth__c),
				initialDateOfYear        : teasp.logic.convert.valNumber(o.ConfigBaseId__r.InitialDateOfYear__c),
				markOfYear               : teasp.logic.convert.valNumber(o.ConfigBaseId__r.MarkOfYear__c)
			},
			daiqManage              : {
				daiqLimit                : o.DaiqLimit__c,                           // 代休の有効期限
				daiqAllBorderTime        : o.DaiqAllBorderTime__c,                   // 代終日休可能な休日労働時間
				daiqHalfBorderTime       : o.DaiqHalfBorderTime__c,                  // 代半日休可能な休日労働時間
				useDaiqLegalHoliday      : o.UseDaiqLegalHoliday__c,                 // 法定休日出勤の代休を許可
				useDaiqManage            : o.UseDaiqManage__c,                       // 代休管理を行う
				useDaiqReserve           : o.UseDaiqReserve__c,                      // 申請時に代休有無を指定
				useHalfDaiq              : o.UseHalfDaiq__c,                         // 半日代休
				useRegulateHoliday       : o.UseRegulateHoliday__c,                  // 休日出勤の勤怠を平日扱いする
				noDaiqExchanged          : o.NoDaiqExchanged__c                      // 振替休日に出勤した場合は代休不可
			},
			holidayStock            : {
				enableStockHoliday       : o.EnableStockHoliday__c,                  // 失効した有給休暇を積立休暇として積立てる
				maxStockHoliday          : o.MaxStockHoliday__c,                     // 積立休暇の最大日数
				maxStockHolidayPerYear   : o.MaxStockHolidayPerYear__c               // 1年で積立できる最大日数
			}
		};
		m[et.empTypeId] = et;
		l.push(et);
	}
	eth = eth.sort(function(a, b){
		return (a.date < b.date ? -1 : (a.date > b.date ? 1 : 0));
	});
	for(var i = 0 ; i < eth.length ; i++){
		eth[i].empType = (m[eth[i].empTypeId] || null);
	}
	return {
		ym            : (dt ? null : (ym || null)),
		dt            : (dt || null),
		empTypes      : l,
		empTypeMap    : m,
		empTypeHistory: eth
	};
};

/**
 * 勤怠設定履歴を変換
 *
 * @param {Array.<Object>} orgs
 * @return {Array.<Object>}
 */
teasp.logic.convert.convConfigHistory = function(orgs){
	teasp.logic.convert.excludeNameSpace(orgs);
	for(var i = 0 ; i < orgs.length ; i++){
		var o = orgs[i];
		o.startDate = (o.startDate ? teasp.util.date.formatDate(o.startDate) : null);
		o.endDate   = (o.endDate   ? teasp.util.date.formatDate(o.endDate)   : null);
	}
	return orgs;
};

/**
 * 自分が承認者かどうかの情報の変換
 *
 * @param {Object} obj 自分が承認者かどうかの情報
 * @return {Object} 自分が承認者かどうかの情報
 */
teasp.logic.convert.convApprover = function(obj){
	if(obj){
		teasp.logic.convert.excludeNameSpace(obj);
	}
	return obj;
};

/**
 * 日付文字列の配列を 'yyyy-MM-dd' に書式変換して返す
 *
 * @param {Array.<string>} lst 日付文字列の配列
 * @return {Array.<string>} 変換後の日付文字列の配列
 */
teasp.logic.convert.convFormatDate = function(lst){
	var l = [];
	if(lst && lst.length > 0){
		for(var i = 0 ; i < lst.length ; i++){
			if(lst[i].trim() != ''){
				l.push(teasp.util.date.formatDate(lst[i]));
			}
		}
	}
	return l;
};

/**
 * 文字列の配列を値があるものだけの配列にセットし直して返す
 *
 * @param {Array.<string>} lst 文字列の配列
 * @return {Array.<string>} 変換後の文字列の配列
 */
teasp.logic.convert.convValidList = function(lst){
	var l = [];
	if(lst && lst.length > 0){
		for(var i = 0 ; i < lst.length ; i++){
			if(lst[i].trim() != ''){
				l.push(lst[i]);
			}
		}
	}
	return l;
};

/**
 * 残業申請フラグ、早朝勤務申請フラグをビットで判断できる値に変換する.<br/>
 * 戻り値は以下のとおりになる<br/>
 * bit 1 (0x2) が on：申請の時間帯以外の勤務は認めない<br/>
 * bit 2 (0x4) が on：複数申請可（最新の申請が有効）<br/>
 * bit 3 (0x8) が on：所定勤務時間に達するまでは申請なしでも認める<br/>
 *
 * @param {number} flag
 * @return {number} 変換後値
 */
teasp.logic.convert.convOverFlag = function(flag){
	if(!flag){
		return 0;
	}
	if(flag == 7){
		return 10; // 2進数で 1010 16進数で 0xA
	}else if(flag == 8){
		return 14; // 2進数で 1110 16進数で 0xE
	}
	return flag;
};

/**
 * 文字列を区切り文字で分割して配列に変換して返す
 *
 * @param {string} v 文字列
 * @param {(string|RegExp)=} dv 区切り文字
 * @param {Function=} callback 配列を渡すコールバック
 * @return {Array.<string>} 変換後の文字列の配列
 */
teasp.logic.convert.valArray = function(v, dv, callback){
	if(v === undefined || v === null){
		return [];
	}
	var lst = v.split(dv ? dv : ',');
	if(callback){
		return callback(lst);
	}
	return lst;
};

/**
 * 文字列を数値型に変換して返す
 *
 * @param {string} v 文字列
 * @param {*=} defaultVal nullまたはundefined の場合のデフォルト値
 * @return {number|*} 変換後の数値
 */
teasp.logic.convert.valNumber = function(v, defaultVal){
	if(v === undefined || v === null){
		return defaultVal;
	}
	return (typeof(v) == 'string' ? parseInt(v, 10) : v);
};

/**
 * 文字列を数値型に変換して返す(小数点対応)
 *
 * @param {string} v 文字列
 * @param {*=} defaultVal nullまたはundefined の場合のデフォルト値
 * @return {number|*} 変換後の数値
 */
teasp.logic.convert.valFloat = function(v, defaultVal){
	if(v === undefined || v === null){
		return defaultVal;
	}
	return (typeof(v) == 'string' ? parseFloat(v) : v);
};

/**
 * 日付のLONG値を'yyyy-MM-dd'に変換して返す.<br/>
 *
 * @param {number} v 日付のLONG値
 * @return {string|null} 日付('yyyy-MM-dd')
 */
teasp.logic.convert.valDate = function(v){
	if(v === undefined || v === null){
		return null;
	}
	return teasp.util.date.formatDate(teasp.util.date.longToDate(v, 1));
};

/**
 * 日付/時間のLONG値を'yyyy-MM-dd HH:mm:ss'に変換して返す.<br/>
 *
 * @param {number} v 日付/時間のLONG値
 * @return {string|null} 日付/時間('yyyy-MM-dd HH:mm:ss')
 */
teasp.logic.convert.valDateTime = function(v){
	if(v === undefined || v === null){
		return null;
	}
	return teasp.util.date.formatDateTime(teasp.util.date.longToDate(v, 1));
};

/**
 * 日付/時間のLONG値をDateオブジェクトに変換して返す.<br/>
 *
 * @param {number} v 日付/時間のLONG値
 * @return {Object} Dateオブジェクト
 */
teasp.logic.convert.valDateTimeObj = function(v){
	if(v === undefined || v === null){
		return null;
	}
	return teasp.util.date.longToDate(v, 1);
};

/**
 * 複数のLONG値から一番大きい値を取り出し、'yyyy-MM-dd HH:mm:ss'に変換して返す.
 *
 * @param {Array.<Object>} lst オブジェクトの配列
 * @param {string} key オブジェクトのLONG値を示す要素
 * @return {string} 日付/時間('yyyy-MM-dd HH:mm:ss')
 */
teasp.logic.convert.valDateTimeBiggest = function(lst, key){
	var t = 0;
	for(var i = 0 ; i < lst.length ; i++){
		var o = lst[i];
		if(t < o[key]){
			t = o[key];
		}
	}
	var d = teasp.util.date.longToDate(t, 1);
	return teasp.util.date.formatDateTime(d);
};

/**
 * オブジェクトの要素名から名前空間('teamspirit__')を取り除く
 *
 * @param {Object} obj オブジェクト※メソッドで更新。
 */
teasp.logic.convert.excludeNameSpace = function(obj){
	var NS = 'teamspirit__';
	if(is_array(obj)){
		for(var i = 0 ; i < obj.length ; i++){
			teasp.logic.convert.excludeNameSpace(obj[i]);
		}
	}else{
		for(var key in obj){
			if(obj.hasOwnProperty(key)){
				if(key.substring(0, NS.length) == NS){
					var name = key.substring(NS.length);
					obj[name] = dojo.clone(obj[key]);
					delete obj[key];
					if(typeof(obj[name]) == 'object'){
						teasp.logic.convert.excludeNameSpace(obj[name]);
					}
				}else if(typeof(obj[key]) == 'object'){
					teasp.logic.convert.excludeNameSpace(obj[key]);
				}
			}
		}
	}
};

/**
 * オブジェクトの要素名から名前空間('TSEM__')を取り除く
 *
 * @param {Object} obj オブジェクト※メソッドで更新。
 */
teasp.logic.convert.excludeTSEMNameSpace = function(obj){
	var NS = 'TSEM__';
	if(is_array(obj)){
		for(var i = 0 ; i < obj.length ; i++){
			teasp.logic.convert.excludeTSEMNameSpace(obj[i]);
		}
	}else{
		for(var key in obj){
			if(obj.hasOwnProperty(key)){
				if(key.substring(0, NS.length) == NS){
					var name = key.substring(NS.length);
					obj[name] = dojo.clone(obj[key]);
					delete obj[key];
					if(typeof(obj[name]) == 'object'){
						teasp.logic.convert.excludeTSEMNameSpace(obj[name]);
					}
				}else if(typeof(obj[key]) == 'object'){
					teasp.logic.convert.excludeTSEMNameSpace(obj[key]);
				}
			}
		}
	}
};

/**
 * 文字列の語尾に'(COPY)'がついていたら取り除く
 *
 * @param {string} val 文字列
 */
teasp.logic.convert.excludeCopyTag = function(val){
	if(val && val.length > teasp.constant.COPYTAG.length && val.substring(val.length - teasp.constant.COPYTAG.length) == teasp.constant.COPYTAG){
		return val.substring(0, val.length - teasp.constant.COPYTAG.length);
	}
	return val;
};

/**
 * 変更申請グループ変換関数
 *
 * @param {Array.<Object>} groups 変更申請グループオブジェクトの配列
 */
teasp.logic.convert.convRequestGroups = function( groups ){
	teasp.logic.convert.excludeNameSpace( groups );
	teasp.logic.convert.excludeTSEMNameSpace( groups );
	var groupList = [];
	for( var i = 0 ; i < groups.length ; i++ ) {
		var group = groups[i];
		var groupObj = {
			id                  : group.Id
		,name                : group.Name
		,events            : []
		};
		if ( group.TemRequestEventMatchings__r ) {
			for ( var j = 0 ; j < group.TemRequestEventMatchings__r.length ; j++ ) {
				var eventMatch = group.TemRequestEventMatchings__r[j];
				var eventObj = {
					id : eventMatch.EventId__c
				,groupId : eventMatch.GroupId__c
				,name : eventMatch.EventId__r.Name
				};
				groupObj.events.push( eventObj );
			}
		}
		groupList.push( groupObj );
	}
	return groupList;
};

/**
 * 変更申請イベント変換関数
 *
 * @param {Array.<Object>} events 変更申請イベントオブジェクトの配列
 */
teasp.logic.convert.convRequestEvents = function( events ){
	teasp.logic.convert.excludeNameSpace( events );
	teasp.logic.convert.excludeTSEMNameSpace( events );
	var eventArray = {};
	for( var i = 0 ; i < events.length ; i++ ) {
		var event = events[i];
		var eventObj = {
			id                  : event.Id
		,flows            : []
		};
		if ( event.TemRequestFlowMatchings__r ) {
			for ( var j = 0 ; j < event.TemRequestFlowMatchings__r.length ; j++ ) {
				var flowMatch = event.TemRequestFlowMatchings__r[j];
				var flowObj = {
					id : flowMatch.FlowId__c
				,eventId : flowMatch.EventId__c
				,isRequired : flowMatch.IsRequired__c
				,name : flowMatch.FlowId__r.Name
				,isRead : flowMatch.FlowId__r.IsRead__c
				,isDefaultSetting : flowMatch.FlowId__r.IsDefaultSetting__c
				};
				eventObj.flows.push( flowObj );
			}
		}
		eventArray[eventObj.id] = eventObj;
	}
	return eventArray;
};

/**
 * 社員情報変換関数.
 *
 * @param {Array.<Object>} employee 社員情報オブジェクト
 */
teasp.logic.convert.convEmployeeMaster = function( employee ){
	teasp.logic.convert.excludeNameSpace( employee );
	teasp.logic.convert.excludeTSEMNameSpace( employee );
	return employee;
};

/**
 * 変更申請一覧変換関数.
 *
 * @param {Array.<Object>} requests 変更申請一覧オブジェクトの配列
 */
teasp.logic.convert.convRequestList = function( requests ){
	teasp.logic.convert.excludeNameSpace( requests );
	teasp.logic.convert.excludeTSEMNameSpace( requests );
	var requestList = [];
	for( var i = 0 ; i < requests.length ; i++ ) {
		var request = requests[i];
		var applyDatetime = teasp.logic.convert.valDateTime( request.ApplyDatetime__c );
		var status = request.TSEM ? request.TSEM.Status__c : request.Status__c;
		if( request.TSEM
		&& request.ApplyDatetime__c == null
		&& (teasp.constant.STATUS_FIX.contains(status)
		|| teasp.constant.STATUS_REJECTS.contains(status) )
		&& request.TSEM.ApplyDatetime__c) {
			var d = moment(request.TSEM.ApplyDatetime__c.replace('T', ' '));
			applyDatetime = teasp.util.date.formatDateTime(d.toDate(), 'SLA-HM', true);
		}
		var requestObj = {
			id                  : request.Id
		,name                : request.Name
		,applyDatetime       : applyDatetime
		,status              : status
		,isHRMversion1: request.isHRMversion1 // HRM Version1と接続時に作成された諸届かどうか
		};
		requestList.push( requestObj );
	}
	return requestList;
};

/**
 * 変更申請変換関数.
 *
 * @param {Array.<Object>} request 変更申請オブジェクトの配列
 */
teasp.logic.convert.convRequestObj = function( request ){
	teasp.logic.convert.excludeNameSpace( request );
	teasp.logic.convert.excludeTSEMNameSpace( request );
	return request;
};


/**
 * TSEM用承認履歴情報変換.
 *
 * @param {Array.<Object>} orgs 承認履歴オブジェクトの配列
 */
teasp.logic.convert.convTSEMApplySteps = function(orgs){
	teasp.logic.convert.excludeNameSpace(orgs);
	teasp.logic.convert.excludeTSEMNameSpace( orgs );
	var steps = [];
	for(var i = 0 ; i < orgs.length ; i++){
		var step = orgs[i];
		if(step.StepStatus && step.StepStatus.toLowerCase() == 'noresponse'){
			continue;
		}
		// step.CreatedDate の値の書式（例：'2015-09-25T07:22:03.000+0000'）を
		// Date オブジェクトに変換するために Moment.js を使用する。
		var d = moment(step.CreatedDate);
		steps.push({
			applyId      : step.ProcessInstance.TargetObjectId,
			actorName    : step.Actor.Name,
			createdDateS : (d.isValid() ? teasp.util.date.formatDateTime(d.toDate(), 'SLA-HM', true) : '-'),
			stepStatus   : teasp.constant.getStepStatus(step.StepStatus),
			comments     : step.Comments
		});
	}
	return steps;
};
