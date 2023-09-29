import React from 'react';

import _ from 'lodash';
import uuidV4 from 'uuid/v4';

import configList from '../../../constants/configList/exchangeRate';
import fieldSize from '../../../constants/fieldSize';

import Label from '../../../../commons/components/fields/Label';
import TextField from '../../../../commons/components/fields/TextField';
import msg from '../../../../commons/languages';

import { ExchangeRate } from '../../../models/exchange-rate/ExchangeRate';

import DetailItem from '../../../components/MainContents/DetailPane/DetailItem';

const ROOT = 'admin-pc-contents-detail-pane';
const ITEM_LIST = 'admin-pc-contents-detail-pane__body__item-list';

export type Props = {
  editingRecord: ExchangeRate;
  mode: '' | 'edit' | 'new' | 'clone';
  sfObjFieldValues: Record<string, unknown>;
  onUpdateDetailItemValue: (arg0: any) => void;
  clearCurrencyInfo: (arg0: ExchangeRate) => void;
  setCurrencyInfo: (arg0: ExchangeRate) => void;
  setCurrencyPair: (arg0: ExchangeRate) => boolean;
};

export default class ExchangeRateDetailItem extends React.Component<Props> {
  UNSAFE_componentWillReceiveProps(nextProps: Props) {
    const record = nextProps.editingRecord;

    if (record.currencyId === this.props.editingRecord.currencyId) {
      return;
    }

    if (_.isEmpty(record.currencyId)) {
      this.props.clearCurrencyInfo(record);
      return;
    }

    this.props.setCurrencyInfo(record);
    this.props.setCurrencyPair(record);
  }

  renderDetailItem(config: any, isDisable: boolean) {
    const uuid = uuidV4();
    if (config.key === 'currencyPairLabel') {
      return (
        <li key={uuid} className={`${ITEM_LIST}__item`}>
          <Label
            text={msg()[config.msgkey]}
            childCols={config.size || fieldSize.SIZE_MEDIUM}
            labelCols={config.labelSize}
            helpMsg={config.help ? msg()[config.help] : ''}
          >
            <TextField
              key={`${uuid}${config.key}`}
              readOnly
              value={this.props.editingRecord[config.key]}
            />
          </Label>
        </li>
      );
    } else if (config.key === 'baseCurrencyName') {
      return (
        <li key={uuid} className={`${ITEM_LIST}__item`}>
          <Label
            text={msg()[config.msgkey]}
            childCols={config.size || fieldSize.SIZE_MEDIUM}
            labelCols={config.labelSize}
            helpMsg={config.help ? msg()[config.help] : ''}
          >
            <TextField
              key={`${uuid}${config.key}`}
              readOnly
              value={`${this.props.editingRecord.baseCurrencyCode} - ${this.props.editingRecord.baseCurrencyName}`}
            />
          </Label>
        </li>
      );
    } else {
      return (
        <DetailItem
          key={`${config.key}`}
          config={config}
          tmpEditRecord={this.props.editingRecord}
          sfObjFieldValues={this.props.sfObjFieldValues}
          onChangeDetailItem={this.props.onUpdateDetailItemValue}
          disabled={isDisable}
          baseValueGetter={() => {}}
          historyValueGetter={() => {}}
          useFunction={{}}
        />
      );
    }
  }

  render() {
    const isDetailItemDisabled =
      this.props.mode !== 'edit' &&
      this.props.mode !== 'new' &&
      this.props.mode !== 'clone';

    return (
      <div className={`${ROOT}__body`}>
        <ul className={`${ROOT}__item-list`}>
          {configList.base.map((config) =>
            this.renderDetailItem(config, isDetailItemDisabled)
          )}
        </ul>
      </div>
    );
  }
}
