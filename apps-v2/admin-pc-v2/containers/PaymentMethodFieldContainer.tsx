import React, { FC, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AnyAction, bindActionCreators } from 'redux';
import { ThunkDispatch } from 'redux-thunk';

import get from 'lodash/get';

import msg from '@commons/languages';

import { actions as dualListActions } from '@admin-pc-v2/modules/paymentMethod/ui/dualList';

import { changeRecordValue } from '@admin-pc/action-dispatchers/Edit';

import { State } from '@admin-pc-v2/reducers';

import { Config } from '@admin-pc/utils/ConfigUtil';

import DualListBox from '@admin-pc/components/DualListBox';

export type Props = {
  config: Config;
  disabled: boolean;
};

const PaymentMethodFieldContainer: FC<Props> = ({ config, disabled }) => {
  const dispatch = useDispatch() as ThunkDispatch<State, void, AnyAction>;

  const selections = useSelector(
    (state: State) => state.paymentMethod.ui.dualList
  );
  const mode = useSelector((state: State) => state.base.detailPane.ui.modeBase);
  const tmpEditRecord = useSelector((state: State) => state.tmpEditRecord);
  const paymentMethodList = useSelector(
    (state: State) => state.paymentMethod.entities.list
  );

  const actions = useMemo(
    () =>
      bindActionCreators(
        {
          select: dualListActions.select,
        },
        dispatch
      ),
    [dispatch]
  );

  const initialiseOptions = () => {
    const selectedIds = get(tmpEditRecord, config.key) || [];
    dispatch(dualListActions.initialise(selectedIds, paymentMethodList));
  };

  const onChangeDetailItem = (
    configKey: string,
    value: string[] | null | undefined
  ) => {
    dispatch(changeRecordValue(configKey, value));
  };

  return (
    <DualListBox
      selections={selections}
      disabled={disabled}
      mode={mode}
      configKey={config.key}
      itemId={tmpEditRecord.id}
      initialiseOptions={initialiseOptions}
      onChangeDetailItem={onChangeDetailItem}
      setOptions={actions.select}
      labels={{
        headerLeft: msg().Admin_Lbl_ExpPaymentMethodNotUsed,
        headerRight: msg().Admin_Lbl_ExpPaymentMethodUsed,
      }}
    />
  );
};

export default PaymentMethodFieldContainer;
