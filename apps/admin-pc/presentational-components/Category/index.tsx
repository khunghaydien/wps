import React from 'react';

import _ from 'lodash';

import configListTemplate from '../../constants/configList/category';

import { Category as CategoryModel } from '../../../domain/models/psa/Category';

import MainContents from '../../components/MainContents';

import { BaseMasterCRUDActions } from '../Type';

type Props = {
  actions: BaseMasterCRUDActions;
  itemList: Array<CategoryModel>;
  companyId: string;
};

export default class Category extends React.Component<Props> {
  UNSAFE_componentWillMount() {
    const param = { companyId: this.props.companyId };
    this.props.actions.search(param);
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
    });
    return (
      <MainContents
        componentKey="Category"
        configList={configList}
        itemList={this.props.itemList}
        {...this.props}
      />
    );
  }
}
