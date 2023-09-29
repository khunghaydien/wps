import * as React from 'react';

import get from 'lodash/get';

import msg from '../../../commons/languages';

import { Job } from '../../../domain/models/organization/Job';

import { State as SearchCondition } from '../../modules/job/ui/searchCondition';

import ListSearchForm, {
  Props as ListSearchFormProps,
} from '../../components/ListSearchForm';
import ListPagingLayout, {
  Props as $ListPagingLayoutProps,
} from '../../components/MainContents/ListPagingLayout';
import ListPaneHeader from '../../components/MainContents/ListPaneHeader';

import './List.scss';

const ROOT = 'admin-pc-job-list';

type ListPagingLayoutProps = $ListPagingLayoutProps<Job>;

const Header = ({
  title,
  onClickCreateNewButton,
}: {
  title: string;
  // TODO: It will be supported by WPB-2652.
  // targetDate: string;
  // onChangeTargetDate: (arg0: string) => void;
  onClickCreateNewButton: () => void;
}) => (
  <ListPaneHeader
    title={title}
    // TODO: It will be supported by WPB-2652.
    // historyArea={
    //   <div className={`${ROOT}__header-area__history`}>
    //     <div className={`${ROOT}__header-area__history-label`}>
    //       {msg().Admin_Lbl_TargetDate}：
    //     </div>
    //     <div className={`${ROOT}__header-area__history-date_field`}>
    //       <DateField onChange={onChangeTargetDate} value={targetDate} />
    //     </div>
    //   </div>
    // }
    onClickCreateNewButton={onClickCreateNewButton}
  />
);

type Props = Readonly<{
  title: string;
  records: Job[];
  totalNum: number;
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
  searchCondition,
  sortCondition,
  currentPage,
  limitPerPage,
  limit,
  isOverLimit,
  totalNum,
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
      label: msg().Admin_Lbl_Code,
      value: searchCondition.code,
      disabledSort: false,
    },
    {
      key: 'name',
      label: msg().Admin_Lbl_Name,
      value: searchCondition.name,
      disabledSort: false,
    },
    /** WPB-2258
     * Disable job type for epic/WPB-1550
    {
      key: 'jobType',
      label: msg().Admin_Lbl_JobType,
      value: searchCondition.jobType,
      disabledSort: false,
    },
     **/
    {
      key: 'departmentName',
      label: msg().Admin_Lbl_Department,
      value: searchCondition.departmentName,
      disabledSort: false,
    },
    {
      key: 'parentJobName',
      label: msg().Admin_Lbl_ParentJob,
      value: searchCondition.parentJobName,
      disabledSort: false,
    },
  ];

  return (
    <div className={ROOT}>
      <Header
        title={title}
        // TODO: It will be supported by WPB-2652.
        // targetDate={searchCondition.targetDate}
        // onChangeTargetDate={(value: string) =>
        //   onChangeSearchValue('targetDate', value)
        // }
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
        renderField={(value: Job[keyof Job], key: string, record: Job) => {
          switch (key) {
            case 'departmentName':
              return record.department.name;
            case 'jobType':
              return get(record, 'jobType.name', '');
            case 'parentJobName':
              return record.parent.name;
            default:
              return value;
          }
        }}
        sort={sortCondition}
        currentPage={currentPage}
        pageSize={limitPerPage}
        limit={limit}
        totalNum={totalNum}
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
