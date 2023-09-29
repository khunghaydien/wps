import * as React from 'react';

import get from 'lodash/get';

import msg from '../../../commons/languages';

import { bankAccountType, Vendor } from '../../../domain/models/exp/Vendor';

import { State as SearchCondition } from '../../modules/vendor/ui/searchCondition';

import ListSearchForm, {
  Props as ListSearchFormProps,
} from '../../components/ListSearchForm';
import ListPagingLayout, {
  Props as $ListPagingLayoutProps,
} from '../../components/MainContents/ListPagingLayout';
import ListPaneHeader from '../../components/MainContents/ListPaneHeader';

import './List.scss';

const ROOT = 'admin-pc-vendor-list';

type ListPagingLayoutProps = $ListPagingLayoutProps<Vendor>;

const getDisplayLabel = (target: string, key?: string) => {
  const msgKey = get(
    bankAccountType.find(({ value }) => value === key),
    'label',
    ''
  );
  return msg()[msgKey];
};

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
  records: Vendor[];
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
    {
      key: 'active',
      label: msg().Admin_Lbl_Active,
      value: '',
      disabledSort: false,
    },
    {
      key: 'bankAccountType',
      label: msg().Exp_Lbl_BankAccountType,
      value: '',
      disabledSort: false,
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
              .filter((x) => !['active', 'bankAccountType'].includes(x.key)) // eslint-disable-next-line no-unused-vars
              .map(({ disabledSort, ...field }) => field)} // eslint-disable-line @typescript-eslint/no-unused-vars
            onChange={onChangeSearchValue}
            onSubmit={onSubmitSearchValue}
          />
        )} // eslint-disable-next-line no-unused-vars
        fields={fields.map(({ value, ...field }) => field)} // eslint-disable-line @typescript-eslint/no-unused-vars
        // @ts-ignore
        records={records}
        renderField={(
          value: Vendor[keyof Vendor],
          key: string,
          record: Vendor
        ) => {
          switch (key) {
            case 'active':
              return record.active ? msg().Admin_Lbl_Active : '';
            case 'bankAccountType':
              return (
                <>{getDisplayLabel('recordType', record.bankAccountType)}</>
              );

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
