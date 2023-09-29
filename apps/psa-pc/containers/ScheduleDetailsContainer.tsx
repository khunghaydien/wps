import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AnyAction } from 'redux';
import { ThunkDispatch } from 'redux-thunk';

import ScheduleDetails from '@apps/commons/components/psa/ScheduleDetails';
import { processView } from '@apps/commons/utils/psa/resourcePlannerUtil';

import { ViewTypes } from '@apps/domain/models/psa/Resource';

import { State } from '@psa/modules';

import { setResourceAvailability } from '@resource/action-dispatchers/Resource';

const ScheduleDetailsContainer = () => {
  const dispatch = useDispatch() as ThunkDispatch<unknown, void, AnyAction>;

  const resourceAvailability = useSelector(
    (state: State) => state.ui.resourceAvailability
  );
  const selectedRole = useSelector(
    (state: State) => state.entities.psa.role.role
  );

  useEffect(() => {
    dispatch(
      setResourceAvailability(
        processView(
          0,
          [selectedRole.assignment.bookedTimePerDay],
          ViewTypes.DAY,
          selectedRole.assignment.startDate,
          ''
        )
      )
    );
  }, []);

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
    />
  );
};

export default ScheduleDetailsContainer;
