import React from 'react';

import cloneDeep from 'lodash/cloneDeep';
import isEqual from 'lodash/isEqual';

import configListTemplate from '../../constants/configList/talentProfile';

import { Skillset as SkillsetModel } from '../../../domain/models/psa/Skillset';

import { Action, Record } from '../../utils/RecordUtil';

import MainContents from '../../components/MainContents';

import { BaseMasterCRUDActions, QueryAction } from '../Type';

type Props = {
  actions: BaseMasterCRUDActions & {
    searchPSAGroup: QueryAction;
    searchPSAGroupByUser: QueryAction;
    clearPsaGroupOptions: QueryAction;
  };
  commonActions: Action;
  itemList: Array<SkillsetModel>;
  companyId: string;
  empId: string;
  editRecord: Record;
  tmpEditRecord: Record;
  searchPSAGroup: Array<Record>;
};

export default class TalentProfile extends React.Component<Props> {
  componentDidMount() {
    const param = { companyId: this.props.companyId };
    this.props.actions.search(param);
    this.props.actions.searchPSAGroup(param);
  }

  async componentDidUpdate(prevProps: Props) {
    if (this.props.companyId !== prevProps.companyId) {
      const param = { companyId: this.props.companyId };
      this.props.actions.search(param);
    }
    if (!isEqual(this.props.editRecord, prevProps.editRecord)) {
      const param = {
        companyId: this.props.companyId,
        employeeId: this.props.editRecord.empId,
        groupType: 'PM',
      };

      await this.props.actions.searchPSAGroupByUser(param);

      const psaGroup = this.props.searchPSAGroup.find(
        (group) => group.id === this.props.editRecord.psaGroupId
      );
      this.props.commonActions.setEditRecord({
        ...this.props.editRecord,
        psaGroupName: psaGroup ? psaGroup.name : '-',
      });
    }

    if (
      prevProps.tmpEditRecord.empId === null ||
      prevProps.tmpEditRecord.empId === ''
    ) {
      const param = {
        companyId: this.props.companyId,
        employeeId: this.props.tmpEditRecord.empId,
        groupType: 'PM',
      };
      this.props.actions.searchPSAGroupByUser(param);
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
        componentKey="TalentProfile"
        configList={configList}
        itemList={this.props.itemList}
        {...this.props}
      />
    );
  }
}
