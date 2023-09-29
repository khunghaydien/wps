import React from 'react';

import cloneDeep from 'lodash/cloneDeep';
import findIndex from 'lodash/findIndex';
import isEqual from 'lodash/isEqual';

import configListTemplate from '../../constants/configList/jobGrade';

import { JobGrade as JobGradeModel } from '../../models/job-grade/JobGrade';

import { Action, Record } from '../../utils/RecordUtil';

import MainContents from '../../components/MainContents';

import { BaseMasterCRUDActions } from '../Type';

type Props = {
  actions: BaseMasterCRUDActions;
  commonActions: Action;
  itemList: Array<JobGradeModel>;
  editRecord: JobGradeModel;
  searchCompanySetting: Array<Record>;
  companyId: string;
  currencyDecimal: number;
};

export default class JobGrade extends React.Component<Props> {
  componentDidMount() {
    const param = { companyId: this.props.companyId };
    this.props.actions.search(param);
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
      this.props.commonActions.setEditRecord({
        ...this.props.editRecord,
        currencyCode:
          this.props.searchCompanySetting[idx].currencyField.code || '-',
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

    const changeRecordValues = (key, value, charType) => {
      if (key === 'costRate' || key === 'billingRate') {
        const pattern = `^[0-9]{1,12}(\\.[0-9]{0,6})?$`;
        const re = new RegExp(pattern);
        if (value === '') {
          this.props.commonActions.changeRecordValue(key, Number(0), charType);
        } else if (re.test(value)) {
          if (!value.includes('.')) {
            this.props.commonActions.changeRecordValue(
              key,
              Number(value),
              charType
            );
          } else
            this.props.commonActions.changeRecordValue(key, value, charType);
        }
      } else {
        this.props.commonActions.changeRecordValue(key, value, charType);
      }
    };

    const newProps = cloneDeep(this.props);
    const modifiedProps = {
      ...newProps,
      commonActions: {
        ...newProps.commonActions,
        changeRecordValue: changeRecordValues,
      },
    };
    return (
      <MainContents
        componentKey="JobGrade"
        configList={configList}
        itemList={this.props.itemList}
        {...modifiedProps}
      />
    );
  }
}
