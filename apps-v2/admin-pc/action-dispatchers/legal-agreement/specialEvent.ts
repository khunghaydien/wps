import { bindActionCreators } from 'redux';

import { SpecialEvent } from '../../models/legal-agreement/LegalAgreementEvent';

import { actions as detail } from '../../modules/legalAgreement/ui/detail';
import { actions } from '../../modules/legalAgreement/ui/specialEvent';

import { AppDispatch } from '../AppThunk';

interface LegalAgreementSpecialEventService {
  set: (event: SpecialEvent) => void;
  unset: () => void;
  update: (key: string, value: number) => void;
  setShowFlag: (flag: boolean) => void;
  setSpecialEvent: (event: SpecialEvent) => void;
  setIsLoading: (flag: boolean) => void;
}

export default (dispatch: AppDispatch): LegalAgreementSpecialEventService => {
  const eventActions = bindActionCreators(actions, dispatch);
  const detailActions = bindActionCreators(detail, dispatch);
  return {
    set: eventActions.set,
    unset: eventActions.unset,
    update: eventActions.update,
    setShowFlag: eventActions.setShowFlag,
    setSpecialEvent: detailActions.setSpecialEvent,
    setIsLoading: eventActions.setIsLoading,
  };
};
