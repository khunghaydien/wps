import { TYPE_LABELS } from '../../models/approverGroup';

import * as base from '@admin-pc/actions/base';

type CreateParam = {
  companyId: string;
  code: string;
  nameL0: string;
  nameL1?: string;
  nameL2?: string;
  type: keyof typeof TYPE_LABELS;
  targetDepartmentId: string;
  userIds?: string[];
};

type SearchParam = {
  id?: string;
  companyId: string;
  includeApprovers?: boolean;
};

type UpdateParam = DeleteParam & CreateParam;

type DeleteParam = {
  id: string;
};

const FUNC_NAME = 'approver-group';

export const ACTION_TYPES = {
  SEARCH_APPROVER_GROUP: 'SEARCH_APPROVER_GROUP',
  SEARCH_APPROVER_GROUP_ERROR: 'SEARCH_APPROVER_GROUP_ERROR',
  CREATE_APPROVER_GROUP: 'CREATE_APPROVER_GROUP',
  CREATE_APPROVER_GROUP_ERROR: 'CREATE_APPROVER_GROUP_ERROR',
  UPDATE_APPROVER_GROUP: 'UPDATE_APPROVER_GROUP',
  UPDATE_APPROVER_GROUP_ERROR: 'UPDATE_APPROVER_GROUP_ERROR',
  DELETE_APPROVER_GROUP: 'DELETE_APPROVER_GROUP',
  DELETE_APPROVER_GROUP_ERROR: 'DELETE_APPROVER_GROUP_ERROR',
};

export const search = (param: SearchParam) => {
  return base.search(
    FUNC_NAME,
    param,
    ACTION_TYPES.SEARCH_APPROVER_GROUP,
    ACTION_TYPES.SEARCH_APPROVER_GROUP_ERROR
  );
};

export const create = (param: CreateParam) => {
  return base.create(
    FUNC_NAME,
    param,
    ACTION_TYPES.CREATE_APPROVER_GROUP,
    ACTION_TYPES.CREATE_APPROVER_GROUP_ERROR
  );
};

export const update = (param: UpdateParam) => {
  return base.update(
    FUNC_NAME,
    param,
    ACTION_TYPES.UPDATE_APPROVER_GROUP,
    ACTION_TYPES.UPDATE_APPROVER_GROUP_ERROR
  );
};

export const del = (param: DeleteParam) => {
  return base.del(
    FUNC_NAME,
    param,
    ACTION_TYPES.DELETE_APPROVER_GROUP,
    ACTION_TYPES.DELETE_APPROVER_GROUP_ERROR
  );
};
