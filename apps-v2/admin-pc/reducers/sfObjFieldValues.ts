import _ from 'lodash';

import constantsAllowance from '../constants/fieldValues/allowance';
import constantsAttendanceFeatureSetting from '../constants/fieldValues/attendanceFeatureSetting';
import constantsAttExtendedItem from '../constants/fieldValues/attExtendedItem';
import constantsAttLegalAgreementGroup from '../constants/fieldValues/attLegalAgreementGroup';
import constantsAttPattern from '../constants/fieldValues/attPattern';
import constantsCalendar from '../constants/fieldValues/calendar';
import constantsCostCenterUsed from '../constants/fieldValues/costCenterUsedOption';
import constantsExpenseType from '../constants/fieldValues/expenseType';
import constantsExpSetting from '../constants/fieldValues/expSetting';
import constantsExtendedItem from '../constants/fieldValues/extendedItem';
import constantsExtendedItemPSA from '../constants/fieldValues/extendedItemPSA';
import constantsFinanceType from '../constants/fieldValues/financeType';
import constantsJobUsed from '../constants/fieldValues/jobUsedOption';
import constantsLateArrivalEarlyLeaveReason from '../constants/fieldValues/lateArrivalEarlyLeaveReason';
import constantsLeave from '../constants/fieldValues/leave';
import constantsLeaveOfAbsence from '../constants/fieldValues/LeaveOfAbsence';
import constantsLegalAgreement from '../constants/fieldValues/legalAgreement';
import constantsScopedAssignment from '../constants/fieldValues/scopedAssignment';
import constantsShortTimeWorkSettings from '../constants/fieldValues/shortTimeWorkSettings';
import constantsTimeSetting from '../constants/fieldValues/timeSetting';
import constantsVendorUsed from '../constants/fieldValues/vendorUsedOption';
import constantsWorkingType from '../constants/fieldValues/workingType';

import msg from '../../commons/languages';

import { constantsBankAccountType } from '../../domain/models/exp/Vendor';
import { filterBySelectable } from '../models/calendar/Calendar';

import { SEARCH_AGREEMENT_ALERT_SETTING } from '../modules/agreement-alert-setting/entities';
import { GET_CONSTANTS_CALENDAR } from '../modules/calendar';

import {
  GET_CONSTANTS_ALLOWANCE,
  SEARCH_ALLOWANCE,
} from '../actions/allowance';
import { GET_CONSTANTS_ATTENDANCE_FEATURE_SETTING } from '../actions/attendanceFeatureSetting';
import {
  GET_CONSTANTS_ATT_EXTENDED_ITEM,
  SEARCH_ATT_EXTENDED_ITEM,
} from '../actions/attExtendedItem';
import {
  GET_CONSTANTS_ATTLEGAL_AGREEMENT_GROP,
  SEARCH_LEGAL_AGREEMENT_GROUP,
} from '../actions/attLegalAgreementGroup';
import {
  GET_CONSTANTS_ATT_PATTERN,
  SEARCH_ATT_PATTERN,
} from '../actions/attPattern';
import { SEARCH_RECORD_DISPLAY_FIELD_LAYOUT } from '../actions/attRecordDisplayFieldLayout';
import { SEARCH_RECORD_EXTENDED_ITEM_SET } from '../actions/attRecordExtendedItemSet';
import { SEARCH_ATTENDANCE_CALENDAR } from '../actions/calendar';
import { SEARCH_CATEGORY } from '../actions/category';
import { SEARCH_COMPANY, SET_DEFAULT_LANGUAGE } from '../actions/company';
import {
  SEARCH_COST_CENTER,
  SEARCH_PARENT_COST_CENTER,
} from '../actions/costCenter';
import { SEARCH_COUNTRY } from '../actions/country';
import { SEARCH_CREDIT_CARD } from '../actions/creditCard';
import { SEARCH_CURRENCY, SEARCH_ISO_CURRENCY_CODE } from '../actions/currency';
import {
  SEARCH_DEPARTMENT,
  SEARCH_PARENT_DEPARTMENT,
} from '../actions/department';
import { SEARCH_EMPLOYEE } from '../actions/employee';
import { SEARCH_EMPLOYEE_GROUP } from '../actions/employeeGroup';
import { GET_CURRENCY_PAIR } from '../actions/exchangeRate';
import {
  GET_CONSTANTS_EXPENSE_TYPE, //  SEARCH_EXPENSE_TYPE,
} from '../actions/expenseType';
import { GET_CONSTANTS_EXP_SETTING } from '../actions/expSetting';
import {
  SEARCH_EXPTYPEGROUP,
  SEARCH_PARENT_EXPTYPEGROUP,
} from '../actions/expTypeGroup';
import {
  GET_CONSTANTS_EXTENDED_ITEM,
  SEARCH_EXTENDED_ITEM,
} from '../actions/extendedItem';
import { SEARCH_EXTENDED_ITEM_CUSTOM } from '../actions/extendedItemCustom';
import {
  GET_CONSTANTS_EXTENDED_ITEM_PSA,
  SEARCH_EXTENDED_ITEM_PSA,
} from '../actions/extendedItemPSA';
import { GET_CONSTANTS_FINANCE_TYPE } from '../actions/financeCategory';
import { GET_CONSTANTS_SCOPED_ASSIGNMENT } from '../actions/job';
import { SEARCH_JOB_GRADE } from '../actions/jobGrade';
import { SEARCH_JOB_TYPE } from '../actions/jobType';
import {
  GET_CONSTANTS_LATE_ARRIVAL_EARLY_LEAVE_REASON,
  SEARCH_LATE_ARRIVAL_EARLY_LEAVE_REASON,
} from '../actions/lateArrivalEarlyLeaveReason';
import { GET_CONSTANTS_LEAVE, SEARCH_LEAVE } from '../actions/leave';
import { GET_CONSTANTS_LEAVE_DETAIL } from '../actions/leaveDetail';
import { GET_CONSTANTS_LEAVE_OF_ABSENCE } from '../actions/leaveOfAbsence';
import {
  GET_CONSTANTS_LEGALAGREEMENT,
  SEARCH_LEGAL_AGREEMENT,
} from '../actions/legalAgreement';
import { SEARCH_OBJECTIVELY_EVENT_LOG_SETTING } from '../actions/objectivelyEventLogSetting';
import { SEARCH_PERMISSION } from '../actions/permission';
import { SEARCH_PSA_WORK_SCHEME } from '../actions/psaWorkScheme';
import {
  GET_CONSTANTS_COST_CENTER_USED,
  GET_CONSTANTS_JOB_USED,
  GET_CONSTANTS_VENDOR_USED,
} from '../actions/reportType';
import { SEARCH_REST_REASON } from '../actions/restReason';
import { GET_SF_OBJ_FIELD_VALUES } from '../actions/sfObjFieldValues';
import { SEARCH_SHORT_TIME_WORK_REASON } from '../actions/shortTimeWorkReason';
import { GET_CONSTANTS_SHORT_TIME_WORK_SETTING } from '../actions/shortTimeWorkSetting';
import { SEARCH_TAX_TYPE } from '../actions/taxType';
import {
  GET_CONSTANTS_TIME_SETTING,
  SEARCH_TIME_SETTING,
} from '../actions/timeSetting';
import { GET_CONSTANTS_BANK_ACCOUNT_TYPE } from '../actions/vendor';
import { SEARCH_WORK_CATEGORY } from '../actions/workCategory';
import {
  GET_CONSTANTS_WORKING_TYPE,
  SEARCH_WORKING_TYPE,
} from '../actions/workingType';
import {
  ATT_SEARCH_FEATURE_ACCESS,
  COM_SEARCH_FEATURE_ACCESS,
  EXP_SEARCH_FEATURE_ACCESS,
  PSA_SEARCH_FEATURE_ACCESS,
  TIME_SEARCH_FEATURE_ACCESS,
} from '@admin-pc-v2/actions/featureAccess';
import { SEARCH_MILEAGE_RATE } from '@apps/admin-pc-v2/actions/mileageRate';
import { SEARCH_PRINT_PAGE_LAYOUT } from '@apps/admin-pc-v2/actions/printPageLayout';

const groupLeaves = (leaves) => ({
  allowable: leaves.filter(
    (leave) =>
      leave.leaveType === 'Annual' ||
      leave.leaveType === 'Paid' ||
      leave.leaveType === 'Unpaid'
  ),
  substitute: leaves.filter((leave) => leave.leaveType === 'Substitute'),
});

const lateArrivalReasons = (reasons) => ({
  lateArrival: reasons.filter(
    (reason) =>
      reason.requestType === 'LateArrival' ||
      reason.requestType === 'LateArrivalEarlyLeave'
  ),
});

const earlyLeaveReasons = (reasons) => ({
  earlyLeave: reasons.filter(
    (reason) =>
      reason.requestType === 'EarlyLeave' ||
      reason.requestType === 'LateArrivalEarlyLeave'
  ),
});

const initialState = {};

function makeSFObjFieldValues(
  action,
  sfObjFieldValues,
  key,
  additionalFieldNames?,
  filter?
) {
  const payload = filter ? _.filter(action.payload, filter) : action.payload;
  const entries = payload.map((record) => {
    const additional = {};
    (additionalFieldNames || []).forEach((fieldName) => {
      additional[fieldName] = record[fieldName];
    });

    return {
      id: record.id,
      name: record.name,
      label: record.name,
      value: record.id,
      code: record.code,
      ...additional,
    };
  });
  sfObjFieldValues[key] = entries;
  return sfObjFieldValues;
}

export default function sfObjFieldValuesReducer(
  state: any = initialState,
  action
) {
  const sfObjFieldValues = _.cloneDeep(state);
  switch (action.type) {
    case GET_SF_OBJ_FIELD_VALUES:
      const { param, result } = action.payload;

      if (!result.isSuccess) {
        return sfObjFieldValues;
      }

      param.forEach((item, idx) => {
        sfObjFieldValues[item.key] = result.results[idx].entries;
      });
      return sfObjFieldValues;
    case SEARCH_COUNTRY:
      return makeSFObjFieldValues(action, sfObjFieldValues, 'countryId');
    case SEARCH_COMPANY:
      return makeSFObjFieldValues(action, sfObjFieldValues, 'companyId');
    case SEARCH_COST_CENTER:
    case SEARCH_PARENT_COST_CENTER:
      return makeSFObjFieldValues(action, sfObjFieldValues, 'costCenterId');
    case SEARCH_DEPARTMENT:
    case SEARCH_PARENT_DEPARTMENT:
      return makeSFObjFieldValues(action, sfObjFieldValues, 'departmentId');
    case SEARCH_EXPTYPEGROUP:
    case SEARCH_PARENT_EXPTYPEGROUP:
      return makeSFObjFieldValues(action, sfObjFieldValues, 'expTypeGroupId');
    case SEARCH_CREDIT_CARD:
      return makeSFObjFieldValues(action, sfObjFieldValues, 'creditCard');
    case SEARCH_MILEAGE_RATE:
      return makeSFObjFieldValues(action, sfObjFieldValues, 'mileageRate');
    case SEARCH_PRINT_PAGE_LAYOUT:
      const updatedPayload = (action.payload || []).map(
        ({ layoutName, ...rest }) => ({ ...rest, name: layoutName })
      );
      action.payload = updatedPayload;
      return makeSFObjFieldValues(action, sfObjFieldValues, 'printPageLayout');
    case SEARCH_EXTENDED_ITEM:
      makeSFObjFieldValues(
        action,
        sfObjFieldValues,
        'extendedItemTextId',
        null,
        { inputType: 'Text' }
      );
      makeSFObjFieldValues(
        action,
        sfObjFieldValues,
        'extendedItemDateId',
        null,
        { inputType: 'Date' }
      );
      makeSFObjFieldValues(
        action,
        sfObjFieldValues,
        'extendedItemLookupId',
        null,
        { inputType: 'Lookup' }
      );
      const vals = makeSFObjFieldValues(
        action,
        sfObjFieldValues,
        'extendedItemPicklistId',
        null,
        { inputType: 'Picklist' }
      );
      return vals;
    case SEARCH_EXTENDED_ITEM_PSA:
      makeSFObjFieldValues(
        action,
        sfObjFieldValues,
        'extendedItemTextId',
        null,
        { inputType: 'Text' }
      );
      makeSFObjFieldValues(
        action,
        sfObjFieldValues,
        'extendedItemDateId',
        null,
        { inputType: 'Date' }
      );
      const valsPSA = makeSFObjFieldValues(
        action,
        sfObjFieldValues,
        'extendedItemPicklistId',
        null,
        { inputType: 'Picklist' }
      );
      return valsPSA;
    case SEARCH_EXTENDED_ITEM_CUSTOM:
      return makeSFObjFieldValues(
        action,
        sfObjFieldValues,
        'extendedItemCustomId'
      );
    case SEARCH_TAX_TYPE:
      return makeSFObjFieldValues(action, sfObjFieldValues, 'taxTypeId');
    case SEARCH_EMPLOYEE:
      return makeSFObjFieldValues(action, sfObjFieldValues, 'employeeId');
    case SEARCH_JOB_TYPE:
      return makeSFObjFieldValues(action, sfObjFieldValues, 'jobTypeId');
    case SEARCH_PERMISSION:
      return makeSFObjFieldValues(action, sfObjFieldValues, 'permissionId');
    case COM_SEARCH_FEATURE_ACCESS:
      return makeSFObjFieldValues(
        action,
        sfObjFieldValues,
        'comFeatureAccessId'
      );
    case ATT_SEARCH_FEATURE_ACCESS:
      return makeSFObjFieldValues(
        action,
        sfObjFieldValues,
        'attFeatureAccessId'
      );
    case EXP_SEARCH_FEATURE_ACCESS:
      return makeSFObjFieldValues(
        action,
        sfObjFieldValues,
        'expFeatureAccessId'
      );
    case TIME_SEARCH_FEATURE_ACCESS:
      return makeSFObjFieldValues(
        action,
        sfObjFieldValues,
        'timeFeatureAccessId'
      );
    case PSA_SEARCH_FEATURE_ACCESS:
      return makeSFObjFieldValues(
        action,
        sfObjFieldValues,
        'psaFeatureAccessId'
      );
    case SEARCH_LEAVE:
      const leaveGroup = groupLeaves(action.payload);
      sfObjFieldValues.leaveCode = leaveGroup.allowable.map((leave) => ({
        id: leave.id,
        label: leave.name,
        value: leave.code,
      }));
      sfObjFieldValues.annualLeaveId = leaveGroup.allowable
        .filter((leave) => {
          return leave.leaveType === 'Annual';
        })
        .map((leave) => ({
          label: leave.name,
          value: leave.id,
        }));
      sfObjFieldValues.substituteLeaveCode = leaveGroup.substitute.map(
        (leave) => ({
          id: leave.id,
          label: leave.name,
          value: leave.code,
        })
      );
      return sfObjFieldValues;
    case SEARCH_SHORT_TIME_WORK_REASON:
      return makeSFObjFieldValues(action, sfObjFieldValues, 'reasonId');
    case SEARCH_TIME_SETTING:
      return makeSFObjFieldValues(action, sfObjFieldValues, 'timeSettingId');
    case SEARCH_WORKING_TYPE:
      return makeSFObjFieldValues(action, sfObjFieldValues, 'workingTypeId');
    case SEARCH_LEGAL_AGREEMENT_GROUP:
      return makeSFObjFieldValues(
        action,
        sfObjFieldValues,
        'legalAgreementGroupId'
      );
    case SEARCH_ATT_EXTENDED_ITEM:
      const extendedItemTextValues = [];
      const extendedItemNumericValues = [];
      const extendedItemPickListValues = [];
      const extendedItemDateValues = [];
      const extendedItemTimeValues = [];
      const deviationReasonExtendedItem = [];

      action.payload.forEach((config) => {
        if (config.inputType === 'PickList') {
          extendedItemPickListValues.push(config);
          deviationReasonExtendedItem.push(config);
        }
        if (config.inputType === 'Text') {
          extendedItemTextValues.push(config);
        }
        if (config.inputType === 'Date') {
          extendedItemDateValues.push(config);
        }
        if (config.inputType === 'Time') {
          extendedItemTimeValues.push(config);
        }
        if (config.inputType === 'Numeric') {
          extendedItemNumericValues.push(config);
        }
      });
      const defaultValue = '';
      const defaultSelection = {
        code: defaultValue,
        name: msg().Admin_Lbl_PleaseSelect,
        name_L0: defaultValue,
        name_L1: defaultValue,
      };
      extendedItemTextValues.unshift(defaultSelection);
      extendedItemNumericValues.unshift(defaultSelection);
      extendedItemPickListValues.unshift(defaultSelection);
      deviationReasonExtendedItem.unshift({
        id: defaultValue,
        name: msg().Admin_Lbl_PleaseSelect,
      });
      extendedItemDateValues.unshift(defaultSelection);
      extendedItemTimeValues.unshift(defaultSelection);

      sfObjFieldValues.extendedItemPickListValues = (
        extendedItemPickListValues || []
      ).map(({ code, name, name_L0, name_L1 }) => ({
        code,
        label: name,
        value: code,
        name_L0,
        name_L1,
      }));
      sfObjFieldValues.deviationReasonExtendedItem = (
        deviationReasonExtendedItem || []
      ).map(({ id, name }) => ({
        id,
        label: name,
        value: id,
      }));
      sfObjFieldValues.extendedItemTextValues = (
        extendedItemTextValues || []
      ).map(({ code, name, name_L0, name_L1 }) => ({
        code,
        label: name,
        value: code,
        name_L0,
        name_L1,
      }));
      sfObjFieldValues.extendedItemDateValues = (
        extendedItemDateValues || []
      ).map(({ code, name, name_L0, name_L1 }) => ({
        code,
        label: name,
        value: code,
        name_L0,
        name_L1,
      }));
      sfObjFieldValues.extendedItemTimeValues = (
        extendedItemTimeValues || []
      ).map(({ code, name, name_L0, name_L1 }) => ({
        code,
        label: name,
        value: code,
        name_L0,
        name_L1,
      }));
      sfObjFieldValues.extendedItemNumericValues = (
        extendedItemNumericValues || []
      ).map(({ code, name, name_L0, name_L1 }) => ({
        code,
        label: name,
        value: code,
        name_L0,
        name_L1,
      }));
      return sfObjFieldValues;
    case SEARCH_LATE_ARRIVAL_EARLY_LEAVE_REASON:
      const lateArrivalCode = lateArrivalReasons(action.payload);
      const earlyLeaveCode = earlyLeaveReasons(action.payload);
      sfObjFieldValues.lateArrivalReasonCodeList =
        lateArrivalCode.lateArrival.map((reason) => ({
          id: reason.id,
          label: reason.code + ':' + reason.name,
          value: reason.code,
        }));
      sfObjFieldValues.earlyLeaveReasonCodeList = earlyLeaveCode.earlyLeave.map(
        (reason) => ({
          id: reason.id,
          label: reason.code + ':' + reason.name,
          value: reason.code,
        })
      );
      return makeSFObjFieldValues(
        action,
        sfObjFieldValues,
        'lateArrivalEarlyLeaveReasonId'
      );
    case SEARCH_LEGAL_AGREEMENT:
      return makeSFObjFieldValues(action, sfObjFieldValues, 'legalAgreementId');
    case SEARCH_ATT_PATTERN:
      return sfObjFieldValues;
    case SEARCH_OBJECTIVELY_EVENT_LOG_SETTING:
      sfObjFieldValues.objectivelyEventLog = (action.payload || []).map(
        ({ id, name }) => ({
          id,
          label: name,
          value: id,
        })
      );
      return sfObjFieldValues;
    case SEARCH_RECORD_EXTENDED_ITEM_SET:
      sfObjFieldValues.recordExtendedItemSet = (action.payload || []).map(
        ({ id, name }) => ({
          id,
          label: name,
          value: id,
        })
      );
      return sfObjFieldValues;
    case SEARCH_RECORD_DISPLAY_FIELD_LAYOUT:
      sfObjFieldValues.timesheet = (action.payload || []).map(
        ({ code, name }) => ({
          code,
          label: name,
          value: code,
        })
      );
      return sfObjFieldValues;
    case SEARCH_REST_REASON:
      sfObjFieldValues.attRestReasonCodeList = (action.payload || []).map(
        ({ id, name, code }) => ({
          id,
          label: name,
          value: code,
        })
      );
      return sfObjFieldValues;
    case SEARCH_ALLOWANCE:
      sfObjFieldValues.attAllowanceCodeList = (action.payload || []).map(
        ({ id, name, code }) => ({
          id,
          label: name,
          value: code,
        })
      );
      return sfObjFieldValues;
    case SEARCH_AGREEMENT_ALERT_SETTING:
      return makeSFObjFieldValues(
        action,
        sfObjFieldValues,
        'agreementAlertSettingId'
      );
    case SEARCH_WORK_CATEGORY:
      return makeSFObjFieldValues(action, sfObjFieldValues, 'workCategoryId');
    case SEARCH_ATTENDANCE_CALENDAR:
      return makeSFObjFieldValues(
        {
          ...action,
          payload: filterBySelectable(action.payload),
        },
        sfObjFieldValues,
        'calendarId'
      );
    case SEARCH_EMPLOYEE_GROUP:
      return makeSFObjFieldValues(
        action,
        sfObjFieldValues,
        'expEmployeeGroupId'
      );
    case SEARCH_JOB_GRADE:
      return makeSFObjFieldValues(action, sfObjFieldValues, 'jobGradeId');
    case SEARCH_PSA_WORK_SCHEME:
      return makeSFObjFieldValues(action, sfObjFieldValues, 'psaWorkSchemeId');
    case SEARCH_CATEGORY:
      return makeSFObjFieldValues(action, sfObjFieldValues, 'categoryId');
    case SEARCH_CURRENCY:
      return makeSFObjFieldValues(action, sfObjFieldValues, 'currencyId', [
        'isoCurrencyCode',
      ]);
    case SEARCH_ISO_CURRENCY_CODE:
      return makeSFObjFieldValues(action, sfObjFieldValues, 'isoCurrencyCode', [
        'value',
        'label',
      ]);
    case GET_CURRENCY_PAIR:
      return makeSFObjFieldValues(action, sfObjFieldValues, 'currencyPair', [
        'value',
        'label',
      ]);
    case GET_CONSTANTS_CALENDAR:
      return { ...sfObjFieldValues, ...constantsCalendar };
    case GET_CONSTANTS_LATE_ARRIVAL_EARLY_LEAVE_REASON:
      return { ...sfObjFieldValues, ...constantsLateArrivalEarlyLeaveReason };
    case GET_CONSTANTS_LEAVE:
      return { ...sfObjFieldValues, ...constantsLeave };
    case GET_CONSTANTS_LEAVE_DETAIL:
      return { ...sfObjFieldValues, ...constantsLeave };
    case GET_CONSTANTS_LEAVE_OF_ABSENCE:
      return { ...sfObjFieldValues, ...constantsLeaveOfAbsence };
    case GET_CONSTANTS_LEGALAGREEMENT:
      return { ...sfObjFieldValues, ...constantsLegalAgreement };
    case GET_CONSTANTS_ALLOWANCE:
      return { ...sfObjFieldValues, ...constantsAllowance };
    case GET_CONSTANTS_SCOPED_ASSIGNMENT:
      return { ...sfObjFieldValues, ...constantsScopedAssignment };
    case GET_CONSTANTS_SHORT_TIME_WORK_SETTING:
      return { ...sfObjFieldValues, ...constantsShortTimeWorkSettings };
    case GET_CONSTANTS_WORKING_TYPE:
      return { ...sfObjFieldValues, ...constantsWorkingType };
    case GET_CONSTANTS_ATTENDANCE_FEATURE_SETTING:
      return { ...sfObjFieldValues, ...constantsAttendanceFeatureSetting };
    case GET_CONSTANTS_ATT_PATTERN:
      return { ...sfObjFieldValues, ...constantsAttPattern };
    case GET_CONSTANTS_TIME_SETTING:
      return { ...sfObjFieldValues, ...constantsTimeSetting };
    case GET_CONSTANTS_EXPENSE_TYPE:
      return { ...sfObjFieldValues, ...constantsExpenseType };
    case GET_CONSTANTS_BANK_ACCOUNT_TYPE:
      return { ...sfObjFieldValues, ...constantsBankAccountType };
    case GET_CONSTANTS_VENDOR_USED:
      return { ...sfObjFieldValues, ...constantsVendorUsed };
    case GET_CONSTANTS_JOB_USED:
      return { ...sfObjFieldValues, ...constantsJobUsed };
    case GET_CONSTANTS_COST_CENTER_USED:
      return { ...sfObjFieldValues, ...constantsCostCenterUsed };
    case GET_CONSTANTS_EXTENDED_ITEM:
      return { ...sfObjFieldValues, ...constantsExtendedItem };
    case GET_CONSTANTS_EXTENDED_ITEM_PSA:
      return { ...sfObjFieldValues, ...constantsExtendedItemPSA };
    case GET_CONSTANTS_FINANCE_TYPE:
      return { ...sfObjFieldValues, ...constantsFinanceType };
    case GET_CONSTANTS_EXP_SETTING:
      return { ...sfObjFieldValues, ...constantsExpSetting };
    case SET_DEFAULT_LANGUAGE:
      sfObjFieldValues.defaultLanguage = action.payload;
      return sfObjFieldValues;
    case GET_CONSTANTS_ATTLEGAL_AGREEMENT_GROP:
      return { ...sfObjFieldValues, ...constantsAttLegalAgreementGroup };
    case GET_CONSTANTS_ATT_EXTENDED_ITEM:
      return { ...sfObjFieldValues, ...constantsAttExtendedItem };
    default:
      return state;
  }
}
