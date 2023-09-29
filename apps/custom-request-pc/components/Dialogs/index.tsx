import React from 'react';

import { last } from 'lodash';

import ApprovalContainer from '@custom-request-pc/containers/Dialogs/ApprovalContainer';
import FormContainer from '@custom-request-pc/containers/Dialogs/FormContainer';
import RecallContainer from '@custom-request-pc/containers/Dialogs/RecallContainer';
import RecordTypeSelectContainer from '@custom-request-pc/containers/Dialogs/RecordTypeSelectContainer';

import { dialogTypes } from '@custom-request-pc/consts';
import { Dialog } from '@custom-request-pc/types';

export type Props = {
  activeDialog: Dialog[];
  onHide: () => void;
  onHideAll: () => void;
};

const CustomRequestDialog = (props: Props) => {
  switch (last(props.activeDialog)) {
    case dialogTypes.NEW:
    case dialogTypes.EDIT:
      return <FormContainer {...props} />;
    case dialogTypes.RECORD_TYPE_SELECT:
      return <RecordTypeSelectContainer {...props} />;
    case dialogTypes.APPROVAL:
      return <ApprovalContainer {...props} />;
    case dialogTypes.RECALL:
      return <RecallContainer {...props} />;
    default:
      return null;
  }
};

export default CustomRequestDialog;
