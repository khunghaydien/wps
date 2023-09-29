import React, { useEffect, useMemo, useRef, useState } from 'react';
import ReactSelect, { components } from 'react-select';

import classNames from 'classnames';
import find from 'lodash/find';
import isEmpty from 'lodash/isEmpty';

import CheckIcon from '../../images/icons/CheckIcon.svg';
import IconArrowDown from '../../images/icons/iconArrowDown.svg';
import SearchIcon from '../../images/icons/search.svg';
import msg from '../../languages';
import DotLoader from '../DotLoader';

import './SearchableDropdown.scss';

const ROOT = 'commons-fields-dropdown-searchable';

export type OptionProps = {
  value: string;
  label: string;
};

type Props = {
  options: OptionProps[];
  placeholder?: string;
  value?: string;
  disabled?: boolean;
  isLoading?: boolean;
  isPartialLoading?: boolean;
  onChange: (value: Record<string, any>) => Promise<void> | void;
  isSearchable?: boolean;
  'data-testid'?: string;
};

const useHandleOutsideClick = (
  callback: Function
): React.MutableRefObject<HTMLDivElement> => {
  const ref = useRef<HTMLDivElement>();
  const handleClick = (e: MouseEvent) => {
    if (ref.current && !ref.current.contains(e.target as HTMLElement)) {
      callback();
    }
  };
  useEffect(() => {
    document.addEventListener('click', handleClick);
    return () => {
      document.removeEventListener('click', handleClick);
    };
  }, [ref.current]);
  return ref;
};

const SearchableDropdown = (props: Props) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState({});

  const updateFirstOption = () => {
    if (
      options &&
      isEmpty(props.value) &&
      !props.isLoading &&
      !props.isPartialLoading
    ) {
      const firstOption = options[0];
      if (firstOption) {
        onChange(firstOption);
      }
    }
  };

  // check if component with passed isLoading props
  useEffect(() => {
    let selectedObj = props.options[0] || {};
    if (props.value) {
      selectedObj = find(props.options, { value: props.value }) || {};
    }
    setSelectedItem(selectedObj);
    updateFirstOption();
  }, [props.value, props.isLoading, props.isPartialLoading]);

  // check if component with default isLoading always is false
  useEffect(() => {
    updateFirstOption();
  }, []);

  const ref = useHandleOutsideClick(() => {
    setIsOpen(false);
  });

  const selectRef: React.RefCallback<any> = React.useCallback(
    (node) => {
      if (node) {
        node.focus();
      }
    },
    [isOpen]
  );

  const { disabled, options, onChange } = props;

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const onChangeSelect = (option) => {
    if (option) {
      setIsOpen(false);
      onChange(option);
    }
  };

  const SearchOptions = useMemo(() => {
    const ValueContainer = ({
      children,
      ...insideProps
    }: Record<string, any>) => {
      return (
        // @ts-ignore
        <components.ValueContainer {...insideProps}>
          <SearchIcon className="search-icon" aria-hidden="true" />
          {children}
        </components.ValueContainer>
      );
    };

    const Option = (optionProps: Record<string, any>) => {
      const { data, isSelected } = optionProps;
      return isSelected ? (
        // @ts-ignore
        <components.Option {...optionProps}>
          <CheckIcon className="check-icon" aria-hidden="true" />
          <span>{data.label}</span>
        </components.Option>
      ) : (
        // @ts-ignore
        <components.Option {...optionProps} />
      );
    };

    const NoOptionsMessage = (innerProps: Record<string, any>) => {
      return (
        // @ts-ignore
        <components.NoOptionsMessage {...innerProps}>
          {msg().Com_Lbl_NoOption}
        </components.NoOptionsMessage>
      );
    };

    const customStyles = {
      valueContainer: (base) => ({
        ...base,
        padding: 0,
        height: 32,
        border: 'none',
        '&:focus': {
          outline: 'none',
        },
      }),
      control: (base) => ({
        ...base,
        height: 32,
        minHeight: 32,
        borderRadius: 4,
        margin: '13px 13px 9px',
        border: '1px solid #2782ed',
        boxShadow: '0px 0px 3px #0070d2',
        '&:hover': { border: '1px solid #2782ed' },
        '&:focus': {
          border: '1px solid #2782ed',
          boxShadow: '0px 0px 3px #0070d2',
        },
      }),
      option: (base, { isSelected }) => ({
        ...base,
        color: '#000000',
        fontWeight: isSelected ? 'bold' : 'normal',
        paddingLeft: isSelected ? 13 : 36,
        ':active': {
          backgroundColor: isSelected ? '#ebf3f7' : '#f3f2f2',
        },
        ':focus': {
          outline: 'none',
        },
      }),
      indicatorSeparator: (base) => ({
        ...base,
        display: 'none',
      }),
      dropdownIndicator: (base) => ({
        ...base,
        display: 'none',
      }),
      clearIndicator: (base) => ({
        ...base,
        display: 'none',
      }),
      menu: (base) => ({
        ...base,
        margin: 0,
        boxShadow: 'none',
        border: '1px solid #ccc',
        borderTop: 'none',
        borderRadius: '0 0 4px 4px',
      }),
      singleValue: (base) => ({
        ...base,
        paddingLeft: 30,
        top: 20,
        fontSize: 13,
        color: '#999',
      }),
      input: (base) => ({
        ...base,
        paddingLeft: 8,
        fontSize: 13,
      }),
    };

    return (
      <ReactSelect
        ref={selectRef}
        className={`${ROOT}__search-field`}
        classNamePrefix="select-option"
        autoFocus
        menuIsOpen
        options={options}
        placeholder={props.placeholder}
        // @ts-ignore
        value={{ ...selectedItem, label: msg().Com_Lbl_Search }}
        onChange={onChangeSelect}
        isClearable
        isSearchable={props.isSearchable || true}
        styles={customStyles}
        components={{ ValueContainer, Option, NoOptionsMessage }}
        theme={(theme) => ({
          ...theme,
          colors: {
            ...theme.colors,
            primary25: '#f3f2f2',
            primary: '#ebf3f7',
          },
        })}
      />
    );
  }, [selectedItem, options]);

  return (
    <div ref={ref} className={ROOT} data-testid={props['data-testid']}>
      <button
        type="button"
        className={classNames(`${ROOT}__toggle-field`, {
          focus: isOpen,
        })}
        onClick={toggleDropdown}
        disabled={disabled}
      >
        {(props.isLoading && (
          <DotLoader loading className={`${ROOT}__dot-loader`} />
        )) || (
          <>
            <span>{`${(selectedItem as OptionProps).label || ''}`}</span>
            <IconArrowDown
              className={`${ROOT}__toggle-btn`}
              aria-hidden="true"
            />
          </>
        )}
      </button>

      {isOpen && (
        <div className={`${ROOT}__search-container`}>{SearchOptions}</div>
      )}
    </div>
  );
};

SearchableDropdown.defaultProps = {
  placeholder: '',
  disabled: false,
};

export default SearchableDropdown;
