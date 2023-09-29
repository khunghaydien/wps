import React from 'react';

import configList from '../../constants/configList/psaSetting';

import { PsaSetting as PsaSettingModel } from '../../models/psa-setting/PsaSetting';

import MainContents from '../../components/MainContents';

type Props = {
  actions: any;
  settings: PsaSettingModel;
  companyId: string;
  commonActions: any;
};

export default class PsaSetting extends React.Component<Props> {
  componentDidMount() {
    const param = {
      companyId: this.props.companyId,
      settingId: this.props.settings.id,
    };
    this.props.actions.search(param).then(() => {
      this.props.commonActions.setEditRecord({
        ...this.props.settings,
        companyId: this.props.companyId,
      });
    });
    this.props.actions.searchCalendar({ companyId: this.props.companyId });
  }

  // edit record was not updated when saved...
  componentDidUpdate(prevProps: Props) {
    if (this.props.companyId !== prevProps.companyId) {
      const param = { companyId: this.props.companyId };
      this.props.actions.search(param);
    }
    if (prevProps.settings !== this.props.settings) {
      this.props.commonActions.setEditRecord({
        ...this.props.settings,
        companyId: this.props.companyId,
      });
      this.props.actions.searchCalendar({ companyId: this.props.companyId });
    }
  }

  render() {
    configList.base.forEach((config) => {
      if (config.key && config.key === 'companyId') {
        config.defaultValue = this.props.companyId;
      }
    });
    return (
      <MainContents
        componentKey="PsaSetting"
        configList={configList}
        isSinglePane
        {...this.props}
      />
    );
  }
}
