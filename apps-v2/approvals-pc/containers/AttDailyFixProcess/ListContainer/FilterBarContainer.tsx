import * as React from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { State } from '@apps/approvals-pc/modules';
import { actions as recordAction } from '@apps/approvals-pc/modules/ui/attFixDaily/records';

import Component from '@apps/approvals-pc/components/attendance/AttDailyFixProcess/List/FilterBar';

const FilterBarContainer: React.FC = () => {
  const dispatch = useDispatch();
  const records = useSelector(
    (state: State) => state.ui.attFixDaily.records.originalRecords
  );
  const searchQuery = useSelector(
    (state: State) => state.ui.attFixDaily.records.searchQuery
  );
  const changeQuery = React.useCallback(
    (searchQuery: Parameters<typeof recordAction.filter>[0]) => {
      dispatch(recordAction.filter(searchQuery));
    },
    [dispatch]
  );

  return (
    <Component
      records={records}
      searchQuery={searchQuery}
      changeQuery={changeQuery}
    />
  );
};

export default FilterBarContainer;
