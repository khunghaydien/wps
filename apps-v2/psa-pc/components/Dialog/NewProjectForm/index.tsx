import React, { useEffect, useRef, useState } from 'react';

import Button from '@apps/commons/components/buttons/Button';
import DialogFrame from '@apps/commons/components/dialogs/DialogFrame';
import ErrorBox from '@apps/commons/components/psa/ErrorBox';
import msg from '@apps/commons/languages';

import { Employee } from '@apps/domain/models/organization/Employee';
import { ActivityList } from '@apps/domain/models/psa/Activity';
import { CustomHint } from '@apps/domain/models/psa/CustomHint';
import { PsaExtendedItem } from '@apps/domain/models/psa/PsaExtendedItem';
import { ResourceManager } from '@apps/domain/models/psa/ResourceManager';

import BaseInfo from '../../ProjectScreen/ProjectDetail/Form/BaseInfo';
import Financials from '../../ProjectScreen/ProjectDetail/Form/Financials';
// import NotificationSettings from '../../ProjectScreen/ProjectDetail/Form/NotificationSettings';
import Operation from '../../ProjectScreen/ProjectDetail/Form/Operation';
import PlanningOptions from '../../ProjectScreen/ProjectDetail/Form/PlanningOptions';

// --- Job Selection --- //
import './index.scss';

type FormikProps = {
  errors: any;
  touched: any;
  values: any;
  handleSubmit: () => void;
  setFieldValue: (arg0: string, arg1: any) => void;
};

export type Props = {
  activeDialog: Array<string>;
  activityList: ActivityList;
  deptSuggestList: Array<any>;
  dirty: any;
  calendarListOption: Array<any>;
  companyId: string;
  employeeId: string;
  extendedItemConfigList: Array<PsaExtendedItem>;
  getManagerList: (suggestList: any) => void;
  opportunityList: Array<any>;
  getGroupMembers: (arg0: any) => void;
  hideDialog: () => void;
  isLoading: boolean;
  managerListOption: Array<Employee>;
  clientList: Array<any>;
  searchClientList: (value: string) => void;
  catchBusinessError: (type: string, message: string, solution: string) => void;
  projectManagerId: string;
  resourceGroupList: Array<any>;
  resourceManagerList: Array<ResourceManager>;
  saveProjectManagerLocally: (projectManagerId: string) => void;
  searchEmployeeList: (value: string) => void;
  useExistingJobCode: boolean;
  groupDetail: any;
  customHint: CustomHint;
  createProject: boolean;
  currencyDecimal: number;
  enableProgressCheck: boolean;
  validateForm: any;
  permission?: string;
} & FormikProps;

const ROOT = 'ts-psa__new-project-form';
const BASE = 'ts-psa__project-form-create';

// @ts-ignore
export const useMountEffect = (fun: Function) => useEffect(fun, []);

const NewProjectForm = (props: Props) => {
  const baseInfoRef = useRef(null);
  const clientInfoRef = useRef(null);
  const financialRef = useRef(null);
  const refArray = [baseInfoRef, clientInfoRef, financialRef];
  const { dirty } = props;
  const [errorLabelObject, setErrorLabelObject] = useState({
    jobId: msg().Psa_Lbl_ProjectCode,
    pmBaseId: msg().Psa_Lbl_ProjectManager,
    name: msg().Psa_Lbl_ProjectTitle,
    startDate: msg().Psa_Lbl_StartDate,
    endDate: msg().Psa_Lbl_EndDate,
    code: msg().Psa_Lbl_ProjectCode,
    workTimePerDay: msg().Psa_Lbl_WorkTimePerDay,
    status: msg().Psa_Lbl_Status,
    groupId: msg().Psa_Lbl_ResourceGroup,
  });

  useEffect(() => {
    props.validateForm();
  }, [props.values.jobId, props.values.jobCode]);

  useEffect(() => {
    if (
      props.extendedItemConfigList &&
      props.extendedItemConfigList.length > 0
    ) {
      let errorLabelObjectWithEi = { ...errorLabelObject };
      props.extendedItemConfigList &&
        props.extendedItemConfigList.forEach((eItem) => {
          errorLabelObjectWithEi = {
            ...errorLabelObjectWithEi,
            [eItem.id]: eItem.name,
          };
        });
      setErrorLabelObject(errorLabelObjectWithEi);
    }
  }, [props.extendedItemConfigList, props.values, props.touched, props.errors]);
  const renderErrorBox = () => {
    return (
      Object.keys(props.touched).length !== 0 &&
      Object.keys(props.errors).length !== 0 && (
        <ErrorBox errors={props.errors} errorLabelObject={errorLabelObject} />
      )
    );
  };
  return (
    <DialogFrame
      createProject={true}
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
      <div className={BASE}>
        <div className={`${ROOT}__error-box`}>{renderErrorBox()}</div>
        <BaseInfo
          refArray={refArray}
          {...props}
          permission="write"
          key="baseInfo"
        />
        <Operation
          refArray={refArray}
          {...props}
          permission="write"
          key="operation"
        />
        <Financials
          refArray={refArray}
          {...props}
          permission="write"
          key="financials"
        />
        <PlanningOptions
          refArray={refArray}
          {...props}
          permission="write"
          key="planningOptions"
        />
        {/* <NotificationSettings
          refArray={refArray}
          {...props}
          key="notification"
        /> */}
      </div>
    </DialogFrame>
  );
};

export default NewProjectForm;
