import { bindActionCreators } from 'redux';

import {
  MODE,
  setModeBase,
  showDetailPane,
} from '../../modules/base/detail-pane/ui';
import { actions as listActions } from '../../modules/pattern/ui/list';

import { setEditRecord } from '../../actions/editRecord';

import { Record } from '../../utils/RecordUtil';

import { AppDispatch } from '../AppThunk';

interface PatternPaneService {
  closeDetailPanel: () => void;
  openDetailPanel: (editRecord: Record) => Promise<void>;
}

export default (dispatch: AppDispatch): PatternPaneService => {
  const list = bindActionCreators(listActions, dispatch);
  return {
    closeDetailPanel: () => {
      dispatch(showDetailPane(false));
      dispatch(setEditRecord({}));
      dispatch(setModeBase(MODE.VIEW));
      list.resetSelectedCode();
    },
    openDetailPanel: async (editRecord: Record) => {
      list.setSelectedCode(editRecord.code);
      dispatch(setEditRecord(editRecord));
      dispatch(showDetailPane(true));
      dispatch(setModeBase(MODE.VIEW));
    },
  };
};
