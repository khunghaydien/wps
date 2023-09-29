import React from 'react';

import { RouteInfo } from '../../../domain/models/exp/Record';

import ImgBtnClose from '../../images/btnClose.png';
import ImgBtnEdit from '../../images/btnEditOff.png';
import ImgIconRouteFrom from '../../images/iconRouteFrom.png';
import ImgIconRouteTo from '../../images/iconRouteTo.png';
import ImgIconRouteVia from '../../images/iconRouteVia.png';
import ImgIconTrain from '../../images/iconTrain.png';
import msg from '../../languages';
import Button from '../buttons/Button';
import IconButton from '../buttons/IconButton';
import Suggest from './Suggest';

import './RouteForm.scss';

type Props = {
  routeInfo: RouteInfo;
  suggestInput: boolean;
  onChangeInput: () => void;
  cancelConfirm: () => void;
  onClickEditRouteButton: () => void;
  onClickRouteFinderButton: () => void;
  onClickSearchStationButton: (arg0: string, searchString: string) => void;
  onClickSuggestionItem: (arg0: string, arg1: boolean) => void;
  stationHistoryList: Array<any>;
  isEditing: boolean;
};

type State = {
  num: number;
};
/**
 * 経路情報の入力が必要な費目が選択された際に入力フォーム周りのパーツを提供する
 * 日本語専用のコンポーネントで他の言語では利用しない
 * NOTE: 日本語の直打ちの部分について日本語以外に対応する予定がないためこのままとする
 */
export default class RouteForm extends React.Component<Props, State> {
  // FIXME: numはモックの動作確認用。最終的にraduxで動作するように修正予定
  constructor(props) {
    super(props);
    this.state = { num: 0 };
    this.onClickAddViaButton = this.onClickAddViaButton.bind(this);
    this.onClickDeleteViaButton = this.onClickDeleteViaButton.bind(this);
  }

  // FIXME: モックでの動作確認用
  onClickAddViaButton() {
    this.setState((prevState) => ({
      num: prevState.num + 1,
    }));
  }

  // FIXME: モックでの動作確認用
  onClickDeleteViaButton() {
    this.setState((prevState) => ({
      num: prevState.num - 1,
    }));
  }

  renderTitle(title) {
    return (
      <div className="slds-col slds-size--3-of-12 slds-align-middle">
        <div className="key">&nbsp;{title}</div>
        <div className="separate">:</div>
      </div>
    );
  }

  // NOTE: valueにidxを渡している件について、ジョルダンのパラメータは
  // 全て先頭の要素から0,1,2...と値を渡していくので現状問題ない。並び替えの際には調整が必要
  renderRouteOptionRadio(title, name, dispList, imgSrc = null) {
    return (
      <div className="slds-grid">
        {this.renderTitle(title)}

        <div className="slds-col slds-size--8-of-12 slds-align-middle">
          <ul className="ts-route-form__search-area__route-option__items">
            {dispList.map((disp, idx) => {
              const htmlId = name + idx;
              return (
                <li
                  className="ts-route-form__search-area__route-option__items__item"
                  key={idx}
                >
                  <input type="radio" name={name} id={htmlId} value={idx} />
                  <label htmlFor={htmlId}>{disp}</label>
                </li>
              );
            })}
          </ul>
        </div>
        <div className="slds-col slds-size--1-of-12 slds-align-middle">
          {imgSrc !== null ? <img src={imgSrc} alt="" /> : ''}
        </div>
      </div>
    );
  }

  renderEditButton() {
    if (this.props.isEditing) {
      return null;
    }

    return (
      <IconButton
        className="ts-route__search-area__item__edit-btn"
        onClick={this.props.onClickEditRouteButton}
        src={ImgBtnEdit}
      />
    );
  }

  renderRouteOption() {
    if (!this.props.isEditing) {
      return null;
    }

    return (
      <div className="ts-route-form__search-area__route-option slds-col slds-size--12-of-12">
        <div className="slds-grid">
          <div className="slds-col slds-size--3-of-12 slds-align-middle" />
          <div className="slds-col slds-size--9-of-12 slds-align-middle ts-route-form__search-area__route-option__add-via">
            <button
              className="ts-route-form__search-area__route-option__add-via__button"
              onClick={this.onClickAddViaButton}
            >
              経由を追加する
            </button>
          </div>
        </div>
        {this.renderRouteOptionRadio(
          '有料特急',
          'useChargedExpress',
          ['利用する', '利用しない', '13km以上の場合利用する'],
          null
        )}
        {this.renderRouteOptionRadio(
          '表示順',
          'routeSort',
          ['所要時間', '安い順', '乗り換え回数'],
          null
        )}
        {this.renderRouteOptionRadio(
          '優先席順',
          'seatPreference',
          ['指定席', '自由席', 'グリーン席'],
          ImgIconTrain
        )}
        {this.renderRouteOptionRadio(
          'EX予約',
          'useExReservation',
          ['利用する', '利用しない'],
          null
        )}
      </div>
    );
  }

  renderSearchButton() {
    if (!this.props.isEditing) {
      return null;
    }

    return (
      <div className="slds-grid">
        <div className="slds-col slds-align-middle slds-text-align--center">
          <Button
            className="ts-route-form__search-area__search-button"
            type="primary"
            onClick={this.props.onClickRouteFinderButton}
          >
            検 索
          </Button>
        </div>
      </div>
    );
  }

  renderVia() {
    if (!this.props.isEditing) {
      return null;
    }

    const result = [];
    for (let cnt = 0; cnt < this.state.num; cnt++) {
      result.push(
        <div className="slds-grid ts-route-form__search-area__item" key={cnt}>
          <span className="ts-route-form__search-area__item__line" />
          <div className="slds-col slds-align-middle slds-size--1-of-12 slds-text-align--left ts-route-form__search-area__item__icon">
            <img src={ImgIconRouteVia} alt="経由" />
          </div>
          <div className="slds-col slds-align-middle slds-size--9-of-12">
            <div className="value">
              {this.renderSuggest(`via${cnt + 1}`, '経由')}
            </div>
          </div>
          <div className="slds-col slds-size--2-of-12 slds-align-middle slds-text-align--left">
            <IconButton
              className="ts-route-form__search-area__item__delete-button"
              onClick={this.onClickDeleteViaButton}
              src={ImgBtnClose}
            />
          </div>
        </div>
      );
    }
    return result;
  }

  renderSuggest(inputType, placeholder) {
    // TODO: 初期値がある場合は最初から駅を確定状態にする
    const value = this.props.suggestInput[inputType].value;
    const suggestions = this.props.suggestInput[inputType].suggestions;
    const status = this.props.suggestInput[inputType].status;
    return (
      <Suggest
        inputType={inputType}
        placeholder={placeholder}
        onChangeInput={this.props.onChangeInput}
        cancelConfirm={this.props.cancelConfirm}
        onClickSearchStationButton={this.props.onClickSearchStationButton}
        onClickSuggestionItem={this.props.onClickSuggestionItem}
        onClickEditRouteButton={this.props.onClickEditRouteButton}
        suggestions={suggestions}
        stationHistoryList={this.props.stationHistoryList}
        status={status}
        isEditing={this.props.isEditing}
        value={value}
      />
    );
  }

  render() {
    return (
      <div className="slds-grid ts-route-form">
        {this.renderTitle(msg().Com_Lbl_Route)}
        <div className="slds-col slds-align-middle slds-size--9-of-12 ts-route-form__search-area">
          <div className="slds-grid ts-route-form__search-area__item">
            <span className="ts-route-form__search-area__item__line" />
            <div className="slds-col slds-size--1-of-12 slds-text-align--left ts-route-form__search-area__item__icon">
              <img src={ImgIconRouteFrom} alt="出発" />
            </div>
            <div className="slds-col slds-align-middle slds-size--9-of-12">
              <div className="value">
                {this.renderSuggest(
                  'origin',
                  '出発地(駅・スポット、バス停、住所)'
                )}
              </div>
            </div>
            <div className="slds-col slds-align-middle slds-size--2-of-12 slds-text-align--center" />
          </div>
          {this.renderVia()}
          <div className="slds-grid ts-route-form__search-area__item">
            <div className="slds-col slds-size--1-of-12 slds-text-align--left ts-route-form__search-area__item__icon">
              <img src={ImgIconRouteTo} alt="到着" />
            </div>
            <div className="slds-col slds-align-middle slds-size--9-of-12">
              <div className="value">
                {this.renderSuggest(
                  'arrival',
                  '到着地(駅・スポット、バス停、住所)'
                )}
              </div>
            </div>
            <div className="slds-col slds-size--2-of-12 slds-align-middle slds-text-align--center">
              {this.renderEditButton()}
            </div>
          </div>
          <div className="slds-grid">{this.renderRouteOption()}</div>
          {this.renderSearchButton()}
        </div>
      </div>
    );
  }
}
