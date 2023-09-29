import React, { useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { bindActionCreators } from 'redux';

import { User } from '@apps/admin-pc/models/User';

import { actions as userListActions } from '../../modules/employee/entities/userList';
import { actions as detailActions } from '../../modules/employee/ui/detail';
import { actions as userDialogActions } from '../../modules/employee/ui/userDialog';

import { searchUsers } from '../../action-dispatchers/employee/Detail';

import { State } from '../../reducers';

import Component from '../../presentational-components/Employee/UserSearchDialog';

const mapStateToProps = (state: State) => ({
  users: state.employee.entities.userList,
});

const UserSearchDialogContainer = () => {
  const props = useSelector(mapStateToProps);
  const dispatch = useDispatch();

  const Actions = useMemo(
    () =>
      bindActionCreators(
        {
          search: searchUsers,
          clearDialog: userListActions.clear,
          hideDialog: userDialogActions.hide,
          changeBaseRecordValue: detailActions.setBaseRecordByKeyValue,
        },
        dispatch
      ),
    [dispatch]
  );

  const MAX_NUM = 100;

  return (
    <Component
      {...props}
      maxNum={MAX_NUM}
      search={Actions.search}
      hideDialog={() => {
        Actions.clearDialog();
        Actions.hideDialog();
      }}
      setUser={(user: User) => {
        const { id, name, userName } = user;
        Actions.changeBaseRecordValue('userId', id);
        Actions.changeBaseRecordValue('userName', userName);
        Actions.changeBaseRecordValue('name', name);
        Actions.clearDialog();
        Actions.hideDialog();
      }}
    />
  );
};

export default UserSearchDialogContainer;
