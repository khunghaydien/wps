import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AnyAction, bindActionCreators } from 'redux';
import { ThunkDispatch } from 'redux-thunk';

import { Formik } from 'formik';
import cloneDeep from 'lodash/cloneDeep';

import projectDetailFormSchema from '@psa/schema/ProjectDetailForm';

import { catchBusinessError } from '@commons/actions/app';

import { OpportunityDefaultParam } from '@apps/domain/models/psa/Opportunity';
import {
  searchClientList as searchClientListApi,
  searchEmployeeList as searchEmployeeListApi,
} from '@apps/domain/models/psa/Project';

import { State } from '@psa/modules';

import { getOpportunityList } from '@psa/action-dispatchers/Opportunity';
import { fetchProject, saveProject } from '@psa/action-dispatchers/Project';
import saveProjectManagerLocally from '@psa/action-dispatchers/ProjectManager';
import { hideDialog } from '@psa/action-dispatchers/PSA';
import { getExtendedItemList } from '@psa/action-dispatchers/PsaExtendedItem';
import { getGroupMembers } from '@resource/action-dispatchers/ResourceGroup';

import NewProjectForm from '@psa/components/Dialog/NewProjectForm';

import { getManagerList } from './ProjectDetailFormContainer';

export function getCalendarList(state: any) {
  const { calendarList } = state.entities;

  return calendarList && calendarList.length > 0
    ? calendarList.map((calendar) => ({
        value: calendar.id,
        text: calendar.name,
      }))
    : calendarList;
}

const NewProjectFormContainer = () => {
  const dispatch = useDispatch() as ThunkDispatch<unknown, void, AnyAction>;

  const currencyDecimal = useSelector(
    (state: State) => state.userSetting.currencyDecimalPlaces
  );
  const enableProgressCheck = useSelector(
    (state: State) => state.entities.psa.setting.enableProgressCheck
  );
  const activeDialog = useSelector(
    (state: State) => state.ui.dialog.activeDialog
  );
  const activityList = useSelector(
    (state: State) => state.entities.psa.activity.activityList
  );
  const companyId = useSelector((state: State) => state.userSetting.companyId);
  const employeeId = useSelector(
    (state: State) => state.userSetting.employeeId
  );
  const extendedItemConfigList = useSelector(
    (state: State) => state.entities.psa.psaExtendedItem.project
  );
  const calendarId = useSelector((state: State) =>
    state.entities.calendarList ? state.entities.calendarList[0].id : null
  );
  const groupDetail = useSelector(
    (state: State) => state.entities.psa.resourceGroup.detail
  );
  const isLoading = useSelector(
    (state: State) => state.common.app.loadingDepth > 0
  );
  const managerListOption = useSelector((state: State) =>
    getManagerList(state.entities)
  );
  const clientList = useSelector(
    (state: State) => state.entities.clientInfo.client.clientList
  );
  const opportunityList = useSelector(
    (state: State) => state.entities.clientInfo.opportunity.opportunities
  );
  const projectManagerId = useSelector(
    (state: State) => state.entities.psa.projectManager.projectManagerId
  );
  const resourceGroupList = useSelector(
    (state: State) => state.entities.psa.resourceGroup.groups
  );
  const resourceManagerList = useSelector(
    (state: State) => state.entities.psa.resourceManager.resourceManagerList
  );
  const useExistingJobCode = useSelector(
    (state: State) => state.entities.psa.setting.useExistingJobCode
  );
  const calendarListOption = useSelector((state: State) =>
    getCalendarList(state)
  );
  const deptSuggestList = useSelector(
    (state: State) => state.entities.departmentList
  );
  const departmentId = useSelector(
    (state: State) => state.userSetting.departmentId
  );
  const customHint = useSelector((state: State) => state.entities.customHint);

  useEffect(() => {
    dispatch(getOpportunityList(OpportunityDefaultParam));
    dispatch(getExtendedItemList(companyId, 'Project'));
  }, []);

  const searchEmployeeList = (value) => {
    searchEmployeeListApi(companyId, value);
  };

  const generateInitialValues = () => {
    const transformedExtendeditems = {};
    extendedItemConfigList &&
      extendedItemConfigList.length > 0 &&
      extendedItemConfigList.forEach((x) => {
        transformedExtendeditems[x.id] = x.defaultValueText;
      });

    return {
      code: '',
      name: '',
      jobId: '',
      jobCode: '',
      pmBaseId: employeeId || '',
      groupId: '',
      startDate: '',
      endDate: '',
      status: 'Planning',
      companyId: companyId,
      description: '',

      clientId: null,
      contractType: 'TnM',
      contractAmount: 0,
      targetMargin: 0,

      deptId: departmentId || '',
      opportunityId: null,
      planningCycle: 'Monthly',
      workTimePerDay: 480,

      progressCheckFrequency: null,
      calendarId: calendarId,
      workingDaySUN: true,
      workingDayMON: true,
      workingDayTUE: true,
      workingDayWED: true,
      workingDayTHU: true,
      workingDayFRI: true,
      workingDaySAT: true,
      enableProgressCheck: enableProgressCheck,
      pushNotificationDay: null,
      pushNotificationDate: null,
      ...transformedExtendeditems,
      extendedItemConfigList: extendedItemConfigList || [],
      useExistingJobCode: useExistingJobCode,
    };
  };

  const handleSubmit = (values) => {
    // submit using api call here
    const extendedItems = [];
    const project: any = cloneDeep(values);
    project.companyId = companyId;

    // remove ui values
    if (!useExistingJobCode) {
      delete project.jobId;
    }
    delete project.jobCode;
    delete project.useExistingJobCode;

    if (extendedItemConfigList) {
      extendedItemConfigList.forEach((eI) => {
        extendedItems.push({
          id: eI.id,
          value: values[eI.id],
          name: eI.name,
        });
        delete project[eI.id];
      });
    }
    delete project.extendedItemConfigList;
    project.extendedItems = extendedItems;
    if (project.groupId === '') {
      delete project.groupId;
    }
    dispatch(saveProject(project, companyId));
  };

  const Actions = bindActionCreators(
    {
      catchBusinessError,
      fetchProject,
      hideDialog,
      saveProject,
      saveProjectManagerLocally,
      getGroupMembers,
    },
    dispatch
  );

  return (
    <Formik
      enableReinitialize
      initialValues={generateInitialValues()}
      validationSchema={projectDetailFormSchema}
      onSubmit={handleSubmit}
      validateOnChange={true}
      validateOnBlur={true}
    >
      {(props) => {
        return (
          <NewProjectForm
            activeDialog={activeDialog}
            catchBusinessError={Actions.catchBusinessError}
            activityList={activityList}
            customHint={customHint}
            calendarListOption={calendarListOption}
            deptSuggestList={deptSuggestList}
            companyId={companyId}
            dirty={props.dirty}
            employeeId={employeeId}
            extendedItemConfigList={extendedItemConfigList}
            errors={props.errors}
            getManagerList={getManagerList}
            getGroupMembers={Actions.getGroupMembers}
            groupDetail={groupDetail}
            handleSubmit={props.handleSubmit}
            hideDialog={Actions.hideDialog}
            isLoading={isLoading}
            managerListOption={managerListOption}
            projectManagerId={projectManagerId}
            resourceGroupList={resourceGroupList}
            resourceManagerList={resourceManagerList}
            saveProjectManagerLocally={Actions.saveProjectManagerLocally}
            searchEmployeeList={searchEmployeeList}
            setFieldValue={props.setFieldValue}
            touched={props.touched}
            useExistingJobCode={useExistingJobCode}
            values={props.values}
            opportunityList={opportunityList}
            clientList={clientList}
            searchClientList={searchClientListApi}
            createProject={true}
            enableProgressCheck={enableProgressCheck}
            currencyDecimal={currencyDecimal}
            validateForm={props.validateForm}
          />
        );
      }}
    </Formik>
  );
};

export default NewProjectFormContainer;
