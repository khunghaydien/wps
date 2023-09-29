import msg from '@commons/languages';

import * as actions from '@attendance/timesheet-pc-importer/modules/actions';

import { IPresenter } from '@attendance/application/useCaseInteractors/importer/timesheet/FetchContractedWorkTimesUseCaseInteractor';
import { IInputData } from '@attendance/domain/useCases/importer/timesheet/IFetchContractedWorkTimesUseCase';
import { AppStore } from '@attendance/timesheet-pc-importer/store/AppStore';

export default ({ dispatch }: AppStore) =>
  (inputData: IInputData): IPresenter => ({
    start: () => {
      dispatch(actions.common.app.loadingStart());
    },
    complete: (records) => {
      const startDate =
        Array.from(records?.at(0)?.records?.values() || [])?.at(0)
          ?.recordDate ?? null;
      const endDate =
        Array.from(records?.at(-1)?.records?.values() || [])?.at(-1)
          ?.recordDate ?? null;

      if (
        !startDate ||
        !endDate ||
        inputData.startDate < startDate ||
        endDate < inputData.endDate
      ) {
        dispatch(
          actions.common.app.catchBusinessError(
            msg().Com_Err_ErrorTitle,
            msg().Att_Msg_ImpContractedWorkTimeIsOutOfRange,
            '',
            { isContinuable: true }
          )
        );
      }

      dispatch(actions.timesheet.setContractedWorkTimes(records));
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
