import Api from '../../commons/api';

export type QueryTemplate = {
  id: string;
  sObjName: string;
  companyId: string;
  fieldsToSelect: string[];
  searchCondition?: string;
  sortCondition?: string;
  includeDeletedRecords: boolean;
};

export const saveQueryTemplate = (
  id: string,
  sObjName: string,
  companyId: string,
  fieldsToSelect: string[],
  searchCondition?: string,
  sortCondition?: string
): Promise<Record<string, any>> => {
  return Api.invoke({
    path: '/db-tool/sobject/query/save',
    param: {
      id,
      sObjName,
      companyId,
      fieldsToSelect,
      searchCondition,
      sortCondition,
      includeDeletedRecords: false,
    },
  })
    .then((response: Record<string, any>) => response)
    .catch((err) => {
      throw err;
    });
};

export const deleteQueryTemplate = (
  id: string
): Promise<Record<string, any>> => {
  return Api.invoke({
    path: '/db-tool/sobject/query/delete',
    param: {
      id,
    },
  })
    .then((res: Record<string, any>) => res)
    .catch((err) => {
      throw err;
    });
};

export const getQueryTemplate = (
  companyId: string
): Promise<Array<QueryTemplate>> => {
  return Api.invoke({
    path: '/db-tool/sobject/query/get',
    param: {
      companyId,
    },
  })
    .then((res: Record<string, any>) => res.queryTemplates)
    .catch((err) => {
      throw err;
    });
};
