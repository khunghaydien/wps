import { bindActionCreators } from 'redux';

import { catchApiError } from '@apps/commons/actions/app';

import {
  convertToLimitEvent,
  convertToSpecialEvent,
} from '../../models/legal-agreement/LegalAgreement';

import {
  MODE,
  setModeBase,
  setModeHistory,
  showDetailPane,
} from '../../modules/base/detail-pane/ui';
import { actions as detailActions } from '../../modules/legalAgreement/ui/detail';
import { actions as listActions } from '../../modules/legalAgreement/ui/list';

import { setEditRecord, setEditRecordHistory } from '../../actions/editRecord';
import { searchHistoryLegalAgreement } from '../../actions/legalAgreement';

import { Record } from '../../utils/RecordUtil';

import { AppDispatch } from '../AppThunk';

interface LegalAgreementPaneService {
  closeDetailPanel: () => void;
  openDetailPanel: (editRecord: Record) => Promise<void>;
}

export default (dispatch: AppDispatch): LegalAgreementPaneService => {
  const list = bindActionCreators(listActions, dispatch);
  const detail = bindActionCreators(detailActions, dispatch);
  return {
    closeDetailPanel: () => {
      dispatch(showDetailPane(false));
      dispatch(setEditRecord({}));
      dispatch(setEditRecordHistory({}));
      detail.setLimitEvent({});
      detail.setSpecialEvent({});
      dispatch(setModeBase(MODE.VIEW));
      dispatch(setModeHistory(MODE.VIEW));
      list.resetSelectedCode();
    },
    openDetailPanel: async (editRecord: Record) => {
      list.setSelectedCode(editRecord.code);

      dispatch(setEditRecord(editRecord));

      const historyList = await dispatch(
        searchHistoryLegalAgreement({
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

      const limitEvent = convertToLimitEvent(history);
      const specialEvent = convertToSpecialEvent(history);

      dispatch(setEditRecordHistory(history));
      detail.setSelectedHistoryId(editRecord.historyId);
      detail.setLimitEvent(limitEvent);
      detail.setSpecialEvent(specialEvent);

      dispatch(showDetailPane(true));
      dispatch(setModeBase(MODE.VIEW));
      dispatch(setModeHistory(MODE.VIEW));
    },
  };
};
