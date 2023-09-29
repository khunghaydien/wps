import * as base from '@admin-pc/actions/base';

type ListParam = {
  queueId: string;
};

const FUNC_NAME = 'approver-group/members';

export const ACTION_TYPES = {
  LIST_MEMBER: 'LIST_MEMBER',
  LIST_MEMBER_ERROR: 'LIST_MEMBER_ERROR',
  CLEAR_MEMBER: 'CLEAR_MEMBER',
} as const;

export const list = (param: ListParam) =>
  base.list(
    FUNC_NAME,
    param,
    ACTION_TYPES.LIST_MEMBER,
    ACTION_TYPES.LIST_MEMBER_ERROR
  );
