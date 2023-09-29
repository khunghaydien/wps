import * as React from 'react';

import classNames from 'classnames';

import TimeUtil from '../../../../commons/utils/TimeUtil';

import { FixDailyRequest } from '@apps/attendance/domain/models/FixDailyRequest';
import { Status } from '@attendance/domain/models/AttDailyRequest';
import { WorkingType } from '@attendance/domain/models/WorkingType';

import * as RecordsUtil from '@attendance/libraries/utils/Records';

import MonthlyListItem from '../../molecules/attendance/MonthlyList/MonthlyListItem';

const ROOT = 'mobile-app-components-organisms-attendance-monthly-list';

type Props = Readonly<{
  className?: string;
  workingTypes: WorkingType[];
  items?: Array<{
    recordDate: string;
    rowType: string;
    startTime: number | null;
    endTime: number | null;
    contractedDetail: {
      startTime: number | null;
      endTime: number | null;
    };
    remarkableRequestStatus: {
      count: number;
      status: Status;
    } | null;
    attentionMessages: string[] | null;
    fixDailyRequest: FixDailyRequest;
  }>;
  useFixDailyRequest: boolean;
  onClickItem: (arg0: string) => void;
}>;

export default class MonthlyList extends React.PureComponent<Props> {
  render() {
    const className = classNames(ROOT, this.props.className);
    return (
      <div className={className}>
        <div className={`${ROOT}__list-item`}>
          {this.props.items &&
            this.props.items.map((d, i) => (
              <MonthlyListItem
                key={i}
                onClick={() => this.props.onClickItem(d.recordDate)}
                rowType={d.rowType}
                date={d.recordDate}
                startTime={TimeUtil.toHHmm(d.startTime)}
                endTime={TimeUtil.toHHmm(d.endTime)}
                requestStatus={
                  (d.remarkableRequestStatus &&
                    d.remarkableRequestStatus.status) ||
                  null
                }
                fixDailyRequestStatus={d.fixDailyRequest.status}
                workingType={RecordsUtil.getWithinRange(
                  d.recordDate,
                  this.props.workingTypes
                )}
                useFixDailyRequest={this.props.useFixDailyRequest}
                workingTypeStartTime={TimeUtil.toHHmm(
                  d.contractedDetail.startTime
                )}
                workingTypeEndTime={TimeUtil.toHHmm(d.contractedDetail.endTime)}
                attentionMessages={d.attentionMessages}
              />
            ))}
        </div>
      </div>
    );
  }
}
