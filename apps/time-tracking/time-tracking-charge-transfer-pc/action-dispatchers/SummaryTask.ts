import parse from 'date-fns/parse';
import groupBy from 'lodash/groupBy';

import { TIME_TRACK_UPDATED } from '@apps/commons/constants/customEventName';
import * as ToastMessageType from '@apps/time-tracking/time-tracking-charge-transfer-pc/constants/ToastMessageType';

import { loadingEnd, loadingStart } from '@apps/commons/actions/app';
import msg from '@apps/commons/languages';
import { actions as toast, showToast } from '@apps/commons/modules/toast';
import dispatchEvent from '@apps/commons/utils/EventUtil';
import TextUtil from '@apps/commons/utils/TextUtil';

import SummaryRepository from '@apps/repositories/time-tracking/SummaryRepository';

import {
  action,
  State,
} from '@apps/time-tracking/time-tracking-charge-transfer-pc/modules/ui/timeTrackingCharge';

import { AppDispatch } from '@apps/time-tracking/time-tracking-charge-transfer-pc/action-dispatchers/AppThunk';

import { generateMsgFromCode } from '@apps/time-tracking/time-tracking-charge-transfer-pc/helper/generateMsgFromCode';

export default (dispatch: AppDispatch) =>
  ({
    update: async (
      param: Parameters<typeof SummaryRepository.updateSummaryTask>[number],
      destinationTask: State['destTask'],
      onSuccess: () => void
    ): Promise<void> => {
      if (parse(param.startDate) > parse(param.endDate)) {
        dispatch(toast.show(msg().Trac_Err_InvalidStartEndDate, 'error'));
        return;
      }

      dispatch(loadingStart());
      try {
        const { dateList, isSuccess } =
          await SummaryRepository.updateSummaryTask(param);
        const byReason = groupBy(dateList, 'reason');
        const message = Object.keys(byReason)
          .map((code: typeof dateList[number]['reason']) => {
            const templateMessage = generateMsgFromCode(code);
            const dateListString = byReason[code]
              .map((e) => e.targetDate)
              .join(', ');
            const message = TextUtil.template(
              templateMessage,
              dateListString,
              destinationTask.jobName,
              destinationTask.workCategoryName
            );
            return message;
          })
          .join('\n');

        if (isSuccess) {
          dispatch(showToast(message));
          dispatch(action.RESET());
          onSuccess();
          // Update subapp time tracking summary
          dispatchEvent(TIME_TRACK_UPDATED);
        } else {
          dispatch(
            toast.show(message, 'error', {
              messageType: ToastMessageType.TRANSFER_RESULT_WITH_WARNING,
            })
          );
        }
      } catch (err) {
        dispatch(toast.show(err.message, 'error'));
      } finally {
        dispatch(loadingEnd());
      }
    },
  } as const);
