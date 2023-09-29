import {
  catchApiError,
  loadingEnd,
  loadingStart,
} from '@apps/commons/actions/app';
import Api from '@apps/commons/api';

import {
  ATT_SEARCH_FEATURE_ACCESS,
  COM_SEARCH_FEATURE_ACCESS,
  EXP_SEARCH_FEATURE_ACCESS,
  PSA_SEARCH_FEATURE_ACCESS,
  searchError,
  searchSuccess,
  TIME_SEARCH_FEATURE_ACCESS,
} from '@admin-pc-v2/actions/featureAccess';
import { AppDispatch } from '@admin-pc/action-dispatchers/AppThunk';
import { convertFromRemoteFormat } from '@admin-pc/actions/base';

export const search = (param) => (dispatch: AppDispatch) => {
  dispatch(loadingStart());
  const req = { path: `/feature-access/search`, param };
  return Api.invoke(req)
    .then((result) => {
      const records = (result.records || []).map(convertFromRemoteFormat);
      dispatch(searchSuccess(COM_SEARCH_FEATURE_ACCESS, records, 'Common'));
      dispatch(searchSuccess(ATT_SEARCH_FEATURE_ACCESS, records, 'Attendance'));
      dispatch(searchSuccess(EXP_SEARCH_FEATURE_ACCESS, records, 'Expense'));
      dispatch(
        searchSuccess(TIME_SEARCH_FEATURE_ACCESS, records, 'TimeTracking')
      );
      dispatch(searchSuccess(PSA_SEARCH_FEATURE_ACCESS, records, 'PSA'));
      return records;
    })
    .catch((err) => {
      dispatch(searchError('SEARCH_FEATURE_ACCESS_ERROR'));
      dispatch(catchApiError(err, { isContinuable: true }));
      throw err; // 後続（component/MainContent）のthenをスキップさせる
    })
    .finally(() => {
      dispatch(loadingEnd());
    });
};
