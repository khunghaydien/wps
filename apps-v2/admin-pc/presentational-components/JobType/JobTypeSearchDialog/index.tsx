import React, { useState } from 'react';

import Button from '../../../../commons/components/buttons/Button';
import DialogFrame from '../../../../commons/components/dialogs/DialogFrame';
import msg from '../../../../commons/languages';
import TextUtil from '../../../../commons/utils/TextUtil';

import { JobType } from '../../../models/job-type/JobType';

import DataGrid from '../../../components/DataGrid';
import SearchArea from '../../../components/SearchArea';

import './index.scss';

const ROOT = 'admin-pc-job-type-search-dialog';

export type SearchProps = {
  maxNum: number;
  setJobType: (arg0: JobType) => void;
};

type Props = Readonly<
  SearchProps & {
    hideDialog: () => void;
    jobTypes: JobType[];
    search: (arg0: { code: string; name: string }) => any;
  }
>;

const JobTypeSearchDialog = (props: Props) => {
  const [selectedId, setSelectedId] = useState('');

  const onClickSearch = (query: { code: string; name: string }) => {
    const { code, name } = query;
    props.search({ code, name });
  };

  const handleRowClick = (rowIdx: number, row: JobType) => {
    const id = selectedId !== row.id ? row.id : '';
    setSelectedId(id);
  };

  const handleRowsToggle = (rows: Array<{ row: JobType }>) => {
    handleRowClick(0, rows[0].row);
  };

  const setJobType = () => {
    const jobType = props.jobTypes.find(({ id }) => id === selectedId) || {};
    // @ts-ignore
    props.setJobType(jobType);
  };

  let rows = props.jobTypes.map((row) => {
    const isSelected = row.id === selectedId;
    return { ...row, isSelected };
  });

  rows = rows.slice(0, props.maxNum);

  const isExceeded = props.jobTypes.length > props.maxNum;

  return (
    <DialogFrame
      className={ROOT}
      title={msg().Admin_Lbl_SelectJobType}
      hide={props.hideDialog}
      footer={
        <DialogFrame.Footer>
          <Button className={`${ROOT}__button`} onClick={props.hideDialog}>
            {msg().Com_Btn_Cancel}
          </Button>
          <Button
            className={`${ROOT}__button ${ROOT}__add-button`}
            disabled={!selectedId}
            onClick={setJobType}
          >
            {msg().Com_Btn_Add}
          </Button>
        </DialogFrame.Footer>
      }
    >
      <div className={`${ROOT}__body ${ROOT}__list--search-result`}>
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

export default JobTypeSearchDialog;
