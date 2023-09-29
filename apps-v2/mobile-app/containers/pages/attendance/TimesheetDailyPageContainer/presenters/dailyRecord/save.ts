import { Store } from 'redux';

import msg from '@commons/languages';
import { showToast } from '@commons/modules/toast';
import TextUtil from '@commons/utils/TextUtil';
import { AppDispatch } from '@mobile/modules/commons/AppThunk';
import { showConfirm } from '@mobile/modules/commons/confirm';
import { catchApiError } from '@mobile/modules/commons/error';
import { endLoading, startLoading } from '@mobile/modules/commons/loading';

import { IPresenter } from '@attendance/application/useCaseInteractors/dailyRecord/SaveUseCaseInteractor';
import { bind } from '@attendance/libraries/Collection';

const normal = (store: Store) => (): IPresenter => {
  let loadingId;
  const dispatch = store.dispatch as AppDispatch;
  return {
    start: () => {
      loadingId = dispatch(startLoading());
    },
    complete: () => {
      dispatch(showToast(msg().Att_Lbl_SaveWorkTime));
    },
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
      dispatch(endLoading(loadingId));

      const confirmText = TextUtil.template(
        msg().Com_Msg_InsufficientRestTime,
        insufficientRestTime
      );
      const result = await dispatch(showConfirm(confirmText));
      loadingId = dispatch(startLoading());
      return result;
    },
    finally: () => {
      dispatch(endLoading(loadingId));
    },
  };
};

const noCompleteMessage = (store: Store) => () => ({
  ...normal(store)(),
  complete: () => {},
});

export default (store: Store) =>
  bind(
    {
      normal,
      noCompleteMessage,
    },
    store
  );
