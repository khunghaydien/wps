import {
  getResourceGroup,
  searchRMResourceGroup,
} from '@apps/admin-pc/actions/resourceGroup';

import { AppDispatch } from './AppThunk';

export const getGroupMembers = (groupId: string) => (dispatch: AppDispatch) => {
  dispatch(getResourceGroup({ id: groupId }));
};

export const getGroupList =
  (companyId: string, ownerId?: string) => (dispatch: AppDispatch) => {
    dispatch(searchRMResourceGroup({ companyId, ownerId }));
  };
