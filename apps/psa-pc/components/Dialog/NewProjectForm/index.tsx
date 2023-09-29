import React, { useEffect, useRef, useState } from 'react';

import { FormikErrors, FormikTouched } from 'formik';

import Button from '@apps/commons/components/buttons/Button';
import DialogFrame from '@apps/commons/components/dialogs/DialogFrame';
import SelectField from '@apps/commons/components/fields/SelectField';
import ErrorBox from '@apps/commons/components/psa/ErrorBox';
import PsaDateField from '@apps/commons/components/psa/Fields/DateField';
import ResourceGroup from '@apps/commons/components/psa/FilterInfo/ResourceGroupFilter';
import FormField from '@apps/commons/components/psa/FormField';
import msg from '@apps/commons/languages';
import DateUtil from '@apps/commons/utils/DateUtil';
import { generatePicklistOptions } from '@apps/commons/utils/psa/ExtendedItemUtil';

// --- Job Selection --- //
import JobRepository from '@apps/repositories/JobRepository';

import { Employee } from '@apps/domain/models/organization/Employee';
import { Job as JobMaster } from '@apps/domain/models/organization/Job';
import { PsaExtendedItem } from '@apps/domain/models/psa/PsaExtendedItem';
import { ResourceManager } from '@apps/domain/models/psa/ResourceManager';

import AutoSuggestTextField from '@apps/admin-pc/components/AutoSuggestTextField';
import ClearableField from '@apps/admin-pc/components/Common/ClearableField';

import { useJobSelectDialog } from '@apps/time-tracking/JobSelectDialog';

// --- Job Selection --- //
import './index.scss';

type Errors = {
  code: string;
  name: string;
  jobId: string;
  jobCode: string;
  startDate: string;
  endDate: string;
  pmBaseId: string;
  groupId: string;
};

type Touched = {
  code: boolean;
  name: boolean;
  jobId: boolean;
  jobCode: boolean;
  startDate: boolean;
  endDate: boolean;
  pmBaseId: boolean;
  groupId: boolean;
};

type Values = {
  code: string;
  name: string;
  jobId: string;
  jobCode: string;
  pmBaseId: string;
  groupId: string;
  startDate: string;
  endDate: string;
};

type FormikProps = {
  dirty: boolean;
  errors: FormikErrors<Errors>;
  handleSubmit: () => void;
  setFieldValue: (arg0: string, arg1: any) => void;
  touched: FormikTouched<Touched>;
  values: Values;
};

/* type dropdownOptions = {
  value: string;
  code?: string;
  name?: string;
  text: string;
}; */

type Props = {
  catchBusinessError: (type: string, message: string, solution: string) => void;
  companyId: string;
  employeeId: string;
  extendedItemConfigList: Array<PsaExtendedItem>;
  getManagerList: (suggestList: any) => void;
  getGroupMembers: (arg0: any) => void;
  hideDialog: () => void;
  isLoading: boolean;
  managerListOption: Array<Employee>;
  projectManagerId: string;
  resourceGroupList: Array<any>;
  resourceManagerList: Array<ResourceManager>;
  saveProjectManagerLocally: (projectManagerId: string) => void;
  searchEmployeeList: (value: string) => void;
  useExistingJobCode: boolean;
  groupDetail: any;
  selectedGroupId: string;
} & FormikProps;

const ROOT = 'ts-psa__new-project-form';

// @ts-ignore
export const useMountEffect = (fun: Function) => useEffect(fun, []);

// General Focus Hook
const UseFocus = () => {
  const ref = useRef(null);
  const setFocus = () => ref.current && ref.current.focus();
  const htmlElementAttributes = { ref };

  return [setFocus, htmlElementAttributes];
};

const autoSuggest = {
  value: 'id',
  label: 'name',
  buildLabel: (item) => `${item.name}${item.code ? ` - ${item.code}` : ''}`,
  suggestionKey: ['id', 'code', 'name', 'displayLabel'],
};

const processedManagerListOption = (employeeList: Array<Employee>) => {
  return employeeList.map((emp) => ({
    id: emp.id,
    code: emp.code,
    name: emp.name,
    displayName: `${emp.name} - ${emp.code}`,
  }));
};

const NewProjectForm = (props: Props) => {
  const { errors, touched, dirty, values, companyId, useExistingJobCode } =
    props;
  const [setInput1Focus, input1FocusAttributes] = UseFocus();
  const [pmSuggestList, setPmSuggestList] = useState(
    processedManagerListOption(props.managerListOption)
  );

  const [errorLabelObject, setErrorLabelObject] = useState({
    jobId: msg().Psa_Lbl_ProjectCode,
    pmBaseId: msg().Psa_Lbl_ProjectManager,
    name: msg().Psa_Lbl_ProjectTitle,
    startDate: msg().Psa_Lbl_StartDate,
    endDate: msg().Psa_Lbl_EndDate,
    code: msg().Psa_Lbl_ProjectCode,
  });

  // @ts-ignore
  useMountEffect(setInput1Focus);

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
            value={values[extendedItem.id] ? values[extendedItem.id] : ''}
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

  useEffect(() => {
    if (
      props.extendedItemConfigList &&
      props.extendedItemConfigList.length > 0
    ) {
      let errorLabelObjectWithEi = { ...errorLabelObject };
      const extendedItems = (
        <div className={`${ROOT}__form-field-container`}>
          {props.extendedItemConfigList &&
            props.extendedItemConfigList.map((eItem) => {
              errorLabelObjectWithEi = {
                ...errorLabelObjectWithEi,
                [eItem.id]: eItem.name,
              };
              return (
                eItem.enabled && (
                  <FormField
                    key={eItem.id}
                    title={eItem.name}
                    testId={`${ROOT}__eI`}
                    isRequired={eItem.required}
                    error={errors[eItem.id]}
                    isTouched={touched[eItem.id]}
                    tooltip={eItem.description}
                  >
                    {formFieldGenerator(eItem)}
                  </FormField>
                )
              );
            })}
        </div>
      );
      setErrorLabelObject(errorLabelObjectWithEi);
      setRenderedExtendedItem(extendedItems);
    }
  }, [props.extendedItemConfigList, values, touched, errors]);

  // --- START Job Selection --- //
  // project end date / job end date
  // const { startDate } = values;
  // const targetDate = startDate ? DateUtil.format(startDate, 'YYYY-MM-DD') : '';
  const [jobCodeTargetDate, setJobCodeTargetDate] = useState(
    DateUtil.getToday()
  );
  const selectedJobLabel = values.jobId ? values.jobCode : '';

  const [onClickShowDialog] = useJobSelectDialog({
    targetDate: jobCodeTargetDate,
    onOk: ({ id, code, name }: JobMaster) => {
      setTimeout(() => {
        props.setFieldValue('jobId', id);
        props.setFieldValue('jobCode', `${code} - ${name}`);
      }, 500);
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

  const isJobCodeDisabled = !values.startDate;
  // --- END Job Selection --- //

  const renderDynamicLayoutFirstRow = () => {
    if (useExistingJobCode) {
      return (
        <FormField
          title={msg().Psa_Lbl_ProjectManager}
          testId={`${ROOT}__project-manager`}
          isRequired
          tooltip={msg().Psa_Lbl_SearchProjectManagerByName}
          error={errors.pmBaseId}
          isTouched={touched.pmBaseId}
        >
          {/* @ts-ignore */}
          <AutoSuggestTextField
            debounceDelay={500}
            loadAsyncSuggestions={props.searchEmployeeList}
            processSuggestList={props.getManagerList}
            onSelectAsyncSuggestion={(eventObj) => {
              onProjectManagerChange(eventObj);
            }}
            onBlurAsyncSuggestion={(value) => {
              onProjectManagerBlur(value);
            }}
            value={values.pmBaseId}
            suggestList={pmSuggestList}
            suggestConfig={autoSuggest}
            placeholder={msg().Psa_Lbl_SearchProjectManager}
            companyId={props.companyId}
            psaGroupId={props.selectedGroupId}
            directSearch
          />
        </FormField>
      );
    } else {
      return (
        <FormField
          title={msg().Psa_Lbl_ProjectCode}
          testId={`${ROOT}__code`}
          isRequired
          error={errors.code}
          isTouched={touched.code}
        >
          <input
            className="ts-text-field slds-input"
            type="text"
            onChange={(e) => {
              props.setFieldValue('code', e.target.value);
            }}
            value={values.code}
          />
        </FormField>
      );
    }
  };

  const renderDynamicLayoutSecondRow = () => {
    if (useExistingJobCode) {
      return (
        <FormField
          title={msg().Psa_Lbl_ProjectCode}
          testId={`${ROOT}__code`}
          isRequired
          tooltip={msg().Psa_Lbl_JobCodeTooltip}
          error={errors.jobId}
          isTouched={touched.jobId}
        >
          <ClearableField
            onClickClearBtn={() => {
              props.setFieldValue('jobId', '');
              props.setFieldValue('jobCode', '');
            }}
            openDialog={onClickShowDialog}
            dialogProps={{
              singleSelection: true,
            }}
            disabled={isJobCodeDisabled}
            labelSelectBtn={msg().Admin_Lbl_SelectParentJob}
            label={selectedJobLabel}
            dialog={null}
            isDialogOpen={false}
          />
        </FormField>
      );
    } else {
      return (
        <FormField
          title={msg().Psa_Lbl_ProjectManager}
          testId={`${ROOT}__project-manager`}
          isRequired
          tooltip={msg().Psa_Lbl_SearchProjectManagerByName}
          error={errors.pmBaseId}
          isTouched={touched.pmBaseId}
        >
          {/* @ts-ignore */}
          <AutoSuggestTextField
            debounceDelay={500}
            loadAsyncSuggestions={props.searchEmployeeList}
            processSuggestList={props.getManagerList}
            onSelectAsyncSuggestion={(eventObj) => {
              onProjectManagerChange(eventObj);
            }}
            onBlurAsyncSuggestion={(value) => {
              onProjectManagerBlur(value);
            }}
            value={values.pmBaseId}
            suggestList={pmSuggestList}
            suggestConfig={autoSuggest}
            placeholder={msg().Psa_Lbl_SearchProjectManager}
            companyId={props.companyId}
            psaGroupId={props.selectedGroupId}
            directSearch
          />
        </FormField>
      );
    }
  };

  const renderErrorBox = () => {
    return (
      Object.keys(touched).length !== 0 &&
      Object.keys(errors).length !== 0 && (
        <ErrorBox errors={errors} errorLabelObject={errorLabelObject} />
      )
    );
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

  return (
    <DialogFrame
      title={msg().Psa_Lbl_NewProject}
      hide={() => {}}
      withoutCloseButton
      className={`${ROOT}__dialog-frame`}
      draggable
      footer={
        <DialogFrame.Footer>
          <Button
            type="default"
            onClick={props.hideDialog}
            data-testid={`${ROOT}__btn--cancel`}
          >
            {msg().Psa_Btn_Cancel}
          </Button>
          <Button
            disabled={!dirty}
            type="primary"
            onClick={props.handleSubmit}
            data-testid={`${ROOT}__btn--save`}
          >
            {msg().Com_Btn_Save}
          </Button>
        </DialogFrame.Footer>
      }
    >
      <div className={`${ROOT}__inner`}>
        <div className={`${ROOT} ${useExistingJobCode && 'js-is-reordered'}`}>
          <div className={`${ROOT}__error-box`}>{renderErrorBox()}</div>
          <div className={`${ROOT}__form-field-container`}>
            <FormField
              title={msg().Psa_Lbl_ProjectTitle}
              testId={`${ROOT}__title`}
              isRequired
              error={errors.name}
              isTouched={touched.name}
            >
              <input
                className="ts-text-field slds-input"
                type="text"
                onChange={(e) => {
                  !props.isLoading &&
                    props.setFieldValue('name', e.target.value);
                }}
                value={values.name}
                key={`${ROOT}_title`}
                {...input1FocusAttributes}
              />
            </FormField>
            {renderDynamicLayoutFirstRow()}
          </div>

          <div className={`${ROOT}__form-field-container`}>
            {renderDynamicLayoutSecondRow()}
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
                  groups.length && props.setFieldValue('groupId', groups[0].id);
                }}
                onRemove={() => {
                  props.setFieldValue('groupId', '');
                }}
                resourceGroups={null}
                selectLimit={1}
              />
            </FormField>
          </div>

          <div className={`${ROOT}__form-field-container`}>
            <FormField
              title={msg().Psa_Lbl_StartDate}
              testId={`${ROOT}__start-date`}
              isRequired
              className={`${ROOT}__date`}
              error={errors.startDate}
              isTouched={touched.startDate}
            >
              <PsaDateField
                placeholder={msg().Psa_Lbl_SelectStartDate}
                value={DateUtil.format(values.startDate, 'YYYY-MM-DD')}
                onChange={(startDate) => {
                  props.setFieldValue('startDate', startDate);
                }}
              />
            </FormField>

            <FormField
              title={msg().Psa_Lbl_EndDate}
              testId={`${ROOT}__end-date`}
              isRequired
              className={`${ROOT}__date`}
              error={errors.endDate}
              isTouched={touched.endDate}
            >
              <PsaDateField
                placeholder={msg().Psa_Lbl_SelectEndDate}
                value={DateUtil.format(values.endDate, 'YYYY-MM-DD')}
                onChange={(endDate) => {
                  props.setFieldValue('endDate', endDate);
                }}
              />
            </FormField>
          </div>

          {renderedExtendedItem}
        </div>
      </div>
    </DialogFrame>
  );
};

export default NewProjectForm;
