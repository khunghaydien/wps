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
  setUser: (arg0: User) => void;
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
  }
>;

const UserSearchDialog = (props: Props) => {
  const [selectedId, setSelectedId] = useState('');

  const onClickSearch = (param: { name: string; userName: string }) => {
    props.search({ ...param, excludeLinked: true });
  };

  const handleRowClick = (rowIdx: number, row: User) => {
    const id = selectedId !== row.id ? row.id : '';
    setSelectedId(id);
  };

  const handleRowsToggle = (rows: Array<{ row: User }>) => {
    handleRowClick(0, rows[0].row);
  };

  const setUser = () => {
    const jobType = props.users.find(({ id }) => id === selectedId) || {};
    // @ts-ignore
    props.setUser(jobType);
  };

  let rows = props.users.map((row) => {
    const isSelected = row.id === selectedId;
    return { ...row, isSelected };
  });

  rows = rows.slice(0, props.maxNum);

  const isExceeded = props.users.length > props.maxNum;

  return (
    <DialogFrame
      className={ROOT}
      title={msg().Admin_Lbl_SelectSalesforceUser}
      hide={props.hideDialog}
      footer={
        <DialogFrame.Footer>
          <Button className={`${ROOT}__button`} onClick={props.hideDialog}>
            {msg().Com_Btn_Cancel}
          </Button>
          <Button
            className={`${ROOT}__button ${ROOT}__add-button`}
            disabled={!selectedId}
            onClick={setUser}
          >
            {msg().Com_Btn_Add}
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
              props.maxNum
            )}
          </div>
        )}
      </div>
    </DialogFrame>
  );
};

export default UserSearchDialog;
