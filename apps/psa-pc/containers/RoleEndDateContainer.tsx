import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AnyAction, bindActionCreators } from 'redux';
import { ThunkDispatch } from 'redux-thunk';

import { Formik } from 'formik';
import get from 'lodash/get';

import roleEndDateSchema from '@psa/schema/RoleEndDateForm';

import DateUtil from '@apps/commons/utils/DateUtil';

import { State } from '@psa/modules';

import { hideDialog } from '@psa/action-dispatchers/PSA';
import {
  completeRole,
  rescheduleRoleEndDate,
} from '@psa/action-dispatchers/Role';

import RoleEndDateDialog from '@apps/psa-pc/components/Dialog/RoleEndDateDialog';

type OwnProps = {
  dateLabel: string;
  isRescheduled?: boolean;
  title: string;
};

const RoleEndDateContainer = (ownProps: OwnProps) => {
  const dispatch = useDispatch() as ThunkDispatch<State, void, AnyAction>;

  const selectedRole = useSelector(
    (state: State) => state.entities.psa.role.role
  );

  const onClickSave = (endOrCompletionDate: string, comments: string) => {
    const { roleId } = selectedRole;

    if (ownProps.isRescheduled) {
      dispatch(rescheduleRoleEndDate(roleId, endOrCompletionDate));
    } else {
      dispatch(completeRole(roleId, endOrCompletionDate, comments));
    }
  };

  const generateInitialValues = () => {
    const { isRescheduled } = ownProps;
    const { assignments } = selectedRole;
    const today = DateUtil.getToday();
    const assignmentStartDate = get(assignments, '0.startDate', new Date());
    const assignmentEndDate = get(assignments, '0.endDate', new Date());
    const completionEndDate =
      new Date(assignmentEndDate) > new Date() ? today : assignmentEndDate;
    const endDate = isRescheduled ? assignmentEndDate : completionEndDate;

    return {
      startDate: assignmentStartDate,
      oldEndDate: assignmentEndDate,
      isRescheduled: !!isRescheduled,
      endDate,
      comments: '',
    };
  };
  const handleSubmit = (values) => {
    onClickSave(values.endDate, values.comments);
  };

  const Actions = bindActionCreators(
    {
      hideDialog,
    },
    dispatch
  );

  return (
    <Formik
      enableReinitialize
      initialValues={generateInitialValues()}
      validationSchema={roleEndDateSchema}
      onSubmit={handleSubmit}
    >
      {(props) => {
        return (
          <RoleEndDateDialog
            dateLabel={ownProps.dateLabel}
            errors={props.errors}
            handleSubmit={props.handleSubmit}
            hideDialog={Actions.hideDialog}
            isRescheduled={ownProps.isRescheduled}
            setFieldValue={props.setFieldValue}
            title={ownProps.title}
            touched={props.touched}
            values={props.values}
          />
        );
      }}
    </Formik>
  );
};

export default RoleEndDateContainer;
