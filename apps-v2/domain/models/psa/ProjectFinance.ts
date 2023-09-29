import Api from '../../../commons/api';

import { FINANCE_TYPE } from './FinanceCategory';

export type ProjectInfo = {
  clientName: string;
  code: string;
  companyId: string;
  endDate: string;
  name: string;
  pmCode: string;
  pmName: string;
  projectId: string;
  startDate: string;
};

export type FinanceCategoryItem = {
  financeItemId: string;
  financeCategoryRequired: boolean;
  name: string;
  description: string;
  planned: number;
  actual: number;
  difference: number;
};
export type FinanceSummary = {
  totalPlanned: number;
  totalActual: number;
  totalDifference: number;
  financeType: string;
};

export type FinanceInfo = FinanceSummary & {
  financeCategoryItems: Array<FinanceCategoryItem>;
};

export type ProjectFinance = {
  projectInfo: ProjectInfo;
  calculations: Array<FinanceInfo>;
};

export type ProjectFinanceData = {
  projectFinanceOverview: any;
  projectInfo: Array<any>;
  projectFinanceDetail: any;
};

export type FinanceDetailItem = {
  id: string;
  name: string;
  code: string;
  planned: number;
  actual: number;
  difference: number;
};

export type FinanceDetailList = FinanceSummary & {
  details: Array<FinanceDetailItem>;
  projectId: string;
  projectTitle: string;
  projectStartDate: string;
  projectEndDate: string;
  financeCategoryId: string;
};

export const ProjectFinanceType = {
  ...FINANCE_TYPE,
};

export const initialStateProjectFinance = {
  workingDays: [],
  projectInfo: [],
  projectFinanceOverview: {
    revenue: {},
    cost: {},
    margin: {
      intervalTotals: [],
    },
  },
  projectFinanceDetail: {},
  editMode: false,
  note: '',
};

export type contractFixedSummary = {
  fixedActual: number;
  fixedContract: number;
  summaryId: string;
};

export type contractFixedParam = {
  projectId: string;
  financeCategoryId: string;
  summaries: Array<any>;
};

export const getProjectFinance = (
  projectId: string,
  intervalType: string
): Promise<ProjectFinance> => {
  return Api.invoke({
    path: '/psa/project/finance/get',
    param: {
      projectId,
      intervalType,
    },
  }).then((response: ProjectFinance) => response);
};

export const getProjectFinanceDetail = (
  projectId: string,
  financeCategoryId: string,
  intervalType: string,
  needActivityInfo: boolean
): Promise<ProjectFinance> => {
  return Api.invoke({
    path: '/psa/project/finance/role/get',
    param: {
      projectId,
      financeCategoryId,
      intervalType,
      needActivityInfo,
    },
  }).then((response: any) => response);
};

export const getProjectFinanceOtherCategory = (
  projectId: string,
  financeCategoryId: string,
  intervalType: string
): Promise<ProjectFinance> => {
  return Api.invoke({
    path: '/psa/project/finance/other/get',
    param: {
      projectId,
      financeCategoryId,
      intervalType,
    },
  }).then((response: any) => response);
};

export const getWorkDays = (
  projectId: string,
  intervalType: string
): Promise<any> => {
  return Api.invoke({
    path: '/psa/project/finance/workdays/get',
    param: {
      projectId,
      intervalType,
    },
  }).then((response: any) => response);
};

export const getFinanceExpenseRecords = (
  breakdownId: string
): Promise<ProjectFinance> => {
  return Api.invoke({
    path: '/psa/project/finance/expense-records/get',
    param: {
      breakdownId,
    },
  }).then((response: any) => response);
};

export const saveContractFixed = (param: contractFixedParam): Promise<any> => {
  return Api.invoke({
    path: '/psa/project/finance/fixed/save',
    param,
  })
    .then((response: any) => response)
    .catch((err) => {
      throw err;
    });
};

export const saveCategoryOther = (param: any): Promise<any> => {
  return Api.invoke({
    path: '/psa/project/finance/other/save',
    param,
  }).then((response: any) => response);
};

export const deleteCategoryOther = (param: any): Promise<any> => {
  return Api.invoke({
    path: '/psa/project/finance/other/delete',
    param,
  }).then((response: any) => response);
};

export const getMemo = (noteId: string): Promise<any> => {
  return Api.invoke({
    path: '/psa/finance-note/search',
    param: {
      noteId,
    },
  })
    .then((response: any) => response)
    .catch((err) => {
      throw err;
    });
};

export const saveMemo = (
  noteId: string,
  note: string,
  lastModifiedDate: string,
  summaryInfo: object,
  detailInfo: object
): Promise<any> => {
  return Api.invoke({
    path: '/psa/finance-note/save',
    param: {
      noteId,
      note,
      lastModifiedDate,
      summaryInfo,
      detailInfo,
    },
  })
    .then((response: any) => response)
    .catch((err) => {
      throw err;
    });
};
