import * as React from 'react';
import { useSelector } from 'react-redux';

import isNil from 'lodash/isNil';

import { State } from '../modules';
import { State as DailyAllowanceSummaryState } from '../modules/entities/dailyAllowance';

import DailyAllowanceButton from '../components/MainContent/Timesheet/DailyAllowanceButton';

type OwnProps = {
  date: string;
  isLocked: boolean;
};

const DailyAllowanceButtonContainer = (ownProps: OwnProps) => {
  const isLoading = useSelector(
    (state: State) => state.ui.dailyAllowance.isLoading
  );

  const dailyAllowanceSummary = useSelector(
    (state: State) =>
      state.entities.dailyAllowance as DailyAllowanceSummaryState
  );
  const attDailyAllowanceMap = dailyAllowanceSummary.attDailyAllowanceMap;
  const {
    availableAllowanceCount,
    dailyAllowanceList,
  }: {
    availableAllowanceCount?: number;
    dailyAllowanceList?: [];
  } = React.useMemo(() => {
    return isNil(attDailyAllowanceMap)
      ? {}
      : isNil(attDailyAllowanceMap[ownProps.date])
      ? {}
      : attDailyAllowanceMap[ownProps.date];
  }, [attDailyAllowanceMap, ownProps.date]);
  return (
    <DailyAllowanceButton
      isLoading={isLoading}
      date={ownProps.date}
      isLocked={ownProps.isLocked}
      availableAllowanceCount={availableAllowanceCount}
      dailyAllowanceList={dailyAllowanceList}
    />
  );
};

export default DailyAllowanceButtonContainer;
