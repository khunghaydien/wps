import { Dispatch } from 'redux';

import { catchApiError } from '../../../commons/actions/app';

import { actions as detailActions } from '../../modules/attendanceFeatureSetting/ui/detail';
import { actions as listActions } from '../../modules/attendanceFeatureSetting/ui/list';
import {
  MODE,
  setModeBase,
  setModeHistory,
  showDetailPane,
} from '../../modules/base/detail-pane/ui';

import { searchHistoryFeatureSetting } from '../../actions/attendanceFeatureSetting';
import { setEditRecord, setEditRecordHistory } from '../../actions/editRecord';
import { AppDispatch } from '@apps/admin-pc/action-dispatchers/AppThunk';

import * as RecordUtil from '../../utils/RecordUtil';

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
      searchHistoryFeatureSetting({
        companyId: editRecord.companyId,
      })
    );
    const history = historyList.find((item) => item.baseId === editRecord.id);
    if (!history) {
      dispatch(
        catchApiError(new Error("Can't find a record."), {
          isContinuable: false,
        })
      );
      return;
    }
    dispatch(setEditRecordHistory(history));
    dispatch(
      detailActions.setTempOpsRecordAggregate(history.opsRecordAggregateSetting)
    );
    dispatch(detailActions.setSelectedHistoryId(history.id));

    dispatch(showDetailPane(true));
    dispatch(setModeBase(MODE.VIEW));
    dispatch(setModeHistory(MODE.VIEW));
  };
