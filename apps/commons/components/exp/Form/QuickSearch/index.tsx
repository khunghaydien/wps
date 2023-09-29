import React, { useCallback, useEffect, useState } from 'react';

import find from 'lodash/find';
import isEmpty from 'lodash/isEmpty';

import styled from 'styled-components';

import {
  useComponentVisible,
  useKeyboardNavigation,
} from '@apps/commons/hooks';
import IconCompany from '@apps/commons/images/icons/company.svg';
import IconUser from '@apps/commons/images/icons/user.svg';
import msg from '@apps/commons/languages';

import QuickSearchContext, { FilterItem, Option } from './QuickSearchContext';
import QuickSearchListBox from './QuickSearchListBox';
import SearchField from './SearchField';

export type { Option };

// TODO: Move this component to commons if used outside expense
type Props<T> = {
  ROOT?: string;
  disabled?: boolean;
  displayValue: string;
  filters?: Array<FilterItem>;
  hideRemoveIcon?: boolean;
  isSkipRecentlyUsed?: boolean;
  placeholder: string;
  selectedId: string;
  showLoadingIndicator?: boolean;
  targetDate: string;
  useJctRegistrationNumber?: boolean;
  getRecentlyUsedItems: (
    targetDate: string,
    types?: Array<string>
  ) => Promise<Array<Option>>;
  getSearchResult: (
    keyword: string,
    types?: Array<string>
  ) => Promise<Array<Option>>;
  onSelect: (item: T) => void;
  openSearchDialog: () => void;
};

const S = {
  ListBoxContainer: styled.div`
    position: relative;
    z-index: 2;
  `,
};

const getDisplayIcon = (type: string) => {
  switch (type) {
    case 'personal':
      return <IconUser />;
    case 'company':
      return <IconCompany />;
    default:
      return <></>;
  }
};

const convertToOptions = (arr: Array<Option> = [], filters) => {
  const showIcon = !isEmpty(filters);
  return arr.map((x) => ({
    id: x.id,
    value: `${x.code} - ${x.name}`,
    code: x.code,
    name: x.name,
    type: x.type,
    paymentDueDateUsage: x.paymentDueDateUsage,
    jctRegistrationNumber: x?.jctRegistrationNumber,
    isJctQualifiedInvoiceIssuer: x?.isJctQualifiedInvoiceIssuer,
    icon: showIcon && getDisplayIcon(x.type),
  }));
};

const QuickSearch = <T,>({
  openSearchDialog,
  displayValue,
  selectedId,
  placeholder,
  disabled,
  isSkipRecentlyUsed,
  targetDate,
  showLoadingIndicator,
  filters = [],
  ...props
}: Props<T>): React.ReactElement => {
  const [loading, setLoading] = useState(false);
  const [inputText, setInputText] = useState(displayValue);
  const [title, setTitle] = useState('');
  const [options, setOptions] = useState([]);
  const [selected, setSelected] = useState({} as Option);
  const [recentItemOptions, setRecentItemOptions] = useState([]);
  const [filterTypes, setFilterTypes] = useState(filters.map((x) => x.value));
  const [filteredOptions, setFilteredOptions] = useState(options);

  const { ref, isComponentVisible, setIsComponentVisible } =
    useComponentVisible(false);

  const { cursor, setCursor } = useKeyboardNavigation(options.length);

  const setOptionList = (optionList) => {
    const selectedOption = find(optionList, { id: selectedId });
    setOptions(optionList);
    setSelected(selectedOption);
  };

  useEffect(() => {
    if (!isSkipRecentlyUsed && !disabled) {
      setLoading(true);
      props
        .getRecentlyUsedItems(targetDate, filterTypes)
        .then((result = []) => {
          setLoading(false);
          const optionList = convertToOptions(result, filters);
          setFilteredOptions(optionList);
          setOptionList(optionList);
          setRecentItemOptions(optionList);
        });
    } else if (isSkipRecentlyUsed) {
      setOptionList([]);
      setRecentItemOptions([]);
    }
  }, [targetDate, disabled]);

  useEffect(() => {
    const selectedOption = find(options, { id: selectedId });
    setSelected(selectedOption);
    setInputText(displayValue);
  }, [displayValue]);

  useEffect(() => {
    if (!isComponentVisible) {
      if (!isEmpty(filters)) {
        setFilterTypes(filters.map((x) => x.value));
      }
      setOptions(recentItemOptions);
      setFilteredOptions(recentItemOptions);
      setTitle(msg().Exp_Lbl_RecentlyUsed);
      setInputText(displayValue);
      setCursor(-1);
    }
  }, [isComponentVisible]);

  useEffect(() => {
    setFilteredOptions(options.filter((x) => filterTypes.includes(x.type)));
    setCursor(-1);
  }, [filterTypes]);

  const onFocusHandler = () => {
    setIsComponentVisible(true);
  };

  const onChangeHandler = (e) => {
    setInputText(e.target.value);
  };

  const onEnter = () => {
    if (cursor < 0) {
      setLoading(true);
      setIsComponentVisible(true);
      setTitle(msg().Exp_Lbl_SearchResult);
      const activeFilters = isEmpty(filterTypes)
        ? filters.map((x) => x.value)
        : filterTypes;
      props.getSearchResult(inputText, activeFilters).then((result = []) => {
        const optionList = convertToOptions(result, filters);
        setOptionList(optionList);
        setFilteredOptions(optionList);
        setLoading(false);
      });
    } else {
      if (options.length) {
        props.onSelect(options[cursor]);
        setIsComponentVisible(false);
      }
    }
  };

  const onKeyDownHandler = (e) => {
    if (e.key === 'Enter') {
      onEnter();
    }
  };

  const onClickRemove = () => {
    props.onSelect({} as T);
  };

  const onSelect = (x) => {
    setSelected(find(options, { id: selectedId }));
    setIsComponentVisible(false);
    props.onSelect(x);
  };

  const addFilter = useCallback((value) => {
    setFilterTypes((prev) => prev.concat(value));
  }, []);

  const removeFilter = useCallback((value) => {
    setFilterTypes((prev) => prev.filter((x) => x !== value));
  }, []);

  const handleCheckBox = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { checked, value } = e.target;
    return checked ? addFilter(value) : removeFilter(value);
  };

  const ctxValues = {
    value: inputText,
    isLoading: loading,
    isExpanded: isComponentVisible,
    types: filterTypes,
    selected,
    options: filters ? filteredOptions : options,
    cursor,
    filters,
    handleCheckBox,
  };

  return (
    <div ref={ref} id={placeholder}>
      <QuickSearchContext.Provider value={ctxValues}>
        <SearchField
          ROOT={props.ROOT}
          disabled={disabled}
          placeholder={disabled ? '' : placeholder}
          onChange={onChangeHandler}
          onClickRemove={!props.hideRemoveIcon && onClickRemove}
          onFocus={onFocusHandler}
          onKeyDown={onKeyDownHandler}
          showLoadingIndicator={showLoadingIndicator}
        />
        <S.ListBoxContainer>
          <QuickSearchListBox
            ROOT={props.ROOT}
            title={title}
            onClickOpenDialog={openSearchDialog}
            onSelect={onSelect}
            useJctRegistrationNumber={props.useJctRegistrationNumber}
          />
        </S.ListBoxContainer>
      </QuickSearchContext.Provider>
    </div>
  );
};

export default React.memo(QuickSearch);
