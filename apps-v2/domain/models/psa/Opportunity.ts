import Api from '@apps/commons/api';

/**
 * Used to filter opportunity
 * limitRows is default set to 100. Can be dynamic in future
 */
export type OpportunitySearchQuery = {
  name?: string;
  createdFrom?: string;
  createdTo?: string;
  accountName?: string;
  limitRows?: number;
};

export type Opportunity = {
  id: string;
  name: string;
  accountName: string;
  createdDate: string;
};

export type OpportunityList = Array<Opportunity>;

export type OpportunityResponse = {
  records: OpportunityList;
  exceedLimit: boolean;
};

export const initialOpportunityList = [];

export const OpportunityDefaultParam = {
  name: '',
  createdFrom: '',
  createdTo: '',
  accountName: '',
  limitRows: 100,
};

export const getOpportunityList = (
  param: OpportunitySearchQuery
): Promise<OpportunityResponse> => {
  return Api.invoke({
    path: '/opportunity/list/min',
    param,
  }).then((response: OpportunityResponse) => response);
};
