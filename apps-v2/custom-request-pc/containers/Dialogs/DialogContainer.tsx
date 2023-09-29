import React, { useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { bindActionCreators } from 'redux';

import { State } from '@custom-request-pc/modules';
import { actions as activeDialogActions } from '@custom-request-pc/modules/ui/dialog/activeDialog';
import { actions as selectedDialogRecordTypeAction } from '@custom-request-pc/modules/ui/dialog/selectedRecordTypeId';

import { getSelectedRecordTypeLayout } from '@apps/custom-request-pc/action-dispatchers';

import Component from '@custom-request-pc/components/Dialogs';

const mapStateToProps = (state: State) => ({
  activeDialog: state.ui.dialog.activeDialog,
  selectedRecordTypeId: state.ui.selectedRecordTypeId,
  objectName: state.entities.recordTypeList.objectName,
});

const DialogContainer = () => {
  const props = useSelector(mapStateToProps);
  const dispatch = useDispatch();

  const Actions = useMemo(
    () =>
      bindActionCreators(
        {
          onHide: activeDialogActions.hide,
          onHideAll: activeDialogActions.hideAll,
          setDialogSelectedRecordType: selectedDialogRecordTypeAction.set,
          getSelectedRecordTypeLayout,
        },
        dispatch
      ),
    [dispatch]
  );

  return (
    <Component
      {...props}
      onHide={Actions.onHide}
      onHideAll={() => {
        Actions.onHideAll();
        Actions.setDialogSelectedRecordType('');
        Actions.getSelectedRecordTypeLayout(
          props.selectedRecordTypeId,
          props.objectName
        );
      }}
    />
  );
};

export default DialogContainer;
