import React from 'react';

import msg from '../../../../commons/languages';

import { ExchangeRate } from '../../../models/exchange-rate/ExchangeRate';

import { DetailPaneButtonsHeader } from '../../../components/MainContents/DetailPane/DetailPaneHeader';

import ExchangeRateDetailItem from './ExchangeRateDetailItem';

const ROOT = 'admin-pc-contents-detail-pane';

export type Props = {
  editingRecord: ExchangeRate;
  mode: '' | 'edit' | 'new';
  sfObjFieldValues: Record<string, unknown>;
  onClickCloneButton: () => void;
  onClickSaveButton: (arg0: any) => void;
  onClickClosePane: (arg0: any) => void;
  onClickEditDetailButton: (arg0: any) => void;
  onClickCancelEditButton: (arg0: any) => void;
  onClickUpdateButton: (arg0: any) => void;
  onClickDeleteButton: (arg0: React.SyntheticEvent<any>) => void;
  onUpdateDetailItemValue: (arg0: any) => void;
  clearCurrencyInfo: (arg0: ExchangeRate) => void;
  setCurrencyInfo: (arg0: ExchangeRate) => void;
  setCurrencyPair: (arg0: ExchangeRate) => boolean;
};

export default class DetailPane extends React.Component<Props> {
  render() {
    const editingRecord: any = this.props.editingRecord || {};

    const title = editingRecord.id ? msg().Com_Btn_Edit : msg().Com_Btn_New;

    return (
      <div className={ROOT}>
        <DetailPaneButtonsHeader
          isSinglePane={false}
          isDeleteDisabled={this.props.mode === 'new'}
          type="top"
          id={this.props.mode === 'new' ? '' : editingRecord.id} // note idに空文字列を渡さないと新規作成時の登録ボタンが表示されない。nullでは登録ボタンは表示されない。
          title={title}
          mode={this.props.mode}
          isDisplayCloneButton
          onClickCloneButton={this.props.onClickCloneButton}
          onClickSaveButton={this.props.onClickSaveButton}
          onClickCancelButton={this.props.onClickCancelEditButton}
          onClickEditButton={this.props.onClickEditDetailButton}
          onClickCloseButton={this.props.onClickClosePane}
          onClickUpdateButton={this.props.onClickUpdateButton}
          onClickDeleteButton={this.props.onClickDeleteButton}
        />

        <ExchangeRateDetailItem
          editingRecord={editingRecord}
          sfObjFieldValues={this.props.sfObjFieldValues}
          mode={this.props.mode}
          onUpdateDetailItemValue={this.props.onUpdateDetailItemValue}
          clearCurrencyInfo={this.props.clearCurrencyInfo}
          setCurrencyInfo={this.props.setCurrencyInfo}
          setCurrencyPair={this.props.setCurrencyPair}
        />
      </div>
    );
  }
}
