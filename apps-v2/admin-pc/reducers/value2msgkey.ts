import _ from 'lodash';

import constantsAllowance from '../constants/fieldValues/allowance';
import constantsAttPattern from '../constants/fieldValues/attPattern';
import constantsCostCenterUsed from '../constants/fieldValues/costCenterUsedOption';
import constantsExpenseType from '../constants/fieldValues/expenseType';
import constantsExpSetting from '../constants/fieldValues/expSetting';
import constantFinanceType from '../constants/fieldValues/financeType';
import constantsJobUsed from '../constants/fieldValues/jobUsedOption';
import constantsLeave from '../constants/fieldValues/leave';
import constantsLegalAgreement from '../constants/fieldValues/legalAgreement';
import constantsOrgHierarchy from '../constants/fieldValues/orgHierarchyPattern';
import constantsShortTimeWorkSettings from '../constants/fieldValues/shortTimeWorkSettings';
import constantsSkillset from '../constants/fieldValues/skillset';
import constantsVendorUsed from '../constants/fieldValues/vendorUsedOption';
import constantsWorkingType from '../constants/fieldValues/workingType';

import { constantsBankAccountType } from '../../domain/models/exp/Vendor';

import { GET_CONSTANTS_ALLOWANCE } from '../actions/allowance';
import { GET_CONSTANTS_ATT_PATTERN } from '../actions/attPattern';
import { GET_CONSTANTS_EXPENSE_TYPE } from '../actions/expenseType';
import { GET_CONSTANTS_EXP_SETTING } from '../actions/expSetting';
import { GET_CONSTANTS_FINANCE_TYPE } from '../actions/financeCategory';
import { GET_CONSTANTS_LEAVE } from '../actions/leave';
import { GET_CONSTANTS_LEAVE_DETAIL } from '../actions/leaveDetail';
import { GET_CONSTANTS_LEGALAGREEMENT } from '../actions/legalAgreement';
import { GET_CONSTANTS_ORGANIZATION_HIERARCHY } from '../actions/organizationHierarchy';
import {
  GET_CONSTANTS_COST_CENTER_USED,
  GET_CONSTANTS_JOB_USED,
  GET_CONSTANTS_VENDOR_USED,
} from '../actions/reportType';
import { GET_CONSTANTS_SHORT_TIME_WORK_SETTING } from '../actions/shortTimeWorkSetting';
import { GET_CONSTANTS_SKILLSET } from '../actions/skillset';
import { GET_CONSTANTS_BANK_ACCOUNT_TYPE } from '../actions/vendor';
import { GET_CONSTANTS_WORKING_TYPE } from '../actions/workingType';

const initialState = {};

export function makeValue2MsgkeyObject(constants) {
  const ret = {};
  Object.keys(constants).forEach((key2) => {
    const values = {};
    Object.keys(constants[key2]).forEach((key3) => {
      values[constants[key2][key3].value] = constants[key2][key3].label;
    });
    ret[key2] = values;
  });
  return ret;
}

export default function value2msgkeyReducer(state = initialState, action) {
  const value2msgkey = _.cloneDeep(state);
  switch (action.type) {
    case GET_CONSTANTS_LEAVE:
      return {
        ...makeValue2MsgkeyObject(_.cloneDeep(constantsLeave)),
        ...value2msgkey,
      };
    case GET_CONSTANTS_LEAVE_DETAIL:
      return {
        ...makeValue2MsgkeyObject(_.cloneDeep(constantsLeave)),
        ...value2msgkey,
      };

    case GET_CONSTANTS_ALLOWANCE:
      return {
        ...makeValue2MsgkeyObject(_.cloneDeep(constantsAllowance)),
        ...value2msgkey,
      };

    case GET_CONSTANTS_LEGALAGREEMENT:
      return {
        ...makeValue2MsgkeyObject(_.cloneDeep(constantsLegalAgreement)),
        ...value2msgkey,
      };

    case GET_CONSTANTS_EXPENSE_TYPE:
      return {
        ...makeValue2MsgkeyObject(_.cloneDeep(constantsExpenseType)),
        ...value2msgkey,
      };

    case GET_CONSTANTS_BANK_ACCOUNT_TYPE:
      return {
        ...makeValue2MsgkeyObject(_.cloneDeep(constantsBankAccountType)),
        ...value2msgkey,
      };

    case GET_CONSTANTS_VENDOR_USED:
      return {
        ...makeValue2MsgkeyObject(_.cloneDeep(constantsVendorUsed)),
        ...value2msgkey,
      };
    case GET_CONSTANTS_JOB_USED:
      return {
        ...makeValue2MsgkeyObject(_.cloneDeep(constantsJobUsed)),
        ...value2msgkey,
      };
    case GET_CONSTANTS_COST_CENTER_USED:
      return {
        ...makeValue2MsgkeyObject(_.cloneDeep(constantsCostCenterUsed)),
        ...value2msgkey,
      };
    case GET_CONSTANTS_SHORT_TIME_WORK_SETTING:
      return {
        ...makeValue2MsgkeyObject(_.cloneDeep(constantsShortTimeWorkSettings)),
        ...value2msgkey,
      };

    case GET_CONSTANTS_WORKING_TYPE:
      return {
        ...makeValue2MsgkeyObject(_.cloneDeep(constantsWorkingType)),
        ...value2msgkey,
      };

    case GET_CONSTANTS_ATT_PATTERN:
      return {
        ...makeValue2MsgkeyObject(_.cloneDeep(constantsAttPattern)),
        ...value2msgkey,
      };

    case GET_CONSTANTS_EXP_SETTING:
      return {
        ...makeValue2MsgkeyObject(_.cloneDeep(constantsExpSetting)),
        ...value2msgkey,
      };

    case GET_CONSTANTS_SKILLSET:
      return {
        ...makeValue2MsgkeyObject(_.cloneDeep(constantsSkillset)),
        ...value2msgkey,
      };

    case GET_CONSTANTS_ORGANIZATION_HIERARCHY:
      return {
        ...makeValue2MsgkeyObject(_.cloneDeep(constantsOrgHierarchy)),
        ...value2msgkey,
      };

    case GET_CONSTANTS_FINANCE_TYPE:
      return {
        ...makeValue2MsgkeyObject(_.cloneDeep(constantFinanceType)),
        ...value2msgkey,
      };

    default:
      return state;
  }
}
