import { $Values } from 'utility-types';

import { NAMESPACE_PREFIX } from '@commons/api';

import { ApprovalHistory } from '@apps/domain/models/approval/request/History';
import { AttachedFiles } from '@apps/domain/models/common/AttachedFile';
import { field } from '@dbtool/models/ObjectDetail';

import {
  dialogTypes,
  pageView,
  status,
  typeName,
} from '@custom-request-pc/consts';

const STATUS_FIELD_NAME = NAMESPACE_PREFIX + 'Status__c';

export type LayoutItem = {
  label: string;
  placeholder?: string;
  required: boolean;
  editableForNew: boolean;
  editableForUpdate: boolean;
  name: string;
  picklistValues?: Array<{ value: string; label: string }>;
  defaultValue?: string | boolean;
  defaultValueFormula?: string;
  value: string;
  field: string;
  typeName: string;
  fractionDigits: number;
};

export type FieldsMap = {
  [key: string]: field;
};

type RecordItem = {
  name: string;
  id: string;
  available: boolean;
  description: string;
};

export type CustomRequest = Record<string, any>;
export type CustomRequests = CustomRequest[];
export type RecordTypes = Array<RecordItem>;

export type TypeName = $Values<typeof typeName>;
export type FieldTypeMap = Record<string, TypeName>;

export type Status = $Values<typeof status>;
export type Dialog = $Values<typeof dialogTypes>;
export type Mode = Dialog;

// REDUX UI Objects
export type PageViewType = $Values<typeof pageView>;
export type LayoutConfig = {
  sObjName: string;
  config: Array<LayoutItem>;
};

// REDUX Entity Objects
export type CustomRequestListEntity = {
  list: CustomRequests;
  isLoading: boolean;
};

export type RecordTypeListEntity = {
  records: RecordTypes;
  objectName: string;
};

type RelatedItem = {
  excludeButtons?: string[];
  sobject: string;
};

export type LayoutDetail = {
  relatedLists: Array<RelatedItem>;
};

export type ColumnConfig = Array<{
  key: string;
  name: any;
  width: number;
  filterable: boolean;
  sortable: boolean;
  formatter: any;
  typeName: TypeName;
  fractionDigits?: number;
  picklistValues?: Array<{ value: string; label: string }>;
  field: string;
}>;

export type RequestDetail = {
  customRequest: Record<string, any>;
  attachedFileList: AttachedFiles;
  approvalHistoryList: ApprovalHistory[];
  /* eslint-disable camelcase */
  // @ts-ignore
  [STATUS_FIELD_NAME]?: Status;
};
