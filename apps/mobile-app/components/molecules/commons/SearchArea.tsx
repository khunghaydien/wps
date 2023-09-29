import React, { FunctionComponent } from 'react';

import classNames from 'classnames';

import msg from '../../../../commons/languages';

import { FilterList } from '@apps/mobile-app/containers/pages/expense/CustomRequestContainer';

import Icon from '../../atoms/Icon';
import TextButton from '../../atoms/TextButton';

import './SearchArea.scss';

const ROOT = 'mobile-app-molecules-search-area-filter';

type Props = {
  filterList: FilterList;
  onClickFilterItem: (key: string) => void;
  onClickResetSearchCondition: () => void;
};

const SearchArea: FunctionComponent<Props> = (props) => {
  const { filterList, onClickFilterItem, onClickResetSearchCondition } = props;
  return (
    <div className={`${ROOT}__search-area`}>
      {filterList.map((filterItem) => (
        <button
          key={filterItem.key}
          type="button"
          className={classNames([`${ROOT}__filter-tag`], {
            highlight: !!filterItem.count,
          })}
          onClick={() => {
            onClickFilterItem(filterItem.key);
          }}
        >
          <span className={`${ROOT}__filter-tag-label`}>
            {filterItem.count === 1 ? filterItem.value : filterItem.label}
          </span>
          {filterItem.count > 1 && (
            <span className={'count-icon'}>{filterItem.count}</span>
          )}
          <Icon type="down" size="small" />
        </button>
      ))}
      <TextButton
        className={`${ROOT}__search-area-reset`}
        type="submit"
        onClick={onClickResetSearchCondition}
      >
        {msg().Com_Lbl_ResetAll}
      </TextButton>
    </div>
  );
};

export default SearchArea;
