import React from 'react';

import { Permission } from '../../domain/models/access-control/Permission';

import TrackSummary from '../../time-tracking/TrackSummary';

type Props = {
  userPermission: Permission;
};

const TrackSummaryCard: React.FC<Props> = ({ userPermission }: Props) => {
  return <TrackSummary.Request margin="20px" userPermission={userPermission} />;
};

export default TrackSummaryCard;
