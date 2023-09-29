import React from 'react';

import _ from 'lodash';

import configListTemplate from '../../constants/configList/attExtendedItem';

import { Action, Record } from '../../utils/RecordUtil';

import MainContents from '../../components/MainContents';

type Props = {
  actions: Action;
  companyId: string;
  searchAttExtendedItem: Array<Record>;
};

export default class AttExtendedItem extends React.Component<Props> {
  UNSAFE_componentWillMount() {
    const param = { companyId: this.props.companyId };
    this.props.actions.getConstantsAttExtendedItem();
    this.props.actions.searchAttExtendedItem(param);
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    if (this.props.companyId !== nextProps.companyId) {
      const param = { companyId: nextProps.companyId };
      this.props.actions.getConstantsAttExtendedItem(param);
      this.props.actions.searchAttExtendedItem(param);
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
        componentKey="attExtendedItem"
        configList={configList}
        itemList={this.props.searchAttExtendedItem}
        {...this.props}
      />
    );
  }
}
