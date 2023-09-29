import React from 'react';

import classNames from 'classnames';

import { Status } from '@apps/attendance/domain/models/FixDailyRequest';

import { UIType, useFixDailyRequestUIType } from './useFixDailyRequestUIType';

import './FixDailyRequestStatusBar.scss';

const ROOT = 'mobile-app-atoms-fix-daily-request-status-bar';

export type Props = Readonly<{
  date: string;
  status: Status;
  startTime?: string;
  endTime?: string;
}>;

const FixDailyRequestStatusBar: React.FC<Props> = (props) => {
  const { type } = useFixDailyRequestUIType(props);

  return (
    <div
      className={classNames(ROOT, {
        [`${ROOT}--approved`]: type === UIType.APPROVED,
        [`${ROOT}--pending`]: type === UIType.PENDING,
        [`${ROOT}--warning`]:
          type === UIType.WARNING || type === UIType.NOT_REQUESTED,
        [`${ROOT}--none`]: type === UIType.NONE,
      })}
    />
  );
};

export default FixDailyRequestStatusBar;
