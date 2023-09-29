import React, { ComponentType, useCallback } from 'react';

import { useModalDeprecated as useModal } from '../../../core';

import TimeTrackJobRepository from '../../../repositories/time-tracking/TimeTrackJobRepository';

import {
  Jobable,
  TimeTrackJobRepository as TimeTrackJobRepositoryInterface,
} from '../../../domain/models/time-tracking/Job';

import withErrorBoundary from '../utils/withErrorBoundary';

import JobSelectDialog, { Props } from '../components/JobSelectDialog';

import useBreadcrumb from './useBreadcrumb';
import useConditionalSearchHook from './useConditionalSearch';
import useDecideUseConditionalSearch from './useDecideUseConditionalSearch';
import useJobTree, { JobTree } from './useJobTree';

type Show = () => void;
type Hide = () => void;

interface JobRepositoryInterface<T extends Jobable> {
  searchAll: TimeTrackJobRepositoryInterface<T>['searchAll'];
  allHierarchicalSearch: TimeTrackJobRepositoryInterface<T>['allHierarchicalSearch'];
}

interface JobSelectDialogType<T extends Jobable> {
  readonly options: JobTree<T>;
  readonly selectedItem: T | null | undefined;
  initialize: () => Promise<void>;
  select: (level: number, job: T, key: string) => void;
  search: (key: string, parent: T, codeOrName: string) => void;
  reset: () => void;
  publish: () => void;
  isVisitedItem: (arg0: T) => boolean;
}

const useJobSelectDialogDeprecated = <T extends Jobable>(
  targetDate: string,
  onOk: (arg0: { id: string }) => void,
  onError: (error: Error) => void,
  repository: JobRepositoryInterface<T> = TimeTrackJobRepository as JobRepositoryInterface<T>,
  empId: string,
  companyId: string
): JobSelectDialogType<T> => {
  const breadcrumb = useBreadcrumb();
  const jobTree = useJobTree();

  const appendChildren = useCallback(
    async (parent: T, key: string) => {
      try {
        jobTree.removeBelow(key);
        if (parent.hasChildren) {
          const children = await repository.searchAll({
            codeOrName: '',
            targetDate,
            parent,
            empId,
            companyId,
          });
          jobTree.append(children, { parent, codeOrName: '' });
        }
      } catch (e) {
        onError(e);
      }
    },
    [empId, companyId, targetDate, repository, onError]
  );

  const searchInHierarchy = useCallback(
    async (key: string, parent: T, codeOrName: string) => {
      try {
        breadcrumb.leave(jobTree.getLevelByKey(key));
        jobTree.remove(key);
        const children = await repository.searchAll({
          codeOrName,
          targetDate,
          parent,
          empId,
          companyId,
        });
        jobTree.append(children, { parent, codeOrName });
      } catch (e) {
        onError(e);
      }
    },
    [jobTree.getLevelByKey, empId, companyId, targetDate, repository, onError]
  );

  return React.useMemo(
    () =>
      ({
        initialize: async () => {
          try {
            const tree = await repository.searchAll({
              codeOrName: '',
              targetDate,
              empId,
              companyId,
            });
            jobTree.append(tree, { parent: undefined, codeOrName: '' });
          } catch (e) {
            onError(e);
          }
        },
        select: (level: number, job: T, key: string) => {
          const child = breadcrumb.current;
          breadcrumb.visit(level, job);

          const isRoot = child === null;
          if (isRoot || !breadcrumb.isVisited(job)) {
            appendChildren(job, key);
          }
        },
        search: (key, parent, codeOrName) => {
          searchInHierarchy(key, parent, codeOrName);
        },
        publish: () => {
          if (breadcrumb.current) {
            onOk(breadcrumb.current);
          }
        },
        reset: () => {
          jobTree.reset();
          breadcrumb.reset();
        },
        options: jobTree.state,
        selectedItem: breadcrumb.current,
        isVisitedItem: breadcrumb.isVisited,
      } as JobSelectDialogType<T>),
    [
      empId,
      companyId,
      targetDate,
      appendChildren,
      jobTree,
      breadcrumb,
      repository,
    ]
  );
};

const useErrorBoundary = <T extends Jobable>(
  onError: (error: Error) => void,
  component: ComponentType<Props<T>>
): ComponentType<Props<T>> => {
  return React.useMemo(() => {
    return withErrorBoundary(onError)(component);
  }, []);
};

export default <T extends Jobable>({
  targetDate,
  onOk,
  onError,
  repository = TimeTrackJobRepository as JobRepositoryInterface<T>,
  companyId,
  empId,
  isTargetDateFieldEnabled,
  updateTargetDate,
  useConditionalSearch,
}: {
  targetDate: string;
  onOk: (arg0: T) => void;
  onError: (error: Error) => void;
  repository?: JobRepositoryInterface<T>;
  companyId?: string;
  empId?: string;
  isTargetDateFieldEnabled?: boolean;
  updateTargetDate?: (arg0) => void;
  useConditionalSearch?: boolean;
}): [Show, Hide] => {
  const [show, hide] = useModal(
    ({ onClose, ...modalProps }: { isModal: boolean; onClose: () => void }) => {
      const {
        options,
        selectedItem,
        isVisitedItem,
        initialize,
        select,
        search,
        reset,
        publish,
      } = useJobSelectDialogDeprecated(
        targetDate,
        onOk,
        onError,
        repository,
        empId,
        companyId
      );

      const conditionalSearchRepository = React.useMemo(
        () =>
          ({ codeOrName }: { codeOrName: string }) =>
            repository.allHierarchicalSearch({
              companyId,
              empId,
              targetDate,
              codeOrName,
            }),
        [repository, companyId, empId, targetDate]
      );
      const conditionalSearchProps = useConditionalSearchHook<T>({
        repository: conditionalSearchRepository,
        onOk,
        onError,
      });

      const decidedUseConditionalSearch =
        useDecideUseConditionalSearch(useConditionalSearch);

      const initializeExploreInHierarchy = React.useCallback(() => {
        initialize();
        return () => {
          reset();
          // Abort all tasks loading data
          for (const option of options) {
            if (!Array.isArray(option.value)) {
              option.value.return();
            }
          }
        };
      }, [targetDate]);

      const JobSelectDialogWithErrorBoundary: ComponentType<Props<T>> =
        useErrorBoundary<T>(onError, JobSelectDialog);

      const onUpdateTargetDate = (e) => {
        if (targetDate !== e) {
          reset();
          updateTargetDate(e);
        }
      };

      return (
        <JobSelectDialogWithErrorBoundary
          {...modalProps}
          data-testid="time-tracking/JobSelectDialog"
          onClose={() => {
            onClose();
            reset();
          }}
          targetDate={targetDate}
          isTargetDateFieldEnabled={isTargetDateFieldEnabled}
          updateTargetDate={onUpdateTargetDate}
          exploreInHierarchyProps={{
            initialize: initializeExploreInHierarchy,
            jobsList: options,
            selectedJob: selectedItem,
            isOpenedJob: isVisitedItem,
            onClickItem: select,
            onSearch: search,
            onOk: (_e) => {
              publish();
              onClose();
              reset();
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
    },
    [empId, targetDate]
  );

  return [show, hide];
};
