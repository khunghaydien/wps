import { Store } from 'redux';

import * as commonActions from '@apps/commons/actions/app';
import {
  catchApiError,
  loadingEnd,
  loadingStart,
} from '@apps/commons/actions/app';
import AskInsufficientRestTime from '@apps/commons/components/dialogs/confirm/AskInsufficientRestTime';

import { IPresenter } from '@attendance/application/useCaseInteractors/dailyRecord/SaveUseCaseInteractor';

export default ({ dispatch }: Store): IPresenter => ({
  start: () => {
    dispatch(loadingStart());
  },
  complete: () => {},
  error: (err) => {
    if (err instanceof Array) {
      // より強力なエラーは reducer 内で上書きされないようになっているため
      // すべてのエラーを dispatch しておく。
      // 後勝ちになってしまうので reverse して実質的に先勝ちにする。
      err.reverse().forEach((e) => {
        dispatch(catchApiError(e));
      });
    } else {
      dispatch(catchApiError(err as Parameters<typeof catchApiError>[0]));
    }
  },
  confirmToComplementInsufficientingRestTime: async ({
    insufficientRestTime,
  }) => {
    dispatch(loadingEnd());
    const result = (await dispatch(
      // @ts-ignore
      commonActions.confirm({
        Component: AskInsufficientRestTime,
        params: {
          insufficientRestTime,
        },
      })
    )) as unknown as boolean;
    dispatch(loadingStart());
    return result;
  },
  finally: () => {
    dispatch(loadingEnd());
  },
});
