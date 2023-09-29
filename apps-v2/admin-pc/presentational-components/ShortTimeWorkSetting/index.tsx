import React from 'react';

import _ from 'lodash';

import configListTemplate from '../../constants/configList/shortTimeWorkSetting';

import { Action, Record } from '../../utils/RecordUtil';

import MainContents from '../../components/MainContents';

type Props = {
  actions: Action;
  companyId: string;
  searchShortTimeWorkSetting: Array<Record>;
};

export default class ShortTimeWorkSetting extends React.Component<Props> {
  UNSAFE_componentWillMount() {
    const param = { companyId: this.props.companyId };
    this.props.actions.searchShortTimeWorkReason(param);
    this.props.actions.searchShortTimeWorkSetting(param);
    this.props.actions.getConstantsShortTimeWorkSetting();
  }

  UNSAFE_componentWillUpdate(nextProps) {
    if (this.props.companyId !== nextProps.companyId) {
      const param = { companyId: nextProps.companyId };
      this.props.actions.searchShortTimeWorkReason(param);
      this.props.actions.searchShortTimeWorkSetting(param);
      this.props.actions.getConstantsShortTimeWorkSetting();
    }
  }

  render() {
    const configList = _.cloneDeep(configListTemplate);
    configList.base.forEach((config) => {
      if (config.key === 'companyId') {
        config.defaultValue = this.props.companyId;
      }
    });

    return (
      <MainContents
        componentKey="ShortTimeWorkSetting"
        configList={configList}
        itemList={this.props.searchShortTimeWorkSetting}
        {...this.props}
      />
    );
  }
}
