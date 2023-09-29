import { bindActionCreators } from 'redux';

import { LimitEvent } from '../../models/legal-agreement/LegalAgreementEvent';

import { actions as detail } from '../../modules/legalAgreement/ui/detail';
import { actions } from '../../modules/legalAgreement/ui/event';

import { AppDispatch } from '../AppThunk';

interface LegalAgreementEventService {
  set: (event: LimitEvent) => void;
  unset: () => void;
  update: (key: string, value: number) => void;
  setShowFlag: (flag: boolean) => void;
  setLimitEvent: (event: LimitEvent) => void;
  setIsLoading: (flag: boolean) => void;
}

export default (dispatch: AppDispatch): LegalAgreementEventService => {
  const eventActions = bindActionCreators(actions, dispatch);
  const detailActions = bindActionCreators(detail, dispatch);
  return {
    set: eventActions.set,
    unset: eventActions.unset,
    update: eventActions.update,
    setShowFlag: eventActions.setShowFlag,
    setLimitEvent: detailActions.setLimitEvent,
    setIsLoading: eventActions.setIsLoading,
  };
};
