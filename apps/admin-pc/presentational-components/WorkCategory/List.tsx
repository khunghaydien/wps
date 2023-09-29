import * as React from 'react';

import msg from '../../../commons/languages';

import { WorkCategory } from '../../../domain/models/time-tracking/WorkCategory';

import { State as SearchCondition } from '../../modules/work-category/ui/searchCondition';

import ListSearchForm, {
  Props as ListSearchFormProps,
} from '../../components/ListSearchForm';
import ListPagingLayout, {
  Props as $ListPagingLayoutProps,
} from '../../components/MainContents/ListPagingLayout';
import ListPaneHeader from '../../components/MainContents/ListPaneHeader';

import './List.scss';

const ROOT = 'admin-pc-work-category-list';

type ListPagingLayoutProps = $ListPagingLayoutProps<WorkCategory>;

const Header = ({
  title,
  onClickCreateNewButton,
}: {
  title: string;
  onClickCreateNewButton: () => void;
}) => (
  <ListPaneHeader
    title={title}
    onClickCreateNewButton={onClickCreateNewButton}
  />
);

type Props = Readonly<{
  title: string;
  records: WorkCategory[];
  searchCondition: SearchCondition;
  sortCondition: ListPagingLayoutProps['sort'];
  currentPage: number;
  limitPerPage: number;
  limit: number;
  totalNum: number;
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
    {
      key: 'order',
      label: msg().Admin_Lbl_Order,
      value: '',
      disabledSort: true,
    },
  ];

  return (
    <div className={ROOT}>
      <Header title={title} onClickCreateNewButton={onClickCreateNewButton} />
      <ListPagingLayout
        className={`${ROOT}__list-paging-layout`}
        renderForm={() => (
          <ListSearchForm
            fields={fields
              .filter((x) => x.key !== 'order') // eslint-disable-next-line no-unused-vars
              .map(({ disabledSort, ...field }) => field)} // eslint-disable-line @typescript-eslint/no-unused-vars
            onChange={onChangeSearchValue}
            onSubmit={onSubmitSearchValue}
          />
        )} // eslint-disable-next-line no-unused-vars
        fields={fields}
        // @ts-ignore
        records={records}
        renderField={(value: WorkCategory[keyof WorkCategory]) => value}
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
