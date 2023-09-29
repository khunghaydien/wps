import { Dispatch } from 'redux';

import { approve } from '../../../models/approval/request/Approve';

export const ACTIONS = {
  APPROVE: 'MODULES/APPROVAL/REQUEST/APPROVE',
};

const approveSuccess = (body) => ({
  type: ACTIONS.APPROVE,
  payload: body,
});

export const actions = {
  approve:
    (requestIdList: Array<string>, comment: string) =>
    (dispatch: Dispatch<any>): void | any => {
      return approve(requestIdList, comment)
        .then((res: any) => dispatch(approveSuccess(res)))
        .catch((err) => {
          throw err;
        });
    },
};
