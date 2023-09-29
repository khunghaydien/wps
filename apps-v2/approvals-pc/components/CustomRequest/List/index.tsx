import React, { Dispatch, SetStateAction, useEffect, useState } from 'react';

import debounce from 'lodash/debounce';

import Grid from '@commons/components/Grid';
import DateFilter from '@commons/components/Grid/filters/DateFilter';
import DoubleTextFilter from '@commons/components/Grid/filters/DoubleTextFilter';
import TextFilter from '@commons/components/Grid/filters/TextFilter';
import DateYMD from '@commons/components/Grid/Formatters/DateYMD';
import Employee from '@commons/components/Grid/Formatters/Employee';
import msg from '@commons/languages';

import {
  CUSTOM_REQUEST_APPROVAL_COLUMNS,
  CUSTOM_REQUEST_RECORD_TYPE_NAME_KEY,
  CUSTOM_REQUEST_SUBMITTER_NAME_KEY as submitterNameKey,
} from '@apps/domain/models/customRequest/consts';
import { CustomRequests } from '@apps/domain/models/customRequest/types';

import buildRecordFilter from '@apps/approvals-pc/utils/FilterUtils';

import './index.scss';

const ROOT = 'approvals-pc-custom-request-list-pane-list';

type Props = {
  browseId: string;
  customRequestList: CustomRequests;
  clearRequestDetail: () => void;
  getCustomRequestDetail: (requestId: string, recordTypeId: string) => void;
  onClickRow: (reportId: string) => void;
};

const { departmentName, submitDate } = CUSTOM_REQUEST_APPROVAL_COLUMNS;
const FILTER_TERMS = {
  [submitterNameKey]: '',
  [departmentName]: '',
  [CUSTOM_REQUEST_RECORD_TYPE_NAME_KEY]: '',
  [submitDate]: '',
};

const filterRequestList = debounce(
  (
    newFilterTerms: typeof FILTER_TERMS,
    customRequestList: CustomRequests,
    setRequestList: Dispatch<SetStateAction<CustomRequests>>
  ) => {
    const filteredRequestList = customRequestList.filter(
      buildRecordFilter({})(newFilterTerms)
    );
    setRequestList(filteredRequestList);
  },
  500
);

const List = ({
  browseId,
  customRequestList,
  clearRequestDetail,
  getCustomRequestDetail,
  onClickRow,
}: Props) => {
  const [filterTerms, setFilterTerms] = useState(FILTER_TERMS);
  const [requestList, setRequestList] = useState<CustomRequests>([]);

  useEffect(() => {
    const filteredRequestList = customRequestList.filter(
      buildRecordFilter({})(filterTerms)
    );
    setRequestList(filteredRequestList);
    if (filteredRequestList.length > 0) {
      const { Id = '', RecordTypeId = '' } = filteredRequestList[0];
      getCustomRequestDetail(Id, RecordTypeId);
    } else {
      clearRequestDetail();
    }
  }, [customRequestList]);

  const onChangeFilterTerm =
    (key: keyof typeof FILTER_TERMS) => (value: string) => {
      const newFilterTerms = {
        ...filterTerms,
        [key]: value,
      };
      setFilterTerms(newFilterTerms);
      filterRequestList(newFilterTerms, customRequestList, setRequestList);
    };

  const columns = [
    {
      name: `${msg().Appr_Lbl_EmployeeName} / ${msg().Appr_Lbl_DepartmentName}`,
      key: [submitterNameKey, departmentName],
      extraProps: {
        keyMap: {
          employeeName: submitterNameKey,
          departmentName,
        },
      },
      shrink: true,
      grow: true,
      width: 350,
      formatter: Employee,
      renderFilter: () => (
        <DoubleTextFilter
          firstValue={filterTerms[submitterNameKey]}
          secondValue={filterTerms[departmentName]}
          onChangeFirstValue={onChangeFilterTerm(submitterNameKey)}
          onChangeSecondValue={onChangeFilterTerm(departmentName)}
        />
      ),
    },
    {
      name: msg().Appr_Lbl_RecordType,
      key: CUSTOM_REQUEST_RECORD_TYPE_NAME_KEY,
      width: 220,
      shrink: true,
      grow: false,
      renderFilter: () => (
        <TextFilter
          value={filterTerms[CUSTOM_REQUEST_RECORD_TYPE_NAME_KEY]}
          onChange={onChangeFilterTerm(CUSTOM_REQUEST_RECORD_TYPE_NAME_KEY)}
        />
      ),
    },
    {
      name: msg().Appr_Lbl_SubmittedDate,
      key: submitDate,
      width: 155,
      shrink: true,
      grow: false,
      formatter: DateYMD,
      renderFilter: () => (
        <DateFilter
          value={filterTerms[submitDate]}
          onChange={onChangeFilterTerm(submitDate)}
        />
      ),
    },
  ];

  return (
    <section className={ROOT}>
      <header className={`${ROOT}__header`}>
        <h1 className={`${ROOT}__header-body`}>
          {msg().Appr_Lbl_ApprovalList}
        </h1>
      </header>

      <div className={`${ROOT}__grid`}>
        <Grid
          browseId={browseId}
          columns={columns}
          data={requestList}
          emptyMessage={msg().Appr_Msg_EmptyRequestList}
          idKey="Id"
          onClickRow={onClickRow}
          onChangeRowSelection={() => {}}
          selected={[]}
          useFilter
        />
      </div>
    </section>
  );
};

export default List;
