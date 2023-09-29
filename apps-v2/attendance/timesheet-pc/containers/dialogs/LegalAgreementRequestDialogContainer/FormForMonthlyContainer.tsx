import React, { useMemo } from 'react';
import { shallowEqual, useDispatch, useSelector } from 'react-redux';

import { State } from '../../../modules';

import RequestActions from './actions';

import ParentComponent from '@attendance/timesheet-pc/components/dialogs/LegalAgreementRequestDialog';
import FormForMonthly from '@attendance/timesheet-pc/components/dialogs/LegalAgreementRequestDialog/FormForMonthly';

type ComponentType = React.ComponentProps<
  typeof ParentComponent
>['FormForMonthlyContainer'];

const mapStateToProps = (state: State) => ({
  overtime: state.ui.legalAgreementRequest.requests.monthlyRequest.overtime,
  workSystem: state.ui.legalAgreementRequest.requests.monthlyRequest.workSystem,
  targetRequest: state.ui.legalAgreementRequest.requests.monthlyRequest.request,
  workingTypes: state.entities.timesheet.workingTypes,
});

const useMapDispatchToProps = () => {
  const dispatch = useDispatch();

  return useMemo(() => {
    const requestActions = RequestActions(dispatch);

    return {
      onUpdateValue: requestActions.onUpdateValueMonthly,
    };
  }, [dispatch]);
};

const FormForMonthlyContainer: ComponentType = ({ isReadOnly }) => {
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
      requireReason: lastDayWorkingType?.requireReasonForLegalAgreementMonthly,
      requireMeasures:
        lastDayWorkingType?.requireMeasuresForLegalAgreementMonthly,
    }),
    [lastDayWorkingType]
  );
  const dispatchProps = useMapDispatchToProps();

  return (
    <FormForMonthly
      isReadOnly={isReadOnly}
      requireFlags={requireFlags}
      {...statesProps}
      {...dispatchProps}
    />
  );
};

export default FormForMonthlyContainer;
