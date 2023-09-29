import React from 'react';
import { shallowEqual, useSelector } from 'react-redux';

import { State } from '../../../../reducers';

import PatternButton from '../../../../presentational-components/WorkingType/Fields/AttPattern';

import PatternDialogContainer from './PatternDialogContainer';

type OwnProps = {
  disabled: boolean;
  tmpEditRecordBase: any;
};

const PatternButtonContainer: React.FC<OwnProps> = (props) => {
  const {
    disabled,
    tmpEditRecordBase: { workSystem },
  } = props;

  const selectedPattern = useSelector(
    (state: State) =>
      state.workingType.ui.pattern.selectedPattern.selectedPattern,
    shallowEqual
  );

  return (
    <PatternButton
      disabled={disabled}
      workSystem={workSystem}
      selectedPattern={selectedPattern}
      PatternDialogContainer={PatternDialogContainer}
    />
  );
};

export default PatternButtonContainer;
