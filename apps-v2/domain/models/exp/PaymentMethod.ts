import get from 'lodash/get';

import Api from '@commons/api';
import msg from '@commons/languages';

import { PaymentMethodOptionList as MBPaymentMethodOptionList } from '@mobile/modules/expense/ui/paymentMethodOption';

import { RouteFormValues } from '@mobile/components/pages/expense/Route/New';

import { ExpenseReportType } from './expense-report-type/list';
import { isCCRecord, isIcRecord, Record, RECORD_TYPE } from './Record';

export type PaymentMethod = {
  id: string;
  accountCode: string;
  accountName: string;
  active: boolean;
  code: string;
  companyId: string;
  description: string;
  description_L0?: string;
  description_L1?: string;
  description_L2?: string;
  integrationService: keyof typeof INTEGRATION_SERVICES;
  name: string;
  name_L0: string;
  name_L1?: string;
  name_L2?: string;
  reimbursement: boolean;
  subAccountCode: string;
  subAccountName: string;
};

export type ReportPaymentMethod = {
  id: string;
  integrationService: keyof typeof INTEGRATION_SERVICES;
  name: string;
  reimbursement: boolean;
};

export const INTEGRATION_SERVICES = {
  None: 'None',
  ICCard: 'ICCard',
  CorporateCard: 'CorporateCard',
};

export const INTEGRATION_SERVICE_LABELS = {
  [INTEGRATION_SERVICES.None]: 'Com_Lbl_None',
  [INTEGRATION_SERVICES.ICCard]: 'Exp_Lbl_RouteOptionFareType_IC',
  [INTEGRATION_SERVICES.CorporateCard]: 'Exp_Lbl_CorporateCard',
};

export const isCCPaymentMethod = (integrationService: string): boolean =>
  integrationService === INTEGRATION_SERVICES.CorporateCard;

export const isICPaymentMethod = (
  integrationService: string,
  recordType: string
): boolean =>
  recordType === RECORD_TYPE.TransportICCardJP &&
  integrationService === INTEGRATION_SERVICES.ICCard;

const getInactiveSelectedOption = (
  currPaymentMethodId: string,
  label: string,
  name: string
) => ({
  [label]: `${name} (${msg().Exp_Lbl_PaymentMethodInvalid})`,
  value: currPaymentMethodId,
});

// filter payment method based on report payment method ids and expense type
// display all active payment methods (except IC Card) for MB create record / route
export const getPaymentMethodOptions = (
  paymentMethodList: PaymentMethod[] = [],
  availablePaymentMethodIds: string[] = [],
  currRecord?: Record,
  isJorudanRecord?: boolean,
  isMobile?: boolean
): { [x: string]: string; value: string }[] => {
  const label = isMobile ? 'label' : 'text';
  const selectOption = { [label]: msg().Exp_Lbl_PleaseSelect, value: '' };
  const currPaymentMethodId = get(currRecord, 'paymentMethodId');
  const isSelectedInactive =
    currPaymentMethodId &&
    !availablePaymentMethodIds.includes(currPaymentMethodId);

  if (!currRecord || paymentMethodList.length === 0) {
    const record = currRecord || ({} as Record);
    const isICOrCCRecord = isIcRecord(record.recordType) || isCCRecord(record);
    if (isSelectedInactive) {
      const selectedInactiveOption = getInactiveSelectedOption(
        currPaymentMethodId,
        label,
        get(currRecord, 'paymentMethodName')
      );
      return isICOrCCRecord
        ? [selectedInactiveOption]
        : [selectOption].concat([selectedInactiveOption]);
    }
    // no pm set to used, do not display pm field for non-IC/CC record
    return isICOrCCRecord ? [selectOption] : [];
  }

  const { recordType } = currRecord;
  const useForeignCurrency = get(currRecord, 'items.0.useForeignCurrency');
  const filterCondition = (
    integrationService: keyof typeof INTEGRATION_SERVICES
  ) => {
    if (recordType === RECORD_TYPE.TransportICCardJP) {
      return integrationService === INTEGRATION_SERVICES.ICCard;
    } else if (
      useForeignCurrency ||
      isJorudanRecord ||
      recordType === RECORD_TYPE.TransitJorudanJP ||
      recordType === RECORD_TYPE.Mileage ||
      recordType === RECORD_TYPE.FixedAllowanceMulti ||
      recordType === RECORD_TYPE.FixedAllowanceSingle
    ) {
      return integrationService === INTEGRATION_SERVICES.None;
    } else {
      return (
        integrationService === INTEGRATION_SERVICES.None ||
        integrationService === INTEGRATION_SERVICES.CorporateCard
      );
    }
  };

  const paymentMethodOptionList = paymentMethodList
    .filter(({ integrationService }) => filterCondition(integrationService))
    .map(({ id, name }) => ({
      [label]: name,
      value: id,
    }));
  // show options without select if default PM can be used with selected exp type
  if (!currRecord.recordId) {
    const listFirstItemId = get(paymentMethodList, '0.id');
    const optionFirstItemId = get(paymentMethodOptionList, '0.value');
    const isDefaultId = listFirstItemId === optionFirstItemId;
    if (isDefaultId) return paymentMethodOptionList;
  }
  // show selected inactive payment method option
  if (isSelectedInactive) {
    const selectedInactiveOption = getInactiveSelectedOption(
      currPaymentMethodId,
      label,
      get(currRecord, 'paymentMethodName')
    );
    paymentMethodOptionList.unshift(selectedInactiveOption);
  }
  return [selectOption, ...paymentMethodOptionList];
};

// show payment method field
export const isShowPaymentMethodField = (
  paymentMethodOptionList: MBPaymentMethodOptionList | PaymentMethod[],
  record?: Record,
  routeFormValues?: RouteFormValues,
  isRequest = false
) => {
  const { paymentMethodId } = routeFormValues || record;
  const isICOrCCRecord = routeFormValues
    ? false
    : isIcRecord(record.recordType) || isCCRecord(record);
  const hasOptionList = paymentMethodOptionList.length > 0;
  if (isRequest) {
    return !!paymentMethodId || hasOptionList;
  } else {
    return !!paymentMethodId || isICOrCCRecord || hasOptionList;
  }
};

// display create record from IC/CC options based on payment method integration service
export const isShowICCCOptionInDropdown = (
  paymentMethodList: PaymentMethod[] = [],
  selectedReportType: ExpenseReportType = {} as ExpenseReportType
): Partial<{ isShowCCOption: boolean; isShowICOption: boolean }> => {
  const { paymentMethodIds = [] } = selectedReportType;
  if (paymentMethodIds.length === 0) return {};

  const isShowCCOption = !!paymentMethodList.find(
    ({ id, integrationService }) =>
      paymentMethodIds.includes(id) &&
      integrationService === INTEGRATION_SERVICES.CorporateCard
  );
  const isShowICOption = !!paymentMethodList.find(
    ({ id, integrationService }) =>
      paymentMethodIds.includes(id) &&
      integrationService === INTEGRATION_SERVICES.ICCard
  );
  return {
    isShowCCOption,
    isShowICOption,
  };
};

// unlink cc trans if selected is not a CC payment method
export const isUnlinkCCTrans = (
  selectedId: string,
  paymentMethodList: PaymentMethod[],
  isCCRecord: boolean,
  isFA?: boolean
) => {
  if (isFA || !isCCRecord) return false;

  const selectedPaymentMethod =
    paymentMethodList.find(({ id }) => id === selectedId) ||
    ({} as PaymentMethod);
  const isSelectedNotCCPaymentMethod = !isCCPaymentMethod(
    selectedPaymentMethod.integrationService
  );
  return isSelectedNotCCPaymentMethod;
};

export const searchPaymentMethodList = (
  ids: string[],
  companyId: string,
  active?: boolean
): Promise<{ records: PaymentMethod[] | null }> =>
  Api.invoke({
    path: '/exp/payment-method/search',
    param: { ids, companyId, active },
  });

export const getPaymentMethodListByReportTypeId = (
  expReportTypeId: string
): Promise<{ records: ReportPaymentMethod[] | null }> =>
  Api.invoke({
    path: '/exp/payment-method/list',
    param: { expReportTypeId },
  });
