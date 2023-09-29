import React from 'react';

import cloneDeep from 'lodash/cloneDeep';

import configListTemplate from '@apps/admin-pc/constants/configList/psaWorkScheme';

import { PsaWorkScheme as PsaWorkSchemeModel } from '@apps/admin-pc/models/psaWorkScheme/PsaWorkScheme';

import { Action, Record } from '@apps/admin-pc/utils/RecordUtil';

import MainContents from '@apps/admin-pc/components/MainContents';

import { BaseMasterCRUDActions } from '../Type';

type Props = {
  actions: BaseMasterCRUDActions;
  commonActions: Action;
  itemList: Array<PsaWorkSchemeModel>;
  editRecord: PsaWorkSchemeModel;
  searchCompanySetting: Array<Record>;
  companyId: string;
  currencyDecimal: number;
};

export default class PsaWorkScheme extends React.Component<Props> {
  componentDidMount() {
    const param = { companyId: this.props.companyId };
    this.props.actions.search(param);
  }

  componentDidUpdate(prevProps: Props) {
    if (this.props.companyId !== prevProps.companyId) {
      const param = { companyId: this.props.companyId };
      this.props.actions.search(param);
    }
  }

  render() {
    const configList = cloneDeep(configListTemplate);
    configList.base.forEach((config) => {
      if (config.key && config.key === 'companyId') {
        config.defaultValue = this.props.companyId;
      }
    });

    const newProps = cloneDeep(this.props);
    const modifiedProps = {
      ...newProps,
      commonActions: {
        ...newProps.commonActions,
        // changeRecordValue: changeRecordValues,
      },
    };
    return (
      <MainContents
        componentKey="PsaWorkScheme"
        configList={configList}
        itemList={this.props.itemList}
        {...modifiedProps}
        showCloneButton
      />
    );
  }
}
