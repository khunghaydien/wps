import * as React from 'react';

import _ from 'lodash';

import configListTemplate from '../../constants/configList/permission';

import { Permission } from '../../models/permission/Permission';

import MainContents from '../../components/MainContents';

type Props = Readonly<{
  companyId: string;
  actions: {
    searchPermission: (arg0: { companyId: string }) => void;
    create: (arg0: Permission) => void;
    update: (arg0: Permission) => void;
    delete: (arg0: { id: string }) => void;
  };
  searchPermission: Permission[];
}>;

export default class Employee extends React.Component<Props> {
  UNSAFE_componentWillMount() {
    const param = { companyId: this.props.companyId };
    this.props.actions.searchPermission(param);
  }

  UNSAFE_componentWillUpdate(nextProps: Props) {
    if (this.props.companyId !== nextProps.companyId) {
      const param = { companyId: nextProps.companyId };
      this.props.actions.searchPermission(param);
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
        componentKey="permission"
        configList={configList}
        itemList={this.props.searchPermission}
        {...this.props}
      />
    );
  }
}
