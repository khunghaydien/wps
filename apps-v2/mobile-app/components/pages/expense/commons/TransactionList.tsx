import React from 'react';

import classNames from 'classnames';

import msg from '@apps/commons/languages';
import DateUtil from '@apps/commons/utils/DateUtil';
import Navigation from '@mobile/components/molecules/commons/Navigation';

import './TransactionList.scss';
import TransactionCard from './TransactionCard';

import Button from '@mobile/components/atoms/Button';
import Wrapper from '@mobile/components/atoms/Wrapper';

import Icon from '../../../atoms/Icon';

type TagInfo = {
  key: string;
  value: string;
  count: number;
  label: string;
};

type TransactionInfo = {
  transactionAmount: string;
  transactionPaymentDate: string;
  transactionName: string;
  isArchived: boolean;
  transactionDescription: string;
  isClaimed: boolean;
  transactionId: string;
  cardNo?: string;
  showAlert?: () => void;
};

type Props = {
  selectedIds: string[];
  displayHint?: boolean;
  mainBtnLabel?: string;
  onSelectRow: (string) => void;
  onClickBack: () => void;
  onClickMainButton: () => void;
  onClickFilterItem?: (key: string) => void;
  tags?: TagInfo[];
  transactionList?: TransactionInfo[];
  hideCardTransaction?: (
    id: string,
    isHidden: boolean,
    cardNo?: string
  ) => void;
};
const filterTag = ({ key, label, value, count }, onClickFilterItem) => (
  <div
    key={key}
    className={classNames([`${ROOT}__filter-tag`], {
      highlight: !!count,
    })}
    onClick={() => {
      onClickFilterItem(key);
    }}
  >
    <span className={`${ROOT}__filter-tag-label`}>
      {count === 1 ? value : label}
    </span>
    {count > 1 && <span className={'count-icon'}>{count}</span>}
    <Icon type="down" size="small" />
  </div>
);

const LIMIT_NUMBER = 100;
const ROOT = 'mobile-app-pages-transaction-list';

const TransactionList = (props: Props) => {
  const noOfSelected = props.selectedIds.length;
  const isButtonDisabled = noOfSelected === 0 || noOfSelected > 20;
  const overLimit = props.transactionList.length > LIMIT_NUMBER;
  const totalCount = overLimit ? LIMIT_NUMBER : props.transactionList.length;

  const formatDateTransaction = (date: string) => DateUtil.format(date, 'L');

  const renderSearchArea = (tags: TagInfo[]) => (
    <div className={`${ROOT}__search-area`}>
      {tags.map((tag) => filterTag(tag, props.onClickFilterItem))}
    </div>
  );

  const renderTransactionList = () => {
    return props.transactionList
      .slice(0, LIMIT_NUMBER)
      .map((transaction: TransactionInfo) => {
        const {
          isArchived,
          isClaimed,
          transactionAmount,
          transactionDescription,
          transactionId,
          transactionName,
          transactionPaymentDate,
          cardNo,
          showAlert,
        } = transaction;
        const isSelected = props.selectedIds.indexOf(transactionId) > -1;
        return (
          <div key={transactionId} className={`${ROOT}__row`}>
            <TransactionCard
              key={transactionId}
              cardAmount={transactionAmount}
              cardPaymentDate={formatDateTransaction(transactionPaymentDate)}
              cardName={transactionName}
              transactionDetail={transactionDescription}
              isArchived={isArchived}
              isClaimed={isClaimed}
              hideICCardTransaction={() =>
                props.hideCardTransaction(transactionId, !isArchived, cardNo)
              }
              showAlert={showAlert}
            />
            <label className={`${ROOT}__img-radio radio-container`}>
              <input
                type="checkbox"
                value={transactionId}
                onClick={props.onSelectRow}
                checked={isSelected}
                disabled={isClaimed}
              />
              <span className="checkmark" />
            </label>
          </div>
        );
      });
  };

  return (
    <Wrapper className={ROOT}>
      <Navigation
        title={msg().Exp_Lbl_SelectTransaction}
        onClickBack={props.onClickBack}
      />

      <div className="main-content">
        {renderSearchArea(props.tags)}
        <div className={`${ROOT}__count`}>
          <div className={`${ROOT}__num`}>
            {`${totalCount}${overLimit ? '+' : ''} ${
              msg().Exp_Lbl_RecordCount
            }`}
          </div>
        </div>
        {props.transactionList.length > 0 && renderTransactionList()}
        {props.transactionList.length === 0 && (
          <div className={`${ROOT}__has-zero`}>
            {msg().Com_Lbl_ZeroSearchResult}
          </div>
        )}
        {overLimit && (
          <div className={`${ROOT}__has-over-maximum`}>
            {msg().Com_Lbl_TooManySearchResults}
          </div>
        )}
      </div>

      <div className={`${ROOT}__next`}>
        <Button
          priority="primary"
          variant="neutral"
          type="submit"
          className={`${ROOT}__next-btn`}
          onClick={props.onClickMainButton}
          disabled={isButtonDisabled}
        >
          {props.mainBtnLabel || msg().Com_Lbl_NextButton}
        </Button>
        {props.displayHint && (
          <div className={`${ROOT}__next-hint`}>
            {msg().Exp_Msg_MaxTwentyICTransaction}
          </div>
        )}
      </div>
    </Wrapper>
  );
};

export default TransactionList;
