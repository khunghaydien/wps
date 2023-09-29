import * as React from 'react';
import Autosuggest from 'react-autosuggest';

import { get, isEmpty } from 'lodash';

// images
import ImgIconTransportationBus from '../../../../commons/images/iconTransportationBus.png';
import ImgIconTransportationShip from '../../../../commons/images/iconTransportationShip.png';
import ImgIconTransportationTrain from '../../../../commons/images/iconTransportationTrain.png';
import msg from '../../../../commons/languages';

import {
  StationInfo,
  Suggestions,
  SuggestionsItem,
} from '../../../../domain/models/exp/jorudan/Station';

import Errors from '../../atoms/Errors';
// Prop types
import { InputProps } from '../../atoms/Fields/InputProps';
import IconButton from '../../atoms/IconButton';
import Label from '../../atoms/Label';

import './SearchStationField.scss';

const ROOT = 'mobile-app-molecules-search-station-field';

type RouteOriginArrivalValues = {
  category: string;
  company: string;
  name: string;
};

type Props = Readonly<
  InputProps & {
    errors?: string[];
    label: string;
    disabled?: boolean;
    initialValue: RouteOriginArrivalValues;
    searchRoute: (value: string) => any;
    setFormikFieldValue: (value: any) => void;
  }
>;

type State = {
  suggestions: Suggestions;
  error: string;
  value: string;
};

export default class SearchStationField extends React.PureComponent<
  Props,
  State
> {
  input: any;
  constructor(props: Props) {
    super(props);

    this.state = {
      suggestions: [],
      value: '',
      error: '',
    };

    this.input = null;
  }

  UNSAFE_componentWillReceiveProps(nextProps: Props) {
    const nextSearchValue = get(nextProps.initialValue, 'name', '');
    if (isEmpty(nextSearchValue)) {
      this.setState({ suggestions: [] });
    }
  }

  onChangeInput = (
    e: React.ChangeEvent<HTMLInputElement>,
    { newValue }: { newValue: string }
  ) => {
    if (newValue !== this.state.value) {
      this.setState({
        value: newValue,
      });
      this.props.setFormikFieldValue({
        category: '',
        company: '',
        name: newValue,
      });
    }
  };

  onClickSearchStationButton = (value: string) => {
    if (value.length > 0) {
      this.props.searchRoute(value).then((result: Suggestions) => {
        this.setState({
          suggestions: result,
          error: result.length === 0 ? msg().Cmn_Lbl_SuggestNoResult : '',
        });
        this.focus();
      });
    }
  };

  onSuggestionSelected = (
    e: React.MouseEvent<HTMLInputElement>,
    { suggestion }: { suggestion: StationInfo }
  ) => {
    this.props.setFormikFieldValue(suggestion);
  };

  focus = () => {
    if (!this.input) {
      return;
    }
    this.input.focus();
  };

  getSectionSuggestions = (section: SuggestionsItem) => {
    return section.suggestions;
  };

  getSuggestionValue = (suggestionItem: StationInfo) => {
    return suggestionItem.name;
  };

  storeInputReference = (autosuggest: any) => {
    if (autosuggest) {
      this.input = autosuggest.input;
    }
  };

  renderSectionTitle = (section: StationInfo) => {
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
  };

  renderSuggestion = (suggestionItem: StationInfo) => {
    return (
      <p>
        {suggestionItem.name}
        {suggestionItem.company !== '-' ? `[${suggestionItem.company}]` : ''}
      </p>
    );
  };

  render() {
    const { value } = this.state;
    const errors = this.props.errors || [];
    const hasErrorClass =
      errors.length > 0 ? 'mobile-app-atoms-input--error' : '';
    const hasDisabledClass = this.props.disabled
      ? 'mobile-app-atoms-input--disabled'
      : '';

    const searchValue = get(this.props.initialValue, 'name', value);
    const inputProps = {
      value: searchValue,
      placeholder: msg().Exp_Lbl_RoutePlaceholder,
      onChange: this.onChangeInput,
      disabled: this.props.disabled,
    };

    const suggestTheme = {
      container: `${ROOT}__suggest mobile-app-atoms-input ${hasErrorClass} ${hasDisabledClass}`,
      input: 'mobile-app-atoms-input__input',
      suggestionsContainerOpen: 'ts-suggest-result',
      sectionContainer: 'ts-suggest-result__container',
      suggestionsList: 'ts-suggest-result__list',
      sectionTitle: 'ts-suggest-result__title',
      suggestion: 'ts-suggest-result__value',
      suggestionHighlighted: 'ts-suggest-result__value-highlight',
    };

    return (
      <div className={ROOT}>
        <Label
          emphasis
          marked={this.props.required}
          className={`${ROOT}__label`}
          text={this.props.label}
        >
          <Autosuggest
            getSectionSuggestions={this.getSectionSuggestions}
            getSuggestionValue={this.getSuggestionValue}
            inputProps={inputProps}
            multiSection
            onSuggestionsClearRequested={() => {}}
            onSuggestionSelected={this.onSuggestionSelected}
            onSuggestionsFetchRequested={() => {}}
            ref={this.storeInputReference}
            renderSectionTitle={this.renderSectionTitle}
            renderSuggestion={this.renderSuggestion}
            suggestions={this.state.suggestions}
            theme={suggestTheme}
          />
          <IconButton
            icon="search"
            onClick={() => this.onClickSearchStationButton(inputProps.value)}
          />
        </Label>
        {this.state.error && <Errors messages={[this.state.error]} />}
        {!this.state.error && this.props.errors && (
          <Errors messages={this.props.errors} />
        )}
      </div>
    );
  }
}
