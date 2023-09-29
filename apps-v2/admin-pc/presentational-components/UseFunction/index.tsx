import React from 'react';

import _ from 'lodash';

import configList from '../../constants/configList/useFunction';

import { Action, Record } from '../../utils/RecordUtil';

import MainContents from '../../components/MainContents';

type Props = {
  commonActions: Action;
  companyId: string;
  searchCompany: Array<Record>;
};

export default class UseFunction extends React.Component<Props> {
  UNSAFE_componentWillMount() {
    const idx = _.findIndex(this.props.searchCompany, [
      'id',
      this.props.companyId,
    ]);
    this.props.commonActions.setEditRecord(this.props.searchCompany[idx]);
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    if (this.props.companyId !== nextProps.companyId) {
      const idx = _.findIndex(this.props.searchCompany, [
        'id',
        nextProps.companyId,
      ]);
      this.props.commonActions.setEditRecord(this.props.searchCompany[idx]);
    }
  }

  render() {
    return (
      <MainContents
        componentKey="useFunction"
        configList={configList}
        isSinglePane
        {...this.props}
      />
    );
  }
}
