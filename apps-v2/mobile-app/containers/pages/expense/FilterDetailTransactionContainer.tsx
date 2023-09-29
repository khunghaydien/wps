import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RouteComponentProps } from 'react-router-dom';

import get from 'lodash/get';

import { goBack } from '@mobile/concerns/routingHistory';

import {
  filterType,
  transactionFilterField,
} from '@mobile/constants/advSearch';

import { OptionProps as Option } from '@apps/commons/components/fields/SearchableDropdown';
import msg from '@apps/commons/languages';
import FilterDetail from '@mobile/components/pages/commons/FilterDetail';

import { State } from '@mobile/modules';
import {
  actions as cardNameActions,
  initialState as initialCardName,
} from '@mobile/modules/expense/ui/transactionAdvSearch/cardName';
import {
  actions as detailActions,
  initialState as initialDetail,
} from '@mobile/modules/expense/ui/transactionAdvSearch/detail';
import {
  actions as requestDateActions,
  initialState as requestDateInitial,
  requestDateOptions,
} from '@mobile/modules/expense/ui/transactionAdvSearch/requestDateRange';
import {
  actions as statusActions,
  initialState as initialStatus,
  statusOptions,
} from '@mobile/modules/expense/ui/transactionAdvSearch/statusList';

import {
  cardNameSelector,
  detailSelector,
  requestDateSelector,
  statusSelector,
} from './ICTransactionsContainer';

export const CARD_TYPES = {
  IC_CARD: 'icCard',
  CREDIT_CARD: 'creditCard',
};

const filterFieldsConfig = {
  [transactionFilterField.CARD_NAME]: {
    label: msg().Exp_Lbl_CardName,
    type: filterType.SEARCH,
  },
  [transactionFilterField.REQUEST_DATE]: {
    label: msg().Exp_Lbl_RequestedDate,
    type: filterType.DATE,
  },
  [transactionFilterField.DETAIL]: {
    label: msg().Exp_Lbl_Detail,
    type: filterType.TEXT,
  },
  [transactionFilterField.STATUS]: {
    label: msg().Exp_Lbl_Status,
    type: filterType.SELECTION,
  },
};

const FilterDetailContainer = (
  props: RouteComponentProps
): React.ReactElement => {
  const dispatch = useDispatch();

  // selected options
  const selectedStatus = useSelector((state: State) => statusSelector(state));
  const selectedDateRange = useSelector((state: State) =>
    requestDateSelector(state)
  );
  const selectedDetail = useSelector((state: State) => detailSelector(state));
  const selectedCardName = useSelector((state: State) =>
    cardNameSelector(state)
  );
  const icCardList = useSelector(
    (state: State) => state.expense.entities.icCard
  );
  const ccCardList = useSelector(
    (state: State) => state.expense.entities.ccCard
  );

  const filterKey = get(props.history.location.state, 'key');
  const filterName = filterFieldsConfig[filterKey].label;
  const filterType = filterFieldsConfig[filterKey].type;
  const filterTypeCard = get(props.history.location.state, 'card_type');
  const cardList =
    filterTypeCard === CARD_TYPES.IC_CARD ? icCardList : ccCardList;

  const getFilterOptions = () => {
    switch (filterKey) {
      case transactionFilterField.STATUS:
        return {
          options: statusOptions(),
          type: filterType,
          selected: selectedStatus,
          initial: initialStatus,
          onClickOption: (selectedValue: Array<string>) => {
            dispatch(statusActions.set(selectedValue));
            onClickBack();
          },
        };
      case transactionFilterField.REQUEST_DATE:
        return {
          options: requestDateOptions(),
          type: filterType,
          selected: selectedDateRange,
          initial: requestDateInitial,
          onClickOption: (selectedValue: string) => {
            onClickRequestDateFilter(selectedValue);
          },
        };
      case transactionFilterField.DETAIL:
        return {
          type: filterType,
          selected: selectedDetail,
          initial: initialDetail,
          onClickOption: (selectedValue: string) => {
            dispatch(detailActions.set(selectedValue));
            onClickBack();
          },
        };
      case transactionFilterField.CARD_NAME:
        return {
          type: filterType,
          selected: selectedCardName,
          options: convertToCardOptions(),
          initial: initialCardName,
          onClickOption: (selectedValue: Array<string>) => {
            dispatch(cardNameActions.set(selectedValue));
            onClickBack();
          },
        };
      default:
        return null;
    }
  };

  const convertToCardOptions = (): Array<Option> => {
    if (filterTypeCard === CARD_TYPES.CREDIT_CARD) {
      return cardList;
    }
    return cardList.map(({ cardName = '', cardNo = '' }) => ({
      label: cardName,
      value: cardNo.toString(),
    }));
  };

  const onClickRequestDateFilter = (selectedValue: string) => {
    dispatch(requestDateActions.set(selectedValue));
    onClickBack();
  };

  const onClickBack = () => {
    goBack(props.history);
  };

  const searchOptions = (query = null): Promise<any> => {
    if (filterKey === transactionFilterField.CARD_NAME) {
      const cardOptions = convertToCardOptions();
      return new Promise((resolve) => {
        const filteredOptions = cardOptions.filter(({ label }) => {
          return label.toLowerCase().includes(query.toLowerCase());
        });
        resolve(filteredOptions);
      });
    }
    return null;
  };

  const updateOptions = (options: Array<Option>) => {
    return options;
  };

  return (
    <FilterDetail
      content={getFilterOptions()}
      title={filterName}
      onClickBack={onClickBack}
      onClickSearch={searchOptions}
      updateOptions={updateOptions}
    />
  );
};

export default FilterDetailContainer;
