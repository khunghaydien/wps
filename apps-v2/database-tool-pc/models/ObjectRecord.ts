import { MAX_RECORDS_NUMBER } from '../constants/recordTable';

import Api from '../../commons/api';

export type Count = { count: number };
export type Records = { records: Array<Record<string, any>> };

export const getRecordsCount = (
  sObjName: string,
  includeDeletedRecords: boolean,
  searchCondition?: string
): Promise<Count> => {
  return Api.invoke({
    path: '/db-tool/sobject/records/count',
    param: {
      sObjName,
      includeDeletedRecords,
      searchCondition,
    },
  })
    .then((response: Count) => response)
    .catch((err) => {
      throw err;
    });
};

export const getObjRecords = (
  sObjName: string,
  fieldsToSelect: Array<string>,
  offset: number,
  includeDeletedRecords = false,
  searchCondition?: string,
  sortCondition?: string,
  maxRecords?: number
): Promise<Records> => {
  return Api.invoke({
    path: '/db-tool/sobject/query',
    param: {
      fieldsToSelect,
      sObjName,
      maxRecords: maxRecords || MAX_RECORDS_NUMBER,
      offset,
      includeDeletedRecords,
      searchCondition,
      sortCondition,
    },
  })
    .then((response: Records) => response)
    .catch((err) => {
      throw err;
    });
};

export const deleteObjRecords = (
  sObjName: string,
  recordIds: Array<string>
): Promise<Record<string, any>> => {
  return Api.invoke({
    path: '/db-tool/sobject/records/delete',
    param: {
      sObjName,
      recordIds,
    },
  })
    .then((response: Record<string, any>) => response)
    .catch((err) => {
      throw err;
    });
};

export const undeleteObjRecords = (
  sObjName: string,
  recordIds: Array<string>
): Promise<Record<string, any>> => {
  return Api.invoke({
    path: '/db-tool/sobject/records/restore',
    param: {
      sObjName,
      recordIds,
    },
  })
    .then((response: Record<string, any>) => response)
    .catch((err) => {
      throw err;
    });
};

export const updateObjRecords = (
  sObjName: string,
  fieldTypeMap: Record<string, any>,
  valueMapList: Array<Record<string, any>>
): Promise<void> => {
  return Api.invoke({
    path: '/db-tool/sobject/records/update',
    param: {
      sObjName,
      fieldTypeMap,
      valueMapList,
    },
  })
    .then((response: Record<string, any>) => response)
    .catch((err) => {
      throw err;
    });
};

export const createObjRecords = (
  sObjName: string,
  fieldTypeMap: Record<string, any>,
  valueMapList: Array<Record<string, any>>
): Promise<void> => {
  return Api.invoke({
    path: '/db-tool/sobject/records/create',
    param: {
      sObjName,
      fieldTypeMap,
      valueMapList,
    },
  })
    .then((response: Record<string, any>) => response)
    .catch((err) => {
      throw err;
    });
};
