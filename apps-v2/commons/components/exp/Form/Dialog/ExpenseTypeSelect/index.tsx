import React from 'react';

import isEmpty from 'lodash/isEmpty';

import { Transaction } from '../../../../../../domain/models/exp/CreditCard';
import { Delegator } from '../../../../../../domain/models/exp/DelegateApplicant';
import {
  creditCardFilter,
  ExpenseType,
  ExpenseTypeList,
  ocrFilter,
} from '../../../../../../domain/models/exp/ExpenseType';
import { SelectedReceipt } from '../../../../../../domain/models/exp/Receipt';

import ExpIconInfo from '../../../../../images/icons-utility-info.svg';
import msg from '../../../../../languages';
import MultiColumnFinder, {
  Mode,
  tabTypes,
} from '../../../../dialogs/MultiColumnFinder';
import { ProgressBarStep } from '../../../../ProgressBar';

import '../../../../Modal.scss';

/**
 * 申請ダイアログ
 * Dialogコンポーネントからimportして使われる
 */
export type Props = {
  expenseTypeFavoriteItems: ExpenseTypeList;
  expenseTypeList: Array<any>;
  expenseTypeRecentItems: ExpenseTypeList;
  expenseTypeSearchList: ExpenseTypeList;
  hasMore?: boolean;
  hintMsg?: string;
  // For VRT only
  initialState?: {
    mode: Mode;
    tempFavoriteItems: any[];
  };
  isFinanceApproval?: boolean;
  isLoading: boolean;
  progressBar?: Array<ProgressBarStep>;
  selectedDelegator: Delegator;
  selectedReceipt: SelectedReceipt;
  selectedTransaction?: Transaction;
  favoriteExpType: (arg0: ExpenseType) => Promise<any>;
  listFavoriteExpenseTypes: () => Promise<any>;
  onClickBackButton?: () => void;
  onClickExpenseTypeCloseButton: () => void;
  onClickExpenseTypeItem: (
    arg0: ExpenseType,
    arg1?: ExpenseTypeList
  ) => Promise<void>;
  onClickExpenseTypeSearch: (arg0: string) => void;
  onClickExpenseTypeSelectByCategory: () => void;
  setProgressBar?: (arg0?: Array<ProgressBarStep>) => Record<string, unknown>;
  unfavoriteExpType: (arg0: ExpenseType) => Promise<any>;
};

export default class ExpenseTypeSelect extends React.Component<Props> {
  filter = (expType: ExpenseType) => {
    const fromCreditCardDialog = !isEmpty(this.props.selectedTransaction);
    const fromOCRDialog = !isEmpty(this.props.selectedReceipt);
    if (fromCreditCardDialog) {
      return creditCardFilter(expType);
    } else if (fromOCRDialog) {
      return ocrFilter(expType);
    }
    return true;
  };

  getFilteredFavoriteItems = () =>
    this.props
      .listFavoriteExpenseTypes()
      .then((expTypeList: ExpenseTypeList): ExpenseTypeList => {
        if (!isEmpty(this.props.progressBar)) {
          return expTypeList.filter(this.filter);
        }
        return expTypeList;
      });

  render() {
    const {
      expenseTypeList,
      expenseTypeSearchList,
      expenseTypeRecentItems,
      expenseTypeFavoriteItems,
      selectedDelegator,
    } = this.props;

    let list = expenseTypeList;
    let searchlist = expenseTypeSearchList;
    let recentItemsList = expenseTypeRecentItems;
    let favoriteItems = expenseTypeFavoriteItems;

    if (!isEmpty(this.props.progressBar)) {
      list = expenseTypeList.map((x) => x.filter(this.filter)) || [];
      searchlist = expenseTypeSearchList.filter(this.filter);
      recentItemsList = expenseTypeRecentItems.filter(this.filter);
      favoriteItems =
        expenseTypeFavoriteItems &&
        expenseTypeFavoriteItems.filter(this.filter);
    }

    const tabs = isEmpty(selectedDelegator)
      ? [tabTypes.SEARCH, tabTypes.DIRECTORY, tabTypes.FAVORITE]
      : [tabTypes.SEARCH, tabTypes.DIRECTORY];

    return (
      <div className="ts-modal">
        <button
          type="button"
          className="ts-modal__overlay"
          onClick={this.props.onClickExpenseTypeCloseButton}
        />
        <div className="ts-modal__wrap" style={{ width: 865, height: 537 }}>
          <div className="ts-modal__contents">
            <MultiColumnFinder
              initialState={this.props.initialState}
              showRecentlyUsed={
                !this.props.isFinanceApproval && isEmpty(selectedDelegator)
              }
              items={list}
              typeName={msg().Exp_Clbl_ExpenseType}
              onClickItem={this.props.onClickExpenseTypeItem}
              onClickCloseButton={this.props.onClickExpenseTypeCloseButton}
              tabs={tabs}
              onClickSearch={this.props.onClickExpenseTypeSearch}
              searchResult={searchlist}
              recentItems={recentItemsList}
              isLoading={this.props.isLoading}
              onClickSelectByCategory={
                this.props.onClickExpenseTypeSelectByCategory
              }
              getFavorites={this.getFilteredFavoriteItems}
              favoriteItems={favoriteItems}
              showStar={tabs.includes(tabTypes.FAVORITE)}
              onClickEmptyStar={this.props.favoriteExpType}
              onClickFullStar={this.props.unfavoriteExpType}
              // onClickStar={this.props.unfavoriteExpType}
              IconInfo={ExpIconInfo}
              hintMsg={this.props.hintMsg}
              setProgressBar={this.props.setProgressBar}
              progressBar={this.props.progressBar}
              onClickBackButton={this.props.onClickBackButton}
              hasMoreSearchResult={this.props.hasMore}
            />
          </div>
        </div>
      </div>
    );
  }
}
