import Api from '../../../commons/api';

export const DEFAULT_LIMIT_NUMBER = 100;

export type CustomRequest = {
  id: string;
  employeeName: string;
  recordType: string;
  requestDate: string;
  status: string;
  title: string;
};

export type CustomRequestList = Array<CustomRequest>;

export type RequestType = {
  id: string;
  name: string;
};

export type RequestTypeList = Array<RequestType>;

export const STATUS_LIST = {
  // NOT_REQUESTED: 'NOT_REQUESTED', // Not Requested ones shouldn't be available to user
  PENDING: 'PENDING',
  APPROVED: 'APPROVED',
  REJECTED: 'REJECTED',
  RECALLED: 'REMOVED',
};

export const STATUS_MAP = {
  [STATUS_LIST.PENDING]: 'Com_Status_Pending',
  [STATUS_LIST.APPROVED]: 'Com_Status_Approved',
  [STATUS_LIST.REJECTED]: 'Com_Status_Rejected',
  [STATUS_LIST.RECALLED]: 'Com_Status_Recalled',
};

export type SearchCondition = {
  empBaseIds?: string[];
  maxCount?: number;
  recordTypeIds?: string[];
  requestDateRange?: {
    endDate?: string;
    startDate?: string;
  };
  statusList?: string[];
  title?: string;
};

export const searchCustomRequestList = async (
  searchCondition: SearchCondition = {}
): Promise<CustomRequestList> => {
  return Api.invoke({
    path: '/general-request/search',
    param: searchCondition,
  }).then((response: { objectName: string; records: CustomRequestList }) => {
    return response.records;
  });
};

export const getRequestTypes = async (): Promise<RequestTypeList> => {
  return Api.invoke({
    path: '/general-request/record-type/list',
    param: {},
  }).then((response: { objectName: string; records: RequestTypeList }) => {
    return response.records;
  });
};
