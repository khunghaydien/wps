import React, { useEffect, useRef } from 'react';

import get from 'lodash/get';

import AmountInputField from '@apps/mobile-app/components/molecules/commons/Fields/AmountInputField';
import msg from '@commons/languages';

import { RoundingType } from '../../../../../../../domain/models/exp/foreign-currency/Currency';
import { Record } from '../../../../../../../domain/models/exp/Record';

import './index.scss';

type Props = {
  values: Record;
  currencyDecimalPlace: number;
  taxRoundingSetting: RoundingType;
  readOnly: boolean;
  itemIdx?: number;
  required?: boolean;
  onChangeUpdateValues: (arg0: { [key: string]: unknown }) => void;
  updateAmountFields: (obj?: { [key: string]: any }) => void;
  setError: (arg0: string) => string[];
  getCustomHintProps?: (fieldName: string) => object;
};

const WithholdingTaxArea = (props: Props) => {
  const {
    values,
    setError,
    readOnly,
    currencyDecimalPlace,
    required,
    getCustomHintProps,
  } = props;

  const initialRender = useRef(true);
  useEffect(() => {
    if (initialRender.current) {
      initialRender.current = false;
      return;
    }
    props.updateAmountFields();
  }, [props.values.amount]);

  const onBlur = (withholdingTaxAmount: number) => {
    const { updateAmountFields } = props;
    updateAmountFields({ withholdingTaxAmount });
  };

  const { items } = values;
  const withholdingTaxAmount = get(items, '0.withholdingTaxAmount');
  const amountPayable = get(items, '0.amountPayable');

  return (
    <>
      <AmountInputField
        key={'tax-withholding-field'}
        disabled={readOnly}
        label={msg().Exp_Clbl_WithholdingTaxAmount}
        errors={setError(`items.0.withholdingTaxAmount`)}
        onBlur={onBlur}
        value={withholdingTaxAmount}
        decimalPlaces={currencyDecimalPlace}
        required={required}
        allowNegative
        {...getCustomHintProps('recordWithholdingTaxAmount')}
      />
      <AmountInputField
        key={'payable-amount-field'}
        disabled
        label={msg().Exp_Clbl_AmountPayable}
        errors={setError(`items.0.amountPayable`)}
        value={amountPayable}
        decimalPlaces={currencyDecimalPlace}
        onBlur={() => {}}
      />
    </>
  );
};

export default WithholdingTaxArea;
