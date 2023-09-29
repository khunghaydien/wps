import React from 'react';

import cloneDeep from 'lodash/cloneDeep';

import configListTemplate from '../../constants/configList/objectivelyEventLogSetting';

import { Action, Record } from '../../utils/RecordUtil';

import MainContents from '../../components/MainContents';

type Props = {
  actions: Action;
  companyId: string;
  searchObjectivelyEventLogSetting: Array<Record>;
};

export default class ObjectivelyEventLogSetting extends React.Component<Props> {
  UNSAFE_componentWillMount() {
    const param = { companyId: this.props.companyId };
    this.props.actions.getConstantsObjectivelyEventLogSetting();
    this.props.actions.searchObjectivelyEventLogSetting(param);
  }

  UNSAFE_componentWillUpdate(nextProps) {
    if (this.props.companyId !== nextProps.companyId) {
      const param = { companyId: nextProps.companyId };
      this.props.actions.searchObjectivelyEventLogSetting(param);
    }
  }

  render() {
    const configList = cloneDeep(configListTemplate);
    configList.base.forEach((config) => {
      if (config.key === 'companyId') {
        config.defaultValue = this.props.companyId;
      }
    });

    return (
      <MainContents
        componentKey="objectivelyEventLogSetting"
        configList={configList}
        itemList={this.props.searchObjectivelyEventLogSetting}
        {...this.props}
      />
    );
  }
}
