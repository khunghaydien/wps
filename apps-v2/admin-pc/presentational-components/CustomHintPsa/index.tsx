import React from 'react';

import isEqual from 'lodash/isEqual';

import configList from '../../constants/configList/customHintPsa';

import MainContents from '../../components/MainContents';

type Props = {
  actions: any;
  commonActions: any;
  searchCustomHint: any;
  companyId: string;
  tmpEditRecord: any;
};

export default class ExpCustomHint extends React.Component<Props> {
  componentDidMount() {
    const param = { companyId: this.props.companyId, moduleType: 'Project' };
    this.props.actions.searchCustomHint(param);
    this.props.commonActions.setEditRecord({
      ...this.props.searchCustomHint,
      ...param,
    });
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    const { searchCustomHint, tmpEditRecord, commonActions } = this.props;
    if (this.props.companyId !== nextProps.companyId) {
      const param = { companyId: nextProps.companyId, moduleType: 'Project' };
      this.props.actions.searchCustomHint(param);
    }
    if (!isEqual(searchCustomHint, nextProps.searchCustomHint)) {
      commonActions.setEditRecord(nextProps.searchCustomHint);
    } else if (tmpEditRecord.companyId !== nextProps.tmpEditRecord.companyId) {
      commonActions.setTmpEditRecord(nextProps.searchCustomHint);
    }
  }

  render() {
    return (
      <MainContents
        // @ts-ignore
        mode={this.props.mode}
        componentKey="customHintPsa"
        configList={configList}
        moduleType="Project"
        {...this.props}
        isSinglePane
      />
    );
  }
}
