import ApprovalType, {
  ApprovalTypeValue,
} from '../../domain/models/approval/ApprovalType';

import { actions as entitiesListActions } from '../modules/entities/attMonthly/list';
import { actions as uiApprovalTypeActions } from '../modules/ui/approvalType';
import { actions as uiFilterTermActions } from '../modules/ui/attMonthly/list/filterTerms';
import { actions as uiSelectedIdAction } from '../modules/ui/attMonthly/list/selectedIds';

import { AppDispatch } from './AppThunk';

export const initialize = () => (dispatch: AppDispatch) => {
  dispatch(uiFilterTermActions.clear());
  dispatch(uiSelectedIdAction.clear());
  dispatch(entitiesListActions.browse(ApprovalType.ByEmployee));
};

export const switchApprovalType =
  (type: ApprovalTypeValue) => (dispatch: AppDispatch) => {
    dispatch(uiApprovalTypeActions.switch(type));
    dispatch(uiFilterTermActions.clear());
    dispatch(entitiesListActions.clear());
    dispatch(uiSelectedIdAction.clear());
    return dispatch(entitiesListActions.browse(type));
  };

export default { switchApprovalType };
