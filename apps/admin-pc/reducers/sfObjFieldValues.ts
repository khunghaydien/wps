import _ from 'lodash';

import constantsAttPattern from '../constants/fieldValues/attPattern';
import constantsCalendar from '../constants/fieldValues/calendar';
import constantsCostCenterUsed from '../constants/fieldValues/costCenterUsedOption';
import constantsExpenseType from '../constants/fieldValues/expenseType';
import constantsExpSetting from '../constants/fieldValues/expSetting';
import constantsExtendedItem from '../constants/fieldValues/extendedItem';
import constantsExtendedItemPSA from '../constants/fieldValues/extendedItemPSA';
import constantsJobUsed from '../constants/fieldValues/jobUsedOption';
import constantsLeave from '../constants/fieldValues/leave';
import constantsLeaveOfAbsence from '../constants/fieldValues/LeaveOfAbsence';
import constantsScopedAssignment from '../constants/fieldValues/scopedAssignment';
import constantsShortTimeWorkSettings from '../constants/fieldValues/shortTimeWorkSettings';
import constantsTimeSetting from '../constants/fieldValues/timeSetting';
import constantsVendorUsed from '../constants/fieldValues/vendorUsedOption';
import constantsWorkingType from '../constants/fieldValues/workingType';

import { constantsBankAccountType } from '../../domain/models/exp/Vendor';
import { filterBySelectable } from '../models/calendar/Calendar';

import { SEARCH_AGREEMENT_ALERT_SETTING } from '../modules/agreement-alert-setting/entities';
import { GET_CONSTANTS_CALENDAR } from '../modules/calendar';

import {
  GET_CONSTANTS_ATT_PATTERN,
  SEARCH_ATT_PATTERN,
} from '../actions/attPattern';
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
import { GET_CONSTANTS_SCOPED_ASSIGNMENT } from '../actions/job';
import { SEARCH_JOB_GRADE } from '../actions/jobGrade';
import { SEARCH_JOB_TYPE } from '../actions/jobType';
import { GET_CONSTANTS_LEAVE, SEARCH_LEAVE } from '../actions/leave';
import { GET_CONSTANTS_LEAVE_OF_ABSENCE } from '../actions/leaveOfAbsence';
import { SEARCH_PERMISSION } from '../actions/permission';
import { SEARCH_PSA_GROUP } from '../actions/psaGroup';
import {
  GET_CONSTANTS_COST_CENTER_USED,
  GET_CONSTANTS_JOB_USED,
  GET_CONSTANTS_VENDOR_USED,
} from '../actions/reportType';
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

const groupLeaves = (leaves) => ({
  allowable: leaves.filter(
    (leave) =>
      leave.leaveType === 'Annual' ||
      leave.leaveType === 'Paid' ||
      leave.leaveType === 'Unpaid'
  ),
  substitute: leaves.filter((leave) => leave.leaveType === 'Substitute'),
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
    case SEARCH_LEAVE:
      const leaveGroup = groupLeaves(action.payload);
      sfObjFieldValues.leaveCode = leaveGroup.allowable.map((leave) => ({
        id: leave.id,
        label: leave.name,
        value: leave.code,
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
    case SEARCH_ATT_PATTERN:
      sfObjFieldValues.attPatternCode = (action.payload || []).map(
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
    case SEARCH_CATEGORY:
      return makeSFObjFieldValues(action, sfObjFieldValues, 'categoryId');
    case SEARCH_PSA_GROUP:
      return makeSFObjFieldValues(action, sfObjFieldValues, 'PSAGroupId');
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
    case GET_CONSTANTS_LEAVE:
      return { ...sfObjFieldValues, ...constantsLeave };
    case GET_CONSTANTS_LEAVE_OF_ABSENCE:
      return { ...sfObjFieldValues, ...constantsLeaveOfAbsence };
    case GET_CONSTANTS_SCOPED_ASSIGNMENT:
      return { ...sfObjFieldValues, ...constantsScopedAssignment };
    case GET_CONSTANTS_SHORT_TIME_WORK_SETTING:
      return { ...sfObjFieldValues, ...constantsShortTimeWorkSettings };
    case GET_CONSTANTS_WORKING_TYPE:
      return { ...sfObjFieldValues, ...constantsWorkingType };
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
    case GET_CONSTANTS_EXP_SETTING:
      return { ...sfObjFieldValues, ...constantsExpSetting };
    case SET_DEFAULT_LANGUAGE:
      sfObjFieldValues.defaultLanguage = action.payload;
      return sfObjFieldValues;
    default:
      return state;
  }
}
