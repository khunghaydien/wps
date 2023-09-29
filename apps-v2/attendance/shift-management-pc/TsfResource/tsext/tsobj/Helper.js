define([
	"dojo/_base/declare",
	"dojo/date/locale",
	"dojo/_base/json",
	"dojo/string",
	"dojo/dom-style"
], function(declare, locale, json, str, domStyle){
	return new (declare("tsext.tsobj.Helper", null, {
		getScanRefers: function(){
			return ['AtkEmp__c', 'AtkEmpType__c', 'AtkConfigBase__c', 'AtkEmpMonth__c'];
		},
		getImportOrder: function(){
			return [
				'AtkConfigBase__c',
				'AtkConfig__c',
				'AtkEmpType__c',
				'AtkPattern__c',
				'AtkHoliday__c',
				'AtkCalendar__c',
				'AtkEmpTypeHoliday__c',
				'AtkEmpTypePattern__c',
				'AtkEmpTypeYuq__c',
				'AtkDept__c',
				'AtkEmp__c',
				'AtkEmpApply__c',
				'AtkEmpMonth__c',
				'AtkEmpDay__c',
				'AtkEmpYuq__c',
				'AtkEmpYuqDetail__c',
				'AtkEmpStock__c',
				'AtkEmpStockDetail__c',
				'AtkJob__c',
				'AtkJobAssign__c',
				'AtkJobApply__c',
				'AtkEmpWork__c',
				'AtkExpItem__c',
				'AtkPayee__c',
				'AtkForeignCurrency__c',
				'AtkExpCancelApply__c',
				'AtkExpPayment__c',
				'AtkJsNaviReserve__c',
				'AtkJsNaviActual__c',
				'AtkJsNaviInvoice__c',
				'AtkCardStatementLine__c',
				'AtkAccessControlLog__c',
				'AtkCommuterPass__c',
				'AtkExpApply__c',
				'AtkExpPreApply__c',
				'AtkExpPreApplyDay__c',
				'AtkEmpExp__c'
			];
		},
		getDeleteTargets: function(){
			return [
				'AtkEmp__c',
				'AtkConfig__c',
				'AtkCalendar__c',
				'AtkEmpType__c',
				'AtkConfigBase__c',
				'AtkPattern__c',
				'AtkHoliday__c',
				'AtkDeptMonth__c',
				'AtkDept__c',
				'AtkJob__c',
				'AtkExpItem__c',
				'AtkPayee__c',
				'AtkInfo__c'
			];
		},
		getTargetCheckName: function(){
			return [
				'AtkEmp__c',
				'AtkDept__c',
				'AtkConfigBase__c',
				'AtkConfig__c',
				'AtkEmpType__c',
				'AtkPattern__c',
				'AtkHoliday__c',
				'AtkCalendar__c',
				'AtkExpItem__c',
				'AtkJob__c'
			];
		},
		getTargetSObjects: function(){
			return [
				{ key: 'Organization'           , all: true  },
				{ key: 'AtkCommon__c'           , all: true  },
				{ key: 'AtkConfigBase__c'       , all: true  },
				{ key: 'AtkConfig__c'           , all: true  },
				{ key: 'AtkCalendar__c'         , all: true  },
				{ key: 'AtkPattern__c'          , all: true  },
				{ key: 'AtkHoliday__c'          , all: true  },
				{ key: 'AtkEmpType__c'          , all: true  },
				{ key: 'AtkEmpTypeHoliday__c'   , all: true  },
				{ key: 'AtkEmpTypePattern__c'   , all: true  },
				{ key: 'AtkEmpTypeYuq__c'       , all: true  },
				{ key: 'AtkDept__c'             , all: true  },
				{ key: 'AtkDeptMonth__c'        , all: true  },
				{ key: 'AtkExpItem__c'          , all: true, type: "exp" },
				{ key: 'AtkForeignCurrency__c'  , all: true, type: "exp" },
				{ key: 'AtkPayee__c'            , all: true, type: "exp" },
				{ key: 'AtkPrivateOptions__c'   , all: true  },
				{ key: 'AtkEmp__c'              , emp: true , wh: "Id in (${0})" },
				{ key: 'AtkInfo__c'             , emp: true , wh: "EmpId__c in (${0})" },
				{ key: 'AtkEmpApply__c'         , emp: true , wh: "EmpId__c in (${0})", type: "time", wh2: "((StartDate__c <= ${1} and EndDate__c >= ${0}) or (ApplyType__c = '振替申請' and ((ExchangeDate__c >= ${0} and ExchangeDate__c <= ${1}) or (OriginalStartDate__c >= ${0} and OriginalStartDate__c <= ${1}))) or (ApplyType__c = '勤務確定' and YearMonth__c >= ${2} and YearMonth__c <= ${3}))" },
				{ key: 'AtkEmpMonth__c'         , emp: true , wh: "EmpId__c in (${0})", type: "time", wh2: "StartDate__c <= ${1} and EndDate__c >= ${0}" },
				{ key: 'AtkEmpYuq__c'           , emp: true , wh: "EmpId__c in (${0})" },
				{ key: 'AtkEmpStock__c'         , emp: true , wh: "EmpId__c in (${0})" },
				{ key: 'AtkEmpWork__c'          , emp: true , wh: "EmpId__c in (${0})", type: "job" , wh2: "JobApplyId__r.StartDate__c <= ${1} and JobApplyId__r.EndDate__c >= ${0}" },
				{ key: 'AtkExpApply__c'         , emp: true , wh: "EmpId__c in (${0})", type: "exp" , wh2: "StartDate__c <= ${1} and EndDate__c >= ${0}" },
				{ key: 'AtkExpPreApply__c'      , emp: true , wh: "EmpId__c in (${0})", type: "exp" , wh2: "StartDate__c <= ${1} and EndDate__c >= ${0}" },
				{ key: 'AtkEmpExp__c'           , emp: true , wh: "EmpId__c in (${0})", type: "exp" , wh2: "((Date__c >= ${0} and Date__c <= ${1}) or (ExpApplyId__r.StartDate__c <= ${1} and ExpApplyId__r.EndDate__c >= ${0}) or (ExpPreApplyId__r.StartDate__c <= ${1} and ExpPreApplyId__r.EndDate__c >= ${0}))" },
				{ key: 'AtkExpCancelApply__c'   , emp: true , wh: "EmpId__c in (${0})", type: "exp" , wh2: "((ExpApplyId__r.StartDate__c <= ${1} and ExpApplyId__r.EndDate__c >= ${0}) or (ExpPreApplyId__r.StartDate__c <= ${1} and ExpPreApplyId__r.EndDate__c >= ${0}))" },
				{ key: 'AtkExpPayment__c'       , emp: true , wh: "EmpId__c in (${0})", type: "exp" , wh2: "((ExpApplyId__r.StartDate__c <= ${1} and ExpApplyId__r.EndDate__c >= ${0}) or (ExpPreApplyId__r.StartDate__c <= ${1} and ExpPreApplyId__r.EndDate__c >= ${0}))" },
				{ key: 'AtkJobApply__c'         , emp: true , wh: "EmpId__c in (${0})", type: "job" , wh2: "StartDate__c <= ${1} and EndDate__c >= ${0}" },
				{ key: 'AtkJobAssign__c'        , emp: true , wh: "EmpId__c in (${0})", type: "job" },
				{ key: 'AtkJsNaviActual__c'     , emp: true , wh: "EmpId__c in (${0})", type: "exp" , wh2: "StartDate__c <= ${1} and EndDate__c >= ${0}" },
				{ key: 'AtkJsNaviInvoice__c'    , emp: true , wh: "EmpId__c in (${0})", type: "exp" , wh2: "StartDate__c <= ${1} and EndDate__c >= ${0}" },
				{ key: 'AtkJsNaviReserve__c'    , emp: true , wh: "EmpId__c in (${0})", type: "exp" , wh2: "StartDate__c <= ${1} and EndDate__c >= ${0}" },
				{ key: 'ExternalAttendance__c'  , emp: true , wh: "EmpId__c in (${0})", type: "time", wh2: "TargetDate__c >= ${0} and TargetDate__c <= ${1}" },
				{ key: 'ExternalICExpense__c'   , emp: true , wh: "EmpId__c in (${0})", type: "exp" , wh2: "UsageDate__c >= ${0} and UsageDate__c <= ${1}" },
				{ key: 'AtkAccessControlLog__c' , emp: true , wh: "EmpId__c in (${0})", type: "time", wh2: "LogDate__c >= ${0}T00:00:00+0900 and LogDate__c <= ${1}T23:59:59+0900" },
				{ key: 'AtkApproverSet__c'      , emp: true , wh: "EmpId__c in (${0})" },
				{ key: 'AtkCardStatementLine__c', emp: true , wh: "EmpId__c in (${0})", type: "exp" , wh2: "Date__c >= ${0} and Date__c <= ${1}" },
				{ key: 'AtkCommuterPass__c'     , emp: true , wh: "EmpId__c in (${0})", type: "exp" },
				{ key: 'AtkEmpDeptHist__c'      , emp: true , wh: "EmpId__c in (${0})" },
				{ key: 'AtkEmpExpHist__c'       , emp: true , wh: "EmpId__c in (${0})", type: "exp" },
				{ key: 'AtkEmpDay__c'           , emp: true , wh: "EmpMonthId__r.EmpId__c in (${0})", type: "time", wh2: "EmpMonthId__r.StartDate__c <= ${1} and EmpMonthId__r.EndDate__c >= ${0}" },
				{ key: 'AtkEmpYuqDetail__c'     , emp: true , wh: "EmpYuqId__r.EmpId__c in (${0})"        },
				{ key: 'AtkEmpStockDetail__c'   , emp: true , wh: "ConsumesStockId__r.EmpId__c in (${0})" },
				{ key: 'AtkExpPreApplyDay__c'   , emp: true , wh: "ExpPreApplyId__r.EmpId__c in (${0})"  , type: "exp" , wh2: "ExpPreApplyId__r.StartDate__c <= ${1} and ExpPreApplyId__r.EndDate__c >= ${0}" },
				{ key: 'AtkJob__c'              , all: true , type: "job" } // ※ AtkJob__c は関連データのみ取得できるようにするため、最後にする
			];
		},
		getTargetApplyObjects: function(){
			return [
				'AtkEmpApply__c',
				'AtkExpApply__c',
				'AtkExpPreApply__c',
				'AtkJobApply__c',
				'AtkCommuterPass__c',
				'AtkExpCancelApply__c'
			];
		}
	}))();
});
