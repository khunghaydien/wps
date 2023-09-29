define([
	"dojo/_base/declare",
	"dojo/_base/json",
	"dojo/_base/array",
	"dijit/_WidgetBase",
	"dijit/_TemplatedMixin",
	"dojo/dom",
	"dojo/dom-construct",
	"dojo/dom-attr",
	"dojo/dom-style",
	"dojo/query",
	"dojo/on",
	"dojo/string",
	"dojo/_base/lang",
	"dojo/text!tsext/configDownload/configDownloadView.html",
	"tsext/service/Request",
	"tsext/dialog/Wait",
	"tsext/configDownload/ConfigDownloadEmpTypes",
	"tsext/configDownload/ConfigDownloadPatterns",
	"tsext/configDownload/ConfigDownloadHolidays",
	"tsext/configDownload/ConfigDownloadEmpTypePatterns",
	"tsext/configDownload/ConfigDownloadEmpTypeHolidays",
	"tsext/configDownload/ConfigDownloadCommons",
	"tsext/util/Util"
], function(declare, json, array, _WidgetBase, _TemplatedMixin, dom, domConstruct, domAttr, domStyle, query, on, str, lang, template, Request, Wait, ConfigDownloadEmpTypes, ConfigDownloadPatterns, ConfigDownloadHolidays, ConfigDownloadEmpTypePatterns, ConfigDownloadEmpTypeHolidays, ConfigDownloadCommons, Util) {
	return declare("tsext.view.ConfigDownloadView", [_WidgetBase, _TemplatedMixin], {
		templateString: template,
		constructor: function(){
		},
		placeAt: function(){
			this.inherited(arguments);
			this.startup();
		},
		startup: function(){
			this.inherited(arguments);
			this.own(
				on(dom.byId('tsextConfigDownload'), 'click' , lang.hitch(this, this.loadData))
			);
		},
		destroy : function(){
			this.inherited(arguments);
		},
		showError: function(errmsg){
			var els = query('div.tsext-error', this.domNode);
			if(els.length){
				var el = els[0];
				domConstruct.empty(el);
				domConstruct.create('div', { innerHTML: (errmsg ? 'ERROR: ' : '') + errmsg }, el);
				domStyle.set(el, 'display', (errmsg ? '' : 'none'));
			}
		},
		blockUI: function(flag, finish){
		},
		getOrganizationColumns: function(){
			return 'Id,Name,CreatedDate,CreatedById,CreatedBy.Name,LastModifiedDate,LastModifiedById,LastModifiedBy.Name,'
			+ 'OrganizationType,IsSandbox,LanguageLocaleKey,InstanceName,Country,FiscalYearStartMonth,UsesStartDateAsFiscalYearName';
		},
		getCommonColumns: function(){
			return 'Id,Name,CreatedDate,CreatedById,CreatedBy.Name,LastModifiedDate,LastModifiedById,LastModifiedBy.Name,OwnerId,Owner.Name,Owner.IsActive,'
			+ 'AcceptableExpApplyDate__c,AllowEditExpAdmin__c,AllowEditManager__c,AttachmentType__c,BorderTime__c,BoxRefreshToken__c,CachPaymentId__c,CancelDayApply__c,CancelMonthApply__c,'
			+ 'CheckDefaultDailyFix__c,CheckWorkingTime__c,ClarifyAfterApply__c,CommentIfAbsence__c,CommentIfNoPushTime__c,CommuterPassWorkflow__c,Config__c,DailyApprover__c,'
			+ 'DataOutputOption__c,DisableChatterPushTime__c,DisableKintaiFeed__c,DisablePitTouchOutPushTime__c,DisablePitTouchRestPushTime__c,DisabledEmpExp__c,DisabledEmpJob__c,DisabledTimeReport__c,'
			+ 'DiscretionaryOption__c,DivergenceReasonList__c,DontFixJobMonthly__c,DuplicateFlag__c,EkitanArea__c,EkitanICCardMode__c,EkitanKey__c,ExpApplyPrefix__c,ExpCouponList__c,ExpItemClassList__c,'
			+ 'ExpItemGroup__c,ExpItem__c,ExpLinkDocument__c,ExpPreApplyConfig__c,ExpPreApplyPrefix__c,ExpStartDate__c,ExpTransport__c,ExpWorkflow__c,ExtendedJournalFormat__c,ExtraItemOutputDataName1__c,'
			+ 'ExtraItemOutputDataName2__c,ExtraMenu__c,FixDate__c,FlexGraph__c,HandleInvalidApply__c,HelpLink__c,HideBottomSummary__c,HideMonthlySummary__c,HideTimeGraphPopup__c,ICCardExpItemClass__c,'
			+ 'ICCardRegLimitPerEmp__c,IndicateNoPushTime__c,InfoLink__c,JobAssignClassList__c,JobEditableByLeader__c,JobExtraItem1Length__c,JobExtraItem1Name__c,JobExtraItem1Width__c,JobExtraItem2Length__c,'
			+ 'JobExtraItem2Name__c,JobExtraItem2Width__c,JobInitialDateHistory__c,JobInitialDayOfMonth__c,JobLeaderFilter__c,JobMarkOfMonth__c,JobWorkflow__c,KeepExteriorTime__c,LastAccessControlLogTime__c,'
			+ 'LeftoverJobId__c,LegalTimeOfDay__c,LicenseType__c,LimitToMainteJob__c,LimitedPushTimeIPList__c,LimitedTimeDistance__c,LinkEkitan__c,LocalKey__c,MailAccessLogError__c,MessageTable__c,'
			+ 'MsDailyWorkTimeIsReal__c,NamingRule__c,NightEndTime__c,NightStartTime__c,NonDialogKey__c,NotInfoAutoView__c,OutputColumns__c,OutputJournalOnProvisionalPayment__c,OutputJournal__c,'
			+ 'PaidRestTimeLimit__c,PayExpApplyPrefix__c,PermitChangeLeftoverJob__c,PermitDeptFixWoMonthFix__c,PermitDuplicateJobProcess__c,PermitStartBtnDateChange__c,PitTouchDefaultStartFrom__c,'
			+ 'PitTouchDefaultStartTo__c,PitTouchSyncInterval__c,PlugApex__c,PlugJavaScript__c,ProcessList__c,ProgressList__c,ProhibitAcrossMonthApply__c,ProvisionalItemId__c,RecalcByLatestExchangeRate__c,'
			+ 'RefundItemId__c,ReportFolder__c,RequireChargeDept__c,RequireExpLinkJob__c,RequireNoteOption__c,RequireNote__c,Revision__c,SeparateDailyNote__c,SocialExpenseItemId__c,TaxRate__c,TaxRoundFlag__c,'
			+ 'TicketPeriod__c,TransferFeeItemId__c,TrasferFeeItemId__c,TreatEarlyEnd__c,TreatLateStart__c,UseAccessControlSystem__c,UseConnectICAttendance__c,UseConnectICExpense__c,UseDailyApply__c,'
			+ 'UseEkitan__c,UseExpApproverSet__c,UseExpCancelApply__c,UseExternalShopSearch__c,UseExtraItemOutput1__c,UseExtraItemOutput2__c,UseFixedButton__c,UseJobApproverSet__c,UseJobExtraItem1__c,'
			+ 'UseJobExtraItem2__c,UseReceiptOCR__c,UseRestartable__c,UseShopCache__c,UsingJsNaviSystem__c,UsingReceiptSystem__c,UsingTaxiSystem__c,WorkNoteCrlfOn__c,WorkNoteTemplate__c,'
			+ 'YuqProvidePriorMonth__c,ZGCompanyCode__c,ZGSenderAccountNo__c,ZGSenderAccountType__c,ZGSenderBankCode__c,ZGSenderBankName__c,ZGSenderBranchCode__c,ZGSenderBranchName__c,ZGSenderDate__c,'
			+ 'ZGSenderName__c,ZGSendingBranchName__c,mailEmpApplyCanceled__c,permitLeavingPush24hours__c';
		},
		getEmpTypeColumns: function(){
			return 'Id,Name,CreatedDate,CreatedById,CreatedBy.Name,LastModifiedDate,LastModifiedById,LastModifiedBy.Name,OwnerId,Owner.Name,Owner.IsActive,'
			+ 'AutoProvidePerYear__c,ConfigBaseId__c,Config__c,DaiqAllBorderTime__c,DaiqHalfBorderTime__c,DaiqLimit__c,'
			+ 'EmpTypeCode__c,EnableStockHoliday__c,MaxStockHolidayPerYear__c,MaxStockHoliday__c,NoDaiqExchanged__c,'
			+ 'OverTimeCountAlert__c,OverTimeCountLimit__c,OverTimeMonthAlert1__c,OverTimeMonthAlert2__c,OverTimeMonthAlert3__c,'
			+ 'OverTimeMonthLimit__c,OverTimeQuartAlert1__c,OverTimeQuartAlert2__c,OverTimeQuartLimit__c,'
			+ 'OverTimeYearAlert1__c,OverTimeYearAlert2__c,OverTimeYearLimit__c,'
			+ 'PatternId__c,PlugJsSummary__c,Removed__c,TargetStockHoliday__c,UseDaiqLegalHoliday__c,UseDaiqManage__c,'
			+ 'UseDaiqReserve__c,UseHalfDaiq__c,UseRegulateHoliday__c,YuqAssignNoMessages__c,YuqDate1__c,YuqDate2__c,YuqOption__c';
		},
		getConfigBaseColumns: function(){
			return 'Id,Name,CreatedDate,CreatedById,CreatedBy.Name,LastModifiedDate,LastModifiedById,LastModifiedBy.Name,OwnerId,Owner.Name,Owner.IsActive,'
			+ 'InitialDateOfMonth__c,InitialDateOfYear__c,InitialDayOfWeek__c,'
			+ 'MarkOfMonth__c,MarkOfYear__c,OriginalId__c,Removed__c';
		},
		getEmpTypeHolidayColumns: function(){
			return 'Id,Name,CreatedDate,CreatedById,CreatedBy.Name,LastModifiedDate,LastModifiedById,LastModifiedBy.Name,'
			+ 'EmpTypeId__c,EmpTypeId__r.EmpTypeCode__c,EmpTypeId__r.Name,HolidayId__c,HolidayId__r.Name,Order__c';
		},
		getEmpTypePatternColumns: function(){
			return 'Id,Name,CreatedDate,CreatedById,CreatedBy.Name,LastModifiedDate,LastModifiedById,LastModifiedBy.Name,'
			+ 'EmpTypeId__c,EmpTypeId__r.EmpTypeCode__c,EmpTypeId__r.Name,PatternId__c,PatternId__r.Name,SchedMonthlyDate__c,SchedMonthlyLine__c,SchedMonthlyWeek__c,SchedOption__c,SchedWeekly__c,Order__c';
		},
		getEmpTypeYuqColumns: function(){
			return 'Id,Name,CreatedDate,CreatedById,CreatedBy.Name,LastModifiedDate,LastModifiedById,LastModifiedBy.Name,'
			+ 'EmpTypeId__c,Month__c,Days__c,Provide__c,Year__c,Suffix__c';
		},
		getPatterns: function(){
			return 'Id,Name,CreatedDate,CreatedById,CreatedBy.Name,LastModifiedDate,LastModifiedById,LastModifiedBy.Name,OwnerId,Owner.Name,Owner.IsActive,'
			+ 'AmHolidayEndTime__c,AmHolidayStartTime__c,DisableCoreTime__c,EnableRestTimeShift__c,IgonreNightWork__c,Order__c,OriginalId__c,'
			+ 'PmHolidayEndTime__c,PmHolidayStartTime__c,ProhibitChangeExchangedWorkTime__c,ProhibitChangeHolidayWorkTime__c,ProhibitChangeWorkTime__c,'
			+ 'Range__c,Removed__c,RestTimes__c,StandardFixTime__c,StdEndTime__c,StdStartTime__c,SuitableDate__c,Symbol__c,UseDiscretionary__c,UseFlexTime__c,'
			+ 'UseHalfHoliday__c,WorkTimeChangesWithShift__c,'
			+ 'UseHalfHolidayRestTime__c,AmHolidayRestTimes__c,PmHolidayRestTimes__c';
		},
		getHolidays: function(){
			return 'Id,Name,CreatedDate,CreatedById,CreatedBy.Name,LastModifiedDate,LastModifiedById,LastModifiedBy.Name,OwnerId,Owner.Name,Owner.IsActive,'
			+ 'Config__c,Description__c,DisplayDaysOnCalendar__c,IsSummaryRoot__c,IsWorking__c,LinkNumber__c,ManageName__c,Managed__c,Order__c,OriginalId__c,'
			+ 'PlannedHoliday__c,Range__c,Removed__c,SummaryCode__c,SummaryName__c,Symbol__c,Type__c,YuqSpend__c';
		},
		getConfigColumns: function(){
			return 'Id,Name,CreatedDate,CreatedById,CreatedBy.Name,LastModifiedDate,LastModifiedById,LastModifiedBy.Name,OwnerId,Owner.Name,Owner.IsActive,'
			+ 'AmHolidayEndTime__c,AmHolidayStartTime__c,AutoLegalHoliday__c,BaseTime__c,ChangeDayType__c,ChangePattern__c,'
			+ 'ChangeShift__c,CheckDailyFixLeak__c,CheckSatisfyWorkFixTime__c,CheckWorkingTimeMonthly__c,CheckWorkingTime__c,'
			+ 'ClassificationNextDayWork__c,ConfigBaseId__c,Config__c,CoreEndTime__c,CoreStartTime__c,CoreTimeGraph__c,'
			+ 'DailyApprover__c,DaiqLimitOption__c,DaiqLimit__c,DeductWithFixedTime__c,DefaultLegalHoliday__c,DisplayLegalHoliday__c,'
			+ 'EarlyWorkBorderTime__c,ExchangeLimit2__c,ExchangeLimit__c,ExtendDayType__c,FlexEndTime__c,FlexFixDayTime__c,FlexFixMonthTime__c,'
			+ 'FlexFixOption__c,FlexLegalWorkTimeOption__c,FlexStartTime__c,Generation__c,HalfDaiqReckontoWorked__c,HighlightLateEarly__c,'
			+ 'Holiday1__c,Holiday2__c,HolidayAccessBaseTime__c,HolidayWorkBaseTime__c,Holidays__c,IgonreNightWork__c,InputWorkingTimeOnWorkTimeView__c,'
			+ 'LeavingAcrossNextDay__c,LegalTimeOfDay__c,LegalTimeOfWeek__c,MsAccessInfo__c,NightChargeOnly__c,NightEndTime__c,NightStartTime__c,'
			+ 'NonPublicHoliday__c,OriginalId__c,OverTimeBorderTime__c,PastTimeOnly__c,PermitDailyApply__c,PermitDivergenceTime__c,PermitMonthlyApply__c,'
			+ 'PermitUpdateTimeLevel__c,PmHolidayEndTime__c,PmHolidayStartTime__c,ProhibitApplicantEliminatingLegalHoliday__c,ProhibitInputTimeUntilApproved__c,'
			+ 'Removed__c,RestTimeCheck__c,RestTimes__c,RoundMonthlyTime__c,SeparateDailyFixButton__c,StandardFixTime__c,StdEndTime__c,StdStartTime__c,'
			+ 'Summary36TimePeriod__c,TimeFormat__c,TimeRoundBegin__c,TimeRoundEnd__c,TimeRound__c,UseAccessControlSystem__c,UseApplyApproverTemplate__c,'
			+ 'UseCarryOver__c,UseCoreTime__c,UseDailyApply__c,UseDaiqLegalHoliday__c,UseDaiqManage__c,UseDaiqReserve__c,UseDirectApply__c,UseDiscretionary__c,'
			+ 'UseEarlyEndApply__c,UseEarlyWorkFlag__c,UseHalfDaiq__c,UseHalfHoliday__c,UseHolidayWorkFlag__c,UseLateStartApply__c,UseLegalHoliday__c,'
			+ 'UseMakeupHoliday__c,UseOverTimeFlag__c,UseRegulateHoliday__c,UseReviseTimeApply__c,UseWorkFlow__c,ValidEndDate__c,ValidEndMonth__c,'
			+ 'ValidStartDate__c,ValidStartMonth__c,VariablePeriod__c,WeekDayAccessBaseTime__c,WorkSystem__c,WorkTypeList__c,'
			+ 'UseHalfHolidayRestTime__c,AmHolidayRestTimes__c,PmHolidayRestTimes__c,BaseTimeForStock__c'
		},
		loadData: function(){
			Wait.show(true);
			var opt = {};
			opt.oid = dom.byId('tsextConfigDownloadOptId'  ).checked;
			opt.odt = dom.byId('tsextConfigDownloadOptDate').checked;
			opt.oby = dom.byId('tsextConfigDownloadOptBy'  ).checked;
			opt.ocp = dom.byId('tsextConfigDownloadOptCopy').checked;
			opt.orm = dom.byId('tsextConfigDownloadOptRem' ).checked;
			this.empTypes = new ConfigDownloadEmpTypes(opt);
			this.patterns = new ConfigDownloadPatterns(opt);
			this.holidays = new ConfigDownloadHolidays(opt);
			this.empTypePatterns = new ConfigDownloadEmpTypePatterns(opt);
			this.empTypeHolidays = new ConfigDownloadEmpTypeHolidays(opt);
			this.commons = new ConfigDownloadCommons(opt);
			var reqs = [];
			reqs.push({ soql: str.substitute("select ${0} from Organization"        , [this.getOrganizationColumns()])   });
			reqs.push({ soql: str.substitute("select ${0} from AtkEmpType__c"       , [this.getEmpTypeColumns()])        });
			reqs.push({ soql: str.substitute("select ${0} from AtkConfigBase__c"    , [this.getConfigBaseColumns()])     });
			reqs.push({ soql: str.substitute("select ${0} from AtkConfig__c"        , [this.getConfigColumns()])         });
			reqs.push({ soql: str.substitute("select ${0} from AtkEmpTypeHoliday__c", [this.getEmpTypeHolidayColumns()]) });
			reqs.push({ soql: str.substitute("select ${0} from AtkEmpTypePattern__c", [this.getEmpTypePatternColumns()]) });
			reqs.push({ soql: str.substitute("select ${0} from AtkEmpTypeYuq__c"    , [this.getEmpTypeYuqColumns()])     });
			reqs.push({ soql: str.substitute("select ${0} from AtkPattern__c"       , [this.getPatterns()])              });
			reqs.push({ soql: str.substitute("select ${0} from AtkHoliday__c"       , [this.getHolidays()])              });
			reqs.push({ soql: str.substitute("select ${0} from AtkCommon__c"        , [this.getCommonColumns()])         });
			var mediator = {
				index: 0,
				errmsg: null,
				reqs: reqs
			};
			this.fetchData(mediator);
		},
		fetchData: function(mediator){
			if(mediator.errmsg){
				Wait.show(false);
				return;
			}
			if(mediator.index >= mediator.reqs.length){
				this.download();
				Wait.show(false);
				return;
			}
			var req = mediator.reqs[mediator.index];
			var result = Request.fetch(req.soql, true).then(
				lang.hitch(this, function(records){
					switch(mediator.index){
					case 0:
						this.organization = records[0];
						break;
					case 1:
						this.empTypes.setEmpTypes(records);
						break;
					case 2:
						this.empTypes.setConfigBases(records);
						break;
					case 3:
						this.empTypes.setConfigs(records);
						break;
					case 4:
						this.empTypes.setEmpTypeHolidays(records);
						this.empTypeHolidays.setEmpTypeHolidays(records);
						break;
					case 5:
						this.empTypes.setEmpTypePatterns(records);
						this.empTypePatterns.setEmpTypePatterns(records);
						break;
					case 6:
						this.empTypes.setEmpTypeYuqs(records);
						break;
					case 7:
						this.patterns.setPatterns(records);
						break;
					case 8:
						this.holidays.setHolidays(records);
					case 9:
						this.commons.setCommons(records);
					}
					mediator.index++;
					return mediator;
				}),
				lang.hitch(this, function(errmsg){
					mediator.errmsg = errmsg;
					this.showError(errmsg);
				})
			);
			result.then(lang.hitch(this, this.fetchData));
		},
		getOrganizationContents: function(){
			var values = [];
			values.push(this.organization.Id);
			values.push(this.organization.Name);
			values.push(Util.formatDateTime(this.organization.CreatedDate));
			values.push(this.organization.CreatedById);
			values.push(this.organization.CreatedBy.Name);
			values.push(Util.formatDateTime(this.organization.LastModifiedDate));
			values.push(this.organization.LastModifiedById || '');
			values.push((this.organization.LastModifiedBy && this.organization.LastModifiedBy.Name) || '');
			values.push(this.organization.OrganizationType || '');
			values.push(this.organization.IsSandbox || false);
			values.push(this.organization.InstanceName || '');
			values.push(this.organization.LanguageLocaleKey || '');
			values.push(this.organization.Country || '');
			values.push(this.organization.FiscalYearStartMonth || '');
			values.push(this.organization.UsesStartDateAsFiscalYearName || false);
			return ['組織ID','組織名','作成日時','作成者ID','作成者名','最終更新日時','最終更新者ID','最終更新者名',
			'Edition','Sandbox','インスタンス名','言語','国','会計年度期首月','期首月別会計年度名'].join(',') + '\n'
			+ values.join(',');
		},
		download: function(){
			var zip = new JSZip();
			var fname = 'configs_' + this.organization.Id + moment().format('YYYYMMDDHHmmss') + '.zip';

			zip.file('組織.csv'        , Util.unicodeStringToTypedArray(this.getOrganizationContents(), true), {binary:true});
			zip.file('勤務体系.csv'    , Util.unicodeStringToTypedArray(this.empTypes.getEmpTypeCsvContents(), true), {binary:true});
			zip.file('勤務パターン.csv', Util.unicodeStringToTypedArray(this.patterns.getPatternCsvContents(), true), {binary:true});
			zip.file('勤怠休暇.csv'    , Util.unicodeStringToTypedArray(this.holidays.getHolidayCsvContents(), true), {binary:true});
			zip.file('勤務体系別勤務パターン.csv', Util.unicodeStringToTypedArray(this.empTypePatterns.getEmpTypePatternCsvContents(), true), {binary:true});
			zip.file('勤務体系別休暇.csv'        , Util.unicodeStringToTypedArray(this.empTypeHolidays.getEmpTypeHolidayCsvContents(), true), {binary:true});
			zip.file('勤怠共通設定.csv', Util.unicodeStringToTypedArray(this.commons.getCommonCsvContents(), true), {binary:true});

			zip.generateAsync({ type: 'blob', compression: "DEFLATE" }).then(lang.hitch(this, function(content){
				// IEか他ブラウザかの判定
				if(window.navigator.msSaveBlob){
					// IEなら独自関数を使います。
					window.navigator.msSaveBlob(content, fname);
				} else {
					// それ以外はaタグを利用してイベントを発火させます
					var a = query('.tsext-form-download a', this.domNode)[0];
					a.href = URL.createObjectURL(content);
					a.download = fname;
					a.target = '_blank';
					a.click();
					setTimeout(function(){
						URL.revokeObjectURL(a.href);
					}, 3000);
				}
			}));
		}
	});
});
