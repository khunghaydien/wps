import * as React from 'react';

import get from 'lodash/get';

import fieldValues from '../../constants/fieldValues/expenseType';

import msg from '../../../commons/languages';

import { ExpenseType } from '../../../domain/models/exp/ExpenseType';

import { State as SearchCondition } from '../../modules/expense-type/ui/searchCondition';

import ListSearchForm, {
  Props as ListSearchFormProps,
} from '../../components/ListSearchForm';
import ListPagingLayout, {
  Props as $ListPagingLayoutProps,
} from '../../components/MainContents/ListPagingLayout';
import ListPaneHeader from '../../components/MainContents/ListPaneHeader';

import './List.scss';

const ROOT = 'admin-pc-expense-type-list';

type ListPagingLayoutProps = $ListPagingLayoutProps<ExpenseType>;

const getDisplayLabel = (target: string, key?: string) => {
  const { foreignCurrencyUsage, recordType, fileAttachment } = fieldValues;
  let arr = [];
  switch (target) {
    case 'foreignCurrencyUsage':
      arr = foreignCurrencyUsage;
      break;
    case 'recordType':
      arr = recordType;
      break;
    case 'fileAttachment':
      arr = fileAttachment;
      break;
    default:
      break;
  }
  const msgKey = get(
    arr.find(({ value }) => value === key),
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
  records: ExpenseType[];
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
      key: 'parentExpenseTypeGroupName',
      label: msg().Admin_Lbl_ParentExpTypeGroup,
      value: searchCondition.parentExpenseTypeGroupName,
      disabledSort: false,
    },
    {
      key: 'order',
      label: msg().Admin_Lbl_Order,
      value: '',
      disabledSort: false,
    },
    {
      key: 'recordType',
      label: msg().Exp_Lbl_RecordType,
      value: searchCondition.recordType,
      disabledSort: true,
    },
    {
      key: 'foreignCurrencyUsage',
      label: msg().Admin_Lbl_UseForeignCurrency,
      value: searchCondition.foreignCurrencyUsage,
      disabledSort: true,
    },
    {
      key: 'receiptSetting',
      label: msg().Exp_Lbl_ReceiptSetting,
      value: searchCondition.receiptSetting,
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
              .filter((x) => !['order'].includes(x.key)) // eslint-disable-next-line no-unused-vars
              .map(({ disabledSort, ...field }) => field)} // eslint-disable-line @typescript-eslint/no-unused-vars
            onChange={onChangeSearchValue}
            onSubmit={onSubmitSearchValue}
          />
        )} // eslint-disable-next-line no-unused-vars
        fields={fields}
        // @ts-ignore
        records={records} // renderField={(value: $Values<ExpenseType>) => value}
        renderField={(
          value: ExpenseType[keyof ExpenseType],
          key: string,
          record: ExpenseType
        ) => {
          switch (key) {
            case 'parentExpenseTypeGroupName':
              return <>{record.parentGroup.name}</>;
            case 'foreignCurrencyUsage':
              return (
                <>
                  {getDisplayLabel(
                    'foreignCurrencyUsage',
                    record.foreignCurrencyUsage
                  )}
                </>
              );
            case 'recordType':
              return <>{getDisplayLabel('recordType', record.recordType)}</>;
            case 'receiptSetting':
              return (
                <>{getDisplayLabel('fileAttachment', record.fileAttachment)}</>
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
