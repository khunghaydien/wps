import { connect } from 'react-redux';

import { changeRecordValue as changeTmpEditRecord } from '../action-dispatchers/Edit';

import FinancePresetItems from '@admin-pc/components/FinancePresetItems';

const mapStateToProps = (state, ownProps) => {
  return {
    editRecord: state.editRecord,
    isDisabled: ownProps.disabled,
    tmpEditRecord: state.tmpEditRecord,
  };
};

const mapDispatchToProps = {
  changeTmpEditRecord,
};

const mergeProps = (stateProps, dispatchProps) => ({
  ...stateProps,
  ...dispatchProps,
  onChangeDetailItem: (key, value, charType) => {
    dispatchProps.changeTmpEditRecord(key, value, charType);
  },
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
  mergeProps
)(FinancePresetItems);
