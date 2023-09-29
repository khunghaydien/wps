import { UserSetting } from '../../domain/models/UserSetting';
import { MileageUnit } from '@apps/domain/models/exp/Mileage';

import { Action, GET_USER_SETTING } from '../actions/userSetting';

export type State = UserSetting;

const initialState: State = {
  organizationSetting: undefined,
  expTaxRoundingSetting: undefined,
  id: '',
  name: '',
  userName: '',
  photoUrl: '',
  language: '',
  locale: '',
  organization: {
    id: '',
    isSandbox: false,
    enableErrorTracking: false,
  },
  managerName: '',
  companyId: '',
  companyName: '',
  costCenterHistoryId: '',
  costCenterCode: '',
  costCenterName: '',
  departmentId: '',
  departmentCode: '',
  departmentName: '',
  displayCalendarOnExpenseModule: false,
  employeeId: '',
  employeeCode: '',
  employeeName: '',
  allowToChangeApproverSelf: false,
  allowTaxAmountChange: false,
  allowTaxExcludedAmountInput: false,
  approver01Name: '',
  currencySymbol: '',
  currencyDecimalPlaces: 0,
  expRoundingSetting: '',
  useCustomRequest: false,
  useExpense: false,
  useExpenseRequest: false,
  useAttendance: false,
  usePlanner: false,
  usePsa: false,
  useWorkTime: false,
  useReceiptScan: false,
  useImageQualityCheck: false,
  useTransitManager: false,
  useTimeTrackingChargeTransfer: false,
  useJobSearchAndSelect: false,
  useCreditCardIntegrationForMobile: false,
  useICCardIntegrationForMobile: false,
  currencyId: '',
  currencyCode: '',
  allowApproveExpInDiffCompany: false,
  belongsToResourceGroup: false,
  useCompanyVendor: false,
  usePersonalVendor: false,
  empHistoryValidFrom: '',
  empHistoryValidTo: '',
  empGroupId: '',
  expMileageUnit: MileageUnit.KILOMETER,
  jctInvoiceManagement: false,
  viewAttDailyRequestApproval: false,
  viewAttRequestApproval: false,
  viewAttLegalAgreementRequestApproval: false,
  viewAttFixDailyRequestApproval: false,
  alwaysDisplaySettlementAmount: false,
  nonInvoiceWarning: false,
  allowBulkApprovalRejectExp: false,
  isPM: true,
};

export default function userSettingReducer(
  state: State = initialState,
  action: Action
): State {
  switch (action.type) {
    case GET_USER_SETTING:
      return action.payload;
    default:
      return state;
  }
}
