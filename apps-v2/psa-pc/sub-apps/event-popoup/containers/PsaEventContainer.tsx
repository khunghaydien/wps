import React, { useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import UrlUtil from '@apps/commons/utils/UrlUtil';

// import { getPsaEvent } from '../action-dispatchers/PsaEventPopup';
import { actions as coditionsActions } from '@psa/sub-apps/event-popoup/modules/ui/conditions';

import PsaEventPopup from '@psa/sub-apps/event-popoup/components';

const mapStateToProps = (state: any) => ({
  psaEvent: state.psaEventPopup.entities.event,
  conditions: state.psaEventPopup.ui.conditions,
});

const PsaEventContainer = () => {
  const props = useSelector(mapStateToProps);

  const dispatch = useDispatch();
  const onClickClose = useMemo(
    () => () => dispatch(coditionsActions.close()),
    [dispatch]
  );

  const onClickViewScheduledDetails = useMemo(
    () => () => {
      if (props.psaEvent) {
        UrlUtil.openApp('resource-pc-schedule', {
          roleId: props.psaEvent.roleId,
        });
      }
    },
    [props.psaEvent]
  );

  return (
    <PsaEventPopup
      {...props}
      onClickClose={onClickClose}
      onClickViewScheduledDetails={onClickViewScheduledDetails}
    />
  );
};

export default PsaEventContainer;
