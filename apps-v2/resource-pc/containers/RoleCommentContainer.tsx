import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AnyAction, bindActionCreators } from 'redux';
import { ThunkDispatch } from 'redux-thunk';

import { Formik } from 'formik';

import RoleCommentDialog from '@apps/commons/components/psa/Dialog/RoleCommentDialog';

import {
  CONFIRM_BY,
  REJECT_BY,
  ROLE_ACTIONS,
} from '@apps/domain/models/psa/Role';

import { State } from '@resource/modules';

import { hideDialog } from '@psa/action-dispatchers/PSA';
import { confirmRole } from '@psa/action-dispatchers/Role';
import { rejectRole, softBookRole } from '@resource/action-dispatchers/Role';

type OwnProps = {
  primaryAction: string;
};

const RoleCommentContainer = (ownProps: OwnProps) => {
  const dispatch = useDispatch() as ThunkDispatch<unknown, void, AnyAction>;

  const selectedRole = useSelector(
    (state: State) => state.entities.psa.role.role
  );

  const generateInitialValues = () => ({
    comments: '',
  });

  const handleSubmit = (values) => {
    const { primaryAction } = ownProps;
    const { roleId } = selectedRole;
    const { comments } = values;

    dispatch(hideDialog());

    if (primaryAction === ROLE_ACTIONS.HARDBOOK) {
      dispatch(
        confirmRole(
          selectedRole.assignment.assignmentId,
          selectedRole,
          comments,
          CONFIRM_BY.RM
        )
      );
    } else if (primaryAction === ROLE_ACTIONS.NOT_FOUND) {
      dispatch(rejectRole(selectedRole.roleId, REJECT_BY.RM, comments));
    } else if (primaryAction === ROLE_ACTIONS.SOFTBOOK) {
      dispatch(softBookRole(roleId, comments));
    }
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
      onSubmit={handleSubmit}
    >
      {(props) => {
        return (
          <RoleCommentDialog
            handleSubmit={props.handleSubmit}
            hideDialog={Actions.hideDialog}
            primaryAction={ownProps.primaryAction}
            setFieldValue={props.setFieldValue}
            values={props.values}
          />
        );
      }}
    </Formik>
  );
};

export default RoleCommentContainer;
