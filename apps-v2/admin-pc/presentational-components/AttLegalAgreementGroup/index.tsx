import React from 'react';

import cloneDeep from 'lodash/cloneDeep';

import configListTemplate from '../../constants/configList/attLegalAgreementGroup';

import { Action, Record } from '../../utils/RecordUtil';

import MainContents from '../../components/MainContents';

type Props = {
  actions: Action;
  companyId: string;
  searchLegalAgreementGroup: Array<Record>;
};

export default class LegalAgreementGroup extends React.Component<Props> {
  UNSAFE_componentWillMount() {
    const param = { companyId: this.props.companyId };
    this.props.actions.getConstantsLegalAgreementGroup();
    this.props.actions.searchLegalAgreementGroup(param);
  }

  UNSAFE_componentWillUpdate(nextProps) {
    if (this.props.companyId !== nextProps.companyId) {
      const param = { companyId: nextProps.companyId };
      this.props.actions.searchLegalAgreementGroup(param);
    }
  }

  render() {
    const configList = cloneDeep(configListTemplate);
    configList.base.forEach((config) => {
      if (config.key === 'companyId') {
        config.defaultValue = this.props.companyId;
      }
    });

    return (
      <MainContents
        componentKey="legalAgreementGroup"
        configList={configList}
        itemList={this.props.searchLegalAgreementGroup}
        {...this.props}
      />
    );
  }
}
