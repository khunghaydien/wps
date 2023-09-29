import moment from 'moment';

import { getUserSetting } from '../../commons/actions/userSetting';
import { setUserPermission } from '../../commons/modules/accessControl/permission';

import { Permission } from '../../domain/models/access-control/Permission';
import { UserSetting } from '@apps/domain/models/UserSetting';

import { actions as taxTypeActions } from '../../domain/modules/exp/taxType';
import { actions as approvalTypeUIActions } from '../modules/ui/approvalType';
import { actions as isApexViewAction } from '../modules/ui/isApexView';
import { selectTab, tabType as TABS } from '../modules/ui/tabs';

import { getApexViewParams } from '../utils/ApexViewUtils';

import { AppDispatch } from './AppThunk';
import { getCustomRequestDetail } from './CustomRequest';
import {
  browseDetailForExpApproval,
  browseDetailForPreApproval,
} from './Expenses';

const dispatchDetailAction =
  (selectedTab, requestId, empId, recordTypeId) => (dispatch: AppDispatch) => {
    switch (selectedTab) {
      case TABS.EXPENSES:
        dispatch(browseDetailForExpApproval(requestId, empId));
        dispatch(taxTypeActions.search(moment().format('YYYY-MM-DD')));
        break;
      case TABS.EXP_PRE_APPROVAL:
        dispatch(browseDetailForPreApproval(requestId, empId));
        dispatch(taxTypeActions.search(moment().format('YYYY-MM-DD')));
        break;
      case TABS.CUSTOM_REQUEST:
        dispatch(getCustomRequestDetail(requestId, recordTypeId));
        break;
      default:
        break;
    }
  };
export const initialize =
  (param: { userPermission: Permission }, isApexViewWithParams?: boolean) =>
  (dispatch: AppDispatch) => {
    if (param) {
      dispatch(setUserPermission(param.userPermission));
    }

    dispatch(getUserSetting()).then((result: UserSetting) => {
      if (isApexViewWithParams) {
        const { tab, requestId, recordTypeId } = getApexViewParams();
        dispatch(isApexViewAction.set());
        dispatch(
          dispatchDetailAction(tab, requestId, result.employeeId, recordTypeId)
        );
      }
    });
  };

export const selectRequestType =
  (selectedType: string, currentType?: string) => (dispatch: AppDispatch) => {
    if (selectedType !== currentType) {
      dispatch(selectTab(selectedType));
      dispatch(approvalTypeUIActions.reset());
    }
  };

export default initialize;
