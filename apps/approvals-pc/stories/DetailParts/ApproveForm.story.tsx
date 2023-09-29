import React from 'react';

import { action } from '@storybook/addon-actions';

import ApproveForm from '../../components/DetailParts/ApproveForm';

export default {
  title: 'approvals-pc/DetailParts',
};

export const _ApproveForm = () => (
  <ApproveForm
    onClickApproveButton={action('apporve')}
    onClickRejectButton={action('reject')}
    onChangeComment={action('change comment')}
  />
);

_ApproveForm.storyName = 'ApproveForm';

_ApproveForm.parameters = {
  info: { propTables: [ApproveForm], inline: true, source: true },
};
