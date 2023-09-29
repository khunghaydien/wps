import React, { useEffect, useRef, useState } from 'react';

import { FormikErrors, FormikTouched } from 'formik';
import debounce from 'lodash/debounce';

import Button from '@apps/commons/components/buttons/Button';
import DialogFrame from '@apps/commons/components/dialogs/DialogFrame';
import Combobox from '@apps/commons/components/fields/Combobox';
import DropDown from '@apps/commons/components/fields/Dropdown';
import SelectField from '@apps/commons/components/fields/SelectField';
import TextAreaField from '@apps/commons/components/fields/TextAreaField';
import ErrorBox from '@apps/commons/components/psa/ErrorBox';
import PsaDateField from '@apps/commons/components/psa/Fields/DateField';
import ResourceGroup from '@apps/commons/components/psa/FilterInfo/ResourceGroupFilter';
import FormField from '@apps/commons/components/psa/FormField';
import SkillSelectionField from '@apps/commons/components/psa/SkillSelectionField';
import msg from '@apps/commons/languages';
import DateUtil from '@apps/commons/utils/DateUtil';
import { generatePicklistOptions } from '@apps/commons/utils/psa/ExtendedItemUtil';
import {
  floorToOneDecimal,
  sortByCode,
} from '@apps/commons/utils/psa/resourcePlannerUtil';
import TextUtil from '@apps/commons/utils/TextUtil';

import { Activity } from '@apps/domain/models/psa/Activity';
import CurrentRoute from '@apps/domain/models/psa/CurrentRoute';
import { Project } from '@apps/domain/models/psa/Project';
import { PsaExtendedItem } from '@apps/domain/models/psa/PsaExtendedItem';
import { Role } from '@apps/domain/models/psa/Role';

import { useMountEffect } from '@psa/components/Dialog/NewProjectForm';

import './index.scss';

type Errors = {
  assignmentDueDate: string;
  comments: string;
  endDate: string;
  groupId: string;
  jobGrades: string;
  remarks: string;
  requiredTime: string;
  roleTitle: string;
  startDate: string;
};

type Touched = {
  assignmentDueDate: string;
  comments: string;
  endDate: string;
  groupId: string;
  jobGrades: string;
  remarks: string;
  requiredTime: string;
  roleTitle: string;
  startDate: string;
};

type FormikProps = {
  errors: FormikErrors<Errors>;
  getWorkingDays: (arg0: string, arg1: string) => Promise<number>;
  handleSubmit: () => void;
  setFieldTouched: (arg0: string, arg1: any) => void;
  setFieldValue: (arg0: string, arg1: any) => void;
  touched: FormikTouched<Touched>;
  validateForm: () => void;
  values: any;
};

/* type dropdownOptions = {
  value: string;
  code?: string;
  name?: string;
  text: string;
}; */

type Props = {
  currencyCode: string;
  currencyDecimalPlaces: number;
  currentRoute: string;
  extendedItemConfigList: Array<PsaExtendedItem>;
  hideDialog: () => void;
  isLoading: boolean;
  isRoleDetail: boolean;
  jobGradeList: Array<any>;
  selectedActivity: Activity;
  selectedProject: Project;
  selectedRole: Role;
  skillCategories: Array<any>;
  getGroupMembers: (arg0: any) => void;
  groupDetail: any;
  resourceGroupList: Array<any>;
  resourceGroups: Array<any>;
} & FormikProps;

const ROOT = 'ts-psa__new-role-form';

// General Focus Hook
const UseFocus = () => {
  const ref = useRef(null);
  const setFocus = () => ref.current && ref.current.focus();
  const htmlElementAttributes = { ref };

  return [setFocus, htmlElementAttributes];
};

enum EffortOption {
  HOURS,
  DAYS,
  PERCENTAGE,
}

const NewRoleForm = (props: Props) => {
  const { errors, touched, values } = props;

  const [errorLabelObject, setErrorLabelObject] = useState({
    roleTitle: msg().Psa_Lbl_ProjectRoleTitle,
    startDate: msg().Psa_Lbl_StartDate,
    endDate: msg().Psa_Lbl_EndDate,
    assignmentDueDate: msg().Psa_Lbl_AssignmentDueDate,
    requiredTime: msg().Psa_Lbl_RequiredEffort,
    groupId: msg().Psa_Lbl_ResourceGroup,
  });

  const [setInput1Focus, input1FocusAttributes] = UseFocus();
  const [jobGradeOptions, setJobGradeOptions] = useState(props.jobGradeList);
  // @ts-ignore
  const [requiredEffort, setRequiredEffort] = useState(
    Number(values.requiredTime) / 60
  );
  const [workingDays, setWorkingDays] = useState('');
  const [requiredEffortUnit, setRequiredEffortUnit] = useState(
    EffortOption.HOURS
  );
  const [textAreaLength, setTextAreaLength] = useState(0);
  const [commentAreaLength, setCommentAreaLength] = useState(0);
  const [showComments, setShowComments] = useState(false);
  const isProjectTab = props.currentRoute === CurrentRoute.Projects;
  const [isComboBoxDisabled, setIsComboBoxDisabled] = useState(false);
  const [comboboxClass, setComboboxClass] = useState('');
  const [isSkillsDialogOpen, setSkillsDialogOpen] = useState(false);

  const [selectedResourceGroup, setSelectedResourceGroup] = useState(null);

  const usePrevious = (value: any) => {
    const ref = useRef(null);
    useEffect(() => {
      ref.current = value;
    });
    return ref.current;
  };
  const prevUnit = usePrevious(requiredEffortUnit);
  // @ts-ignore
  useMountEffect(setInput1Focus);

  const effortOptions = [
    {
      label: msg().Psa_Lbl_Hours,
      value: EffortOption.HOURS,
    },
    {
      label: msg().Psa_Lbl_Days,
      value: EffortOption.DAYS,
    },
    {
      label: '%',
      value: EffortOption.PERCENTAGE,
    },
  ];

  const debounceSave = (fieldName, fieldValue) => {
    const debounceFunc = debounce(
      () => props.setFieldValue(fieldName, fieldValue),
      500
    );
    debounceFunc();
  };

  useEffect(() => {
    setSelectedResourceGroup(
      props.resourceGroupList.filter((e) => e.id === props.values.groupId)
    );
  }, [props.resourceGroupList]);

  useEffect(() => {
    const updatedJobGradeOptions = props.jobGradeList.map((jobGrade) => {
      if (jobGrade.costRate > 0) {
        jobGrade.label = `${jobGrade.label} / ${props.currencyCode} ${jobGrade.costRate}`;
      }
      return jobGrade;
    });

    setJobGradeOptions(updatedJobGradeOptions.sort(sortByCode));

    if (props.isRoleDetail) {
      const jobGradeIdList = props.selectedRole.jobGrades.map(
        (jobGrade) => jobGrade.id
      );
      props.setFieldValue('jobGrades', jobGradeIdList);
      const prevRequiredTime = Number(props.selectedRole.requiredTime) / 60;
      setRequiredEffort(Number(prevRequiredTime.toFixed(1)));
      props.setFieldValue('requiredTime', props.selectedRole.requiredTime);
    }

    if (values.remarks && values.remarks.length > 0) {
      setTextAreaLength(values.remarks.length);
    }

    props
      .getWorkingDays(props.values.startDate, props.values.endDate)
      .then((res) => {
        props.setFieldValue('workingDays', res);
        let workingHours = res * props.selectedProject.workTimePerDay;
        if (isNaN(workingHours)) {
          workingHours = 0;
        }
        props.setFieldValue('maxWorkingTime', workingHours);
        setWorkingDays(
          TextUtil.template(
            msg().Psa_Lbl_WorkingDaysLabel,
            res || '-',
            workingHours === 0 ? '-' : workingHours / 60
          )
        );
        if (!props.isRoleDetail) {
          props.setFieldValue('requiredTimePercentage', 100);
          props.setFieldValue('requiredTime', workingHours);
          setRequiredEffort(workingHours / 60);
        } else {
          // in role detail, need to keep original value, but percentage need to recalculate
          const newPercentage = Math.ceil(
            (props.values.requiredTime / workingHours) * 100
          );
          if (requiredEffortUnit === EffortOption.PERCENTAGE) {
            setRequiredEffort(newPercentage);
          }
          props.setFieldValue('requiredTimePercentage', newPercentage);
        }
      });
  }, []);

  useEffect(() => {
    if (prevUnit !== null && prevUnit !== requiredEffortUnit) {
      // set to 0 when change unit
      setRequiredEffort(0);
      props.setFieldValue('requiredTime', 0);
    }
  }, [requiredEffortUnit]);

  const onChangeDate = (startDate, endDate) => {
    if (
      startDate !== props.values.startDate ||
      endDate !== props.values.endDate
    ) {
      props.setFieldValue('startDate', startDate);
      props.setFieldValue('endDate', endDate);
      props.getWorkingDays(startDate, endDate).then((res) => {
        props.setFieldValue('workingDays', res);
        let workingHours = res * props.selectedProject.workTimePerDay;
        if (isNaN(workingHours)) {
          workingHours = 0;
        }
        props.setFieldValue('maxWorkingTime', workingHours);
        props.setFieldValue('requiredTime', workingHours);
        props.setFieldValue('requiredTimePercentage', 100);
        setWorkingDays(
          TextUtil.template(
            msg().Psa_Lbl_WorkingDaysLabel,
            res || '-',
            workingHours === 0 ? '-' : workingHours / 60
          )
        );
        if (requiredEffortUnit === 1) {
          setRequiredEffort(res);
        } else {
          setRequiredEffort(workingHours / 60);
        }
      });
    }
  };

  const hasJobGradeOptions = jobGradeOptions && jobGradeOptions.length > 0;
  const isHiddenClass = hasJobGradeOptions ? '' : 'is-hidden';

  const onJobGradeSelect = (jobGradeValues: any) => {
    const jobGradeIdList = jobGradeValues
      ? jobGradeValues.map((jobGrade) => jobGrade.id)
      : [];
    if (jobGradeIdList.length >= 1) {
      setIsComboBoxDisabled(true);
      setComboboxClass(`${ROOT}__combobox-wrapper`);
    } else {
      setIsComboBoxDisabled(false);
      setComboboxClass('');
    }
    props.setFieldValue('jobGrades', jobGradeIdList);
  };

  const onSkillSelect = (skillValues: any) => {
    const skillsetIdList = skillValues
      ? skillValues.map((skill) => ({
          ...skill,
          min: skill.rating ? skill.rating[0] : null,
          max: skill.rating ? skill.rating[1] : null,
        }))
      : [];
    props.setFieldValue('skills', skillsetIdList);
  };

  const onChangeTextArea = (e: any) => {
    const text = e.target.value;
    props.setFieldValue('remarks', text.substring(0, 1000));
    setTextAreaLength(text.length > 1000 ? 1000 : text.length);
  };

  const onChangeCommentArea = (e: any) => {
    const text = e.target.value;
    props.setFieldValue('comments', text.substring(0, 1000));
    setCommentAreaLength(text.length > 1000 ? 1000 : text.length);
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
            value={values[extendedItem.id] || ''}
            key={extendedItem.id}
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

  const returnErrorBox = () => {
    return (
      Object.keys(touched).length !== 0 &&
      Object.keys(errors).length !== 0 && (
        <div className={`${ROOT}__error-box`}>
          <ErrorBox errors={errors} errorLabelObject={errorLabelObject} />
        </div>
      )
    );
  };

  const handleSubmit = () => {
    if (isProjectTab || showComments) {
      props.handleSubmit();
    } else {
      if (Object.keys(errors).length === 0) {
        setShowComments(true);
      } else {
        Object.keys(errors).forEach((err) => {
          props.setFieldTouched(err, true);
        });
        returnErrorBox();
      }
    }
  };

  const handleCancel = () => {
    if (isProjectTab) {
      props.hideDialog();
    } else {
      if (showComments) {
        setShowComments(false);
      } else {
        props.hideDialog();
      }
    }
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

  const onChangeRequiredEffort = (e) => {
    let val = e.target.value;
    let requiredTime, requiredTimePercentage;
    const { maxWorkingTime } = props.values;
    if (val === '') {
      setRequiredEffort(val);
      debounceSave('requiredTime', 0);
    } else if (
      requiredEffortUnit === EffortOption.HOURS &&
      val.match(/^\d{1,}(\.\d{0,1})?$/)
    ) {
      // Allow to type partial decimal number such as 1.
      // Process only when whole number is detected
      if (val.match(/^\d*(\.\d+)?$/)) {
        setRequiredEffort(Number(val));
        requiredTime = Number(val) * 60;
        requiredTimePercentage = (requiredTime / maxWorkingTime) * 100;
      } else {
        setRequiredEffort(val);
      }
    } else if (
      requiredEffortUnit === EffortOption.PERCENTAGE &&
      val.match(/^$|^[1-9][0-9]?$|^100$/)
    ) {
      const percentage = Number(val);
      val = Math.ceil(isNaN(percentage) ? 0 : percentage);
      setRequiredEffort(Number(val));
      const maxHour = maxWorkingTime / 60;
      requiredTime = floorToOneDecimal((maxHour * Number(val)) / 100) * 60;
      requiredTimePercentage = Number(val);
    } else if (
      requiredEffortUnit === EffortOption.DAYS &&
      val.match(/^\d*?$/)
    ) {
      setRequiredEffort(Number(val));
      requiredTime = Number(val) * props.selectedProject.workTimePerDay;
      requiredTimePercentage = (requiredTime / maxWorkingTime) * 100;
    }

    // requiredTime round to next multiple of 60, percentage round to next integer (ceiling)
    if (!isNaN(requiredTime)) {
      debounceSave('requiredTime', +requiredTime.toFixed(1));
      props.setFieldValue(
        'requiredTimePercentage',
        Math.ceil(requiredTimePercentage)
      );
    }
  };
  return (
    <DialogFrame
      title={
        props.isRoleDetail ? msg().Psa_Lbl_EditRole : msg().Psa_Lbl_NewRole
      }
      hide={() => {}}
      withoutCloseButton
      className={`${ROOT}__dialog-frame`}
      draggable={!isSkillsDialogOpen}
      footer={
        <DialogFrame.Footer>
          <Button
            type="default"
            onClick={handleCancel}
            data-testid={`${ROOT}__btn--cancel`}
          >
            {msg().Psa_Btn_Cancel}
          </Button>
          <Button
            type="primary"
            onClick={handleSubmit}
            data-testid={`${ROOT}__btn--save`}
          >
            {showComments ? msg().Psa_Lbl_RoleCommentBtn : msg().Com_Btn_Save}
          </Button>
        </DialogFrame.Footer>
      }
    >
      <div className={`${ROOT}__inner`}>
        {!showComments && (
          <div className={`${ROOT}__sub-header`}>
            <div
              className={`${ROOT}__sub-header__activity-title`}
              data-testid={`${ROOT}__activity-title`}
            >
              <span className={`${ROOT}__sub-header-title`}>
                {msg().Psa_Lbl_ActivityTitle}
              </span>
              :
              <span className={`${ROOT}__sub-header-title-body`}>
                {props.selectedActivity.title}
              </span>
            </div>
            {props.selectedActivity.plannedStartDate &&
              props.selectedActivity.plannedEndDate && (
                <div
                  className={`${ROOT}__sub-header__activity-duration`}
                  data-testid={`${ROOT}__activity-duration`}
                >
                  <span className={`${ROOT}__sub-header-title`}>
                    {msg().Psa_Lbl_Duration}
                  </span>
                  :&nbsp;
                  {`${DateUtil.format(props.selectedActivity.plannedStartDate)}
                      -
                ${DateUtil.format(props.selectedActivity.plannedEndDate)}`}
                </div>
              )}
          </div>
        )}
        <div className={`${ROOT}`}>
          {returnErrorBox()}
          {!showComments && (
            <React.Fragment key={`${ROOT}_common_container`}>
              <div className={`${ROOT}__form-field-container`}>
                <FormField
                  title={msg().Psa_Lbl_ProjectRoleTitle}
                  testId={`${ROOT}__role-title`}
                  isRequired
                  error={errors.roleTitle}
                  isTouched={touched.roleTitle}
                >
                  <input
                    className="ts-text-field slds-input"
                    type="text"
                    onChange={(e) => {
                      !props.isLoading &&
                        props.setFieldValue('roleTitle', e.target.value);
                    }}
                    value={values.roleTitle}
                    {...input1FocusAttributes}
                    key={`${ROOT}_input_Text_element`}
                  />
                </FormField>

                <FormField
                  className={`${ROOT}__job-grade-column ${isHiddenClass}`}
                  title={msg().Admin_Lbl_JobGrade}
                  isTouched={touched.jobGrades}
                  tooltip={msg().Psa_Lbl_JobGradeTooltip}
                  tooltipPosition="right"
                >
                  <div className={comboboxClass}>
                    <Combobox
                      data-testid="combobox-base"
                      disabled={isComboBoxDisabled}
                      options={jobGradeOptions}
                      onSelect={(value) => {
                        onJobGradeSelect(value);
                      }}
                      selection={jobGradeOptions.filter((jgOption) =>
                        values.jobGrades.includes(jgOption.id)
                      )}
                    />
                  </div>
                </FormField>
              </div>
              <div className={`${ROOT}__form-field-container`}>
                <FormField
                  title={msg().Psa_Lbl_StartDate}
                  testId={`${ROOT}__start-date`}
                  error={errors.startDate}
                  isTouched={touched.startDate}
                  isRequired
                >
                  <PsaDateField
                    className="ts-text-field slds-input"
                    placeholder={msg().Psa_Lbl_SelectStartDate}
                    value={DateUtil.format(values.startDate, 'YYYY-MM-DD')}
                    onChange={(startDate) => {
                      onChangeDate(startDate, props.values.endDate);
                    }}
                  />
                </FormField>
                <FormField
                  title={msg().Psa_Lbl_EndDate}
                  testId={`${ROOT}__end-date`}
                  error={errors.endDate}
                  isTouched={touched.endDate}
                  isRequired
                >
                  <PsaDateField
                    className="ts-text-field slds-input"
                    placeholder={msg().Psa_Lbl_SelectEndDate}
                    value={DateUtil.format(values.endDate, 'YYYY-MM-DD')}
                    onChange={(endDate) => {
                      onChangeDate(props.values.startDate, endDate);
                    }}
                  />
                </FormField>
              </div>
              <div className={`${ROOT}__form-field-container`}>
                <FormField
                  title={msg().Psa_Lbl_MaximumDaysPerHours}
                  testId={`${ROOT}__max-days`}
                >
                  <input
                    className="ts-text-field slds-input"
                    type="text"
                    value={workingDays}
                    disabled
                  />
                </FormField>

                <FormField
                  testId={`${ROOT}__effort`}
                  title={msg().Psa_Lbl_RequiredEffort}
                  error={errors.requiredTime}
                  isRequired
                  isTouched={touched.requiredTime}
                >
                  <div className={`${ROOT}__effort-input-container`}>
                    <input
                      className="ts-text-field slds-input"
                      type="text"
                      onChange={(e) => onChangeRequiredEffort(e)}
                      value={requiredEffort}
                    />
                    <DropDown
                      options={effortOptions}
                      className={`${ROOT}__effort-dropdown`}
                      value={requiredEffortUnit}
                      onSelect={(item) => setRequiredEffortUnit(item.value)}
                      menuStyle={{ 'max-width': '100px' }}
                    />
                  </div>
                  {requiredEffortUnit === EffortOption.PERCENTAGE && (
                    <div
                      className={`${ROOT}__form-field-container__actual-effort`}
                    >
                      {TextUtil.template(
                        msg().Psa_Lbl_ActualRequiredEffort,
                        props.values.requiredTime / 60
                      )}
                    </div>
                  )}
                </FormField>
              </div>
              <div className={`${ROOT}__form-field-container`}>
                <FormField
                  title={msg().Psa_Lbl_AssignmentDueDate}
                  testId={`${ROOT}__assignment_due_date`}
                  error={errors.assignmentDueDate}
                  isTouched={touched.assignmentDueDate}
                  isRequired
                >
                  <PsaDateField
                    className="ts-text-field slds-input"
                    placeholder={msg().Psa_Lbl_SelectAssignmentDueDate}
                    value={DateUtil.format(
                      values.assignmentDueDate,
                      'YYYY-MM-DD'
                    )}
                    onChange={(assignmentDueDate) => {
                      props.setFieldValue(
                        'assignmentDueDate',
                        assignmentDueDate
                      );
                    }}
                  />
                </FormField>
              </div>
              <div className={`${ROOT}__form-field-container`}>
                <div className={`${ROOT}__skill-selection`}>
                  <SkillSelectionField
                    initialSkillsets={
                      values.skills &&
                      values.skills.filter((skill) => !skill.deleted)
                    }
                    isDialogOpen={isSkillsDialogOpen}
                    isResetted={false}
                    name={msg().Psa_Lbl_AddSkill}
                    onSelect={onSkillSelect}
                    selectLimit={5}
                    setDialogOpen={setSkillsDialogOpen}
                    skillCategories={props.skillCategories}
                    testid={`${ROOT}__skillset`}
                    title={msg().Psa_Lbl_SelectSkill}
                  />
                </div>
              </div>
              <div className={`${ROOT}__form-field-container`}>
                <FormField
                  title={msg().Psa_Lbl_ResourceGroup}
                  testId={`${ROOT}__rg`}
                  isRequired
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
                          props.resourceGroupList.filter(
                            (e) => e.id === groups[0].id
                          )
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
              </div>
              <div className={`${ROOT}__form-field-container`}>
                <FormField
                  className={`${ROOT}__remark`}
                  title={msg().Psa_Lbl_ProjectDescription}
                  testId={`${ROOT}__remarks`}
                  error={errors.remarks}
                  isTouched={touched.remarks}
                >
                  <TextAreaField
                    placeholder={msg().Psa_Lbl_ActivityRoleRemark}
                    onChange={onChangeTextArea}
                    value={values.remarks}
                    resize="none"
                  />
                  <span className={`${ROOT}__textarea-countdown`}>
                    {`${textAreaLength}/1000`}
                  </span>
                </FormField>
              </div>
            </React.Fragment>
          )}
          {!showComments && renderedExtendedItem}
          {showComments && (
            <div className={`${ROOT}__form-field-container`}>
              <FormField
                className={`${ROOT}__comments`}
                title={''}
                testId={`${ROOT}__comment`}
                error={errors.comments}
                isTouched={touched.comments}
              >
                <TextAreaField
                  placeholder={msg().Psa_Lbl_RoleCommentPlaceholder}
                  onChange={onChangeCommentArea}
                  value={values.comments}
                  resize="none"
                />
                <span className={`${ROOT}__commentarea-countdown`}>
                  {`${commentAreaLength}/1000`}
                </span>
              </FormField>
            </div>
          )}
        </div>
      </div>
    </DialogFrame>
  );
};

export default NewRoleForm;
