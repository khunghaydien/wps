import React, { useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { bindActionCreators } from 'redux';

import { getUserSetting } from '@commons/actions/userSetting';

import { State } from '@custom-request-pc/modules';

import {
  initialize,
  initRecordTypes,
} from '@custom-request-pc/action-dispatchers';

import Component from '../components/App';

const mapStateToProps = (state: State) => {
  return {
    pageView: state.ui.pageView,
  };
};

const AppContainer = () => {
  const props = useSelector(mapStateToProps);
  const selectedRecordTypeId = useSelector(
    (state: State) => state.ui.selectedRecordTypeId
  );
  const objectName = useSelector(
    (state: State) => state.entities.recordTypeList.objectName
  );

  const dispatch = useDispatch();

  const Actions = useMemo(
    () =>
      bindActionCreators(
        {
          getUserSetting,
          initRecordTypes,
          initialize,
        },
        dispatch
      ),
    [dispatch]
  );
  useEffect(() => {
    Actions.getUserSetting({
      detailSelectors: [],
      returnSfDefaultCurrencyCode: true,
    });
    Actions.initRecordTypes();
  }, []);

  useEffect(() => {
    if (selectedRecordTypeId) {
      Actions.initialize(selectedRecordTypeId, objectName);
    }
  }, [selectedRecordTypeId]);

  return <Component pageView={props.pageView} />;
};

export default AppContainer;
