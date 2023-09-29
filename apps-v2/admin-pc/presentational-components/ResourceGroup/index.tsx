import React from 'react';

import cloneDeep from 'lodash/cloneDeep';

import configListTemplate from '../../constants/configList/resourceGroup';

import { ResourceGroup as ResourceGroupModel } from '../../../domain/models/psa/ResourceGroup';

import MainContents from '../../components/MainContents';

import { BaseMasterCRUDActions } from '../Type';

type Props = {
  actions: BaseMasterCRUDActions;
  itemList: Array<ResourceGroupModel>;
  companyId: string;
};

export default class ResourceGroup extends React.Component<Props> {
  componentDidMount() {
    const param = { companyId: this.props.companyId, types: ['ResourceGroup'] };
    this.props.actions.search(param);
  }

  componentDidUpdate(prevProps: Props) {
    if (this.props.companyId !== prevProps.companyId) {
      const param = { companyId: this.props.companyId };
      this.props.actions.search(param);
    }
  }

  render() {
    const configList = cloneDeep(configListTemplate);
    configList.base.forEach((config) => {
      if (config.key && config.key === 'companyId') {
        config.defaultValue = this.props.companyId;
      }
    });

    return (
      <MainContents
        componentKey="ResourceGroup"
        configList={configList}
        itemList={this.props.itemList}
        {...this.props}
      />
    );
  }
}
