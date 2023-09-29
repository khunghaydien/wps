import React, { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { WorkCategory } from '../../domain/models/time-tracking/WorkCategory';

import { State } from '../modules';

import App from '../action-dispatchers/App';

import WorkCategoryDropdown from '../../time-tracking/WorkCategoryDropdown';

type SelectedWorkCategory = {
  workCategoryId: null | undefined | string;
  workCategoryCode: null | undefined | string;
  workCategoryName: null | undefined | string;
};

type Props = Readonly<{
  jobId: string;
  selected: SelectedWorkCategory;
  onSelect: (value: WorkCategory) => void;
  readOnly: boolean;
}>;

const WorkCategoryDropdownContainer: React.FC<Props> = ({
  jobId,
  selected,
  onSelect,
  readOnly,
}: Props): React.ReactElement => {
  const targetDate = useSelector(
    (state: State) => state.ui.dailySummary.targetDate || ''
  );
  const dispatch = useDispatch();
  const onError = useCallback(
    (e: Error) => {
      App(dispatch).showErrorNotification(e);
    },
    [dispatch]
  );

  return (
    <WorkCategoryDropdown
      readOnly={readOnly}
      jobId={jobId}
      selected={selected}
      targetDate={targetDate}
      onError={onError}
      onSelect={onSelect}
    />
  );
};

export default WorkCategoryDropdownContainer;
