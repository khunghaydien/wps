import React from 'react';

import cloneDeep from 'lodash/cloneDeep';

import configListTemplate from '../../constants/configList/attRecordExtendedItemSet';

import { Action, Record } from '../../utils/RecordUtil';

import MainContents from '../../components/MainContents';

type Props = {
  actions: Action;
  companyId: string;
  searchRecordExtendedItemSet: Array<Record>;
  tmpEditRecord: Record;
};

export default class RecordExtendedItemSet extends React.Component<Props> {
  UNSAFE_componentWillMount() {
    const param = { companyId: this.props.companyId };
    this.props.actions.getConstantsRecordExtendedItemSet();
    this.props.actions.searchRecordExtendedItemSet(param);
    this.props.actions.searchAttExtendedItem(param);
  }

  UNSAFE_componentWillUpdate(nextProps) {
    if (this.props.companyId !== nextProps.companyId) {
      const param = { companyId: nextProps.companyId };
      this.props.actions.searchRecordExtendedItemSet(param);
      this.props.actions.searchAttExtendedItem(param);
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
        componentKey="RecordExtendedItemSet"
        configList={configList}
        itemList={this.props.searchRecordExtendedItemSet}
        {...this.props}
      />
    );
  }
}
