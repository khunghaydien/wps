import React, { useRef } from 'react';

import { FormikErrors, FormikTouched } from 'formik';
import last from 'lodash/last';

import Button from '@apps/commons/components/buttons/Button';
import PSACommonHeader from '@apps/commons/components/psa/Header';
import msg from '@apps/commons/languages';

import { ActivityList, ActivityStatus } from '@apps/domain/models/psa/Activity';
import { ClientList } from '@apps/domain/models/psa/Client';
import { CustomHint } from '@apps/domain/models/psa/CustomHint';
import { OpportunityList } from '@apps/domain/models/psa/Opportunity';
import { Project, PROJECT_STATUS } from '@apps/domain/models/psa/Project';
import { PsaExtendedItem } from '@apps/domain/models/psa/PsaExtendedItem';
import { ResourceManager } from '@apps/domain/models/psa/ResourceManager';

import { dialogTypes } from '@psa/modules/ui/dialog/activeDialog';
import { modes } from '@psa/modules/ui/mode';
import GenerateProjectLinkDialog from '@apps/psa-pc/components/Dialog/GenerateProjectLink';
import DeleteProjectDialog from '@apps/psa-pc/components/Dialog/ProjectDeleteDialog';
import ProjectDetailForm from './Form';

// This component is not in used for now
// import SideAnchor from './SideAnchor';
import './index.scss';

// errors, touched and values cannot pre-defined anymore
// due to dynamic nature of extended item
type FormikProps = {
  errors: FormikErrors<any>;
  touched: FormikTouched<any>;
  values: any;
  dirty: boolean;
  handleSubmit: () => void;
  setFieldValue: (arg0: string, arg1: any) => void;
};

/* type dropdownOptions = {
  value: string;
  code?: string;
  name?: string;
  text: string;
}; */

export type Props = {
  activeDialog: Array<string>;
  activityList: ActivityList;
  catchBusinessError: (type: string, message: string, solution: string) => void;
  companyId: string;
  mode: string;
  editProjectMode: () => void;
  onClickCancel: () => void;
  onClickDeleteProject: () => void;
  onClickGenerateProject: () => void;
  opportunityList: OpportunityList;
  clientList: ClientList;
  managerListOption: Array<any>;
  calendarListOption: Array<any>;
  deptSuggestList: Array<any>;
  employeeList?: Array<any>;
  selectedProject: Project;
  searchEmployeeList: (value: string) => void;
  searchClientList: (value: string) => void;
  getManagerList: (suggestList: any) => void;
  backToProjectList: (employeeId: string) => void;
  employeeId: string;
  saveProjectManagerLocally: (projectManagerId: string) => void;
  resourceManagerList: Array<ResourceManager>;
  getResourceManagerListByProjectManagerId?: (projectManagerId: string) => void;
  projectManagerId: string;
  resourceGroupList: Array<any>;
  useExistingJobCode: boolean;
  groupDetail: any;
  extendedItemConfigList: Array<PsaExtendedItem>;
  getGroupMembers: (arg0: any) => void;
  enableProgressCheck: boolean;
  isLoading: boolean;
  currencyDecimal: number;
  clientId: string;
  clientName: string;
  customHint: CustomHint;
  validateForm: any;
  permission: string;
} & FormikProps;

export const ROOT = 'ts-psa__project';

const ProjectDetail = (props: Props) => {
  const baseInfoRef = useRef(null);
  const clientInfoRef = useRef(null);
  const financialRef = useRef(null);
  const refArray = [baseInfoRef, clientInfoRef, financialRef];
  const projectStatus = props.values.status;

  const isCancelled = projectStatus === PROJECT_STATUS.Cancelled;
  const isCompleted = projectStatus === PROJECT_STATUS.Completed;
  const isInProgress = projectStatus === PROJECT_STATUS.InProgress;
  const isDeleteBtnDisabled = isInProgress || isCancelled || isCompleted;

  const hasInProgressOrCompletedActivity =
    props.activityList &&
    props.activityList.some(
      (_) =>
        _.status === ActivityStatus.InProgress ||
        _.status === ActivityStatus.Completed
    );

  // add the selected manager into managerListOption
  props.managerListOption.push({
    code: props.selectedProject.pmCode,
    id: props.selectedProject.pmBaseId,
    name: props.selectedProject.pmName,
  });
  if (props.dirty && props.mode !== modes.PROJECT_EDIT) {
    props.editProjectMode();
  }

  const currentActiveDialog = last(props.activeDialog);

  const renderActiveDialog = () => {
    let dialog = null;

    if (currentActiveDialog === dialogTypes.DELETE_PROJECT) {
      dialog = <DeleteProjectDialog />;
    } else if (currentActiveDialog === dialogTypes.GENERATE_PROJECT_LINK) {
      dialog = <GenerateProjectLinkDialog />;
    }

    return dialog;
  };

  return (
    <div className={`${ROOT}`}>
      <PSACommonHeader title={msg().Psa_Lbl_ProjectOverview}>
        {props.permission !== 'Read' && (
          <>
            <Button
              data-test-id={`${ROOT}__btn--generate`}
              className={`${ROOT}__btn--delete`}
              type="primary"
              onClick={props.onClickGenerateProject}
            >
              Generate Link
            </Button>
            <Button
              disabled={isDeleteBtnDisabled}
              data-testid={`${ROOT}__btn--delete`}
              className={`${ROOT}__btn--delete`}
              onClick={props.onClickDeleteProject}
            >
              {msg().Psa_Btn_DeleteProject}
            </Button>
            <Button
              data-test-id={`${ROOT}__btn--cancel`}
              className={`${ROOT}__btn--cancel`}
              disabled={!props.dirty}
              onClick={props.onClickCancel}
            >
              {msg().Psa_Btn_Cancel}
            </Button>
            <Button
              data-test-id={`${ROOT}__btn--save`}
              className={`${ROOT}__btn--save`}
              type="primary"
              disabled={!props.dirty}
              onClick={props.handleSubmit}
            >
              {msg().Com_Btn_Save}
            </Button>
          </>
        )}
      </PSACommonHeader>

      <div className={`${ROOT}__content`}>
        {/* <SideAnchor refArray={refArray} key="projectSideAnchor" /> */}
        <ProjectDetailForm
          {...props}
          hasInProgressOrCompletedActivity={hasInProgressOrCompletedActivity}
          refArray={refArray}
          key="projectDetailForm"
        />
      </div>
      {renderActiveDialog()}
    </div>
  );
};

export default ProjectDetail;
