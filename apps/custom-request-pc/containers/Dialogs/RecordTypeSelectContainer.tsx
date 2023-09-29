import React, { useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { bindActionCreators } from 'redux';

import { findIndex } from 'lodash';

import { State } from '@custom-request-pc/modules';
import { actions as activeDialogActions } from '@custom-request-pc/modules/ui/dialog/activeDialog';
import { actions as selectedRecordTypeAction } from '@custom-request-pc/modules/ui/dialog/selectedRecordTypeId';

import { initializeDialog } from '@custom-request-pc/action-dispatchers';

import Component from '@custom-request-pc/components/Dialogs/RecordTypeSelect';

const RecordTypeSelectContainer = (ownProps) => {
  const dispatch = useDispatch();
  const Actions = useMemo(
    () =>
      bindActionCreators(
        {
          openFormDialog: activeDialogActions.new,
          setSelectedRecordType: selectedRecordTypeAction.set,
          initializeDialog,
        },
        dispatch
      ),
    [dispatch]
  );
  const objectName = useSelector(
    (state: State) => state.entities.recordTypeList.objectName
  );
  const selectedRecordTypeId = useSelector(
    (state: State) => state.ui.dialog.selectedRecordTypeId
  );
  const recordTypeList = useSelector((state: State) =>
    state.entities.recordTypeList.records.filter(({ available }) => available)
  );

  return (
    <Component
      {...ownProps}
      recordTypeList={recordTypeList}
      onClickNext={(id: string) => {
        Actions.setSelectedRecordType(id);
        Actions.openFormDialog();
        Actions.initializeDialog(id, objectName);
      }}
      selectedRecordTypeIdx={findIndex(recordTypeList, {
        id: selectedRecordTypeId,
      })}
      onHide={() => {
        ownProps.onHide();
        Actions.setSelectedRecordType('');
      }}
    />
  );
};

export default RecordTypeSelectContainer;
