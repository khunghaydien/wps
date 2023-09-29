import React, { ChangeEvent } from 'react';

import classNames from 'classnames';
import _ from 'lodash';

import { AccountingPeriod } from '../../../../../../domain/models/exp/AccountingPeriod';
import {
  getDetailDisplay,
  IcCards,
  IcTransactionWithCardNo,
} from '../../../../../../domain/models/exp/TransportICCard';

import DateUtil from '../../../../../utils/DateUtil';

import msg from '../../../../../languages';
import Button from '../../../../buttons/Button';
import DialogFrame from '../../../../dialogs/DialogFrame';
import { OptionList } from '../../../../fields/CustomDropdown';
import ProgressBar, {
  PROGRESS_STATUS,
  ProgressBarStep,
} from '../../../../ProgressBar';
import Skeleton from '../../../../Skeleton';
import SearchFields, { FILTER_TYPE } from '../../../SearchFields';
import Table, { TableProps, transactionWithDisplayInfo } from './Table';

import './index.scss';

const ROOT = 'ts-expenses-modal-ic-card-transaction';

export type Props = TableProps & {
  // For VRT only
  initialState?: {
    endDate: string;
    filteredTransactions: Array<transactionWithDisplayInfo>;
    selectedCards: Array<string>;
    startDate: string;
  };
  isLoading: boolean;
  overlap: { record: boolean; report: boolean };
  progressBar: Array<ProgressBarStep>;
  selectedAccountingPeriod: AccountingPeriod;
  getIcCardList: () => Promise<IcCards>;
  getIcTransactionsWithCardNo: (
    from?: string,
    to?: string,
    includeHidden?: boolean,
    includeUsed?: boolean
  ) => Promise<IcTransactionWithCardNo[]>;
  hideAndReset: () => void;
  hideICCardTransaction: (
    cardNo: string,
    icRecordId: string,
    isHidden: boolean
  ) => Promise<boolean>;
  onClickConfirmButton: () => void;
  onClickNextButton: () => void;
  setProgressBar: (arg0: Array<ProgressBarStep>) => Record<string, unknown>;
  setSelectedIcTransaction: (
    data: IcTransactionWithCardNo[]
  ) => Record<string, unknown>;
  toggleIsLoading: (boolean) => void;
};

type State = {
  cards: IcCards;
  detailSearchInput: string;
  endDate?: string;
  filteredTransactions: Array<transactionWithDisplayInfo>;
  isClaimed: boolean;
  isHidden: boolean;
  selectedCards: Array<string>;
  selectedIds?: string[];
  startDate?: string;
  transactions: Array<IcTransactionWithCardNo>;
};

export default class ICCardTransaction extends React.Component<Props, State> {
  state = {
    cards: [],
    isClaimed: false,
    isHidden: false,
    selectedCards: [],
    detailSearchInput: '',
    transactions: [],
    filteredTransactions: [],
    selectedIds: [],
    startDate: null,
    endDate: null,
  };

  componentDidMount() {
    const {
      selectedAccountingPeriod,
      getIcCardList,
      getIcTransactionsWithCardNo,
      toggleIsLoading,
    } = this.props;
    const { isClaimed, isHidden } = this.state;
    let from = _.get(selectedAccountingPeriod, 'validDateFrom', null);
    let to = _.get(selectedAccountingPeriod, 'validDateTo', null);

    if (!from || !to) {
      to = DateUtil.getToday();
      from = DateUtil.addDays(to, -30);
    }

    const { initialState = this.state } = this.props;
    toggleIsLoading(true);
    getIcCardList().then((cards = []) => {
      const selectedCards = cards.map((card) => card.cardNo);
      getIcTransactionsWithCardNo(from, to, isHidden, isClaimed).then(
        (transactions) => {
          const filteredTransactions = this.filterTransactions(
            transactions,
            cards,
            selectedCards,
            ''
          );
          this.setState({
            transactions,
            cards,
            selectedCards,
            filteredTransactions,
          });
          toggleIsLoading(false);
        }
      );
    });
    if (initialState.filteredTransactions) {
      this.setState({
        filteredTransactions: initialState.filteredTransactions,
      });
    }

    this.setState({
      startDate: initialState.startDate || from,
      endDate: initialState.endDate || to,
    });

    const steps = [
      {
        id: '1',
        text: msg().Exp_Lbl_IcCardTransactionSelection,
        status: PROGRESS_STATUS.SELECTED,
      },
      {
        id: '2',
        text: msg().Exp_Lbl_ExpenseTypeSelect,
        status: PROGRESS_STATUS.INACTIVE,
      },
    ];
    this.props.setProgressBar(steps);
  }

  onInputDetail = (value: string) => {
    this.setState({ detailSearchInput: value });
  };

  onChangeStartDate = (startDate: string) => {
    if (startDate === this.state.startDate) {
      return;
    }

    if (!startDate) {
      this.setState((prevState) => ({ startDate: prevState.startDate }));
      return;
    }
    this.setState({ startDate });
  };

  onChangeEndDate = (endDate: string) => {
    if (endDate === this.state.endDate) {
      return;
    }

    if (!endDate) {
      this.setState((prevState) => ({ endDate: prevState.endDate }));
      return;
    }
    this.setState({ endDate });
  };

  onClickSearch = () => {
    const { endDate, isClaimed, isHidden, startDate } = this.state;
    this.props.toggleIsLoading(true);
    this.props
      .getIcTransactionsWithCardNo(startDate, endDate, isHidden, isClaimed)
      .then((records) => {
        const transactions = records || [];
        this.setState((prevState) => {
          const filteredTransactions = this.filterTransactions(
            transactions,
            prevState.cards,
            prevState.selectedCards,
            prevState.detailSearchInput
          );
          const selectedIds = this.updateSelectedInfo(
            filteredTransactions,
            prevState.selectedIds
          );
          return { transactions, filteredTransactions, selectedIds };
        });
        this.props.toggleIsLoading(false);
      });
  };

  toggleSelectedCard = (cardNo: string) => {
    const cardNumber = cardNo;
    const { selectedCards } = this.state;
    let updatedSelectedCards;
    if (selectedCards.includes(cardNumber)) {
      updatedSelectedCards = _.without(selectedCards, cardNumber);
    } else {
      updatedSelectedCards = [...selectedCards, cardNumber];
    }

    this.setState({ selectedCards: updatedSelectedCards });
  };

  /*
   * In previously selected rows, clear selection if one is not in the new search results;
   * Otherwise, keep it as selected
   */
  updateSelectedInfo = (
    searchResult: Array<transactionWithDisplayInfo>,
    selectedIds: string[]
  ) => {
    const resultIds = searchResult.map(({ recordId }) => recordId);
    const updatedSelectedIds = selectedIds.filter((prevId) =>
      resultIds.includes(prevId)
    );
    const updatedSelectedTrans = searchResult.filter(({ recordId }) =>
      updatedSelectedIds.includes(recordId)
    );
    const isAnySelected = updatedSelectedIds.length > 0;
    this.toggleProgressBar(isAnySelected);
    this.props.setSelectedIcTransaction(updatedSelectedTrans);
    return updatedSelectedIds;
  };

  /*
   * Add showCheckbox, `cardName` and `detailDisplay` to each transactions for display purpose
   * and filter transactions based on card & detail search conditions
   */
  filterTransactions = (
    transactions: Array<IcTransactionWithCardNo>,
    cards: IcCards,
    selectedCards: Array<string>,
    detailSearchInput: string
  ) => {
    const filtered = [];

    transactions.forEach((transaction) => {
      const cardNo = transaction.cardNo;
      const cardInfo = _.find(cards, { cardNo });
      const cardName = _.get(cardInfo, 'cardName', '');
      const detailDisplay = getDetailDisplay(transaction);

      const isCardNumberMatch = selectedCards.includes(String(cardNo));
      const isDetailMatch = detailDisplay.includes(detailSearchInput);
      if (isCardNumberMatch && isDetailMatch) {
        const extendedTransaction = {
          ...transaction,
          detailDisplay,
          cardName,
          showCheckbox: !transaction.isUsed,
        };
        filtered.push(extendedTransaction);
      }
    });

    return filtered;
  };

  toggleProgressBar = (toActive: boolean) => {
    if (!_.isEmpty(this.props.progressBar)) {
      const steps = [...this.props.progressBar];
      steps[0].status = toActive
        ? PROGRESS_STATUS.ACTIVE
        : PROGRESS_STATUS.SELECTED;
      this.props.setProgressBar(steps);
    }
  };

  toggleSelection = (
    selectedRow: { id: string; checked: boolean } | string
  ) => {
    const id =
      typeof selectedRow === 'string' ? selectedRow : _.get(selectedRow, 'id');
    const isClickFromLinkBtn = this.props.overlap.record;

    this.setState((prevState) => {
      const wasChecked = prevState.selectedIds.includes(id);
      let newList = [...prevState.selectedIds];
      if (wasChecked) {
        newList = newList.filter((recordId) => recordId !== id);
      } else if (isClickFromLinkBtn) {
        // only allow link one
        newList = [id];
      } else {
        newList.push(id);
      }

      const isAnySelected = newList.length > 0;
      this.toggleProgressBar(isAnySelected);
      const transInfo = this.state.filteredTransactions.filter(({ recordId }) =>
        newList.includes(recordId)
      );
      this.props.setSelectedIcTransaction(transInfo);

      return { selectedIds: newList };
    });
  };

  toggleHidden = (e: ChangeEvent<HTMLInputElement>) => {
    const { checked } = e.target;
    this.setState({ isHidden: checked });
  };

  toggleClaimed = (e: ChangeEvent<HTMLInputElement>) => {
    const { checked } = e.target;
    this.setState({ isClaimed: checked });
  };

  setTransHideStatus = (id: string, isHidden: boolean) => {
    this.setState(({ filteredTransactions }) => ({
      filteredTransactions: filteredTransactions.map((transaction) =>
        transaction.recordId === id ? { ...transaction, isHidden } : transaction
      ),
    }));
  };

  hideICCardTransaction = (
    cardNo: string,
    icRecordId: string,
    isHidden: boolean
  ): void => {
    this.setTransHideStatus(icRecordId, isHidden);
    this.props
      .hideICCardTransaction(cardNo, icRecordId, isHidden)
      .then((isSuccess) => {
        if (!isSuccess) this.setTransHideStatus(icRecordId, !isHidden);
      });
  };

  convertToCardOptions = (): OptionList =>
    this.state.cards.map(({ cardName = '', cardNo = '' }) => ({
      label: cardName,
      value: cardNo.toString(),
    }));

  render() {
    let primaryBtnText = msg().Com_Lbl_NextButton;
    let primaryBtnAction = this.props.onClickNextButton;
    let progressBar = <ProgressBar steps={this.props.progressBar} />;
    const noOfSelected = this.state.selectedIds.length;
    let isPrimaryDisabled = noOfSelected === 0 || noOfSelected > 20;

    const isClickFromLinkBtn = this.props.overlap.record;
    if (isClickFromLinkBtn) {
      primaryBtnText = msg().Com_Btn_Confirm;
      primaryBtnAction = this.props.onClickConfirmButton;
      progressBar = null;
      isPrimaryDisabled = noOfSelected !== 1;
    }

    const rootClass = classNames(`${ROOT}__dialog-frame`, {
      'is-link-dialog': isClickFromLinkBtn,
    });

    const { initialState = this.state } = this.props;
    return (
      <DialogFrame
        title={msg().Exp_Lbl_IcCardTrasaction}
        hide={this.props.hideAndReset}
        className={rootClass}
        footer={
          <DialogFrame.Footer sub={progressBar}>
            <Button
              type="primary"
              onClick={primaryBtnAction}
              disabled={isPrimaryDisabled}
            >
              {primaryBtnText}
            </Button>
          </DialogFrame.Footer>
        }
      >
        <div className={`${ROOT}__inner`}>
          <SearchFields
            className={`${ROOT}__search-area`}
            filters={[
              {
                type: FILTER_TYPE.DATE_RANGE,
                appendedClass: 'date-range',
                startDate: this.state.startDate,
                endDate: this.state.endDate,
                onChangeStartDate: this.onChangeStartDate,
                onChangeEndDate: this.onChangeEndDate,
              },
              {
                type: FILTER_TYPE.SELECTION,
                appendedClass: 'card',
                label: msg().Exp_Lbl_CardName,
                placeHolder: msg().Exp_Lbl_SearchConditionPlaceholderCard,
                selectedStringValues: (
                  initialState.selectedCards || this.state.selectedCards
                ).map(String),
                data: this.convertToCardOptions(),
                onSelectInput: this.toggleSelectedCard,
              },
              {
                type: FILTER_TYPE.TEXT_INPUT,
                appendedClass: 'detail',
                label: msg().Exp_Btn_SearchConditionDetail,
                inputValue: this.state.detailSearchInput,
                onInput: this.onInputDetail,
              },
            ]}
            isSearchBtnPrimary
            onClickSearch={this.onClickSearch}
            searchBtnType="label"
          />
          <SearchFields
            className={`${ROOT}__check-area`}
            filters={[
              {
                type: FILTER_TYPE.CHECKBOX,
                appendedClass: 'hidden-claimed',
                checked: this.state.isHidden,
                label: msg().Exp_Lbl_InclHidden,
                onToggle: this.toggleHidden,
              },
              {
                type: FILTER_TYPE.CHECKBOX,
                appendedClass: 'hidden-claimed',
                checked: this.state.isClaimed,
                label: msg().Exp_Lbl_InclClaimed,
                onToggle: this.toggleClaimed,
              },
            ]}
          />

          {!isClickFromLinkBtn && (
            <div className={`${ROOT}__hint`}>
              {msg().Exp_Msg_MaxTwentyICTransaction}
            </div>
          )}

          {this.props.isLoading ? (
            <Skeleton
              noOfRow={6}
              colWidth="100%"
              className={`${ROOT}__skeleton`}
              rowHeight="25px"
              margin="30px"
            />
          ) : (
            <Table
              filteredTransactions={this.state.filteredTransactions}
              baseCurrencySymbol={this.props.baseCurrencySymbol}
              selectedIds={this.state.selectedIds}
              toggleSelection={this.toggleSelection}
              hideICCardTransaction={this.hideICCardTransaction}
            />
          )}
        </div>
      </DialogFrame>
    );
  }
}
