import React from 'react';

import styled from 'styled-components';

import { Permission } from '../../domain/models/access-control/Permission';
import { User } from '../../domain/models/User';

import TrackSummary from '../../time-tracking/TrackSummary';

type Props = Readonly<{
  targetDate?: string;
  user?: User;
  userPermission: Permission;
}>;

const Container = styled.div`
  width: 100%;
`;

const TrackSummaryCard: React.FC<Props> = ({
  targetDate,
  user,
  userPermission,
}: Props) => {
  return (
    <Container>
      <TrackSummary.RequestCompact
        targetDate={targetDate}
        userPermission={userPermission}
        user={user}
      />
    </Container>
  );
};

export default TrackSummaryCard;
