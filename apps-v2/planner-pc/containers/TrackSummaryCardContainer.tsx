import React from 'react';
import { useSelector } from 'react-redux';

import { Permission } from '../../domain/models/access-control/Permission';

import { State } from '@apps/planner-pc/modules';

import TrackSummaryCard from '../components/TrackSummaryCard';

const TrackSummaryContainer: React.FC = () => {
  const userPermission: Permission = useSelector(
    (state: State) => state.common.accessControl.permission
  );

  return <TrackSummaryCard userPermission={userPermission} />;
};

export default TrackSummaryContainer;
