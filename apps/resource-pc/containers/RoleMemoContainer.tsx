import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AnyAction, bindActionCreators } from 'redux';
import { ThunkDispatch } from 'redux-thunk';

import { Formik } from 'formik';

import RoleMemoDialog from '@apps/commons/components/psa/Dialog/RoleMemoDialog';

import { MEMO_TYPE } from '@apps/domain/models/psa/Role';

import { State } from '@resource/modules';

import { hideDialog } from '@psa/action-dispatchers/PSA';
import { submitMemo } from '@psa/action-dispatchers/Role';

type OwnProps = {
  memoType: string;
};

const RoleMemoContainer = (ownProps: OwnProps) => {
  const dispatch = useDispatch() as ThunkDispatch<State, void, AnyAction>;

  const selectedRole = useSelector(
    (state: State) => state.entities.psa.role.role
  );

  const selectedActivity = useSelector(
    (state: State) => state.entities.psa.activity.activity
  );

  const generateInitialValues = () => {
    const { memoType } = ownProps;
    let memoForAll = '';
    let memoForManagers = '';
    let memoForRM = '';

    if (selectedRole.memo) {
      memoForAll = selectedRole.memo.memoForAll;
      memoForManagers = selectedRole.memo.memoForManagers;
      memoForRM = selectedRole.memo.memoForRM;
    }

    let memo = memoForAll;

    if (memoType === MEMO_TYPE.MANAGERS) {
      memo = memoForManagers;
    } else if (memoType === MEMO_TYPE.RM) {
      memo = memoForRM;
    }

    return {
      memo,
    };
  };
  const handleSubmit = (values) => {
    const { memo } = values;
    const { memoType } = ownProps;
    const { roleId } = selectedRole;
    const { id } = selectedRole.memo;
    const { activityId } = selectedActivity;

    dispatch(submitMemo(roleId, activityId, id, memo, memoType));
    dispatch(hideDialog());
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
          <RoleMemoDialog
            handleSubmit={props.handleSubmit}
            hideDialog={Actions.hideDialog}
            memoType={ownProps.memoType}
            setFieldValue={props.setFieldValue}
            values={props.values}
          />
        );
      }}
    </Formik>
  );
};

export default RoleMemoContainer;
