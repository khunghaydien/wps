// @flow
import {
  catchApiError,
  loadingEnd,
  loadingStart,
} from '../../commons/actions/app';

import { actions as rootActions } from '../modules/response';

export const execute = (request: any) => {
  return (dispatch: Dispatch<any>) => {
    dispatch(loadingStart());
    dispatch(rootActions.get(request))
      .catch((err) => dispatch(catchApiError(err, { isContinuable: false })))
      .then(() => {
        dispatch(loadingEnd());
      });
  };
};

export default execute;
