import React from 'react';
import Autosuggest from 'react-autosuggest';

import suggestionStatus from '../../constants/suggestionStatus';

import ImgBtnSearch from '../../images/btnSearch.png';
import ImgIconTransportationBus from '../../images/iconTransportationBus.png';
import ImgIconTransportationShip from '../../images/iconTransportationShip.png';
import ImgIconTransportationTrain from '../../images/iconTransportationTrain.png';
import IconButton from '../buttons/IconButton';

import './Suggest.scss';

type Props = {
  inputType: string;
  placeholder: string;
  onChangeInput: (arg0: string, arg1: string) => void;
  cancelConfirm: (arg0: string) => void;
  onClickSearchStationButton: (arg0: string, arg1?: string) => void;
  onClickSuggestionItem: (arg0: string, arg1: boolean) => void;
  onClickEditRouteButton: () => void;
  suggestions: Array<any>;
  stationHistoryList: Array<any>;
  status: string;
  isEditing: boolean;
  value: string;
};

type State = {
  suggestSelected: boolean;
};
/**
 * 駅名のサジェスト機能を提供する
 */
export default class Suggest extends React.Component<Props, State> {
  input: any;
  constructor(props) {
    super(props);

    // TODO: apiから取得した値を初期値にする
    this.state = {
      suggestSelected: false,
    };
    this.input = null;
    this.getSuggestionValue = this.getSuggestionValue.bind(this);
    this.onChangeInput = this.onChangeInput.bind(this);
    this.shouldRenderSuggestions = this.shouldRenderSuggestions.bind(this);
    this.onClickSearchStationButton =
      this.onClickSearchStationButton.bind(this);
    this.onKeyPressEnterSearchStation =
      this.onKeyPressEnterSearchStation.bind(this);
    this.focus = this.focus.bind(this);
    this.storeInputReference = this.storeInputReference.bind(this);
    this.onSuggestionSelected = this.onSuggestionSelected.bind(this);
    this.onFocusSuggestInput = this.onFocusSuggestInput.bind(this);
  }

  onChangeInput(event, { newValue }) {
    if (this.props.value !== newValue) {
      if (this.props.status !== suggestionStatus.INITIAL) {
        this.props.cancelConfirm(this.props.inputType);
      }
      this.props.onChangeInput(this.props.inputType, newValue);
    }
  }

  onClickSearchStationButton(_arg0?: any) {
    // TODO: 禁止文字を検討
    this.props.onClickSearchStationButton(
      this.props.inputType,
      this.props.value.trim()
    );
    this.focus();
  }

  /**
   * テキストフィールドでエンターキーが押下した際サジェストを開く
   * ただし、サジェストの項目が選択された場合のエンターキーのみ何もしない
   */
  onKeyPressEnterSearchStation(e) {
    if (e.key === 'Enter') {
      if (this.state.suggestSelected) {
        this.setState({ suggestSelected: false });
      } else {
        this.onClickSearchStationButton(this);
      }
    }
  }

  onSuggestionSelected(_e, { method }) {
    if (method === 'enter') {
      this.setState({ suggestSelected: true });
    }
  }

  onFocusSuggestInput() {
    if (!this.props.isEditing) {
      this.props.onClickEditRouteButton();
    }
  }

  /**
   * サジェストの表示条件
   * 入力文字が０文字以上
   */
  shouldRenderSuggestions(inputValue) {
    return inputValue.trim().length >= 0;
  }

  focus() {
    if (!this.input) {
      return;
    }
    this.input.focus();
  }

  getSectionSuggestions(section) {
    return section.suggestions;
  }

  getSuggestionValue(suggestionItem) {
    this.props.onClickSuggestionItem(this.props.inputType, suggestionItem);
    return suggestionItem.name;
  }

  storeInputReference(autosuggest) {
    if (autosuggest) {
      this.input = autosuggest.input;
    }
  }

  renderSectionTitle(section) {
    if (
      section.category === 'B' ||
      section.category === 'H' ||
      section.category === 'P'
    ) {
      return <img src={ImgIconTransportationBus} alt="バス" />;
    } else if (section.category === 'R') {
      return <img src={ImgIconTransportationTrain} alt="電車" />;
    } else if (section.category === 'F') {
      return <img src={ImgIconTransportationShip} alt="船" />;
    }
    return null;
  }

  renderSuggestion(suggestionItem) {
    return (
      <p>
        {suggestionItem.name}
        {suggestionItem.company !== '-' ? `[${suggestionItem.company}]` : ''}
      </p>
    );
  }

  renderSearchButton() {
    if (!this.props.isEditing) {
      return null;
    }

    return (
      <IconButton
        className="ts-suggest-form__search-button"
        src={ImgBtnSearch}
        onClick={this.onClickSearchStationButton}
      />
    );
  }

  renderWarnMsg() {
    let warnMsg = '';
    switch (this.props.status) {
      case suggestionStatus.SEARCH_STATION_NO_RESULT:
        warnMsg = '検索結果の候補がありませんでした';
        break;
      case suggestionStatus.EMPTY_SEARCH_STRING:
        warnMsg = '検索キーワードを入力してください';
        break;
      default:
        return null;
    }

    // TODO: デザインをLDSに即したものに変える。
    return <p className="ts-suggest-warn">{warnMsg}</p>;
  }

  render() {
    const inputProps = {
      placeholder: this.props.placeholder,
      value: this.props.value,
      onChange: this.onChangeInput,
      onKeyPress: this.onKeyPressEnterSearchStation,
      className: 'ts-suggest-form__input',
      onFocus: this.onFocusSuggestInput,
    };

    const suggestTheme = {
      suggestionsContainerOpen: 'ts-suggest-result',
      sectionContainer: 'ts-suggest-result__container',
      suggestionsList: 'ts-suggest-result__list',
      sectionTitle: 'ts-suggest-result__title',
      suggestion: 'ts-suggest-result__value',
      suggestionHighlighted: 'ts-suggest-result__value-highlight',
    };

    // 入力文字が空の場合は履歴を表示
    const suggestions = this.props.value.trim()
      ? this.props.suggestions
      : this.props.stationHistoryList;

    return (
      <div className="ts-suggest">
        <div className="ts-suggest-form">
          <Autosuggest
            getSectionSuggestions={this.getSectionSuggestions}
            getSuggestionValue={this.getSuggestionValue}
            shouldRenderSuggestions={this.shouldRenderSuggestions}
            inputProps={inputProps}
            multiSection
            onSuggestionSelected={this.onSuggestionSelected}
            onSuggestionsClearRequested={() => {}}
            onSuggestionsFetchRequested={() => {}}
            ref={this.storeInputReference}
            renderSectionTitle={this.renderSectionTitle}
            renderSuggestion={this.renderSuggestion}
            suggestions={suggestions}
            theme={suggestTheme}
          />
          {this.renderSearchButton()}
        </div>
        {this.renderWarnMsg()}
      </div>
    );
  }
}
