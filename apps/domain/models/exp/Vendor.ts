/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable camelcase */
import isNil from 'lodash/isNil';
import { $Values } from 'utility-types';

import { Order, order } from '../../../commons/constants/sort';

import Api from '../../../commons/api';
import msg from '../../../commons/languages';

export const VENDOR_PAYMENT_DUE_DATE_USAGE = Object.freeze({
  Optional: 'Optional',
  Required: 'Required',
  NotUsed: 'NotUsed',
  NONE: '', // DEFAULT VALUE
});

const BANK_ACCOUNT_TYPE = Object.freeze({
  Checking: 'Checking',
  Savings: 'Savings',
  NONE: '', // DEFAULT VALUE
});

export const vendorTypes = {
  COMPANY: 'company',
  PERSONAL: 'personal',
};

export type VendorType = $Values<typeof vendorTypes>;

export type VendorItem = {
  id: string;
  active: boolean;
  address: string;
  bankAccountNumber: string;
  bankAccountType: $Values<typeof BANK_ACCOUNT_TYPE>;
  bankCode: string;
  bankName: string;
  branchAddress: string;
  branchCode: string;
  branchName: string;
  code: string;
  companyId: string;
  correspondentBankAddress: string;
  correspondentBankName: string;
  correspondentBranchName: string;
  correspondentSwiftCode: string;
  country: string;
  currencyCode: string;
  isJctQualifiedInvoiceIssuer?: boolean;
  isWithholdingTax: boolean;
  jctRegistrationNumber?: string;
  name: string;
  name_L0?: string;
  name_L1?: string;
  name_L2?: string;
  payeeName: string;
  paymentDueDateUsage?: $Values<typeof VENDOR_PAYMENT_DUE_DATE_USAGE>;
  paymentTerm: string;
  paymentTermCode?: string;
  swiftCode: string;
  zipCode: string;
};

export type VendorItemList = {
  hasMore?: boolean;
  records: Array<VendorItem>;
};

export type Vendor = VendorItem;
export type VendorList = Array<VendorItem>;

export const initialVendor: VendorItem = {
  active: false,
  address: '',
  bankAccountNumber: '',
  bankAccountType: '',
  bankCode: '',
  bankName: '',
  branchAddress: '',
  branchCode: '',
  branchName: '',
  code: '',
  companyId: '',
  correspondentBankAddress: '',
  correspondentBankName: '',
  correspondentBranchName: '',
  correspondentSwiftCode: '',
  country: '',
  currencyCode: '',
  id: '',
  isWithholdingTax: false,
  name: '',
  name_L0: '',
  name_L1: '',
  name_L2: '',
  payeeName: '',
  paymentTerm: '',
  paymentTermCode: '',
  swiftCode: '',
  zipCode: '',
};

export const DEFAULT_LIMIT_NUMBER = 100;

export const paymentDueDateSettingOptions = [
  {
    msgkey: 'Exp_Sel_Optional',
    value: VENDOR_PAYMENT_DUE_DATE_USAGE.Optional,
  },
  {
    msgkey: 'Exp_Sel_Required',
    value: VENDOR_PAYMENT_DUE_DATE_USAGE.Required,
  },
  {
    msgkey: 'Exp_Sel_NoUsed',
    value: VENDOR_PAYMENT_DUE_DATE_USAGE.NotUsed,
  },
];

export const bankAccountType = [
  {
    label: 'Exp_Sel_BankChecking',
    value: BANK_ACCOUNT_TYPE.Checking,
  },
  {
    label: 'Exp_Sel_BankSavings',
    value: BANK_ACCOUNT_TYPE.Savings,
  },
];

export const constantsBankAccountType = { bankAccountType };

// based on access permission setting
export const generateVendorTypes = (
  { useCompanyVendor, usePersonalVendor },
  isFinanceApproval?: boolean
): VendorType[] => {
  if (isFinanceApproval) return [vendorTypes.COMPANY, vendorTypes.PERSONAL];
  if (usePersonalVendor && useCompanyVendor)
    return [vendorTypes.COMPANY, vendorTypes.PERSONAL];
  if (useCompanyVendor) return [vendorTypes.COMPANY];
  if (usePersonalVendor) return [vendorTypes.PERSONAL];
  return [vendorTypes.COMPANY, vendorTypes.PERSONAL];
};

const getBankAccountType = (value?: $Values<typeof BANK_ACCOUNT_TYPE>) => {
  if (value === BANK_ACCOUNT_TYPE.Checking) {
    return msg().Exp_Sel_BankChecking;
  } else if (value === BANK_ACCOUNT_TYPE.Savings) {
    return msg().Exp_Sel_BankSavings;
  }
  return null;
};

const getWithholdingTax = (isWithholding: boolean) =>
  isWithholding ? msg().Exp_Lbl_Yes : msg().Exp_Lbl_No;

const getPDDUsage = (usage?: $Values<typeof VENDOR_PAYMENT_DUE_DATE_USAGE>) => {
  let text;
  switch (usage) {
    case VENDOR_PAYMENT_DUE_DATE_USAGE.NotUsed:
      text = msg().Exp_Sel_NoUsed;
      break;
    case VENDOR_PAYMENT_DUE_DATE_USAGE.Required:
      text = msg().Exp_Sel_Required;
      break;
    case VENDOR_PAYMENT_DUE_DATE_USAGE.Optional:
      text = msg().Exp_Sel_Optional;
      break;
    default:
      text = msg().Exp_Sel_Optional;
  }
  return text;
};

export const getJctRegistrationNumber = (
  jctRegistrationNumber: string,
  isJctQualifiedInvoiceIssuer: boolean
) => {
  if (isJctQualifiedInvoiceIssuer && !jctRegistrationNumber) {
    return `(${msg().Exp_Lbl_JCTQualified})`;
  } else if (!isJctQualifiedInvoiceIssuer && !jctRegistrationNumber) {
    return '-';
  } else {
    return jctRegistrationNumber;
  }
};
const getJCTQualifiedInvoiceIssuer = (value: boolean) => {
  if (value) {
    return msg().Exp_Lbl_JCTQualified;
  }
  return msg().Exp_Lbl_JCTNotQualified;
};

export const getVendorDisplayObject = (
  info: VendorItem,
  useJctRegistrationNumber?: boolean
) => ({
  [msg().Exp_Lbl_Code]: info.code,
  [msg().Exp_Lbl_Name]: info.name,
  [msg().Exp_Lbl_JCTQualifiedInvoiceIssuer]: useJctRegistrationNumber
    ? getJCTQualifiedInvoiceIssuer(info.isJctQualifiedInvoiceIssuer)
    : null,
  [msg().Exp_Clbl_JctRegistrationNumber]: useJctRegistrationNumber
    ? getJctRegistrationNumber(
        info.jctRegistrationNumber,
        info.isJctQualifiedInvoiceIssuer
      )
    : null,
  [msg().Exp_Clbl_PaymentDate]: getPDDUsage(info.paymentDueDateUsage),
  [msg().Exp_Lbl_PaymentTerm]: info.paymentTerm,
  [msg().Exp_Lbl_PaymentTermCode]: info.paymentTermCode,
  [msg().Exp_Lbl_WithholdingTax]: getWithholdingTax(info.isWithholdingTax),
  [msg().Exp_Lbl_BankAccountType]: getBankAccountType(info.bankAccountType),
  [msg().Exp_Lbl_BankAccountNumber]: info.bankAccountNumber,
  [msg().Exp_Lbl_BankCode]: info.bankCode,
  [msg().Exp_Lbl_BankName]: info.bankName,
  [msg().Exp_Lbl_BranchCode]: info.branchCode,
  [msg().Exp_Lbl_BranchName]: info.branchName,
  [msg().Exp_Lbl_BranchAddress]: info.branchAddress,
  [msg().Exp_Lbl_PayeeName]: info.payeeName,
  [msg().Exp_Lbl_BankCurrency]: info.currencyCode,
  [msg().Exp_Lbl_SwiftCode]: info.swiftCode,
  [msg().Exp_Lbl_CorrespondentBankBankName]: info.correspondentBankName,
  [msg().Exp_Lbl_CorrespondentBankBranchName]: info.correspondentBranchName,
  [msg().Exp_Lbl_CorrespondentBankAddress]: info.correspondentBankAddress,
  [msg().Exp_Lbl_CorrespondentBankSwiftCode]: info.correspondentSwiftCode,
  [msg().Exp_Lbl_CountryCode]: info.country,
  [msg().Exp_Lbl_ZipCode]: info.zipCode,
  [msg().Exp_Lbl_Address]: info.address,
});

export const initialSortCondition = {
  field: 'code',
  order: order.ASC,
};

export const getVendorList = (
  companyId?: string,
  query?: string,
  employeeId?: string,
  idList?: string[]
): Promise<VendorItemList> => {
  return Api.invoke({
    path: '/exp/vendor/search',
    param: {
      companyId,
      active: true,
      query,
      maxCount: DEFAULT_LIMIT_NUMBER + 1,
      employeeId,
      idList,
    },
  }).then((response: VendorItemList) => {
    return response;
  });
};

export const getVendorDetail = (
  id?: string,
  employeeId?: string
): Promise<VendorItemList> => {
  return Api.invoke({
    path: '/exp/vendor/search',
    param: {
      id,
      employeeId,
    },
  }).then((response: VendorItemList) => {
    return response;
  });
};

export const getRecentlyUsedVendor = (
  employeeBaseId: string,
  isPersonalVendor?: boolean
): Promise<VendorItemList> =>
  Api.invoke({
    path: '/exp/vendor/recently-used/list',
    param: { employeeBaseId, isPersonalVendor },
  }).then((response: VendorItemList) => response);

export type PersonalVendorSaveRes = {
  id: string;
  name: string;
};

export const saveVendor = (
  vendor: VendorItem,
  employeeId: string
): Promise<PersonalVendorSaveRes> => {
  return Api.invoke({
    path: '/exp/vendor/create',
    param: { ...vendor, employeeId },
  }).then((res: PersonalVendorSaveRes) => res);
};

export const updateVendor = (
  vendor: VendorItem,
  empId: string
): Promise<PersonalVendorSaveRes> => {
  return Api.invoke({
    path: '/exp/vendor/update',
    param: { ...vendor, empId },
  }).then((response: PersonalVendorSaveRes) => response);
};

export const deleteVendor = (id: string) => {
  return Api.invoke({
    path: '/exp/vendor/delete',
    param: { id },
  }).then((response: string) => response);
};

export const undoVendorDelete = (id: string): Promise<void> =>
  Api.invoke({
    path: '/exp/vendor/restore',
    param: { id },
  });

export const searchIds = (
  param: SearchQuery
): Promise<{
  ids: string[];
  isOverLimit: boolean;
  totalCount: number;
}> => {
  const limitNumber = isNil(param.limitNumber)
    ? DEFAULT_LIMIT_NUMBER
    : param.limitNumber;
  return Api.invoke({
    path: '/exp/vendor/id/list',
    param: {
      ...param,
      limitNumber: limitNumber + 1,
    },
  }).then((res) => {
    const recordIds = res.idList || [];
    return {
      ids: recordIds.slice(0, limitNumber),
      isOverLimit: recordIds.length > limitNumber,
      totalCount: res.totalCount,
    };
  });
};

export const getVendorbyIds = (ids: string[]): Promise<VendorList> => {
  return Api.invoke({
    path: '/exp/vendor/list',
    param: { ids },
  }).then((result: { records: VendorList }) => {
    return (result.records || []).map((record) => record);
  });
};

// following code is used only in Admin screen
export type SearchQuery = {
  code?: string;
  companyId: string;
  employeeId?: string;
  limitNumber?: number;
  name?: string;
  sortCondition?: {
    field: string;
    order: Order;
  };
};

export const defaultValue: Vendor = {
  active: false,
  address: '',
  bankAccountNumber: '',
  bankAccountType: '',
  bankCode: '',
  bankName: '',
  branchAddress: '',
  branchCode: '',
  branchName: '',
  code: '',
  companyId: '',
  correspondentBankAddress: '',
  correspondentBankName: '',
  correspondentBranchName: '',
  correspondentSwiftCode: '',
  country: '',
  currencyCode: '',
  id: '',
  isWithholdingTax: false,
  name: '',
  payeeName: '',
  paymentTerm: '',
  paymentTermCode: '',
  swiftCode: '',
  zipCode: '',
  jctRegistrationNumber: '',
};

export const Repository = {
  /**
   * Execute to search vendor IDs
   */
  searchIds: async (
    param: SearchQuery
  ): Promise<{ ids: string[]; isOverLimit: boolean; totalCount: number }> => {
    const limitNumber = isNil(param.limitNumber)
      ? DEFAULT_LIMIT_NUMBER
      : param.limitNumber;
    const result: {
      idList: string[];
      totalCount: number;
    } = await Api.invoke({
      path: '/exp/vendor/id/list',
      param: {
        ...param,
        limitNumber: limitNumber + 1,
      },
    });
    const recordIds = result.idList || [];
    return {
      ids: recordIds.slice(0, limitNumber),
      isOverLimit: recordIds.length > limitNumber,
      totalCount: result.totalCount,
    };
  },

  /**
   * Execute to get vendor's records list with minimum data
   */
  getRecords: (ids: string[]): Promise<Vendor[]> => {
    return Api.invoke({
      path: '/exp/vendor/list',
      param: { ids },
    }).then((result: { records: VendorList }) => {
      return (result.records || []).map((record) => record);
    });
  },

  /**
   * Execute to get vendor's records
   */
  get: (id: string): Promise<Vendor> => {
    return Api.invoke({
      path: '/exp/vendor/search',
      param: { id },
    }).then((result: { records: Vendor[] }) => {
      return result.records[0] || [];
    });
  },
};
