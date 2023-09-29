import * as React from 'react';

import classNames from 'classnames';

import SaveButton from '../../molecules/commons/Buttons/SaveButton';

import { Status } from '../../../../domain/models/approval/request/Status';
import {
  hasWorkCategory,
  Task,
} from '../../../../domain/models/time-tracking/Task';

import DetectOverflow from '../../atoms/Utils/DetectOverflow';
import AddJobButton from '../../molecules/tracking/AddJobButton';
import DailyTaskNavigation from '../../molecules/tracking/DailyTaskNavigation';
import DailyTaskInputCard from '../../organisms/tracking/DailyTaskInputCard';

import './DailyTaskPage.scss';

const ROOT = 'mobile-app-pages-tracking-daily-task-page';

export type Props = Readonly<{
  taskList: Array<Task>;
  toggleDirectInput: (id: string, isDirectInput: boolean) => void;
  editTaskTime: (id: string, taskTime: number) => void;
  editRatio: (id: string, ratio: number) => void;
  deleteTask: (id: string) => void;
  save: () => void;
  hasMultipleRatios: boolean;
  disabled?: boolean;
  requestStatus: Status;
  totalRatio: number;

  /* Navigation */
  today: string;
  listEditing: boolean;
  onChangeDate: (arg0: string) => void;
  onClickPrevDate: () => void;
  onClickNextDate: () => void;
  onToggleEditing: () => void;
  onClickAddJob: () => void;
  onClickRefresh: () => void;
  renderDailyTaskHeader: React.ReactNode;
}>;

export default class DailyTaskPage extends React.Component<Props> {
  render() {
    return (
      <div className={ROOT}>
        <div className={`${ROOT}__heading`}>
          <DailyTaskNavigation
            today={this.props.today}
            listEditing={this.props.listEditing}
            onClickMonthlySummary={() => {}}
            onChangeDate={this.props.onChangeDate}
            onClickPrevDate={this.props.onClickPrevDate}
            onClickNextDate={this.props.onClickNextDate}
            onToggleEditing={this.props.onToggleEditing}
            onClickRefresh={this.props.onClickRefresh}
          />
          <div className={`${ROOT}__heading--info`}>
            {this.props.renderDailyTaskHeader}
          </div>
        </div>
        <DetectOverflow className={`${ROOT}__container`}>
          {({ isOverflowed }) => (
            <React.Fragment>
              <div className={`${ROOT}__content`}>
                <div>
                  {this.props.taskList.map((task) => (
                    <div className={`${ROOT}__input-field`} key={task.id}>
                      <DailyTaskInputCard
                        hasWorkCategory={hasWorkCategory(task)}
                        listEditing={this.props.listEditing}
                        code={task.jobCode}
                        job={task.jobName}
                        workCategoryName={task.workCategoryName || ''}
                        timeOrRatioValue={task.isDirectInput ? 'time' : 'ratio'}
                        isInvalidInput={
                          this.props.totalRatio !== 100 && !task.isDirectInput
                        }
                        onClickInputModeButton={() =>
                          this.props.toggleDirectInput(
                            task.id,
                            task.isDirectInput
                          )
                        }
                        onChangeTaskTime={(value) =>
                          this.props.editTaskTime(task.id, value)
                        }
                        onChangeRatio={(value) =>
                          this.props.editRatio(task.id, value)
                        }
                        onClickDeleteButton={() =>
                          this.props.deleteTask(task.id)
                        }
                        taskTime={task.taskTime || 0}
                        ratio={task.ratio || 0}
                        multipleRatiosExist={this.props.hasMultipleRatios}
                        requestStatus={this.props.requestStatus}
                      />
                    </div>
                  ))}
                </div>
              </div>
              <div
                className={classNames(`${ROOT}__actions`, {
                  [`${ROOT}__actions--overflowed`]: isOverflowed,
                })}
              >
                {!this.props.listEditing && (
                  <AddJobButton
                    className={`${ROOT}__add-job-button`}
                    testId={`${ROOT}__add-job-button`}
                    onClick={this.props.onClickAddJob}
                    floating={isOverflowed}
                    disabled={this.props.disabled}
                  />
                )}
                <SaveButton
                  onClick={this.props.save}
                  disabled={this.props.disabled}
                />
              </div>
            </React.Fragment>
          )}
        </DetectOverflow>
      </div>
    );
  }
}
