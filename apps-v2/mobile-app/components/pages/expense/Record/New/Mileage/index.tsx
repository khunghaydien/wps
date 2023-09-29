import React, { useEffect, useMemo, useState } from 'react';
import { useDispatch } from 'react-redux';
import { bindActionCreators } from 'redux';

import cloneDeep from 'lodash/cloneDeep';
import get from 'lodash/get';
import isEmpty from 'lodash/isEmpty';

import { getRecentDestinations } from '@apps/commons/action-dispatchers/Mileage';
import {
  getDistanceInUnit,
  isValidDistance,
} from '@apps/commons/utils/exp/MileageUtils';
import TextUtil from '@apps/commons/utils/TextUtil';
import msg from '@commons/languages';
import DestinationInput from '@mobile/components/molecules/commons/Fields/DestinationInput';
import SelectField from '@mobile/components/molecules/commons/Fields/SelectField';

import {
  calcAmountFromRate,
  ROUNDING_TYPE,
  RoundingType,
} from '@apps/domain/models/exp/foreign-currency/Currency';
import {
  initialDestinations,
  MAX_DESTINATIONS,
  MileageDestinationInfo,
  MileageRate,
  MileageUnit,
  MIN_DESTINATIONS,
} from '@apps/domain/models/exp/Mileage';
import { Record as ExpRecord } from '@apps/domain/models/exp/Record';
import { calculateTax } from '@apps/domain/models/exp/TaxType';

import Button from '@mobile/components/atoms/Button';
import Icon from '@mobile/components/atoms/Icon';
import IconButton from '@mobile/components/atoms/IconButton';
import Label from '@mobile/components/atoms/Label';

import MileageDistanceField from './MileageDistanceField';

import './index.scss';

type Props = {
  rate: number;
  readOnly?: boolean;
  values: ExpRecord;
  errors: ExpRecord;
  mileageRates?: Array<MileageRate>;
  mileageUnit?: MileageUnit;
  isGeneratedPreview?: boolean;
  currencySymbol: string;
  baseCurrencyDecimal: number;
  taxRoundingSetting: RoundingType;
  employeeId: string;
  companyId: string;
  onClickMileageApply?: () => void;
  onClickMileageReset?: () => void;
  searchMileageRoute?: (destinations: Array<MileageDestinationInfo>) => any;
  openMileageMap: () => void;
  setFieldValue: (key: string, value: any, arg2: boolean) => void;
};
const ROOT = 'mobile-app-pages-expense-page-record-new-mileage';
const MileageForm = (props: Props) => {
  const {
    rate,
    values,
    errors,
    readOnly,
    mileageRates,
    mileageUnit,
    isGeneratedPreview,
    currencySymbol,
    baseCurrencyDecimal,
    taxRoundingSetting,
    employeeId,
    companyId,
    setFieldValue,
    onClickMileageApply,
    openMileageMap,
    onClickMileageReset,
    searchMileageRoute,
  } = props;
  const dispatch = useDispatch();
  const [routeError, setRouteError] = useState(undefined);
  const [apiExceedError, setApiExceedError] = useState(false);
  const [recentlyUsedDestinations, setRecentlyUsedDestinations] = useState<
    Array<string>
  >([]);

  const Actions = useMemo(
    () => bindActionCreators({ getRecentDestinations }, dispatch),
    [dispatch]
  );

  useEffect(() => {
    if (!readOnly)
      // @ts-ignore
      Actions.getRecentDestinations(employeeId, companyId).then(
        (res: Array<string>) => {
          setRecentlyUsedDestinations(res || []);
        }
      );
  }, [readOnly]);

  const { mileageRouteInfo, items } = values;
  const destinations = get(
    mileageRouteInfo,
    'destinations',
    initialDestinations
  );
  const distance = get(items[0], 'mileageDistance');
  const expMileageRateId = get(items[0], 'mileageRateHistoryId');
  const mileageRate = get(items[0], 'mileageRate', 0);

  useEffect(() => {
    if (!readOnly) calculateAmount();
    if (readOnly) onClickMileageApply();
  }, [mileageRate, readOnly]);

  const renderError = (key: string) => {
    const fieldError = get(errors, key);

    if (fieldError) {
      return [msg()[fieldError]];
    } else {
      return [];
    }
  };

  const onChangeDestinationInput = (destination: string, idx: number) => {
    const destinationsClone = cloneDeep(destinations);
    destinationsClone[idx] = { name: destination };
    setFieldValue('mileageRouteInfo.destinations', destinationsClone, true);
  };
  const onAddDestination = () => {
    const destinationsClone = cloneDeep(destinations);
    destinationsClone.push({ name: '' });
    setFieldValue('mileageRouteInfo.destinations', destinationsClone, false);
  };
  const onDeleteDestination = (idx: number) => {
    const destinationsClone = cloneDeep(destinations);
    destinationsClone.splice(idx, 1);
    setFieldValue('mileageRouteInfo.destinations', destinationsClone, false);
  };
  const onClickReverseDestinations = () => {
    const destinationsClone = cloneDeep(destinations);
    setFieldValue(
      'mileageRouteInfo.destinations',
      destinationsClone.reverse(),
      false
    );
  };
  const onResetDestinations = () => {
    onClickMileageReset();
    setApiExceedError(false);
    setRouteError(false);
    setFieldValue('items[0].mileageDistance', undefined, false);
    setFieldValue('mileageRouteInfo.estimatedDistance', undefined, false);
  };

  const onChangeDistance = (d: string) => {
    if (!isValidDistance(d)) return;
    setFieldValue('items[0].mileageDistance', d, true);
    if (d.length > 0)
      // @ts-ignore
      calculateAmount(d);
    else calculateAmount(0);
  };

  const getMileageRateOptions = (): Array<{ label: string; value: string }> => {
    const mileageRate: MileageRate | undefined = mileageRates.find(
      (mR) => mR.historyId === expMileageRateId
    );
    if (!mileageRate) return [];
    const rateName = get(mileageRate, 'name');
    const rate = get(mileageRate, 'rate');
    return [
      {
        label: `${rateName} - ${currencySymbol}${rate}`,
        value: expMileageRateId,
      },
    ];
  };

  const getFieldValue = (key: string, defaultValue?: string | number) => {
    return get(values, `${key}`, defaultValue);
  };

  const onClickApply = async () => {
    if (searchMileageRoute) {
      setRouteError(undefined);
      setApiExceedError(false);
      const directionResponse = await searchMileageRoute(destinations);
      const { code, status } = directionResponse;
      const limitExceededStatuses = [
        google.maps.DirectionsStatus.OVER_QUERY_LIMIT,
        google.maps.DirectionsStatus.REQUEST_DENIED,
        google.maps.DirectionsStatus.UNKNOWN_ERROR,
      ];
      if (status === google.maps.DirectionsStatus.OK) {
        calculateDistance(directionResponse);
        onClickMileageApply && onClickMileageApply();
      } else if (
        limitExceededStatuses.indexOf(status) > -1 ||
        limitExceededStatuses.indexOf(code) > -1
      ) {
        setApiExceedError(true);
        onClickMileageApply();
      } else {
        setRouteError('Exp_Lbl_NoRouteExists');
      }
    }
  };
  const calculateDistance = (response: google.maps.DirectionsResult) => {
    const { routes } = response;
    const legs = routes[0].legs;
    const distance = legs.reduce((dist, leg) => dist + leg.distance.value, 0);
    const convertedDistance = getDistanceInUnit(distance, mileageUnit);
    setFieldValue('items[0].mileageDistance', convertedDistance, true);
    setFieldValue(
      'mileageRouteInfo.estimatedDistance',
      convertedDistance,
      false
    );
    // @ts-ignore
    calculateAmount(convertedDistance);
  };

  const calculateAmount = (finalDistance = distance) => {
    let calcDistance = finalDistance;
    if (!finalDistance) calcDistance = 0;
    const amount = calcAmountFromRate(
      mileageRate,
      calcDistance,
      baseCurrencyDecimal,
      ROUNDING_TYPE.RoundUp
    );
    const { amountWithoutTax, gstVat } = calculateTax(
      rate,
      // @ts-ignore
      amount,
      baseCurrencyDecimal,
      taxRoundingSetting
    );
    setFieldValue('items.0.amount', amount, false);
    setFieldValue('items.0.withoutTax', amountWithoutTax, false);
    setFieldValue('items.0.gstVat', gstVat, false);
    setFieldValue('withoutTax', amountWithoutTax, false);
  };

  const canShowClearButton =
    !isGeneratedPreview &&
    destinations &&
    destinations.length > MIN_DESTINATIONS;
  const canShowAddbutton =
    !readOnly &&
    !isGeneratedPreview &&
    destinations &&
    destinations.length < MAX_DESTINATIONS;
  const canShowReverseButton = !readOnly && !isGeneratedPreview;
  const canShowGeneratePreview = !readOnly && !isGeneratedPreview;
  const canShowMap = isGeneratedPreview && !apiExceedError;
  const canShowReset = !readOnly && isGeneratedPreview;
  const canShowMileageDetails = readOnly || isGeneratedPreview;
  const isDisabledApply =
    !destinations || destinations.some((l) => isEmpty(l.name));

  const ratePerUnitLabel =
    mileageUnit === MileageUnit.MILE
      ? msg().Exp_Lbl_RatePerMile
      : msg().Exp_Lbl_RatePerKm;
  const mileageUnitLbl =
    mileageUnit === MileageUnit.MILE
      ? msg().Exp_Sel_MileageUnitMile
      : msg().Exp_Sel_MileageUnitKm;

  return (
    <div>
      <div className={`${ROOT}__divider`} />
      <div className={`${ROOT}__trip-container`}>
        <div className={`${ROOT}__destinations-container`}>
          {destinations &&
            destinations.map((destination, idx) => {
              const isFinalDestination = idx === destinations.length - 1;
              const disabled = readOnly || isGeneratedPreview;
              return (
                <DestinationInput
                  value={destination.name}
                  key={`destination-input-${idx}`}
                  onChange={(l: string) => onChangeDestinationInput(l, idx)}
                  showClearButton={canShowClearButton}
                  onClickClear={() => onDeleteDestination(idx)}
                  placeholder={`${msg().Exp_Lbl_AddDestination} ${idx + 1}`}
                  isFinalDestination={isFinalDestination}
                  disabled={disabled}
                  recentlyUsedDestinations={recentlyUsedDestinations}
                />
              );
            })}
        </div>
        {canShowReverseButton && (
          <div className={`${ROOT}__destinations-reversal-container`}>
            <IconButton
              className={`${ROOT}__reversal-icon`}
              icon="sort-copy"
              onClick={onClickReverseDestinations}
              disabled={false}
              size="large"
            />
          </div>
        )}
      </div>
      {routeError && (
        <div className={`${ROOT}-error-message`}>{msg()[routeError]}</div>
      )}
      {canShowAddbutton && (
        <div
          className={`${ROOT}__button-add-container`}
          onClick={onAddDestination}
        >
          <Icon
            className={`${ROOT}__button-add-container-button`}
            type="plus"
            size="large"
          />
          <Label
            text={msg().Exp_Lbl_AddDestination}
            className={`${ROOT}__button-add-container-label`}
          />
        </div>
      )}
      {canShowGeneratePreview && (
        <Button
          priority="primary"
          variant="neutral"
          type="button"
          className={`${ROOT}__generate-preview`}
          disabled={isDisabledApply}
          onClick={onClickApply}
        >
          {msg().Exp_Lbl_SearchRoute}
        </Button>
      )}
      <section className={`${ROOT}__destinations-reset-container`}>
        {canShowMap && (
          <div className={`${ROOT}__destinations-reset-container-map`}>
            <div
              onClick={openMileageMap}
              className={`${ROOT}__destinations-reset-container-map`}
            >
              <Icon
                className={`${ROOT}__destinations-reset-container-map-icon`}
                type="open"
              />
              <Label
                text={msg().Exp_Lbl_OpenMap}
                className={`${ROOT}__destinations-reset-container-label`}
              />
            </div>
          </div>
        )}
        {apiExceedError && (
          <div className={`${ROOT}-error-message`}>
            {msg().Exp_Lbl_ApiLimitExceed}
          </div>
        )}
        {canShowReset && (
          <div className={`${ROOT}__destinations-reset-container-reset`}>
            <div onClick={onResetDestinations}>
              <Label
                text={msg().Exp_Lbl_ResetDestinations}
                className={`${ROOT}__destinations-reset-container-label`}
              />
            </div>
          </div>
        )}
      </section>
      {canShowMileageDetails && (
        <section className={`${ROOT}__destination-details`}>
          <SelectField
            disabled
            label={ratePerUnitLabel}
            options={getMileageRateOptions()}
            value={expMileageRateId}
            errors={
              getMileageRateOptions().length === 0
                ? [
                    TextUtil.template(
                      msg().Com_Err_NotValidAt,
                      msg().$Exp_Clbl_MileageRate,
                      msg().Exp_Clbl_Date
                    ),
                  ]
                : undefined
            }
          />
          <MileageDistanceField
            error={renderError('items.0.mileageDistance')}
            mileageUnitLbl={mileageUnitLbl}
            distance={distance}
            estimatedDistance={getFieldValue(
              'mileageRouteInfo.estimatedDistance',
              0
            )}
            readOnly={readOnly}
            setFieldValue={setFieldValue}
            onChange={onChangeDistance}
          />
          <div className={`${ROOT}__divider`} />
        </section>
      )}
    </div>
  );
};

export default MileageForm;
