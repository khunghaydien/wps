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

import { State } from '@psa/modules';

import { hideDialog } from '@psa/action-dispatchers/PSA';
import {
  cancelRole,
  confirmRole,
  recallRole,
  rejectRole,
  submitRole,
} from '@psa/action-dispatchers/Role';
import {
  selectAssignment,
  updateAssignments,
} from '@resource/action-dispatchers/Role';

type OwnProps = {
  onClickSubmit?: (comments: string) => void;
  primaryAction: string;
  rescheduleResource?: (comments: string) => void;
};

const RoleCommentContainer = (ownProps: OwnProps) => {
  const dispatch = useDispatch() as ThunkDispatch<unknown, void, AnyAction>;

  const selectedProject = useSelector(
    (state: State) => state.entities.psa.project.project
  );
  const selectedRole = useSelector(
    (state: State) => state.entities.psa.role.role
  );

  const generateInitialValues = () => ({
    comments: '',
  });

  const handleSubmit = (values) => {
    const { primaryAction, rescheduleResource, onClickSubmit } = ownProps;
    const { roleId } = selectedRole;
    const { projectId } = selectedProject;
    const { comments } = values;

    dispatch(hideDialog());

    if (primaryAction === ROLE_ACTIONS.SUBMIT) {
      dispatch(submitRole(roleId, comments));
    } else if (primaryAction === ROLE_ACTIONS.RECALL) {
      dispatch(recallRole(roleId, comments));
    } else if (primaryAction === ROLE_ACTIONS.REJECT) {
      dispatch(rejectRole(roleId, REJECT_BY.PM, comments));
      dispatch(selectAssignment(null));
      dispatch(updateAssignments([]));
    } else if (primaryAction === ROLE_ACTIONS.CANCEL && projectId) {
      dispatch(cancelRole(roleId, projectId, comments));
    } else if (primaryAction === ROLE_ACTIONS.CONFIRM) {
      dispatch(
        confirmRole(
          selectedRole.assignment.assignmentId,
          selectedRole,
          comments,
          CONFIRM_BY.PM
        )
      );
    } else if (primaryAction === ROLE_ACTIONS.RESCHEDULE) {
      rescheduleResource(comments);
    } else if (primaryAction === ROLE_ACTIONS.NOMINATE) {
      onClickSubmit(comments);
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
