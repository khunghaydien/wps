import React from 'react';
import { useSelector } from 'react-redux';

import { Permission } from '../../domain/models/access-control/Permission';
import { User } from '../../domain/models/User';

import { State as DailySummaryState } from '../modules/ui/dailySummary';
import { State } from '@apps/daily-summary/modules';

import TrackSummaryCard from '../components/TrackSummaryCard';

const TrackSummaryCardContainer: React.FC = () => {
  const targetDate = useSelector(
    (state: State) => (state.ui.dailySummary as DailySummaryState).targetDate
  );
  const userPermission: Permission = useSelector(
    (state: State) => state.common.accessControl.permission
  );
  const user: User = useSelector((state: State) => state.entities.user);

  return (
    <>
      {targetDate && (
        <TrackSummaryCard
          targetDate={targetDate}
          userPermission={userPermission}
          user={user}
        />
      )}
    </>
  );
};

export default TrackSummaryCardContainer;
