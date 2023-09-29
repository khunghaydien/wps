import * as React from 'react';

import classNames from 'classnames';

// FIXME: Don't use this component in PC. This is for mobile only.
import IconButton from '../../../commons/components/buttons/IconButton';
import PagerInfo from '../../../commons/components/PagerInfo';
import Pagenation from '../../../commons/components/Pagination';
import Tooltip from '../../../commons/components/Tooltip';
import InfoIcon from '../../../commons/images/icons/info.svg';
import refreshIcon from '../../../commons/images/icons/refresh.svg';
import msg from '../../../commons/languages';

import RecordTable from '../RecordTable';
import { SortOrder } from '../RecordTable/Header';

import './ListPagingLayout.scss';

const ROOT = 'admin-pc-main-contents-list-paging-layout';

const MAX_LIMIT = 10000;

export type Props<
  Record extends {
    [key: string]: any;
  }
> = Readonly<{
  className?: string;
  fields: {
    key: string;
    label: string;
    width?: string;
    disabledSort?: boolean;
  }[];
  records: Record[];
  sort: {
    field: string;
    order: SortOrder;
  };
  selectedRowIndex?: number;
  currentPage: number;
  totalNum: number;
  pageSize: number;
  limit: number;
  isOverLimit?: boolean;
  hiddenRefresh?: boolean;
  hiddenMaxLimitInfo?: boolean;
  maxLimit?: number;
  emptyMessage?: string;
  renderForm: () => React.ReactNode;
  renderField?: (
    arg0: Record[keyof Record],
    arg1: string,
    arg2: Record
  ) => React.ReactNode | Record[keyof Record];
  onClickListRow: (arg0: Record, arg1: number) => void;
  onClickListHeaderCell: (arg0: string) => void;
  onClickPagerLink: (arg0: number) => void;
  onClickRefreshButton: () => void;
}>;

const ListPagingLayout = <
  Record extends {
    [key: string]: any;
  }
>({
  className,
  fields,
  records,
  sort,
  currentPage,
  totalNum,
  pageSize,
  limit,
  isOverLimit,
  hiddenRefresh = false,
  hiddenMaxLimitInfo = false,
  maxLimit = MAX_LIMIT,
  selectedRowIndex,
  emptyMessage,
  renderForm,
  renderField,
  onClickListHeaderCell,
  onClickListRow,
  onClickPagerLink,
  onClickRefreshButton,
}: Props<Record>) => (
  <div className={classNames(ROOT, className)}>
    <div className={`${ROOT}__header`}>
      <div className={`${ROOT}__list-search-form`}>{renderForm()}</div>
      <div className={`${ROOT}__paginator`}>
        <div className={`${ROOT}__page-info`}>
          <PagerInfo
            currentPage={currentPage}
            totalNum={totalNum}
            pageSize={pageSize}
            isOverLimit={isOverLimit}
          />
          {!hiddenRefresh && (
            <div className={`${ROOT}__refresh-btn`}>
              <IconButton
                src={refreshIcon}
                onClick={onClickRefreshButton}
                srcType="svg"
                alt="refresh"
              />
            </div>
          )}
          {!hiddenMaxLimitInfo && totalNum > maxLimit && (
            <div className={`${ROOT}__msg-icon`}>
              <Tooltip align="top" content={msg().Cmn_Msg_DisplayLimit}>
                <InfoIcon />
              </Tooltip>
            </div>
          )}
        </div>
        {records.length !== 0 && pageSize < totalNum && (
          <Pagenation
            currentPage={currentPage}
            totalNum={totalNum}
            displayNum={5}
            pageSize={pageSize}
            onClickPagerLink={(num) => onClickPagerLink(num)}
            maxPageNum={Math.ceil(limit / pageSize)}
            havePagerInfo={false}
          />
        )}
      </div>
    </div>
    <div className={`${ROOT}__body`}>
      <RecordTable
        className={`${ROOT}__table`}
        fields={fields}
        records={records}
        sort={sort}
        emptyMessage={emptyMessage}
        selectedRowIndex={selectedRowIndex}
        renderField={renderField}
        onClickHeaderCell={onClickListHeaderCell}
        onClickRow={onClickListRow}
      />
    </div>
  </div>
);

export default ListPagingLayout;
