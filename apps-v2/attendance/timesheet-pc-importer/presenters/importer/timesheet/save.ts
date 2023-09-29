import msg from '@commons/languages';

import { REASON } from '@attendance/domain/models/Result';

import * as actions from '@attendance/timesheet-pc-importer/modules/actions';

import { IPresenter } from '@attendance/application/useCaseInteractors/importer/timesheet/SaveUseCaseInteractor';
import {
  AppDispatch,
  AppStore,
} from '@attendance/timesheet-pc-importer/store/AppStore';

export default ({ dispatch }: AppStore) =>
  (): IPresenter => ({
    start: () => {
      dispatch(actions.common.app.loadingStart());
    },
    complete: (result) => {
      if (result.result === true) {
        (dispatch as AppDispatch)(
          actions.common.showToast(msg().Att_Msg_ImpImportSuccess)
        );
      } else {
        if (result.reason === REASON.NO_RECORD) {
          dispatch(
            actions.common.app.catchBusinessError(
              msg().Com_Err_ErrorTitle,
              msg().Att_Msg_ImpPleaseSelectValidRecord,
              '',
              { isContinuable: true }
            )
          );
        }
      }
    },
    error: (err) => {
      dispatch(
        actions.common.app.catchApiError(
          err as Parameters<
            typeof actions['common']['app']['catchApiError']
          >[0],
          {
            isContinuable: true,
          }
        )
      );
    },
    finally: () => {
      dispatch(actions.common.app.loadingEnd());
    },
  });
