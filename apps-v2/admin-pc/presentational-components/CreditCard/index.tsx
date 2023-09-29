import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import _ from 'lodash';

import configListTemplate from '@apps/admin-pc/constants/configList/creditCard';

import { CardInfo } from '@apps/domain/models/exp/CreditCard';

import { MODE, setModeBase } from '@admin-pc/modules/base/detail-pane/ui';

import { State } from '@admin-pc-v2/reducers';

import { Action } from '@admin-pc/utils/RecordUtil';

import MainContents from '@apps/admin-pc/components/MainContents';

type Props = Readonly<{
  actions: {
    search: (arg0: { companyId: string }) => Promise<any>;
    create: (arg0: Partial<CardInfo>) => void;
    update: (arg0: CardInfo) => void;
    delete: (arg0: { id: string }) => void;
  };
  companyId: string;
  searchCreditCard: Array<CardInfo>;
  commonActions: Action;
}>;

const CreditCard = (props: Props) => {
  const { actions, commonActions, companyId, searchCreditCard } = props;

  const configList = _.cloneDeep(configListTemplate);
  configList.base.forEach((config) => {
    if (config.key === 'companyId') {
      config.defaultValue = companyId;
    }
  });

  useEffect(() => {
    actions.search({ companyId });
  }, [companyId]);

  const tmpEditRecord: Record<string, any> = useSelector(
    (state: State) => state.tmpEditRecord
  );

  const dispatch = useDispatch();

  const onClickCreateButton = async () => {
    const param: Partial<CardInfo> = { ...tmpEditRecord, id: null };
    await actions.create(param);

    const searchCondition = { companyId };
    // fetch newly created/cloned detail
    actions.search(searchCondition).then((res) => {
      commonActions.setEditRecord(res[0]);
      dispatch(setModeBase(MODE.VIEW));
    });
  };

  return (
    <MainContents
      componentKey="expCreditCard"
      configList={configList}
      itemList={searchCreditCard}
      isShowDetailAfterCreate={true}
      onClickCreateButton={onClickCreateButton}
      showCloneButton={true}
      {...props}
    />
  );
};

export default CreditCard;
