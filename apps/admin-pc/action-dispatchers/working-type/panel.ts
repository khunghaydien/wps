import { Dispatch } from 'redux';

import { catchApiError } from '../../../commons/actions/app';

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

export const closeDetailPanel = () => (dispatch: Dispatch<any>) => {
  dispatch(showDetailPane(false));
  dispatch(setEditRecord({}));
  dispatch(setEditRecordHistory({}));
  dispatch(setModeBase(MODE.VIEW));
  dispatch(setModeHistory(MODE.VIEW));
  dispatch(listActions.resetSelectedIndex());
};

export const openDetailPanel =
  (editRecord: RecordUtil.Record) => async (dispatch: AppDispatch) => {
    dispatch(listActions.setSelectedIndex(editRecord.code));

    dispatch(setEditRecord(editRecord));

    const historyList = await dispatch(
      searchHistoryWorkingType({
        baseId: editRecord.id,
      })
    );
    const history = historyList.find(
      (item) => item.id === editRecord.historyId
    );
    if (!history) {
      dispatch(
        catchApiError(new Error("Can't find a record."), {
          isContinuable: false,
        })
      );
      return;
    }

    dispatch(setEditRecordHistory(history));
    dispatch(detailActions.setSelectedHistoryId(editRecord.historyId));

    dispatch(showDetailPane(true));
    dispatch(setModeBase(MODE.VIEW));
    dispatch(setModeHistory(MODE.VIEW));
  };
