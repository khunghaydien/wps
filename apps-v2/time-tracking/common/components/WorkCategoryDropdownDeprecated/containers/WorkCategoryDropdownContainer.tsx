import React, { useCallback, useMemo } from 'react';
import { Option } from 'react-select/src/filters';

import isNil from 'lodash/isNil';

import { Param } from '@apps/repositories/time-tracking/WorkCategoryRepository';

import { WorkCategory } from '../../../../../domain/models/time-tracking/WorkCategory';

import WorkCategoryDropdown from '../components/WorkCategoryDropdown';

import useWorkCategoryResource from './hooks/useWorkCategoryResource';

type SelectedWorkCategory = {
  workCategoryId: null | undefined | string;
  workCategoryCode: null | undefined | string;
  workCategoryName: null | undefined | string;
};

interface Props {
  'data-testid'?: string;
  readOnly?: boolean;
  selected: SelectedWorkCategory;
  onSelect: (value: WorkCategory) => void;
  onError: (e: Error) => void;
}

const WorkCategoryDropdownContainer: React.FC<Props & Param> = ({
  targetDate,
  startDate,
  endDate,
  jobId,
  selected,
  onSelect,
  onError,
  readOnly = false,
  ...props
}): React.ReactElement => {
  const workCategoryResourceParam = React.useMemo<
    | { jobId: string; targetDate: string }
    | { jobId: string; startDate: string; endDate: string }
  >(() => {
    if (targetDate) {
      return {
        jobId,
        targetDate,
      };
    } else {
      return {
        jobId,
        startDate,
        endDate,
      };
    }
  }, [jobId, targetDate, startDate, endDate]);

  const { workCategories, load, isLoading } = useWorkCategoryResource(
    workCategoryResourceParam
  );

  const selectedValue = useMemo(() => {
    const selectedValue = workCategories.find(
      (item) => item.id === selected.workCategoryId
    );
    if (isNil(selectedValue) && selected.workCategoryId) {
      // initial value
      return {
        id: selected.workCategoryId || '',
        code: selected.workCategoryCode || '',
        name: selected.workCategoryName || '',
      };
    } else if (selectedValue) {
      return selectedValue;
    } else {
      return undefined;
    }
  }, [
    workCategories,
    selected.workCategoryId,
    selected.workCategoryCode,
    selected.workCategoryName,
  ]);

  const onClickHandler = useCallback(async () => {
    try {
      await load();
    } catch (e) {
      onError(e);
    }
  }, [load, onError]);

  const onSelectHandler = React.useCallback(
    (option: Option) => {
      const workCategory: WorkCategory | null | undefined = workCategories.find(
        ({ id }) => id === option.value
      );
      if (workCategory) {
        onSelect(workCategory);
      } else {
        onSelect({ id: null, code: null, name: null });
      }
    },
    [workCategories, onSelect]
  );

  return (
    <WorkCategoryDropdown
      {...props}
      isLoading={isLoading}
      readOnly={readOnly}
      value={selectedValue}
      items={workCategories}
      onClick={onClickHandler}
      onSelect={onSelectHandler}
    />
  );
};

export default WorkCategoryDropdownContainer;
