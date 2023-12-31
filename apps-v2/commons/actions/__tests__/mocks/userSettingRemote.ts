import { UserSetting } from '../../../../domain/models/UserSetting';

// eslint-disable-next-line import/prefer-default-export
export const userSettingRemote: UserSetting = {
  organizationSetting: undefined,
  useCompanyVendor: false,
  usePersonalVendor: false,
  expTaxRoundingSetting: undefined,
  allowTaxExcludedAmountInput: false,
  belongsToResourceGroup: false,
  locale: '',
  useReceiptScan: false,
  useTransitManager: false,
  useImageQualityCheck: false,
  id: '',
  name: '',
  userName: '',
  photoUrl: '',
  language: 'en-GB',
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
  useTimeTrackingChargeTransfer: false,
  useJobSearchAndSelect: false,
  useCreditCardIntegrationForMobile: false,
  useICCardIntegrationForMobile: false,
  currencyId: '',
  currencyCode: '',
  allowApproveExpInDiffCompany: false,
  empHistoryValidFrom: '',
  empHistoryValidTo: '',
  empGroupId: '',
  jctInvoiceManagement: false,
  viewAttDailyRequestApproval: true,
  viewAttRequestApproval: true,
  viewAttLegalAgreementRequestApproval: true,
  viewAttFixDailyRequestApproval: true,
};
