import React, { useCallback, useMemo } from 'react';

import TimeTrackJobHistoryRepository from '@apps/repositories/time-tracking/TimeTrackJobHistoryRepository';
import TimeTrackJobRepository from '@apps/repositories/time-tracking/TimeTrackJobRepository';

import { Job } from '@apps/domain/models/time-tracking/Job';
import { JobHistory } from '@apps/domain/models/time-tracking/JobHistory';

import withErrorBoundary, { CatchError } from './utils/withErrorBoundary';

import JobSelectDialogView from './components/JobSelectDialog';

import useConditionalSearchHook from './hooks/useConditionalSearch';
import useDecideUseConditionalSearch from './hooks/useDecideUseConditionalSearch';
import { useLevelState } from './hooks/useLevelState';

export { default as JobSelectDialog } from './components/JobSelectDialog';
export { default as useJobSelectDialog } from './hooks/useJobSelectDialogDeprecated';

type TargetDateQuery = {
  targetDate: string;
  startDate?: never;
  endDate?: never;
  empId?: string;
};

type DateRangeQuery = {
  targetDate?: never;
  startDate: string;
  endDate: string;
  empId?: string;
};

type Query = TargetDateQuery | DateRangeQuery;

type Props = {
  useHistory?: boolean;
  useConditionalSearch?: boolean;
  query: Query;
  onSelect: (value: Job | JobHistory) => void;
  onClose: () => void;
  onError: CatchError;
};

const searchChildrenByTargetDate =
  (targetDate: string, empId?: string) =>
  ({
    parent = undefined,
    codeOrName = '',
  }: {
    parent?: Job;
    codeOrName?: string;
  }): AsyncGenerator<Job, void, void> =>
    TimeTrackJobRepository.searchAll({
      codeOrName,
      parent,
      targetDate,
      empId,
    });

const searchChildrenByDateRange =
  (startDate: string, endDate: string, empId?: string) =>
  ({
    parent = undefined,
    codeOrName = '',
  }: {
    parent?: JobHistory;
    codeOrName?: string;
  }): AsyncGenerator<JobHistory, void, void> =>
    TimeTrackJobHistoryRepository.searchAll({
      codeOrName,
      parent,
      startDate,
      endDate,
      empId,
    });

const JobSelectDialog: React.FC<Props> = ({
  useHistory = false,
  useConditionalSearch,
  query,
  onSelect,
  onClose,
  onError,
}: Props) => {
  const searchChildren: ({
    parent,
    codeOrName,
  }: {
    parent?: Job | JobHistory;
    codeOrName?: string;
  }) => AsyncGenerator<Job | JobHistory, void, void> = useCallback(
    useHistory
      ? searchChildrenByDateRange(query.startDate, query.endDate, query.empId)
      : searchChildrenByTargetDate(query.targetDate, query.empId),
    [useHistory, query.endDate, query.startDate, query.targetDate]
  );
  const { state, selectedItems, current, select, search, clear, initialize } =
    useLevelState({
      searchChildren,
    });

  const conditionalSearchRepository = React.useMemo(
    () =>
      useHistory
        ? ({ codeOrName }: { codeOrName: string }) =>
            TimeTrackJobHistoryRepository.allHierarchicalSearch({
              empId: query.empId,
              startDate: query.startDate,
              endDate: query.endDate,
              codeOrName,
            })
        : ({ codeOrName }: { codeOrName: string }) =>
            TimeTrackJobRepository.allHierarchicalSearch({
              empId: query.empId,
              targetDate: query.targetDate,
              codeOrName,
            }),
    [useHistory, query.empId, query.targetDate, query.startDate, query.endDate]
  );
  const conditionalSearchProps = useConditionalSearchHook({
    repository: conditionalSearchRepository,
    onOk: onSelect,
    onError,
  });

  const decidedUseConditionalSearch =
    useDecideUseConditionalSearch(useConditionalSearch);

  const Component = useMemo(
    () => withErrorBoundary(onError)(JobSelectDialogView),
    [onError]
  );
  return (
    <Component
      isModal
      onClose={(): void => {
        onClose();
        clear();
      }}
      exploreInHierarchyProps={{
        initialize,
        jobsList: state,
        onClickItem: select,
        selectedJob: current,
        isOpenedJob: (item): boolean =>
          selectedItems.some(({ id }) => item.id === id),
        onSearch: search,
        onOk: (_e) => {
          onSelect(current);
          onClose();
          clear();
        },
      }}
      conditionalSearchProps={{
        ...conditionalSearchProps,
        onOk: (_e) => {
          conditionalSearchProps.onOk();
          onClose();
        },
      }}
      useConditionalSearch={decidedUseConditionalSearch}
    />
  );
};

export default JobSelectDialog;
