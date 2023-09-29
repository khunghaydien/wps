import React, { useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { bindActionCreators } from 'redux';

import cloneDeep from 'lodash/cloneDeep';
import get from 'lodash/get';
import isEmpty from 'lodash/isEmpty';

import { useScript } from '@apps/core/hooks';
import { getRecentDestinations } from '@commons/action-dispatchers/Mileage';
import MileageForm from '@commons/components/exp/Form/RecordItem/Mileage/MileageForm';
import googleMapsApiKey, {
  GOOGLE_MAP_SCRIPT_ID,
} from '@commons/config/exp/googleMapKey';
import {
  getDistanceInUnit,
  isValidDistance,
} from '@commons/utils/exp/MileageUtils';

import {
  calcAmountFromRate,
  ROUNDING_TYPE,
} from '@apps/domain/models/exp/foreign-currency/Currency';
import {
  initialDestinations,
  MileageDestinationInfo,
  MileageUnit,
} from '@apps/domain/models/exp/Mileage';
import { Record } from '@apps/domain/models/exp/Record';

import { modes } from '@apps/expenses-pc/modules/ui/expenses/mode';

import { setIsNeedGenerateMapPreview } from '@apps/expenses-pc/action-dispatchers/Expenses';

export type MileageFormContainerProps = {
  baseCurrencyCode;
  baseCurrencyDecimal: number;
  baseCurrencySymbol: string;
  customHint;
  errors?: any;
  expRecord: Record;
  expPreRecord?: Record;
  isExpenseRequest;
  isFinanceApproval;
  mileageUnit?: MileageUnit;
  readOnly?: boolean;
  recordItemIdx?: number;
  selectedCompanyId?: string;
  targetRecord: string;
  touched;
  isHighlightDiff?: boolean;
  isHighlightNewRecord?: boolean;
  mode: string;
  isLoading?: boolean;
  loadingAreas?: string[];
  onChangeEditingExpReport: (arg0: string, arg1: any) => void;
};
const MileageFormContainer = (props: MileageFormContainerProps) => {
  const {
    expRecord,
    targetRecord,
    onChangeEditingExpReport,
    errors,
    recordItemIdx,
    mileageUnit,
    baseCurrencyDecimal,
    readOnly,
    mode,
    selectedCompanyId,
  } = props;
  const dispatch = useDispatch();
  const userSetting = useSelector((state: any) => state.userSetting);
  const { employeeId } = userSetting;

  const { loading } = useScript(
    `https://maps.googleapis.com/maps/api/js?key=${googleMapsApiKey}&libraries=places`,
    GOOGLE_MAP_SCRIPT_ID
  );

  const [recentlyUsedDestinations, setRecentlyUsedDestinations] = useState<
    Array<string>
  >([]);

  const Actions = useMemo(
    () =>
      bindActionCreators(
        { setIsNeedGenerateMapPreview, getRecentDestinations },
        dispatch
      ),
    [dispatch]
  );

  const isExistingRecord = !isEmpty(expRecord.recordId);

  const destinations: Array<MileageDestinationInfo> = get(
    expRecord,
    'mileageRouteInfo.destinations',
    initialDestinations
  );
  const estimatedDistance = get(
    expRecord,
    'mileageRouteInfo.estimatedDistance'
  );
  const distance = get(expRecord, `items.${recordItemIdx}.mileageDistance`);
  const mileageRate = get(expRecord, `items.${recordItemIdx}.mileageRate`, '');

  useEffect(() => {
    // @ts-ignore
    Actions.getRecentDestinations(employeeId, selectedCompanyId).then(
      (res: Array<string>) => {
        setRecentlyUsedDestinations(res || []);
      }
    );
  }, []);

  useEffect(() => {
    if (
      !readOnly &&
      [modes.FINANCE_REPORT_EDITED, modes.REPORT_EDIT].includes(mode)
    )
      calculateAmount();
  }, [mileageRate]);

  const clearDirectionState = () => {
    onChangeEditingExpReport(
      `${targetRecord}.mileageRouteInfo.estimatedDistance`,
      undefined
    );
    onChangeEditingExpReport(
      `${targetRecord}.items.${recordItemIdx}.mileageDistance`,
      undefined
    );
    onChangeEditingExpReport(`${targetRecord}.amount`, 0);
  };

  const onChangeDestination = (destination: string, idx: number) => {
    clearDirectionState();
    onChangeEditingExpReport(
      `${targetRecord}.mileageRouteInfo.destinations.${idx}.name`,
      destination
    );
  };

  const onAddDestination = () => {
    const destinationsClone = cloneDeep(destinations);
    destinationsClone.push({ name: '' });
    clearDirectionState();
    onChangeEditingExpReport(
      `${targetRecord}.mileageRouteInfo.destinations.${
        destinationsClone.length - 1
      }.name`,
      ''
    );
  };

  const onDeleteDestination = (idx: number) => {
    clearDirectionState();
    const destinationsClone = cloneDeep(destinations);
    destinationsClone.splice(idx, 1);
    onChangeEditingExpReport(
      `${targetRecord}.mileageRouteInfo.destinations`,
      destinationsClone
    );
  };

  const onReverseDestinations = () => {
    clearDirectionState();
    const destinationsClone = cloneDeep(destinations);
    onChangeEditingExpReport(
      `${targetRecord}.mileageRouteInfo.destinations`,
      destinationsClone.reverse()
    );
  };

  const onSearchedRouteDistance = (distance: number) => {
    const convertedDistance = getDistanceInUnit(distance, mileageUnit);
    onChangeEditingExpReport(
      `${targetRecord}.mileageRouteInfo.estimatedDistance`,
      convertedDistance
    );
    onChangeEditingExpReport(
      `${targetRecord}.items.${recordItemIdx}.mileageDistance`,
      convertedDistance
    );
    calculateAmount(convertedDistance);
  };

  const setGeneratePreviewNeeded = (isNeeded?: boolean) => {
    Actions.setIsNeedGenerateMapPreview(isNeeded);
  };

  const handleDistanceChange = (_e, distance: string) => {
    if (!isValidDistance(distance)) return;
    onChangeEditingExpReport(
      `${targetRecord}.items.${recordItemIdx}.mileageDistance`,
      distance
    );
    calculateAmount(distance);
  };

  const calculateAmount = (finalDistance = distance) => {
    let calcDistance = finalDistance;
    if (!finalDistance) calcDistance = 0;
    const amount = calcAmountFromRate(
      mileageRate || 0,
      calcDistance,
      baseCurrencyDecimal,
      ROUNDING_TYPE.RoundUp
    );
    onChangeEditingExpReport(`${targetRecord}.amount`, +amount);
  };

  const getSelectedMileageRateInfo = ():
    | { name: string; rate: number }
    | undefined => {
    if (mileageRate === '') return undefined;
    const mileageRateName = get(
      expRecord,
      `items.${recordItemIdx}.mileageRateName`,
      ''
    );
    return { name: mileageRateName, rate: mileageRate };
  };

  return (
    <div id="mileage-form-container">
      <MileageForm
        {...props}
        librariesLoaded={!loading}
        expRecord={expRecord}
        targetRecord={targetRecord}
        onChangeEditingExpReport={onChangeEditingExpReport}
        errors={errors}
        recordItemIdx={recordItemIdx}
        destinations={destinations}
        estimatedDistance={estimatedDistance}
        distance={distance}
        isExistingRecord={isExistingRecord}
        recentlyUsedDestinations={recentlyUsedDestinations}
        mileageRateInfo={getSelectedMileageRateInfo()}
        handleDistanceChange={handleDistanceChange}
        onChangeDestination={onChangeDestination}
        onDeleteDestination={onDeleteDestination}
        onAddDestination={onAddDestination}
        onReverseDestinations={onReverseDestinations}
        onSearchedRouteDistance={onSearchedRouteDistance}
        setGeneratePreviewNeeded={setGeneratePreviewNeeded}
      />
    </div>
  );
};

export default MileageFormContainer;
