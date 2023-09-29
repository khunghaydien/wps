import React from 'react';
import Autosuggest from 'react-autosuggest';

import classNames from 'classnames';
import debounce from 'lodash/debounce';

import '@apps/commons/components/fields/TextField.scss';

import './index.scss';

type Props = {
  buildLabel?: any;
  className?: string;
  configKey?: string;
  debounceDelay?: any;
  disabled?: boolean;
  getSuggestions?: any;
  getSuggestionValue?: any;
  loadAsyncSuggestions?: any;
  onBlur?: Function;
  onBlurAsyncSuggestion?: any;
  onChange: Function; //
  onFocus?: Function;
  onKeyDown?: Function;
  onSelectAsyncSuggestion?: any;
  onSuggestionsClearRequested?: any;
  onSuggestionsFetchRequested?: any;
  placeholder: string;
  processSuggestList?: any;
  readOnly?: boolean;
  renderInputComponent?: any;
  renderSuggestion?: any;
  required?: any;
  suggestConfig: any;
  suggestList: Array<any>;
  value: any;
};

/**
 * インクリメンタル検索対応テキスト項目 - 共通コンポーネント
 */
export default class AutoSuggestTextField extends React.Component<Props> {
  static defaultProps = {
    suggestConfig: {},
    disabled: false,
    readOnly: false,
  };

  constructor(props) {
    super(props);

    this.state = {
      isLoading: false,
      value: this.props.value,
      suggestions: [],
    };
    // @ts-ignore
    this.debouncedLoadSuggestions = debounce(
      this.loadSuggestions,
      props.debounceDelay
    );
    this.buildLabel = this.buildLabel.bind(this);
    this.onFocus = this.onFocus.bind(this);
    this.onBlur = this.onBlur.bind(this);
    this.onKeyDown = this.onKeyDown.bind(this);
    this.onChange = this.onChange.bind(this);
    this.getSuggestions = this.getSuggestions.bind(this);
    this.getSuggestionValue = this.getSuggestionValue.bind(this);
    this.renderInputComponent = this.renderInputComponent.bind(this);
    this.renderSuggestion = this.renderSuggestion.bind(this);
    this.onSuggestionsFetchRequested =
      this.onSuggestionsFetchRequested.bind(this);
    this.onSuggestionsClearRequested =
      this.onSuggestionsClearRequested.bind(this);
  }

  static getDerivedStateFromProps(props, state) {
    return { ...state, value: props.value };
  }

  onFocus(e) {
    if (this.props.onFocus) {
      this.props.onFocus(e, e.target.value);
    }
  }

  onBlur(e) {
    const fieldValue = this.convertLabelToValue(e.target.value);
    if (this.props.onBlur) {
      this.props.onBlur(e, fieldValue);
    }
    if (this.props.onBlurAsyncSuggestion) {
      this.props.onBlurAsyncSuggestion(fieldValue);
    }
  }

  onKeyDown(e) {
    if (this.props.onKeyDown) {
      this.props.onKeyDown(e, e.target.value);
    }
  }

  onChange = (event, { newValue }) => {
    if (this.props.onSelectAsyncSuggestion) {
      // @ts-ignore
      const eventObj = this.getSuggestions(newValue, this.state.suggestions);
      this.props.onSelectAsyncSuggestion(eventObj[0]);
    }
    this.setState({
      value: newValue,
    });
    this.props.onChange(newValue);
  };

  // In order to get async suggestions, you need to pass in 3 extra props:
  //  loadAsyncSuggestions: function to return the final suggestion list
  //  processSuggestList: function to massage and sanitize your data
  //  debounceDelay: delay for debounce (time ellapsed )
  //  See example usage in apps/psa-pc/components/ProjectListScreen/NewProjectForm/index.js
  onSuggestionsFetchRequested = ({ value }) => {
    if (this.props.loadAsyncSuggestions) {
      // @ts-ignore
      this.debouncedLoadSuggestions(value);
    } else {
      this.setState({
        suggestions: this.getSuggestions(value, this.props.suggestList),
      });
    }
  };

  onSuggestionsClearRequested = () => {
    this.setState({
      suggestions: [],
    });
  };

  loadSuggestions = async (value) => {
    this.setState({
      isLoading: true,
    });
    const employeeData = await this.props.loadAsyncSuggestions(value);
    this.setState({
      isLoading: false,
    });
    // @ts-ignore
    const processedSuggestList = this.props.processSuggestList(employeeData);
    const suggestions = this.getSuggestions(value, processedSuggestList);
    const labelAddedSuggestions =
      suggestions && suggestions.length > 0
        ? suggestions.map((sugg) => ({
            ...sugg,
            displayLabel: this.buildLabel(sugg),
          }))
        : [];
    this.setState({
      suggestions: labelAddedSuggestions,
    });
  };

  buildLabel(suggestItem) {
    const { suggestConfig } = this.props;
    return suggestConfig.buildLabel
      ? suggestConfig.buildLabel(suggestItem)
      : suggestItem[suggestConfig.label];
  }

  convertValueToLabel({ value, suggestList, suggestConfig }) {
    for (let i = 0; i < suggestList.length; i++) {
      const suggest = suggestList[i];
      if (suggest[suggestConfig.value] === value) {
        return this.buildLabel(suggest);
      }
    }
    return '';
  }

  convertLabelToValue(label) {
    for (let i = 0; i < this.props.suggestList.length; i++) {
      const suggest = this.props.suggestList[i];
      if (this.buildLabel(suggest) === label) {
        return suggest[this.props.suggestConfig.value];
      }
    }
    return '';
  }

  getSuggestions(value, suggestList) {
    const inputValue = value.trim().toLowerCase();

    if (inputValue === '') {
      return [];
    }

    return suggestList.filter((suggest) =>
      Object.keys(suggest).some(
        (key) =>
          key !== 'id' &&
          suggest[key] &&
          suggest[key].toLowerCase().match(inputValue)
      )
    );
  }

  getSuggestionValue(suggestion) {
    return this.buildLabel(suggestion);
  }

  renderSuggestion(suggestion) {
    return <span>{this.buildLabel(suggestion)}</span>;
  }

  renderInputComponent = (inputProps) => (
    <div>
      <input {...inputProps} />
    </div>
  );

  render() {
    const { className, disabled, readOnly, ...props } = this.props;

    const textFieldClass = classNames('ts-text-field', 'slds-input', className);

    // 重複回避
    delete props.onFocus;
    delete props.onBlur;
    delete props.onKeyDown;
    delete props.onChange;

    const { value, suggestions }: any = this.state;
    const inputProps = {
      className: textFieldClass,
      disabled,
      readOnly,
      value,
      onChange: this.onChange,
      onBlur: this.onBlur,
      placeholder: this.props.placeholder,
    };

    if (readOnly) {
      return (
        <div className="ts-text-field ts-text-field--readonly" title={value}>
          {value}
        </div>
      );
    } else {
      return (
        <React.Fragment>
          <Autosuggest
            suggestions={suggestions}
            onSuggestionsFetchRequested={this.onSuggestionsFetchRequested}
            onSuggestionsClearRequested={this.onSuggestionsClearRequested}
            getSuggestionValue={this.getSuggestionValue}
            renderSuggestion={this.renderSuggestion}
            inputProps={inputProps}
            renderInputComponent={this.renderInputComponent}
          />
          {/* @ts-ignore */}
          {this.state.isLoading && <span className="loader" />}
        </React.Fragment>
      );
    }
  }
}
