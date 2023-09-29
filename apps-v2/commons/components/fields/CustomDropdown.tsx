import React from 'react';

import classNames from 'classnames';
import _ from 'lodash';
import { $Shape } from 'utility-types';

import msg from '@apps/commons/languages';

import DateUtil from '../../utils/DateUtil';
import FormatUtil from '../../utils/FormatUtil';

import Icon from '../exp/Icon';
import IconButton from '../exp/Icon/IconButton';

import './CustomDropdown.scss';

const ROOT = 'commons-fields-dropdown-custom';
const TOGGLE_CLASS = `${ROOT}__value`;

export type Option = $Shape<{ label: string; value: string; detail?: string }>;
export type OptionList = Array<Option>;

type Props = {
  children: any;
  valuePlaceholder: string;
  isRemovable?: boolean; // for the remove btn outside input
  isClearable?: boolean; // for the clear icon inside input
  displayColor?: boolean;
  onClickRemoveButton?: () => void;
  onClickClearIcon?: () => void;
  data?: OptionList;
  selectedStringValues?: Array<string>;
  selectedStringValue?: string;
  selectedDateRangeValues?: {
    startDate?: string;
    endDate?: string;
  };
  selectedAmountRangeValues?: {
    minAmount?: number;
    maxAmount?: number;
  };
  selectedSearchConditionName?: string;
  currencyDecimalPlaces?: number;
};

type State = {
  isOpen: boolean;
  displayValue?: string;
};

const isValueChanged = (prev, next) =>
  typeof next !== 'undefined' && !_.isEqual(prev, next);

class CustomDropdown extends React.Component<Props, State> {
  component: any;

  state = {
    isOpen: false,
    displayValue: this.createDisplayValue(),
  };

  componentDidMount() {
    document.addEventListener('click', this.handleOutsideClick, false);
  }

  UNSAFE_componentWillReceiveProps(nextProps: Props) {
    if (
      this.props.selectedSearchConditionName !==
        nextProps.selectedSearchConditionName ||
      this.props.selectedStringValues !== nextProps.selectedStringValues
    ) {
      const displayValueArray = nextProps.selectedStringValues
        ? nextProps.selectedStringValues.map((selectedValue) => {
            const findVal = _.find(nextProps.data, { value: selectedValue });
            return findVal && findVal.label ? findVal.label : null;
          })
        : [];
      const displayValue = _.compact(displayValueArray).join(', ');
      this.setState({ displayValue });
    }
    if (
      this.props.selectedSearchConditionName !==
        nextProps.selectedSearchConditionName ||
      isValueChanged(
        this.props.selectedDateRangeValues,
        nextProps.selectedDateRangeValues
      )
    ) {
      const displayValue = this.formatDateRange(
        nextProps.selectedDateRangeValues
      );
      this.setState({ displayValue });
    }
    if (
      this.props.selectedSearchConditionName !==
        nextProps.selectedSearchConditionName ||
      this.props.selectedAmountRangeValues !==
        nextProps.selectedAmountRangeValues
    ) {
      const displayValue = this.formatAmountRange(
        nextProps.selectedAmountRangeValues
      );
      this.setState({ displayValue });
    }
    if (
      this.props.selectedSearchConditionName !==
        nextProps.selectedSearchConditionName ||
      isValueChanged(
        this.props.selectedStringValue,
        nextProps.selectedStringValue
      )
    ) {
      const displayValue = nextProps.selectedStringValue;
      this.setState({ displayValue });
    }
  }

  componentWillUnmount() {
    document.removeEventListener('click', this.handleOutsideClick, false);
  }

  createDisplayValue() {
    let displayValue;
    if (this.props.selectedStringValues) {
      const displayValueArray = this.props.selectedStringValues.map((value) => {
        const findVal = _.find(this.props.data, { value });
        return _.get(findVal, 'label', null);
      });
      displayValue = displayValueArray.join(', ');
    } else if (this.props.selectedStringValue) {
      displayValue = this.props.selectedStringValue || '';
    } else if (this.props.selectedDateRangeValues) {
      displayValue = this.formatDateRange(this.props.selectedDateRangeValues);
    } else if (this.props.selectedAmountRangeValues) {
      displayValue = this.formatAmountRange(
        this.props.selectedAmountRangeValues
      );
    }
    return displayValue;
  }

  formatDateRange(
    dateRange:
      | {
          startDate?: string;
          endDate?: string;
        }
      | null
      | undefined
  ) {
    const startDate =
      dateRange && dateRange.startDate
        ? DateUtil.format(dateRange.startDate)
        : '';
    const endDate =
      dateRange && dateRange.endDate ? DateUtil.format(dateRange.endDate) : '';
    return startDate || endDate ? `${startDate} - ${endDate}` : '';
  }

  formatNumber(value: number) {
    return FormatUtil.formatNumber(value, this.props.currencyDecimalPlaces);
  }

  // flowlint sketchy-null-number:off
  formatAmountRange(
    amountRange:
      | {
          minAmount?: number;
          maxAmount?: number;
        }
      | null
      | undefined
  ) {
    const minAmount =
      amountRange && amountRange.minAmount
        ? this.formatNumber(amountRange.minAmount)
        : '';
    const maxAmount =
      amountRange && amountRange.maxAmount
        ? this.formatNumber(amountRange.maxAmount)
        : '';

    return (minAmount || maxAmount) && `${minAmount} - ${maxAmount}`;
  }

  handleOutsideClick = (e: MouseEvent) => {
    const targetNode: any = e.target;
    const currentComponent = this.component;
    const { className: targetClass } = targetNode;

    const isString = typeof targetClass.includes !== 'undefined';
    const isIconObject = typeof targetClass.baseVal !== 'undefined';
    const btnParent = targetNode && targetNode.closest('button');

    const isClearIcon =
      btnParent &&
      btnParent.classList.contains(
        'commons-fields-filterable-checkbox__clear-search'
      );

    const targetNodeExist = targetClass && (isString || isIconObject);

    const isDatepickerComponent =
      targetNodeExist && isString && targetClass.includes('react-datepicker__');
    const isSelectionLabels =
      targetNodeExist && isString && targetClass.includes('selection-label');

    if (
      currentComponent.contains(targetNode) ||
      isDatepickerComponent ||
      isSelectionLabels ||
      isClearIcon
    ) {
      return;
    }
    if (this.state.isOpen) {
      this.toggleDropdown();
    }
  };

  removeField = () => {
    this.setState({
      displayValue: '',
    });
    if (this.props.onClickRemoveButton) {
      this.props.onClickRemoveButton();
    }
  };

  clearValue = (e) => {
    e.stopPropagation();
    this.setState({
      displayValue: '',
    });
    if (this.props.onClickClearIcon) {
      this.props.onClickClearIcon();
    }
  };

  toggleDropdown = () => {
    this.setState((prevState) => ({
      isOpen: !prevState.isOpen,
    }));
  };

  render() {
    const { isOpen, displayValue } = this.state;
    const { valuePlaceholder, displayColor } = this.props;

    let isChangeColor = false;
    if (this.props.selectedStringValues) {
      isChangeColor = !!displayValue || !!displayColor;
    } else if (this.props.selectedDateRangeValues) {
      isChangeColor =
        !!this.props.selectedDateRangeValues.startDate ||
        !!this.props.selectedDateRangeValues.endDate;
    } else if (this.props.selectedAmountRangeValues) {
      isChangeColor =
        this.props.selectedAmountRangeValues &&
        (this.props.selectedAmountRangeValues.minAmount !== null ||
          this.props.selectedAmountRangeValues.minAmount !== null);
    } else if (this.props.selectedStringValue) {
      isChangeColor = !!this.props.selectedStringValue;
    }

    const triggerClass = classNames(TOGGLE_CLASS, {
      [`${TOGGLE_CLASS}--is-active`]: isChangeColor,
    });

    const renderColon = displayValue ? ' : ' : '';

    const isLoading = this.props.data === null;
    const loadingMsg = isLoading ? ` (${msg().Com_Lbl_Loading})` : '';
    return (
      <div
        className={ROOT}
        ref={(el) => {
          this.component = el;
        }}
      >
        <button
          className={triggerClass}
          type="button"
          onClick={this.toggleDropdown}
          disabled={isLoading}
        >
          <div>{`${valuePlaceholder}${loadingMsg}${renderColon} ${
            displayValue || ''
          }`}</div>
          {this.props.isClearable && displayValue ? (
            <IconButton
              icon="close-copy"
              className={`${ROOT}__clear-icon`}
              size="small"
              onClick={this.clearValue}
            />
          ) : (
            <Icon
              type="chevrondown"
              className={`${ROOT}__dropdown-icon`}
              size="small"
            />
          )}
        </button>
        {this.props.isRemovable && (
          <IconButton
            className={`${ROOT}__remove-icon`}
            icon="clear"
            size="medium"
            onClick={this.removeField}
          />
        )}

        {isOpen && this.props.children(this.toggleDropdown)}
      </div>
    );
  }
}

export default CustomDropdown;
