import React from 'react';

import StampClock from '../components/StampClock';

export default {
  title: 'attendance/timestamp-widget-pc',
};

export const _StampClock = () => (
  <StampClock currentTime={new Date()} locale="en-US" />
);

_StampClock.storyName = 'StampClock';
