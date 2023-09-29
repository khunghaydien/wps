import React, { useState } from 'react';

import isEmpty from 'lodash/isEmpty';

import msg from '@commons/languages';

import Input from '@apps/mobile-app/components/atoms/Fields/Input';
import LabelWithHint from '@mobile/components/atoms/LabelWithHint';

import './MileageDistanceField.scss';

type Props = {
  readOnly?: boolean;
  mileageUnitLbl?: string;
  estimatedDistance?: string | number;
  distance?: string | number;
  error?: any;
  setFieldValue: (key: string, value: any, arg2: boolean) => void;
  onChange?: (distance: string | number) => void;
};
const ROOT = 'mobile-app-pages-expense-page-mileage-distance-field';
const MileageDistanceField = (props: Props) => {
  const {
    readOnly,
    distance,
    estimatedDistance,
    mileageUnitLbl,
    error,
    setFieldValue,
    onChange,
  } = props;
  const [isFocused, setIsFocused] = useState<boolean>(false);

  const estimatedDistanceLbl = estimatedDistance
    ? `${estimatedDistance} ${mileageUnitLbl}`
    : '-';

  const label = `${msg().Exp_Lbl_Distance} (${
    msg().Exp_Lbl_RouteEstimation
  }: ${estimatedDistanceLbl})`;

  const onChangeDistance = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    onChange && onChange(value);
  };

  const onBlur = () => {
    setIsFocused(false);
    setFieldValue('items[0].mileageDistance', +distance, true);
  };

  const value = distance
    ? isFocused
      ? distance
      : `${distance} ${mileageUnitLbl}`
    : '';
  return (
    <LabelWithHint className={ROOT} text={label} marked>
      <Input
        error={!isEmpty(error)}
        disabled={readOnly}
        readOnly={readOnly}
        type="text"
        value={String(value)}
        onBlur={onBlur}
        onFocus={() => setIsFocused(true)}
        onChange={onChangeDistance}
      />
    </LabelWithHint>
  );
};

export default MileageDistanceField;
