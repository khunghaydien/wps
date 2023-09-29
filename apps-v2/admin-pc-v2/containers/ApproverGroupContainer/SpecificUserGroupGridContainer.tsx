import React, { useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { bindActionCreators } from 'redux';

import styled from 'styled-components';

import Button from '@apps/commons/components/buttons/Button';
import msg from '@commons/languages';

import { MODE } from '@apps/admin-pc/modules/base/detail-pane/ui';
import { actions as userListActions } from '@apps/admin-pc/modules/employee/entities/userList';
import { actions as userDialogActions } from '@apps/admin-pc/modules/employee/ui/userDialog';

import { searchUsers } from '@apps/admin-pc/action-dispatchers/employee/Detail';
import { setTmpEditRecordByKeyValue } from '@apps/admin-pc/actions/editRecord';

import { State } from '@apps/admin-pc-v2/reducers';

import DataGrid from '@apps/admin-pc/components/DataGrid';
import UserSearchDialog from '@apps/admin-pc/presentational-components/Employee/UserSearchDialog';

import './SpecificUserGroupGridContainer.scss';

type User = { id: string; username: string };

const ROOT = 'admin-pc-detail-pane-approver-group-grid';

const SpecificUserApproverGroupGridContainer = (props) => {
  /*
   * Map state to props
   */
  const mode = useSelector((state: State) => state.base.detailPane.ui.modeBase);
  const persistentUsers: User[] = useSelector(
    (state: State) => state.approverGroup.entities.memberList
  );
  const isSearchUsersDialogOpen =
    useSelector((state: State) => state.employee.ui.userDialog) ?? false;
  const searchUserDialogUsersList = useSelector(
    (state: State) => state.employee.entities.userList
  );

  const [targetUsers, setTargetUsers] = useState<User[]>([]);
  const [selectedUserIds, setSelectedUserIds] = useState<User['id'][]>([]);

  // for main list
  const targetUsersWithStateOfSelection = useMemo(
    () =>
      targetUsers.map((user) => ({
        ...user,
        isSelected: selectedUserIds.includes(user.id),
      })),
    [targetUsers, selectedUserIds]
  );

  // for user search dialog
  const candidateUsersToAdd = useMemo(() => {
    const targettedUserIds = targetUsers.map(({ id }) => id);
    return (searchUserDialogUsersList || []).filter(
      ({ id }) => !targettedUserIds.includes(id)
    );
  }, [targetUsers, searchUserDialogUsersList]);

  /*
   * Map dispatch to props
   */
  const dispatch = useDispatch();

  const Actions = useMemo(
    () =>
      bindActionCreators(
        {
          searchUsers,
          clearDialog: userListActions.clear,
          hideDialog: userDialogActions.hide,
          showDialog: userDialogActions.show,
        },
        dispatch
      ),
    [dispatch]
  );

  const onRowsSelected = (rows) => {
    setSelectedUserIds((prevUserIds) => [
      ...prevUserIds,
      ...rows.map(({ row: { id } }) => id),
    ]);
  };

  const onRowsDeselected = (rows) => {
    const deselectedUserIds = rows.map(({ row: { id } }) => id);
    setSelectedUserIds((prevUserIds) =>
      prevUserIds.filter((userId) => !deselectedUserIds.includes(userId))
    );
  };

  const onRemoveUsers = () => {
    setTargetUsers(
      targetUsers.filter(({ id }) => !selectedUserIds.includes(id))
    );
    setSelectedUserIds([]);
  };

  const onAddUser = (selectedUsers) => {
    const usersToAdd = selectedUsers.map(({ id, name }) => ({
      id,
      username: name,
    }));
    setTargetUsers((prevUsers) => [...prevUsers, ...usersToAdd]);

    Actions.clearDialog();
    Actions.hideDialog();
  };

  const showSearchUserDialog = (showDialog) => () => {
    if (showDialog) {
      Actions.showDialog();
      return;
    }

    Actions.clearDialog();
    Actions.hideDialog();
  };

  const onSearchUsers = (props) => {
    Actions.searchUsers({
      ...props,
      excludeLinked: false,
      excludeInactiveUser: true,
      userTypes: ['Standard'],
    });
  };

  /*
   * Life-Cycle
   */
  useEffect(() => {
    setTargetUsers(persistentUsers);
    const userIds = persistentUsers.map(({ id }) => id);
    if (mode !== MODE.VIEW) {
      dispatch(setTmpEditRecordByKeyValue('userIds', userIds));
    }
  }, [mode, persistentUsers, dispatch]);

  useEffect(() => {
    const userIds = targetUsers.map(({ id }) => id);
    dispatch(setTmpEditRecordByKeyValue('userIds', userIds));
  }, [targetUsers, dispatch]);

  /*
   * Render
   */
  const isEditable = mode === MODE.EDIT || mode === MODE.NEW;

  return (
    <div className={isEditable ? ROOT : `${ROOT}__dataGrid-disabled`}>
      <span>{msg().Admin_Lbl_Approvers}</span>
      <ApproverGroupGridActionButtonGroup>
        <Button
          type="secondary"
          disabled={!isEditable}
          onClick={showSearchUserDialog(true)}
        >
          {msg().Com_Btn_Add}
        </Button>
        <Button
          type="destructive"
          disabled={!isEditable || selectedUserIds.length < 0}
          onClick={onRemoveUsers}
        >
          {msg().Com_Btn_Remove}
        </Button>
      </ApproverGroupGridActionButtonGroup>

      {isSearchUsersDialogOpen && (
        <UserSearchDialog
          {...props}
          isMultiSelect
          users={candidateUsersToAdd}
          maxNum={100}
          search={onSearchUsers}
          hideDialog={showSearchUserDialog(false)}
          setUser={onAddUser}
        />
      )}

      <DataGrid
        showCheckbox
        disabled={!isEditable}
        onRowsSelected={onRowsSelected}
        onRowsDeselected={onRowsDeselected}
        columns={[
          {
            key: 'username',
            name: msg().Admin_Lbl_UserName,
            filterable: true,
          },
        ]}
        rows={targetUsersWithStateOfSelection}
      />
    </div>
  );
};

export default SpecificUserApproverGroupGridContainer;

const ApproverGroupGridActionButtonGroup = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 8px 0;
`;
