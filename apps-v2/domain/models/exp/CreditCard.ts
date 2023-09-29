import Api from '../../../commons/api';
import DateUtil from '@apps/commons/utils/DateUtil';

export type Transaction = {
  id: string;
  amount: number;
  cardAssociation: string;
  cardNameL: string;
  cardNumber: string;
  companyId: string;
  currencyCode: string;
  employeeBaseId: string;
  isHidden: boolean;
  isUsed: boolean;
  mccCode: string;
  merchantName: string;
  reimbursementFlag: boolean;
  transactionDate: string;
  transactionDescription: string;
};

export type TransactionList = Array<Transaction>;

export type CardInfo = {
  id: string;
  cardAssociation: string;
  cardEmployeeId: string;
  cardNumber: string;
  companyId: string;
  employeeBaseId: string;
  issuerId: string;
  name: string;
  name_L0: string;
  name_L1?: string;
  name_L2?: string;
  reimbursementFlag: boolean;
  remarks: string;
};

export type CardAssign = {
  id: string;
  cardInfo: string;
  employeeBaseId: string;
};

export const CARD_ASSOCIATION = {
  Master: 'Master',
  Visa: 'Visa',
};

export const ISSUER = {
  SMBC: 'SMCC',
  SAISON: 'SAISON',
  NICOS: 'NICOS',
};

/**
 * Default dates for search mobile CC transactions
 *
 * @returns {startDate: string, endDate:string}
 */
export const getMobileInitDates = () => {
  const today = DateUtil.getToday();
  const dates = {
    startDate: DateUtil.addDays(today, -180),
    endDate: today,
  };
  return dates;
};

export const getTransactionHistory = (
  companyId?: string,
  employeeId?: string,
  transactionDateFrom?: string,
  transactionDateTo?: string,
  reimbursement?: boolean,
  cardNameList?: Array<string>,
  description?: string,
  includeHidden?: boolean,
  includeUsed?: boolean
): Promise<TransactionList> => {
  return Api.invoke({
    path: '/exp/credit-card-transaction/search',
    param: {
      companyId,
      employeeId,
      transactionDateFrom,
      transactionDateTo,
      reimbursement,
      cardNameList,
      description,
      includeHidden,
      includeUsed,
    },
  }).then((response) => {
    return response.records;
  });
};

export const toggleHideCCTransaction = (
  id: string,
  isHidden: boolean
): Promise<void> => {
  return Api.invoke({
    path: '/exp/credit-card-transaction/hide',
    param: {
      id,
      isHidden,
    },
  }).then((response) => {
    return response;
  });
};
