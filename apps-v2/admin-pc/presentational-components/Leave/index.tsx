import React from 'react';

import _ from 'lodash';

import configListTemplate from '../../constants/configList/leave';

import { Action, Record } from '../../utils/RecordUtil';

import MainContents from '../../components/MainContents';

type Props = {
  actions: Action;
  companyId: string;
  searchLeave: Array<Record>;
  tmpEditRecord: Record;
};

export default class Leave extends React.Component<Props> {
  UNSAFE_componentWillMount() {
    const param = { companyId: this.props.companyId };
    this.props.actions.getConstantsLeave();
    this.props.actions.searchLeave(param);
  }

  UNSAFE_componentWillUpdate(nextProps) {
    if (this.props.companyId !== nextProps.companyId) {
      const param = { companyId: nextProps.companyId };
      this.props.actions.searchLeave(param);
    }
  }

  render() {
    const configList = _.cloneDeep(configListTemplate);
    configList.base.forEach((config) => {
      if (config.key === 'companyId') {
        config.defaultValue = this.props.companyId;
      }
      if (
        config.key === 'leaveType' &&
        this.props.tmpEditRecord.changeRequestDateToHoliday
      ) {
        config.props = 'leaveTypeWithChangeToHoliday';
      }
      if (
        config.key === 'leaveRanges' &&
        this.props.tmpEditRecord.changeRequestDateToHoliday
      ) {
        config.props = 'leaveRangesWithChangeToHoliday';
        const leaveRanges = [];
        if (this.props.tmpEditRecord.leaveRanges.includes('Day')) {
          leaveRanges.push('Day');
        }
        this.props.tmpEditRecord.leaveRanges = leaveRanges;
      }
    });

    return (
      <MainContents
        componentKey="leave"
        configList={configList}
        itemList={this.props.searchLeave}
        {...this.props}
      />
    );
  }
}
