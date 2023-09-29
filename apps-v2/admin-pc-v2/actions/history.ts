import {
  catchApiError,
  loadingEnd,
  loadingStart,
} from '@apps/commons/actions/app';
import Api from '@apps/commons/api';

import { convertToRemoteFormat } from '@admin-pc/actions/base';

const addSubRoleSuccess = (type) => ({
  type,
});

const addSubRoleError = (type) => ({
  type,
});

export const addSubRole =
  (name, param, successType, errorType) => (dispatch) => {
    dispatch(loadingStart());

    const req = {
      path: `/${name}/history/sub-role/create`,

      param: convertToRemoteFormat(param),
    };

    return Api.invoke(req)

      .then((res) => {
        dispatch(loadingEnd());

        dispatch(addSubRoleSuccess(successType));
        return res;
      })

      .catch((err) => {
        dispatch(loadingEnd());

        dispatch(addSubRoleError(errorType));

        dispatch(catchApiError(err, { isContinuable: true }));

        throw err; // 後続（component/MainContent）のthenをスキップさせる
      });
  };
