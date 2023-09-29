import * as React from 'react';

import DateField from '@apps/commons/components/fields/DateField';
import msg from '@apps/commons/languages';

import { Department } from '@apps/repositories/organization/department/DepartmentListRepository';

import { State as SearchCondition } from '@admin-pc-v2/modules/department/ui/searchCondition';

import ListSearchForm, {
  Props as ListSearchFormProps,
} from '@admin-pc/components/ListSearchForm';
import ListPagingLayout, {
  Props as $ListPagingLayoutProps,
} from '@admin-pc/components/MainContents/ListPagingLayout';
import ListPaneHeader from '@admin-pc/components/MainContents/ListPaneHeader';

import './List.scss';

const ROOT = 'admin-pc-department-list';

type ListPagingLayoutProps = $ListPagingLayoutProps<Department>;

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
      <div className={`${ROOT}__header-area__history`}>
        <div className={`${ROOT}__header-area__history-label`}>
          {msg().Admin_Lbl_TargetDate}：
        </div>
        <div className={`${ROOT}__header-area__history-date_field`}>
          <DateField onChange={onChangeTargetDate} value={targetDate} />
        </div>
      </div>
    }
    onClickCreateNewButton={onClickCreateNewButton}
  />
);

type Props = Readonly<{
  title: string;
  records: Department[];
  ids: string[];
  searchCondition: SearchCondition;
  sortCondition: ListPagingLayoutProps['sort'];
  currentPage: number;
  limitPerPage: number;
  limit: number;
  isOverLimit: boolean;
  selectedRowIndex: number;
  onClickCreateNewButton: () => void;
  onChangeSearchValue: ListSearchFormProps['onChange'];
  onSubmitSearchValue: ListSearchFormProps['onSubmit'];
  onClickListRow: ListPagingLayoutProps['onClickListRow'];
  onClickRefreshButton: ListPagingLayoutProps['onClickRefreshButton'];
  onClickListHeaderCell: ListPagingLayoutProps['onClickListHeaderCell'];
  onClickPagerLink: ListPagingLayoutProps['onClickPagerLink'];
}>;

const List = ({
  title,
  records,
  ids,
  searchCondition,
  sortCondition,
  currentPage,
  limitPerPage,
  limit,
  isOverLimit,
  selectedRowIndex,
  onClickCreateNewButton,
  onChangeSearchValue,
  onSubmitSearchValue,
  onClickListRow,
  onClickRefreshButton,
  onClickListHeaderCell,
  onClickPagerLink,
}: Props) => {
  const fields = [
    {
      key: 'code',
      label: msg().Com_Lbl_DepartmentCode,
      value: searchCondition.code,
      disabledSort: false,
    },
    {
      key: 'name',
      label: msg().Com_Lbl_DepartmentName,
      value: searchCondition.name,
      disabledSort: false,
    },
  ];

  return (
    <div className={ROOT}>
      <Header
        title={title}
        targetDate={searchCondition.targetDate}
        onChangeTargetDate={(value: string) =>
          onChangeSearchValue('targetDate', value)
        }
        onClickCreateNewButton={onClickCreateNewButton}
      />
      <ListPagingLayout
        className={`${ROOT}__list-paging-layout`}
        renderForm={() => (
          <ListSearchForm
            fields={fields.map(({ disabledSort: _arg1, ...field }) => field)}
            onChange={onChangeSearchValue}
            onSubmit={onSubmitSearchValue}
          />
        )}
        fields={fields.map(({ value: _arg1, ...field }) => field)}
        records={records}
        renderField={(value: Department[keyof Department]) => value}
        sort={sortCondition}
        currentPage={currentPage}
        pageSize={limitPerPage}
        limit={limit}
        totalNum={ids.length}
        isOverLimit={isOverLimit}
        emptyMessage={msg().Com_Msg_NotFound}
        selectedRowIndex={selectedRowIndex}
        onClickListRow={onClickListRow}
        onClickRefreshButton={onClickRefreshButton}
        onClickListHeaderCell={onClickListHeaderCell}
        onClickPagerLink={onClickPagerLink}
      />
    </div>
  );
};

export default List;
