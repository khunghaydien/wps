import React from 'react';

import configList from '../../constants/configList/psaBatchJob';

import msg from '@commons/languages';

import MainContents from '../../components/MainContents';

type Props = {
  actions: any;
  companyId: string;
};

export default class PsaBatchJob extends React.Component<Props> {
  componentDidMount() {
    const param = { companyId: this.props.companyId };
    this.props.actions.getPsaBatchJob(param);
  }

  componentDidUpdate(nextProps: Props) {
    if (this.props.companyId !== nextProps.companyId) {
      const param = { companyId: nextProps.companyId };
      this.props.actions.getPsaBatchJob(param);
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
        componentKey="PsaBatchJob"
        configList={configList}
        detailTitle={msg().Admin_Lbl_PsaBatchJob}
        hideHeaderButton
        isSinglePane
        {...this.props}
      />
    );
  }
}
