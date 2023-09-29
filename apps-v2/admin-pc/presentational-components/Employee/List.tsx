import * as React from 'react';

import DateField from '../../../commons/components/fields/DateField';
import msg from '../../../commons/languages';

import { Employee } from '../../../repositories/organization/employee/EmployeeListRepository';

import { State as SearchCondition } from '../../modules/employee/ui/searchCondition';

import ListSearchForm, {
  Props as ListSearchFormProps,
} from '../../components/ListSearchForm';
import ListPagingLayout, {
  Props as $ListPagingLayoutProps,
} from '../../components/MainContents/ListPagingLayout';
import ListPaneHeader from '../../components/MainContents/ListPaneHeader';

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
      key: 'title',
      label: msg().Admin_Lbl_Position,
      value: searchCondition.title,
      disabledSort: true,
    },
    {
      key: 'managerName',
      label: msg().Admin_Lbl_ManagerName,
      value: searchCondition.managerName,
      disabledSort: true,
    },
    {
      key: 'workingTypeName',
      label: msg().Admin_Lbl_WorkingTypeName,
      value: searchCondition.workingTypeName,
      disabledSort: true,
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
          <ListSearchForm // eslint-disable-next-line no-unused-vars
            fields={fields.map(({ disabledSort, ...field }) => field)} // eslint-disable-line @typescript-eslint/no-unused-vars
            onChange={onChangeSearchValue}
            onSubmit={onSubmitSearchValue}
          />
        )} // eslint-disable-next-line no-unused-vars
        fields={fields.map(({ value, ...field }) => field)} // eslint-disable-line @typescript-eslint/no-unused-vars
        // @ts-ignore
        records={records}
        renderField={(
          value: Employee[keyof Employee],
          key: string,
          record: Employee
        ) => {
          switch (key) {
            case 'name':
              return (
                <div className={`${ROOT}__name`}>
                  <img
                    className={`${ROOT}__icon`}
                    src={record.photoUrl}
                    alt={record.name}
                  />
                  <div className={`${ROOT}__info`}>{record.name}</div>
                </div>
              );
            default:
              return value;
          }
        }}
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
