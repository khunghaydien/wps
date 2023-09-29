import * as React from 'react';

import classNames from 'classnames';
import _ from 'lodash';

import {
  EISearchObj,
  ExtendedItem,
  ExtendItemInfo,
  getExtendedItemArray,
} from '../../../../../../domain/models/exp/ExtendedItem';
import { RecordItem } from '../../../../../../domain/models/exp/Record';

import msg from '../../../../../languages';
import Button from '../../../../buttons/Button';
import DateField from '../../../../fields/DateField';
import LabelWithHint from '../../../../fields/LabelWithHint';
import SelectField from '../../../../fields/SelectField';
import TextField from '../../../../fields/TextField';
import Highlight from '../../../Highlight';
import IconButton from '../../../Icon/IconButton';

import './index.scss';

const ROOT = 'ts-expenses__form-record-item-summary';
type Props = {
  errors: { recordDate?: string; records?: Array<any> };
  isHighlightDiff?: boolean;
  isHighlightNewRecord?: boolean;
  isParentItem: boolean;
  preRecordItem?: RecordItem;
  readOnly: boolean;
  recordItem: RecordItem;
  targetRecordItem: string;
  touched: { recordDate?: string; records?: Array<any> };
  onChangeEditingExpReport: (arg0: string, arg1: any) => void;
  onClickLookupEISearch: (item: EISearchObj) => void;
};

export default class ExtendedItems extends React.Component<Props> {
  onChangeSelectField(
    e: React.ChangeEvent<HTMLSelectElement>,
    targetIndex: string
  ) {
    this.props.onChangeEditingExpReport(
      `${this.props.targetRecordItem}.extendedItemPicklist${targetIndex}Value`,
      e.target.value
    );
  }

  onPressEnter(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Enter') {
      e.preventDefault();
    }
  }

  removeEILookup(targetIndex: string) {
    const field = `${this.props.targetRecordItem}.extendedItemLookup${targetIndex}Value`;
    this.props.onChangeEditingExpReport(field, null);
  }

  buildOptionList(picklist: any) {
    const optionList = picklist.map((pick) => {
      return {
        value: pick.value || '',
        text: pick.label,
      };
    });
    return [{ value: '', text: msg().Exp_Lbl_PleaseSelect }, ...optionList];
  }

  handleExtendedItemChange(
    e: React.ChangeEvent<HTMLInputElement>,
    targetIndex: string
  ) {
    this.props.onChangeEditingExpReport(
      `${this.props.targetRecordItem}.extendedItemText${targetIndex}Value`,
      e.target.value
    );
  }

  handleExtendedItemDateChange(value: string, targetIndex: string) {
    this.props.onChangeEditingExpReport(
      `${this.props.targetRecordItem}.extendedItemDate${targetIndex}Value`,
      value
    );
  }

  isHighlight = (preItem: ExtendedItem, value: string | number): boolean => {
    const { isHighlightDiff, isHighlightNewRecord } = this.props;
    if (isHighlightDiff) {
      if (isHighlightNewRecord) return true;

      const preValue = _.get(preItem, 'value');

      // child item's expense type is updated from no use EI to use EI
      const isPrevValueNil = _.isNil(preValue);
      const isValueInvalidOrEmpty = _.isNil(value) || value === '';
      const isStopDiff = isPrevValueNil && isValueInvalidOrEmpty;

      return !isStopDiff && preValue !== value;
    }
    return false;
  };

  renderLabel(info?: ExtendItemInfo) {
    const text = (info && info.name) || '';
    const hintMsg = (!this.props.readOnly && info && info.description) || '';
    const isRequired =
      (info && info.isRequired && this.props.isParentItem) || false;
    return (
      <LabelWithHint text={text} hintMsg={hintMsg} isRequired={isRequired} />
    );
  }

  render() {
    const { recordItem, preRecordItem, readOnly } = this.props;

    const extendedItems = getExtendedItemArray(recordItem, true);
    const preExtendedItems = preRecordItem
      ? getExtendedItemArray(preRecordItem, true)
      : [];

    const extendedItemsWithID = extendedItems.filter((i) => i.id);

    if (!extendedItemsWithID.length) {
      return null;
    }

    return (
      <div className={`${ROOT}`}>
        {extendedItemsWithID.map(
          (extendedItem: ExtendedItem, index: number): React.ReactNode => {
            const targetIndex = extendedItem.index;
            const type = extendedItem.info ? extendedItem.info.inputType : '';
            const extendedItemError = _.get(
              this.props.errors,
              `${this.props.targetRecordItem}.extendedItem${type}${targetIndex}Value`
            );
            const isExtendedItemTouched = _.get(
              this.props.touched,
              `${this.props.targetRecordItem}.extendedItem${type}${targetIndex}Value`
            );
            // diff view
            const preExtendedItem = preExtendedItems.find(
              (record) => record.id === extendedItem.id
            );
            const isHighlight = this.isHighlight(
              preExtendedItem,
              extendedItem.value
            );

            return (
              <div key={Number(index)} className="ts-text-field-container">
                {this.renderLabel(extendedItem.info)}
                {type === 'Text' && (
                  <TextField
                    data-testid={`${ROOT}-text-${index}`}
                    value={extendedItem.value || ''}
                    // @ts-ignore
                    onKeyPress={this.onPressEnter}
                    onChange={(e) =>
                      this.handleExtendedItemChange(e, targetIndex)
                    }
                    disabled={readOnly}
                    className={classNames({ 'highlight-bg': isHighlight })}
                  />
                )}
                {type === 'Picklist' && (
                  <SelectField
                    className={classNames('ts-select-input', {
                      'highlight-bg': isHighlight,
                    })}
                    data-testid={`${ROOT}-select-${index}`}
                    onChange={(e) => this.onChangeSelectField(e, targetIndex)}
                    id={`${ROOT}-extendedItems-${extendedItem.index}`}
                    options={this.buildOptionList(
                      extendedItem.info && extendedItem.info.picklist
                    )}
                    value={extendedItem.value || ''}
                    disabled={readOnly}
                  />
                )}
                {type === 'Lookup' && (
                  <div
                    className={`${ROOT}__ei-lookup-input`}
                    data-testid={`${ROOT}-lookup-${index}`}
                  >
                    {extendedItem.value ? (
                      <div className={`${ROOT}__ei-lookup-input-field`}>
                        <Highlight highlight={isHighlight}>
                          <span>{`${extendedItem.value} - ${
                            extendedItem.name || ''
                          }`}</span>
                        </Highlight>
                        <IconButton
                          icon="close-copy"
                          size="small"
                          className={`${ROOT}__ei-lookup-input-btn--clear`}
                          onClick={() => this.removeEILookup(targetIndex)}
                          disabled={readOnly || !recordItem}
                        />
                      </div>
                    ) : (
                      <Button
                        className={`${ROOT}__ei-lookup-btn--search`}
                        onClick={() =>
                          extendedItem.info &&
                          this.props.onClickLookupEISearch({
                            extendedItemLookupId: extendedItem.id,
                            extendedItemCustomId:
                              extendedItem.info.extendedItemCustomId,
                            name: extendedItem.info.name,
                            idx: targetIndex,
                            target: 'RECORD',
                            hintMsg: extendedItem.info.description,
                          })
                        }
                        disabled={readOnly}
                      >
                        {msg().Com_Lbl_Select}
                      </Button>
                    )}
                  </div>
                )}
                {type === 'Date' && (
                  <DateField
                    className={classNames(
                      `${ROOT}__ei-date ts-date-picker-input`,
                      {
                        'highlight-bg': isHighlight,
                      }
                    )}
                    data-testid={`${ROOT}-date-${index}`}
                    disabled={readOnly}
                    onChange={(value) => {
                      this.handleExtendedItemDateChange(value, targetIndex);
                    }}
                    value={extendedItem.value || ''}
                  />
                )}
                {extendedItemError && isExtendedItemTouched && (
                  <div className="value">
                    <div
                      className="input-feedback"
                      data-testid={`${ROOT}-error-${type}-${index}`}
                    >
                      {msg()[extendedItemError]}
                    </div>
                  </div>
                )}
              </div>
            );
          }
        )}
      </div>
    );
  }
}
