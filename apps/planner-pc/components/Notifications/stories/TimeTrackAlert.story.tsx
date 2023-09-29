import React, { ReactElement } from 'react';

import TimeTrackAlert from '../TimeTrackAlert';

export default {
  title: 'planner-pc/Notifications',
};

export const _TimeTrackAlert = (): ReactElement => (
  <TimeTrackAlert id="test" isVisible />
);

_TimeTrackAlert.storyName = 'TimeTrackAlert';
