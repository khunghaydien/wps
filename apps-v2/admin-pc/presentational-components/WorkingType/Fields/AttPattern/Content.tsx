import React, { useMemo } from 'react';

import nanoid from 'nanoid';

import styled from 'styled-components';

import RadioGroupField from '@commons/components/fields/RadioGroupField';
import msg from '@commons/languages';
import DateUtil from '@commons/utils/DateUtil';

import { Condition as SearchCondition } from '../../../../modules/pattern/ui/searchCondition';
import { Pattern } from '../../../../modules/workingType/ui/pattern/selectedPattern';
import {
  OPTION_VALUE,
  OptionValue,
} from '../../../../modules/workingType/ui/pattern/tab';

import ListSearchForm, {
  FIELD_TYPE,
  Props as ListSearchFormProps,
} from '../../../../components/ListSearchFormWithType';
import $ListPagingLayout, {
  Props as $ListPagingLayoutProps,
} from '../../../../components/MainContents/ListPagingLayout';
import $RecordTable from '../../../../components/RecordTable';

type ListPagingLayoutProps = $ListPagingLayoutProps<Pattern>;

type Props = {
  selectedTab: OptionValue;
  searchCondition: SearchCondition;
  patterns: {
    [key: string]: any;
  }[];
  sortCondition: ListPagingLayoutProps['sort'];
  selectedSortOrder: ListPagingLayoutProps['sort'];
  pageCondition: {
    currentPage: number;
    limitPerPage: number;
    limit: number;
    total: number;
    isOverLimit: boolean;
  };
  selectedPatterns: {
    [key: string]: any;
  }[];
  setTab: (value: OptionValue) => void;
  onChangeSearchValue: ListSearchFormProps['onChange'];
  onClickSearchButton: ListSearchFormProps['onSubmit'];
  onClickPagerLink: ListPagingLayoutProps['onClickPagerLink'];
  onClickListHeaderCell: ListPagingLayoutProps['onClickListHeaderCell'];
  sortSelectedTable: () => void;
  onClickRow: (
    arg0: {
      [key: string]: any;
    },
    arg1: number
  ) => void;
};

const ContentsWrapper = styled.div`
  width: 100%;
  height: 70vh;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: 20px 30px;
`;

const ListPagingLayout = styled($ListPagingLayout)`
  height: calc(70vh - 80px);

  .admin-pc-main-contents-list-paging-layout__header {
    background-color: #fff;

    .admin-pc-main-contents-list-paging-layout__list-search-form {
      padding: 0 100px 10px 0;
    }
    .admin-pc-main-contents-list-paging-layout__paginator {
      padding: 10px 0;
    }
  }
  .admin-pc-main-contents-list-paging-layout__body {
    border-left: 1px solid #ddd;
    border-right: 1px solid #ddd;
    border-bottom: 1px solid #ddd;
  }
  .admin-pc-record-table-cell:first-child {
    width: 110px;
  }
  .admin-pc-record-table-cell:nth-child(2) {
    width: 370px;
  }
  .admin-pc-record-table-cell:nth-child(4) {
    width: 270px;
  }
  .admin-pc-record-table-cell:last-child {
    width: 270px;
  }
`;

const RecordTable = styled($RecordTable)`
  height: calc(70vh - 80px);
  border-left: 1px solid #ddd;
  border-right: 1px solid #ddd;
  border-bottom: 1px solid #ddd;
  .admin-pc-record-table-cell:first-child {
    width: 110px;
  }
  .admin-pc-record-table-cell:nth-child(2) {
    width: 370px;
  }
  .admin-pc-record-table-cell:nth-child(4) {
    width: 270px;
  }
  .admin-pc-record-table-cell:last-child {
    width: 270px;
  }
`;

const Content: React.FC<Props> = ({
  selectedTab,
  searchCondition,
  patterns,
  sortCondition,
  pageCondition,
  selectedPatterns,
  setTab,
  sortSelectedTable,
  selectedSortOrder,
  onChangeSearchValue,
  onClickSearchButton,
  onClickPagerLink,
  onClickListHeaderCell,
  onClickRow,
}) => {
  const radioValue = useMemo(() => selectedTab, [selectedTab]);
  const options = useMemo(
    () => [
      {
        text: msg().Com_Sel_All,
        value: OPTION_VALUE.ALL,
      },
      {
        text: `${msg().Com_Lbl_Chosen}(${selectedPatterns.length})`,
        value: OPTION_VALUE.CHOSEN,
      },
    ],
    [selectedPatterns.length]
  );
  const searchFields = [
    {
      key: 'targetDate',
      label: msg().Admin_Lbl_TargetDate,
      value: searchCondition.targetDate,
      fieldType: FIELD_TYPE.DATE,
    },
    {
      key: 'code',
      label: msg().Admin_Lbl_Code,
      value: searchCondition.code,
      fieldType: FIELD_TYPE.TEXT,
    },
    {
      key: 'name',
      label: msg().Admin_Lbl_Name,
      value: searchCondition.name,
      fieldType: FIELD_TYPE.TEXT,
    },
  ];
  const fields = useMemo(
    () => [
      {
        key: 'checkbox',
        label: '',
        disabledSort: true,
      },
      {
        key: 'code',
        label: msg().Admin_Lbl_Code,
        disabledSort: false,
      },
      {
        key: 'name',
        label: msg().Admin_Lbl_Name,
        disabledSort: true,
      },
      {
        key: 'validDateFrom',
        label: msg().Admin_Lbl_ValidDateFrom,
        disabledSort: true,
      },
      {
        key: 'validDateTo',
        label: msg().Admin_Lbl_ValidDateTo,
        disabledSort: true,
      },
    ],
    []
  );

  const allPatterns = useMemo(
    () =>
      patterns.map((pattern) => ({
        ...pattern,
        checkbox: selectedPatterns.some((item) => item.code === pattern.code),
      })),
    [patterns, selectedPatterns]
  );

  const records = useMemo(
    () =>
      selectedPatterns.map((pattern) => ({
        ...pattern,
        checkbox: true,
      })),
    [selectedPatterns]
  );

  const renderField = (value, key, _record) => {
    if (key === 'checkbox') {
      return <input type="checkbox" checked={value} onChange={() => {}} />;
    }
    if (key === 'validDateFrom' || key === 'validDateTo') {
      return DateUtil.formatYMD(value);
    }
    return value;
  };

  return (
    <ContentsWrapper>
      <RadioGroupField
        disabled={false}
        key={`${nanoid(8)}`}
        options={options}
        value={radioValue}
        onChange={setTab}
      />
      {radioValue === OPTION_VALUE.ALL && (
        <ListPagingLayout
          hiddenRefresh={true}
          maxLimit={pageCondition.limit}
          renderForm={() => (
            <ListSearchForm
              fields={searchFields}
              onChange={onChangeSearchValue}
              onSubmit={onClickSearchButton}
            />
          )}
          fields={fields}
          records={allPatterns}
          renderField={renderField}
          sort={sortCondition}
          currentPage={pageCondition.currentPage}
          pageSize={pageCondition.limitPerPage}
          limit={pageCondition.limit}
          totalNum={pageCondition.total}
          isOverLimit={pageCondition.isOverLimit}
          emptyMessage={msg().Com_Msg_NotFound}
          onClickListRow={onClickRow}
          onClickRefreshButton={() => {}}
          onClickListHeaderCell={onClickListHeaderCell}
          onClickPagerLink={onClickPagerLink}
        />
      )}
      {radioValue === OPTION_VALUE.CHOSEN && (
        <RecordTable
          fields={fields}
          records={records}
          sort={selectedSortOrder}
          renderField={renderField}
          emptyMessage={msg().Com_Msg_NotFound}
          onClickHeaderCell={sortSelectedTable}
          onClickRow={onClickRow}
        />
      )}
    </ContentsWrapper>
  );
};

export default Content;
