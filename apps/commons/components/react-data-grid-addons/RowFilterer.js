const filterRows = (filters, rows = []) => {
  return rows.filter((r) => {
    let include = true;
    for (const columnKey in filters) {
      // eslint-disable-next-line no-prototype-builtins
      if (filters.hasOwnProperty(columnKey)) {
        const colFilter = filters[columnKey];
        // check if custom filter function exists
        if (
          colFilter.filterValues &&
          typeof colFilter.filterValues === 'function'
        ) {
          include = include & colFilter.filterValues(r, colFilter, columnKey);
        } else if (typeof colFilter.filterTerm === 'string') {
          // default filter action
          const rowValue = r[columnKey];
          if (rowValue !== undefined && rowValue !== null) {
            if (
              rowValue
                .toString()
                .toLowerCase()
                .indexOf(colFilter.filterTerm.toLowerCase()) === -1
            ) {
              include = include & false;
            }
          } else {
            include = include & false;
          }
        }
      }
    }
    return Boolean(include);
  });
};

export default filterRows;
