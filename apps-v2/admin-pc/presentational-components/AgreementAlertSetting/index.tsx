import React from 'react';

import cloneDeep from 'lodash/cloneDeep';

import configList from '../../constants/configList/agreement-alert-setting';

import { AgreementAlertSetting as AgreementAlertSettingType } from '../../models/agreement-alert-setting/types';

import MainContents from '../../components/MainContents';

export type Props = {
  companyId: string | null | undefined;
  actions: {
    search: (
      arg0:
        | {
            companyId: string;
          }
        | {
            id: string;
          }
    ) => Promise<void>;
  };
  itemList: AgreementAlertSettingType[];
} & React.ComponentProps<typeof MainContents>;

type State = {
  configList: { base: any[] };
};

export default class AgreementAlertSetting extends React.Component<
  Props,
  State
> {
  constructor() {
    // @ts-ignore
    super();
    this.state = {
      configList: cloneDeep(configList),
    };
  }

  UNSAFE_componentWillMount() {
    if (this.props.companyId !== null && this.props.companyId !== undefined) {
      this.updateList(this.props.companyId);
    }
  }

  componentDidMount() {
    if (this.props.companyId !== null && this.props.companyId !== undefined) {
      this.updateStateFromProps(this.props);
    }
  }

  UNSAFE_componentWillReceiveProps(nextProps: Props) {
    if (
      nextProps.companyId !== null &&
      nextProps.companyId !== undefined &&
      nextProps.companyId !== this.props.companyId
    ) {
      this.updateList(nextProps.companyId);
      this.updateStateFromProps(nextProps);
    }
  }

  updateStateFromProps(props: Props) {
    this.setState((prevState) => {
      const newConfigList = prevState.configList;
      const baseCompanyConfig = newConfigList.base.find(
        (baseConfig) => baseConfig.key === 'companyId'
      );
      if (baseCompanyConfig) {
        baseCompanyConfig.defaultValue = props.companyId;
      }

      return {
        configList: newConfigList,
      };
    });
  }

  updateList(companyId: string) {
    this.props.actions.search({
      companyId,
    });
  }

  render() {
    return (
      <MainContents
        componentKey="agreementAlertSetting"
        configList={this.state.configList}
        itemList={this.props.itemList}
        {...this.props}
      />
    );
  }
}
