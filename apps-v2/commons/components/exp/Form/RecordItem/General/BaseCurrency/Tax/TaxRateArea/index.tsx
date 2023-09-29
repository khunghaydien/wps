import React from 'react';

import classNames from 'classnames';
import _ from 'lodash';

import TextField from '@apps/commons/components/fields/TextField';

import { RecordItem } from '../../../../../../../../../domain/models/exp/Record';
import {
  ExpTaxTypeList,
  taxSelectField,
} from '../../../../../../../../../domain/models/exp/TaxType';

import FormatUtil from '../../../../../../../../utils/FormatUtil';

import msg from '../../../../../../../../languages';
import withLoadingHOC from '../../../../../../../withLoading';
import { RecordErrors } from '../../../..';

const ROOT = 'ts-expenses-taxRateArea';

type Props = {
  className?: string;
  errors: RecordErrors;
  expRecordItem: RecordItem;
  expenseTaxTypeList: ExpTaxTypeList;
  isLoading: boolean;
  isTaxIncluded: boolean;
  readOnly: boolean;
  recordItemIdx: number;
  onChangeAmountOrTaxType: (
    amount: number,
    isTaxIncluded: boolean,
    baseId?: string,
    taxName?: string
  ) => void;
};
class TaxRateArea extends React.Component<Props> {
  static displayName = taxSelectField;
  renderTaxRateSelect() {
    const { isTaxIncluded, expRecordItem } = this.props;
    const taxTypeList = this.props.expenseTaxTypeList.map((tax) => {
      const label = FormatUtil.convertToDisplayingPercent(tax.rate);
      return { ...tax, label };
    });

    const selectTypeList = taxTypeList.map((item, idx) => {
      let text = `${item.name} - ${item.label}`;
      if (idx === 0) {
        text = `${text}(${msg().Exp_Lbl_Default})`;
      }
      return (
        <option
          key={item.baseId}
          // @ts-ignore
          baseid={item.baseId}
          name={item.name}
          value={idx}
        >
          {text}
        </option>
      );
    });
    const emptyOption = <option disabled hidden value="-1" />;
    selectTypeList.unshift(emptyOption);

    const historyId = expRecordItem.taxTypeHistoryId;
    let selectedValue = 0;
    if (historyId) {
      selectedValue = _.findIndex(taxTypeList, {
        historyId,
      });
    }
    const amount = isTaxIncluded
      ? expRecordItem.amount
      : expRecordItem.withoutTax;
    return (
      <select
        className="slds-select ts-select"
        data-testid={ROOT}
        value={selectedValue}
        onChange={(event) =>
          this.props.onChangeAmountOrTaxType(
            amount,
            isTaxIncluded,
            event.target.selectedOptions[0].getAttribute('baseId'),
            event.target.selectedOptions[0].getAttribute('name')
          )
        }
        disabled={this.props.readOnly || this.props.isLoading}
      >
        {selectTypeList}
      </select>
    );
  }

  render() {
    const { errors, recordItemIdx = 0, expRecordItem, className } = this.props;

    const historyIdError = _.get(
      errors,
      `items.${recordItemIdx}.taxTypeHistoryId`
    );

    const { taxRate: taxRateFromRecord, taxTypeName } = expRecordItem;
    const taxRateFromTaxTypeList = this.props.expenseTaxTypeList.find(
      ({ historyId }) => historyId === expRecordItem.taxTypeHistoryId
    );

    const rate = _.isNil(taxRateFromRecord)
      ? _.get(taxRateFromTaxTypeList, 'rate', 0)
      : taxRateFromRecord;
    const taxName = _.isEmpty(taxTypeName)
      ? _.get(taxRateFromTaxTypeList, 'name', '')
      : taxTypeName;

    const taxNameDisplay = (
      <TextField
        value={`${taxName} - ${FormatUtil.convertToDisplayingPercent(rate)}`}
        disabled
        readOnlyClassName={className}
      />
    );

    const taxRateAreaClass = classNames('value', className, {
      'ts-text-field-container': this.props.readOnly,
    });

    return (
      <div className={`${ROOT}`}>
        <div className="key">{msg().Exp_Clbl_Gst}</div>
        <div className={taxRateAreaClass}>
          {this.props.readOnly ? taxNameDisplay : this.renderTaxRateSelect()}
        </div>
        {historyIdError && (
          <div className="input-feedback">{msg()[historyIdError]}</div>
        )}
      </div>
    );
  }
}

export default withLoadingHOC(TaxRateArea);
