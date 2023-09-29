import { find, get, isEmpty } from 'lodash';

import Api from '@apps/commons/api';
import msg from '@commons/languages';

import {
  MAX_LIMIT,
  MAX_SEARCH_NO,
  OFFSET,
  relatedList,
  SALESFORCE_API_VERSION,
  typeName,
} from './consts';
import {
  CustomRequest,
  CustomRequests,
  FieldsMap,
  FieldTypeMap,
  HelpMsgItem,
  LayoutData,
  LayoutItem,
  Mode,
  RecordTypeListEntity,
  ReferenceLayout,
  ReferenceRecords,
  RelatedItem,
  RequestDetail,
  TypeName,
} from './types';

export const isFieldEditable = (field: LayoutItem, mode: Mode) =>
  (mode === 'NEW' && field.editableForNew) ||
  (mode === 'EDIT' && field.editableForUpdate);

export const isFieldDisabled = (field: LayoutItem, mode?: Mode) => {
  const { editableForNew, editableForUpdate } = field;
  if (!mode) {
    return !editableForNew && !editableForUpdate;
  }
  return (
    (mode === 'NEW' && !editableForNew) ||
    (mode === 'EDIT' && !editableForUpdate)
  );
};

export const isShowFileSection = (layoutRelatedList: RelatedItem[] = []) => {
  const relatedItemList = layoutRelatedList.map(({ sobject }) => sobject);
  return relatedItemList.includes(relatedList.FILE_LIST);
};

type RowIndex = number;
type ColumnIndex = number;
type SectionId = string;
type SectionInfo = {
  label: string;
  list: Record<RowIndex, Record<ColumnIndex, LayoutItem>>;
  rows: number;
  columns: number;
};
type FormattedList = Record<SectionId, SectionInfo>;

type LayoutRows = Record<number, LayoutItem[]>;
type DetailLayoutSection = {
  collapsed: boolean;
  columns: number;
  heading: string;
  layoutRows: LayoutRows[];
  layoutSectionId: string;
  parentLayoutId: string;
  rows: number;
  tabOrder: string;
  useCollapsibleSection: boolean;
  useHeading: boolean;
};
type Layout = {
  detailLayoutSections: DetailLayoutSection[];
};

export const groupLayoutItemsBySectionAndRow = (configList: LayoutItem[]) => {
  const formattedList = configList.reduce<FormattedList>((acc, config) => {
    const {
      sectionId,
      sectionLabel,
      rowIndex,
      columnIndex,
      sectionRows,
      sectionColumns,
    } = config;

    if (acc?.[config.sectionId]) {
      return {
        ...acc,
        [sectionId]: {
          ...acc[sectionId],
          rows: sectionRows,
          columns: sectionColumns,
          list: {
            ...acc[sectionId].list,
            [rowIndex]: {
              ...(acc[sectionId].list?.[rowIndex] || {}),
              [columnIndex]: config,
            },
          },
        },
      };
    }

    return {
      ...acc,
      [sectionId]: {
        label: sectionLabel,
        rows: sectionRows,
        columns: sectionColumns,
        list: {
          [rowIndex]: {
            [columnIndex]: config,
          },
        },
      },
    };
  }, {});

  return formattedList;
};

export const generateLayoutItems = (
  layout: Layout,
  hintList: HelpMsgItem[]
): LayoutItem[] => {
  const getLayoutItems = (
    layoutItemsAcc: LayoutItem[],
    {
      heading: sectionLabel = '',
      layoutSectionId: sectionId = '',
      rows: sectionRows = 1,
      columns: sectionColumns = 1,
      layoutRows = [],
    }
  ) => {
    const getLayoutItemsBySection = (
      layoutRowsAcc: LayoutItem[],
      { layoutItems = [] },
      rowIndex
    ) => {
      const getLayoutItemsBySectionRow = (
        layoutItemsBySectionRowAcc: LayoutItem[],
        layoutItem,
        columnIndex
      ) => {
        const {
          label,
          placeholder,
          required,
          editableForNew,
          editableForUpdate,
          layoutComponents,
        } = layoutItem;

        if (!isEmpty(layoutComponents)) {
          const findHintItem = find(hintList, {
            name: get(layoutComponents, `0.value`),
          });
          return [
            ...layoutItemsBySectionRowAcc,
            {
              label,
              placeholder,
              required,
              editableForNew,
              editableForUpdate,
              name: get(layoutComponents, `0.name`),
              field: get(layoutComponents, `0.value`),
              picklistValues: get(layoutComponents, `0.details.picklistValues`),
              defaultValue: get(layoutComponents, `0.details.defaultValue`),
              defaultValueFormula: get(
                layoutComponents,
                `0.details.defaultValueFormula`
              ),
              typeName: get(layoutComponents, `0.details.type`),
              fractionDigits: get(layoutComponents, `0.details.scale`),
              objectName: get(layoutComponents, `0.details.referenceTo.0`),
              rowIndex,
              columnIndex,
              sectionLabel,
              sectionId,
              sectionRows,
              sectionColumns,
              value: get(layoutComponents, `0.value`),
              helpMsg:
                typeof findHintItem === 'object'
                  ? findHintItem.inlineHelpText
                  : '',
            },
          ];
        }

        return layoutItemsBySectionRowAcc;
      };

      const layoutItemsBySectionRow = layoutItems.reduce<LayoutItem[]>(
        getLayoutItemsBySectionRow,
        []
      );

      return [...layoutRowsAcc, ...layoutItemsBySectionRow];
    };

    const layoutItemsBySection = layoutRows.reduce<LayoutItem[]>(
      getLayoutItemsBySection,
      []
    );

    return [...layoutItemsAcc, ...layoutItemsBySection];
  };

  const detailLayoutSections = get(layout, 'detailLayoutSections');
  const allLayoutItems = Object.values(detailLayoutSections).reduce<
    LayoutItem[]
  >(getLayoutItems, []);

  return allLayoutItems;
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
      if (field) fieldTypeMap[k] = field.typeName as TypeName;
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

export const getDefaultRequest = (
  recordTypeId: string
): Promise<RequestDetail> => {
  return Api.invoke({
    path: '/custom-request/default-value/get',
    param: {
      recordTypeId,
    },
  }).then((response) => response);
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

export const getCustomRequestPendingList = (
  sObjName: string,
  fieldsToSelect: Array<string>,
  searchCondition?: string
): Promise<CustomRequests> => {
  return Api.invoke({
    path: '/custom-request/pending/list',
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
  attachedFileList = [],
  updateByApprover = false
): Promise<CustomRequests> => {
  return Api.invoke({
    path: '/custom-request/update',
    param: { valueMapList, fieldTypeMap, attachedFileList, updateByApprover },
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

export const isCustomObject = (name: string) => name.includes('__c');

// reference field: get custom obj layout
export const getCustomReferenceLayout = (
  objectName: string
): Promise<Array<LayoutData>> => {
  return Api.invoke({
    path: '/custom-request/lookup-layout/get',
    param: { objectName },
  }).then((response) => response.layouts);
};

// reference field: get standard obj layout
export const getStandardReferenceLayout = async (
  objectName: string
): Promise<Array<LayoutData>> => {
  const urlPath = `/services/data/v${SALESFORCE_API_VERSION}/search/layout/?q=${objectName}`;
  try {
    const res = await Api.requestSFGetApi(urlPath);
    return res[0].searchColumns;
  } catch (err) {
    const error = {
      errorCode: 'GET_FAILED',
      message: String(err),
    };
    throw error;
  }
};

// reference field: query all records of object
export const getAllReferenceRecords = async (
  objectName: string,
  layout: ReferenceLayout
): Promise<ReferenceRecords> => {
  if (isEmpty(layout)) {
    return;
  }
  const columnsQuery = [...layout, 'Id'].join();
  const query = `SELECT+${columnsQuery}+FROM+${objectName}+LIMIT+${
    MAX_SEARCH_NO + 1
  }`;
  const urlPath = `/services/data/v${SALESFORCE_API_VERSION}/queryAll/?q=${query}`;
  try {
    const res = await Api.requestSFGetApi(urlPath);
    return res.records;
  } catch (err) {
    const error = {
      errorCode: 'GET_FAILED',
      message: String(err),
    };
    throw error;
  }
};

// reference field: search standard obj by query
export const searchStandardRecords = async (
  objectName: string,
  layout: ReferenceLayout,
  queryString: string
): Promise<ReferenceRecords> => {
  if (isEmpty(layout)) {
    return;
  }
  const columnsQuery = layout.join();
  const query = `${queryString}&sobject=${objectName}&${objectName}.fields=${columnsQuery}&${objectName}.limit=${
    MAX_SEARCH_NO + 1
  }`;
  const urlPath = `/services/data/v${SALESFORCE_API_VERSION}/parameterizedSearch/?q=${query}`;
  try {
    const res = await Api.requestSFGetApi(urlPath);
    return res.searchRecords;
  } catch (err) {
    const error = {
      errorCode: 'GET_FAILED',
      message: String(err),
    };
    throw error;
  }
};

// reference field: search custom object by query
export const searchCustomRecords = async (
  sObjName: string,
  layoutData: Array<LayoutData>,
  searchQuery: string
): Promise<ReferenceRecords> => {
  const fieldsToSelect = layoutData.map(({ name }) => name);
  const searchFields = layoutData
    .filter(({ type }) => type === 'STRING')
    .map(({ name }) => name);
  return Api.invoke({
    path: '/custom-request/lookup-object/search',
    param: {
      fieldsToSelect,
      sObjName,
      maxRecords: MAX_SEARCH_NO + 1,
      includeDeletedRecords: false,
      offset: 0,
      sortCondition: '',
      searchQuery,
      searchFields,
    },
  }).then((response) => response.records);
};

// reference field: fields used for label display
export const getReferenceLabelField = (objectName: string): Promise<string> => {
  return Api.invoke({
    path: '/custom-request/label-field/get',
    param: { objectName },
  }).then((response) => response.labelField);
};

export const getHelpMsgLabelField = (): Promise<HelpMsgItem[]> => {
  return Api.invoke({
    path: '/custom-request/describe-field-result/get',
    param: {},
  }).then((response) => response.fields);
};
