import msg from '../../../../commons/languages';
import { showToast } from '../../../../commons/modules/toast';

import RequestRepository from '@apps/repositories/approval/RequestRepository';

import { AppDispatch } from '../AppThunk';

export const ACTIONS = {
  APPROVE_SUCCESS: 'MODULES/ENTITIES/APPROVAL/APPROVE_SUCCESS',
};

const approveSuccess = () => {
  return {
    type: ACTIONS.APPROVE_SUCCESS,
  };
};

export const actions = {
  approve:
    (requestIdList: Array<string>, comment: string) =>
    async (dispatch: AppDispatch): Promise<void> => {
      await RequestRepository.approve({
        ids: requestIdList,
        comment,
      });
      dispatch(showToast(msg().Appr_Lbl_Approved));
      dispatch(approveSuccess());
    },
};
