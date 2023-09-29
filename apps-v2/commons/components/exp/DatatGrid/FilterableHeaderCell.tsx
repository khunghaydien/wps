import React from 'react';
import { Column } from 'react-data-grid';

import msg from '@apps/commons/languages';
import { useDebouncedHandleChange } from '@apps/core/hooks';

const ROOT = 'ts-exp-data-grid-filterable-header-cell';

type Props<T> = {
  column: Column<T>;
  debounce?: boolean;
  onChange: (arg0: any) => void;
};

const FilterableHeaderCell = <T,>(props: Props<T>) => {
  const { onChange, column, debounce = false } = props;

  const handleChange = (e) => {
    const filterTerm = e.target.value || '';
    onChange({ filterTerm, column });
  };

  const debouncedHandleChange = useDebouncedHandleChange(
    debounce,
    300,
    handleChange
  );

  const renderInput = () => {
    if (column.filterable === false) {
      return <span />;
    }

    const inputKey = `${ROOT}` + column.key;
    return (
      <input
        key={inputKey}
        type="text"
        className={`${ROOT} input`}
        placeholder={msg().Com_Lbl_Search}
        onChange={debouncedHandleChange}
      />
    );
  };

  return <>{renderInput()}</>;
};

export default FilterableHeaderCell;
