import isNil from 'lodash/isNil';
import moment from 'moment';

import { getUserSetting } from '../../../commons/actions/userSetting';
import msg from '../../../commons/languages';
import { showToast } from '../../../commons/modules/toast';
import TextUtil from '../../../commons/utils/TextUtil';
import { showAlert } from '../../modules/commons/alert';
import { showConfirm } from '../../modules/commons/confirm';
import { catchApiError } from '../../modules/commons/error';
import { withLoading } from '../../modules/commons/loading';

import AttDailyRemarksRepository from '../../../repositories/attendance/AttDailyRemarksRepository';
import AttDailyTimeRepository from '../../../repositories/attendance/AttDailyTimeRepository';
import ManageCommuteCountRepository from '../../../repositories/attendance/ManageCommuteCountRepository';

import { convertToUpdateRequestParam } from '../../../domain/models/attendance/AttDailyTime';
import * as DailyRestTimeFill from '../../../domain/models/attendance/DailyRestTimeFill';
import {
  isTargetDateInTimesheet,
  Timesheet,
} from '../../../domain/models/attendance/Timesheet';

import { actions as EntitiesActions } from '../../modules/attendance/timesheet/entities';
import {
  actions as UiDailyEditingActions,
  State as UiDailyEditingState,
} from '../../modules/attendance/timesheet/ui/daily/editing';
import { actions as UiDailyPagingActions } from '../../modules/attendance/timesheet/ui/daily/paging';

import { AppDispatch } from '../AppThunk';
import { loadTimesheet } from './timesheet';

const clearTimesheet = (targetDate?: string) => (dispatch: AppDispatch) => {
  dispatch(UiDailyPagingActions.clear());
  dispatch(UiDailyEditingActions.clear());
  dispatch(EntitiesActions.clear());
  if (targetDate) {
    dispatch(UiDailyPagingActions.setCurrent(targetDate));
  }
};

const setTimesheet =
  (targetDate: string, timesheet: Timesheet) => (dispatch: AppDispatch) => {
    dispatch(UiDailyEditingActions.fetchSuccess(targetDate, timesheet));
    dispatch(UiDailyPagingActions.fetchSuccess(targetDate, timesheet));
    dispatch(EntitiesActions.fetchSuccess(timesheet));
  };

const resetTimesheet =
  (targetDate: string) =>
  async (dispatch: AppDispatch): Promise<Timesheet | null> => {
    try {
      const timesheet = await loadTimesheet(targetDate);
      dispatch(setTimesheet(targetDate, timesheet));
      return timesheet;
    } catch (error) {
      dispatch(
        catchApiError(error, {
          isContinuable: true,
        })
      );
      dispatch(clearTimesheet(targetDate));
    }
    return null;
  };

export const initialize =
  (_targetDate?: string, timesheet?: Timesheet) =>
  async (dispatch: AppDispatch): Promise<void> => {
    dispatch(clearTimesheet());

    const targetDate = _targetDate || moment().format('YYYY-MM-DD');
    const [_, $timesheet] = await dispatch(
      withLoading(
        (_dispatch: AppDispatch) => _dispatch(getUserSetting()),
        (_dispatch: AppDispatch): any => {
          if (
            !isNil(timesheet) &&
            isTargetDateInTimesheet(timesheet, targetDate)
          ) {
            _dispatch(setTimesheet(targetDate, timesheet));
            return timesheet;
          } else {
            return _dispatch(resetTimesheet(targetDate));
          }
        }
      )
    );

    if ($timesheet && $timesheet.isMigratedSummary) {
      dispatch(showAlert(msg().Att_Err_CanNotDisplayBeforeUsing));
    }
  };

export const saveAttDailyRecord =
  (editing: UiDailyEditingState, useManageCommuteCount) =>
  async (dispatch: AppDispatch) => {
    const { targetDate } = editing;
    await dispatch(
      withLoading(async () => {
        try {
          const result = await AttDailyTimeRepository.update(
            targetDate,
            convertToUpdateRequestParam({
              targetDate,
              startTime: editing.startTime,
              endTime: editing.endTime,
              restTimes: editing.restTimes,
              restHours: editing.restHours,
            })
          );
          await AttDailyRemarksRepository.update({
            recordId: editing.id,
            remarks: editing.remarks || '',
          });

          if (useManageCommuteCount) {
            await ManageCommuteCountRepository.update({
              commuteForwardCount: editing.commuteForwardCount,
              commuteBackwardCount: editing.commuteBackwardCount,
              targetDate,
            });
          }

          if (Number(result.insufficientRestTime)) {
            const confirmText = TextUtil.template(
              msg().Com_Msg_InsufficientRestTime,
              Number(result.insufficientRestTime)
            );
            if (await dispatch(showConfirm(confirmText))) {
              await DailyRestTimeFill.post({ targetDate });
            }
          }
        } catch (error) {
          dispatch(catchApiError(error));
          throw error;
        }
        dispatch(showToast(msg().Att_Lbl_SaveWorkTime));
        await dispatch(resetTimesheet(targetDate));
      })
    );
  };
