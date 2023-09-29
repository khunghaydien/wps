import React from 'react';

import classNames from 'classnames';

import LabelWithHint from '@commons/components/fields/LabelWithHint';
import TextField from '@commons/components/fields/TextField';
import withLoadingHOC from '@commons/components/withLoading';

import { mileageRateSelect } from '@apps/domain/modules/exp/mileageRate';

type Props = {
  label: string;
  value: string;
};

const ROOT = 'ts-expenses__form-record-item__mileage-form';
const MileageRateField = (props: Props) => {
  return (
    <div className="ts-text-field-container">
      <div
        className={classNames(`${ROOT}__destination-details-container-field`)}
      >
        <LabelWithHint text={props.label} />
        <TextField value={props.value} disabled />
      </div>
    </div>
  );
};

MileageRateField.displayName = mileageRateSelect;

export default withLoadingHOC(MileageRateField);
