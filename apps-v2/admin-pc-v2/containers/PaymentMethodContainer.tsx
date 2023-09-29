import React, { FC, useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { bindActionCreators } from 'redux';

import cloneDeep from 'lodash/cloneDeep';

import configList from '@admin-pc-v2/constants/configList/paymentMethod';

import msg from '@commons/languages';

import {
  create,
  del,
  search,
  update,
} from '@admin-pc-v2/actions/paymentMethod';

import { State } from '@admin-pc-v2/reducers';

import { Config } from '@admin-pc/utils/ConfigUtil';

import { Props } from '@admin-pc/components/Admin/ContentsSelector';
import MainContents from '@admin-pc/components/MainContents';

const PaymentMethodContainer: FC<Props> = (props) => {
  const dispatch = useDispatch();

  const companyId = useSelector(
    (state: State) => state.base.menuPane.ui.targetCompanyId
  );
  const tmpEditRecord = useSelector((state: State) => state.tmpEditRecord);
  const paymentMethodList = useSelector(
    (state: State) => state.paymentMethod.entities.list
  );
  const clonedConfigList = cloneDeep(configList);
  clonedConfigList.base.forEach((config: Config) => {
    if (config.key === 'companyId') config.defaultValue = companyId;
  });

  const actions = useMemo(
    () =>
      bindActionCreators(
        {
          create,
          delete: del,
          search,
          update,
        },
        dispatch
      ),
    [dispatch]
  );

  useEffect(() => {
    actions.search({ companyId });
  }, [actions, companyId]);

  return (
    <MainContents
      actions={actions}
      componentKey="paymentMethod"
      configList={clonedConfigList}
      detailTitle={msg().Admin_Lbl_Details}
      itemList={paymentMethodList}
      showCloneButton
      tmpEditRecord={tmpEditRecord}
      {...props}
    />
  );
};

export default PaymentMethodContainer;
