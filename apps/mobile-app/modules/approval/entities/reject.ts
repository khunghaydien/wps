import msg from '../../../../commons/languages';
import { showToast } from '../../../../commons/modules/toast';

import { reject } from '../../../../domain/models/approval/request/Reject';

import { AppDispatch } from '../AppThunk';

export const ACTIONS = {
  REJECT_SUCCESS: 'MODULES/ENTITIES/APPROVAL/REJECT_SUCCESS',
};

const rejectSuccess = () => {
  return {
    type: ACTIONS.REJECT_SUCCESS,
  };
};

export const actions = {
  reject:
    (requestIdList: Array<string>, comment: string) =>
    async (dispatch: AppDispatch): Promise<void> => {
      await reject(requestIdList, comment);
      dispatch(showToast(msg().Appr_Lbl_Rejected));
      dispatch(rejectSuccess());
    },
};
