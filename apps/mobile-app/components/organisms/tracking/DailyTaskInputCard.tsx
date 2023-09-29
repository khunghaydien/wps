import * as React from 'react';

import classNames from 'classnames';

import TimeUtil from '../../../../commons/utils/TimeUtil';

import { Status } from '../../../../domain/models/approval/request/Status';
import { canEditTask } from '../../../../domain/models/time-tracking/DailyTask';

import Card from '../../atoms/Card';
import IconButton from '../../atoms/IconButton';
import InputModeButton from '../../molecules/tracking/InputModeButton';
import RatioField from '../../molecules/tracking/RatioField';
import TaskTimeSelect from '../../molecules/tracking/TaskTimeSelect';

import './DailyTaskInputCard.scss';

const ROOT = 'mobile-app-organisms-daily-task-input-card';

type Props = Readonly<{
  hasWorkCategory: boolean;
  listEditing: boolean;
  testId?: string;
  code: string;
  job: string;
  multipleRatiosExist: boolean;
  workCategoryName: string;
  ratio: number;
  taskTime: number;
  timeOrRatioValue: 'time' | 'ratio';
  isInvalidInput: boolean;
  requestStatus: Status;
  onChangeTaskTime: (value: number) => void;
  onChangeRatio: (value: number) => void;
  onClickInputModeButton: (value: 'time' | 'ratio') => void;
  onClickDeleteButton: () => void;
}>;

export default class DailyTaskInputCard extends React.Component<Props> {
  render() {
    const { listEditing } = this.props;
    const isLocked = !canEditTask(this.props.requestStatus);
    const testId = (prefix: string): typeof undefined | string => {
      return this.props.testId ? `${this.props.testId}__${prefix}` : undefined;
    };
    const className = classNames(ROOT, {
      [`${ROOT}--strong`]: this.props.isInvalidInput,
    });

    return (
      <Card className={className}>
        <div className={`${ROOT}__left`}>
          <div className={`${ROOT}__heading heading-3`}>
            <span className={`${ROOT}__code`}>{this.props.code}</span>
            <span className={`${ROOT}__break`}>/</span>
            <span className={`${ROOT}__job`}>{this.props.job}</span>
          </div>
          {this.props.hasWorkCategory && (
            <div className={`${ROOT}__work-category`}>
              {this.props.workCategoryName}
            </div>
          )}
        </div>

        <div className={`${ROOT}__right horizontal`}>
          <div className={`${ROOT}__left`}>
            {this.props.timeOrRatioValue === 'time' ? (
              <TaskTimeSelect
                testId={testId('att-time')}
                onChange={(value) =>
                  this.props.onChangeTaskTime(TimeUtil.toMinutes(value) || 0)
                }
                className={`${ROOT}__input`}
                placeholder="00:00"
                value={TimeUtil.toHHmm(this.props.taskTime)}
                readOnly={this.props.listEditing || isLocked}
              />
            ) : null}
            {this.props.timeOrRatioValue === 'ratio' ? (
              <React.Fragment>
                <RatioField
                  testId={testId('att-time')}
                  onBlur={(value) =>
                    value !== this.props.ratio &&
                    this.props.onChangeRatio(value)
                  }
                  className={`${ROOT}__input`}
                  placeholder="0"
                  readOnly={
                    !this.props.multipleRatiosExist ||
                    this.props.listEditing ||
                    isLocked
                  }
                  value={this.props.ratio}
                />
              </React.Fragment>
            ) : null}
          </div>
          <div className={`${ROOT}__right`}>
            <InputModeButton
              testId={testId('input-mode-button')}
              value={this.props.timeOrRatioValue}
              // @ts-ignore
              onClick={this.props.onClickInputModeButton}
              disabled={this.props.listEditing || isLocked}
            />
          </div>
          {listEditing ? (
            <div className={`${ROOT}__additional`}>
              <IconButton
                icon="delete-copy"
                onClick={this.props.onClickDeleteButton}
              />
            </div>
          ) : null}
        </div>
      </Card>
    );
  }
}
