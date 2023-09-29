import React from 'react';

import cloneDeep from 'lodash/cloneDeep';

import configListTemplate from '../../constants/configList/resourceGroup';

import { ResourceGroup as ResourceGroupModel } from '../../../domain/models/psa/ResourceGroup';

import * as RecordUtil from '../../utils/RecordUtil';

import MainContents from '../../components/MainContents';

import { BaseMasterCRUDActions, QueryAction } from '../Type';

type Props = {
  actions: BaseMasterCRUDActions & {
    searchPSAGroup: QueryAction;
    cleanOwners: () => void;
  };
  itemList: Array<ResourceGroupModel>;
  companyId: string;
  tmpEditRecord: RecordUtil.Record;
  editRecord: RecordUtil.Record;
};

export default class ResourceGroup extends React.Component<Props> {
  componentDidMount() {
    const param = { companyId: this.props.companyId, types: ['ResourceGroup'] };
    this.props.actions.search(param);
    this.props.actions.searchPSAGroup(param);
  }

  componentDidUpdate(prevProps) {
    if (this.props.companyId !== prevProps.companyId) {
      const param = { companyId: this.props.companyId };
      this.props.actions.search(param);
    }

    if (
      prevProps.tmpEditRecord.parentId &&
      this.props.tmpEditRecord.parentId &&
      this.props.editRecord.parentId !== this.props.tmpEditRecord.parentId &&
      prevProps.tmpEditRecord.parentId !== this.props.tmpEditRecord.parentId
    ) {
      this.props.actions.cleanOwners();
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
