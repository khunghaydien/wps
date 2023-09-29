import React from 'react';

/* eslint-enable import/no-extraneous-dependencies */
import StatusLabel from '../StatusLabel';

export default {
  title: 'time-tracking/TrackSummary',
};

export const _StatusLabel = () => (
  <>
    <StatusLabel status="NotRequested" />
    <StatusLabel status="Pending" />
    <StatusLabel status="Removed" />
    <StatusLabel status="Rejected" />
    <StatusLabel status="Approved" />
  </>
);

_StatusLabel.storyName = 'StatusLabel';
