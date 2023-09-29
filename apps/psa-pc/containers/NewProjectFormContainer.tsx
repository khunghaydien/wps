import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AnyAction, bindActionCreators } from 'redux';
import { ThunkDispatch } from 'redux-thunk';

import { Formik } from 'formik';
import cloneDeep from 'lodash/cloneDeep';

import newProjectFormSchema from '@psa/schema/NewProjectForm';

import { catchBusinessError } from '@commons/actions/app';

import { searchEmployeeList as searchEmployeeListApi } from '@apps/domain/models/psa/Project';

import { State } from '@psa/modules';

import { fetchProject, saveProject } from '@psa/action-dispatchers/Project';
import saveProjectManagerLocally from '@psa/action-dispatchers/ProjectManager';
import { hideDialog } from '@psa/action-dispatchers/PSA';
import { getExtendedItemList } from '@psa/action-dispatchers/PsaExtendedItem';
import { getGroupMembers } from '@resource/action-dispatchers/ResourceGroup';

import NewProjectForm from '@apps/psa-pc/components/Dialog/NewProjectForm';

import { getManagerList } from './ProjectDetailFormContainer';

const NewProjectFormContainer = () => {
  const dispatch = useDispatch() as ThunkDispatch<State, void, AnyAction>;

  const companyId = useSelector((state: State) => state.userSetting.companyId);
  const employeeId = useSelector(
    (state: State) => state.userSetting.employeeId
  );
  const extendedItemConfigList = useSelector(
    (state: State) => state.entities.psa.psaExtendedItem.project
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
  const selectedGroup = useSelector(
    (state: State) => state.entities.psa.psaGroup.selectedGroup
  );

  useEffect(() => {
    dispatch(getExtendedItemList(companyId, 'Project'));
  }, []);

  const searchEmployeeList = (value) => {
    searchEmployeeListApi(companyId, value, selectedGroup.id);
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
      pmBaseId: managerListOption.length > 0 ? employeeId : '',
      groupId: '',
      startDate: '',
      endDate: '',
      status: '',
      ...transformedExtendeditems,
      extendedItemConfigList: extendedItemConfigList || [],
      useExistingJobCode,
    };
  };

  const handleSubmit = (values) => {
    // submit using api call here
    const extendedItems = [];
    const project: any = cloneDeep(values);
    project.companyId = companyId;
    project.psaGroupId = selectedGroup.id;

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
    dispatch(saveProject(project, companyId, selectedGroup.id));
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
      validationSchema={newProjectFormSchema}
      onSubmit={handleSubmit}
    >
      {(props) => {
        return (
          <NewProjectForm
            catchBusinessError={Actions.catchBusinessError}
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
            selectedGroupId={selectedGroup.id}
          />
        );
      }}
    </Formik>
  );
};

export default NewProjectFormContainer;
