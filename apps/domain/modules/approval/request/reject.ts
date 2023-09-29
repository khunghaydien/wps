import { Dispatch } from 'redux';

import { reject } from '../../../models/approval/request/Reject';

export const ACTIONS = {
  REJECT: 'MODULES/APPROVAL/REQUEST/REJECT',
};

const rejectSuccess = (body) => ({
  type: ACTIONS.REJECT,
  payload: body,
});

export const actions = {
  reject:
    (requestIdList: Array<string>, comment: string) =>
    (dispatch: Dispatch<any>): void | any => {
      return reject(requestIdList, comment)
        .then((res: any) => dispatch(rejectSuccess(res)))
        .catch((err) => {
          throw err;
        });
    },
};
