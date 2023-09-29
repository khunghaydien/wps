import React from 'react';

import cloneDeep from 'lodash/cloneDeep';

import configList from '../../constants/configList/attendanceFeatureSetting';

import { Action, Record } from '../../utils/RecordUtil';

import MainContents from './MainContents';

export type Props = {
  actions: Action;
  isShowDetail: any;
  editRecord: any;
  title: string;
  useFunction: any;
  companyId: string;
  tmpEditRecordHistory: Record;
};

export default class AttendanceFeature extends React.Component<Props> {
  UNSAFE_componentWillMount() {
    const param = { companyId: this.props.companyId };
    this.props.actions.init(param);
    this.props.actions.getConstantsFeatureSetting();
    this.props.actions.searchFeatureSettingOpsRecord(param);
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    if (this.props.companyId !== nextProps.companyId) {
      const param = { companyId: nextProps.companyId };
      this.props.actions.searchFeatureSetting(param);
      this.props.actions.getConstantsFeatureSetting();
      this.props.actions.searchFeatureSettingOpsRecord(param);
    }
  }

  render() {
    const configListFeatureSetting = cloneDeep(configList);

    return (
      <MainContents configList={configListFeatureSetting} {...this.props} />
    );
  }
}
