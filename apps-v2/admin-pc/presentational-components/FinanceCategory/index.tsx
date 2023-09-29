import React from 'react';

import _ from 'lodash';

import financeCategory from '../../constants/configList/financeCategory';

import { FinanceCategory as FinanceCategoryModel } from '../../../domain/models/psa/FinanceCategory';

import { Action } from '../../utils/RecordUtil';

import MainContents from '../../components/MainContents';

type Props = {
  actions: Action;
  itemList: Array<FinanceCategoryModel>;
  companyId: string;
  modeBase?: string;
  commonActions: any;
};

export default class FinanceCategory extends React.Component<Props> {
  UNSAFE_componentWillMount() {
    const param = { companyId: this.props.companyId };
    this.props.actions.search(param);
    this.props.actions.getConstants();
    this.props.actions.getPsaSettings({
      companyId: this.props.companyId,
    });
  }

  UNSAFE_componentWillUpdate(nextProps: Props) {
    if (this.props.companyId !== nextProps.companyId) {
      const param = { companyId: nextProps.companyId };
      this.props.actions.getConstants(param);
      this.props.actions.search(param);
    }
  }

  render() {
    const configList = _.cloneDeep(financeCategory);
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
    const items = this.props.itemList.map(
      (item) => (item.order = item.order.toString())
    );
    return (
      <MainContents
        componentKey="FinanceCategory"
        configList={configList}
        itemList={items}
        {...this.props}
      />
    );
  }
}
