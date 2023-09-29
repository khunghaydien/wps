import { Store } from 'redux';

import BaseWSPError from '@commons/errors/BaseWSPError';
import msg from '@commons/languages';
import { showToast } from '@commons/modules/toast';
import TextUtil from '@commons/utils/TextUtil';
import { AppDispatch } from '@mobile/modules/commons/AppThunk';
import { showConfirm } from '@mobile/modules/commons/confirm';
import { catchApiError } from '@mobile/modules/commons/error';
import { endLoading, startLoading } from '@mobile/modules/commons/loading';

import { CLOCK_TYPE } from '@attendance/domain/models/DailyStampTime';

import { actions as uiActions } from '@mobile/modules/attendance/timeStamp/ui';

import { bind } from '@apps/attendance/libraries/Collection';
import { IPresenter } from '@attendance/application/useCaseInteractors/stampTime/PostUseCaseInteractor';
import { IInputData } from '@attendance/domain/useCases/stampTime/IPostUseCase';

const normal =
  (store: Store) =>
  (inputData: IInputData): IPresenter => {
    let loadingId;
    const $dispatch = store.dispatch as AppDispatch;
    return {
      start: () => {
        loadingId = $dispatch(startLoading());
      },
      complete: (result) => {
        if (result.result) {
          let stampDoneMsg = '';
          switch (inputData.clockType) {
            case CLOCK_TYPE.IN:
              stampDoneMsg = msg().Att_Msg_TimeStampDoneIn;
              break;
            case CLOCK_TYPE.REIN:
              stampDoneMsg = msg().Att_Msg_TimeStampDoneRein;
              break;
            case CLOCK_TYPE.OUT:
              stampDoneMsg = msg().Att_Msg_TimeStampDoneOut;
              break;
            default:
              return;
          }
          $dispatch(showToast(stampDoneMsg));
          $dispatch(uiActions.clearComment());
        } else {
          $dispatch(catchRequireCommentWithoutLocationError());
        }
      },
      confirmToComplementInsufficientingRestTime: async ({
        insufficientRestTime,
      }) => {
        $dispatch(endLoading(loadingId));

        const confirmText = TextUtil.template(
          msg().Com_Msg_InsufficientRestTime,
          Number(insufficientRestTime)
        );

        const result = await $dispatch(showConfirm(confirmText));

        loadingId = $dispatch(startLoading());
        return result;
      },
      error: (err) => {
        $dispatch(
          catchApiError(err as Parameters<typeof catchApiError>[0], {
            isContinuable: true,
          })
        );
      },
      finally: () => {
        $dispatch(endLoading(loadingId));
      },
    };
  };

const noCompleteMessage = (store: Store) => (inputData: IInputData) => ({
  ...normal(store)(inputData),
  complete: ({ result }) => {
    if (!result) {
      const $dispatch = store.dispatch as AppDispatch;
      $dispatch(catchRequireCommentWithoutLocationError());
    }
  },
});

const catchRequireCommentWithoutLocationError = () =>
  catchApiError(
    // @ts-ignore
    new BaseWSPError(
      msg().Com_Lbl_Error,
      msg().Att_Err_RequireCommentWithoutLocation
    ),
    // 再起可能エラーだが内部で CATCH_UNEXPECTED_ERROR に変換されて再起不能エラーになっている。
    // 当初の実装からそうだったが、ここに来ることはなかったので気がつかなかった。
    // 不問とする。
    { isContinuable: true }
  );

export default (store: Store) =>
  bind(
    {
      normal,
      noCompleteMessage,
    },
    store
  );
