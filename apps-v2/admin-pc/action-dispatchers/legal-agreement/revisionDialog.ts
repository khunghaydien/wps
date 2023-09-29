import {
  MODE,
  setModeBase,
  setModeHistory,
  showRevisionDialog as setRevisionDialog,
} from '../../modules/base/detail-pane/ui';

import { AppDispatch } from '../AppThunk';

interface LegalAgreementRevisionService {
  showRevisionDialog: () => void;
  closeRevisionDialog: () => void;
}

export default (dispatch: AppDispatch): LegalAgreementRevisionService => {
  return {
    showRevisionDialog: () => {
      dispatch(setRevisionDialog(true));
      dispatch(setModeBase(MODE.VIEW));
      dispatch(setModeHistory(MODE.VIEW));
    },
    closeRevisionDialog: () => {
      dispatch(setRevisionDialog(false));
    },
  };
};
