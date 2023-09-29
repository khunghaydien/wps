import React, { useRef, useState } from 'react';

import { FormikErrors, FormikTouched } from 'formik';

import Button from '@apps/commons/components/buttons/Button';
import DialogFrame from '@apps/commons/components/dialogs/DialogFrame';
import SelectField from '@apps/commons/components/fields/SelectField';
import TextField from '@apps/commons/components/fields/TextField';
import ErrorBox from '@apps/commons/components/psa/ErrorBox';
import PsaDateField from '@apps/commons/components/psa/Fields/DateField';
import FormField from '@apps/commons/components/psa/FormField';
import msg from '@apps/commons/languages';
import DateUtil from '@apps/commons/utils/DateUtil';

// --- Job Selection --- //
import JobRepository from '@apps/repositories/JobRepository';

import { Job as JobMaster } from '@apps/domain/models/organization/Job';
import {
  Activity,
  ACTIVITY_STATUS,
  ActivityList,
} from '@apps/domain/models/psa/Activity';
import { Project } from '@apps/domain/models/psa/Project';
import ROLE_STATUS from '@apps/domain/models/psa/RoleStatus';

import ClearableField from '@apps/admin-pc/components/Common/ClearableField';
import { useMountEffect } from '@apps/psa-pc/components/Dialog/NewProjectForm';

import { useJobSelectDialog } from '@apps/time-tracking/JobSelectDialog';

// --- Job Selection --- //
import './index.scss';

type Errors = {
  title: string;
  code: string;
  jobId: string;
  jobCode: string;
  plannedStartDate: string;
  plannedEndDate: string;
};

type Touched = {
  title: boolean;
  code: boolean;
  jobId: boolean;
  jobCode: boolean;
  plannedStartDate: boolean;
  plannedEndDate: boolean;
};

type Values = {
  title: string;
  code: string;
  jobId: string;
  jobCode: string;
  status: string;
  plannedStartDate: string;
  plannedEndDate: string;
};

type FormikProps = {
  dirty: boolean;
  errors: FormikErrors<Errors>;
  handleSubmit: () => void;
  setFieldValue: (arg0: string, arg1: any) => void;
  touched: FormikTouched<Touched>;
  values: Values;
};

type Props = {
  activityList?: ActivityList;
  companyId: string;
  hideDialog: () => void;
  isActivityDetail?: boolean;
  managerListOption: Array<any>;
  onClickDeleteActivity?: () => void;
  catchBusinessError: (type: string, message: string, solution: string) => void;
  selectedActivity: Activity;
  selectedProject: Project;
  useExistingJobCode: boolean;
} & FormikProps;

const ROOT = 'ts-psa__new-activity-form';

// General Focus Hook
const UseFocus = () => {
  const ref = useRef(null);
  const setFocus = () => ref.current && ref.current.focus();
  const htmlElementAttributes = { ref };

  return [setFocus, htmlElementAttributes];
};

const NewActivityForm = (props: Props) => {
  const {
    errors,
    values,
    touched,
    companyId,
    useExistingJobCode,
    selectedActivity,
  } = props;

  const errorLabelObject = {
    title: msg().Psa_Lbl_ActivityName,
    code: msg().Psa_Lbl_ActivityCode,
    jobId: msg().Psa_Lbl_ActivityCode,
    plannedStartDate: msg().Psa_Lbl_StartDate,
    plannedEndDate: msg().Psa_Lbl_EndDate,
  };

  const activityStatus = values.status;
  const [setInput1Focus, input1FocusAttributes] = UseFocus();

  const selectedActivityWithRoles =
    props.activityList &&
    props.activityList.find(
      (_) => _.activityId === selectedActivity.activityId
    );
  const selectedActivityRoles =
    selectedActivityWithRoles && selectedActivityWithRoles.roles;

  const hasInProgressOrCompletedRoles =
    selectedActivityRoles &&
    selectedActivityRoles.some(
      (role) =>
        role.status === ROLE_STATUS.InProgress ||
        role.status === ROLE_STATUS.Completed
    );

  const isCancelledStatus =
    selectedActivity && selectedActivity.status === ACTIVITY_STATUS.Cancelled;

  // Note that the status options validation are based on SAVED activity status from BE.
  const statusOption =
    selectedActivity &&
    Object.keys(ACTIVITY_STATUS).map((key) => {
      let isStatusDisabled = null;

      // if current status is In Progress, then allow status change to Not Started
      // only if there are no In Progress/Completed roles
      if (
        selectedActivity.status === ACTIVITY_STATUS.InProgress &&
        key === ACTIVITY_STATUS.NotStarted &&
        hasInProgressOrCompletedRoles
      ) {
        // if there are in progress or completed roles, disable Not Started.
        isStatusDisabled = true;
      }

      // if current status is completed, then only allow user to change to in progress
      if (
        selectedActivity.status === ACTIVITY_STATUS.Completed &&
        key !== ACTIVITY_STATUS.InProgress
      ) {
        isStatusDisabled = true;
      }

      // if status is Cancelled, do not allow user to select other status
      if (isCancelledStatus && key !== selectedActivity.status) {
        isStatusDisabled = true;
      }

      return {
        value: key,
        text: msg()[`Psa_Lbl_Status${key}`],
        disabled: isStatusDisabled,
      };
    });

  // Note that the validation below are based on selected form values.
  const isActivityStarted = activityStatus !== ACTIVITY_STATUS.NotStarted;
  const isActivityCompleted = activityStatus === ACTIVITY_STATUS.Completed;
  const isActivityCancelled = activityStatus === ACTIVITY_STATUS.Cancelled;
  const isEverythingElseDisabled = isActivityStarted && props.isActivityDetail;
  const isEndDateDisabled = isActivityCompleted || isActivityCancelled;

  const isDeleteActivityDisabled = isActivityStarted;

  // @ts-ignore
  useMountEffect(setInput1Focus);

  let projectName;
  let projectStartDate;
  let projectEndDate;

  if (props.selectedProject) {
    projectName = props.selectedProject.name;
    projectStartDate = props.selectedProject.startDate;
    projectEndDate = props.selectedProject.endDate;
  } else {
    projectName = selectedActivity.projectName;
    projectStartDate = selectedActivity.projectStartDate;
    projectEndDate = selectedActivity.projectEndDate;
  }

  const { plannedStartDate, plannedEndDate } = props.values;
  // if activity start date is EARLIER than project start date OR activity end date is LATER than project end date.
  const isActivityDurationOutsideProjectDuration =
    new Date(plannedStartDate) < new Date(projectStartDate) ||
    new Date(plannedStartDate) > new Date(projectEndDate) ||
    new Date(plannedEndDate) < new Date(projectStartDate) ||
    new Date(plannedEndDate) > new Date(projectEndDate);

  // --- START Job Selection --- //
  // project end date / job end date
  // const targetDate = DateUtil.format(projectStartDate, 'YYYY-MM-DD');
  const [jobCodeTargetDate, setJobCodeTargetDate] = useState(
    DateUtil.getToday()
  );
  const selectedJobLabel = values.jobId ? values.jobCode : '';

  const [onClickShowDialog] = useJobSelectDialog({
    targetDate: jobCodeTargetDate,
    onOk: ({ id, code, name }: JobMaster) => {
      props.setFieldValue('jobId', id);
      props.setFieldValue('jobCode', `${code} - ${name}`);
    },
    onError: () =>
      props.catchBusinessError(
        msg().Psa_Err_Unexpected,
        msg().Psa_Err_DataExceed,
        ''
      ),
    repository: JobRepository,
    companyId,
    empId: null,
    isTargetDateFieldEnabled: true,
    updateTargetDate: (targetDate) => {
      setJobCodeTargetDate(targetDate);
    },
  });
  // --- END Job Selection --- //

  const renderErrorBox = () => {
    return (
      Object.keys(touched).length !== 0 &&
      Object.keys(errors).length !== 0 && (
        <div className={`${ROOT}__error-box`}>
          <ErrorBox errors={props.errors} errorLabelObject={errorLabelObject} />
        </div>
      )
    );
  };

  return (
    <DialogFrame
      title={
        props.isActivityDetail
          ? msg().Psa_Lbl_ActivityDetails
          : msg().Psa_Lbl_ActivityNew
      }
      hide={() => {}}
      withoutCloseButton
      className={`${ROOT}__dialog-frame`}
      draggable
      footer={
        <DialogFrame.Footer
          sub={
            props.isActivityDetail && (
              <Button
                disabled={isDeleteActivityDisabled}
                type="default"
                className={`${ROOT}--delete`}
                onClick={props.onClickDeleteActivity}
                data-testid={`${ROOT}--delete`}
              >
                {msg().Psa_Lbl_DeleteActivity}
              </Button>
            )
          }
        >
          <Button
            type="default"
            onClick={props.hideDialog}
            data-testid={`${ROOT}--cancel`}
          >
            {msg().Psa_Btn_Cancel}
          </Button>
          <Button
            disabled={!props.dirty}
            type="primary"
            onClick={props.handleSubmit}
            data-testid={`${ROOT}--save`}
          >
            {msg().Com_Btn_Save}
          </Button>
        </DialogFrame.Footer>
      }
    >
      <div className={`${ROOT}__inner`}>
        <div className={`${ROOT}__sub-header`}>
          <div
            className={`${ROOT}__sub-header__title`}
            data-testid={`${ROOT}__sub-header__title`}
          >
            <span className={`${ROOT}__sub-header__title-header`}>
              {msg().Psa_Lbl_ProjectTitle}
            </span>
            :
            <span className={`${ROOT}__sub-header__title-header-body`}>
              {projectName}
            </span>
          </div>
          <div
            className={`${ROOT}__sub-header__duration`}
            data-testid={`${ROOT}__sub-header--duration`}
          >
            <span className={`${ROOT}__sub-header__duration-header`}>
              &nbsp;{msg().Psa_Lbl_Duration}
            </span>
            :&nbsp;
            {`${DateUtil.format(projectStartDate)}
                  -
            ${DateUtil.format(projectEndDate)}`}
          </div>
        </div>

        <div className={`${ROOT}`}>
          {renderErrorBox()}
          <div className={`${ROOT}__form-field-container`}>
            <FormField
              title={msg().Psa_Lbl_ActivityName}
              testId={`${ROOT}--title`}
              isRequired
              error={errors.title}
              isTouched={touched.title}
            >
              <input
                disabled={isEverythingElseDisabled}
                className="ts-text-field slds-input"
                type="text"
                onChange={(e) => {
                  props.setFieldValue('title', e.target.value);
                }}
                key={`${ROOT}_title`}
                value={props.values.title}
                {...input1FocusAttributes}
              />
            </FormField>

            <FormField
              title={msg().Psa_Lbl_ActivityCode}
              testId={`${ROOT}--code`}
              isRequired
              error={useExistingJobCode ? errors.jobId : errors.code}
              isTouched={useExistingJobCode ? touched.jobId : touched.code}
            >
              {useExistingJobCode ? (
                <ClearableField
                  onClickClearBtn={() => {
                    props.setFieldValue('jobId', '');
                    props.setFieldValue('jobCode', '');
                  }}
                  openDialog={onClickShowDialog}
                  dialogProps={{
                    singleSelection: true,
                  }}
                  disabled={isEverythingElseDisabled}
                  labelSelectBtn={msg().Admin_Lbl_SelectParentJob}
                  label={selectedJobLabel}
                  dialog={null}
                  isDialogOpen={false}
                />
              ) : (
                <TextField
                  disabled={isEverythingElseDisabled}
                  onChange={(e) => {
                    props.setFieldValue('code', e.target.value);
                  }}
                  value={props.values.code}
                />
              )}
            </FormField>
          </div>

          <div className={`${ROOT}__form-field-container`}>
            <FormField
              title={msg().Psa_Lbl_StartDate}
              testId={`${ROOT}--start-date`}
              isRequired
              error={errors.plannedStartDate}
              isTouched={touched.plannedStartDate}
            >
              <PsaDateField
                disabled={isEverythingElseDisabled}
                placeholder={msg().Psa_Lbl_SelectStartDate}
                value={DateUtil.format(plannedStartDate, 'YYYY-MM-DD')}
                onChange={(startDate) => {
                  props.setFieldValue('plannedStartDate', startDate);
                }}
              />
            </FormField>

            <FormField
              title={msg().Psa_Lbl_EndDate}
              testId={`${ROOT}--end-date`}
              isRequired
              error={errors.plannedEndDate}
              isTouched={touched.plannedStartDate}
            >
              <PsaDateField
                disabled={isEndDateDisabled}
                placeholder={msg().Psa_Lbl_SelectEndDate}
                value={DateUtil.format(plannedEndDate, 'YYYY-MM-DD')}
                onChange={(endDate) => {
                  props.setFieldValue('plannedEndDate', endDate);
                }}
              />
            </FormField>
            {isActivityDurationOutsideProjectDuration && props.dirty && (
              <p className={`${ROOT}__activity-duration-warning`}>
                {msg().Psa_Warn_ActivityDurationOutsideProject}
              </p>
            )}
          </div>
          {selectedActivity &&
            selectedActivity.projectId &&
            props.isActivityDetail && (
              <FormField
                title={msg().Com_Lbl_Status}
                isRequired
                testId={`${ROOT}--select`}
              >
                <SelectField
                  disabled={isCancelledStatus}
                  onChange={(e) => {
                    props.setFieldValue('status', e.target.value);
                  }}
                  options={statusOption}
                  value={props.values.status}
                />
              </FormField>
            )}
        </div>
      </div>
    </DialogFrame>
  );
};

export default NewActivityForm;
