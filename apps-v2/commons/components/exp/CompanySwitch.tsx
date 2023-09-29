import React, { useEffect, useRef, useState } from 'react';
import Select, {
  components,
  OptionProps,
  SingleValueProps,
} from 'react-select';

import classnames from 'classnames';
import filter from 'lodash/filter';
import isEmpty from 'lodash/isEmpty';
import isNil from 'lodash/isNil';

import { NoticeProps } from 'react-select/src/components/Menu';

import CheckIcon from '../../images/icons/CheckIcon.svg';
import msg from '../../languages';

import './CompanySwitch.scss';

const ROOT = 'commons-company-switch';

export type CompanyCountOption = {
  count?: number;
  currencyCode?: string;
  currencyDecimal?: string;
  currencySymbol?: string;
  label: string;
  value: string;
};

type Option = {
  count: number;
  label: string;
  value: string;
};

type Props = {
  isLoading: boolean;
  options: Array<CompanyCountOption>;
  totalCount?: number;
  value: string;
  withoutCount?: boolean;
  onChange: (arg0: string) => void;
};

const Option = (optionProps: OptionProps<any, any>) => {
  const { data, isSelected } = optionProps;
  return (
    <components.Option {...optionProps}>
      {isSelected && <CheckIcon className="check-icon" aria-hidden="true" />}
      <span>{data.label}</span>
      {data.count > 0 && (
        <span className={isSelected ? 'count-icon sub-count' : 'count'}>
          {data.count}
        </span>
      )}
    </components.Option>
  );
};

const NoOptionsMessage = (innerProps: NoticeProps<any, any>) => {
  return (
    <components.NoOptionsMessage {...innerProps}>
      {msg().Com_Lbl_NoOption}
    </components.NoOptionsMessage>
  );
};

const customStyles = {
  control: (base) => ({
    ...base,
    height: 28,
    minHeight: 28,
    width: 250,
  }),
  option: (base, { isSelected }) => ({
    ...base,
    color: '#000000',
    paddingLeft: isSelected ? 10 : 28,
    ':focus': {
      outline: 'none',
    },
    fontWeight: isSelected ? 'bold' : 'normal',
    display: 'inline-flex',
    alignItems: 'center',
  }),
  indicatorSeparator: (base) => ({
    ...base,
    display: 'none',
  }),
  clearIndicator: (base) => ({
    ...base,
    display: 'none',
  }),
  dropdownIndicator: (base) => ({
    ...base,
    height: 28,
    padding: '4px 12px',
    paddingLeft: 0,
  }),
  menu: (base) => ({
    ...base,
    marginTop: 5,
    boxShadow: 'none',
    border: '1px solid #ccc',
    borderTop: 'none',
    borderRadius: '0 0 4px 4px',
  }),
  valueContainer: (base) => ({
    ...base,
    paddingRight: 1,
  }),
  singleValue: (base) => ({
    ...base,
    display: 'contents',
  }),
  loadingIndicator: (base) => ({
    ...base,
    position: 'relative',
    right: 14,
  }),
};

export const CompanySwitch = (props: Props) => {
  const { options, totalCount, withoutCount, value } = props;
  const [selectedItem, setSelectedItem] = useState({
    value: '',
    label: '',
    count: withoutCount ? null : 0,
  });
  const [othersCount, setOthersCount] = useState(
    withoutCount ? null : totalCount
  );
  const [isLoading, setIsLoading] = useState(false);

  const selectRef: { current } = useRef();

  useEffect(() => {
    const selectedValue = filter(options, ['value', value])[0];
    if (!isEmpty(selectedValue)) {
      setSelectedItem(selectedValue as Option);
    }
  }, [value, options]);

  useEffect(() => {
    if (!withoutCount && !isNil(totalCount)) {
      setOthersCount(totalCount - (selectedItem.count || 0));
    }
  }, [selectedItem.count, totalCount]);

  useEffect(() => {
    setIsLoading(props.isLoading);
  }, [props.isLoading]);

  const onChangeSelect = (option) => {
    selectRef.current.select.blur();
    setSelectedItem(option);
    props.onChange(option.value);
  };

  const renderCountIcon = (selectedNum, othersNum) => {
    return (
      <>
        {!isNil(selectedNum) && (
          <span className="count-icon selected-count">{selectedNum}</span>
        )}
        {!isNil(othersNum) && othersNum > 0 && (
          <span className="count-icon others-count">{othersNum}</span>
        )}
      </>
    );
  };

  const SingleValue = (valueProps: SingleValueProps<any>) => {
    const { label } = valueProps.data;
    return (
      <components.SingleValue {...valueProps}>
        <span
          className={classnames([`${ROOT}__company-name`], {
            withCount: !withoutCount,
          })}
        >
          {`${msg().Com_Lbl_Company}: ${label}`}
        </span>
      </components.SingleValue>
    );
  };

  return (
    <div className={ROOT}>
      <Select
        ref={selectRef}
        className={`${ROOT}__selection`}
        closeMenuOnSelect={false}
        styles={customStyles}
        value={selectedItem}
        options={options}
        isSearchable={false}
        isLoading={isLoading}
        components={{ Option, SingleValue, NoOptionsMessage }}
        onChange={onChangeSelect}
        theme={(theme) => ({
          ...theme,
          colors: {
            ...theme.colors,
            primary25: '#f3f2f2',
            primary: '#ebf3f7',
          },
        })}
      />
      {!isLoading &&
        !withoutCount &&
        renderCountIcon(selectedItem.count, othersCount)}
    </div>
  );
};

CompanySwitch.defaultProps = {
  totalCount: 0,
  withoutCount: false,
};

export default CompanySwitch;
