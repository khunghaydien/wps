import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { AnyAction } from 'redux';
import { ThunkDispatch } from 'redux-thunk';

import { Formik } from 'formik';
import cloneDeep from 'lodash/cloneDeep';

import SingleCapacityFormSchema from '../schema/SingleCapacityForm';

import { FORM_FIELD } from '../constants/formField';

import Button from '@apps/commons/components/buttons/Button';
import PSACommonHeader from '@apps/commons/components/psa/Header';
import GlobalContainer from '@apps/commons/containers/GlobalContainer';
import ToastContainer from '@apps/commons/containers/ToastContainer';
import msg from '@apps/commons/languages';

import { PsaWorkScheme } from '@apps/admin-pc/models/psaWorkScheme/PsaWorkScheme';
import { WorkArrangement } from '@apps/admin-pc/models/workArrangement/WorkArrangement';

import { ResourceAvailabilityUIState } from '../modules/ui/capacityEditorResourceAvailabilities';

import SingleCapacityForm from './Form';

import './index.scss';

export const ROOT = 'ts-psa__capacity-editor-single__app';

type Props = {
  workSchemeList: Array<PsaWorkScheme>;
  workArrangementList: Array<WorkArrangement>;
  availabilityItem: ResourceAvailabilityUIState;
  availabilityActions: any;
};

const App = (props: Props) => {
  const dispatch = useDispatch() as ThunkDispatch<unknown, void, AnyAction>;
  const {
    workSchemeList,
    workArrangementList,
    availabilityItem,
    availabilityActions,
  } = props;
  const [initialValues, setInitialValues] = useState({});

  const generateInitialValues = () => {
    setInitialValues({
      [FORM_FIELD.STATUS]: availabilityItem.status || null,
      [FORM_FIELD.WORK_SCHEME_CODE]: availabilityItem.workSchemeCode || null,
      [FORM_FIELD.CAPACITY]: availabilityItem.capacity || null,
      [FORM_FIELD.WORK_ARRANGEMENT_CODE_1]:
        availabilityItem.workArrangementCode1 || null,
      [FORM_FIELD.WORK_ARRANGEMENT_TIME_1]:
        availabilityItem.workArrangementTime1 || null,
      [FORM_FIELD.WORK_ARRANGEMENT_CODE_2]:
        availabilityItem.workArrangementCode2 || null,
      [FORM_FIELD.WORK_ARRANGEMENT_TIME_2]:
        availabilityItem.workArrangementTime2 || null,
      [FORM_FIELD.WORK_ARRANGEMENT_CODE_3]:
        availabilityItem.workArrangementCode3 || null,
      [FORM_FIELD.WORK_ARRANGEMENT_TIME_3]:
        availabilityItem.workArrangementTime3 || null,
      [FORM_FIELD.NON_PROJECT_BOOKING_TIME_PM]:
        availabilityItem.nonProjectBookingTimeRM || null,
      [FORM_FIELD.RM_COMMENT]: availabilityItem.RMComment || null,
    });
    return initialValues;
  };

  useEffect(() => {
    generateInitialValues();
  }, []);

  const handleSubmit = (values) => {
    const formItems: any = cloneDeep(values);
    const param = {
      id: availabilityItem.id,
      date: availabilityItem.date,
      status: formItems.status,
      workSchemeId:
        workSchemeList.find((obj) => obj.code === formItems.workSchemeCode)
          ?.id || null,
      capacity: formItems.capacity || null,
      workArrangementId1:
        workArrangementList.find(
          (obj) => obj.code === formItems.workArrangementCode1
        )?.id || null,
      workArrangementTime1: formItems.workArrangementTime1 || null,
      workArrangementId2:
        workArrangementList.find(
          (obj) => obj.code === formItems.workArrangementCode2
        )?.id || null,
      workArrangementTime2: formItems.workArrangementTime2 || null,
      workArrangementId3:
        workArrangementList.find(
          (obj) => obj.code === formItems.workArrangementCode3
        )?.id || null,
      workArrangementTime3: formItems.workArrangementTime3 || null,
      nonProjectBookingTime: availabilityItem.nonProjectBookingTime || null,
      nonProjectBookingTimeRM: formItems.nonProjectBookingTimeRM || null,
      unavailableTime: availabilityItem.unavailableTime || null,
      memberComment: availabilityItem.memberComment || null,
      RMComment: formItems.RMComment || null,
    };
    dispatch(availabilityActions.save([param]));
    setInitialValues({
      [FORM_FIELD.STATUS]: values.status || null,
      [FORM_FIELD.WORK_SCHEME_CODE]: values.workSchemeCode || null,
      [FORM_FIELD.CAPACITY]: values.capacity || null,
      [FORM_FIELD.WORK_ARRANGEMENT_CODE_1]: values.workArrangementCode1 || null,
      [FORM_FIELD.WORK_ARRANGEMENT_TIME_1]: values.workArrangementTime1 || null,
      [FORM_FIELD.WORK_ARRANGEMENT_CODE_2]: values.workArrangementCode2 || null,
      [FORM_FIELD.WORK_ARRANGEMENT_TIME_2]: values.workArrangementTime2 || null,
      [FORM_FIELD.WORK_ARRANGEMENT_CODE_3]: values.workArrangementCode3 || null,
      [FORM_FIELD.WORK_ARRANGEMENT_TIME_3]: values.workArrangementTime3 || null,
      [FORM_FIELD.NON_PROJECT_BOOKING_TIME_PM]:
        values.nonProjectBookingTimeRM || null,
      [FORM_FIELD.RM_COMMENT]: values.RMComment || null,
    });
  };

  const renderComponent = () => {
    const component = (
      <Formik
        enableReinitialize
        initialValues={initialValues}
        validationSchema={SingleCapacityFormSchema}
        onSubmit={handleSubmit}
      >
        {(props) => {
          return (
            <div className={`${ROOT}`}>
              <div className={`${ROOT}__header`}>
                <PSACommonHeader
                  title={msg().Psa_Lbl_CapacityEditorSingle}
                  isOmitFields={true}
                >
                  <Button
                    data-test-id={`${ROOT}__reset-btn`}
                    className={`${ROOT}__reset-btn`}
                    disabled={!props.dirty}
                    onClick={() => {
                      Object.entries(initialValues).forEach(
                        ([propName, propValue]) => {
                          props.setFieldValue(propName, propValue);
                        }
                      );
                      props.resetForm();
                    }}
                  >
                    {msg().Psa_Btn_Reset}
                  </Button>
                  <Button
                    data-test-id={`${ROOT}__save-btn`}
                    className={`${ROOT}__save-btn`}
                    type="primary"
                    disabled={!props.dirty}
                    onClick={props.handleSubmit}
                  >
                    {msg().Com_Btn_Save}
                  </Button>
                </PSACommonHeader>
              </div>
              <div className={`${ROOT}__form`}>
                <SingleCapacityForm
                  workSchemeList={workSchemeList}
                  workArrangementList={workArrangementList}
                  availabilityItem={availabilityItem}
                  values={props.values}
                  dirty={props.dirty}
                  errors={props.errors}
                  touched={props.touched}
                  setFieldValue={props.setFieldValue}
                ></SingleCapacityForm>
              </div>
            </div>
          );
        }}
      </Formik>
    );
    return component;
  };

  return (
    <GlobalContainer>
      <ToastContainer />
      {renderComponent()}
    </GlobalContainer>
  );
};

export default App;
