import React from 'react';

import cloneDeep from 'lodash/cloneDeep';

import configList from '../../constants/configList/workingType';

import { Action, Record } from '../../utils/RecordUtil';

import MainContents from './MainContents';

export type Props = {
  actions: Action;
  companyId: string;
  searchWorkingType: Array<Record>;
  tmpEditRecordHistory: Record;
};

export default class WorkingType extends React.Component<Props> {
  constructor(props) {
    super(props);

    const param = { companyId: props.companyId };
    this.props.actions.searchLeave(param);
    this.props.actions.searchObjectivelyEventLogSetting(param);
    this.props.actions.searchRestReason(param);
    this.props.actions.searchAllowance(param);
    this.props.actions.searchLateArrivalEarlyLeaveReason(param);
    this.props.actions.getConstantsWorkingType();
    this.props.actions.searchRecordExtendedItemSet(param);
    this.props.actions.searchRecordDisplayFieldLayout(param);
    this.props.actions.searchAttExtendedItem(param);
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    if (this.props.companyId !== nextProps.companyId) {
      const param = { companyId: nextProps.companyId };
      this.props.actions.searchLeave(param);
      this.props.actions.searchObjectivelyEventLogSetting(param);
      this.props.actions.searchRestReason(param);
      this.props.actions.searchAllowance(param);
      this.props.actions.searchLateArrivalEarlyLeaveReason(param);
      this.props.actions.searchRecordExtendedItemSet(param);
      this.props.actions.searchRecordDisplayFieldLayout(param);
      this.props.actions.searchAttExtendedItem(param);
    }
  }

  render() {
    const configListWorkingType = cloneDeep(configList);
    configListWorkingType.base.forEach((config) => {
      if (config.key === 'companyId') {
        config.defaultValue = this.props.companyId;
      }
    });
    return (
      <MainContents
        // @ts-ignore
        componentKey="workingType"
        configList={configListWorkingType}
        itemList={this.props.searchWorkingType}
        {...this.props}
      />
    );
  }
}
