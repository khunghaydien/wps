import {
  MODE,
  setModeBase,
  setModeHistory,
  showRevisionDialog as setRevisionDialog,
} from '../../modules/base/detail-pane/ui';

import { AppDispatch } from '../AppThunk';

// eslint-disable-next-line import/prefer-default-export
export const showRevisionDialog = () => (dispatch: AppDispatch) => {
  dispatch(setRevisionDialog(true));
  dispatch(setModeBase(MODE.VIEW));
  dispatch(setModeHistory(MODE.VIEW));
};
