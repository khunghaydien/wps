import React from 'react';

import _ from 'lodash';

import configList from '../../constants/configList/organization';

import MainContents from '../../components/MainContents';

type Props = {
  commonActions: any;
  getOrganizationSetting: any;
  tmpEditRecord: any;
};

export default class Organization extends React.Component<Props> {
  UNSAFE_componentWillMount() {
    this.props.commonActions.setEditRecord(this.props.getOrganizationSetting);
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    if (
      !_.isEqual(
        this.props.getOrganizationSetting,
        nextProps.getOrganizationSetting
      )
    ) {
      this.props.commonActions.setEditRecord(nextProps.getOrganizationSetting);
    }
  }

  render() {
    return (
      <MainContents
        componentKey="organization"
        configList={configList}
        isSinglePane
        {...this.props}
      />
    );
  }
}
