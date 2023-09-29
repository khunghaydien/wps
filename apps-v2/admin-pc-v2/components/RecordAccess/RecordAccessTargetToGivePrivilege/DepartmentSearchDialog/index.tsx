import React, { useState } from 'react';

import { Department } from '@apps/repositories/organization/department/DepartmentListRepository';

import DataGrid from '@admin-pc/components/DataGrid';
import SearchArea from '@admin-pc/components/SearchArea';
import DialogFrame from '@apps/commons/components/dialogs/DialogFrame';
import Button from '@apps/commons/components/buttons/Button';
import DateField from '@apps/commons/components/fields/DateField';
import TextUtil from '@apps/commons/utils/TextUtil';

import msg from '@commons/languages';

import './index.scss';

const ROOT = 'admin-pc-v2-department-search-dialog';

export type SearchProps = {
  maxNum: number;
  addSelectedDepartments: (departments: Array<Department>) => void;
  targetDate: string;
  isHideDateSearch?: boolean;
  search: (code: string, name: string, targetDate: string) => any;
};

type Props = SearchProps & {
  hideDialog: () => void;
};

const DepartmentSearchDialog = (props: Props) => {
  const [selectedIds, setSelectedIds] = useState<Array<any>>([]);
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
    const selectedRowId = row.id;
    const index = selectedIds.indexOf(selectedRowId);
    if (index > -1) {
      const clone = [...selectedIds];
      clone.splice(index, 1);
      setSelectedIds(clone);
    } else setSelectedIds([...selectedIds, selectedRowId]);
  };

  const handleRowsToggle = (rows: Array<{ row: Department }>) => {
    handleRowClick(0, rows[0].row);
  };

  const addSelectedDepartments = () => {
    const departments =
      departmentList.filter(({ id }) => selectedIds.includes(id)) || [];
    props.addSelectedDepartments(departments);
  };

  const rows = departmentList.map((row) => {
    const isSelected = selectedIds.includes(row.id);
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
            disabled={selectedIds.length === 0}
            onClick={addSelectedDepartments}
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
