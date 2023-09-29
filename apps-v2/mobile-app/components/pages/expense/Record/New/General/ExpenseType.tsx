import React from 'react';

import isEmpty from 'lodash/isEmpty';

import msg from '../../../../../../../commons/languages';
import SearchField from '../../../../../molecules/commons/Fields/SearchField';
import Navigation from '../../../../../molecules/commons/Navigation';

import {
  creditCardFilter,
  ExpenseType,
  ExpenseTypeList,
  ocrFilter,
} from '../../../../../../../domain/models/exp/ExpenseType';
import { TransactionList } from '@apps/domain/models/exp/CreditCard';
import { SelectedReceipt } from '@apps/domain/models/exp/Receipt';

import Button from '@mobile/components/atoms/Button';
import Icon from '@mobile/components/atoms/Icon';

import LinkListItem from '../../../../../atoms/LinkListItem';
import Wrapper from '../../../../../atoms/Wrapper';

import CSS from './ExpenseType.scss';

const ROOT = 'mobile-app-pages-expense-type';

type State = {
  keyword: string;
  selected: string;
};

type Props = {
  keyword: string;
  hasMore?: boolean;
  expenseTypeList: ExpenseTypeList;
  selectedCCTransaction: TransactionList;
  selectedOCRReceipt: SelectedReceipt;
  onBackClick: () => void;
  onSearchClick: (keyword: string) => void;
  onRowClick: (item: any) => void;
};

export default class SearchExpenseType extends React.Component<Props, State> {
  state = {
    keyword:
      (this.props.keyword && decodeURIComponent(this.props.keyword)) || '',
    selected: null,
  };

  onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({ keyword: e.target.value });
  };

  handleRowClick = (item) => {
    const { id, isGroup } = item;
    if (!isGroup) {
      this.setState((prevState) => {
        const selected = prevState.selected === id ? null : id;
        return { selected };
      });
    } else {
      this.props.onRowClick(item);
    }
  };

  handleClickApply = () => {
    const expType = this.props.expenseTypeList.find(
      ({ id }) => id === this.state.selected
    );
    this.props.onRowClick(expType);
  };

  filterValidExpType = (expType: ExpenseType) => {
    const fromCreditCardDialog = !isEmpty(this.props.selectedCCTransaction);
    const fromOCRDialog = !isEmpty(this.props.selectedOCRReceipt);
    if (fromCreditCardDialog) {
      return creditCardFilter(expType);
    }
    if (fromOCRDialog) {
      return ocrFilter(expType);
    }
    return true;
  };

  render() {
    const { expenseTypeList } = this.props;
    const filteredExpTypes = expenseTypeList.filter(this.filterValidExpType);

    return (
      <Wrapper className={ROOT}>
        <Navigation
          title={msg().Exp_Clbl_ExpenseType}
          onClickBack={this.props.onBackClick}
        />
        <div className="main-content">
          <SearchField
            placeHolder={msg().Com_Lbl_Search}
            iconClick={() => this.props.onSearchClick(this.state.keyword)}
            onChange={this.onChange}
            value={this.state.keyword}
          />

          <div className={`${ROOT}__result`}>
            {filteredExpTypes.map((item, idx) => (
              <div key={idx} className={`${ROOT}__row`}>
                <LinkListItem
                  key={item.id}
                  className={`${ROOT}__item`}
                  onClick={() => this.handleRowClick(item)}
                  noIcon={!item.isGroup}
                >
                  <div>
                    <div className={`${ROOT}__item-name`}>{item.name}</div>
                    <div className={`${ROOT}__item-code`}>{item.code}</div>
                  </div>
                  {!item.isGroup && item.id === this.state.selected && (
                    <Icon
                      type="check-copy"
                      color={CSS.brand}
                      className={`${ROOT}__item-check`}
                      size="medium"
                    />
                  )}
                </LinkListItem>
              </div>
            ))}
          </div>
          {filteredExpTypes.length === 0 && (
            <div key="hasZero" className={`${ROOT}__has-zero`}>
              {msg().Com_Lbl_ZeroSearchResult}
            </div>
          )}
          {this.props.hasMore && (
            <div key="hasMore" className={`${ROOT}__has-more`}>
              {msg().Com_Lbl_TooManySearchResults}
            </div>
          )}
        </div>

        <Button
          priority="primary"
          variant="neutral"
          type="submit"
          className={`${ROOT}__apply`}
          disabled={!this.state.selected}
          onClick={this.handleClickApply}
        >
          {msg().Com_Lbl_Apply}
        </Button>
      </Wrapper>
    );
  }
}
