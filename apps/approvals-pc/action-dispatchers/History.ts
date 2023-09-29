import { withLoading } from '../../commons/actions/app';

import { getRequestApprovalHistory } from '../../domain/models/approval/request/History';

import { fetchSuccess } from '../modules/entities/histories';

import { AppDispatch } from './AppThunk';

export default (dispatch: AppDispatch) => {
  return {
    fetch: async (requestId: string): Promise<void> => {
      dispatch(
        withLoading(async () => {
          const history = await getRequestApprovalHistory(requestId);
          dispatch(fetchSuccess(history.historyList));
        })
      );
    },
  };
};
