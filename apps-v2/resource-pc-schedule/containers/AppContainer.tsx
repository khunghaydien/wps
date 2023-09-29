import React from 'react';
import { useDispatch, useSelector } from 'react-redux';

import ScheduleDetails from '../../commons/components/psa/ScheduleDetails';
import GlobalContainer from '../../commons/containers/GlobalContainer';
import ToastContainer from '../../commons/containers/ToastContainer';

import '../modules';
import type { State } from '../modules';

import Resource from '../action-dispatchers/Resource';

const mapStateToProps = (state: State) => ({
  companyId: state.userSetting.companyId,
  employeeId: state.userSetting.employeeId,
  resourceAvailability: state.ui.resourceAvailability,
  selectedRole: state.entities.role.role,
});

const AppContainer = () => {
  const props = useSelector(mapStateToProps);
  const { selectedRole } = props;
  const dispatch = useDispatch();
  const resource = Resource(dispatch);

  const selectView = (page: number, view: string, nextStartDate: string) => {
    resource.setView({
      page,
      bookedTimePerDay: [selectedRole.assignment.bookedTimePerDay],
      view,
      nextStartDate,
      roleStartDate: props.selectedRole.startDate,
    });
  };

  return (
    <GlobalContainer>
      <ToastContainer />
      {selectedRole && selectedRole.roleId && (
        <ScheduleDetails selectView={selectView} isOmitFields {...props} />
      )}
    </GlobalContainer>
  );
};

export default AppContainer;
