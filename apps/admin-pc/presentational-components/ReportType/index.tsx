import React from 'react';

import _ from 'lodash';

import configList from '../../constants/configList/reportType';

import { Action, Record } from '../../utils/RecordUtil';

import MainContents from '../../components/MainContents';

type Props = {
  actions: Action;
  commonActions: Action;
  searchReportType: Array<Record>;
  companyId: string;
  tmpEditRecord: Record;
};

export default class ReportType extends React.Component<Props> {
  UNSAFE_componentWillMount() {
    const param = { companyId: this.props.companyId };
    this.props.actions.search(param);
    this.props.actions.searchExtendedItem(param);
    this.props.actions.getConstantsVendorUsed();
    this.props.actions.getConstantsCostCenterUsed();
    this.props.actions.getConstantsJobUsed();
  }

  UNSAFE_componentWillUpdate(nextProps) {
    if (this.props.companyId !== nextProps.companyId) {
      const param = { companyId: nextProps.companyId };
      this.props.actions.search(param);
      this.props.actions.searchExtendedItem(param);
    }
    if (
      nextProps.tmpEditRecord.id &&
      nextProps.tmpEditRecord.id !== this.props.tmpEditRecord.id
    ) {
      const param = {
        id: nextProps.tmpEditRecord.id,
        includeLinkedExpenseTypeIds: true,
      };
      this.props.actions.searchById(param).then((reportTypes) => {
        nextProps.commonActions.setEditRecord(reportTypes[0]);
        const expTypeIds = _.get(reportTypes, '0.expTypeIds', []);
        if (!_.isEmpty(expTypeIds)) {
          nextProps.actions
            .searchExpenseType({ ids: expTypeIds })
            .then((res) => {
              const expenseType = _.get(res, 'records', []);
              nextProps.actions.setSelectedExp(expTypeIds, expenseType);
            });
        } else {
          nextProps.actions.cleanSelectedExpense();
        }
      });
    }
  }

  onClickCreateNewButton = () => {
    // Clear the currently linked Expense Types when clicked on the New Button
    this.props.actions.setSelectedExp([], []);
  };

  render() {
    const configListReportType = _.cloneDeep(configList);
    configListReportType.base.forEach((config) => {
      if (config.key === 'companyId') {
        config.defaultValue = this.props.companyId;
      }
    });

    return (
      <MainContents
        onClickCreateNewButton={this.onClickCreateNewButton}
        componentKey="ReportType"
        configList={configListReportType}
        itemList={this.props.searchReportType}
        showCloneButton
        {...this.props}
      />
    );
  }
}
