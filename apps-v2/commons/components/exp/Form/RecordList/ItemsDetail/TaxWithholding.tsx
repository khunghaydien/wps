import React, { FunctionComponent } from 'react';

import get from 'lodash/get';

import Grid from '@commons/components/Grid';
import msg from '@commons/languages';
import FormatUtil from '@commons/utils/FormatUtil';

import { Record } from '@apps/domain/models/exp/Record';

import './index.scss';

type Props = {
  baseCurrencyDecimal: number;
  baseCurrencySymbol: string;
  record: Record;
};

const DETAIL_ROOT = 'ts-expenses__form-records__list-items-detail';
const ROOT = `${DETAIL_ROOT}__tax-withholding`;

const TaxWithholding: FunctionComponent<Props> = ({
  baseCurrencyDecimal,
  baseCurrencySymbol,
  record,
}) => {
  const formatAmount = (amount: number) =>
    `${baseCurrencySymbol} ${
      FormatUtil.formatNumber(amount, baseCurrencyDecimal) || 0
    }`;

  const recordItem = get(record, 'items[0]', {});
  const {
    amount,
    amountPayable,
    gstVat,
    taxTypeName,
    withholdingTaxAmount,
    withoutTax,
  } = recordItem;

  const data = [
    {
      label: msg().Exp_Clbl_WithoutTax,
      value: formatAmount(withoutTax),
    },
    {
      label: msg().Exp_Clbl_GstAmount,
      value: (
        <div className={`${ROOT}__gst`}>
          {formatAmount(gstVat)}
          <div className={`${ROOT}__tax-type`}>{taxTypeName}</div>
        </div>
      ),
    },
    {
      label: msg().Exp_Clbl_Amount,
      value: formatAmount(amount),
    },
    {
      label: msg().Exp_Clbl_WithholdingTaxAmount,
      value: formatAmount(withholdingTaxAmount),
    },
    {
      label: msg().Exp_Clbl_AmountPayable,
      value: formatAmount(amountPayable),
    },
  ];

  const columns = [
    {
      grow: false,
      key: 'label',
      name: msg().Exp_Lbl_WithholdingTaxBreakdownDescription,
      shrink: false,
      width: 300,
    },
    {
      grow: false,
      key: 'value',
      name: msg().Exp_Lbl_Amount,
      shrink: false,
      width: 100,
    },
  ];

  return (
    <div className={DETAIL_ROOT}>
      <Grid
        data={data}
        idKey="itemId"
        columns={columns}
        selected={[]}
        browseId=""
        onClickRow={() => {}}
        onChangeRowSelection={() => {}}
        emptyMessage=""
      />
    </div>
  );
};

export default TaxWithholding;
