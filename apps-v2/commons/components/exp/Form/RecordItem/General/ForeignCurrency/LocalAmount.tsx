import React from 'react';

import classNames from 'classnames';
import get from 'lodash/get';
import isNil from 'lodash/isNil';

import Warning from '@commons/components/exp/Warning';
import AmountField from '@commons/components/fields/AmountField';
import LabelWithHint from '@commons/components/fields/LabelWithHint';
import Tooltip from '@commons/components/Tooltip';
import ImgIconAttention from '@commons/images/icons/attention.svg';
import msg from '@commons/languages';
import { calculateTotalAmountForItems } from '@commons/utils/exp/ItemizationUtil';
import FormatUtil from '@commons/utils/FormatUtil';
import TextUtil from '@commons/utils/TextUtil';

import {
  isAmountMatch,
  Record,
  RecordItem,
} from '@apps/domain/models/exp/Record';

import { RecordErrors } from '../..';

import './LocalAmount.scss';

type Props = {
  currencySymbol: string;
  customHintStr: string;
  errors: RecordErrors;
  fixedAmountMessage: string;
  isFixedAllowance: boolean;
  isHighlightDiff: boolean;
  isHighlightNewRecord: boolean;
  isItemizedParent?: boolean;
  item: RecordItem;
  itemIdx: number;
  preItem: RecordItem;
  readOnly: boolean;
  record?: Record;
  onChangeAmountField: (value: number) => void;
};

const ROOT = 'ts-expenses-requests__contents__local-amount';

const LocalAmount = ({
  currencySymbol,
  customHintStr,
  errors,
  fixedAmountMessage,
  isFixedAllowance,
  isHighlightDiff,
  isHighlightNewRecord,
  isItemizedParent,
  item,
  itemIdx,
  preItem,
  readOnly,
  record,
  onChangeAmountField,
}: Props) => {
  const { allowNegativeAmount = false, localAmount = 0 } = item;
  const { localAmount: preLocalAmount } = preItem;

  const isDifferent = localAmount !== preLocalAmount;
  const isHighlight = isHighlightDiff && (isHighlightNewRecord || isDifferent);
  const isNegative = !isNil(localAmount) && localAmount < 0;
  const isParentItem = itemIdx === 0;
  const negativeAmountError = get(errors, `items.${itemIdx}.localAmount`);

  const childItemTotalAmount = isItemizedParent
    ? calculateTotalAmountForItems(
        item.currencyInfo.decimalPlaces,
        record,
        true
      )
    : 0;
  const isTotalAmountMatch = isAmountMatch(localAmount, childItemTotalAmount);

  const amountField = (
    <>
      <AmountField
        className={classNames(
          readOnly
            ? 'input_right-aligned input_disabled_no-border input_disabled_no-background'
            : 'input_right-aligned',
          {
            'highlight-bg': isHighlight,
          }
        )}
        data-testid={`${ROOT}__amount`}
        disabled={readOnly || isFixedAllowance}
        fractionDigits={item.currencyInfo ? item.currencyInfo.decimalPlaces : 0}
        value={localAmount}
        onBlur={(value: number | null) => {
          if (value !== null && value !== localAmount) {
            onChangeAmountField(value);
          }
        }}
        allowNegative={allowNegativeAmount}
      />
      {isNegative &&
        !allowNegativeAmount &&
        negativeAmountError &&
        isParentItem && (
          <div className="input-feedback">{msg()[negativeAmountError]}</div>
        )}
      {isNegative && allowNegativeAmount && isParentItem && (
        <div className={`${ROOT}__negative-warning`}>
          <ImgIconAttention className={`${ROOT}__negative-warning-svg`} />
          <span className={`${ROOT}__negative-warning-msg`}>
            {TextUtil.template(
              msg().Exp_Lbl_NegativeAmount,
              msg().Exp_Clbl_LocalAmount
            )}
          </span>
        </div>
      )}
      {isItemizedParent && !isTotalAmountMatch && (
        <Warning
          message={TextUtil.template(
            msg().Exp_Msg_LocalAmountOfItemizationDoNotAddUpToTotal,
            `${currencySymbol || ''}${FormatUtil.formatNumber(
              childItemTotalAmount,
              item.currencyInfo?.decimalPlaces || 0
            )}`
          )}
        />
      )}
    </>
  );

  return (
    <div className={ROOT}>
      <div className="ts-text-field-container">
        <LabelWithHint
          text={`${msg().Exp_Clbl_LocalAmount}${
            currencySymbol ? ` (${currencySymbol})` : ''
          }`}
          hintMsg={customHintStr}
        />
        {(isFixedAllowance && !readOnly && (
          <Tooltip id={ROOT} align="top" content={fixedAmountMessage}>
            <div>{amountField}</div>
          </Tooltip>
        )) ||
          amountField}
      </div>
    </div>
  );
};

export default LocalAmount;
