import React from 'react';

import cloneDeep from 'lodash/cloneDeep';
import findIndex from 'lodash/findIndex';
import isEqual from 'lodash/isEqual';

import configListTemplate from '../../constants/configList/jobGrade';

import { JobGrade as JobGradeModel } from '../../models/job-grade/JobGrade';

import { Action, Record } from '../../utils/RecordUtil';

import MainContents from '../../components/MainContents';

import { BaseMasterCRUDActions, QueryAction } from '../Type';

type Props = {
  actions: BaseMasterCRUDActions & {
    searchPSAGroup: QueryAction;
  };
  commonActions: Action;
  itemList: Array<JobGradeModel>;
  editRecord: JobGradeModel;
  searchCompanySetting: Array<Record>;
  companyId: string;
  searchPSAGroup: Array<Record>;
};

export default class JobGrade extends React.Component<Props> {
  componentDidMount() {
    const param = { companyId: this.props.companyId };
    this.props.actions.search(param);
    this.props.actions.searchPSAGroup(param);
  }

  componentDidUpdate(prevProps: Props) {
    if (this.props.companyId !== prevProps.companyId) {
      const param = { companyId: this.props.companyId };
      this.props.actions.search(param);
    }
    if (!isEqual(this.props.editRecord, prevProps.editRecord)) {
      const idx = findIndex(this.props.searchCompanySetting, [
        'id',
        this.props.companyId,
      ]);
      const psaGroup = this.props.searchPSAGroup.find(
        (group) => group.id === this.props.editRecord.psaGroupId
      );
      this.props.commonActions.setEditRecord({
        ...this.props.editRecord,
        currencyCode:
          this.props.searchCompanySetting[idx].currencyField.code || '-',
        psaGroupName: psaGroup ? psaGroup.name : '-',
      });
    }
  }

  render() {
    const configList = cloneDeep(configListTemplate);
    configList.base.forEach((config) => {
      if (config.key && config.key === 'companyId') {
        config.defaultValue = this.props.companyId;
      }
    });
    return (
      <MainContents
        componentKey="JobGrade"
        configList={configList}
        itemList={this.props.itemList}
        {...this.props}
      />
    );
  }
}
