import React from 'react';
import { shallowEqual, useSelector } from 'react-redux';

import { State } from '../modules';

import DisplayFieldLayoutItemTable, {
  Props,
} from '../components/MainContent/Timesheet/DisplayFieldLayoutItemTable';

const mapStateToProps = (state: State) => ({
  isLoading: state.ui.dailyRecordDisplayFieldLayout.isLoading,
  layoutRow: state.ui.dailyRecordDisplayFieldLayout.layoutRow,
  layoutValues: state.ui.dailyRecordDisplayFieldLayout.layoutValues,
});

const DisplayFieldLayoutItemTableContainer: React.FC<Props> = (props) => {
  const statesProps = useSelector(mapStateToProps, shallowEqual);

  return <DisplayFieldLayoutItemTable {...props} {...statesProps} />;
};

export default DisplayFieldLayoutItemTableContainer;
