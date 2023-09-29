import { NAMESPACE_PREFIX } from '@commons/api';

export { default as SALESFORCE_API_VERSION } from '@apps/commons/config/salesforceApiVersion';

export const MAX_LIMIT = 10000;
export const OFFSET = 0;
export const FILE_PREFIX = 'CustomRequest_';

export const pageView = {
  Detail: 'Detail',
  List: 'List',
} as const;

export const dialogTypes = {
  HIDE: 'HIDE',
  NEW: 'NEW',
  EDIT: 'EDIT',
  RECORD_TYPE_SELECT: 'RECORD_TYPE_SELECT',
  APPROVAL: 'APPROVAL',
  RECALL: 'RECALL',
  REFERENCE: 'REFERENCE',
} as const;

export const availableButtons = {
  // so far only clone button displayed based on layout config
  CLONE: 'Clone',
};

export const status = {
  PENDING: 'Pending',
  RECALLED: 'Recalled',
  REJECTED: 'Rejected',
  APPROVED: 'Approved',
  NOT_REQUESTED: 'Not Submitted',
} as const;

export const typeName = {
  BOOLEAN: 'boolean',
  CURRENCY: 'currency',
  DATE: 'date',
  DATETIME: 'datetime',
  DOUBLE: 'double',
  MULTIPICKLIST: 'multipicklist',
  PICKLIST: 'picklist',
  REFERENCE: 'reference',
  STRING: 'string',
  TEXTAREA: 'textarea',
  ID: 'ID',
  URL: 'url',
};

export const relatedList = {
  FILE_LIST: 'AttachedContentDocument',
  HISTORY_LIST: 'ProcessInstanceHistory',
};

export const MAX_CLONE_NO = 10;
export const MAX_SEARCH_NO = 100;

export const RECORD_ACCESS_FIELD_NAME = NAMESPACE_PREFIX + 'RecordAccessId__c';

// auto set field which is NOT input by user
export const AUTO_SET_FIELDS = [
  RECORD_ACCESS_FIELD_NAME,
  NAMESPACE_PREFIX + 'ActorId__c',
  NAMESPACE_PREFIX + 'EmployeeHistoryId__c',
  NAMESPACE_PREFIX + 'EmployeeName__c',
  NAMESPACE_PREFIX + 'DepartmentHistoryId__c',
  NAMESPACE_PREFIX + 'DepartmentName__c',
  NAMESPACE_PREFIX + 'RequestTime__c',
  NAMESPACE_PREFIX + 'Status__c',
  NAMESPACE_PREFIX + 'CancelType__c',
  NAMESPACE_PREFIX + 'LastApproveTime__c',
  NAMESPACE_PREFIX + 'LastApproverId__c',
  'Id',
  'OwnerId',
  'CreatedById',
  'LastModifiedById',
  'CurrencyIsoCode',
  'hasFile',
  'labelMap',
];

// map status to msg key
export const labelMapping = {
  [status.PENDING]: 'Com_Lbl_Pending',
  [status.RECALLED]: 'Com_Lbl_Recalled',
  [status.REJECTED]: 'Com_Lbl_Rejected',
  [status.APPROVED]: 'Com_Lbl_Approved',
  [status.NOT_REQUESTED]: 'Com_Status_NotRequested',
};

// Custom Request Approval Tab
export const CUSTOM_REQUEST_SF_OBJECT_NAME =
  NAMESPACE_PREFIX + 'ComGeneralRequest__c';
export const CUSTOM_REQUEST_APPROVAL_COLUMNS = {
  employeeName: NAMESPACE_PREFIX + 'EmployeeName__c',
  departmentName: NAMESPACE_PREFIX + 'DepartmentName__c',
  recordTypeId: 'RecordTypeId',
  submitDate: NAMESPACE_PREFIX + 'RequestTime__c',
  actorId: NAMESPACE_PREFIX + 'ActorId__c',
};
export const CUSTOM_REQUEST_ID_FIELD_KEY = 'Id';
export const CUSTOM_REQUEST_SUBMITTER_NAME_KEY = 'submitterName';
export const CUSTOM_REQUEST_FIELD_SECTION_LABEL = 'Fields';
export const CUSTOM_REQUEST_RECORD_TYPE_NAME_KEY = 'recordTypeName';
