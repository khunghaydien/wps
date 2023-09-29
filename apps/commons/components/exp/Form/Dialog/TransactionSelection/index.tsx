import React from 'react';

import find from 'lodash/find';
import get from 'lodash/get';
import isEmpty from 'lodash/isEmpty';
import without from 'lodash/without';

import TextUtil from '@apps/commons/utils/TextUtil';
import DateUtil from '@commons/utils/DateUtil';

import { AccountingPeriod } from '../../../../../../domain/models/exp/AccountingPeriod';
import {
  Transaction,
  TransactionList,
} from '../../../../../../domain/models/exp/CreditCard';

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
  progressBar: Array<ProgressBarStep>;
  selectedAccountingPeriod: AccountingPeriod;
  getCreditCardTransactions: (
    from?: string,
    to?: string,
    cardNameList?: Array<string>
  ) => Promise<any>;
  hideAndReset: () => void;
  onClickNextButton: () => void;
  setProgressBar: (arg0: Array<ProgressBarStep>) => Record<string, unknown>;
  setSelectedTransaction: (data?: Transaction) => Record<string, unknown>;
};

type State = {
  cardNameOptions?: OptionList;
  endDate?: string;
  isFetching: boolean;
  selectedCardNameList?: Array<string>;
  selectedId?: string;
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
    getCreditCardTransactions(from, to).then((transactions) => {
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
    });

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
    const { startDate, endDate, selectedCardNameList } = this.state;
    this.props
      .getCreditCardTransactions(startDate, endDate, selectedCardNameList)
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

  render() {
    return (
      <DialogFrame
        title={msg().Exp_Lbl_CreditCardTransaction}
        hide={this.props.hideAndReset}
        className={`${ROOT}__dialog-frame`}
        footer={
          <DialogFrame.Footer
            sub={<ProgressBar steps={this.props.progressBar} />}
          >
            <Button
              type="primary"
              onClick={this.props.onClickNextButton}
              disabled={!this.state.selectedId}
            >
              {msg().Com_Lbl_NextButton}
            </Button>
          </DialogFrame.Footer>
        }
      >
        <div className={`${ROOT}__inner`}>
          <SearchFields
            className={`${ROOT}__search-area`}
            searchBtnType="icon"
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
            />
          )}
        </div>
      </DialogFrame>
    );
  }
}
