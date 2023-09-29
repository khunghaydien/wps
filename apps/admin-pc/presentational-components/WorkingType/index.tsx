import React from 'react';

import _ from 'lodash';

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
    this.props.actions.searchWorkingType(param);
    this.props.actions.searchLeave(param);
    this.props.actions.getConstantsWorkingType();
    this.props.actions.searchAttPattern({
      ...param,
      targetDate: props.tmpEditRecordHistory.validDateFrom,
    });
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    if (this.props.companyId !== nextProps.companyId) {
      const param = { companyId: nextProps.companyId };
      this.props.actions.searchWorkingType(param);
      this.props.actions.searchLeave(param);
    } else if (
      this.props.tmpEditRecordHistory.validDateFrom !==
      nextProps.tmpEditRecordHistory.validDateFrom
    ) {
      this.props.actions.searchAttPattern({
        companyId: nextProps.companyId,
        targetDate: nextProps.tmpEditRecordHistory.validDateFrom,
      });
    }
  }

  render() {
    const configListWorkingType = _.cloneDeep(configList);
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
