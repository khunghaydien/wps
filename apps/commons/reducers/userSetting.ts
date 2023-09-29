import { UserSetting } from '../../domain/models/UserSetting';

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
  employeeId: '',
  employeeCode: '',
  employeeName: '',
  allowToChangeApproverSelf: false,
  allowTaxAmountChange: false,
  allowTaxExcludedAmount: false,
  approver01Name: '',
  currencySymbol: '',
  currencyDecimalPlaces: 0,
  expRoundingSetting: '',
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
  currencyId: '',
  currencyCode: '',
  useMasterCardImport: false,
  allowApproveExpInDiffCompany: false,
  belongsToResourceGroup: false,
  useCompanyVendor: false,
  usePersonalVendor: false,
  empHistoryValidFrom: '',
  empHistoryValidTo: '',
  empGroupId: '',
  jctInvoiceManagement: false,
  nonInvoiceWarning: false,
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
