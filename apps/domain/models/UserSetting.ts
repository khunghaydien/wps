import { RoundingType } from '@apps/domain/models/exp/foreign-currency/Currency';

import { TaxDetailType } from './exp/TaxType';
import { Organization } from './organization/Organization';

export type OrganizationSetting = {
  language0: string;
  language1?: string;
  language2?: string;
};

export type UserSetting = {
  expTaxRoundingSetting: RoundingType;
  expDisplayTaxDetailsSetting?: TaxDetailType;
  id: string;
  userName: string;
  name: string;
  photoUrl: string;
  language: string;
  locale: string;
  organization: Organization;
  organizationSetting: OrganizationSetting;
  companyId: string;
  companyName: string;
  departmentId: string;
  departmentCode: string;
  departmentName: string;
  employeeId: string;
  employeeCode: string;
  employeeName: string;
  currencyId: string;
  currencyCode: string;
  currencySymbol: string;
  currencyDecimalPlaces: number;
  useExpense: boolean;
  useExpenseRequest: boolean;
  useReceiptScan: boolean;
  useTransitManager: boolean;
  useAttendance: boolean;
  usePlanner: boolean;
  usePsa: boolean;
  useWorkTime: boolean;
  useTimeTrackingChargeTransfer: boolean;
  useJobSearchAndSelect: boolean;
  useCompanyVendor: boolean;
  usePersonalVendor: boolean;
  useImageQualityCheck: boolean;
  managerName: string;
  allowToChangeApproverSelf: boolean;
  allowTaxAmountChange: boolean;
  approver01Name: string;
  costCenterHistoryId: string;
  costCenterCode: string;
  costCenterName: string;
  expRoundingSetting: string;
  useMasterCardImport: boolean;
  allowApproveExpInDiffCompany: boolean;
  allowTaxExcludedAmount: boolean;
  customerId?: string;
  salesId?: string;
  belongsToResourceGroup: boolean;
  timeZone?: string;
  empHistoryValidFrom: string;
  empHistoryValidTo: string;
  empGroupId: string;
  sfCompanyDefaultCurrencyCode?: string;
  jctInvoiceManagement?: boolean;
  nonInvoiceWarning?: boolean;
};
