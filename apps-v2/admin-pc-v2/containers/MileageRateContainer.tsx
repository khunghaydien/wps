import React, { useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { bindActionCreators } from 'redux';

import cloneDeep from 'lodash/cloneDeep';

import configList from '@admin-pc-v2/constants/configList/mileageRate';

import * as mileageRateActions from '@admin-pc-v2/actions/mileageRate';

import { State } from '@admin-pc-v2/reducers';

import MileageRate from '@admin-pc-v2/presentational-components/MileageRate';

interface Props {
  companyId: string;
}
const MileageRateContainer = (props: Props) => {
  const { companyId } = props;
  const dispatch = useDispatch();
  const mileageRate = useSelector((state: State) => state.mileageRate);

  const Actions = useMemo(
    () =>
      bindActionCreators(
        {
          search: mileageRateActions.searchMileageRate,
          create: mileageRateActions.createMileageRate,
          delete: mileageRateActions.deleteMileageRate,
          update: mileageRateActions.updateMileageRate,
          searchHistory: mileageRateActions.searchMileageRateHistory,
          createHistory: mileageRateActions.createMileageRateHistory,
          deleteHistory: mileageRateActions.deleteMileageRateHistory,
        },
        dispatch
      ),
    [dispatch]
  );

  useEffect(() => {
    Actions.search({ companyId });
  }, [companyId]);

  const configListMileageRate = cloneDeep(configList);
  configListMileageRate.base.forEach((config) => {
    if (config.key === 'companyId') {
      config.defaultValue = companyId;
    }
  });
  return (
    <MileageRate
      {...props}
      mileageRate={mileageRate}
      configList={configListMileageRate}
      actions={{
        search: Actions.search,
        create: Actions.create,
        delete: Actions.delete,
        update: Actions.update,
        searchHistory: Actions.searchHistory,
        createHistory: Actions.createHistory,
        deleteHistory: Actions.deleteHistory,
      }}
    />
  );
};

export default MileageRateContainer;
