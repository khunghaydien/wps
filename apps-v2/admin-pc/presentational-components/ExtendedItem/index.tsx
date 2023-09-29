import React from 'react';

import _ from 'lodash';

import configListTemplate from '../../constants/configList/extendedItem';

import { Action, Record } from '../../utils/RecordUtil';

import MainContents from '../../components/MainContents';

type Props = {
  actions: Action;
  companyId: string;
  searchExtendedItem: Array<Record>;
};

export default class ExtendedItem extends React.Component<Props> {
  UNSAFE_componentWillMount() {
    const param = { companyId: this.props.companyId };
    this.props.actions.getConstantsExtendedItem();
    this.props.actions.searchExtendedItem(param);
    this.props.actions.searchExtendedItemCustom(param);
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    if (this.props.companyId !== nextProps.companyId) {
      const param = { companyId: nextProps.companyId };
      this.props.actions.getConstantsExtendedItem(param);
      this.props.actions.searchExtendedItem(param);
      this.props.actions.searchExtendedItemCustom(param);
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
        componentKey="extendedItem"
        configList={configList}
        itemList={this.props.searchExtendedItem}
        showCloneButton
        {...this.props}
      />
    );
  }
}
