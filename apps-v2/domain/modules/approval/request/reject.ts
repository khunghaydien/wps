import { Dispatch } from 'redux';

import RequestRepository from '@apps/repositories/approval/RequestRepository';

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
      return RequestRepository.reject({
        ids: requestIdList,
        comment,
      })
        .then((res: any) => {
          dispatch(rejectSuccess(res));
          return res;
        })
        .catch((err) => {
          throw err;
        });
    },
};
