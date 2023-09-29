import React from 'react';

import _ from 'lodash';

import { isCCRecord, Record } from '@apps/domain/models/exp/Record';
import { ExpTaxTypeList } from '@apps/domain/models/exp/TaxType';

import MultiColumnsGrid from '../../../../../../MultiColumnsGrid';
import AmountWithoutTaxArea from './AmountWithoutTaxArea';
import GstVatArea from './GstVatArea';

type Props = {
  allowTaxAmountChange: boolean;
  allowTaxExcludedAmount: boolean;
  baseCurrencyDecimal: number;
  baseCurrencySymbol: string;
  expRecord: Record;
  expenseTaxTypeList: ExpTaxTypeList;
  isFinanceApproval?: boolean;
  isFixedAllowance: boolean;
  isItemized: boolean;
  readOnly: boolean;
  recordItemIdx: number;
  calcTaxFromGstVat: (arg0: number) => void;
  onChangeAmountOrTaxType: (
    amount: number,
    isTaxIncluded: boolean,
    baseId?: string,
    taxName?: string
  ) => void;
  onClickEditButton: () => void;
  toggleInputMode: () => void;
};

export default class Tax extends React.Component<Props> {
  render() {
    const { expRecord, expenseTaxTypeList, recordItemIdx, isItemized } =
      this.props;
    const readOnly = this.props.readOnly || expenseTaxTypeList.length === 0;
    return (
      <div>
        <MultiColumnsGrid sizeList={[6, 6]} alignments={['top', 'top']}>
          <AmountWithoutTaxArea
            readOnly={this.props.readOnly}
            isFinanceApproval={this.props.isFinanceApproval}
            isFixedAllowance={this.props.isFixedAllowance}
            expRecordItem={expRecord.items[recordItemIdx]}
            isRecordCC={isCCRecord(expRecord)}
            recordItemIdx={recordItemIdx}
            baseCurrencySymbol={this.props.baseCurrencySymbol}
            baseCurrencyDecimal={this.props.baseCurrencyDecimal}
            allowTaxExcludedAmount={this.props.allowTaxExcludedAmount}
            inputMode={expRecord.amountInputMode}
            toggleInputMode={this.props.toggleInputMode}
            onChangeAmountOrTaxType={this.props.onChangeAmountOrTaxType}
          />

          <GstVatArea
            readOnly={readOnly || isItemized}
            expRecordItem={expRecord.items[recordItemIdx]}
            baseCurrencySymbol={this.props.baseCurrencySymbol}
            baseCurrencyDecimal={this.props.baseCurrencyDecimal}
            calcTaxFromGstVat={this.props.calcTaxFromGstVat}
            allowTaxAmountChange={this.props.allowTaxAmountChange}
            onClickEditButton={this.props.onClickEditButton}
          />
        </MultiColumnsGrid>
      </div>
    );
  }
}
