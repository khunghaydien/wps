import React from 'react';

import _ from 'lodash';

import configListTemplate from '../../constants/configList/expTypeGroup';

import { Action, Record } from '../../utils/RecordUtil';

import MainContents from '../../components/MainContents';

type Props = {
  actions: Action;
  companyId: string;
  searchExpTypeGroup: Array<Record>;
  searchParentExpTypeGroup: Array<Record>;
};

export default class ExpTypeGroup extends React.Component<Props> {
  UNSAFE_componentWillMount() {
    const param = { companyId: this.props.companyId };
    this.props.actions.searchExpTypeGroup(param);
    this.props.actions.searchParentExpTypeGroup(param);
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    if (this.props.companyId !== nextProps.companyId) {
      const param = { companyId: nextProps.companyId };
      this.props.actions.searchExpTypeGroup(param);
      this.props.actions.searchParentExpTypeGroup(param);
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
        componentKey="expTypeGroup"
        configList={configList}
        itemList={this.props.searchExpTypeGroup}
        showCloneButton
        {...this.props}
      />
    );
  }
}
