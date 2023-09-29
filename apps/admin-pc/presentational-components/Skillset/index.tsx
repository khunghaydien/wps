import React from 'react';

import _ from 'lodash';

import configListTemplate from '../../constants/configList/skillset';

import { Skillset as SkillsetModel } from '../../../domain/models/psa/Skillset';

import MainContents from '../../components/MainContents';

import { BaseMasterCRUDActions, QueryAction } from '../Type';

type Props = {
  actions: BaseMasterCRUDActions & {
    searchCategory: QueryAction;
    getConstantsSkillset: () => void;
  };
  itemList: Array<SkillsetModel>;
  companyId: string;
  modeBase?: string;
};

export default class Skillset extends React.Component<Props> {
  UNSAFE_componentWillMount() {
    const param = { companyId: this.props.companyId };
    this.props.actions.search(param);
    this.props.actions.searchCategory(param);
    this.props.actions.getConstantsSkillset();
  }

  UNSAFE_componentWillUpdate(nextProps: Props) {
    if (this.props.companyId !== nextProps.companyId) {
      const param = { companyId: nextProps.companyId };
      this.props.actions.search(param);
    }
  }

  render() {
    const configList = _.cloneDeep(configListTemplate);
    configList.base.forEach((config) => {
      if (config.key && config.key === 'companyId') {
        config.defaultValue = this.props.companyId;
      }
      if (
        config.key &&
        config.key === 'code' &&
        this.props.modeBase === 'edit'
      ) {
        config.readOnly = true;
      }
    });
    const filteredItemList = this.props.itemList.filter(
      (item) => !item.deleted
    );
    return (
      <MainContents
        {...this.props}
        componentKey="Skillset"
        configList={configList}
        itemList={filteredItemList}
      />
    );
  }
}
