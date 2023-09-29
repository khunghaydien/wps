import React from 'react';

import IconButton from '../../../../commons/components/buttons/IconButton';
import PagerInfo, {
  Props as PagerInfoProps,
} from '../../../../commons/components/PagerInfo';
import Pagenation, {
  Props as PagerProps,
} from '../../../../commons/components/Pagination';
import refreshIcon from '../../../../commons/images/icons/refresh.svg';
import HeaderActions from '@commons/components/BulkApproval/HeaderActions';
import msg from '@commons/languages';

import { RequestItem } from '../../../../domain/models/exp/FinanceApproval';
import { BulkError } from '@apps/domain/models/approval/request/Request';

import {
  MAX_PAGE_NUM,
  MAX_SEARCH_RESULT_NUM,
  PAGE_SIZE,
} from '../../../modules/ui/FinanceApproval/RequestList/page';

import ListHeader, { Props as ListHeaderProps } from './Header';
import ListItem from './Item';

import './index.scss';

const ROOT = 'ts-finance-approval__requests';
const icon = refreshIcon;

export type CommonProps = Readonly<{
  baseCurrencyDecimal: string;
  baseCurrencySymbol: string;
  onClickRequestItem: (requestId: string) => void;
}>;

export type Item = RequestItem & { error?: BulkError };

type Props = (CommonProps & {
  isRequestTab: boolean;
  requestList: Array<Item>;
  requestTotalNum: number;
  selectedIds?: Array<string>;
  onChangeRowSelection?: (arg0: { id: string; checked: boolean }) => void;
  onClickBulkApproval?: () => void;
  onClickBulkReject?: () => void;
  onClickRefreshButton?: () => void;
}) &
  PagerProps &
  PagerInfoProps &
  ListHeaderProps;

// export default class FinanceApprovalRequestList extends React.Component<Props> {

const FinanceApprovalRequestList = ({
  onClickSortKey,
  sortBy,
  orderBy,
  requestList,
  baseCurrencySymbol,
  baseCurrencyDecimal,
  isRequestTab,
  onClickRequestItem,
  onClickRefreshButton,
  currentPage,
  requestTotalNum,
  onClickPagerLink,
  selectedIds,
  onClickBulkApproval,
  onClickBulkReject,
  onChangeRowSelection,
}: Props) => {
  const disableBulkApprovalActions = selectedIds.length === 0;

  return (
    <div className={ROOT}>
      <div className={`${ROOT}-list-header`}>
        <PagerInfo
          className={`${ROOT}-page-info`}
          currentPage={currentPage}
          totalNum={requestTotalNum}
          pageSize={PAGE_SIZE}
        />
        <div className={`${ROOT}__refresh-btn`}>
          <IconButton
            src={icon}
            onClick={onClickRefreshButton}
            srcType="svg"
            alt="refresh"
          />
        </div>
        {requestList.length !== 0 && (
          <Pagenation
            className={`${ROOT}-list-pager`}
            currentPage={currentPage}
            totalNum={requestTotalNum}
            displayNum={5}
            pageSize={PAGE_SIZE}
            onClickPagerLink={(num) => onClickPagerLink(num)}
            maxPageNum={MAX_PAGE_NUM}
            havePagerInfo={false}
          />
        )}
        <HeaderActions
          allowBulkApproval={true}
          disabled={disableBulkApprovalActions}
          selectedIds={selectedIds}
          onClickBulkApproval={onClickBulkApproval}
          onClickBulkReject={onClickBulkReject}
        />
      </div>
      <ListHeader
        isRequestTab={isRequestTab}
        onClickSortKey={onClickSortKey}
        sortBy={sortBy}
        orderBy={orderBy}
        showCheckboxAll={true}
        onChangeRowSelection={onChangeRowSelection}
        isCheckedAll={
          !disableBulkApprovalActions &&
          selectedIds.length === requestList.length
        }
      />
      {requestList.length !== 0 && (
        <div className={`${ROOT}-list`}>
          {requestList.map((item, idx) => (
            <ListItem
              idx={idx}
              item={item}
              isRequestTab={isRequestTab}
              key={item.requestId}
              baseCurrencySymbol={baseCurrencySymbol}
              baseCurrencyDecimal={baseCurrencyDecimal}
              onClickRequestItem={onClickRequestItem}
              showCheckbox={true}
              onChangeRowSelection={onChangeRowSelection}
              isChecked={selectedIds.includes(item.requestId)}
            />
          ))}
          {currentPage === MAX_PAGE_NUM &&
            requestTotalNum > MAX_SEARCH_RESULT_NUM && (
              <div className={`${ROOT}-too-many-results`}>
                {msg().Com_Lbl_TooManySearchResults}
              </div>
            )}
        </div>
      )}
      <div className={`${ROOT}-list-footer`}>
        <PagerInfo
          className={`${ROOT}-page-info`}
          currentPage={currentPage}
          totalNum={requestTotalNum}
          pageSize={PAGE_SIZE}
        />
      </div>
    </div>
  );
};
export default FinanceApprovalRequestList;
