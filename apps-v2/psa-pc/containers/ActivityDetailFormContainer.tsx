import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AnyAction, bindActionCreators } from 'redux';
import { ThunkDispatch } from 'redux-thunk';

import { Formik } from 'formik';
import cloneDeep from 'lodash/cloneDeep';

import newActivityFormSchema from '@psa/schema/NewActivityForm';

import { catchBusinessError, confirm } from '@apps/commons/actions/app';
import msg from '@apps/commons/languages';

import { State } from '@psa/modules';

import { deleteActivity, saveActivity } from '@psa/action-dispatchers/Activity';
import { fetchProject } from '@psa/action-dispatchers/Project';
import { hideDialog } from '@psa/action-dispatchers/PSA';

import NewActivityForm from '@psa/components/Dialog/NewActivityForm';

import { getManagerList } from './ProjectDetailFormContainer';

const ActivityDetailFormContainer = () => {
  const dispatch = useDispatch() as ThunkDispatch<unknown, void, AnyAction>;

  const activityList = useSelector(
    (state: State) => state.entities.psa.activity.activityList
  );
  const companyId = useSelector((state: State) => state.userSetting.companyId);
  const isActivityDetail = true;
  const managerListOption = useSelector((state: State) =>
    getManagerList(state.entities)
  );
  const selectedActivity = useSelector(
    (state: State) => state.entities.psa.activity.activity
  );
  const selectedProject = useSelector(
    (state: State) => state.entities.psa.project.project
  );
  const useExistingJobCode = useSelector(
    (state: State) => state.entities.psa.setting.useExistingJobCode
  );
  const enableProgressCheck = useSelector(
    (state: State) => state.entities.psa.setting.enableProgressCheck
  );

  const onClickDeleteActivity = () => {
    const { activityId } = selectedActivity;
    const { projectId } = selectedProject;
    dispatch(
      confirm(msg().Psa_Lbl_DeleteActivityConfirmation, (yes) => {
        if (yes) {
          dispatch(deleteActivity(activityId, projectId));
        }
      })
    );
  };

  const generateInitialValues = () => ({
    code: selectedActivity.code,
    description: selectedActivity.description,
    jobCode: selectedActivity.jobCode || '',
    jobId: selectedActivity.jobId || '',
    leadBaseId: selectedActivity.leadBaseId,
    plannedEndDate: selectedActivity.plannedEndDate,
    plannedStartDate: selectedActivity.plannedStartDate,
    status: selectedActivity.status,
    title: selectedActivity.title,
    useExistingJobCode: useExistingJobCode,
    progress: selectedActivity.progress || [],
    progressToDelete: [],
  });

  const handleSubmit = (values) => {
    const activity: any = cloneDeep(values);
    activity.activityId = selectedActivity.activityId;
    activity.projectId = selectedActivity.projectId;

    // remove ui values
    if (!useExistingJobCode) {
      delete activity.jobId;
    }
    delete activity.jobCode;
    delete activity.useExistingJobCode;

    const progressArray = values.progress.map((e) => {
      if (!e.riskStatus || e.riskStatus === '') {
        return { ...e, riskStatus: null, level: null };
      } else {
        if (!e.level) {
          return { ...e, level: 0 };
        }
      }
      return e;
    });

    activity.progress = progressArray;

    dispatch(saveActivity(activity));
  };

  const Actions = bindActionCreators(
    {
      catchBusinessError,
      fetchProject,
      hideDialog,
    },
    dispatch
  );

  return (
    <Formik
      enableReinitialize
      initialValues={generateInitialValues()}
      validationSchema={newActivityFormSchema}
      onSubmit={handleSubmit}
    >
      {(props) => {
        return (
          <NewActivityForm
            activityList={activityList}
            catchBusinessError={Actions.catchBusinessError}
            companyId={companyId}
            dirty={props.dirty}
            errors={props.errors}
            handleSubmit={props.handleSubmit}
            hideDialog={Actions.hideDialog}
            isActivityDetail={isActivityDetail}
            managerListOption={managerListOption}
            onClickDeleteActivity={onClickDeleteActivity}
            selectedActivity={selectedActivity}
            selectedProject={selectedProject}
            setFieldValue={props.setFieldValue}
            touched={props.touched}
            useExistingJobCode={useExistingJobCode}
            values={props.values}
            enableProgressCheck={enableProgressCheck}
          />
        );
      }}
    </Formik>
  );
};

export default ActivityDetailFormContainer;
