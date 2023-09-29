import React from 'react';

import { dialogTypes } from '@apps/domain/models/customRequest/consts';
import { Dialog } from '@apps/domain/models/customRequest/types';

import ApprovalContainer from '@custom-request-pc/containers/Dialogs/ApprovalContainer';
import FormContainer from '@custom-request-pc/containers/Dialogs/FormContainer';
import RecallContainer from '@custom-request-pc/containers/Dialogs/RecallContainer';
import RecordTypeSelectContainer from '@custom-request-pc/containers/Dialogs/RecordTypeSelectContainer';

export type Props = {
  activeDialog: Dialog[];
  onHide: () => void;
  onHideAll: () => void;
};

const CustomRequestDialog = (props: Props) => {
  const dialogs = props.activeDialog.map((dialog) => {
    switch (dialog) {
      case dialogTypes.NEW:
      case dialogTypes.EDIT:
        return <FormContainer {...props} />;
      case dialogTypes.RECORD_TYPE_SELECT:
        return <RecordTypeSelectContainer {...props} />;
      case dialogTypes.APPROVAL:
        return <ApprovalContainer {...props} />;
      case dialogTypes.RECALL:
        return <RecallContainer {...props} />;
      // case dialogTypes.REFERENCE is handles in FormContainer to share formikContext
      default:
        return null;
    }
  });
  return <>{dialogs}</>;
};

export default CustomRequestDialog;
