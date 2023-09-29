import React, { ChangeEvent } from 'react';

import { CheckBox } from '@apps/core';
import { buildColumnCss, Column } from '@commons/utils/exp/BulkEditUtil';

import { Record } from '@apps/domain/models/exp/Record';

type Props = {
  columns: Column[];
  data: Record[];
  maxSelection: number;
  parentClass: string;
  selected: number[];
  onChangeSelectAll: (event: ChangeEvent<HTMLInputElement>) => void;
};

const GridHead = ({
  columns,
  data,
  maxSelection,
  onChangeSelectAll,
  parentClass,
  selected,
}: Props) => {
  const isSelectedAllChecked = () => {
    const maxSelected = selected.length === maxSelection;
    const noPendingRequest =
      data.length > 0 && data.every((_, idx: number) => selected.includes(idx));
    return maxSelected || noPendingRequest;
  };

  return (
    <thead className={`${parentClass}__thead`}>
      <tr className={`${parentClass}__thead__tr`}>
        <th className={`${parentClass}__thead__th`}>
          <CheckBox
            checked={isSelectedAllChecked()}
            onChange={onChangeSelectAll}
          />
        </th>
        {columns.map((column: Column) => (
          <th
            key={column.key as string}
            style={buildColumnCss(column)}
            className={`${parentClass}__thead__th`}
          >
            {column.name}
          </th>
        ))}
      </tr>
    </thead>
  );
};

export default GridHead;
