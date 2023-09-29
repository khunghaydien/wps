import * as React from 'react';

import AttHoursField from '../../../commons/components/fields/AttHoursField';
import msg from '../../../commons/languages';
import TimeUtil from '../../../commons/utils/TimeUtil';

import PlaceInTemplate from '../../components/PlaceInTemplate';

import './DirectInputScopeOfWorkingHours.scss';

const ROOT = 'admin-pc-working-type-legal-rest-time-check';

type Props = {
  config: {
    key: string;
  };
  childrenKeys: {
    [key: string]: string;
  };
  checkboxes: {
    useDirectInputTimeApply: boolean;
  };
  disabled: boolean;
  tmpEditRecord: Record<string, any>;
  onChangeDetailItem: (arg0: string, arg1: any) => void;
};

type State = {
  maxHours: string;
  maxMinutes: string;
  minHours: string;
  minMinutes: string;
};

export default class DirectInputScopeOfWorkingHours extends React.Component<
  Props,
  State
> {
  onChangeHoursOrMinutes = (type, value) => {
    const { childrenKeys, tmpEditRecord, onChangeDetailItem } = this.props;
    const maxWorkTimes = TimeUtil.toHmmObj(
      +tmpEditRecord[childrenKeys.maxWorkHours]
    );
    const minWorkTimes = TimeUtil.toHmmObj(
      +tmpEditRecord[childrenKeys.minWorkHours]
    );

    switch (type) {
      case 'maxHours':
        return onChangeDetailItem(
          childrenKeys.maxWorkHours,
          String(TimeUtil.toMinutes(+value + ':' + +maxWorkTimes.m))
        );
      case 'maxMinutes':
        return onChangeDetailItem(
          childrenKeys.maxWorkHours,
          String(TimeUtil.toMinutes(+maxWorkTimes.h + ':' + +value))
        );
      case 'minHours':
        return onChangeDetailItem(
          childrenKeys.minWorkHours,
          String(TimeUtil.toMinutes(+value + ':' + +minWorkTimes.m))
        );
      case 'minMinutes':
        return onChangeDetailItem(
          childrenKeys.minWorkHours,
          String(TimeUtil.toMinutes(+minWorkTimes.h + ':' + +value))
        );
      default:
        return null;
    }
  };

  renderMaxWorkHours(): React.ReactNode {
    const { childrenKeys, disabled, tmpEditRecord } = this.props;
    const key = childrenKeys.maxWorkHours;
    const maxHoursKey = 'MAX_HOURS_KEY';
    const maxMinutesKey = 'MAX_MINUTES_KEY';

    return (
      <div>
        <PlaceInTemplate
          template={msg().Admin_Lbl_directInputMinWorkHoursScopeIsX}
        >
          {
            <AttHoursField
              type={maxHoursKey}
              disabled={disabled}
              onBlur={(value: string | null) => {
                this.onChangeHoursOrMinutes('maxHours', value);
              }}
              value={
                +tmpEditRecord[key]
                  ? TimeUtil.toHmmObj(+tmpEditRecord[key]).h
                  : '0'
              }
              required
            />
          }
          {
            <AttHoursField
              type={maxMinutesKey}
              disabled={disabled}
              onBlur={(value: string | null) => {
                this.onChangeHoursOrMinutes('maxMinutes', String(value));
              }}
              value={TimeUtil.toHmmObj(+tmpEditRecord[key]).m}
              required
            />
          }
        </PlaceInTemplate>
      </div>
    );
  }

  renderMinWorkHours(): React.ReactNode {
    const { childrenKeys, disabled, tmpEditRecord } = this.props;
    const key = childrenKeys.minWorkHours;
    const minHoursKey = 'MIN_HOURS_KEY';
    const minMinutesKey = 'MIN_MINUTES_KEY';

    return (
      <div>
        <PlaceInTemplate
          template={msg().Admin_Lbl_directInputMaxWorkHoursScopeIsX}
        >
          {
            <AttHoursField
              type={minHoursKey}
              disabled={disabled}
              onBlur={(value: string | null) => {
                this.onChangeHoursOrMinutes('minHours', value);
              }}
              value={
                +tmpEditRecord[key]
                  ? TimeUtil.toHmmObj(+tmpEditRecord[key]).h
                  : '0'
              }
              required
            />
          }
          {
            <AttHoursField
              type={minMinutesKey}
              disabled={disabled}
              onBlur={(value: string | null) => {
                this.onChangeHoursOrMinutes('minMinutes', String(value));
              }}
              value={TimeUtil.toHmmObj(+tmpEditRecord[key]).m}
              required
            />
          }
        </PlaceInTemplate>
      </div>
    );
  }

  render() {
    return (
      <div className={`${ROOT}__body`}>
        <div className={`${ROOT}__item-value`}>
          {this.renderMinWorkHours() as React.ReactNode}
          {this.renderMaxWorkHours() as React.ReactNode}
        </div>
      </div>
    );
  }
}
