import React, { useState } from 'react';

import classNames from 'classnames';
import isEmpty from 'lodash/isEmpty';
import isNil from 'lodash/isNil';

import LabelWithHint from '@apps/commons/components/fields/LabelWithHint';
import TextField from '@apps/commons/components/fields/TextField';
import { isValidDistance } from '@apps/commons/utils/exp/MileageUtils';
import TextUtil from '@apps/commons/utils/TextUtil';
import msg from '@commons/languages';

import { MileageUnit } from '@apps/domain/models/exp/Mileage';
import { MileageRouteInfo } from '@apps/domain/models/exp/Record';

import { ErrorLabelState } from './BaseCurrencyAmountModal';

import './MileageSummaryModalContent.scss';

type Props = {
  baseCurrencySymbol: string;
  errorLabel: ErrorLabelState;
  mileageDistance: string | number;
  mileageRateInfo?: {
    name: string;
    rate: string | number;
  };
  mileageRouteInfo: MileageRouteInfo;
  mileageUnit: MileageUnit;
  updateErrorLabel: (updateObj: { [key: string]: string }) => void;
  updateFieldInput: (updateObj: { [key: string]: string }) => void;
};

const ROOT = 'grid-amount-mileage-summary-modal-content';
const MileageSummaryModalContent = (props: Props): React.ReactElement => {
  const {
    baseCurrencySymbol,
    errorLabel,
    mileageDistance,
    mileageRouteInfo,
    mileageUnit,
    mileageRateInfo,
    updateErrorLabel,
    updateFieldInput,
  } = props;
  const { distanceError } = errorLabel;
  const { estimatedDistance } = mileageRouteInfo;
  const [isDistanceFocused, setIsDistanceFocused] = useState<boolean>(false);

  const handleDistanceChange = (_e, distance: string) => {
    updateFieldInput({ mileageDistanceInput: distance });
    const distanceError =
      !isValidDistance(distance) || isEmpty(distance) ? 'Com_Lbl_Required' : '';
    updateErrorLabel({ distanceError });
  };

  const onDistanceFieldBlur = () => {
    setIsDistanceFocused(false);
  };

  const getMileageRateLabel = (): string => {
    if (mileageRateInfo)
      return `${mileageRateInfo.name} - ${baseCurrencySymbol}${mileageRateInfo.rate}`;
    return TextUtil.template(
      msg().Com_Err_NotValidAt,
      msg().$Exp_Clbl_MileageRate,
      msg().Exp_Clbl_Date
    );
  };

  const ratePerUnitLabel =
    mileageUnit === MileageUnit.MILE
      ? msg().Exp_Lbl_RatePerMile
      : msg().Exp_Lbl_RatePerKm;
  const mileageUnitLbl =
    mileageUnit === MileageUnit.MILE
      ? msg().Exp_Sel_MileageUnitMile
      : msg().Exp_Sel_MileageUnitKm;
  const estimatedDistanceLbl = isNil(estimatedDistance)
    ? '-'
    : `${estimatedDistance} ${mileageUnitLbl}`;
  const mileageDistanceLbl = `${msg().Exp_Lbl_Distance} (${
    msg().Exp_Lbl_RouteEstimation
  }: ${estimatedDistanceLbl})`;
  const mileageDistanceValue = mileageDistance
    ? `${mileageDistance}${isDistanceFocused ? '' : ` ${mileageUnitLbl}`}`
    : '';
  return (
    <div className={ROOT}>
      <div className={`${ROOT}__field-row`}>
        <LabelWithHint text={ratePerUnitLabel} />
        <TextField value={getMileageRateLabel()} disabled />
      </div>
      <div className={`${ROOT}__field-row`}>
        <LabelWithHint text={mileageDistanceLbl} />
        <TextField
          value={mileageDistanceValue}
          onChange={handleDistanceChange}
          onFocus={() => setIsDistanceFocused(true)}
          onBlur={onDistanceFieldBlur}
          isRequired
          className={classNames({
            [`${ROOT}__input-error`]: distanceError,
          })}
        />
        {distanceError && (
          <div className={`${ROOT}-error-message`}>{msg()[distanceError]}</div>
        )}
      </div>
    </div>
  );
};

export default MileageSummaryModalContent;
