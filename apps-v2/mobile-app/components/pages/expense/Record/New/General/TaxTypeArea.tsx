import React from 'react';

import { find, isEmpty } from 'lodash';

import msg from '../../../../../../../commons/languages';
import FormatUtil from '../../../../../../../commons/utils/FormatUtil';
import SelectField from '../../../../../molecules/commons/Fields/SelectField';

import { RoundingType } from '../../../../../../../domain/models/exp/foreign-currency/Currency';
import { Record } from '../../../../../../../domain/models/exp/Record';
import {
  AmountInputMode,
  calcAmountFromTaxExcluded,
  calculateTax, //  calcTaxFromGstVat,
  ExpTaxTypeList,
} from '../../../../../../../domain/models/exp/TaxType';

import './index.scss';

type Props = {
  taxTypeList: ExpTaxTypeList;
  values: Record;
  currencyDecimalPlace: number;
  taxRoundingSetting: RoundingType;
  readOnly: boolean;
  itemIdx?: number;
  onChangeUpdateValues: (arg0: { [key: string]: unknown }) => void;
  setRate: (arg0: number) => any;
  setError: (arg0: string) => string[];
};

export default class TaxTypeArea extends React.Component<Props> {
  onChangeTaxType = (value: any) => {
    const { values, itemIdx } = this.props;
    let historyId;
    let rate = 0;
    let baseId;
    let name;
    if (this.props.taxTypeList.length > 0) {
      const taxType = find(this.props.taxTypeList, { historyId: value });
      if (taxType) {
        historyId = taxType.historyId;
        rate = taxType.rate;
        baseId = taxType.baseId;
        name = taxType.name;
      } else {
        return;
      }
    } else {
      historyId = 'default';
      rate = 0;
      baseId = 'default';
      name = 'default';
    }

    let updatedObj = {
      [`items.${itemIdx}.taxTypeBaseId`]: baseId,
      [`items.${itemIdx}.taxTypeHistoryId`]: historyId,
      [`items.${itemIdx}.taxTypeName`]: name,
      [`items.${itemIdx}.taxRate`]: rate,
    };
    this.props.setRate(rate);

    const isTaxSame = name === values.items[itemIdx].taxTypeName;
    if (isTaxSame) return;

    if (values.amountInputMode === AmountInputMode.TaxIncluded) {
      const { amount } = values.items[itemIdx];
      const taxRes = calculateTax(
        rate,
        amount,
        this.props.currencyDecimalPlace,
        this.props.taxRoundingSetting
      );
      updatedObj = {
        ...updatedObj,
        [`items.${itemIdx}.amount`]: amount,
        [`items.${itemIdx}.withoutTax`]: taxRes.amountWithoutTax,
        [`items.${itemIdx}.gstVat`]: taxRes.gstVat,
        [`items.${itemIdx}.taxManual`]: false,
      };
      if (itemIdx === 0) {
        updatedObj = {
          ...updatedObj,
          amount,
          withoutTax: taxRes.amountWithoutTax,
        };
      }
    } else {
      const { withoutTax } = values.items[itemIdx];
      const taxRes = calcAmountFromTaxExcluded(
        rate,
        withoutTax,
        this.props.currencyDecimalPlace,
        this.props.taxRoundingSetting
      );
      updatedObj = {
        ...updatedObj,
        [`items.${itemIdx}.amount`]: taxRes.amountWithTax,
        [`items.${itemIdx}.withoutTax`]: withoutTax,
        [`items.${itemIdx}.gstVat`]: taxRes.gstVat,
        [`items.${itemIdx}.taxManual`]: false,
      };
      if (itemIdx === 0) {
        updatedObj = {
          ...updatedObj,
          amount: taxRes.amountWithTax,
          withoutTax,
        };
      }
    }

    this.props.onChangeUpdateValues(updatedObj);
  };

  render() {
    const { values, taxTypeList, itemIdx = 0 } = this.props;
    const { expTypeId } = values.items[itemIdx];
    const isDisabledTaxType = isEmpty(expTypeId) || this.props.readOnly;
    const isParentItem = itemIdx === 0;
    const finalTaxTypeList = !expTypeId && !isParentItem ? [] : taxTypeList;
    const taxTypeListOptions = finalTaxTypeList.map((taxType, idx) => {
      const rate = FormatUtil.convertToDisplayingPercent(taxType.rate);
      let label = `${taxType.name} - ${rate}`;
      if (idx === 0) {
        label = `${label} (${msg().Exp_Lbl_Default})`;
      }
      return {
        label,
        value: taxType.historyId,
      };
    });

    if (isParentItem) {
      const historyId = values.items[itemIdx].taxTypeHistoryId;
      const isTaxTypeInList = find(this.props.taxTypeList, { historyId });
      if (!isTaxTypeInList) {
        // if tax type not in the list, show record tax type as default option
        const {
          taxTypeName: recordTaxName,
          taxRate: recordTaxRate,
          taxTypeHistoryId: recordTaxHistoryId,
        } = values.items[itemIdx];
        const rate = FormatUtil.convertToDisplayingPercent(recordTaxRate);
        let label = '';
        if (this.props.readOnly) {
          label = `${recordTaxName || ''} - ${rate}`;
        }
        taxTypeListOptions.unshift({
          label,
          value: recordTaxHistoryId,
        });
      }
    }

    taxTypeList
      .map((taxType) => {
        return {
          label: taxType.name,
          value: taxType.baseId,
        };
      })
      .push();
    return (
      <SelectField
        required
        disabled={isDisabledTaxType}
        label={msg().Exp_Clbl_Gst}
        errors={this.props.setError(`items.${itemIdx}.taxTypeBaseId`)}
        options={taxTypeListOptions}
        onChange={(e: any) => {
          this.onChangeTaxType(e.target.value);
        }}
        value={values.items[itemIdx].taxTypeHistoryId}
      />
    );
  }
}
