import { Dispatch } from 'redux';

import moment from 'moment';

import { catchApiError } from '@commons/actions/app';
import DateUtil from '@commons/utils/DateUtil';

import {
  MODE,
  setModeBase,
  setModeHistory,
  showDetailPane,
} from '../../modules/base/detail-pane/ui';
import { actions as detailActions } from '../../modules/workingType/ui/detail';
import { actions as listActions } from '../../modules/workingType/ui/list';

import { setEditRecord, setEditRecordHistory } from '../../actions/editRecord';
import { searchHistoryWorkingType } from '../../actions/workingType';
import { AppDispatch } from '@apps/admin-pc/action-dispatchers/AppThunk';

import * as RecordUtil from '../../utils/RecordUtil';

const getClosestHistory = (records: any[]) => {
  if (!records.length) {
    return null;
  }

  const targetDate = moment().format('YYYY-MM-DD');
  const targetMsec = DateUtil.toUnixMsec(targetDate);
  let closest = records[0];

  records.forEach((record) => {
    const closestMsec = DateUtil.toUnixMsec(closest.validDateFrom);
    const currentMsec = DateUtil.toUnixMsec(record.validDateFrom);
    const closestDiff = Math.abs(targetMsec - closestMsec);
    const currentDiff = Math.abs(targetMsec - currentMsec);

    if (
      closest.validDateFrom > targetDate &&
      record.validDateFrom <= targetDate
    ) {
      closest = record;
    } else if (currentDiff < closestDiff) {
      closest = record;
    }
  });

  return closest;
};

export const closeDetailPanel = () => (dispatch: Dispatch<any>) => {
  dispatch(showDetailPane(false));
  dispatch(setEditRecord({}));
  dispatch(setEditRecordHistory({}));
  dispatch(setModeBase(MODE.VIEW));
  dispatch(setModeHistory(MODE.VIEW));
  dispatch(listActions.resetSelectedCode());
};

export const openDetailPanel =
  (editRecord: RecordUtil.Record) => async (dispatch: AppDispatch) => {
    dispatch(listActions.setSelectedCode(editRecord.code));

    dispatch(setEditRecord(editRecord));

    const historyList = await dispatch(
      searchHistoryWorkingType({
        baseId: editRecord.id,
      })
    );

    const history = getClosestHistory(historyList);

    if (!history) {
      dispatch(
        catchApiError(new Error("Can't find a record."), {
          isContinuable: false,
        })
      );
      return;
    }

    dispatch(setEditRecordHistory(history));
    dispatch(detailActions.setSelectedHistoryId(history.id));

    dispatch(showDetailPane(true));
    dispatch(setModeBase(MODE.VIEW));
    dispatch(setModeHistory(MODE.VIEW));
  };
