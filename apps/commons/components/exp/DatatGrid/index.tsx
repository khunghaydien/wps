import React, { useEffect, useMemo, useRef, useState } from 'react';
import ReactDataGrid, { Column } from 'react-data-grid';

import { $Values } from 'utility-types';

import { Data } from '@commons/components/react-data-grid-addons';

import './index.scss';

const ROOT = 'ts-exp-data-grid';

export const SORT = {
  ASC: 'ASC',
  DESC: 'DESC',
  NONE: 'NONE',
} as const;

export type SortDirection = $Values<typeof SORT>;

type Props<T> = {
  columns: Column<T>[];
  data: Array<T>;
  enableCellSelect?: boolean;
  minWidth?: number;
  onRowClick?: any;
  rowHeight?: number;
  rowSelection?: any;
  visibleRowNum?: number;
  getCellActions: (column: Column<T>, row: T) => any;
  onGridSort?: (sortColumn: string, sortDirection: SortDirection) => void;
  setCount?: (count: number) => void;
};

const Grid = <T,>({
  columns,
  data,
  visibleRowNum,
  enableCellSelect,
  rowHeight = 35,
  ...props
}: Props<T>): React.ReactElement => {
  const reactDataGridRef = useRef(null);
  const [filters, setFilters] = useState({});
  const [filteredRows, setFilteredRows] = useState([]);
  const selectors = Data.Selectors;
  const isFilterable = columns.some((o) => o.filterable);
  const rows = isFilterable ? filteredRows : data;

  // Get rows using selectors
  const getFilteredRows = (r, f) => {
    return selectors.getRows({ rows: r, filters: f });
  };

  // Get row from filtered rows
  const getRow = (index) => {
    return filteredRows[index];
  };

  // Set rows
  useEffect(() => {
    setFilteredRows(getFilteredRows(data, filters));
  }, [data, filters, isFilterable]);

  // Automatically toggle the filter if any rows are tagged as filterable
  useEffect(() => {
    if (reactDataGridRef) {
      if (columns && columns.some((col) => col.filterable)) {
        reactDataGridRef.current.onToggleFilter();
      }
    }
  }, [reactDataGridRef]);

  useEffect(() => {
    if (props.setCount) {
      props.setCount(filteredRows.length);
    }
  }, [filteredRows]);

  // Get minimum grid height
  const getMinHeight = useMemo(() => {
    let minHeight = 350;
    if (visibleRowNum !== 0) {
      minHeight = rowHeight;

      if (rows.length > 0) {
        const numberOfRows =
          rows.length > visibleRowNum ? visibleRowNum : rows.length;
        minHeight += numberOfRows * rowHeight;
      }
      const borderOffset = 1;
      minHeight += borderOffset;
      const searchFilterHeight = 45;
      if (isFilterable) {
        minHeight += searchFilterHeight;
      }
    }
    return minHeight;
  }, [visibleRowNum, rows, rowHeight]);

  // Handle updating filters
  const handleFilterChange = (filter) => (filters) => {
    const newFilters = { ...filters };
    if (filter.filterTerm) {
      newFilters[filter.column.key] = filter;
    } else {
      delete newFilters[filter.column.key];
    }
    return newFilters;
  };

  // Set filters
  const handleAddFilter = (filter) => setFilters(handleFilterChange(filter));

  // Clear filters
  const handleClearFilters = () => setFilters({});

  return (
    <div className={ROOT}>
      <ReactDataGrid
        ref={reactDataGridRef}
        columns={columns}
        rowGetter={getRow}
        rowsCount={rows.length}
        onAddFilter={handleAddFilter}
        onClearFilters={handleClearFilters}
        enableCellSelect={enableCellSelect}
        rowHeight={rowHeight}
        getCellActions={props.getCellActions}
        minHeight={getMinHeight}
        minWidth={props.minWidth}
        rowSelection={props.rowSelection}
        onRowClick={props.onRowClick}
        onGridSort={props.onGridSort}
      />
    </div>
  );
};

export default Grid;
