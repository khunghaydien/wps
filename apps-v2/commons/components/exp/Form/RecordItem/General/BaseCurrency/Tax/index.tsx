import React from 'react';

import _ from 'lodash';

import { calculateTotalAmountForItems } from '@commons/utils/exp/ItemizationUtil';

import { CustomHint } from '@apps/domain/models/exp/CustomHint';
import { Record as TypeRecord } from '@apps/domain/models/exp/Record';
import { ExpTaxTypeList } from '@apps/domain/models/exp/TaxType';

import MultiColumnsGrid from '../../../../../../MultiColumnsGrid';
import { RecordErrors } from '../../..';
import GstVatArea from './GstVatArea';
import TaxRateArea from './TaxRateArea';

type Props = {
  allowNegativeAmount?: boolean;
  allowTaxAmountChange: boolean;
  allowTaxExcludedAmount: boolean;
  baseCurrencyDecimal: number;
  baseCurrencySymbol: string;
  classNameGstVat?: string;
  classNameTaxRate?: string;
  customHint?: CustomHint;
  errors: RecordErrors;
  expRecord: TypeRecord;
  expenseTaxTypeList: ExpTaxTypeList;
  isFixedAllowance: boolean;
  isHideTaxType: boolean;
  isLoading: boolean;
  isParentChildItems: boolean;
  isTaxExcludedMode: boolean;
  loadingAreas: string[];
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
    const {
      errors,
      expRecord,
      classNameGstVat,
      classNameTaxRate,
      expenseTaxTypeList,
      recordItemIdx,
      isHideTaxType,
      isLoading,
      isTaxExcludedMode,
      loadingAreas,
      allowNegativeAmount,
      isParentChildItems,
      baseCurrencyDecimal,
    } = this.props;
    const readOnly = this.props.readOnly || expenseTaxTypeList.length === 0;
    const gridSize = isHideTaxType ? [12] : [6, 6];
    const gridAlignment = isHideTaxType ? ['top'] : ['top', 'top'];

    const childItemTotalTaxAmount = isParentChildItems
      ? calculateTotalAmountForItems(
          baseCurrencyDecimal,
          expRecord,
          false,
          'gstVat'
        )
      : 0;

    return (
      <div>
        <MultiColumnsGrid sizeList={gridSize} alignments={gridAlignment}>
          {!isHideTaxType && (
            <TaxRateArea
              readOnly={this.props.readOnly}
              expRecordItem={expRecord.items[recordItemIdx]}
              className={classNameTaxRate}
              recordItemIdx={recordItemIdx}
              expenseTaxTypeList={expenseTaxTypeList}
              isTaxIncluded={!isTaxExcludedMode}
              onChangeAmountOrTaxType={this.props.onChangeAmountOrTaxType}
              errors={errors}
              isLoading={isLoading}
              loadingAreas={loadingAreas}
              isLoaderOverride
              isDotLoader
            />
          )}
          <GstVatArea
            readOnly={readOnly}
            expRecordItem={expRecord.items[recordItemIdx]}
            className={classNameGstVat}
            baseCurrencySymbol={this.props.baseCurrencySymbol}
            baseCurrencyDecimal={this.props.baseCurrencyDecimal}
            calcTaxFromGstVat={this.props.calcTaxFromGstVat}
            allowTaxAmountChange={this.props.allowTaxAmountChange}
            onClickEditButton={this.props.onClickEditButton}
            hintMsg={this.props.customHint.recordGstAmount}
            allowNegativeAmount={allowNegativeAmount}
            isParentChildItems={isParentChildItems}
            childItemTotalTaxAmount={childItemTotalTaxAmount}
          />
        </MultiColumnsGrid>
      </div>
    );
  }
}
