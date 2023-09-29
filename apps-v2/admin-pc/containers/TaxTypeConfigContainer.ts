import * as React from 'react';
import { connect } from 'react-redux';

import { get } from 'lodash';

import msg from '../../commons/languages';
import { $ExtractReturn } from '../../commons/utils/TypeUtil';

import { RECORD_TYPE } from '../../domain/models/exp/Record';

import { actions as expTypeDetailActions } from '../modules/expense-type/ui/detail';
import { actions as expTaxTypeActions } from '../modules/expTaxType';

import { State } from '../reducers/index';

import { Config } from '../utils/ConfigUtil';

import ExpTaxType from '../presentational-components/ExpenseType/ExpTaxType';

export type OwnProps = {
  config: Config;
  disabled: boolean;
};

const mapStateToProps = (state: State, ownProps: OwnProps) => ({
  disabled: ownProps.disabled,
  baseRecord: state.expenseType.ui.detail.baseRecord,
  selections: state.expTaxType,
  taxTypes: state.searchTaxType,
  itemId: state.expenseType.ui.detail.baseRecord.id,
  isSingleSelection: [
    RECORD_TYPE.TransitJorudanJP,
    RECORD_TYPE.TransportICCardJP,
    RECORD_TYPE.Mileage,
  ].includes(state.expenseType.ui.detail.baseRecord.recordType),
  mode: state.base.detailPane.ui.modeBase,
  configKey: ownProps.config.key,
});

const mapDispatchToProps = {
  initialiseOptions: expTaxTypeActions.initialiseOptions,
  onChangeDetailItem: expTypeDetailActions.setBaseRecordByKeyValue,
  setSelected: expTaxTypeActions.setSelected,
};

const mergeProps = (
  stateProps: $ExtractReturn<typeof mapStateToProps>,
  dispatchProps: typeof mapDispatchToProps
) => {
  return {
    ...stateProps,
    ...dispatchProps,
    labels: {
      headerLeft: msg().Admin_Lbl_TaxTypeNotUsed,
      headerRight: msg().Admin_Lbl_TaxTypeUsed,
    },
    initialiseOptions: () => {
      const selectedTaxIds =
        get(stateProps.baseRecord, stateProps.configKey) || [];
      dispatchProps.initialiseOptions(selectedTaxIds, stateProps.taxTypes);
    },
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
  mergeProps
)(ExpTaxType) as React.ComponentType<any> as React.ComponentType<
  Record<string, any>
>;
