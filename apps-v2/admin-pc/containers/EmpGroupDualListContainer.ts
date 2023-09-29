import * as React from 'react';
import { connect } from 'react-redux';

import { get } from 'lodash';

import msg from '../../commons/languages';
import { $ExtractReturn } from '../../commons/utils/TypeUtil';

import { initialiseOptions, setOptions } from '../modules/groupReportType';

import { changeRecordValue } from '../action-dispatchers/Edit';

import { State } from '../reducers/index';

import { Config } from '../utils/ConfigUtil';

import DualListbox from '../components/DualListBox';

export type OwnProps = {
  config: Config;
  disabled: boolean;
};
const mapStateToProps = (state: State, ownProps: OwnProps) => ({
  disabled: ownProps.disabled,
  groups: state.searchEmployeeGroup,
  selections: state.groupReportType,
  reportTypes: state.searchReportType,
  itemId: state.tmpEditRecord.id,
  mode: state.base.detailPane.ui.modeBase,
  configKey: ownProps.config.key,
});

const mapDispatchToProps = {
  initialiseOptions,
  onChangeDetailItem: changeRecordValue,
  setOptions,
};

const mergeProps = (
  stateProps: $ExtractReturn<typeof mapStateToProps>,
  dispatchProps: typeof mapDispatchToProps
) => {
  return {
    ...stateProps,
    ...dispatchProps,
    labels: {
      headerLeft: msg().Admin_Lbl_ReportTypeNotUsed,
      headerRight: msg().Admin_Lbl_ReportTypeUsed,
    },
    initialiseOptions: () => {
      const selectedGroup = stateProps.groups.find(
        ({ id }) => id === stateProps.itemId
      );
      const selectedReportTypeIds =
        get(selectedGroup, stateProps.configKey) || [];
      return dispatchProps.initialiseOptions(
        selectedReportTypeIds,
        stateProps.reportTypes
      );
    },
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
  mergeProps
)(DualListbox) as React.ComponentType<any> as React.ComponentType<
  Record<string, any>
>;
