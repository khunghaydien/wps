import { Dispatch } from 'redux';

import RequestRepository from '@apps/repositories/approval/RequestRepository';

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
      return RequestRepository.approve({
        ids: requestIdList,
        comment,
      })
        .then((res: any) => {
          dispatch(approveSuccess(res));
          return res;
        })
        .catch((err) => {
          throw err;
        });
    },
};
