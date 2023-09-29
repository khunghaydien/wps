import React from 'react';

import classNames from 'classnames';

import MultiColumnsGrid from '@apps/commons/components/MultiColumnsGrid';
import msg from '@apps/commons/languages';
import DateUtil from '@apps/commons/utils/DateUtil';

import { ActivityStatus } from '@apps/domain/models/psa/Activity';
import { ProjectListItem } from '@apps/domain/models/psa/Project';

import './index.scss';

type Props = {
  testId: number;
  onClickProjectListItem: (projectId?: string) => void;
} & ProjectListItem;

const ROOT = 'ts-psa__list-item';

const ListItem = (props: Props) => {
  const statusClass = classNames(`${ROOT}__status`, {
    'is-completed': props.status === ActivityStatus.Completed,
    'is-in-progress': props.status === ActivityStatus.InProgress,
    'is-cancelled': props.status === ActivityStatus.Cancelled,
    'is-in-planning': props.status === ActivityStatus.Planning,
  });

  return (
    <div
      className={`${ROOT}`}
      onClick={() => props.onClickProjectListItem(props.projectId)}
      data-testid={`${ROOT}--${props.testId}`}
    >
      <MultiColumnsGrid sizeList={[2, 2, 1, 2, 2, 1, 1, 1]}>
        <span className={`${ROOT}__code`}>{props.projectJobCode}</span>

        <span className={`${ROOT}__title`}>{props.name}</span>

        <span className={`${ROOT}__client`}>{props.clientName || '-'}</span>

        <span className={`${ROOT}__dept`}>{props.deptName || '-'}</span>

        <span className={`${ROOT}__manager`}>{props.pmName}</span>

        <span className={statusClass}>
          {props.status && msg()[`Psa_Lbl_Status${props.status}`]}
        </span>

        <span className={`${ROOT}__start-date`}>
          {props.startDate && DateUtil.format(props.startDate)}
        </span>

        <span className={`${ROOT}__end-date`}>
          {props.endDate && DateUtil.format(props.endDate)}
        </span>
      </MultiColumnsGrid>
    </div>
  );
};

export default ListItem;
