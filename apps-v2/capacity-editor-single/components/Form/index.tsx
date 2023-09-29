import React from 'react';

import { FormikErrors, FormikTouched } from 'formik';

import { ERROR_LABEL_OBJECT } from '../../schema/SingleCapacityForm';

import ErrorBox from '@apps/commons/components/psa/ErrorBox';

import { PsaWorkScheme } from '@apps/admin-pc/models/psaWorkScheme/PsaWorkScheme';
import { WorkArrangement } from '@apps/admin-pc/models/workArrangement/WorkArrangement';

import { ResourceAvailabilityUIState } from '../../modules/ui/capacityEditorResourceAvailabilities';

import ResourceAvailability from './ResourceAvailability';

import './index.scss';

export const ROOT = 'ts-psa__capacity-editor-single__form';

type FormikProps = {
  values: any;
  touched: FormikTouched<any>;
  dirty: boolean;
  errors: FormikErrors<any>;
  setFieldValue: (arg0: string, arg1: any) => void;
};

type Props = {
  workSchemeList: Array<PsaWorkScheme>;
  workArrangementList: Array<WorkArrangement>;
  availabilityItem: ResourceAvailabilityUIState;
} & FormikProps;

const SingleCapacityForm = (props: Props) => {
  const renderErrorBox = () => {
    return (
      Object.keys(props.touched).length !== 0 &&
      Object.keys(props.errors).length !== 0 && (
        <ErrorBox errors={props.errors} errorLabelObject={ERROR_LABEL_OBJECT} />
      )
    );
  };

  return (
    <div className={`${ROOT}`}>
      <div className={`${ROOT}__error-box`}>{renderErrorBox()}</div>
      <ResourceAvailability
        {...props}
        key="resourceAvailability"
      ></ResourceAvailability>
    </div>
  );
};

export default SingleCapacityForm;
