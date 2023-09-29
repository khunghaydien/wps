import React, { useState } from 'react';

import Button from '../../../commons/components/buttons/Button';
import DialogFrame from '../../../commons/components/dialogs/DialogFrame';
import DateField from '../../../commons/components/fields/DateField';
import msg from '../../../commons/languages';
import TextUtil from '../../../commons/utils/TextUtil';

import { Department } from '@apps/repositories/organization/department/DepartmentListRepository';

import DataGrid from '@admin-pc/components/DataGrid';
import SearchArea from '@admin-pc/components/SearchArea';

import './index.scss';

const ROOT = 'admin-pc-v2-department-search-dialog';

export type SearchProps = {
  maxNum: number;
  setDepartment: (arg0: Department) => void;
  targetDate: string;
  isHideDateSearch?: boolean;
  search: (code: string, name: string, targetDate: string) => any;
};

type Props = SearchProps & {
  hideDialog: () => void;
};

const DepartmentSearchDialog = (props: Props) => {
  const [selectedId, setSelectedId] = useState(null);
  const [departmentList, setDepartmentList] = useState([]);
  const [isOverLimit, setIsOverLimit] = useState(false);
  const [targetDate, setTargetDate] = useState(props.targetDate);

  const onClickSearch = async (param: { code: string; name: string }) => {
    const { code, name } = param;
    const { records, isOverLimit } = await props.search(code, name, targetDate);
    setDepartmentList(records);
    setIsOverLimit(isOverLimit);
  };

  const handleRowClick = (rowIdx: number, row: Department) => {
    const id = selectedId !== row.id ? row.id : '';
    setSelectedId(id);
  };

  const handleRowsToggle = (rows: Array<{ row: Department }>) => {
    handleRowClick(0, rows[0].row);
  };

  const setDepartment = () => {
    const department = departmentList.find(({ id }) => id === selectedId) || {};
    props.setDepartment(department);
  };

  const rows = departmentList.map((row) => {
    const isSelected = row.id === selectedId;
    return { ...row, isSelected };
  });

  return (
    <DialogFrame
      className={ROOT}
      title={msg().Admin_Lbl_SelectDepartment}
      hide={props.hideDialog}
      footer={
        <DialogFrame.Footer>
          <Button className={`${ROOT}__button`} onClick={props.hideDialog}>
            {msg().Com_Btn_Cancel}
          </Button>
          <Button
            className={`${ROOT}__button ${ROOT}__add-button`}
            disabled={!selectedId}
            onClick={setDepartment}
          >
            {msg().Com_Btn_Add}
          </Button>
        </DialogFrame.Footer>
      }
    >
      <div className={`${ROOT}__body ${ROOT}__list--search-result`}>
        {!props.isHideDateSearch && (
          <div className={`${ROOT}__target-date`}>
            <div className={`${ROOT}__target-date-label`}>
              {msg().Admin_Lbl_TargetDate}：
            </div>
            <div className={`${ROOT}__target-date-field`}>
              <DateField onChange={setTargetDate} value={targetDate} />
            </div>
          </div>
        )}

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
        {isOverLimit && (
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

export default DepartmentSearchDialog;
