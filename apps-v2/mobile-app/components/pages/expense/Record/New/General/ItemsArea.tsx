import React from 'react';

import msg from '@apps/commons/languages';
import TextUtil from '@commons/utils/TextUtil';

import { Record } from '@apps/domain/models/exp/Record';

import Label from '@mobile/components/atoms/Label';
import TextButton from '@mobile/components/atoms/TextButton';
import RecordSummaryListItem from '@mobile/components/molecules/expense/RecordSummaryListItem';

import './ItemsArea.scss';

const ROOT = 'mobile-app-pages-expense-page-record-new-general-items-area';

export type Props = {
  isRequired: boolean;
  values: Record;
  readOnly: boolean;
  currencyDecimalPlace: number;
  currencySymbol: string;
  hasChildItems: boolean;
  navigateToItemizationPage: (idx: number, values: Record) => void;
};

const ItemsArea = (props: Props) => {
  const { isRequired, values, hasChildItems, navigateToItemizationPage } =
    props;

  const [_, ...childItemList] = values.items;

  return (
    <div className={ROOT}>
      <div className={`${ROOT}__label`}>
        <Label text={msg().Exp_Lbl_Itemization} marked={isRequired} />
      </div>

      {!hasChildItems && isRequired && (
        <div className={`${ROOT}__feedback`}>
          {TextUtil.template(
            msg().Exp_Msg_RecordItemsMandatory,
            values.items[0].expTypeName
          )}
        </div>
      )}

      {childItemList.map((item, idx) => (
        <RecordSummaryListItem
          key={item.itemId}
          currencyDecimalPlaces={props.currencyDecimalPlace}
          currencySymbol={props.currencySymbol}
          itemIdx={idx + 1}
          record={values}
          onClick={() => navigateToItemizationPage(idx + 1, values)}
        />
      ))}

      {!props.readOnly && (
        <TextButton
          onClick={() => navigateToItemizationPage(values.items.length, values)}
          className={`${ROOT}__add`}
        >
          {msg().Exp_Btn_AddItemization}
        </TextButton>
      )}
    </div>
  );
};

export default ItemsArea;
