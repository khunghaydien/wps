import React from 'react';

import cloneDeep from 'lodash/cloneDeep';

import configListTemplate from '../../constants/configList/restReason';

import { Action, Record } from '../../utils/RecordUtil';

import MainContents from '../../components/MainContents';

type Props = {
  actions: Action;
  companyId: string;
  searchRestReason: Array<Record>;
};

export default class RestReason extends React.Component<Props> {
  UNSAFE_componentWillMount() {
    const param = { companyId: this.props.companyId };
    this.props.actions.getConstantsRestReason();
    this.props.actions.searchRestReason(param);
  }

  UNSAFE_componentWillUpdate(nextProps) {
    if (this.props.companyId !== nextProps.companyId) {
      const param = { companyId: nextProps.companyId };
      this.props.actions.searchRestReason(param);
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
        componentKey="restReason"
        configList={configList}
        itemList={this.props.searchRestReason}
        {...this.props}
      />
    );
  }
}
