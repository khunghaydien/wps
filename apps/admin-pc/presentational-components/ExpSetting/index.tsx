import React from 'react';

import _ from 'lodash';

import configList from '../../constants/configList/expSetting';

import { Action, Record } from '../../utils/RecordUtil';

import MainContents from '../../components/MainContents';

type Props = {
  actions: Action;
  commonActions: Action;
  searchExpSetting: Array<Record>;
  companyId: string;
};
export default class ExpSetting extends React.Component<Props> {
  componentDidMount() {
    const idx = _.findIndex(this.props.searchExpSetting, [
      'id',
      this.props.companyId,
    ]);
    this.props.actions.searchCurrency();
    this.props.commonActions.setEditRecord(this.props.searchExpSetting[idx]);
    this.props.actions.getConstantsExpSetting();
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    const idx = _.findIndex(nextProps.searchExpSetting, [
      'id',
      nextProps.companyId,
    ]);

    if (
      !_.isEqual(this.props.companyId, nextProps.companyId) ||
      !_.isEqual(this.props.searchExpSetting, nextProps.searchExpSetting)
    ) {
      nextProps.commonActions.setEditRecord(nextProps.searchExpSetting[idx]);
      this.props.actions.getConstantsExpSetting();
    }
  }

  render() {
    return (
      <MainContents
        // @ts-ignore
        mode={this.props.mode}
        componentKey="expSetting"
        configList={configList}
        {...this.props}
        isSinglePane
      />
    );
  }
}
