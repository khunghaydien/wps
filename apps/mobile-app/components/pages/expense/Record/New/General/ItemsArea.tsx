import React from 'react';

import drop from 'lodash/drop';
import get from 'lodash/get';

import msg from '@apps/commons/languages';
import TextUtil from '@commons/utils/TextUtil';

import {
  calcItemsTotalAmount,
  isAmountMatch,
  Record,
} from '@apps/domain/models/exp/Record';
import { AmountInputMode } from '@apps/domain/models/exp/TaxType';

import ChildItems from '@apps/mobile-app/components/molecules/expense/ChildItems';
import Label from '@mobile/components/atoms/Label';
import TextButton from '@mobile/components/atoms/TextButton';

import './ItemsArea.scss';

const ROOT = 'mobile-app-pages-expense-page-record-new-general-items-area';

export type Props = {
  values: Record;
  readOnly: boolean;
  currencyDecimalPlace: number;
  currencySymbol: string;
  hasChildItems: boolean;
  onClickAddItem: (values: Record) => void;
  onClickChildItem: (idx: number, values: Record) => void;
};

const ItemsArea = (props: Props) => {
  const { values, hasChildItems } = props;

  const parentItem = values.items[0];
  const useForeignCurrency = parentItem.useForeignCurrency;
  const decimalPlaces = useForeignCurrency
    ? get(parentItem, 'currencyInfo.decimalPlaces', 0)
    : props.currencyDecimalPlace;
  const isTaxIncluded = values.amountInputMode === AmountInputMode.TaxIncluded;
  const key =
    (useForeignCurrency && 'localAmount') ||
    (isTaxIncluded && 'amount') ||
    'withoutTax';
  const childItems = drop(values.items);
  const childTotalAmount = calcItemsTotalAmount(childItems, key, decimalPlaces);
  const parentAmount =
    (useForeignCurrency && parentItem.localAmount) ||
    (isTaxIncluded && parentItem.amount) ||
    parentItem.withoutTax;
  const isMatch = isAmountMatch(childTotalAmount, parentAmount);

  const amountErrorMsg = useForeignCurrency
    ? msg().Exp_Msg_LocalAmountMismatchItems
    : msg().Exp_Msg_TotalAmountMismatchItems;

  return (
    <div className={ROOT}>
      <Label
        className={`${ROOT}__label`}
        text={msg().Exp_Lbl_RecordItems}
        marked
      />

      {hasChildItems && !isMatch && (
        <div className={`${ROOT}__feedback`}>{amountErrorMsg}</div>
      )}

      {!hasChildItems && (
        <div className={`${ROOT}__feedback`}>
          {TextUtil.template(
            msg().Exp_Msg_RecordItemsMandatory,
            values.items[0].expTypeName
          )}
        </div>
      )}

      <ChildItems
        items={props.values.items}
        currencyDecimalPlaces={props.currencyDecimalPlace}
        currencySymbol={props.currencySymbol}
        onClickChildItem={(index) =>
          props.onClickChildItem(index, props.values)
        }
        isClickable={!props.readOnly}
      />

      {!props.readOnly && (
        <TextButton onClick={props.onClickAddItem} className={`${ROOT}__add`}>
          {msg().Exp_Btn_AddNewItem}
        </TextButton>
      )}
    </div>
  );
};

export default ItemsArea;
