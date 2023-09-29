import { connect } from 'react-redux';

import { changeRecordValue as changeTmpEditRecord } from '../action-dispatchers/Edit';
import { setEditRecord } from '../actions/editRecord';

import EmployeeProfileLinks from '../components/EmployeeProfileLinks';

const mapStateToProps = (state, ownProps) => {
  return {
    companyId: state.base.menuPane.ui.targetCompanyId,
    config: ownProps.config,
    selectedId: state.employee.ui.detail.baseRecord.id,
    editRecord: state.editRecord,
    isDisabled: ownProps.disabled,
    tmpEditRecord: state.tmpEditRecord,
  };
};

const mapDispatchToProps = {
  changeTmpEditRecord,
  setEditRecord,
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
)(EmployeeProfileLinks);
