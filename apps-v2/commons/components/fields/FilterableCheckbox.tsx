import React from 'react';

import _ from 'lodash';

import KEYS from '@salesforce/design-system-react/utilities/key-code';

import Icon from '../../../mobile-app/components/atoms/Icon';

import msg from '../../languages';

import './FilterableCheckbox.scss';

const ROOT = 'commons-fields-filterable-checkbox';

type Props = {
  data: any;
  values?: any;
  onSelectInput: (value: string, selectedData?: Record<string, any>) => void;
  searchPlaceholder: string;
  selectedStringValues?: Array<string>;
  optionLimit?: number;
  // TODO remove if unnecessary
  updateParentState?: () => void;

  // To enable Select All and Clear All button on top of data list
  showSelectionLabels?: boolean;

  // To show any parent level hierarchy next to label as detail
  displayDetail?: boolean;

  // To search/filter by API call
  onSearchByFetching?: (arg0: string) => Promise<Record<string, any>>;
  clearAll?: () => void;
  selectAll?: (arg0: string[]) => void;
};

type State = {
  searchString: string;
  curInputString: string;
  curData: any;
  curSelectedStringValues: Array<string>;
  isHighlight: boolean;
};

// Helper presentational components
const SmallIcon = (props: any) => <Icon {...props} size="small" />;
const Checkbox = ({ name, value, label, onChange, isChecked }) => {
  return (
    <label className={`${ROOT}__input-label`} htmlFor={name}>
      <input
        type="checkbox"
        id={name}
        className={`${ROOT}__input-checkbox`}
        onChange={onChange}
        value={value}
        checked={isChecked}
      />
      {label}
    </label>
  );
};

class FilterableCheckbox extends React.Component<Props, State> {
  state = {
    searchString: '',
    curInputString: '',
    curData: this.props.data,
    curSelectedStringValues: this.props.selectedStringValues || [],
    isHighlight: false,
  };

  onChangeCheckbox = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    const selectedData = _.find(this.state.curData, {
      value,
    });
    this.props.onSelectInput(value, selectedData);
  };

  onKeyEnter = async (e: React.KeyboardEvent<HTMLInputElement>) => {
    const { onSearchByFetching } = this.props;
    const { curInputString: filterString } = this.state;
    if (e.keyCode === KEYS.ENTER) {
      e.preventDefault();
      let updateData = null;
      if (onSearchByFetching) {
        updateData = await onSearchByFetching(filterString);
        this.setState({
          curData: updateData,
        });
      } else {
        updateData = this.filterData(this.props.data, filterString);
        this.setState({
          curData: updateData,
        });
      }
      this.setState({ isHighlight: true, searchString: filterString });
    }
  };

  onChangeInputText = (e: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({
      curInputString: e.target.value,
    });
  };

  clearSearch = () => {
    this.setState({
      searchString: '',
      curInputString: '',
      curData: this.props.data,
    });
  };

  /**
   * Util to check keyword entered is included in label or detail text
   * @param {string} label item name
   * @param {string} detail item detail, for example hierarchy information
   */
  isIncluded = (label: string, detail = '', filterString: string) => {
    return (
      label.toLowerCase().includes(filterString.toLowerCase()) ||
      detail.toLowerCase().includes(filterString.toLowerCase())
    );
  };

  filterData = (data: any, filterString: string) => {
    return data.filter((o) => this.isIncluded(o.label, o.detail, filterString));
  };

  /**
   * Select All options from the displayed list
   * If list is filtered using keyword, select all will select all in filtered list
   */
  selectAll = () => {
    const { data, selectedStringValues = [] } = this.props;
    const { searchString: filterString } = this.state;
    const targetData = _.isEmpty(filterString)
      ? data
      : this.filterData(this.props.data, filterString);
    const notSelectedData = targetData.filter(
      (x) => !selectedStringValues.includes(x.value)
    );
    const selectedIds = targetData.map(({ value }) => value);
    this.props.selectAll(selectedIds);
    this.setState((prevState) => {
      const allSelectedValues = notSelectedData
        .map((x) => x.value)
        .concat(prevState.curSelectedStringValues);
      return { curSelectedStringValues: allSelectedValues };
    });
  };

  /**
   * Clears all selected value
   */
  clearAll = () => {
    this.props.clearAll();
    this.setState({ curSelectedStringValues: [] });
  };

  /**
   * Highlights the keyword inside the text
   * @param {string} text to highlight
   */
  getMarkedLabel = (text: string) => {
    const { searchString, isHighlight } = this.state;
    const idx = text.toLowerCase().indexOf(searchString.toLowerCase());
    return (
      (idx > -1 && isHighlight && (
        <span>
          {text.substring(0, idx)}
          <b>{text.substring(idx, idx + searchString.length)}</b>
          {text.substring(idx + searchString.length)}
        </span>
      )) || <span>{text}</span>
    );
  };

  renderSearchButton = () => {
    if (this.state.curInputString) {
      return (
        <button onClick={this.clearSearch} className={`${ROOT}__clear-search`}>
          <SmallIcon type="clear" className={`${ROOT}__search-icon`} />
        </button>
      );
    } else {
      return <SmallIcon type="search" className={`${ROOT}__search-icon`} />;
    }
  };

  renderCheckBoxes = (data: any) => {
    const { values, selectedStringValues, displayDetail } = this.props;
    return data.map((o, index) => {
      const type = typeof selectedStringValues;
      let isChecked;
      // @ts-ignore
      if (selectedStringValues || selectedStringValues === '') {
        if (type === 'object') {
          isChecked = selectedStringValues.includes(o.value);
        } else {
          isChecked = selectedStringValues === o.value;
        }
      } else {
        isChecked = values ? values.includes(o.value) : false;
      }
      const markedLabel = this.getMarkedLabel(o.label);
      let label = markedLabel;
      if (displayDetail) {
        const newDetail = this.getMarkedLabel(o.detail);
        label = (
          <div className={`${ROOT}__with-detail`}>
            {markedLabel}
            <div className={`${ROOT}__detail`}>{newDetail}</div>
          </div>
        );
      }

      return (
        <Checkbox
          key={index}
          value={o.value}
          name={o.name}
          label={label}
          onChange={this.onChangeCheckbox}
          isChecked={isChecked}
        />
      );
    });
  };

  renderSelectionLabel = (
    label: string,
    onClick: (event: React.MouseEvent<HTMLElement>) => void
  ) => {
    const classNames = `${ROOT}__input-label ${ROOT}__selection-label`;
    return (
      <div className={classNames} onClick={onClick}>
        {label}
      </div>
    );
  };

  /**
   * Add the selection buttons on top of list
   * Current labels: Select All | Clear All
   * @param {any} data display list
   */
  renderListButtons = (data: any) => {
    const { showSelectionLabels, selectedStringValues = [] } = this.props;
    const isAllSelected =
      data.findIndex((x) => !selectedStringValues.includes(x.value)) === -1;
    const showSelectAll =
      showSelectionLabels && !isAllSelected && this.props.selectAll;
    const showClearAll = showSelectionLabels && selectedStringValues.length > 0;
    const showDivider = showSelectAll && showClearAll;
    return (
      <div className={`${ROOT}__buttons`}>
        {showSelectAll &&
          this.renderSelectionLabel(msg().Exp_Lbl_SelectAll, this.selectAll)}
        {showDivider && <div className={`${ROOT}__buttons-divider`} />}
        {showClearAll &&
          this.renderSelectionLabel(msg().Exp_Lbl_ClearAll, this.clearAll)}
      </div>
    );
  };

  render() {
    const { searchPlaceholder, optionLimit } = this.props;
    const {
      curInputString,
      curData: data,
      curSelectedStringValues: selectedStringValues,
    } = this.state;

    const selectedData = data
      .filter((x) => selectedStringValues.includes(x.value))
      .slice(0, optionLimit);
    let notSelectedData = data.filter(
      (x) => !selectedStringValues.includes(x.value)
    );
    if (optionLimit) {
      const remainingLimit = optionLimit - selectedData.length;
      notSelectedData =
        remainingLimit > 0 ? notSelectedData.slice(0, remainingLimit) : [];
    }

    const listArea = (
      <>
        {this.renderListButtons(data)}
        <div className={`${ROOT}__list-area`}>
          {this.renderCheckBoxes(selectedData)}
          {this.renderCheckBoxes(notSelectedData)}
          {/* flowlint sketchy-null-number:off */}
          {!!optionLimit && data.length > optionLimit && (
            <div className={`${ROOT}__more-option`}>{msg().Com_Msg_More}</div>
          )}
        </div>
      </>
    );

    return (
      <div className={`${ROOT}`}>
        <div className={`${ROOT}__search-container`}>
          <input
            type="search"
            className={`${ROOT}__search-field`}
            onChange={this.onChangeInputText}
            placeholder={searchPlaceholder}
            value={curInputString}
            onKeyDown={this.onKeyEnter}
          />
          {this.renderSearchButton()}
        </div>
        {listArea}
      </div>
    );
  }
}

export default FilterableCheckbox;
