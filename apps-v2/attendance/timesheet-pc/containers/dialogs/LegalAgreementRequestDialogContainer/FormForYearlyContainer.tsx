import React, { useMemo } from 'react';
import { shallowEqual, useDispatch, useSelector } from 'react-redux';

import { State } from '../../../modules';

import RequestActions from './actions';

import ParentComponent from '@attendance/timesheet-pc/components/dialogs/LegalAgreementRequestDialog';
import FormForYearly from '@attendance/timesheet-pc/components/dialogs/LegalAgreementRequestDialog/FormForYearly';

type ComponentType = React.ComponentProps<
  typeof ParentComponent
>['FormForYearlyContainer'];

const mapStateToProps = (state: State) => ({
  overtime: state.ui.legalAgreementRequest.requests.yearlyRequest.overtime,
  workSystem: state.ui.legalAgreementRequest.requests.yearlyRequest.workSystem,
  targetRequest: state.ui.legalAgreementRequest.requests.yearlyRequest.request,
  workingTypes: state.entities.timesheet.workingTypes,
});

const useMapDispatchToProps = () => {
  const dispatch = useDispatch();

  return useMemo(() => {
    const requestActions = RequestActions(dispatch);

    return {
      onUpdateValue: requestActions.onUpdateValueYearly,
    };
  }, [dispatch]);
};

const FormForYearlyContainer: ComponentType = ({ isReadOnly }) => {
  const { workingTypes, ...statesProps } = useSelector(
    mapStateToProps,
    shallowEqual
  );
  const lastDayWorkingType = useMemo(
    () => (workingTypes?.length > 0 ? workingTypes.slice(-1)[0] : null),
    [workingTypes]
  );

  const requireFlags = useMemo(
    () => ({
      requireReason: lastDayWorkingType?.requireReasonForLegalAgreementYearly,
      requireMeasures:
        lastDayWorkingType?.requireMeasuresForLegalAgreementYearly,
    }),
    [lastDayWorkingType]
  );
  const dispatchProps = useMapDispatchToProps();

  return (
    <FormForYearly
      isReadOnly={isReadOnly}
      requireFlags={requireFlags}
      {...statesProps}
      {...dispatchProps}
    />
  );
};

export default FormForYearlyContainer;
