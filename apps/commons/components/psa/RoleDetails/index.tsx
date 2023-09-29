import React, { useEffect, useRef, useState } from 'react';

import get from 'lodash/get';
import has from 'lodash/has';
import last from 'lodash/last';

import Button from '@apps/commons/components/buttons/Button';
import BookingInformation from '@apps/commons/components/psa/BookingInformation';
import PSACommonHeader from '@apps/commons/components/psa/Header';
import RoleDetailsBtnArea from '@apps/commons/components/psa/RoleDetails/ButtonArea';
import RoleDetailsHistory from '@apps/commons/components/psa/RoleDetailsHistory';
import { getSkillFromRole } from '@apps/commons/components/psa/SkillSelectionField/SkillNameHelper';
import CapabilityInfoContainer from '@apps/commons/containers/psa/CapabilityInfoContainer';
import EditIcon from '@apps/commons/images/icons/edit.svg';
import msg from '@apps/commons/languages';
import DateUtil from '@apps/commons/utils/DateUtil';
import { floorToOneDecimal } from '@apps/commons/utils/psa/resourcePlannerUtil';

import { Activity } from '@apps/domain/models/psa/Activity';
import { CurrentRoute } from '@apps/domain/models/psa/CurrentRoute';
import { Project } from '@apps/domain/models/psa/Project';
import { PsaAccessType } from '@apps/domain/models/psa/PsaAccess';
import { PsaExtendedItem } from '@apps/domain/models/psa/PsaExtendedItem';
import { ResourceGroupList } from '@apps/domain/models/psa/ResourceGroup';
import {
  Assignment,
  MEMO_TYPE,
  Role,
  ROLE_ACTIONS,
} from '@apps/domain/models/psa/Role';
import { RoleStatus } from '@apps/domain/models/psa/RoleStatus';

import { dialogTypes } from '@psa/modules/ui/dialog/activeDialog';
import { modes } from '@resource/modules/ui/mode';

import NewRoleFormContainer from '@psa/containers/NewRoleFormContainer';
import ProjectRoleCommentContainer from '@psa/containers/RoleCommentContainer';
import RoleEndDateContainer from '@psa/containers/RoleEndDateContainer';
import ProjectRoleMemoContainer from '@psa/containers/RoleMemoContainer';
import ResourceRoleCommentContainer from '@resource/containers/RoleCommentContainer';
import ResourceRoleMemoContainer from '@resource/containers/RoleMemoContainer';

import './index.scss';

const ROOT = 'ts-psa__role-details';

type Props = {
  accessSetting: PsaAccessType;
  activeDialog: Array<string>;
  cloneRole?: (
    roleIds: Array<string>,
    targetActivityId: string,
    numberOfClones: number
  ) => void;
  currencyCode: string;
  currentRoute?: string;
  deleteRole?: (roleId: string, projectId: string) => void;
  directAssignment?: () => void;
  extendedItemProjectConfigList: Array<PsaExtendedItem>;
  extendedItemRoleConfigList: Array<PsaExtendedItem>;
  getProject?: (projectId: string) => void;
  isLoading?: boolean;
  mode?: string;
  openEmployeeCapabilityInfo: (empId: string) => void;
  openMarkAsCompletedRoleDialog?: () => void;
  openNewRoleDialog: () => void;
  openRoleCommentDialog: () => void;
  openRoleMemoDialog: () => void;
  removeResourceFromAssignment?: (
    assignmentId: string,
    assignments: Array<Assignment>
  ) => void;
  rescheduleResource?: () => void;
  resourceGroups?: ResourceGroupList;
  selectAssignment: (assignment: Assignment) => void;
  selectedActivity: Activity;
  selectedProject: Project;
  selectedRole: Role;
  selectResource: () => void;
  showScheduleDetails: () => void;
};

const RoleDetails = (props: Props) => {
  const isCapabilityInfoDialogActive =
    last(props.activeDialog) === dialogTypes.EMPLOYEE_CAPABILITY_INFO;
  const { selectedRole, selectedProject } = props;
  const { status, assignments } = selectedRole;
  const { plannedStartDate, plannedEndDate } = props.selectedActivity;
  const [groupName, setGroupName] = useState(
    get(selectedRole, 'groupName', '')
  );
  const [roleCommentPrimaryAction, setRoleCommentPrimaryAction] = useState('');
  const [roleMemoType, setRoleMemoType] = useState('');

  useEffect(() => {
    if (selectedRole && selectedRole.groupId && props.resourceGroups) {
      props.resourceGroups.every((rg) => {
        if (rg.id === selectedRole.groupId) {
          setGroupName(rg.name);
          return false;
        }
        return true;
      });
    }
  }, [props.selectedRole]);

  useEffect(() => {
    if (props.selectedActivity && props.selectedActivity.projectId !== '') {
      props.getProject(props.selectedActivity.projectId);
    }
  }, [props.selectedActivity]);

  const roleStatusClass = {
    Planning: 'is-in-planning',
    Requested: 'is-requested',
    SoftBooked: 'is-soft-booked',
    InProgress: 'is-in-progress',
    Confirmed: 'is-confirmed',
    NotFound: 'is-not-found',
    Cancelled: 'is-cancelled',
    Completed: 'is-completed',
    Scheduling: 'is-scheduling',
  };

  // Cache result in variable
  const isCancelled = status === RoleStatus.Cancelled;
  const isCompleted = status === RoleStatus.Completed;
  const isConfirmed = status === RoleStatus.Confirmed;
  const isInProgress = status === RoleStatus.InProgress;
  const isNotFound = status === RoleStatus.NotFound;
  const isPlanning = status === RoleStatus.Planning;
  const isRequested = status === RoleStatus.Requested;
  const isScheduling = status === RoleStatus.Scheduling;
  const isSoftBooked = status === RoleStatus.SoftBooked;
  const statusClass = `${ROOT}__status-item ${roleStatusClass[status]}`;

  const isProjectTab = props.currentRoute === CurrentRoute.Projects;
  const isCommentHistoryVisible = selectedRole && selectedRole.commentsHistory;
  const isReverseAssignmentMode =
    props.mode && props.mode === modes.RESOURCE_ASSIGNMENT;
  const isBtnDisabled = {
    edit:
      isRequested ||
      isSoftBooked ||
      isConfirmed ||
      isCompleted ||
      isCancelled ||
      isScheduling,
    editByRM: !isRequested,
    submit: !isPlanning,
    recall: !isRequested,
    cancel: !(isConfirmed || isInProgress),
    delete: !(isPlanning || isNotFound) || isScheduling,
    rescheduleEndDate: !isInProgress || isScheduling,
    assignResource: !isPlanning,
    softBooking:
      isRequested ||
      isConfirmed ||
      isInProgress ||
      isSoftBooked ||
      isPlanning ||
      isNotFound ||
      isCompleted,
    reschedule: !(isConfirmed || isInProgress),
    resourceNotFound: !isRequested,
    selectResource: !(isRequested || isScheduling) || isReverseAssignmentMode,
    history: !isCommentHistoryVisible,
  };

  const showScheduleDetail =
    isInProgress || isSoftBooked || isConfirmed || isCompleted || isScheduling;

  // TODO: Disable the hide button function to standardize the behaviour with projects\
  const showActionButtons = '';

  // const showActionButtons =
  //   !isRequested &&
  //   !isScheduling &&
  //   !isConfirmed &&
  //   isResourceTab &&
  //   props.currentRoute === CurrentRoute.Resource
  //     ? 'hidden'
  //     : '';

  const roleSkills =
    selectedRole.skills && selectedRole.skills.length > 0
      ? selectedRole.skills.map(getSkillFromRole)
      : '-';

  const roleJobGrade = selectedRole.jobGrades
    ? selectedRole.jobGrades
        .map((jobGrade) => {
          let detailJobGrade = jobGrade.name || jobGrade.label;
          if (jobGrade.costRate && jobGrade.costRate > 0) {
            detailJobGrade += `/ ${props.currencyCode} ${jobGrade.costRate}`;
          }
          return detailJobGrade;
        })
        .join(', ')
    : msg().Psa_Lbl_NotSpecifiedJobGrade;

  const showComment = (action: string) => () => {
    setRoleCommentPrimaryAction(action);
    props.openRoleCommentDialog();
  };

  const showMemo = (memoType: string) => () => {
    setRoleMemoType(memoType);
    props.openRoleMemoDialog();
  };

  const onClickDeleteRole = () => {
    if (selectedProject.projectId) {
      props.deleteRole(selectedRole.roleId, selectedProject.projectId);
    }
  };

  const onClickCloneRole = () => {
    props.cloneRole(
      [selectedRole.roleId],
      props.selectedActivity.activityId,
      1
    );
  };

  const onClickSelectResource = () => {
    // PM direct assignment
    if (isProjectTab) {
      props.directAssignment();
    }
    props.selectResource();
  };
  // end of onClick handlers

  const renderActiveDialog = () => {
    const currentActiveDialog = last(props.activeDialog);
    const isAssignmentDetail = currentActiveDialog === dialogTypes.NEW_ROLE;
    let dialog = null;

    if (isAssignmentDetail) {
      dialog = (
        <NewRoleFormContainer
          isRoleDetail
          isEverythingElseDisabled={isInProgress}
        />
      );
    } else if (currentActiveDialog === dialogTypes.EDIT_ROLE_END_DATE) {
      dialog = (
        <RoleEndDateContainer
          isRescheduled
          title={msg().Psa_Lbl_RescheduleEndDate}
          dateLabel={msg().Psa_Lbl_BookingRoleEndDate}
        />
      );
    } else if (currentActiveDialog === dialogTypes.MARK_AS_COMPLETED_ROLE) {
      dialog = (
        <RoleEndDateContainer
          title={msg().Psa_Lbl_MarkAsCompleted}
          dateLabel={msg().Psa_Lbl_CompletionDate}
        />
      );
    } else if (currentActiveDialog === dialogTypes.ROLE_COMMENT) {
      dialog = isProjectTab ? (
        <ProjectRoleCommentContainer primaryAction={roleCommentPrimaryAction} />
      ) : (
        <ResourceRoleCommentContainer
          primaryAction={roleCommentPrimaryAction}
        />
      );
    } else if (currentActiveDialog === dialogTypes.ROLE_MEMO) {
      dialog = isProjectTab ? (
        <ProjectRoleMemoContainer memoType={roleMemoType} />
      ) : (
        <ResourceRoleMemoContainer memoType={roleMemoType} />
      );
    }

    return dialog;
  };

  // extended item renderer
  const getEiValue = (extendedItem, objectType) => {
    const extendedItemId = extendedItem.id;
    let eIList;
    if (objectType === 'Role') {
      eIList = selectedRole.extendedItems ? selectedRole.extendedItems : [];
    }
    if (objectType === 'Project') {
      eIList = props.selectedProject.extendedItems
        ? props.selectedProject.extendedItems
        : [];
    }
    const foundEi = eIList.find((eI) => eI.id === extendedItemId);

    if (foundEi && foundEi.value) {
      if (foundEi.inputType === 'Date') {
        return DateUtil.format(foundEi.value);
      } else if (foundEi.inputType === 'Picklist') {
        const pickListLabels = foundEi.picklistLabel;
        const pickListIndex = foundEi.picklistValue
          .replace(/\n/g, '\\n')
          .split('\\n')
          .findIndex((value) => value === foundEi.value);

        let pickListValue = foundEi.value;

        if (pickListLabels && typeof pickListIndex === 'number') {
          pickListValue = pickListLabels.replace(/\n/g, '\\n').split('\\n')[
            pickListIndex
          ];
        }
        return pickListValue;
      } else {
        return foundEi.value;
      }
    }

    return extendedItem.defaultValueText || '-';
  };

  const renderExtendedItem = (extendedItemId: string, objectType: string) => {
    let eIList;
    if (objectType === 'Role') {
      eIList = props.extendedItemRoleConfigList
        ? props.extendedItemRoleConfigList
        : [];
    }
    if (objectType === 'Project') {
      eIList = props.extendedItemProjectConfigList
        ? props.extendedItemProjectConfigList
        : [];
    }
    let renderedItem = <div></div>;
    eIList &&
      eIList.forEach((eI) => {
        if (eI.id === extendedItemId && eI.enabled) {
          renderedItem = (
            <div
              className={`${ROOT}__field`}
              data-testid={`${ROOT}__${eI.name}`}
            >
              <span className="label">{eI.name}</span>
              <span className="value">{getEiValue(eI, objectType)}</span>
            </div>
          );
        }
      });
    return renderedItem;
  };
  // end of extended item renderer

  // Memo
  const {
    memo: {
      memoForAll,
      memoForManagers,
      memoForRM,
      visibleForManagers,
      visibleForRM,
    } = {},
  } = selectedRole;

  // Scroll to
  const topRef = useRef(null);
  const memoRef = useRef(null);
  const commentHistoryRef = useRef(null);

  const scrollToTop = () =>
    topRef.current.scrollTo({ top: 0, behavior: 'smooth' });
  const scrollToMemo = () => memoRef.current.scrollIntoView();
  const scrollToCommentHistory = () =>
    commentHistoryRef.current.scrollIntoView();

  const noRemarksMemo = (
    <span className={`${ROOT}__memo--no-remarks`}>
      {msg().Psa_Lbl_NoRemarks}
    </span>
  );

  return (
    <div className={`${ROOT}`} ref={topRef}>
      {isCapabilityInfoDialogActive && <CapabilityInfoContainer />}
      <PSACommonHeader title={msg().Psa_Lbl_RoleDetails}>
        <RoleDetailsBtnArea
          currentMode={props.mode}
          currentRoute={props.currentRoute}
          displayClass={showActionButtons}
          isBtnDisabled={isBtnDisabled}
          onClickCancel={showComment(ROLE_ACTIONS.CANCEL)}
          onClickClone={onClickCloneRole}
          onClickDelete={onClickDeleteRole}
          onClickEdit={
            isInProgress
              ? props.openMarkAsCompletedRoleDialog
              : props.openNewRoleDialog
          }
          onClickHardBook={showComment(ROLE_ACTIONS.HARDBOOK)}
          onClickNotFound={showComment(ROLE_ACTIONS.NOT_FOUND)}
          onClickRecall={showComment(ROLE_ACTIONS.RECALL)}
          onClickReschedule={props.rescheduleResource}
          onClickSelectResource={onClickSelectResource}
          onClickSoftBook={showComment(ROLE_ACTIONS.SOFTBOOK)}
          onClickSubmit={showComment(ROLE_ACTIONS.SUBMIT)}
          roleStatus={status}
          scrollToCommentHistory={scrollToCommentHistory}
          scrollToMemo={scrollToMemo}
          selectedResourceCount={assignments ? assignments.length : 0}
        />
      </PSACommonHeader>

      <div className={`${ROOT}__content`}>
        {!props.isLoading &&
          isSoftBooked &&
          props.currentRoute === 'Projects' &&
          props.accessSetting.canConfirmProjectRoles && (
            <div className={`${ROOT}__booking-confirmation`}>
              {msg().Psa_Msg_SoftBookConfirmation}
              <Button
                className={`${ROOT}__booking-decline-button`}
                type="destructive"
                onClick={showComment(ROLE_ACTIONS.REJECT)}
                data-testid={`${ROOT}__booking-decline-button`}
              >
                {assignments && assignments.length === 1
                  ? msg().Psa_Lbl_Decline
                  : msg().Psa_Lbl_DeclineAll}
              </Button>
              <Button
                className={`${ROOT}__booking-confirm-button`}
                type="primary"
                onClick={showComment(ROLE_ACTIONS.CONFIRM)}
                data-testid={`${ROOT}__booking-confirm-button`}
                disabled={!has(selectedRole.assignment, 'assignmentId')}
              >
                {msg().Psa_Lbl_Confirm}
              </Button>
            </div>
          )}
        {showScheduleDetail && (
          <BookingInformation
            canConfirmResource={props.accessSetting.canConfirmProjectRoles}
            currentRoute={props.currentRoute}
            onClickShowScheduleDetails={props.showScheduleDetails}
            openEmployeeCapabilityInfo={props.openEmployeeCapabilityInfo}
            releaseRoleResource={props.removeResourceFromAssignment}
            selectAssignment={props.selectAssignment}
            selectedRole={selectedRole}
          />
        )}
        <div className={`${ROOT}__header--assignment`}>
          {msg().Psa_Lbl_ProjectRoleInformation}{' '}
          {selectedRole.requestDateTime &&
            `(${msg().Psa_Lbl_ReceivedDate}: ${DateUtil.formatYMDhhmm(
              selectedRole.requestDateTime
            )})`}
        </div>
        <div className={`${ROOT}__assignment`}>
          <div className={`${ROOT}__field`} data-testid={`${ROOT}__status`}>
            <span className="label">{msg().Psa_Lbl_Status}</span>
            <span className="value">
              <span className={statusClass} />
              {status && msg()[`Psa_Lbl_Status${status}`]}
            </span>
          </div>

          <div
            className={`${ROOT}__field`}
            data-testid={`${ROOT}__assignment-due-date`}
          >
            <span className="label">{msg().Psa_Lbl_AssignmentDueDate}</span>
            <p>{DateUtil.format(selectedRole.assignmentDueDate)}</p>
          </div>

          <div className={`${ROOT}__field`} data-testid={`${ROOT}__code`}>
            <span className="label">{msg().Psa_Lbl_ProjectRoleCode}</span>
            <span className="value">{selectedRole.jobCode || '-'}</span>
          </div>

          <div className={`${ROOT}__field`} data-testid={`${ROOT}__job-grade`}>
            <span className="label">{msg().Admin_Lbl_JobGrade}</span>
            <span className="value">{roleJobGrade || '-'}</span>
          </div>

          <div className={`${ROOT}__field`} data-testid={`${ROOT}__title`}>
            <span className="label">{msg().Psa_Lbl_ProjectRoleTitle}</span>
            <span className="value">{selectedRole.roleTitle}</span>
          </div>

          <div className={`${ROOT}__field`} data-testid={`${ROOT}__skillset`}>
            <span className="label">{msg().Admin_Lbl_Skillset}</span>
            <span className="value">{roleSkills}</span>
          </div>

          <div className={`${ROOT}__field`} data-testid={`${ROOT}__duration`}>
            <span className="label">{msg().Psa_Lbl_RequiredRoleDuration}</span>
            <span className="value">
              {selectedRole.startDate
                ? `${DateUtil.format(
                    selectedRole.startDate
                  )} - ${DateUtil.format(selectedRole.endDate)}`
                : '-'}
            </span>
          </div>

          <div
            className={`${ROOT}__field`}
            data-testid={`${ROOT}__resourceGroup`}
          >
            <span className="label">{msg().Admin_Lbl_ResourceGroup}</span>
            <span className="value">{groupName}</span>
          </div>

          <div
            className={`${ROOT}__field`}
            data-testid={`${ROOT}__max-working-hours`}
          >
            <span className="label">{msg().Psa_Lbl_ResourceMaxWorkHours}</span>
            <span className="value">
              {selectedRole.maxWorkingTime &&
              Number(selectedRole.maxWorkingTime) > 0
                ? `${Number(selectedRole.maxWorkingTime) / 60} ${
                    msg().Psa_Lbl_Hours
                  }`
                : '-'}
            </span>
          </div>

          <div className={`${ROOT}__field`} data-testid={`${ROOT}__remarks`}>
            <span className="label">{msg().Psa_Lbl_RoleDescription}</span>
            <p>{selectedRole.remarks ? selectedRole.remarks : '-'}</p>
          </div>

          <div className={`${ROOT}__field`} data-testid={`${ROOT}__effort`}>
            <span className="label">
              {msg().Psa_Lbl_RequiredEffortWithPercentage}
            </span>
            <span className="value">
              {selectedRole.requiredTime &&
              Number(selectedRole.requiredTime) > 0
                ? `${floorToOneDecimal(
                    Number(selectedRole.requiredTime) / 60
                  )} ${msg().Psa_Lbl_Hours} (${
                    selectedRole.requiredTimePercentage
                  }%)`
                : '-'}
            </span>
          </div>

          <div
            className={`${ROOT}__field`}
            data-testid={`${ROOT}__request-code`}
          >
            <span className="label">{msg().Psa_Lbl_RequestCode}</span>
            <span className="value">{selectedRole.requestCode || '-'}</span>
          </div>

          {selectedRole.requestBy && (
            <div
              className={`${ROOT}__field`}
              data-testid={`${ROOT}__requested-by`}
            >
              <span className="label">{msg().Psa_Lbl_RequestedBy}</span>
              <span className="value">{`${selectedRole.requestBy} - ${selectedRole.requestByCode}`}</span>
            </div>
          )}

          {selectedRole.requesterDeptName && (
            <div
              className={`${ROOT}__field`}
              data-testid={`${ROOT}__requested-by`}
            >
              <span className="label">{msg().Psa_Lbl_RequesterDepartment}</span>
              <span className="value">{`${selectedRole.requesterDeptName} - ${selectedRole.requesterDeptCode}`}</span>
            </div>
          )}

          {props.extendedItemRoleConfigList &&
            props.extendedItemRoleConfigList.map(
              (eI) => eI.enabled && renderExtendedItem(eI.id, 'Role')
            )}
        </div>

        <div className={`${ROOT}__header--project`}>
          {msg().Psa_Lbl_ProjectInformation}
        </div>

        <div className={`${ROOT}__project`}>
          <div
            className={`${ROOT}__field`}
            data-testid={`${ROOT}__project-code`}
          >
            <span className="label">{msg().Psa_Lbl_ProjectCode}</span>
            <span className="value">{selectedProject.jobCode}</span>
          </div>

          <div
            className={`${ROOT}__field`}
            data-testid={`${ROOT}__project-department`}
          >
            <span className="label">{msg().Psa_Lbl_ProjectDepartment}</span>
            <span className="value">
              {selectedProject.deptName
                ? `${selectedProject.deptName} - ${selectedProject.deptCode}`
                : '-'}
            </span>
          </div>

          <div
            className={`${ROOT}__field`}
            data-testid={`${ROOT}__project-title`}
          >
            <span className="label">{msg().Psa_Lbl_ProjectTitle}</span>
            <span className="value">{selectedProject.name}</span>
          </div>

          <div
            className={`${ROOT}__field`}
            data-testid={`${ROOT}__project-client-name`}
          >
            <span className="label">{msg().Psa_Lbl_ProjectClientName}</span>
            <span className="value">
              {selectedProject.clientName
                ? `${selectedProject.clientName} - ${selectedProject.clientCode}`
                : '-'}
            </span>
          </div>

          <div
            className={`${ROOT}__field`}
            data-testid={`${ROOT}__project-duration`}
          >
            <span className="label">{msg().Psa_Lbl_ProjectDuration}</span>
            <span className="value">{`${DateUtil.format(
              selectedProject.startDate
            )} - ${DateUtil.format(selectedProject.endDate)}`}</span>
          </div>

          <div
            className={`${ROOT}__field`}
            data-testid={`${ROOT}__project-manager`}
          >
            <span className="label">{msg().Psa_Lbl_ProjectManager}</span>
            <span className="value">{`${selectedProject.pmName} - ${selectedProject.pmCode}`}</span>
          </div>

          <div
            className={`${ROOT}__field`}
            data-testid={`${ROOT}__activity-code`}
          >
            <span className="label">{msg().Psa_Lbl_ActivityCode}</span>
            <span className="value">
              {props.selectedActivity.jobCode || '-'}
            </span>
          </div>

          <div
            className={`${ROOT}__field`}
            data-testid={`${ROOT}__activity-title`}
          >
            <span className="label">{msg().Psa_Lbl_ActivityTitle}</span>
            <span className="value">{props.selectedActivity.title}</span>
          </div>

          <div
            className={`${ROOT}__field`}
            data-testid={`${ROOT}__activity-duration`}
          >
            <span className="label">{msg().Psa_Lbl_ActivityDuration}</span>
            <span className="value">
              {plannedStartDate
                ? `${DateUtil.format(plannedStartDate)} - ${DateUtil.format(
                    plannedEndDate
                  )}`
                : '-'}
            </span>
          </div>

          {props.extendedItemProjectConfigList &&
            props.extendedItemProjectConfigList.map(
              (eI) => eI.enabled && renderExtendedItem(eI.id, 'Project')
            )}
        </div>

        <div className={`${ROOT}__header--memo`}>{msg().Psa_Lbl_RoleMemo}</div>

        <div className={`${ROOT}__memo`} ref={memoRef} key={`${ROOT}__memo`}>
          <div
            className={`${ROOT}__memo-field--all`}
            data-testid={`${ROOT}__memo-field--all`}
          >
            <p className={`${ROOT}__memo-label`}>
              {msg().Psa_Lbl_RoleMemoForAll}
            </p>
            <p className={`${ROOT}__memo-content`}>
              {memoForAll || noRemarksMemo}
            </p>
            <span className={`${ROOT}__memo-icon`}>
              <EditIcon />
            </span>
            <a onClick={showMemo(MEMO_TYPE.ALL)}>{msg().Com_Btn_Edit}</a>
          </div>

          {visibleForManagers && (
            <div
              className={`${ROOT}__memo-field--managers`}
              data-testid={`${ROOT}__memo-field--managers`}
            >
              <p className={`${ROOT}__memo-label`}>
                {msg().Psa_Lbl_RoleMemoForManagers}
              </p>
              <p className={`${ROOT}__memo-content`}>
                {memoForManagers || noRemarksMemo}
              </p>
              <span className={`${ROOT}__memo-icon`}>
                <EditIcon />
              </span>
              <a onClick={showMemo(MEMO_TYPE.MANAGERS)}>{msg().Com_Btn_Edit}</a>
            </div>
          )}

          {visibleForRM && (
            <div
              className={`${ROOT}__memo-field--rm`}
              data-testid={`${ROOT}__memo-field--rm`}
            >
              <p className={`${ROOT}__memo-label`}>
                {msg().Psa_Lbl_RoleMemoForRM}
              </p>
              <p className={`${ROOT}__memo-content`}>
                {memoForRM || noRemarksMemo}
              </p>
              <span className={`${ROOT}__memo-icon`}>
                <EditIcon />
              </span>
              <a onClick={showMemo(MEMO_TYPE.RM)}>{msg().Com_Btn_Edit}</a>
            </div>
          )}
        </div>

        {isCommentHistoryVisible && (
          <RoleDetailsHistory
            commentsHistory={selectedRole.commentsHistory}
            elementRef={commentHistoryRef}
            openEmployeeCapabilityInfo={props.openEmployeeCapabilityInfo}
          />
        )}

        <a onClick={scrollToTop}>{msg().Psa_Btn_BackToTop}</a>
      </div>
      {renderActiveDialog()}
    </div>
  );
};

export default RoleDetails;
