import React, { FunctionComponent, useEffect, useState } from 'react';

import find from 'lodash/find';
import isEmpty from 'lodash/isEmpty';

import KEYS from '@salesforce/design-system-react/utilities/key-code';

import { OptionProps as Option } from '@apps/commons/components/fields/SearchableDropdown';
import msg from '@apps/commons/languages';

import Icon from '@mobile/components/atoms/Icon';

import SelectionFilter from './SelectionFilter';

import './SearchSelectionFilter.scss';

const ROOT =
  'mobile-app-components-molecules-commons-advsearch-search-selection-filter';

type Props = {
  options: Array<Option>;
  selectedIds: Array<string>;
  limitCount: number;
  onClickOption: (selectedValue: string, targetedOption: Option) => void;
  onClickSearch: (query: string) => Promise<Array<Option>>;
  updateOptions: (arg: Array<Option>) => void;
  fetchOptions?: () => Promise<Array<Option>>;
};

const SearchSelectionFilter: FunctionComponent<Props> = (props) => {
  const {
    options,
    selectedIds,
    limitCount,
    onClickOption,
    onClickSearch,
    updateOptions,
    fetchOptions,
  } = props;
  const [inputText, setInputText] = useState('');
  const [searchedText, setSearchedText] = useState('');
  const [data, setData] = useState([]);

  useEffect(() => {
    if (isEmpty(options) && fetchOptions) {
      fetchOptions().then((res) => {
        setData(res);
      });
    } else {
      // sort options by selection and label in ascending order
      let sortedList = sortAscByLabel(options);
      sortedList = sortOptionBySelection(sortedList, selectedIds);
      setData(sortedList);
    }
  }, []);

  const sortAscByLabel = (options: Array<Option>) =>
    options.slice().sort((a, b) => (a.label > b.label ? 1 : -1));

  // sort option list with selected options first
  const sortOptionBySelection = (
    options: Array<Option>,
    selectedIds: Array<string>
  ) => {
    const selectedOption = options
      .filter((option) => selectedIds.includes(option.value))
      .slice(0, limitCount);
    const remainingLimit = limitCount - selectedOption.length;
    const notSelectedOption = remainingLimit
      ? options
          .filter((option) => !selectedIds.includes(option.value))
          .slice(0, remainingLimit)
      : [];
    return [...selectedOption, ...notSelectedOption];
  };

  const onChangeSearchText = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInputText(event.target.value);
  };

  const handleOnKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.keyCode === KEYS.ENTER) {
      event.preventDefault();
      const searchStr = event.currentTarget.value;
      onClickSearch(searchStr).then((res) => {
        setSearchedText(searchStr);
        setData(sortOptionBySelection(res, selectedIds));
      });
    }
  };

  const handleClickOption = (value: string) => {
    const selectedOption = find(data, {
      value,
    });
    onClickOption(value, selectedOption);
    const newOption = find(options, { value });
    if (!newOption) {
      updateOptions([...options, selectedOption]);
    }
  };

  const clearSearch = () => {
    setSearchedText('');
    setInputText('');
    setData(options);
  };

  return (
    <>
      <div className={`${ROOT}__search-input`}>
        <Icon type="search" className={`${ROOT}__search-icon`} size="small" />
        <input
          className={`${ROOT}__search-field`}
          onKeyDown={handleOnKeyDown}
          placeholder={msg().Com_Lbl_Search}
          onChange={onChangeSearchText}
          value={inputText}
        />
        {inputText && (
          <button
            type="button"
            onClick={clearSearch}
            className={`${ROOT}__clear-search`}
          >
            <Icon type="clear" size="small" />
          </button>
        )}
      </div>
      <SelectionFilter
        options={data}
        selectedList={selectedIds}
        onClickOption={handleClickOption}
        highlight={searchedText}
        limitCount={limitCount}
        hasZeroMsg={msg().Com_Lbl_ZeroSearchResult}
        hasMoreMsg={
          searchedText ? msg().Com_Lbl_TooManySearchResults : msg().Com_Msg_More
        }
      />
    </>
  );
};

export default SearchSelectionFilter;
