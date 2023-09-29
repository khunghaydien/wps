import React from 'react';

import { isEmpty } from 'lodash';

import msg from '../../../../../../../commons/languages';
import DateUtil from '../../../../../../../commons/utils/DateUtil';
import SearchButtonField from '../../../../../molecules/commons/Fields/SearchButtonField';
import SelectField from '../../../../../molecules/commons/Fields/SelectField';
import SFDateField from '../../../../../molecules/commons/Fields/SFDateField';
import TextField from '../../../../../molecules/commons/Fields/TextField';

import {
  ExtendItemInfo,
  getExtendedItemArray,
} from '../../../../../../../domain/models/exp/ExtendedItem';
import {
  Record,
  RecordItem,
} from '../../../../../../../domain/models/exp/Record';

import './index.scss';

const ROOT = 'mobile-app-pages-expense-page-record-new-general-extended-item';

type Props = {
  readOnly: boolean;
  item: RecordItem;
  itemIdx: number;
  setError: (arg0: string) => any;
  onChangeUpdateValues: (arg0: { [key: string]: unknown }) => void;
  onChangeValue: (arg0: any) => any;
  onClickSearchCustomEI: (
    arg0: string,
    arg1: string,
    arg2: string,
    arg3: string
  ) => void;
  saveFormValues: (arg0: Record) => void;
  saveItemValues: (RecordItem) => void;
  record: Record;
  // Custom Hint
  activeHints: Array<string>;
  onClickHint: (arg0: string) => void;
};

export default class ExtendedItem extends React.Component<Props> {
  showExtendedItem = (fieldStart: string) => {
    const valueItems = this.props.item;
    const extVals = [];
    for (let i = 1; i <= 10; i++) {
      const idx = `0${i}`.slice(-2);
      const id = valueItems[`${fieldStart}${idx}Id`];
      const info = valueItems[`${fieldStart}${idx}Info`];
      const selectedOptionName =
        valueItems[`${fieldStart}${idx}SelectedOptionName`];
      if (!isEmpty(id)) {
        extVals.push({ idx, id, info, selectedOptionName });
      }
    }
    return extVals;
  };

  buildOptionList(picklist: any) {
    const optionList = picklist.map((pick) => ({
      value: pick.value || '',
      label: pick.label,
    }));
    return [{ value: '', label: msg().Exp_Lbl_PleaseSelect }, ...optionList];
  }

  getCustomHintforEI = (id: string, info: ExtendItemInfo) => ({
    hintMsg: !this.props.readOnly ? info.description : '',
    isShowHint: this.props.activeHints.includes(id),
    onClickHint: () => this.props.onClickHint(id),
  });

  render() {
    const {
      setError,
      readOnly,
      onChangeValue,
      onChangeUpdateValues,
      itemIdx = 0,
      item,
    } = this.props;

    const isParentItem = itemIdx === 0;

    return (
      <div className={ROOT}>
        {getExtendedItemArray(this.props.item, true)
          .filter((i) => i.id)
          .map(({ id, info, index }) => {
            if (!info) {
              return null;
            }

            let $field;
            const isRequired = isParentItem && info.isRequired;
            switch (info.inputType) {
              case 'Text':
                $field = (
                  <TextField
                    key={id}
                    required={isRequired}
                    disabled={readOnly}
                    label={info.name}
                    errors={setError(
                      `items.${itemIdx}.extendedItemText${index}Value`
                    )}
                    onChange={(e: any) => {
                      const val = e.target.value;
                      onChangeUpdateValues({
                        [`items.${itemIdx}.extendedItemText${index}Value`]: val,
                        [`items.${itemIdx}.extendedItemText${index}Id`]: id,
                      });
                    }}
                    value={item[`extendedItemText${index}Value`] || ''}
                    {...this.getCustomHintforEI(id, info)}
                  />
                );
                break;

              case 'Picklist':
                $field = (
                  <SelectField
                    key={id}
                    disabled={readOnly}
                    errors={setError(
                      `items.${itemIdx}.extendedItemPicklist${index}Value`
                    )}
                    required={isRequired}
                    label={info.name}
                    options={this.buildOptionList(info.picklist)}
                    onChange={onChangeValue(
                      `items.${itemIdx}.extendedItemPicklist${index}Value`
                    )}
                    value={item[`extendedItemPicklist${index}Value`] || ''}
                    {...this.getCustomHintforEI(id, info)}
                  />
                );
                break;

              case 'Lookup':
                $field = (
                  <SearchButtonField
                    placeholder={msg().Admin_Lbl_Search}
                    disabled={readOnly}
                    required={isRequired}
                    errors={setError(
                      `items.${itemIdx}.extendedItemLookup${index}Value`
                    )}
                    onClick={() => {
                      if (this.props.itemIdx) {
                        this.props.saveItemValues(item);
                      } else {
                        this.props.saveFormValues(this.props.record);
                      }
                      this.props.onClickSearchCustomEI(
                        id,
                        info.extendedItemCustomId,
                        info.name,
                        index
                      );
                    }}
                    onClickDeleteButton={() => {
                      onChangeUpdateValues({
                        [`items.${itemIdx}.extendedItemLookup${index}Value`]:
                          null,
                        [`items.${itemIdx}.extendedItemLookup${index}SelectedOptionName`]:
                          null,
                      });
                    }}
                    value={
                      item[`extendedItemLookup${index}SelectedOptionName`] || ''
                    }
                    label={info.name}
                    {...this.getCustomHintforEI(id, info)}
                  />
                );
                break;

              case 'Date':
                const onChangeDateFieldValue = (date?: Date) => {
                  const updateValue = (date && DateUtil.fromDate(date)) || '';
                  onChangeUpdateValues({
                    [`items.${itemIdx}.extendedItemDate${index}Value`]:
                      updateValue,
                    [`items.${itemIdx}.extendedItemDate${index}Id`]: id,
                  });
                };

                $field = (
                  <SFDateField
                    key={id}
                    required={isRequired}
                    disabled={readOnly}
                    label={info.name}
                    errors={setError(
                      `items.${itemIdx}.extendedItemDate${index}Value`
                    )}
                    onChange={(e, { date }) => {
                      onChangeDateFieldValue(date);
                    }}
                    value={item[`extendedItemDate${index}Value`] || ''}
                    useRemoveValueButton
                    onClickRemoveValueButton={() => onChangeDateFieldValue()}
                    {...this.getCustomHintforEI(id, info)}
                  />
                );
                break;

              default:
                $field = null;
            }

            return $field;
          })}
      </div>
    );
  }
}
