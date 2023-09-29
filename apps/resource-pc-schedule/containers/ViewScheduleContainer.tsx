import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AnyAction } from 'redux';
import { ThunkDispatch } from 'redux-thunk';

import ScheduleDetails from '@apps/commons/components/psa/ScheduleDetails';
import { processView } from '@apps/commons/utils/psa/resourcePlannerUtil';

import { State } from '../modules';

import { setResourceAvailability } from '@resource/action-dispatchers/Resource';

const ViewScheduleContainer = () => {
  const dispatch = useDispatch() as ThunkDispatch<unknown, void, AnyAction>;

  const resourceAvailability = useSelector(
    (state: State) => state.ui.resourceAvailability
  );
  const selectedRole = useSelector(
    (state: State) => state.entities.psa.role.role
  );

  const selectView = (page: number, view: string, nextStartDate: string) => {
    dispatch(
      setResourceAvailability(
        processView(
          page,
          [selectedRole.assignment.bookedTimePerDay],
          view,
          nextStartDate,
          selectedRole.assignment.startDate
        )
      )
    );
  };

  return (
    <ScheduleDetails
      resourceAvailability={resourceAvailability}
      selectedRole={selectedRole}
      selectView={selectView}
      isOmitFields
    />
  );
};

export default ViewScheduleContainer;
