import React, { FunctionComponent } from 'react';

import { OptionProps as Option } from '@apps/commons/components/fields/SearchableDropdown';
import CheckIcon from '@apps/commons/images/icons/CheckIcon.svg';

import LinkListItem from '@apps/mobile-app/components/atoms/LinkListItem';

import './SelectionFilter.scss';

const ROOT =
  'mobile-app-components-molecules-commons-advsearch-selection-filter';

type Props = {
  options: Array<Option>;
  selectedList: Array<string>;
  onClickOption: (selectedValue: string) => void;
  highlight?: string;
  limitCount?: number;
  hasZeroMsg?: string;
  hasMoreMsg?: string;
  isSingleSelect?: boolean;
};

const SelectionFilter: FunctionComponent<Props> = (props) => {
  const {
    options,
    selectedList,
    highlight,
    hasZeroMsg,
    hasMoreMsg,
    limitCount,
    isSingleSelect,
    onClickOption,
  } = props;

  const optionData = limitCount ? options.slice(0, limitCount) : options;

  // highlight searched keyword inside label
  const getHighlightedLabel = (label: string, keyword: string) => {
    const idx = label.toLowerCase().indexOf(keyword.toLowerCase());
    return (
      (idx > -1 && (
        <span>
          {label.substring(0, idx)}
          <b>{label.substring(idx, idx + keyword.length)}</b>
          {label.substring(idx + keyword.length)}
        </span>
      )) || <span>{label}</span>
    );
  };

  const renderOptionList = optionData.map(({ value, label }) => {
    const isChecked = selectedList.includes(value);
    return (
      <LinkListItem
        key={value}
        className={`${ROOT}__option-item`}
        noIcon={true}
        onClick={() => onClickOption(value)}
      >
        {highlight ? getHighlightedLabel(label, highlight) : label}
        <div className={`${ROOT}__option-item-select`}>
          {isSingleSelect ? (
            isChecked && <CheckIcon aria-hidden="true" />
          ) : (
            <input
              className={`${ROOT}__option-item-select-checkbox`}
              key={`${value}_${isChecked}`}
              type="checkbox"
              checked={isChecked}
            />
          )}
        </div>
      </LinkListItem>
    );
  });

  return (
    <div className={`${ROOT}__option-list`}>
      {renderOptionList}
      {options.length === 0 && hasZeroMsg && (
        <div key="hasZero" className={`${ROOT}__has-zero`}>
          {hasZeroMsg}
        </div>
      )}
      {options.length > limitCount && hasMoreMsg && (
        <div key="hasMore" className={`${ROOT}__has-more`}>
          {hasMoreMsg}
        </div>
      )}
    </div>
  );
};

export default SelectionFilter;
