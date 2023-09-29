import React from 'react';

import find from 'lodash/find';
import get from 'lodash/get';
import isEmpty from 'lodash/isEmpty';
import without from 'lodash/without';

import TextUtil from '@apps/commons/utils/TextUtil';
import ToastContainer from '@commons/containers/ToastContainer';

import { AccountingPeriod } from '../../../../../../domain/models/exp/AccountingPeriod';
import {
  Transaction,
  TransactionList,
} from '../../../../../../domain/models/exp/CreditCard';

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
import Table, { TableProps } from './Table';

import './index.scss';

const ROOT = 'ts-expenses-modal-transaction-selection';

export type Props = TableProps & {
  overlap: { record: boolean; report: boolean };
  progressBar: Array<ProgressBarStep>;
  selectedAccountingPeriod: AccountingPeriod;
  getCreditCardTransactions: (
    from?: string,
    to?: string,
    cardNameList?: Array<string>,
    description?: string,
    showHidden?: boolean,
    showClaimed?: boolean
  ) => Promise<any>;
  hideAndReset: () => void;
  onClickConfirmButton: () => void;
  onClickNextButton: () => void;
  setProgressBar: (arg0: Array<ProgressBarStep>) => Record<string, unknown>;
  setSelectedTransaction: (data?: Transaction) => Record<string, unknown>;
  toggleHideCC: (id: string, toHide: boolean) => Promise<boolean>;
};

type State = {
  cardNameOptions?: OptionList;
  details?: string;
  endDate?: string;
  isFetching: boolean;
  selectedCardNameList?: Array<string>;
  selectedId?: string;
  showClaimed: boolean;
  showHidden: boolean;
  startDate?: string;
  transactions: TransactionList;
};

export default class TransactionSelection extends React.Component<
  Props,
  State
> {
  state = {
    transactions: [],
    selectedId: null,
    startDate: null,
    endDate: null,
    isFetching: true,
    selectedCardNameList: [],
    details: '',
    showHidden: false,
    showClaimed: false,
    cardNameOptions: [],
  };

  componentDidMount() {
    const { selectedAccountingPeriod, getCreditCardTransactions } = this.props;
    let from = get(selectedAccountingPeriod, 'validDateFrom', null);
    let to = get(selectedAccountingPeriod, 'validDateTo', null);
    if (!from || !to) {
      to = DateUtil.getToday();
      from = DateUtil.addDays(to, -30);
    }
    this.setState({ startDate: from, endDate: to });
    getCreditCardTransactions(from, to, null, '', false, false).then(
      (transactions) => {
        const cardNameList = transactions.map(
          (transaction) => transaction.cardNameL
        );
        const cardNameSet = [...new Set(cardNameList)];
        const cardNameOptions = cardNameSet.map((cardName: string) => ({
          label: cardName,
          value: cardName,
        }));
        const selectedCardNameList = cardNameOptions.map(({ value }) => value);

        this.setState({
          transactions,
          isFetching: false,
          cardNameOptions: cardNameOptions,
          selectedCardNameList,
        });
      }
    );

    const steps = [
      {
        id: '1',
        text: msg().Exp_Lbl_TransactionSelection,
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

  onClickSearch = () => {
    this.setState({ isFetching: true });
    const {
      startDate,
      endDate,
      selectedCardNameList,
      showHidden,
      showClaimed,
      details,
    } = this.state;
    this.props
      .getCreditCardTransactions(
        startDate,
        endDate,
        selectedCardNameList,
        details,
        showHidden,
        showClaimed
      )
      .then((transactions) => {
        const cardNameList = transactions.map(
          (transaction) => transaction.cardNameL
        );
        const originalCardNameList = this.state.cardNameOptions.map(
          ({ value }) => value
        );
        const cardNameSet = [
          ...new Set([...cardNameList, ...originalCardNameList]),
        ];
        const cardNameOptions = cardNameSet.map((cardName: string) => ({
          label: cardName,
          value: cardName,
        }));

        this.setState({
          transactions,
          selectedId: null,
          isFetching: false,
          cardNameOptions,
        });
        this.toggleProgressBar(false);
      });
  };

  onChangeStartDate = (startDate?: string) => {
    this.setState({ startDate });
  };

  onChangeEndDate = (endDate?: string) => {
    this.setState({ endDate });
  };

  onInputDetails = (details: string) => {
    this.setState({ details });
  };

  toggleShowHidden = (e: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({ showHidden: (e.target as HTMLInputElement).checked });
  };

  toggleShowClaimed = (e: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({ showClaimed: (e.target as HTMLInputElement).checked });
  };

  toggleProgressBar = (toActive: boolean) => {
    if (!isEmpty(this.props.progressBar)) {
      const steps = [...this.props.progressBar];
      steps[0].status = toActive
        ? PROGRESS_STATUS.ACTIVE
        : PROGRESS_STATUS.SELECTED;
      this.props.setProgressBar(steps);
    }
  };

  toggleSelection = ({ id, checked }: { id: string; checked: boolean }) => {
    const updatedId = checked ? id : null;
    this.setState({ selectedId: updatedId });
    this.toggleProgressBar(checked);

    const transactionInfo = checked
      ? find(this.state.transactions, { id: updatedId })
      : null;
    this.props.setSelectedTransaction(transactionInfo);
  };

  toggleCardNameSelection = (id: string) => {
    let updatedSelection;
    if (this.state.selectedCardNameList.includes(id)) {
      updatedSelection = without(this.state.selectedCardNameList, id);
    } else {
      updatedSelection = [...this.state.selectedCardNameList, id];
    }
    this.setState({ selectedCardNameList: updatedSelection });
  };

  setHideStatus = (id: string, toHide: boolean) => {
    this.setState(({ transactions }) => {
      const updated = transactions.map((tran) => {
        if (tran.id === id) {
          return { ...tran, isHidden: toHide };
        }
        return tran;
      });
      return { transactions: updated };
    });
  };

  handleToggleHide = (id: string, toHide: boolean) => {
    this.setHideStatus(id, toHide);
    this.props.toggleHideCC(id, toHide).then((isSuccess) => {
      if (!isSuccess) {
        // reset to original value
        this.setHideStatus(id, !toHide);
      }
    });
  };

  clearDescription = () => {
    this.setState({ details: '' });
  };

  render() {
    let buttonText = msg().Com_Lbl_NextButton;
    let buttonAction = this.props.onClickNextButton;
    let progressBar = <ProgressBar steps={this.props.progressBar} />;
    const isClickFromLinkBtn = this.props.overlap.record;
    if (isClickFromLinkBtn) {
      buttonText = msg().Com_Btn_Confirm;
      buttonAction = this.props.onClickConfirmButton;
      progressBar = null;
    }

    return (
      <DialogFrame
        title={msg().Exp_Lbl_CreditCardTransaction}
        hide={this.props.hideAndReset}
        className={`${ROOT}__dialog-frame`}
        footer={
          <DialogFrame.Footer sub={progressBar}>
            <Button
              type="primary"
              onClick={buttonAction}
              disabled={!this.state.selectedId}
            >
              {buttonText}
            </Button>
          </DialogFrame.Footer>
        }
      >
        <div className={`${ROOT}__inner`}>
          <SearchFields
            className={`${ROOT}__search-area`}
            searchBtnType="label"
            isSearchBtnPrimary
            onClickSearch={this.onClickSearch}
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
                appendedClass: 'credit-card-name',
                label: msg().Exp_Lbl_CardName,
                placeHolder: TextUtil.template(
                  msg().Exp_Lbl_SearchConditionPlaceholder,
                  msg().Exp_Lbl_CardName
                ),
                selectedStringValues: this.state.selectedCardNameList,
                data: this.state.cardNameOptions,
                onSelectInput: this.toggleCardNameSelection,
                optionLimit: 100,
              },
              {
                type: FILTER_TYPE.TEXT_INPUT,
                appendedClass: 'details',
                label: msg().Exp_Lbl_Description,
                inputValue: this.state.details,
                onInput: this.onInputDetails,
                isClearable: true,
                onClickClearIcon: this.clearDescription,
              },
            ]}
          />

          <SearchFields
            className={`${ROOT}__search-area`}
            filters={[
              {
                type: FILTER_TYPE.CHECKBOX,
                appendedClass: 'hidden',
                checked: this.state.showHidden,
                label: msg().Exp_Lbl_InclHidden,
                onToggle: this.toggleShowHidden,
              },
              {
                type: FILTER_TYPE.CHECKBOX,
                appendedClass: 'claimed',
                checked: this.state.showClaimed,
                label: msg().Exp_Lbl_InclClaimed,
                onToggle: this.toggleShowClaimed,
              },
            ]}
          />

          {this.state.isFetching ? (
            <Skeleton
              noOfRow={6}
              colWidth="100%"
              className={`${ROOT}__skeleton`}
              rowHeight="25px"
              margin="30px"
            />
          ) : (
            <Table
              transactions={this.state.transactions}
              baseCurrencySymbol={this.props.baseCurrencySymbol}
              selectedId={this.state.selectedId}
              toggleSelection={this.toggleSelection}
              handleToggleHide={this.handleToggleHide}
            />
          )}
        </div>
        <ToastContainer />
      </DialogFrame>
    );
  }
}
