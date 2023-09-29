import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AnyAction, bindActionCreators } from 'redux';
import { ThunkDispatch } from 'redux-thunk';

import { Formik } from 'formik';
import cloneDeep from 'lodash/cloneDeep';

import newActivityFormSchema from '@psa/schema/NewActivityForm';

import { catchBusinessError } from '@commons/actions/app';

import { State } from '@psa/modules';

import { saveActivity } from '@psa/action-dispatchers/Activity';
import { fetchProject } from '@psa/action-dispatchers/Project';
import { hideDialog } from '@psa/action-dispatchers/PSA';

import NewActivityForm from '@psa/components/Dialog/NewActivityForm';

import { getManagerList } from './ProjectDetailFormContainer';

const NewActivityFormContainer = () => {
  const dispatch = useDispatch() as ThunkDispatch<unknown, void, AnyAction>;

  const companyId = useSelector((state: State) => state.userSetting.companyId);
  const managerListOption = useSelector((state: State) =>
    getManagerList(state.entities)
  );
  const selectedProject = useSelector(
    (state: State) => state.entities.psa.project.project
  );
  const selectedActivity = useSelector(
    (state: State) => state.entities.psa.activity.activity
  );
  const useExistingJobCode = useSelector(
    (state: State) => state.entities.psa.setting.useExistingJobCode
  );
  const enableProgressCheck = useSelector(
    (state: State) => state.entities.psa.setting.enableProgressCheck
  );

  const generateInitialValues = () => ({
    code: '',
    description: '',
    jobCode: useExistingJobCode ? selectedProject.jobCode : '',
    jobId: useExistingJobCode ? selectedProject.jobId : '',
    leadBaseId: '',
    plannedEndDate: selectedProject
      ? selectedProject.endDate
      : selectedActivity.projectEndDate,
    plannedStartDate: selectedProject
      ? selectedProject.startDate
      : selectedActivity.projectStartDate,
    status: '',
    title: '',
    useExistingJobCode: useExistingJobCode,
  });

  const handleSubmit = (values) => {
    const activity: any = cloneDeep(values);
    activity.projectId = selectedProject.projectId;

    // remove ui values
    if (!useExistingJobCode) {
      delete activity.jobId;
    }
    delete activity.jobCode;
    delete activity.useExistingJobCode;

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
            catchBusinessError={Actions.catchBusinessError}
            companyId={companyId}
            dirty={props.dirty}
            errors={props.errors}
            handleSubmit={props.handleSubmit}
            hideDialog={Actions.hideDialog}
            managerListOption={managerListOption}
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

export default NewActivityFormContainer;
