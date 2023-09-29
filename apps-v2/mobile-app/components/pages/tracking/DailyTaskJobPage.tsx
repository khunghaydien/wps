import * as React from 'react';

import isNil from 'lodash/isNil';
import { $PropertyType, $ReadOnly } from 'utility-types';

import msg from '../../../../commons/languages';
import { parseIntOrNull } from '../../../../commons/utils/NumberUtil';
import TimeUtil from '../../../../commons/utils/TimeUtil';
import SaveButton from '../../molecules/commons/Buttons/SaveButton';
import LikeInputButtonField from '../../molecules/commons/Fields/LikeInputButtonField';
import SelectField, {
  Props as SelectFieldProps,
} from '../../molecules/commons/Fields/SelectField';
import Navigation from '../../molecules/commons/Navigation';

import {
  hasWorkCategory,
  Job,
} from '../../../../domain/models/time-tracking/Job';

import Card from '../../atoms/Card';
import TextButton from '../../atoms/TextButton';
import TaskTimeSelectField from '../../molecules/tracking/TaskTimeSelectField';

import './DailyTaskJobPage.scss';

const ROOT = 'mobile-app-tracking-daily-task-job-page';

type Options = $PropertyType<SelectFieldProps, 'options'>;

export type Props = $ReadOnly<{
  selectedJob?: Job;
  workCategories: Options;
  selectedWorkCategoryId: string;
  taskTime: string;
  onSelectWorkCategory: (arg0: React.SyntheticEvent<HTMLSelectElement>) => void;
  onChangeTaskTime: (arg0?: number) => void;
  onClickDiscard: () => void;
  onClickJob: () => void;
  onClickSave: () => void;
}>;

export default class DailyTaskJobPage extends React.Component<Props> {
  render() {
    const { selectedJob } = this.props;
    const showsWorkCategory =
      !isNil(this.props.selectedJob) &&
      hasWorkCategory(this.props.selectedJob as Job);

    return (
      <div className={ROOT}>
        <div className={`${ROOT}__heading`}>
          <Navigation
            title={msg().Trac_Lbl_AddJob}
            actions={[
              <TextButton onClick={this.props.onClickDiscard}>
                {msg().Com_Btn_Cancel}
              </TextButton>,
            ]}
          />
        </div>
        <div className={`${ROOT}__container`}>
          {/* @ts-ignore */}
          <Card flat className={`${ROOT}__content`}>
            <LikeInputButtonField
              className={`${ROOT}__control`}
              required
              label={msg().Trac_Lbl_Job}
              value={selectedJob ? selectedJob.name : ''}
              onClick={this.props.onClickJob}
            />
            {showsWorkCategory && (
              <SelectField
                className={`${ROOT}__control`}
                label={msg().Trac_Lbl_WorkCategory}
                // @ts-ignore
                options={this.props.workCategories}
                value={this.props.selectedWorkCategoryId}
                onChange={(e) => this.props.onSelectWorkCategory(e)}
              />
            )}
            <TaskTimeSelectField
              className={`${ROOT}__control`}
              label={msg().Trac_Lbl_WorkTime}
              value={this.props.taskTime}
              onChange={(value) =>
                this.props.onChangeTaskTime(
                  parseIntOrNull(TimeUtil.toMinutes(value))
                )
              }
              placeholder="00:00"
            />
            <div className={`${ROOT}__action`}>
              <SaveButton
                onClick={this.props.onClickSave}
                disabled={isNil(this.props.selectedJob)}
              />
            </div>
          </Card>
        </div>
      </div>
    );
  }
}
