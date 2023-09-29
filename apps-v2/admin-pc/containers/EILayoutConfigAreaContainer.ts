import { connect } from 'react-redux';

import { changeRecordValue } from '../action-dispatchers/Edit';

import { State } from '../reducers/index';

import { Config } from '../utils/ConfigUtil';

import EILayoutConfigArea from '../components/ExtendedItemLayoutConfig/EILayoutConfigArea';

export type OwnProps = {
  config: Config;
  disabled: boolean;
};

const mapStateToProps = (state: State, ownProps: OwnProps) => ({
  disabled: ownProps.disabled,
  config: ownProps.config,
  editRecord: state.editRecord,
  tmpEditRecord: state.tmpEditRecord,
});

const mapDispatchToProps = {
  changeRecordValue,
};

const mergeProps = (stateProps, dispatchProps) => ({
  ...stateProps,
  ...dispatchProps,
  onChangeDetailItem: (key, value, charType) =>
    dispatchProps.changeRecordValue(key, value, charType),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
  mergeProps
)(EILayoutConfigArea);
