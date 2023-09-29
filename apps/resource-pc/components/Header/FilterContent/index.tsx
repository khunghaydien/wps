import React, { useEffect, useState } from 'react';

import Combobox from '@apps/commons/components/fields/Combobox';
import TextField from '@apps/commons/components/fields/TextField';
import PsaDateRangeField from '@apps/commons/components/psa/Fields/DateRangeField';
import ResourceGroupFilter from '@apps/commons/components/psa/FilterInfo/ResourceGroupFilter';
import FormField from '@apps/commons/components/psa/FormField';
import msg from '@apps/commons/languages';
import DateUtil from '@apps/commons/utils/DateUtil';
import { sortByCode } from '@apps/commons/utils/psa/resourcePlannerUtil';

// Job select dialog
import JobRepository from '@apps/repositories/JobRepository';

import { Job as JobMaster } from '@apps/domain/models/organization/Job';
import { RoleRequestListFilterState } from '@apps/domain/models/psa/Request';
import { RoleStatus } from '@apps/domain/models/psa/RoleStatus';

import AutoSuggestTextField from '@apps/admin-pc/components/AutoSuggestTextField';
import ClearableField from '@apps/admin-pc/components/Common/ClearableField';
import { autoSuggest } from '@apps/psa-pc/components/ProjectScreen/ProjectDetail/Form/BaseInfo';

import { useJobSelectDialog } from '@apps/time-tracking/JobSelectDialog';

import './index.scss';

type Props = {
  companyId: string;
  currencyCode: string;
  deptSuggestList: Array<any>;
  filterResults: RoleRequestListFilterState;
  isDisabled?: boolean;
  getGroupMembers: (arg0: string) => void;
  groupDetail: any;
  groupList: Array<any>;
  jobGrades: Array<any>;
  catchBusinessError: (type: string, message: string, solution: string) => void;
  updateFilter: (arg0: string, arg1: any) => void;
  updateFilterObj: (filterObj: any) => void;
  updateReduxState?: (nextFilterState: any) => void;
  isResetted?: boolean;
  doRefresh?: number;
};

const ROOT = 'ts-psa__common-filter__content';

const FilterContent = (props: Props) => {
  const filterStatus = [...props.filterResults.statusList];

  const [jobCodeTargetDate, setJobCodeTargetDate] = useState(
    DateUtil.getToday()
  );

  // Job Grade Options
  const [jobGradeOptions, setJobGradeOptions] = useState(props.jobGrades);
  useEffect(() => {
    const updatedJobGradeOptions = props.jobGrades.map((jobGrade) => {
      if (jobGrade.costRate > 0) {
        jobGrade.label = `${jobGrade.label} / ${props.currencyCode} ${jobGrade.costRate}`;
      }
      return jobGrade;
    });

    setJobGradeOptions(updatedJobGradeOptions.sort(sortByCode));
  }, []);
  // End Job Grade Options

  const [isJobGradeComboBoxDisabled, setIsJobGradeComboBoxDisabled] =
    useState(false);
  const [comboboxClass, setComboboxClass] = useState('');
  const onJobGradeSelect = (jobGradeValues: any) => {
    const jobGradeIdList = jobGradeValues
      ? jobGradeValues.map((jobGrade) => jobGrade.id)
      : [];
    if (jobGradeIdList.length >= 5) {
      setIsJobGradeComboBoxDisabled(true);
      setComboboxClass(`${ROOT}__combobox-wrapper`);
    } else {
      setIsJobGradeComboBoxDisabled(false);
      setComboboxClass('');
    }

    props.updateFilter('jobGradeIds', jobGradeValues);
  };

  // Job
  const { companyId, filterResults } = props;

  const onClickShowDialog = () => {
    props.updateReduxState(props.filterResults);
    showDialog();
  };

  const [showDialog] = useJobSelectDialog({
    targetDate: jobCodeTargetDate,
    onOk: ({ id, code }: JobMaster) => {
      props.updateReduxState({
        projectCode: code,
        projectJobId: id,
      });
    },
    onError: () =>
      props.catchBusinessError(
        msg().Psa_Err_Unexpected,
        msg().Psa_Err_DataExceed,
        ''
      ),
    repository: JobRepository,
    empId: null,
    companyId,
    isTargetDateFieldEnabled: true,
    updateTargetDate: (targetDate) => {
      setJobCodeTargetDate(targetDate);
    },
  });

  const getDetails = (type: string) => {
    const { groupDetail } = props;
    const result = groupDetail[type];
    return (
      result &&
      result.map((_) => ({
        id: _.employeeId,
        name: _.employeeName,
        title: _.employeeTitle,
        url: _.employeePhotoUrl,
      }))
    );
  };

  return (
    <div className={`${ROOT}`}>
      <div className={`${ROOT}__left`}>
        <FormField
          title={msg().Psa_Lbl_ProjectTitle}
          testId={`${ROOT}__project-title`}
        >
          <TextField
            onChange={(e) => props.updateFilter('projectTitle', e.target.value)}
            value={props.filterResults.projectTitle}
          />
        </FormField>

        <FormField
          title={msg().Psa_Lbl_ProjectManager}
          testId={`${ROOT}__project-manager`}
        >
          <TextField
            onChange={(e) => props.updateFilter('pmName', e.target.value)}
            value={props.filterResults.pmName}
          />
        </FormField>

        <FormField
          title={msg().Psa_Lbl_ProjectManagerCode}
          testId={`${ROOT}__project-manager-code`}
        >
          <TextField
            onChange={(e) => props.updateFilter('pmCode', e.target.value)}
            value={props.filterResults.pmCode}
          />
        </FormField>

        <FormField
          title={msg().Psa_Lbl_RequestCode}
          testId={`${ROOT}__project-request-code`}
        >
          <TextField
            onChange={(e) => props.updateFilter('requestCode', e.target.value)}
            value={props.filterResults.requestCode}
          />
        </FormField>

        <FormField
          title={msg().Psa_Lbl_ProjectClient}
          testId={`${ROOT}__project-client`}
        >
          <TextField
            onChange={(e) => props.updateFilter('clientName', e.target.value)}
            value={props.filterResults.clientName}
          />
        </FormField>

        <FormField
          title={msg().Psa_Lbl_ProjectDepartment}
          testId={`${ROOT}__project-department`}
        >
          {/* @ts-ignore */}
          <AutoSuggestTextField
            onBlur={(e, value) => {
              props.updateFilter('deptId', value);
            }}
            value={props.filterResults.deptId}
            suggestList={props.deptSuggestList}
            suggestConfig={autoSuggest}
            placeholder={msg().Psa_Lbl_SearchProjectDepartment}
          />
        </FormField>

        <div className={`${ROOT}__resource_group`}>
          <ResourceGroupFilter
            getMembers={props.getGroupMembers}
            title={msg().Psa_Lbl_SelectResourceGroup}
            isResetted={props.isResetted}
            name={msg().Psa_Lbl_AddResourceGroup}
            groupDetail={{
              owners: getDetails('owners'),
              members: getDetails('members'),
            }}
            groupList={props.groupList}
            onSelect={(groupSet: Set<any>) => {
              const groups = Array.from(groupSet);
              groups.length &&
                props.updateFilter('resourceGroup', groups[0].name);
            }}
            onRemove={() => {
              props.updateFilter('resourceGroup', '');
            }}
            resourceGroups={props.groupList.filter(
              (e) => e.name === props.filterResults.resourceGroup
            )}
            selectLimit={1}
          />
        </div>

        <FormField
          title={msg().Psa_Lbl_ProjectCode}
          testId={`${ROOT}__project-code`}
        >
          <div className={`${ROOT}__project-code-container`}>
            <ClearableField
              onClickClearBtn={() => {
                props.updateFilterObj({
                  projectJobId: '',
                  projectCode: '',
                });
              }}
              openDialog={onClickShowDialog}
              dialogProps={{
                singleSelection: true,
              }}
              disabled={false}
              labelSelectBtn={msg().Admin_Lbl_SelectParentJob}
              label={filterResults.projectCode}
              dialog={null}
              isDialogOpen={false}
            />
          </div>
        </FormField>
      </div>

      <div className={`${ROOT}__center`}>
        <FormField
          title={msg().Psa_Lbl_ProjectRoleTitle}
          testId={`${ROOT}__role-title`}
        >
          <TextField
            onChange={(e) => props.updateFilter('roleTitle', e.target.value)}
            value={props.filterResults.roleTitle}
          />
        </FormField>

        <FormField
          title={msg().Psa_Lbl_RequestedBy}
          testId={`${ROOT}__requester-name`}
        >
          <TextField
            onChange={(e) =>
              props.updateFilter('requesterName', e.target.value)
            }
            value={props.filterResults.requesterName}
          />
        </FormField>

        <FormField
          title={msg().Psa_Lbl_RequesterCode}
          testId={`${ROOT}__requester-code`}
        >
          <TextField
            onChange={(e) =>
              props.updateFilter('requesterCode', e.target.value)
            }
            value={props.filterResults.requesterCode}
          />
        </FormField>

        <FormField
          title={msg().Psa_Lbl_ResourceManager}
          testId={`${ROOT}__rm-name`}
        >
          <TextField
            onChange={(e) => props.updateFilter('rmName', e.target.value)}
            value={props.filterResults.rmName}
          />
        </FormField>

        <FormField
          title={msg().Psa_Lbl_AssignmentDueDate}
          testId={`${ROOT}__assignment-due-date`}
        >
          <PsaDateRangeField
            startDateFieldProps={{
              value: props.filterResults.assignmentDueDate[0],
              onChange: (value) =>
                props.updateFilter('assignmentDueDate', [
                  value,
                  props.filterResults.assignmentDueDate[1],
                ]),
            }}
            endDateFieldProps={{
              value: props.filterResults.assignmentDueDate[1],
              onChange: (value) =>
                props.updateFilter('assignmentDueDate', [
                  props.filterResults.assignmentDueDate[0],
                  value,
                ]),
            }}
            isResetted={props.isResetted}
            doRefresh={props.doRefresh}
          />
        </FormField>

        <FormField
          title={msg().Psa_Lbl_StartDate}
          testId={`${ROOT}__start-date`}
        >
          <PsaDateRangeField
            startDateFieldProps={{
              value: props.filterResults.roleStartDate[0],
              onChange: (value) =>
                props.updateFilter('roleStartDate', [
                  value,
                  props.filterResults.roleStartDate[1],
                ]),
            }}
            endDateFieldProps={{
              value: props.filterResults.roleStartDate[1],
              onChange: (value) =>
                props.updateFilter('roleStartDate', [
                  props.filterResults.roleStartDate[0],
                  value,
                ]),
            }}
            isResetted={props.isResetted}
            doRefresh={props.doRefresh}
          />
        </FormField>

        <FormField
          title={msg().Psa_Lbl_ReceivedDate}
          testId={`${ROOT}__received-date`}
        >
          <PsaDateRangeField
            startDateFieldProps={{
              value: props.filterResults.receivedDate[0],
              onChange: (value) =>
                props.updateFilter('receivedDate', [
                  value,
                  props.filterResults.receivedDate[1],
                ]),
            }}
            endDateFieldProps={{
              value: props.filterResults.receivedDate[1],
              onChange: (value) =>
                props.updateFilter('receivedDate', [
                  props.filterResults.receivedDate[0],
                  value,
                ]),
            }}
            isResetted={props.isResetted}
            doRefresh={props.doRefresh}
          />
        </FormField>
      </div>
      <div className={`${ROOT}__right`}>
        <FormField
          title={msg().Admin_Lbl_JobGrade}
          testId={`${ROOT}__job-grade`}
          tooltip={msg().Psa_Lbl_JobGradeTooltip}
          tooltipPosition="right"
        >
          <div className={`${comboboxClass}`}>
            <Combobox
              data-testid={`${ROOT}__combobox`}
              disabled={isJobGradeComboBoxDisabled}
              options={jobGradeOptions}
              onSelect={onJobGradeSelect}
              selection={
                props.filterResults && props.filterResults.jobGradeIds
                  ? jobGradeOptions.filter((jobGradeOption) =>
                      props.filterResults.jobGradeIds
                        .map((jobGrade) => jobGrade.id)
                        .includes(jobGradeOption.id)
                    )
                  : []
              }
            />
          </div>
        </FormField>

        <FormField title={msg().Psa_Lbl_Status} testId={`${ROOT}__status`}>
          <div className={`${ROOT}__status`}>
            {[
              RoleStatus.Planning,
              RoleStatus.InProgress,
              RoleStatus.NotFound,
              RoleStatus.Requested,
              RoleStatus.SoftBooked,
              RoleStatus.Confirmed,
              RoleStatus.Scheduling,
            ].map((status) => {
              return (
                <label
                  className={`${ROOT}__status-label`}
                  htmlFor={status}
                  key={status}
                >
                  <input
                    type="checkbox"
                    id={status}
                    className={`${ROOT}__status-checkbox`}
                    onChange={() => {
                      let newFilterStatus;
                      if (filterStatus.includes(status)) {
                        newFilterStatus = filterStatus.filter(
                          (i) => i !== status
                        );
                      } else {
                        newFilterStatus = [...filterStatus, status];
                      }
                      props.updateFilter('statusList', newFilterStatus);
                    }}
                    value={status}
                    checked={!!filterStatus.includes(status)}
                    disabled={props.isDisabled}
                  />
                  <span className={`${ROOT}__status-text`}>
                    {msg()[`Psa_Lbl_Status${status}`]}
                  </span>
                </label>
              );
            })}
          </div>
        </FormField>
      </div>
    </div>
  );
};

export default FilterContent;
