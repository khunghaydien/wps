import {
  APPROVER_OPTION_LABELS,
  REQUEST_TYPE_LABELS,
} from '../models/approverSetting';

import * as base from '@admin-pc/actions/base';

export type SearchParam = {
  companyId: string;
  requestType?: string;
};

export type UpdateParam = {
  id?: string;
  companyId: string;
  requestType: keyof typeof REQUEST_TYPE_LABELS;
  approver01: keyof typeof APPROVER_OPTION_LABELS;
  approver02: keyof typeof APPROVER_OPTION_LABELS;
  approver03: keyof typeof APPROVER_OPTION_LABELS;
  approver04: keyof typeof APPROVER_OPTION_LABELS;
  approver05: keyof typeof APPROVER_OPTION_LABELS;
};

const FUNC_NAME = 'approval-mapping/setting';

export const ACTION_TYPES = {
  SEARCH_APPROVER_SETTING: 'SEARCH_APPROVER_SETTING',
  SEARCH_APPROVER_SETTING_ERROR: 'SEARCH_APPROVER_SETTING_ERROR',
  UPDATE_APPROVER_SETTING: 'UPDATE_APPROVER_SETTING',
  UPDATE_APPROVER_SETTING_ERROR: 'UPDATE_APPROVER_SETTING_ERROR',
};

export const search = (param: SearchParam) => {
  return base.search(
    FUNC_NAME,
    param,
    ACTION_TYPES.SEARCH_APPROVER_SETTING,
    ACTION_TYPES.SEARCH_APPROVER_SETTING_ERROR
  );
};

export const update = (param: UpdateParam) => {
  return base.update(
    FUNC_NAME,
    param,
    ACTION_TYPES.UPDATE_APPROVER_SETTING,
    ACTION_TYPES.UPDATE_APPROVER_SETTING_ERROR
  );
};
