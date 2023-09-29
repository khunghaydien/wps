import React, { useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { bindActionCreators } from 'redux';

import msg from '../../commons/languages';

import { defaultValue } from '../../domain/models/organization/MasterEmployeeBase';

import { MODE } from '../modules/base/detail-pane/ui';
import { actions as employeeUIDetailActions } from '../modules/employee/ui/detail';
import { actions as userDialogActions } from '../modules/employee/ui/userDialog';

import { State } from '../reducers';

import Component from '../components/Common/ClearableField';

import UserSearchDialog from './UserContainer/UserSearchDialogContainer';

const mapStateToProps = (state: State) => ({
  isDialogOpen: state.employee.ui.userDialog,
});

const getLabel = (baseRecord) => {
  const { name = defaultValue.name, userName = defaultValue.userName } =
    baseRecord;
  const divider = name && userName ? ' - ' : '';
  const label = name + divider + userName;
  return label;
};

const UserSearchDialogContainer = () => {
  const props = useSelector(mapStateToProps);
  const dispatch = useDispatch();

  const Actions = useMemo(
    () =>
      bindActionCreators(
        {
          changeBaseRecordValue:
            employeeUIDetailActions.setBaseRecordByKeyValue,
          showDialog: userDialogActions.show,
        },
        dispatch
      ),
    [dispatch]
  );

  const baseRecord = useSelector(
    (state: State) => state.employee.ui.detail.baseRecord
  );

  const mode = useSelector((state: State) => state.base.detailPane.ui.modeBase);

  return (
    <Component
      {...props}
      onClickClearBtn={() => {
        Actions.changeBaseRecordValue('userId', '');
        Actions.changeBaseRecordValue('name', '');
        Actions.changeBaseRecordValue('userName', '');
      }}
      dialog={UserSearchDialog}
      openDialog={() => {
        Actions.showDialog();
      }}
      dialogProps={{
        singleSelection: true,
      }}
      labelSelectBtn={msg().Admin_Lbl_SelectSalesforceUser}
      label={getLabel(baseRecord)}
      disabled={mode !== MODE.EDIT && mode !== MODE.NEW}
    />
  );
};
export default UserSearchDialogContainer;
