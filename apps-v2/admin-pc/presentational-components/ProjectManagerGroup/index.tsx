import React from 'react';

import cloneDeep from 'lodash/cloneDeep';

import configListTemplate from '../../constants/configList/projectManagerGroup';

import { ProjectManagerGroup as ProjectManagerGroupModel } from '../../../domain/models/psa/ProjectManagerGroup';

import MainContents from '../../components/MainContents';

import { BaseMasterCRUDActions } from '../Type';

type Props = {
  actions: BaseMasterCRUDActions;
  itemList: Array<ProjectManagerGroupModel>;
  companyId: string;
};

export default class ProjectManagerGroup extends React.Component<Props> {
  componentDidMount() {
    const param = { companyId: this.props.companyId, types: ['ManagerGroup'] };
    this.props.actions.search(param);
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
        componentKey="ProjectManagerGroup"
        configList={configList}
        itemList={this.props.itemList}
        {...this.props}
        hideNewButton
        hideDeleteDetailButton
      />
    );
  }
}
