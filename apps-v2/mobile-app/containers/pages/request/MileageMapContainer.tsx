import React, { useCallback, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { bindActionCreators } from 'redux';

import get from 'lodash/get';

import { goBack } from '@mobile/concerns/routingHistory';

import MileagePage from '@apps/mobile-app/components/pages/commons/MileagePage';

import { State } from '@mobile/modules';
import { actions as mileageActions } from '@mobile/modules/expense/ui/mileage';

const MileageMapContainer = (ownProps) => {
  const dispatch = useDispatch();
  const mileage = useSelector((state: State) => state.expense.ui.mileage);
  const destinations = get(mileage, 'destinations', []);

  const Actions = useMemo(
    () =>
      bindActionCreators(
        {
          setDestinations: mileageActions.setDestinations,
        },
        dispatch
      ),
    [dispatch]
  );

  const onClickBack = useCallback(() => {
    Actions.setDestinations(undefined);
    goBack(ownProps.history);
  }, [ownProps.history]);

  return <MileagePage onClickBack={onClickBack} destinations={destinations} />;
};

export default MileageMapContainer;
