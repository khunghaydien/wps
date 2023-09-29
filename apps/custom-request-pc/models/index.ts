import { get } from 'lodash';

import Api from '@apps/commons/api';
import msg from '@commons/languages';

import {
  MAX_LIMIT,
  OFFSET,
  SALESFORCE_API_VERSION,
  typeName,
} from '@custom-request-pc/consts';
import {
  CustomRequest,
  CustomRequests,
  FieldsMap,
  FieldTypeMap,
  LayoutItem,
  Mode,
  RecordTypeListEntity,
  RequestDetail,
  TypeName,
} from '@custom-request-pc/types';

export const isFieldEditable = (field: LayoutItem, mode: Mode) =>
  (mode === 'NEW' && field.editableForNew) ||
  (mode === 'EDIT' && field.editableForUpdate);

export const isFieldDisabled = (field: LayoutItem, mode: Mode) =>
  (mode === 'NEW' && !field.editableForNew) ||
  (mode === 'EDIT' && !field.editableForUpdate);

export const generateLayoutItems = (layout: any) => {
  const item = 'layoutItems.0';
  const components = `${item}.layoutComponents.0`;
  const details = `${components}.details`;
  const converter = (x) => ({
    label: get(x, `${item}.label`),
    placeholder: get(x, `${item}.placeholder`),
    required: get(x, `${item}.required`),
    editableForNew: get(x, `${item}.editableForNew`),
    editableForUpdate: get(x, `${item}.editableForUpdate`),
    name: get(x, `${components}.name`),
    field: get(x, `${components}.value`),
    picklistValues: get(x, `${details}.picklistValues`),
    defaultValue: get(x, `${details}.defaultValue`),
    defaultValueFormula: get(x, `${details}.defaultValueFormula`),
    typeName: get(x, `${details}.type`),
    fractionDigits: get(x, `${details}.scale`),
  });
  const rows = get(layout, 'detailLayoutSections.0.layoutRows');
  return rows.map(converter);
};

// get fieldTypeMap and valueMap needed for clone single/multi CR
export const generateFieldAndValueMap = (
  request: CustomRequest,
  fieldsMap: FieldsMap,
  recordTypeId?: string
) => {
  const value = { ...request };
  const fieldTypeMap = {} as FieldTypeMap;
  Object.keys(value).forEach((k: string) => {
    const field = fieldsMap[k];
    const isFieldEditable = get(field, 'editableForNew', true);
    if (value[k] == null || !isFieldEditable) {
      delete value[k];
    } else {
      fieldTypeMap[k] = field.typeName as TypeName;
    }
  });
  value.Name = msg().Exp_Lbl_ReportClonePrefix.concat(value.Name);
  if (recordTypeId) {
    value.RecordTypeId = recordTypeId;
    fieldTypeMap.RecordTypeId = typeName.REFERENCE;
  }
  return { value, fieldTypeMap };
};

export const getRecordTypeList = (): Promise<RecordTypeListEntity> => {
  return Api.invoke({
    path: '/general-request/record-type/list',
    param: {
      includeUnavailableRecordTypes: true,
    },
  }).then((response) => response);
};

export const getLayout = async (
  recordTypeId: string,
  objectName: string
): Promise<any> => {
  const urlPath = `/services/data/v${SALESFORCE_API_VERSION}/sobjects/${objectName}/describe/layouts/${recordTypeId}`;
  try {
    const res = await Api.requestSFGetApi(urlPath);
    return res;
  } catch (err) {
    const error = {
      errorCode: 'GET_FAILED',
      message: String(err),
    };
    throw error;
  }
};

export const getRequestDetail = (
  requestId: string,
  fieldsToSelect: Array<string>,
  includeFile: boolean,
  includeApprovalHistory: boolean
): Promise<RequestDetail> => {
  const unique = [...new Set(fieldsToSelect)];
  return Api.invoke({
    path: '/custom-request/get',
    param: {
      requestId,
      fieldsToSelect: unique,
      includeFile,
      includeApprovalHistory,
    },
  }).then((response) => response);
};

export const getCustomRequestList = (
  sObjName: string,
  fieldsToSelect: Array<string>,
  searchCondition?: string
): Promise<CustomRequests> => {
  return Api.invoke({
    path: '/custom-request/list',
    param: {
      fieldsToSelect,
      sObjName,
      offset: OFFSET,
      searchCondition,
      maxRecords: MAX_LIMIT,
    },
  }).then(({ records }) => records);
};

export const updatedCustomRequest = (
  valueMapList: CustomRequests,
  fieldTypeMap: FieldTypeMap,
  attachedFileList = []
): Promise<CustomRequests> => {
  return Api.invoke({
    path: '/custom-request/update',
    param: { valueMapList, fieldTypeMap, attachedFileList },
  }).then((response) => response);
};

export const createCustomRequest = (
  valueMapList: CustomRequests,
  fieldTypeMap: FieldTypeMap,
  attachedFileList = []
): Promise<{ recordId: string }> => {
  return Api.invoke({
    path: '/custom-request/create',
    param: { valueMapList, fieldTypeMap, attachedFileList },
  }).then((response) => response);
};

export const deleteCustomRequests = (recordIds): Promise<CustomRequests> => {
  return Api.invoke({
    path: '/custom-request/delete',
    param: { recordIds },
  }).then((response) => response);
};

export const recallCustomRequest = (
  customRequestId: string,
  comment: string
): Promise<CustomRequests> => {
  return Api.invoke({
    path: '/general-request/cancel-request',
    param: { customRequestId, comment },
  }).then((response) => response);
};

export const submitCustomRequest = async (
  recordId: string,
  comment: string
): Promise<string> => {
  const urlPath = `/services/data/v${SALESFORCE_API_VERSION}/process/approvals/`;
  try {
    const res = await Api.requestSFApi(urlPath, {
      requests: [
        { actionType: 'Submit', contextId: recordId, comments: comment },
      ],
    });
    return res;
  } catch (err) {
    const error = {
      errorCode: 'SUBMIT_FAILED',
      message: String(err),
    };
    throw error;
  }
};
