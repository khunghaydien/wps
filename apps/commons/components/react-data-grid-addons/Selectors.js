import { createSelector } from 'reselect';

import filterRows from './RowFilterer';
import sortRows from './RowSorter';

const isEmptyObject = (obj) =>
  Object.keys(obj).length === 0 && obj.constructor === Object;

const getInputRows = (state) => state.rows;
const getFilters = (state) => state.filters;
const getFilteredRows = createSelector(
  [getFilters, getInputRows],
  (filters, rows = []) => {
    if (!filters || isEmptyObject(filters)) {
      return rows;
    }
    return filterRows(filters, rows);
  }
);

const getSortColumn = (state) => state.sortColumn;
const getSortDirection = (state) => state.sortDirection;
const getSortedRows = createSelector(
  [getFilteredRows, getSortColumn, getSortDirection],
  (rows, sortColumn, sortDirection) => {
    if (!sortDirection && !sortColumn) {
      return rows;
    }
    return sortRows(rows, sortColumn, sortDirection);
  }
);

const Selectors = {
  getRows: getSortedRows,
};
export default Selectors;
