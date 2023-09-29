import React, { useCallback, useEffect, useMemo } from 'react';
import { shallowEqual, useDispatch, useSelector } from 'react-redux';

import msg from '@commons/languages';

import workingTypeDialogActions from '../../../../action-dispatchers/employee/WorkingType';

import { State } from '../../../../reducers';

import ClearableField from '@admin-pc/components/Common/ClearableField';

import WorkingTypeDialogContainer from './WorkingTypeDialogContainer';

type OwnProps = {
  config: any;
  disabled: boolean;
  tmpEditRecord: any;
  onChangeDetailItem: (ar0: string, ar1: any) => void;
};

const useMapDispatchToProps = () => {
  const dispatch = useDispatch();

  return useMemo(() => {
    const Actions = workingTypeDialogActions(dispatch);

    return {
      resetWorkingType: Actions.resetWorkingType,
      showDialog: Actions.openDialog,
      hideDialog: Actions.closeDiaglog,
    };
  }, [dispatch]);
};

const PatternButtonContainer: React.FC<OwnProps> = (props) => {
  const { disabled, config, tmpEditRecord, onChangeDetailItem } = props;

  const [targetDate, companyId, label] = useMemo(
    () => [
      tmpEditRecord.validDateFrom,
      tmpEditRecord.companyId,
      tmpEditRecord.workingType?.name,
    ],
    [
      tmpEditRecord.companyId,
      tmpEditRecord.validDateFrom,
      tmpEditRecord.workingType?.name,
    ]
  );

  const isDialogOpen = useSelector(
    (state: State) => state.employee.ui.workingTypeDialog.showFlag,
    shallowEqual
  );

  const { resetWorkingType, showDialog, hideDialog } = useMapDispatchToProps();

  const onClickClearBtn = useCallback(() => {
    onChangeDetailItem(config.key, null);
    onChangeDetailItem('workingType', { name: '', code: '' });
  }, [config.key, onChangeDetailItem]);

  const openDialog = useCallback(
    () => showDialog(targetDate, companyId),
    [companyId, showDialog, targetDate]
  );

  const onSubmitDialog = useCallback(
    (workingType) => {
      const { id, code, name } = workingType;
      onChangeDetailItem(config.key, id);
      onChangeDetailItem('workingType', { code, name });
    },
    [config.key, onChangeDetailItem]
  );

  const dialogProps = useMemo(
    () => ({
      targetDate,
      companyId,
      onClose: hideDialog,
      onSubmitDialog,
    }),
    [companyId, hideDialog, onSubmitDialog, targetDate]
  );

  useEffect(() => {
    resetWorkingType();
  }, []);

  return (
    <ClearableField
      disabled={disabled}
      isDialogOpen={isDialogOpen}
      dialog={WorkingTypeDialogContainer}
      dialogProps={dialogProps}
      label={label}
      labelSelectBtn={msg().Admin_Lbl_WorkingTypeSelect}
      openDialog={openDialog}
      onClickClearBtn={onClickClearBtn}
    />
  );
};

export default PatternButtonContainer;
