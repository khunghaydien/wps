import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import DateUtil from '@commons/utils/DateUtil';

import { actions as dialogActions } from '@apps/admin-pc-v2/modules/departmentManager/ui/dialog';

import * as departmentManager from '@admin-pc-v2/actions/departmentManager';

import DepartmentManagerDialog from '@apps/admin-pc-v2/presentational-components/OrganizationHierarchy/DepartmentManagerDialog';

type OwnProps = {
  orgPatternId: string;
  deptBaseId: string;
  deptName: string;
  validFrom: string;
  validTo: string;
};

const mapStateToProps = (_) => ({});

const mapDispatchToProps = (dispatch) => {
  const alias = {
    search: departmentManager.searchDepartmentManager,
    setDialog: dialogActions.set,
  };
  const actions = bindActionCreators(alias, dispatch);
  return { actions };
};

const mergeProps = (_, dispatchProps, ownProps: OwnProps) => ({
  deptName: ownProps.deptName,
  search: () => {
    return dispatchProps.actions.search({
      hierarchyPatternIds: [ownProps.orgPatternId],
      deptBaseIds: [ownProps.deptBaseId],
      validFrom: ownProps.validFrom,
      validTo: DateUtil.addDays(ownProps.validTo, 1),
    });
  },
  setDialog: (dialog) => dispatchProps.actions.setDialog(dialog),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
  mergeProps
)(DepartmentManagerDialog) as unknown as React.ComponentType<OwnProps>;
