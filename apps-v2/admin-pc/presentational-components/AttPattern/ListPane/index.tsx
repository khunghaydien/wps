import React from 'react';

import styled from 'styled-components';

import DateField from '@apps/commons/components/fields/DateField';
import msg from '@apps/commons/languages';

import { WorkSystemType } from '@attendance/domain/models/WorkingType';

import {
  Condition as SearchCondition,
  WORK_SYSTEM_TYPE,
} from '../../../modules/pattern/ui/searchCondition';

import ListSearchForm, {
  FIELD_TYPE,
  Props as ListSearchFormProps,
} from '../../../components/ListSearchFormWithType';
import $ListPagingLayout, {
  Props as $ListPagingLayoutProps,
} from '../../../components/MainContents/ListPagingLayout';
import ListPaneHeader from '../../../components/MainContents/ListPaneHeader';

const HistoryArea = styled.div`
  display: inline-block;
  margin-left: 20px;
  > div {
    display: inline-block;
  }
`;

const Header = ({
  title,
  targetDate,
  onChangeTargetDate,
  onClickCreateNewButton,
}: {
  title: string;
  targetDate: string;
  onChangeTargetDate: (arg0: string) => void;
  onClickCreateNewButton: () => void;
}) => (
  <ListPaneHeader
    title={title}
    historyArea={
      <HistoryArea>
        <div>{msg().Admin_Lbl_TargetDate}：</div>
        <div>
          <DateField onChange={onChangeTargetDate} value={targetDate} />
        </div>
      </HistoryArea>
    }
    onClickCreateNewButton={onClickCreateNewButton}
  />
);

export type Pattern = {
  code: string;
  name: string;
  workSystem: WorkSystemType;
};

type ListPagingLayoutProps = $ListPagingLayoutProps<Pattern>;

type Props = {
  title: string;
  searchCondition: SearchCondition;
  patterns: [];
  selectedRowIndex: number;
  sortCondition: ListPagingLayoutProps['sort'];
  pageCondition: {
    currentPage: number;
    limitPerPage: number;
    limit: number;
    total: number;
    isOverLimit: boolean;
  };
  onChangeSearchValue: ListSearchFormProps['onChange'];
  onClickSearchButton: ListSearchFormProps['onSubmit'];
  onClickPagerLink: ListPagingLayoutProps['onClickPagerLink'];
  onClickListHeaderCell: ListPagingLayoutProps['onClickListHeaderCell'];
  onClickCreateNewButton: () => void;
  onClickListRow: (
    arg0: {
      [key: string]: any;
    },
    arg1: number
  ) => void;
};

const ListPaneWrapper = styled.div`
  display: inline-block;
  width: 100%;
  height: 100%;
  background-color: $color-bg-pane-second;
  text-align: left;
`;
const ListPagingLayout = styled($ListPagingLayout)`
  height: calc(100% - 83px);
`;

const ListPane: React.FC<Props> = ({
  title,
  selectedRowIndex,
  patterns,
  searchCondition,
  sortCondition,
  pageCondition,
  onClickCreateNewButton,
  onChangeSearchValue,
  onClickSearchButton,
  onClickPagerLink,
  onClickListRow,
  onClickListHeaderCell,
}) => {
  const workSystemLabelMap = React.useMemo(
    () => ({
      [WORK_SYSTEM_TYPE.JP_Fix]: msg().Admin_Lbl_JP_Fix,
      [WORK_SYSTEM_TYPE.JP_Flex]: msg().Admin_Lbl_JP_Flex,
      [WORK_SYSTEM_TYPE.JP_Modified]: msg().Admin_Lbl_JP_Modified,
      [WORK_SYSTEM_TYPE.JP_Discretion]: msg().Admin_Lbl_JP_Discretion,
      [WORK_SYSTEM_TYPE.JP_Manager]: msg().Admin_Lbl_JP_Manager,
    }),
    []
  );
  const workSystem = React.useMemo(
    () => [
      {
        label: null,
        value: null,
      },
      {
        label: msg().Admin_Lbl_JP_Fix,
        value: WORK_SYSTEM_TYPE.JP_Fix,
      },
      {
        label: msg().Admin_Lbl_JP_Flex,
        value: WORK_SYSTEM_TYPE.JP_Flex,
      },
      {
        label: msg().Admin_Lbl_JP_FlexWithoutCoreTime,
        value: WORK_SYSTEM_TYPE.JP_Flex_Without_Core,
      },
      {
        label: msg().Admin_Lbl_JP_Modified,
        value: WORK_SYSTEM_TYPE.JP_Modified,
      },
      {
        label: msg().Admin_Lbl_JP_Discretion,
        value: WORK_SYSTEM_TYPE.JP_Discretion,
      },
      {
        label: msg().Admin_Lbl_JP_Manager,
        value: WORK_SYSTEM_TYPE.JP_Manager,
      },
    ],
    []
  );

  const fields = [
    {
      key: 'code',
      label: msg().Admin_Lbl_Code,
      value: searchCondition.code,
      disabledSort: false,
      fieldType: FIELD_TYPE.TEXT,
    },
    {
      key: 'name',
      label: msg().Admin_Lbl_Name,
      value: searchCondition.name,
      disabledSort: true,
      fieldType: FIELD_TYPE.TEXT,
    },
    {
      key: 'workSystem',
      label: msg().Admin_Lbl_WorkingTypeWorkSystem,
      value: searchCondition.workSystem,
      disabledSort: true,
      fieldType: FIELD_TYPE.DROPDOWN,
      options: workSystem,
    },
  ];

  return (
    <ListPaneWrapper>
      <Header
        title={title}
        targetDate={searchCondition.targetDate}
        onChangeTargetDate={(value: string) =>
          onChangeSearchValue('targetDate', value)
        }
        onClickCreateNewButton={onClickCreateNewButton}
      />
      <ListPagingLayout
        hiddenRefresh={true}
        maxLimit={pageCondition.limit}
        renderForm={() => (
          <ListSearchForm
            fields={fields.map(
              ({ disabledSort: _disabledSort, ...field }) => field
            )}
            onChange={onChangeSearchValue}
            onSubmit={onClickSearchButton}
          />
        )}
        fields={fields.map(
          ({ value: _value, fieldType: _fieldType, ...field }) => field
        )}
        records={patterns}
        renderField={(value, key, record) => {
          switch (key) {
            case 'workSystem': {
              let showValue = workSystemLabelMap[record.workSystem];
              if (record.withoutCoreTime === true) {
                showValue = msg().Admin_Lbl_JP_FlexWithoutCoreTime;
              }
              return showValue;
            }
            default:
              return value;
          }
        }}
        sort={sortCondition}
        currentPage={pageCondition.currentPage}
        pageSize={pageCondition.limitPerPage}
        limit={pageCondition.limit}
        totalNum={pageCondition.total}
        isOverLimit={pageCondition.isOverLimit}
        emptyMessage={msg().Com_Msg_NotFound}
        selectedRowIndex={selectedRowIndex}
        onClickListRow={onClickListRow}
        onClickRefreshButton={() => {}}
        onClickListHeaderCell={onClickListHeaderCell}
        onClickPagerLink={onClickPagerLink}
      />
    </ListPaneWrapper>
  );
};

export default ListPane;
