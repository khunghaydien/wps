import React from 'react';
import Autosuggest from 'react-autosuggest';

import { isEmpty } from 'lodash';

import {
  StationInfo,
  Suggestions,
  SuggestionsItem,
} from '../../../../../../../../domain/models/exp/jorudan/Station';

import ImgBtnSearch from '../../../../../../../images/btnSearchVia.png';
import ImgIconTransportationBus from '../../../../../../../images/iconTransportationBus.png';
import ImgIconTransportationShip from '../../../../../../../images/iconTransportationShip.png';
import ImgIconTransportationTrain from '../../../../../../../images/iconTransportationTrain.png';
import msg from '../../../../../../../languages';
import IconButton from '../../../../../../buttons/IconButton';
import TextField from '../../../../../../fields/TextField';

import './index.scss';

/**
 * 駅名のサジェスト機能を提供する
 */
type Props = {
  className?: string;
  error: string;
  placeholder: string;
  readOnly: boolean;
  subroleId?: string;
  targetDate: string;
  value: string;
  focus: () => void;
  focusout: () => void;
  getSuggestionValue: (arg0: StationInfo) => void;

  onChangeInput: (arg0: string, arg1: boolean) => void;

  onClickSearchStationButton: (
    arg0?: string,
    arg1?: string,
    arg2?: string,
    empHistoryId?: string
  ) => Promise<any>;

  onClickSuggestionItem: (arg0: StationInfo) => void;
  onKeyPressEnterSearchStation: (
    e: React.KeyboardEvent<HTMLInputElement>
  ) => void;
  onSuggestionSelected: (
    e: React.FormEvent<HTMLInputElement>,
    arg1: { method: string }
  ) => void;
  renderSearchButton: () => void;
  renderSectionTitle: (arg0: StationInfo) => void;
  renderSuggestion: (arg0: StationInfo) => void;
  shouldRenderSuggestions: (arg0: string) => void;
  storeInputReference: (arg0: any) => void;
};

type State = {
  error: string;
  suggestSelected: boolean;
  suggestions: Suggestions;
};

export default class Suggest extends React.Component<Props, State> {
  input: any;

  constructor(props: Props) {
    super(props);

    // TODO: apiから取得した値を初期値にする
    this.state = {
      suggestSelected: false,
      suggestions: [],
      error: '',
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
    this.focusout = this.focusout.bind(this);
    this.storeInputReference = this.storeInputReference.bind(this);
    this.onSuggestionSelected = this.onSuggestionSelected.bind(this);
    //    this.onFocusSuggestInput = this.onFocusSuggestInput.bind(this);
  }

  UNSAFE_componentWillReceiveProps(nextProps: Props) {
    if (this.props.error !== nextProps.error) {
      this.setState({ error: nextProps.error });
    }
    if (isEmpty(nextProps.value)) {
      this.setState({ suggestions: [], suggestSelected: false, error: '' });
    }
  }

  onChangeInput(
    e: React.FormEvent<HTMLInputElement>,
    { newValue }: { newValue: string }
  ) {
    if (newValue !== this.props.value) {
      this.props.onChangeInput(newValue.trim(), e.type !== 'click');
    }
  }

  onClickSearchStationButton() {
    // TODO: 禁止文字を検討
    if (this.props.value.length > 0) {
      // eslint-disable-next-line import/prefer-default-export
      const { subroleId } = this.props;
      this.props
        .onClickSearchStationButton(
          this.props.value,
          this.props.targetDate,
          null,
          subroleId
        )
        .then((result: Suggestions) => {
          this.setState({
            suggestions: result,
            error: result.length === 0 ? msg().Cmn_Lbl_SuggestNoResult : '',
          });
          this.focus();
        });
    }
  }

  /**
   * テキストフィールドでエンターキーが押下した際サジェストを開く
   * ただし、サジェストの項目が選択された場合のエンターキーのみ何もしない
   */
  onKeyPressEnterSearchStation(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Enter') {
      if (this.state.suggestSelected) {
        this.setState({ suggestSelected: false });
      } else {
        this.onClickSearchStationButton();
      }
    }
  }

  onSuggestionSelected(
    e: React.FormEvent<HTMLInputElement>,
    { suggestion, method }: { method: string; suggestion: StationInfo }
  ) {
    if (method === 'enter') {
      this.setState({ suggestSelected: true });
    }
    this.props.onClickSuggestionItem(suggestion);
    this.focusout();
  }

  /**
   * サジェストの表示条件
   * 入力文字が０文字以上
   */
  shouldRenderSuggestions(inputValue: string) {
    return inputValue.length >= 0;
  }

  focus() {
    if (!this.input) {
      return;
    }
    this.input.focus();
  }

  focusout() {
    if (!this.input) {
      return;
    }
    this.input.blur();
  }

  getSectionSuggestions(section: SuggestionsItem) {
    return section.suggestions;
  }

  //
  getSuggestionValue(suggestionItem: StationInfo) {
    //    this.props.onClickSuggestionItem(suggestionItem);
    //    this.focusout();
    return suggestionItem.name;
  }

  storeInputReference(autosuggest: any) {
    if (autosuggest) {
      this.input = autosuggest.input;
    }
  }

  renderSectionTitle(section: StationInfo) {
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

  renderSuggestion(suggestionItem: StationInfo) {
    return (
      <p>
        {suggestionItem.name}
        {suggestionItem.company !== '-' ? `[${suggestionItem.company}]` : ''}
      </p>
    );
  }

  renderSearchButton() {
    return (
      <IconButton
        className="ts-suggest-form__search-button"
        src={ImgBtnSearch}
        onClick={this.onClickSearchStationButton}
      />
    );
  }

  render() {
    if (this.props.readOnly) {
      return (
        <div className="ts-suggest">
          <div className="ts-suggest-form">
            <TextField
              value={this.props.value}
              className={this.props.className}
              disabled
            />
          </div>
        </div>
      );
    }

    const inputProps = {
      placeholder: this.props.placeholder,
      value: this.props.value,
      onChange: this.onChangeInput,
      onKeyPress: this.onKeyPressEnterSearchStation,
      className: 'ts-suggest-form__input',
      onFocus: () => {},
      //      onFocus: this.onFocusSuggestInput,
    };

    const suggestTheme = {
      suggestionsContainerOpen: 'ts-suggest-result',
      sectionContainer: 'ts-suggest-result__container',
      suggestionsList: 'ts-suggest-result__list',
      sectionTitle: 'ts-suggest-result__title',
      suggestion: 'ts-suggest-result__value',
      suggestionHighlighted: 'ts-suggest-result__value-highlight',
    };

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
            suggestions={this.state.suggestions}
            theme={suggestTheme}
          />
          {this.renderSearchButton()}
        </div>
        {this.state.error && (
          <p className="ts-suggest-warn">{this.state.error}</p>
        )}
      </div>
    );
  }
}
