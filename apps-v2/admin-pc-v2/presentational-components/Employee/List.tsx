import * as React from 'react';

import DateField from '@apps/commons/components/fields/DateField';
import msg from '@apps/commons/languages';

import { EmployeeV2 as Employee } from '@apps/repositories/organization/employee/EmployeeListRepository';

import { State as SearchCondition } from '@admin-pc-v2/modules/employee/ui/searchCondition';

import ListSearchForm, {
  Props as ListSearchFormProps,
} from '@admin-pc/components/ListSearchForm';
import ListPagingLayout, {
  Props as $ListPagingLayoutProps,
} from '@admin-pc/components/MainContents/ListPagingLayout';
import ListPaneHeader from '@admin-pc/components/MainContents/ListPaneHeader';

import './List.scss';

const ROOT = 'admin-pc-employee-list';

type ListPagingLayoutProps = $ListPagingLayoutProps<Employee>;

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
  records: Employee[];
  ids: string[];
  searchCondition: SearchCondition;
  sortCondition: ListPagingLayoutProps['sort'];
  currentPage: number;
  limitPerPage: number;
  limit: number;
  isOverLimit: boolean;
  selectedRowIndex: number;
  isOverallSetting?: boolean;
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
  isOverallSetting,
  onClickCreateNewButton,
  onChangeSearchValue,
  onSubmitSearchValue,
  onClickListRow,
  onClickRefreshButton,
  onClickListHeaderCell,
  onClickPagerLink,
}: Props) => {
  // TODO conditional rendering company search in overall setting
  let fields = [
    {
      key: 'code',
      label: msg().Com_Lbl_EmployeeCode,
      value: searchCondition.code,
      disabledSort: false,
    },
    {
      key: 'name',
      label: msg().Com_Lbl_EmployeeName,
      value: searchCondition.name,
      disabledSort: false,
    },
    {
      key: 'departmentName',
      label: msg().Admin_Lbl_DepartmentName,
      value: searchCondition.departmentName,
      disabledSort: true,
    },
    {
      key: 'positionName',
      label: msg().Admin_Lbl_Position,
      value: searchCondition.positionName,
      disabledSort: true,
    },
  ];

  if (isOverallSetting) {
    const companyField = {
      key: 'companyName',
      label: msg().Com_Lbl_Company,
      value: searchCondition.companyName,
      disabledSort: true,
    };

    fields = [companyField, ...fields];
  }

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
          <>
            <ListSearchForm
              fields={fields.map(({ disabledSort: _arg1, ...field }) => field)}
              onChange={onChangeSearchValue}
              onSubmit={onSubmitSearchValue}
            />
            <div className={`${ROOT}__search-display-inactive`}>
              <input
                type="checkbox"
                onChange={(event: React.SyntheticEvent<HTMLInputElement>) =>
                  onChangeSearchValue(
                    'includeInactiveEmployee',
                    event.currentTarget.checked
                  )
                }
                checked={searchCondition.includeInactiveEmployee}
              />
              <span className={`${ROOT}__search-display-inactive-msg`}>
                {msg().Admin_Msg_DisplayInactiveEmp}
              </span>
            </div>
          </>
        )}
        fields={fields.map(({ value: _arg1, ...field }) => field)}
        records={records}
        renderField={(value: Employee[keyof Employee]) => value}
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
