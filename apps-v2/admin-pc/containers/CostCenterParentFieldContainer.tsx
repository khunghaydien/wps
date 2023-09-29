import React, { useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { bindActionCreators } from 'redux';

import get from 'lodash/get';

import msg from '../../commons/languages';
import { actions as ccDialogActions } from '../../commons/modules/costCenterDialog/ui/assignment';
import { actions as ccListActions } from '../../commons/modules/costCenterDialog/ui/list';

import { CostCenter } from '../../domain/models/exp/CostCenter';

import { MODE } from '../modules/base/detail-pane/ui';

import { State } from '../reducers';

import { Record } from '../utils/RecordUtil';

import Component from '../components/Common/ClearableField';

import CostCenterDialogContainer from './CostCenterDialogContainer';

const mapStateToProps = (state) => ({
  isCostCenterDialogSelection:
    state.costCenterDialog.ui.assignment.isCostCenterDialogSelection,
  activeDialog: state.costCenterDialog.ui.assignment.activeDialogKey,
  targetDate: state.editRecordHistory.validDateFrom,
  tmpEditRecord: state.tmpEditRecord,
});

const getLabel = (tmpEditRecord) => {
  const path = 'parent';
  const ccInfo = get(tmpEditRecord, path);
  const code = (ccInfo && ccInfo.code) || '';
  const name = (ccInfo && ccInfo.name) || '';
  const divider = code && name ? ' - ' : '';
  return code + divider + name;
};

const CostCenterParentFieldContainer = (ownProps: {
  onChangeDetailItem: (
    key: keyof CostCenter,
    value: CostCenter[keyof CostCenter]
  ) => void;
  config: { key: keyof CostCenter };
  tmpEditRecord: Record;
}) => {
  const props = useSelector(mapStateToProps);
  const dispatch = useDispatch();

  const Actions = useMemo(
    () =>
      bindActionCreators(
        {
          openCCSelection: ccDialogActions.openCCSelection,
          setActiveDialogKey: ccDialogActions.setActiveDialogKey,
          closeCCSelection: ccDialogActions.cancelCCSelection,
          clearCostCenterList: ccListActions.clear,
        },
        dispatch
      ),
    [dispatch]
  );

  const mode = useSelector(
    (state: State) => state.base.detailPane.ui.modeHistory
  );

  return (
    <Component
      {...props}
      onClickClearBtn={() => {
        const updatedInfo = { name: '', code: '' };
        ownProps.onChangeDetailItem(ownProps.config.key, null);
        ownProps.onChangeDetailItem('parent', updatedInfo);
      }}
      dialog={CostCenterDialogContainer}
      openDialog={() => {
        Actions.setActiveDialogKey(ownProps.config.key);
        Actions.openCCSelection(true);
      }}
      dialogProps={{
        targetDate: ownProps.tmpEditRecord.validDateFrom,
        select: (costCenter) => {
          ownProps.onChangeDetailItem(ownProps.config.key, costCenter.baseId);
          const ccInfo = {
            code: costCenter.code,
            name: costCenter.name,
          };
          ownProps.onChangeDetailItem('parent', ccInfo);
          Actions.closeCCSelection();
          Actions.clearCostCenterList();
        },
        onClickHideDialogButton: () => {
          Actions.closeCCSelection();
          Actions.clearCostCenterList();
        },
      }}
      labelSelectBtn={msg().Admin_Lbl_SelectParentCostCenter}
      label={getLabel(ownProps.tmpEditRecord)}
      isDialogOpen={
        props.isCostCenterDialogSelection &&
        props.activeDialog === ownProps.config.key
      }
      disabled={
        mode !== MODE.EDIT &&
        mode !== MODE.NEW &&
        mode !== MODE.REVISION &&
        mode !== MODE.CLONE
      }
    />
  );
};

export default CostCenterParentFieldContainer;
