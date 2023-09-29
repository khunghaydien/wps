/* eslint   @typescript-eslint/no-unused-vars: 0 */
import { combineReducers } from 'redux';

import costCenterDialog from '../../commons/modules/costCenterDialog';
import common from '../../commons/reducers';

import routeList from '../../domain/modules/exp/jorudan/route';
import commuterRoute from '../../expenses-pc/modules/ui/expenses/recordItemPane/routeForm';
import adminCommon from '../modules/adminCommon';
import agreementAlertSetting from '../modules/agreement-alert-setting';
import annualPaidLeaveManagement from '../modules/annual-paid-leave-management';
import featureSetting from '../modules/attendanceFeatureSetting';
import attPatternEmployeeBatch from '../modules/attPatternEmployeeBatch';
import base from '../modules/base';
import detailPane from '../modules/base/detail-pane';
import calendar from '../modules/calendar';
import delegateApplicant from '../modules/delegateApplicant';
import delegateApprover from '../modules/delegateApprover';
import employee from '../modules/employee';
import employeeMemberLinkConfig from '../modules/employeeMemberLinkConfig';
import exchangeRate from '../modules/exchangeRate';
import expenseType from '../modules/expense-type';
import expTaxType from '../modules/expTaxType';
import expTypeLinkConfig from '../modules/expTypeLinkConfig';
import fixedAllowanceList from '../modules/fixedAllowanceList';
import fractionGrant from '../modules/fractionGrant';
import groupReportType from '../modules/groupReportType';
import job from '../modules/job';
import jobType from '../modules/job-type';
import leaveOfAbsencePeriodStatus from '../modules/leaveOfAbsencePeriodStatus';
import legalAgreement from '../modules/legalAgreement';
import managedLeaveManagement from '../modules/managed-leave-management';
import mobileSetting from '../modules/mobileSetting';
import pattern from '../modules/pattern';
import resourceGroupMemberLinkConfig from '../modules/resourceGroupMemberLinkConfig';
import shortTimeWorkPeriodStatus from '../modules/shortTimeWorkPeriodStatus';
import skillsetLinkConfig from '../modules/skillsetLinkConfig';
import vendor from '../modules/vendor';
import workCategory from '../modules/work-category';
import workingType from '../modules/workingType';

import editRecord from './editRecord';
import editRecordHistory from './editRecordHistory';
import getCurrencyPair from './getCurrencyPair';
import getOrganizationSetting from './getOrganizationSetting';
import getPsaBatchJob from './getPsaBatchJob';
import searchAccountingPeriod from './searchAccountingPeriod';
import searchAllowance from './searchAllowance';
import searchAttendanceFeatureSetting from './searchAttendanceFeatureSetting';
import searchAttExtendedItem from './searchAttExtendedItem';
import searchAttOpsRecord from './searchAttFeatureSettingOpsRecord';
import searchAttPattern from './searchAttPattern';
import searchRecordExtendedItemSet from './searchAttRecordExtendedItemSet';
import searchCategory from './searchCategory';
import searchCompany from './searchCompany';
import searchCostCenter from './searchCostCenter';
import searchCountry from './searchCountry';
import searchCreditCard from './searchCreditCard';
import searchCreditCardAssign from './searchCreditCardAssign';
import searchCurrency from './searchCurrency';
import searchCustomHint from './searchCustomHint';
import searchDepartment from './searchDepartment';
import searchEmployee from './searchEmployee';
import searchEmployeeGroup from './searchEmployeeGroup';
import searchExpenseType from './searchExpenseType';
import searchExpSetting from './searchExpSetting';
import searchExpTypeGroup from './searchExpTypeGroup';
import searchExtendedItem from './searchExtendedItem';
import searchExtendedItemCustom from './searchExtendedItemCustom';
import searchExtendedItemPSA from './searchExtendedItemPSA';
import searchFinanceCategory from './searchFinanceCategory';
import searchHistory from './searchHistory';
import searchIsoCurrencyCode from './searchIsoCurrencyCode';
import searchJobGrade from './searchJobGrade';
import searchLateArrivalEarlyLeaveReason from './searchLateArrivalEarlyLeaveReason';
import searchLeave from './searchLeave';
import searchLeaveDetail from './searchLeaveDetail';
import searchLeaveOfAbsence from './searchLeaveOfAbsence';
import searchLegalAgreement from './searchLegalAgreement';
import searchLegalAgreementGroup from './searchLegalAgreementGroup';
import searchManagerList from './searchManagerList';
import searchObjectivelyEventLogSetting from './searchObjectivelyEventLogSetting';
import searchPermission from './searchPermission';
import searchPlannerSetting from './searchPlannerSetting';
import searchProjectManagerGroup from './searchProjectManagerGroup';
import searchPsaSetting from './searchPsaSetting';
import searchPsaWorkScheme from './searchPsaWorkScheme';
import searchReportType from './searchReportType';
import searchResourceGroup from './searchResourceGroup';
import searchRestReason from './searchRestReason';
import searchShortTimeWorkReason from './searchShortTimeWorkReason';
import searchShortTimeWorkSetting from './searchShortTimeWorkSetting';
import searchSkillset from './searchSkillset';
import searchTalentProfile from './searchTalentProfile';
import searchTaxType from './searchTaxType';
import searchTimeSetting from './searchTimeSetting';
import searchVendor from './searchVendor';
import searchWorkArrangement from './searchWorkArrangement';
import searchWorkCategory from './searchWorkCategory';
import searchWorkingType from './searchWorkingType';
import sfObjFieldValues from './sfObjFieldValues';
import tmpEditRecord from './tmpEditRecord';
import tmpEditRecordHistory from './tmpEditRecordHistory';
import value2msgkey from './value2msgkey';

// eslint-disable-next-line no-unused-vars
function env(state: Record<string, any> = {}, action: Record<string, any>) {
  return state;
}

export const reducers = {
  attPatternEmployeeBatch,
  env,
  common,
  adminCommon,
  base,
  delegateApprover,
  delegateApplicant,
  fractionGrant,
  job,
  jobType,
  agreementAlertSetting,
  editRecord,
  editRecordHistory,
  getOrganizationSetting,
  getPsaBatchJob,
  searchCustomHint,
  searchExpSetting,
  searchAccountingPeriod,
  searchCompany,
  searchCostCenter,
  searchCountry,
  searchCreditCard,
  searchCreditCardAssign,
  searchCurrency,
  searchIsoCurrencyCode,
  getCurrencyPair,
  searchDepartment,
  searchEmployee,
  searchExpenseType,
  searchExpTypeGroup,
  searchExtendedItem,
  searchExtendedItemPSA,
  searchExtendedItemCustom,
  searchFinanceCategory,
  searchTaxType,
  searchHistory,
  searchObjectivelyEventLogSetting,
  mobileSetting,
  searchLeave,
  searchLeaveDetail,
  searchAllowance,
  searchRestReason,
  searchAttExtendedItem,
  searchLateArrivalEarlyLeaveReason,
  searchRecordExtendedItemSet,
  searchLegalAgreementGroup,
  searchLeaveOfAbsence,
  searchShortTimeWorkSetting,
  searchShortTimeWorkReason,
  searchTimeSetting,
  calendar,
  shortTimeWorkPeriodStatus,
  leaveOfAbsencePeriodStatus,
  annualPaidLeaveManagement,
  managedLeaveManagement,
  searchPlannerSetting,
  searchWorkCategory,
  searchWorkingType,
  searchAttendanceFeatureSetting,
  searchAttOpsRecord,
  searchLegalAgreement,
  searchAttPattern,
  sfObjFieldValues,
  tmpEditRecord,
  tmpEditRecordHistory,
  value2msgkey,
  detailPane,
  exchangeRate,
  commuterRoute,
  routeList,
  searchReportType,
  searchPermission,
  searchVendor,
  searchEmployeeGroup,
  groupReportType,
  expTypeLinkConfig,
  fixedAllowanceList,
  searchCategory,
  searchSkillset,
  searchTalentProfile,
  searchJobGrade,
  searchPsaWorkScheme,
  searchWorkArrangement,
  searchPsaSetting,
  skillsetLinkConfig,
  employee,
  workCategory,
  workingType,
  featureSetting,
  expenseType,
  vendor,
  searchResourceGroup,
  searchProjectManagerGroup,
  searchManagerList,
  employeeMemberLinkConfig,
  resourceGroupMemberLinkConfig,
  expTaxType,
  costCenterDialog,
  legalAgreement,
  pattern,
};

const rootReducer = combineReducers(reducers);
export type State = ReturnType<typeof rootReducer>;
export default rootReducer;
