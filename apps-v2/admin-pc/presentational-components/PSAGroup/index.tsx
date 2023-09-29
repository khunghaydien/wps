import React from 'react';

import cloneDeep from 'lodash/cloneDeep';

import configListTemplate from '../../constants/configList/psaGroup';

import { PSAGroup as PSAGroupModel } from '../../../domain/models/psa/PSAGroup';

import MainContents from '../../components/MainContents';

import { BaseMasterCRUDActions } from '../Type';

type Props = {
  actions: BaseMasterCRUDActions;
  itemList: Array<PSAGroupModel>;
  companyId: string;
};

export default class PSAGroup extends React.Component<Props> {
  componentDidMount() {
    const param = { companyId: this.props.companyId, types: ['PsaGroup'] };
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
        componentKey="PSAGroup"
        configList={configList}
        itemList={this.props.itemList}
        {...this.props}
        hideDeleteDetailButton
      />
    );
  }
}
