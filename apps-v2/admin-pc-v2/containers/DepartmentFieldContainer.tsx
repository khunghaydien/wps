import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import get from 'lodash/get';

import msg from '../../commons/languages';
import DateUtil from '@commons/utils/DateUtil';

import { defaultValue } from '../../domain/models/organization/MasterEmployeeBase';

import { actions as departmentDialogActions } from '@admin-pc-v2/modules/employee/ui/departmentDialog';

import { searchDepartmentByQuery } from '@admin-pc-v2/action-dispatchers/employee/Detail';

import DepartmentSearchDialog from '@admin-pc-v2/components/DepartmentSearchDialog';
import ClearableField from '@admin-pc/components/Common/ClearableField';

const mapStateToProps = (state) => ({
  isDialogOpen: state.employee.ui.departmentDialog,
  sortCondition: state.base.listPane.ui.sortCondition,
});

const mapDispatchToProps = (dispatch) =>
  bindActionCreators(
    {
      showDialog: departmentDialogActions.show,
      hideDialog: departmentDialogActions.hide,
      search: searchDepartmentByQuery,
    },
    dispatch
  );

const getLabel = (tmpEditRecord) => {
  const department = get(tmpEditRecord, 'department', defaultValue);
  const code = department.code || '';
  const name = department.name || '';
  const divider = code && name ? ' - ' : '';
  const label = code + divider + name;
  return label;
};

const mergeProps = (stateProps, dispatchProps, ownProps) => ({
  ...ownProps,
  ...stateProps,
  ...dispatchProps,
  openDialog: () => {
    dispatchProps.showDialog();
  },
  onClickClearBtn: () => {
    const updatedInfo = { name: '', code: '' };
    ownProps.onChangeDetailItem(ownProps.config.key, null);
    ownProps.onChangeDetailItem('department', updatedInfo);
  },
  dialog: DepartmentSearchDialog,

  dialogProps: {
    singleSelection: true,
    targetDate: ownProps.tmpEditRecord.validDateFrom || DateUtil.getToday(),
    maxNum: 100,
    hideDialog: dispatchProps.hideDialog,
    isHideDateSearch: true,
    search: (code, name, targetDate) => {
      const companyId = ownProps.tmpEditRecord.companyId;
      const param = {
        code,
        name,
        targetDate,
        companyId,
        sortCondition: stateProps.sortCondition,
      };
      return dispatchProps.search(param);
    },
    setDepartment: (department) => {
      const { id, code, name } = department;
      ownProps.onChangeDetailItem(ownProps.config.key, id);
      const deptInfo = {
        name,
        code,
      };
      ownProps.onChangeDetailItem('department', deptInfo);
      dispatchProps.hideDialog();
    },
  },

  isDialogOpen: stateProps.isDialogOpen,
  labelSelectBtn: msg().Admin_Lbl_SelectDepartment,
  label: getLabel(ownProps.tmpEditRecord),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
  mergeProps
)(ClearableField);
