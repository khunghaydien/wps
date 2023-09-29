import React, { useState } from 'react';

import Button from '../../../../commons/components/buttons/Button';
import DialogFrame from '../../../../commons/components/dialogs/DialogFrame';
import msg from '../../../../commons/languages';
import TextUtil from '../../../../commons/utils/TextUtil';

import { User } from '../../../models/User';

import DataGrid from '../../../components/DataGrid';
import SearchArea from '../../../components/SearchArea';

import './index.scss';

const ROOT = 'admin-pc-user-search-dialog';

export type SearchProps = {
  maxNum: number;
  setUser: (user: User | User[]) => void;
};

type Props = Readonly<
  SearchProps & {
    hideDialog: () => void;
    users: User[];
    search: (arg0: {
      name: string;
      userName: string;
      excludeLinked: boolean;
    }) => any;
    isMultiSelect?: boolean;
  }
>;

const UserSearchDialog = ({
  isMultiSelect = false,
  maxNum,
  users,
  setUser,
  search,
  hideDialog,
}: Props) => {
  const [selectedUsers, setSelectedUsers] = useState<User[]>([]);

  const onClickSearch = (param: { name: string; userName: string }) => {
    search({ ...param, excludeLinked: true });
  };

  const handleRowClick = (_rowIdx: number, row: User) => {
    const hadBeenSelected = selectedUsers.find(({ id }) => id === row.id);

    if (hadBeenSelected) {
      const updatedSelectedUsers = selectedUsers.filter(
        ({ id }) => id !== row.id
      );

      setSelectedUsers(updatedSelectedUsers);
      return;
    }

    if (isMultiSelect) {
      setSelectedUsers((selectedUsers) => [...selectedUsers, row]);
      return;
    }

    setSelectedUsers([row]);
  };

  const handleRowsToggle = (rows: Array<{ row: User; rowIdx: number }>) => {
    handleRowClick(rows[0].rowIdx, rows[0].row);
  };

  const onClickAddUser = () => {
    if (selectedUsers.length <= 0) {
      return null;
    }

    if (isMultiSelect) {
      setUser(selectedUsers);
      return;
    }

    setUser(selectedUsers[0]);
  };

  const rows = users
    .map((row) => {
      const isSelected = selectedUsers.find(({ id }) => id === row.id);
      return { ...row, isSelected };
    })
    .splice(0, maxNum);

  const isExceeded = users.length > maxNum;

  return (
    <DialogFrame
      className={ROOT}
      title={msg().Admin_Lbl_SelectSalesforceUser}
      hide={hideDialog}
      footer={
        <DialogFrame.Footer>
          <Button className={`${ROOT}__button`} onClick={hideDialog}>
            {msg().Com_Btn_Cancel}
          </Button>
          <Button
            className={`${ROOT}__button ${ROOT}__add-button`}
            disabled={selectedUsers.length <= 0}
            onClick={onClickAddUser}
          >
            {`${msg().Com_Btn_Add} ${
              selectedUsers.length > 0 && isMultiSelect
                ? `(${selectedUsers.length})`
                : ''
            }`}
          </Button>
        </DialogFrame.Footer>
      }
    >
      <div className={`${ROOT}__body ${ROOT}__list--search-result`}>
        <SearchArea
          fields={['name', 'userName']}
          onClickSearchBtn={onClickSearch}
        />
        <DataGrid
          rowHeight={44}
          numberOfRowsVisibleWithoutScrolling={5}
          columns={[
            {
              key: 'name',
              name: msg().Admin_Lbl_Name,
            },
            {
              key: 'userName',
              name: msg().Admin_Lbl_UserName,
            },
          ]}
          showCheckbox
          rows={rows}
          onRowClick={handleRowClick}
          onRowsSelected={handleRowsToggle}
          onRowsDeselected={handleRowsToggle}
        />
        {isExceeded && (
          <div className={`${ROOT}__too-many-results`}>
            {TextUtil.template(
              msg().Com_Lbl_SearchResultsExceededLimit,
              maxNum
            )}
          </div>
        )}
      </div>
    </DialogFrame>
  );
};

export default UserSearchDialog;
