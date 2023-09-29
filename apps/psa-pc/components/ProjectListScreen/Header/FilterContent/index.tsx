import React, { useState } from 'react';

import TextField from '@apps/commons/components/fields/TextField';
import PsaDateRangeField from '@apps/commons/components/psa/Fields/DateRangeField';
import FormField from '@apps/commons/components/psa/FormField';
import PsaAutoSuggestTextField from '@apps/commons/components/psa/PsaAutoSuggestTextField';
import msg from '@apps/commons/languages';
import DateUtil from '@apps/commons/utils/DateUtil';

// Job select dialog
import JobRepository from '@apps/repositories/JobRepository';

import { Job as JobMaster } from '@apps/domain/models/organization/Job';
import { ProjectListFilterState } from '@apps/domain/models/psa/Project';

import ClearableField from '@apps/admin-pc/components/Common/ClearableField';

import { useJobSelectDialog } from '@apps/time-tracking/JobSelectDialog';

import './index.scss';

type Props = {
  companyId?: string;
  filterResults: ProjectListFilterState;
  catchBusinessError: (type: string, message: string, solution: string) => void;
  updateFilter: (arg0: string, arg1: any) => void;
  updateFilterObj: (filterObj: any) => void;
  updateReduxState?: (nextFilterState: ProjectListFilterState) => void;
  deptSuggestList: Array<any>;
  isResetted?: boolean;
  doRefresh?: number;
  enDash?: string;
};

const ROOT = 'ts-psa__common-filter__content';

const FilterContent = (props: Props) => {
  const autoSuggestDepartment = {
    value: 'id',
    label: 'name',
    buildLabel: (item) =>
      `${item.name}${item.code ? ` ${props.enDash} ${item.code}` : ''}`,
    suggestionKey: ['id', 'code', 'name'],
  };

  const [jobCodeTargetDate, setJobCodeTargetDate] = useState(
    DateUtil.getToday()
  );
  const filterStatus = [...props.filterResults.statusList];
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
        jobId: id,
      });
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
            onChange={(e) =>
              props.updateFilter('projectManager', e.target.value)
            }
            value={props.filterResults.projectManager}
          />
        </FormField>

        <FormField
          title={msg().Psa_Lbl_ProjectManagerCode}
          testId={`${ROOT}__project-manager-code`}
        >
          <TextField
            onChange={(e) =>
              props.updateFilter('projectManagerCode', e.target.value)
            }
            value={props.filterResults.projectManagerCode}
          />
        </FormField>

        <FormField
          title={msg().Psa_Lbl_StartDate}
          testId={`${ROOT}__start-date`}
        >
          <PsaDateRangeField
            startDateFieldProps={{
              value: props.filterResults.projectStartDate[0],
              onChange: (value) =>
                props.updateFilter('projectStartDate', [
                  value,
                  props.filterResults.projectStartDate[1],
                ]),
            }}
            endDateFieldProps={{
              value: props.filterResults.projectStartDate[1],
              onChange: (value) =>
                props.updateFilter('projectStartDate', [
                  props.filterResults.projectStartDate[0],
                  value,
                ]),
            }}
            isResetted={props.isResetted}
            doRefresh={props.doRefresh}
          />
        </FormField>

        <FormField title={msg().Psa_Lbl_EndDate} testId={`${ROOT}__end-date`}>
          <PsaDateRangeField
            startDateFieldProps={{
              value: props.filterResults.projectEndDate[0],
              onChange: (value) =>
                props.updateFilter('projectEndDate', [
                  value,
                  props.filterResults.projectEndDate[1],
                ]),
            }}
            endDateFieldProps={{
              value: props.filterResults.projectEndDate[1],
              onChange: (value) =>
                props.updateFilter('projectEndDate', [
                  props.filterResults.projectEndDate[0],
                  value,
                ]),
            }}
            isResetted={props.isResetted}
            doRefresh={props.doRefresh}
          />
        </FormField>
      </div>

      <div className={`${ROOT}__center`}>
        <FormField
          title={msg().Psa_Lbl_ProjectDepartment}
          testId={`${ROOT}__project-department`}
        >
          <PsaAutoSuggestTextField
            onChange={(value) => {
              const lastIndex = value.indexOf(props.enDash);
              let deptName = value;
              if (value.split(props.enDash).length > 1) {
                deptName = value.substring(0, lastIndex);
              }
              props.updateFilter('deptName', deptName.trim());
            }}
            placeholder={msg().Psa_Lbl_SearchProjectDepartment}
            suggestConfig={autoSuggestDepartment}
            suggestList={props.deptSuggestList}
            value={props.filterResults.deptName}
          />
        </FormField>

        <FormField
          title={msg().Psa_Lbl_RequestedBy}
          testId={`${ROOT}__project-requester`}
        >
          <TextField
            onChange={(e) => props.updateFilter('requester', e.target.value)}
            value={props.filterResults.requester}
          />
        </FormField>

        <FormField
          title={msg().Psa_Lbl_RequesterCode}
          testId={`${ROOT}__project-requester-code`}
        >
          <TextField
            onChange={(e) =>
              props.updateFilter('requesterCode', e.target.value)
            }
            value={props.filterResults.requesterCode}
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
          title={msg().Psa_Lbl_ProjectCode}
          testId={`${ROOT}__project-code`}
        >
          {/* <button onClick={onClickShowDialog}></button> */}
          <ClearableField
            onClickClearBtn={() => {
              props.updateFilterObj({
                jobId: '',
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
        </FormField>
      </div>
      <div className={`${ROOT}__right`}>
        <FormField title={msg().Psa_Lbl_Status} testId={`${ROOT}__status`}>
          <div className={`${ROOT}__status`}>
            {['Planning', 'InProgress', 'Completed', 'Cancelled'].map(
              (status) => {
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
                    />
                    <span className={`${ROOT}__status-text`}>
                      {msg()[`Psa_Lbl_Status${status}`]}
                    </span>
                  </label>
                );
              }
            )}
          </div>
        </FormField>
      </div>
    </div>
  );
};

export default FilterContent;
