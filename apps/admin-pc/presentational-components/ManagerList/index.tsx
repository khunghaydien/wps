import React from 'react';

import _ from 'lodash';

import configListTemplate from '../../constants/configList/managerList';

import { ManagerList as ManagerListModel } from '../../../domain/models/psa/ManagerList';

import MainContents from '../../components/MainContents';

import { BaseMasterCRUDActions } from '../Type';

type Props = {
  actions: BaseMasterCRUDActions;
  itemList: Array<ManagerListModel>;
  companyId: string;
};

export default class ManagerList extends React.Component<Props> {
  componentDidMount() {
    const param = { companyId: this.props.companyId, types: ['PM', 'RM'] };
    this.props.actions.search(param);
  }

  componentDidUpdate(prevProps: Props) {
    if (this.props.companyId !== prevProps.companyId) {
      const param = { companyId: this.props.companyId };
      this.props.actions.search(param);
    }
  }

  render() {
    const configList = _.cloneDeep(configListTemplate);
    configList.base.forEach((config) => {
      if (config.key && config.key === 'companyId') {
        config.defaultValue = this.props.companyId;
      }
    });
    return (
      <MainContents
        componentKey="ManagerList"
        configList={configList}
        itemList={this.props.itemList}
        {...this.props}
        hideNewButton
        hideDeleteDetailButton
      />
    );
  }
}
