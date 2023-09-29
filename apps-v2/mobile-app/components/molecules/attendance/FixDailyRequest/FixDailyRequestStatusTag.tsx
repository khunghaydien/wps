import * as React from 'react';

import classNames from 'classnames';

import { Status } from '@apps/attendance/domain/models/FixDailyRequest';

import { UIType, useFixDailyRequestUIType } from './useFixDailyRequestUIType';

import './FixDailyRequestStatusTag.scss';

const ROOT = 'mobile-app-atoms-fix-daily-request-status-tag';

export type Props = Readonly<{
  date: string;
  status: Status;
  startTime?: string;
  endTime?: string;
}>;

const FixDailyRequestStatusTag: React.FC<Props> = (props) => {
  const { type } = useFixDailyRequestUIType(props);

  return (
    <div
      className={classNames(ROOT, {
        [`${ROOT}--approved`]: type === UIType.APPROVED,
        [`${ROOT}--pending`]: type === UIType.PENDING,
        [`${ROOT}--warning`]: type === UIType.WARNING,
        [`${ROOT}--not-requested`]: type === UIType.NOT_REQUESTED,
      })}
    />
  );
};

export default FixDailyRequestStatusTag;
