import React, { FunctionComponent, useEffect, useState } from 'react';

import { filterType } from '@apps/mobile-app/constants/advSearch';

import DateFilter from '../../molecules/commons/AdvSearch/DateFilter';
import Navigation from '../../molecules/commons/Navigation';
import { DateRangeOption } from '@apps/commons/components/fields/DropdownDateRange';
import DateRangeFilter from '@apps/mobile-app/components/molecules/commons/AdvSearch/DateRangeFilter';
import SearchSelectionFilter from '@apps/mobile-app/components/molecules/commons/AdvSearch/SearchSelectionFilter';
import SelectionFilter from '@apps/mobile-app/components/molecules/commons/AdvSearch/SelectionFilter';
import TextFilter from '@apps/mobile-app/components/molecules/commons/AdvSearch/TextFilter';
import { OptionProps as Option } from '@commons/components/fields/SearchableDropdown';
import msg from '@commons/languages';

import TextButton from '../../atoms/TextButton';

import './FilterDetail.scss';

const ROOT = 'mobile-app-pages-commons-filter-detail';

type SelectedValue = Array<string> & DateRangeOption & string;

type FilterContent = {
  options?: Array<Option>;
  type: string;
  selected: SelectedValue;
  initial: Array<string> | DateRangeOption | string;
  onClickOption?: (
    selectedValue: SelectedValue,
    selectedOption?: Option
  ) => void;
};

type Props = {
  content: FilterContent;
  title: string;
  onClickBack: () => void;
  onClickSearch: (query: string) => Promise<Array<Option>>;
  updateOptions: (options: Array<Option>) => void;
  fetchOptions?: () => Promise<Array<Option>>;
};

const SEARCH_SELECTION_DEFAULT_LIMIT = 100;

const FilterDetail: FunctionComponent<Props> = (props) => {
  const {
    title,
    content,
    updateOptions,
    onClickBack,
    onClickSearch,
    fetchOptions,
  } = props;

  const [selectedValue, setSelectedValue] = useState(content.selected);
  const [selectedOption, setSelectedOption] = useState({} as Option);

  useEffect(() => {
    setSelectedValue(content.selected);
  }, [content.selected]);

  const setSelected = (value: SelectedValue, selectedOption?: Option) => {
    if (
      content.type === filterType.SEARCH ||
      content.type === filterType.SELECTION
    ) {
      // multi select options
      const isValueExist = selectedValue.includes(value);
      const multiSelectValues = isValueExist
        ? selectedValue.filter((selectedValue) => selectedValue !== value)
        : selectedValue.concat(value);
      setSelectedValue(multiSelectValues as SelectedValue);

      if (content.type === filterType.SEARCH) {
        setSelectedOption(selectedOption);
      }
    } else {
      setSelectedValue(value);
    }
  };

  const onClickApplyButton = () => {
    if (content.type === filterType.SEARCH) {
      content.onClickOption(selectedValue, selectedOption);
    } else {
      content.onClickOption(selectedValue);
    }
  };

  const onClickResetButton = () => {
    setSelectedValue(content.initial as SelectedValue);
  };

  const renderFilterContent = () => {
    const { options, type } = content;
    switch (type) {
      case filterType.SELECTION:
        return (
          <SelectionFilter
            options={options}
            selectedList={selectedValue}
            onClickOption={setSelected}
          />
        );
      case filterType.SEARCH:
        return (
          <SearchSelectionFilter
            options={options}
            selectedIds={selectedValue}
            limitCount={SEARCH_SELECTION_DEFAULT_LIMIT}
            fetchOptions={fetchOptions}
            onClickOption={setSelected}
            onClickSearch={onClickSearch}
            updateOptions={updateOptions}
          />
        );
      case filterType.DATE:
        return (
          <DateFilter
            options={options}
            selected={selectedValue}
            onClickOption={setSelected}
          />
        );
      case filterType.DATE_RANGE:
        return (
          <DateRangeFilter
            selected={selectedValue}
            onClickOption={setSelected}
          />
        );
      case filterType.TEXT:
        return (
          <TextFilter
            selected={selectedValue}
            onChangeTextFilter={setSelected}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className={ROOT}>
      <Navigation
        title={title}
        onClickBack={onClickBack}
        actions={[
          <TextButton key="reset" onClick={onClickResetButton}>
            {msg().Com_Lbl_Reset}
          </TextButton>,
        ]}
      />
      <div className="main-content">
        <div className={`${ROOT}__filter-options`}>{renderFilterContent()}</div>
        <div className={`${ROOT}__apply`}>
          <TextButton
            className={`${ROOT}__apply-button`}
            onClick={onClickApplyButton}
            disabled={false}
          >
            {msg().Com_Lbl_Apply}
          </TextButton>
        </div>
      </div>
    </div>
  );
};

export default FilterDetail;
