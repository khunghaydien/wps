import { bindActionCreators } from 'redux';

import { actions as listActions } from '../../modules/legalAgreement/ui/list';
import { actions as searchActions } from '../../modules/legalAgreement/ui/searchCondition';

import { searchLegalAgreement } from '../../actions/legalAgreement';

import { AppDispatch } from '../AppThunk';
import PanelActions from './panel';

interface LegalAgreementListService {
  setSearchCondition: (key: 'targetDate', value: string) => void;
  search: (param: { companyId: string; targetDate?: string }) => void;
  resetSelectedIndex: () => void;
}

export default (dispatch: AppDispatch): LegalAgreementListService => {
  const searchCondition = bindActionCreators(searchActions, dispatch);
  const list = bindActionCreators(listActions, dispatch);
  return {
    setSearchCondition: searchCondition.set,
    search: (param: { companyId: string; targetDate?: string }) => {
      const panel = PanelActions(dispatch);
      panel.closeDetailPanel();
      dispatch(searchLegalAgreement(param));
    },
    resetSelectedIndex: list.resetSelectedCode,
  };
};
