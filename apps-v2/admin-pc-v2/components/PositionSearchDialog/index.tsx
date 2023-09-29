import React, { useState } from 'react';

import Button from '../../../commons/components/buttons/Button';
import DialogFrame from '../../../commons/components/dialogs/DialogFrame';
import msg from '../../../commons/languages';
import TextUtil from '../../../commons/utils/TextUtil';

import DataGrid from '@admin-pc/components/DataGrid';
import SearchArea from '@admin-pc/components/SearchArea';

import './index.scss';

const ROOT = 'admin-pc-v2-position-search-dialog';

export type SearchProps = {
  maxNum: number;
  setPosition: (arg0) => void;
  search: (code: string, name: string) => any;
  excludedIds?: Array<string>;
  isMultiple?: boolean;
};

type Props = SearchProps & {
  hideDialog: () => void;
};

const PositionSearchDialog = (props: Props) => {
  const [selectedIds, setSelectedIds] = useState([]);
  const [positionList, setPositionList] = useState([]);

  const onClickSearch = async (param: { code: string; name: string }) => {
    const { code, name } = param;
    const { excludedIds = [], search } = props;
    const records = await search(code, name);
    setPositionList(records.filter(({ id }) => !excludedIds.includes(id)));
  };

  const handleRowClick = (rowIdx: number, row) => {
    if (!props.isMultiple) {
      setSelectedIds(selectedIds.includes(row.id) ? [] : [row.id]);
      return;
    }
    if (rowIdx < 0) {
      const idList = (window.event.target as any).checked
        ? positionList.map(({ id }) => id)
        : [];
      setSelectedIds(idList);
    } else if (selectedIds.includes(row.id)) {
      setSelectedIds(selectedIds.filter((id) => id !== row.id));
    } else {
      setSelectedIds(selectedIds.concat(row.id));
    }
  };

  const handleRowsToggle = (rows: Array<{ row }>) => {
    if (rows.length > 1) {
      handleRowClick(-1, rows);
      return;
    }
    handleRowClick(0, rows[0].row);
  };

  const setPosition = () => {
    const positions = positionList.filter(
      ({ id }) => selectedIds.indexOf(id) > -1
    );
    props.setPosition(positions);
  };

  const rows = positionList.map((row) => {
    const isSelected = selectedIds.includes(row.id);
    return { ...row, isSelected };
  });

  return (
    <DialogFrame
      className={ROOT}
      title={msg().Admin_Lbl_SelectPosition}
      hide={props.hideDialog}
      footer={
        <DialogFrame.Footer>
          <Button className={`${ROOT}__button`} onClick={props.hideDialog}>
            {msg().Com_Btn_Cancel}
          </Button>
          <Button
            className={`${ROOT}__button ${ROOT}__add-button`}
            disabled={selectedIds.length === 0}
            onClick={setPosition}
          >
            {msg().Com_Btn_Add}
          </Button>
        </DialogFrame.Footer>
      }
    >
      <div
        className={`${ROOT}__body ${ROOT}__list--search-result ${
          !props.isMultiple && 'is-select-single'
        }`}
      >
        <SearchArea
          fields={['code', 'name']}
          onClickSearchBtn={onClickSearch}
        />
        <DataGrid
          rowHeight={44}
          numberOfRowsVisibleWithoutScrolling={5}
          columns={[
            {
              key: 'code',
              name: msg().Admin_Lbl_Code,
            },
            {
              key: 'name',
              name: msg().Admin_Lbl_Name,
            },
          ]}
          showCheckbox
          rows={rows}
          onRowClick={handleRowClick}
          onRowsSelected={handleRowsToggle}
          onRowsDeselected={handleRowsToggle}
        />
        {positionList.length > props.maxNum && (
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

export default PositionSearchDialog;
