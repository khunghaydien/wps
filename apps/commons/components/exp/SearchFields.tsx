import React from 'react';

import classNames from 'classnames';
import isNil from 'lodash/isNil';

import SearchIcon from '../../images/icons/search.svg';
import msg from '../../languages';
import Button from '../buttons/Button';
import CustomDropdown, { OptionList } from '../fields/CustomDropdown';
import DateRangeField from '../fields/DateRangeField';
import DropdownAmountRange, {
  AmountRangeOption,
} from '../fields/DropdownAmountRange';
import DropdownDateRange, {
  DateRangeOption,
} from '../fields/DropdownDateRange';
import DropDownTextField from '../fields/DropdownTextField';
import FilterableCheckbox from '../fields/FilterableCheckbox';

const SELECTION = { SELECTION: 'SELECTION' } as const;
const TEXT_INPUT = { TEXT_INPUT: 'TEXT_INPUT' } as const;
const DATE_DROPDOWN = { DATE_DROPDOWN: 'DATE_DROPDOWN' } as const;
const DATE_RANGE = { DATE_RANGE: 'DATE_RANGE' } as const;
const AMOUNT_RANGE = { AMOUNT_RANGE: 'AMOUNT_RANGE' } as const;

export const FILTER_TYPE = {
  ...SELECTION, // search by choosing options
  ...TEXT_INPUT, // e.g. search by title, search by detail
  ...DATE_DROPDOWN, // `Date: 2020/01/30...` as display value
  ...DATE_RANGE, // `2020/01/30 - 2020/03/30` as display value
  ...AMOUNT_RANGE,
};

type ClearProps = {
  isClearable?: boolean; // for the clear icon inside input, which clear selected value
  isRemovable?: boolean; // for the remove btn outside input, which remove whole field
  onClickClearIcon?: () => void;
  onClickRemoveButton?: () => void;
};

type SelectionProps = ClearProps & {
  appendedClass: string;
  data: OptionList;
  isSelectedValueDisplay?: boolean; // whether show selected options as display value
  label: string;
  optionLimit?: number;
  placeHolder: string;
  selectedStringValues: string[];
  showSelectionLabels?: boolean;
  type: keyof typeof SELECTION;
  clearAll?: () => void;
  onSearchByFetching?: (arg0: string) => Promise<OptionList>;
  onSelectInput: (arg0: string, arg1: Record<string, unknown>) => void;
  selectAll?: (arg0: string[]) => void;
};

type TextInputProps = ClearProps & {
  appendedClass: string;
  inputValue: string;
  label: string;
  type: keyof typeof TEXT_INPUT;
  onInput: (arg0: string) => void;
};

type DateDropdownProps = ClearProps & {
  appendedClass: string;
  label: string;
  selectedDateRangeValues: DateRangeOption;
  type: keyof typeof DATE_DROPDOWN;
  onClickUpdateDate: (arg0: DateRangeOption, arg1: boolean) => void;
};

type DateRangeProps = DateRangeOption & {
  appendedClass: string;
  type: keyof typeof DATE_RANGE;
  onChangeEndDate: (arg0: string) => void;
  onChangeStartDate: (arg0: string) => void;
};

type AmountRangeProps = ClearProps & {
  amountRange: AmountRangeOption;
  appendedClass: string;
  currencyDecimalPlaces: number;
  label: string;
  type: keyof typeof AMOUNT_RANGE;
  onChangeAmount: (arg0: AmountRangeOption) => void;
};

export type Filters = ReadonlyArray<
  | SelectionProps
  | TextInputProps
  | DateDropdownProps
  | DateRangeProps
  | AmountRangeProps
>;

type Props = {
  className: string;
  filters: Filters;
  searchBtnType?: 'icon' | 'label';
  onClickSearch?: () => void;
};

const SearchFields = (props: Props) => {
  const ROOT = classNames(props.className, {
    'commons-search-fields': !props.className,
  });

  const fields = props.filters.map((filter) => {
    switch (filter.type) {
      /*
       * selection field
       */
      case FILTER_TYPE.SELECTION:
        const {
          data,
          selectedStringValues,
          placeHolder,
          onSelectInput,
          optionLimit,
          onSearchByFetching,
          showSelectionLabels,
          selectAll,
          clearAll,
        } = filter;
        const innerProps = {
          data,
          selectedStringValues,
          searchPlaceholder: placeHolder,
          onSelectInput,
          showSelectionLabels,
          // adding optional props, which only used by `Employee` for now
          ...(!isNil(optionLimit) ? { optionLimit } : {}),
          ...(onSearchByFetching && { onSearchByFetching }),
          // optional props only used when showSelectionLabels is true
          ...(selectAll && { selectAll }),
          ...(clearAll && { clearAll }),
        };
        const selectionField = (
          <div className={`${ROOT}-${filter.appendedClass}`}>
            <CustomDropdown
              valuePlaceholder={filter.label}
              selectedStringValues={
                !filter.isSelectedValueDisplay && filter.selectedStringValues
              }
              data={filter.data}
              isRemovable={filter.isRemovable}
              onClickRemoveButton={filter.onClickRemoveButton}
              isClearable={filter.isClearable}
              onClickClearIcon={filter.onClickClearIcon}
            >
              {(values, updateParentState) => (
                <FilterableCheckbox
                  values={values}
                  updateParentState={updateParentState}
                  {...innerProps}
                />
              )}
            </CustomDropdown>
          </div>
        );
        return selectionField;

      /*
       * text input field
       */
      case FILTER_TYPE.TEXT_INPUT:
        const inputField = (
          <div className={`${ROOT}-${filter.appendedClass}`}>
            <CustomDropdown
              valuePlaceholder={filter.label}
              selectedStringValue={filter.inputValue}
              isRemovable={filter.isRemovable}
              onClickRemoveButton={filter.onClickRemoveButton}
              isClearable={filter.isClearable}
              onClickClearIcon={filter.onClickClearIcon}
            >
              {() => (
                <DropDownTextField
                  selectedStringValues={filter.inputValue}
                  onClickUpdateText={filter.onInput}
                />
              )}
            </CustomDropdown>
          </div>
        );
        return inputField;

      /*
       * date dropdown field
       */
      case FILTER_TYPE.DATE_DROPDOWN:
        const requestDateSearch = (
          <div className={`${ROOT}-${filter.appendedClass}`}>
            <CustomDropdown
              valuePlaceholder={filter.label}
              selectedDateRangeValues={filter.selectedDateRangeValues}
              isRemovable={filter.isRemovable}
              onClickRemoveButton={filter.onClickRemoveButton}
              isClearable={filter.isClearable}
              onClickClearIcon={filter.onClickClearIcon}
            >
              {(values, updateParentState) => (
                <DropdownDateRange
                  dateRange={filter.selectedDateRangeValues}
                  onClickUpdateDate={filter.onClickUpdateDate}
                  updateParentState={updateParentState}
                  values={values}
                  needStartDate
                />
              )}
            </CustomDropdown>
          </div>
        );
        return requestDateSearch;

      /*
       * date range field
       */
      case FILTER_TYPE.DATE_RANGE:
        const dateRange = (
          <div className={`${ROOT}-${filter.appendedClass}`}>
            <DateRangeField
              startDateFieldProps={{
                value: filter.startDate,
                onChange: filter.onChangeStartDate,
                placeholder: msg().Exp_Lbl_From,
              }}
              endDateFieldProps={{
                value: filter.endDate,
                onChange: filter.onChangeEndDate,
                placeholder: msg().Exp_Lbl_To,
              }}
            />
          </div>
        );
        return dateRange;

      /*
       * amount range field
       */
      case FILTER_TYPE.AMOUNT_RANGE:
        const amountRange = (
          <div className={`${ROOT}-${filter.appendedClass}`}>
            <CustomDropdown
              valuePlaceholder={filter.label}
              displayColor
              selectedAmountRangeValues={filter.amountRange}
              isRemovable={filter.isRemovable}
              onClickRemoveButton={filter.onClickRemoveButton}
              currencyDecimalPlaces={filter.currencyDecimalPlaces}
              isClearable={filter.isClearable}
              onClickClearIcon={filter.onClickClearIcon}
            >
              {(toggleDropdown) => (
                <DropdownAmountRange
                  amountRange={filter.amountRange}
                  onClickUpdateAmount={filter.onChangeAmount}
                  currencyDecimalPlaces={filter.currencyDecimalPlaces}
                  toggleDropdown={toggleDropdown}
                />
              )}
            </CustomDropdown>
          </div>
        );
        return amountRange;

      default:
        return <></>;
    }
  });

  const searchBtn = (
    <Button
      onClick={props.onClickSearch}
      className={`${ROOT}-search-button`}
      type={props.searchBtnType === 'icon' ? 'primary' : 'default'}
    >
      {props.searchBtnType === 'icon' ? <SearchIcon /> : msg().Exp_Btn_Search}
    </Button>
  );

  return (
    <div className={ROOT}>
      {fields}
      {props.searchBtnType && searchBtn}
    </div>
  );
};

export default SearchFields;
