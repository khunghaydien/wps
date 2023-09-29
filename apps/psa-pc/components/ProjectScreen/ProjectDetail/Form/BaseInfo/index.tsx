import React, { useEffect, useState } from 'react';

import AmountField from '@apps/commons/components/fields/AmountField';
import SelectField from '@apps/commons/components/fields/SelectField';
import TextAreaField from '@apps/commons/components/fields/TextAreaField';
import TextField from '@apps/commons/components/fields/TextField';
import PsaDateField from '@apps/commons/components/psa/Fields/DateField';
import ResourceGroup from '@apps/commons/components/psa/FilterInfo/ResourceGroupFilter';
import FormField from '@apps/commons/components/psa/FormField';
import msg from '@apps/commons/languages';
import DateUtil from '@apps/commons/utils/DateUtil';
import { generatePicklistOptions } from '@apps/commons/utils/psa/ExtendedItemUtil';
import TimeUtil from '@apps/commons/utils/TimeUtil';

// --- Job Selection --- //
import JobRepository from '@apps/repositories/JobRepository';

// --- Job Selection --- //
import { Employee } from '@apps/domain/models/organization/Employee';
import { Job as JobMaster } from '@apps/domain/models/organization/Job';
import { PROJECT_STATUS } from '@apps/domain/models/psa/Project';
import { PsaExtendedItem } from '@apps/domain/models/psa/PsaExtendedItem';

import AutoSuggestTextField from '@apps/admin-pc/components/AutoSuggestTextField';
import ClearableField from '@apps/admin-pc/components/Common/ClearableField';
import { Props as FormProps } from '@psa/components/ProjectScreen/ProjectDetail/Form';

import { useJobSelectDialog } from '@apps/time-tracking/JobSelectDialog';

import './index.scss';

type Props = {
  useExistingJobCode: boolean;
  hasInProgressOrCompletedActivity: boolean;
  catchBusinessError: (type: string, message: string, solution: string) => void;
  companyId: string;
  selectedGroupId: string;
} & FormProps;

const FORM_ROOT = 'ts-psa__project-form';
const ROOT = `${FORM_ROOT}__base`;

export const autoSuggest = {
  value: 'id',
  label: 'name',
  buildLabel: (item) => `${item.name}${item.code ? ` - ${item.code}` : ''}`,
  suggestionKey: ['id', 'code', 'name'],
};

const processedManagerListOption = (employeeList: Array<Employee>) => {
  return employeeList.map((emp) => ({
    id: emp.id,
    code: emp.code,
    name: emp.name,
    displayName: `${emp.name} - ${emp.code}`,
  }));
};

const BaseInfo = (props: Props) => {
  const {
    errors,
    values,
    touched,
    refArray,
    companyId,
    useExistingJobCode,
    selectedProject,
  } = props;
  const [pmSuggestList, setPmSuggestList] = useState(
    processedManagerListOption(props.managerListOption)
  );
  const [jobCodeTargetDate, setJobCodeTargetDate] = useState(
    DateUtil.getToday()
  );
  const { clientName, clientId, clientCode } = selectedProject;

  const isEverythingElseDisabled = values.status !== 'Planning';
  const isProjectCancelled =
    selectedProject && selectedProject.status === 'Cancelled';

  const statusOption =
    selectedProject &&
    Object.keys(PROJECT_STATUS).map((key) => {
      let isStatusDisabled = null;

      // if current status is In Progress, then allow user to change to Planning option
      // only if there are NO In Progress or Completed Activities
      if (
        selectedProject.status === 'InProgress' &&
        key === 'Planning' &&
        props.hasInProgressOrCompletedActivity
      ) {
        isStatusDisabled = true;
      }

      // if current status is Cancelled, then do not allow user to select other statuses
      if (isProjectCancelled && key !== selectedProject.status) {
        isStatusDisabled = true;
      }

      // if current status is completed, then only allow in progress
      if (selectedProject.status === 'Completed' && key !== 'InProgress') {
        isStatusDisabled = true;
      }

      return {
        value: key,
        text: msg()[`Psa_Lbl_Status${key}`],
        disabled: isStatusDisabled,
      };
    });

  // --- START Job Selection --- //
  // project end date / job end date
  const targetDate = DateUtil.format(values.startDate, 'YYYY-MM-DD');

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

  const initialClientSuggestList = clientName
    ? [
        {
          name: clientName,
          id: clientId,
          code: clientCode,
          displayLabel: `${clientName} - ${clientCode}`,
        },
      ]
    : [];
  const [clientSuggestList, setClientSuggestList] = useState(
    initialClientSuggestList
  );

  const [selectedResourceGroup, setSelectedResourceGroup] = useState(null);

  useEffect(() => {
    props.setFieldValue('pmBaseId', props.selectedProject.pmBaseId);
  }, []);

  useEffect(() => {
    setSelectedResourceGroup(
      props.resourceGroupList.filter((e) => e.id === props.values.groupId)
    );
  }, [props.resourceGroupList]);

  useEffect(() => {
    if (props.projectManagerId) {
      props.setFieldValue('pmBaseId', props.projectManagerId);
    }
  }, [props.projectManagerId]);

  const onProjectManagerChange = (eventObj) => {
    if (eventObj) {
      // update the suggestion list
      setPmSuggestList([eventObj]);

      // update the project manager Id
      props.setFieldValue('pmBaseId', eventObj.id);

      // update the selected project manager Id locally
      props.saveProjectManagerLocally(eventObj.id);
    }
  };

  const onProjectManagerBlur = (value) => {
    if (value === '') {
      setPmSuggestList([]);
      props.setFieldValue('pmBaseId', '');
      props.saveProjectManagerLocally('');
    }
  };

  const onProjectClientChange = (eventObj) => {
    if (eventObj) {
      // update the suggestion list
      setClientSuggestList([eventObj]);

      // update the project manager Id
      props.setFieldValue('clientId', eventObj.id);
    }
  };

  const onProjectClientBlur = (value) => {
    if (value === '') {
      setClientSuggestList([]);
      props.setFieldValue('clientId', '');
    }
  };

  const [renderedExtendedItem, setRenderedExtendedItem] = useState(<div></div>);
  const formFieldGenerator = (extendedItem: PsaExtendedItem) => {
    let result;
    switch (extendedItem.inputType) {
      case 'Text':
        result = (
          <input
            disabled={extendedItem.readOnly}
            className="ts-text-field slds-input"
            type="text"
            onChange={(e) => {
              props.setFieldValue(`${extendedItem.id}`, e.target.value);
            }}
            value={values[extendedItem.id]}
          />
        );
        break;
      case 'Date':
        result = (
          <PsaDateField
            disabled={extendedItem.readOnly}
            placeholder={msg().Admin_Lbl_ExtendedItemDate}
            value={DateUtil.format(values[extendedItem.id], 'YYYY-MM-DD')}
            onChange={(eiDate) => {
              props.setFieldValue(`${extendedItem.id}`, eiDate);
            }}
          />
        );
        break;
      case 'Picklist':
        result = (
          <SelectField
            disabled={extendedItem.readOnly}
            className={`${ROOT}__ei-select`}
            options={
              extendedItem.picklistValue &&
              generatePicklistOptions(
                extendedItem.picklistLabel,
                extendedItem.picklistValue
                  .split('\\n')
                  .map((e) => e.trim())
                  .join('\\n')
              )
            }
            onChange={(e) => {
              props.setFieldValue(`${extendedItem.id}`, e.target.value);
            }}
            value={values[extendedItem.id]}
          />
        );
        break;
    }
    return result;
  };
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

  useEffect(() => {
    if (
      props.extendedItemConfigList &&
      props.extendedItemConfigList.length > 0
    ) {
      const extendedItems = (
        <div className={`${ROOT}__form-field-container`}>
          {props.extendedItemConfigList &&
            props.extendedItemConfigList.map(
              (eItem) =>
                eItem.enabled && (
                  <FormField
                    title={eItem.name}
                    testId={`${ROOT}__eI`}
                    isRequired={eItem.required}
                    error={errors[eItem.id]}
                    isTouched={errors[eItem.id] || touched[eItem.id]}
                    tooltip={eItem.description}
                  >
                    {formFieldGenerator(eItem)}
                  </FormField>
                )
            )}
        </div>
      );
      setRenderedExtendedItem(extendedItems);
    }
  }, [props.extendedItemConfigList, values, touched, errors]);
  return (
    <section ref={refArray[0]} className={ROOT}>
      <h3 className={`${FORM_ROOT}__title`}>{msg().Psa_Lbl_BaseInfo}</h3>

      <FormField
        title={msg().Psa_Lbl_ProjectCode}
        isRequired
        error={useExistingJobCode ? errors.jobId : errors.code}
        isTouched={useExistingJobCode ? touched.jobId : touched.code}
        testId={`${ROOT}__code`}
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
            labelSelectBtn={msg().Admin_Lbl_SelectParentJob}
            label={selectedJobLabel}
            disabled={isEverythingElseDisabled}
            dialog={null}
            isDialogOpen={false}
          />
        ) : (
          <TextField
            disabled={isEverythingElseDisabled}
            onChange={(e) => {
              props.setFieldValue('code', e.target.value);
            }}
            value={values.code}
          />
        )}
      </FormField>

      <FormField
        title={msg().Psa_Lbl_ProjectTitle}
        isRequired
        error={errors.name}
        isTouched={touched.name}
        testId={`${ROOT}__name`}
      >
        <TextField
          disabled={isEverythingElseDisabled}
          onChange={(e) => {
            props.setFieldValue('name', e.target.value);
          }}
          value={values.name}
        />
      </FormField>

      <FormField
        title={msg().Psa_Lbl_ProjectDescription}
        className={`${ROOT}__desc`}
        error={errors.description}
        isTouched={touched.description}
        testId={`${ROOT}__description`}
      >
        <TextAreaField
          disabled={isEverythingElseDisabled}
          onChange={(e) => {
            props.setFieldValue('description', e.target.value);
          }}
          value={values.description || ''}
        />
      </FormField>

      <FormField
        title={msg().Psa_Lbl_ProjectManager}
        isRequired
        error={errors.pmBaseId}
        isTouched={touched.pmBaseId}
        testId={`${ROOT}__pm`}
      >
        {/* @ts-ignore */}
        <AutoSuggestTextField
          companyId={props.companyId}
          debounceDelay={300}
          loadAsyncSuggestions={props.searchEmployeeList}
          processSuggestList={props.getManagerList}
          onSelectAsyncSuggestion={(eventObj) => {
            onProjectManagerChange(eventObj);
          }}
          onBlurAsyncSuggestion={(value) => {
            onProjectManagerBlur(value);
          }}
          disabled={isEverythingElseDisabled}
          onBlur={(e, value) => {
            props.setFieldValue('pmBaseId', value);
          }}
          value={values.pmBaseId}
          suggestList={pmSuggestList}
          suggestConfig={autoSuggest}
          psaGroupId={props.selectedGroupId}
        />
      </FormField>

      <FormField
        title={msg().Psa_Lbl_ProjectClient}
        testId={`${ROOT}__project-client`}
        tooltip={msg().Psa_Lbl_SearchProjectClientByName}
        error={errors.clientId}
        isTouched={touched.clientId}
      >
        {/* @ts-ignore */}
        <AutoSuggestTextField
          debounceDelay={500}
          companyId={props.companyId}
          loadAsyncSuggestions={props.searchClientList}
          processSuggestList={(clientList) => clientList.records}
          onSelectAsyncSuggestion={(eventObj) => {
            onProjectClientChange(eventObj);
          }}
          disabled={isEverythingElseDisabled}
          onBlurAsyncSuggestion={(value) => {
            onProjectClientBlur(value);
          }}
          value={values.clientId}
          suggestList={clientSuggestList}
          suggestConfig={autoSuggest}
          placeholder={msg().Psa_Lbl_SearchProjectClient}
        />
      </FormField>

      <FormField
        title={msg().Psa_Lbl_ProjectDepartment}
        testId={`${ROOT}__project-department`}
        error={errors.deptId}
        isTouched={touched.deptId}
      >
        {/* @ts-ignore */}
        <AutoSuggestTextField
          onBlur={(e, value) => {
            props.setFieldValue('deptId', value);
          }}
          value={values.deptId}
          disabled={isEverythingElseDisabled}
          suggestList={props.deptSuggestList}
          suggestConfig={autoSuggest}
          placeholder={msg().Psa_Lbl_SearchProjectDepartment}
        />
      </FormField>

      <FormField
        title={msg().Psa_Lbl_ResourceGroup}
        testId={`${ROOT}__rg`}
        error={errors.groupId}
        isTouched={touched.groupId}
      >
        <ResourceGroup
          getMembers={props.getGroupMembers}
          title={msg().Psa_Lbl_SelectResourceGroup}
          isResetted={true}
          name={msg().Psa_Lbl_SelectResourceGroup}
          groupDetail={{
            owners: getDetails('owners'),
            members: getDetails('members'),
          }}
          groupList={props.resourceGroupList}
          onSelect={(groupSet: Set<any>) => {
            const groups = Array.from(groupSet);
            if (groups.length) {
              props.setFieldValue('groupId', groups[0].id);
              setSelectedResourceGroup(
                props.resourceGroupList.filter((e) => e.id === groups[0].id)
              );
            }
          }}
          onRemove={() => {
            props.setFieldValue('groupId', '');
          }}
          resourceGroups={selectedResourceGroup}
          selectLimit={1}
        />
      </FormField>

      <FormField
        title={msg().Psa_Lbl_WorkTimePerDay}
        isRequired
        error={errors.workTimePerDay}
        isTouched={touched.workTimePerDay}
        testId={`${ROOT}__work-hours`}
      >
        <AmountField
          disabled={isEverythingElseDisabled}
          onChange={(value) => {
            if (typeof value !== 'undefined') {
              const minutes = Number(value) * 60;
              props.setFieldValue('workTimePerDay', minutes);
            } else {
              props.setFieldValue('workTimePerDay', '');
            }
          }}
          value={
            values.workTimePerDay ? TimeUtil.toHours(values.workTimePerDay) : ''
          }
        />
      </FormField>

      <FormField
        title={msg().Psa_Lbl_ProjectDuration}
        className={`${ROOT}__date`}
        error={errors.startDate}
        isTouched={touched.startDate}
      >
        <PsaDateField
          disabled={isEverythingElseDisabled}
          placeholder={msg().Psa_Lbl_StartDate}
          value={targetDate}
          onChange={(startDate) => {
            props.setFieldValue('startDate', startDate);
          }}
          data-testid={`${ROOT}__start-date`}
        />
        <span className="separator">-</span>
        <PsaDateField
          disabled={isEverythingElseDisabled}
          placeholder={msg().Psa_Lbl_EndDate}
          value={DateUtil.format(values.endDate, 'YYYY-MM-DD')}
          onChange={(endDate) => {
            props.setFieldValue('endDate', endDate);
          }}
          data-testid={`${ROOT}__end-date`}
        />
      </FormField>

      <FormField
        title={msg().Com_Lbl_Status}
        error={errors.status}
        isTouched={touched.status}
        testId={`${ROOT}__status`}
      >
        <SelectField
          disabled={isProjectCancelled}
          onChange={(e) => {
            props.setFieldValue('status', e.target.value);
          }}
          options={statusOption}
          value={values.status}
        />
      </FormField>

      <FormField
        title={msg().Psa_Lbl_Calendar}
        className={`${ROOT}__calendar`}
        testId={`${ROOT}__calendar`}
      >
        <SelectField
          disabled={isEverythingElseDisabled}
          className={`${ROOT}__calendar-contents`}
          options={props.calendarListOption}
          onChange={(e) => {
            props.setFieldValue('calendarId', e.target.value);
          }}
          value={values.calendarId}
        />
      </FormField>

      <FormField
        title={msg().Psa_Lbl_WorkingDays}
        className={`${ROOT}__workingdays`}
        testId={`${ROOT}__working-days`}
      >
        <div className={`${ROOT}__workingdays-contents`}>
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => {
            const workingDay = `workingDay${day.toUpperCase()}`;
            return (
              <label
                className={`${ROOT}__workingdays-label`}
                htmlFor={workingDay}
                key={workingDay}
              >
                <input
                  type="checkbox"
                  disabled={isEverythingElseDisabled}
                  id={workingDay}
                  className={`${ROOT}__workingdays-checkbox`}
                  onChange={() =>
                    props.setFieldValue(workingDay, !values[workingDay])
                  }
                  value={values[workingDay] || false}
                  checked={values[workingDay] || false}
                />
                <span className={`${ROOT}__workingdays-text`}>
                  {msg()[`Com_Lbl_${day}`]}
                </span>
              </label>
            );
          })}
        </div>
      </FormField>
      {renderedExtendedItem}
    </section>
  );
};

export default BaseInfo;
