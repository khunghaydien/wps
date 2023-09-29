import * as React from 'react';

import classNames from 'classnames';
import find from 'lodash/find';
import get from 'lodash/get';
import isEmpty from 'lodash/isEmpty';
import isNil from 'lodash/isNil';

import Highlight from '@apps/commons/components/exp/Highlight';

import {
  EISearchObj,
  ExtendedItem,
  ExtendItemInfo,
  getExtendedItemArray,
} from '../../../../../../../domain/models/exp/ExtendedItem';
import { Report } from '../../../../../../../domain/models/exp/Report';

import msg from '../../../../../../languages';
import Button from '../../../../../buttons/Button';
import DateField from '../../../../../fields/DateField';
import LabelWithHint from '../../../../../fields/LabelWithHint';
import SelectField from '../../../../../fields/SelectField';
import TextAreaField from '../../../../../fields/TextAreaField';
import IconButton from '../../../../Icon/IconButton';

const ROOT = 'ts-expenses__form-report-summary__form';

type Props = {
  errors: any;
  expPreRequest?: Report;
  expReport: Report;
  isHighlightDiff?: boolean;
  readOnly: boolean;
  touched: any;
  onChangeEditingExpReport: (arg0: string, arg1: any, arg2: any) => void;
  onClickLookupEISearch: (item: EISearchObj) => void;
};

export default class ReportExtendedItems extends React.Component<Props> {
  onChangeSelectField(
    e: React.ChangeEvent<HTMLSelectElement>,
    targetIndex: string
  ) {
    this.props.onChangeEditingExpReport(
      `report.extendedItemPicklist${targetIndex}Value`,
      e.target.value,
      true
    );
  }

  removeEILookup(targetIndex: string) {
    const field = `report.extendedItemLookup${targetIndex}Value`;
    this.props.onChangeEditingExpReport(field, null, true);
  }

  getExtendedItemTitle = (
    items: Report
  ): Array<{ id: string; text: string }> => {
    const result = [];
    const prefix = 'extendedItem';
    for (const key in items) {
      const isExtendedItemId = items[key] && /^extendedItem.*Id$/.test(key);
      if (isExtendedItemId) {
        result.push({
          id: items[key],
          text: key.replace(prefix, '').slice(0, -2),
        });
      }
    }
    result.sort((a, b) => a.id.localeCompare(b.id));
    return result;
  };

  handleExtendedItemChange(
    e: React.ChangeEvent<HTMLInputElement>,
    targetIndex: string
  ) {
    this.props.onChangeEditingExpReport(
      `report.extendedItemText${targetIndex}Value`,
      e.target.value,
      true
    );
  }

  handleExtendedItemDateChange(value: string, targetIndex: string) {
    this.props.onChangeEditingExpReport(
      `report.extendedItemDate${targetIndex}Value`,
      value,
      true
    );
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

  isHighlight = (preItem: ExtendedItem, value: string | number): boolean => {
    const { isHighlightDiff } = this.props;
    if (isHighlightDiff) {
      if (!isNil(preItem)) {
        return preItem.value !== value;
      } else {
        return !!value;
      }
    }
    return false;
  };

  renderLabel(info?: ExtendItemInfo) {
    const text = (info && info.name) || '';
    const hintMsg = (!this.props.readOnly && info && info.description) || '';
    const isRequired = (info && info.isRequired) || false;
    return (
      <LabelWithHint text={text} hintMsg={hintMsg} isRequired={isRequired} />
    );
  }

  renderExtendedItem = (
    extendedItem: ExtendedItem,
    preExtendedItems: Array<ExtendedItem>,
    idx: number,
    readOnly: boolean
  ): React.ReactNode => {
    const targetIndex = extendedItem.index;
    const type = extendedItem.info ? extendedItem.info.inputType : '';
    const extendedItemError = get(
      this.props.errors,
      `extendedItem${type}${targetIndex}Value`
    );
    const isExtendedItemTouched = get(
      this.props.touched,
      `extendedItem${type}${targetIndex}Value`
    );
    // diff view
    const preExtendedItem = preExtendedItems.find(
      (record) => record.id === extendedItem.id
    );
    const isHighlight = this.isHighlight(preExtendedItem, extendedItem.value);

    return (
      <div
        key={extendedItem.id}
        className="slds-col slds-size--4-of-12 ts-align-middle ts-ext-item-spacing"
      >
        <div className="ts-text-field-container">
          {this.renderLabel(extendedItem.info)}
          {type === 'Text' && (
            <TextAreaField
              value={extendedItem.value || ''}
              resize="none"
              autosize
              minRows={1}
              maxRows={2}
              onChange={(e) => this.handleExtendedItemChange(e, targetIndex)}
              disabled={readOnly}
              data-testid={`${ROOT}__text-${idx}`}
              className={classNames({ 'highlight-bg': isHighlight })}
            />
          )}
          {type === 'Picklist' && (
            <SelectField
              className={classNames('ts-select-input', {
                'highlight-bg': isHighlight,
              })}
              onChange={(e) => this.onChangeSelectField(e, targetIndex)}
              id={`${ROOT}-extendedItems-${extendedItem.index}`}
              options={this.buildOptionList(
                extendedItem.info && extendedItem.info.picklist
              )}
              value={extendedItem.value || ''}
              disabled={readOnly}
              data-testid={`${ROOT}__select-${idx}`}
            />
          )}
          {type === 'Lookup' && (
            <div
              className={`${ROOT}__ei-lookup-input`}
              data-testid={`${ROOT}-lookup-${idx}`}
            >
              <Highlight highlight={isHighlight}>
                {extendedItem.value ? (
                  <div className={`${ROOT}__ei-lookup-input-field`}>
                    <span>{`${extendedItem.value} - ${
                      extendedItem.name || ''
                    }`}</span>

                    {!readOnly && (
                      <IconButton
                        icon="close-copy"
                        size="small"
                        className={`${ROOT}__ei-lookup-input-btn--clear`}
                        onClick={() => this.removeEILookup(targetIndex)}
                        disabled={readOnly}
                      />
                    )}
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
                        target: 'REPORT',
                        hintMsg: extendedItem.info.description,
                      })
                    }
                    disabled={readOnly}
                  >
                    {msg().Com_Lbl_Select}
                  </Button>
                )}
              </Highlight>
            </div>
          )}
          {type === 'Date' && (
            <DateField
              className={classNames(`${ROOT}__ei-date`, {
                'highlight-bg': isHighlight,
              })}
              data-testid={`${ROOT}__ei-date-${idx}`}
              disabled={readOnly}
              onChange={(value) => {
                this.handleExtendedItemDateChange(value, targetIndex);
              }}
              value={extendedItem.value || ''}
            />
          )}
          {extendedItemError && isExtendedItemTouched && (
            <div className="value">
              <div className="input-feedback">{msg()[extendedItemError]}</div>
            </div>
          )}
        </div>
      </div>
    );
  };

  render() {
    const { expReport, expPreRequest, readOnly } = this.props;
    const extendedItems = getExtendedItemArray(expReport);
    const preExtendedItems = expPreRequest
      ? getExtendedItemArray(expPreRequest)
      : [];

    const extendedItemsWithID = extendedItems.filter((i) => i.id);
    const extendedItemTitles = this.getExtendedItemTitle(expReport);
    const layout = expReport.fieldCustomLayout;
    const hasCustomLayout = !isEmpty(layout);
    const extendedItemsWithLayout = [];
    if (hasCustomLayout) {
      for (const i in layout) {
        const row = [];
        for (const j in layout[i]) {
          const item = find(extendedItemTitles, { text: layout[i][j] });
          const id = item ? item.id : null;
          if (id) {
            const extendedItem = find(extendedItemsWithID, { id });
            row.push(extendedItem);
          }
        }
        if (row.length) {
          extendedItemsWithLayout.push(row);
        }
      }
    }
    if (!extendedItemsWithID.length) {
      return null;
    }

    return (
      <>
        {hasCustomLayout ? (
          <div className={ROOT}>
            {extendedItemsWithLayout.map((itemRow: Array<ExtendedItem>) => {
              return (
                <div className={`slds-grid slds-wrap extended-item-row`}>
                  {itemRow.map(
                    (extendedItem: ExtendedItem, idx): React.ReactNode =>
                      this.renderExtendedItem(
                        extendedItem,
                        preExtendedItems,
                        idx,
                        readOnly
                      )
                  )}
                </div>
              );
            })}
          </div>
        ) : (
          <div className={`${ROOT} slds-grid slds-wrap`}>
            {extendedItemsWithID.map(
              (extendedItem: ExtendedItem, idx): React.ReactNode =>
                this.renderExtendedItem(
                  extendedItem,
                  preExtendedItems,
                  idx,
                  readOnly
                )
            )}
          </div>
        )}
      </>
    );
  }
}
