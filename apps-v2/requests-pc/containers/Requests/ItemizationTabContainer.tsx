import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import get from 'lodash/get';
import isNil from 'lodash/isNil';
import uuidV4 from 'uuid/v4';

import { actions as itemizationLoadingActions } from '@apps/commons/modules/exp/ui/itemizationLoading';
import ItemizationTab, {
  ContainerProps,
  ExpTypeOptionList,
} from '@commons/components/exp/Form/RecordItem/Tabs/ItemizationTab';
import { selectors as appSelectors } from '@commons/modules/app';
import { calculateAmountFromExchangeRate } from '@commons/utils/exp/ItemizationUtil';

import { buildExpTypeOptionList } from '@apps/domain/models/exp/ExpenseType';
import { calcAmountFromRate } from '@apps/domain/models/exp/foreign-currency/Currency';
import { exchangeRateField } from '@apps/domain/models/exp/foreign-currency/ExchangeRate';
import {
  calculateAmountPayable,
  isUseWithholdingTax,
  newRecordItem,
} from '@apps/domain/models/exp/Record';
import {
  AmountInputMode,
  calcAmountFromTaxExcluded,
  calculateTax,
  ExpTaxType,
  getTaxTypeList,
  TaxRes,
  taxSelectField,
} from '@apps/domain/models/exp/TaxType';

import { State } from '@apps/requests-pc/modules';
import { AppDispatch } from '@apps/requests-pc/modules/AppThunk';

import {
  searchChildItemTaxTypeList,
  searchTaxTypeList,
} from '@apps/requests-pc/action-dispatchers/Currency';
import { searchExpTypesByParentRecord } from '@apps/requests-pc/action-dispatchers/ExpenseType';

import BaseCurrencyContainer from './BaseCurrencyContainer';
import ForeignCurrencyContainer from './ForeignCurrencyContainer';
import JobCCEISumContainer from './JobCCEISumContainer';

const ItemizationTabContainer = (props: ContainerProps) => {
  const dispatch = useDispatch() as AppDispatch;

  const isLoading = useSelector((state: State) =>
    appSelectors.loadingSelector(state)
  );
  const loadingAreas = useSelector(
    (state: State) => state.common.app.loadingAreas
  );
  const userSetting = useSelector((state: State) => state.userSetting);
  const {
    allowTaxAmountChange,
    allowTaxExcludedAmountInput: allowTaxExcludedAmount,
    expTaxRoundingSetting,
    expRoundingSetting,
  } = userSetting;
  const currencyDecimalPlaces =
    props.baseCurrencyDecimal || userSetting.currencyDecimalPlaces;
  const currencyCode = props.baseCurrencyCode || userSetting.currencyCode;
  const currencySymbol = props.baseCurrencySymbol || userSetting.currencySymbol;
  const childExpTypeObj = useSelector(
    (state: State) => state.entities.exp.expenseType.childList
  );
  const taxTypeObj = useSelector(
    (state: State) => state.ui.expenses.recordItemPane.tax
  );
  const isItemizationLoading = useSelector(
    (state: State) => state.common.exp.ui.itemizationLoading
  );
  const loadingAreaList = useSelector(
    (state: State) => state.common.app.loadingAreas
  );

  const [expTypeOptionList, setExpTypeOptionLst] =
    useState<ExpTypeOptionList | null>([]);

  const { expRecord, updateRecord } = props;
  const {
    amountInputMode,
    items,
    recordDate: parentRecordDate,
    withholdingTaxUsage,
  } = expRecord;
  const {
    currencyId: parentCurrencyId,
    currencyInfo: parentCurrencyInfo,
    exchangeRate: parentExchangeRate,
    expTypeId: parentExpTypeId,
    taxItems,
    taxRate: parentTaxRate,
    taxTypeBaseId: parentTaxTypeBaseId,
    taxTypeHistoryId: parentTaxTypeHistoryId,
    taxTypeName: parentTaxTypeName,
    exchangeRateManual: parentExchangeRateManual,
    useForeignCurrency,
  } = items[0];

  const isTaxIncluded = amountInputMode === AmountInputMode.TaxIncluded;
  const isMultipleTax = taxItems?.length > 0;
  const childExpTypeList = get(
    childExpTypeObj,
    `${parentExpTypeId}.${parentRecordDate}`
  );
  // indicates that parent date has changed
  const isParentDateChanged =
    loadingAreaList.includes(taxSelectField) ||
    loadingAreaList.includes(exchangeRateField);
  const isParentRateFieldLoading = isLoading && isParentDateChanged;

  useEffect(() => {
    dispatch(itemizationLoadingActions.toggle(true));

    if (!isParentRateFieldLoading) {
      let expTypePromise = childExpTypeList;
      if (!expTypePromise && parentRecordDate) {
        expTypePromise = dispatch(
          searchExpTypesByParentRecord(parentRecordDate, parentExpTypeId, true)
        );
      }

      const [_, ...childItemList] = items;
      const ratePromise = useForeignCurrency
        ? []
        : dispatch(
            searchChildItemTaxTypeList(childItemList, parentRecordDate, true)
          );

      Promise.all([expTypePromise, ratePromise])
        .then(([expTypeList = []]) => {
          const optionList = buildExpTypeOptionList(expTypeList);
          setExpTypeOptionLst(optionList);
        })
        .finally(() => {
          dispatch(itemizationLoadingActions.toggle(false));
        });
    }
  }, [parentRecordDate]);

  const onClickAddBtn = () => {
    const date = items[items.length - 1].recordDate || parentRecordDate;
    const newItem = newRecordItem(
      '',
      '',
      useForeignCurrency,
      null,
      true,
      '',
      '',
      0,
      date
    );

    const currencyExchangeRateInfo = useForeignCurrency
      ? getCurrencyAndExchangeRate()
      : {};
    const updatedItem = {
      ...newItem,
      ...currencyExchangeRateInfo,
      tempUUID: uuidV4(),
    };
    const newItemList = [...items, updatedItem];
    updateRecord({
      items: newItemList,
    });
  };

  const onChangeLocalAmount = (localAmount: number, itemIdx: number) => {
    const { exchangeRate } = items[itemIdx];

    const amount = calcAmountFromRate(
      exchangeRate,
      localAmount,
      currencyDecimalPlaces,
      expRoundingSetting
    );

    updateRecord({
      [`items.${itemIdx}.localAmount`]: localAmount,
      [`items.${itemIdx}.amount`]: amount,
    });
  };

  const calculateAndUpdateAmount = (
    isTaxIncluded: boolean,
    itemIdx: number,
    taxType?: ExpTaxType,
    parentAmountInput?: number
  ) => {
    const { amount, withholdingTaxAmount, withoutTax } = items[itemIdx];
    const isParentItem = itemIdx === 0;
    const defaultBaseId = isParentItem ? parentTaxTypeBaseId : '';
    const defaultHistoryId = isParentItem ? parentTaxTypeHistoryId : '';
    const defaultName = isParentItem ? parentTaxTypeName : '';
    const defaultRate = isParentItem ? parentTaxRate : 0;
    const {
      baseId = defaultBaseId,
      historyId = defaultHistoryId,
      name = defaultName,
      rate = defaultRate,
    } = taxType || {};
    const targetPath = `items.${itemIdx}`;
    const updateObj = {};

    const finalAmount = !isNil(parentAmountInput)
      ? parentAmountInput
      : isTaxIncluded
      ? amount
      : withoutTax;

    const calcTaxAction = isTaxIncluded
      ? calculateTax
      : calcAmountFromTaxExcluded;
    const taxRes: TaxRes = calcTaxAction(
      rate || 0,
      finalAmount || 0,
      currencyDecimalPlaces,
      expTaxRoundingSetting
    );

    const updatedTaxRateInfo = {
      [`${targetPath}.taxTypeBaseId`]: baseId,
      [`${targetPath}.taxTypeHistoryId`]: historyId,
      [`${targetPath}.taxTypeName`]: name,
      [`${targetPath}.taxRate`]: rate,
    };

    if (isParentItem) {
      const hasWithholdingTax = isUseWithholdingTax(withholdingTaxUsage);
      const amountPayable = hasWithholdingTax
        ? calculateAmountPayable(
            isTaxIncluded ? finalAmount : Number(taxRes.amountWithTax),
            currencyDecimalPlaces,
            withholdingTaxAmount
          )
        : 0;
      Object.assign(updateObj, {
        [`${targetPath}.amountPayable`]: amountPayable,
      });
    }

    Object.assign(updateObj, {
      [`${targetPath}.amount`]:
        (isTaxIncluded ? finalAmount : taxRes.amountWithTax) || 0,
      [`${targetPath}.withoutTax`]:
        (isTaxIncluded ? taxRes.amountWithoutTax : finalAmount) || 0,
      [`${targetPath}.gstVat`]: taxRes.gstVat,
      [`${targetPath}.taxManual`]: false,
      ...updatedTaxRateInfo,
    });
    updateRecord(updateObj);
  };

  const searchTaxTypeAndCalculate = async (
    expTypeId: string,
    itemIdx: number
  ) => {
    const taxTypeRes = await dispatch(
      searchTaxTypeList(expTypeId, parentRecordDate)
    );
    const childTaxTypeList = get(
      taxTypeRes,
      `payload.${expTypeId}.${parentRecordDate}`,
      []
    ) as ExpTaxType[];
    const taxTypeList = getTaxTypeList(
      childTaxTypeList,
      parentTaxTypeBaseId,
      taxItems
    );
    const defaultTaxType = get(taxTypeList, '0', {});
    calculateAndUpdateAmount(isTaxIncluded, itemIdx, defaultTaxType);
  };

  const getCurrencyAndExchangeRate = () => {
    const currencyObj = {
      currencyId: parentCurrencyId,
      currencyInfo: parentCurrencyInfo,
    };
    return {
      ...currencyObj,
      ...calculateAmountFromExchangeRate(
        currencyDecimalPlaces,
        expRoundingSetting,
        0,
        parentExchangeRate,
        parentExchangeRateManual
      ),
    };
  };

  const compProps = {
    ...props,
    allowTaxAmountChange,
    allowTaxExcludedAmount,
    childExpTypeList,
    currencyCode,
    currencyDecimalPlaces,
    currencySymbol,
    expTaxRoundingSetting,
    expTypeOptionList,
    isExpenseRequest: true,
    isItemizationLoading: isItemizationLoading || isParentRateFieldLoading,
    isLoading,
    isMultipleTax,
    isTaxIncluded,
    loadingAreas,
    taxTypeObj,
    useForeignCurrency,
    calculateAndUpdateAmount,
    onChangeLocalAmount,
    onClickAddBtn,
    searchTaxTypeAndCalculate,
    baseCurrencyContainer: BaseCurrencyContainer,
    foreignCurrencyContainer: ForeignCurrencyContainer,
    jobCCEISumContainer: JobCCEISumContainer,
  };
  return <ItemizationTab {...compProps} />;
};

export default ItemizationTabContainer;
