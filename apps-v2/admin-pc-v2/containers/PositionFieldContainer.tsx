import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import get from 'lodash/get';

import msg from '../../commons/languages';
import { catchBusinessError } from '@apps/commons/actions/app';
import TextUtil from '@apps/commons/utils/TextUtil';

import { defaultValue } from '../../domain/models/organization/MasterEmployeeBase';

import { actions as positionDialogActions } from '@admin-pc-v2/modules/employee/ui/positionDialog';

import * as position from '@admin-pc-v2/actions/position';

import PositionSearchDialog from '@admin-pc-v2/components/PositionSearchDialog';
import ClearableField from '@admin-pc/components/Common/ClearableField';

const mapStateToProps = (state) => ({
  isDialogOpen: state.employee.ui.positionDialog,
  sortCondition: state.base.listPane.ui.sortCondition,
});

const mapDispatchToProps = (dispatch) =>
  bindActionCreators(
    {
      showDialog: positionDialogActions.show,
      hideDialog: positionDialogActions.hide,
      search: position.searchPosition,
      catchBusinessError,
    },
    dispatch
  );

const getLabel = (tmpEditRecord) => {
  const position = get(tmpEditRecord, 'position', defaultValue);
  const code = position.code || '';
  const name = position.name || '';
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
    ownProps.onChangeDetailItem('position', updatedInfo);
  },
  dialog: PositionSearchDialog,

  dialogProps: {
    singleSelection: true,
    targetDate: ownProps.tmpEditRecord.validDateFrom,
    maxNum: 100,
    hideDialog: dispatchProps.hideDialog,
    search: (code, name) => {
      const companyId = ownProps.tmpEditRecord.companyId;
      if (!companyId) {
        dispatchProps.catchBusinessError(
          msg().Com_Lbl_Error,
          TextUtil.template(msg().Com_Err_NullValue, 'companyId'),
          null
        );
        return;
      }
      const param = {
        code,
        name,
        active: true,
        companyId,
      };
      return dispatchProps.search(param);
    },
    setPosition: (positions) => {
      const { id, code, name } = positions[0];
      ownProps.onChangeDetailItem(ownProps.config.key, id);
      const positionInfo = {
        name,
        code,
      };
      ownProps.onChangeDetailItem('position', positionInfo);
      dispatchProps.hideDialog();
    },
  },

  isDialogOpen: stateProps.isDialogOpen,
  labelSelectBtn: msg().Admin_Lbl_SelectPosition,
  label: getLabel(ownProps.tmpEditRecord),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
  mergeProps
)(ClearableField);
