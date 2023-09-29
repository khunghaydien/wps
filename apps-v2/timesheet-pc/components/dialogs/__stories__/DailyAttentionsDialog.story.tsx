import React from 'react';

import { action } from '@storybook/addon-actions';

import msg from '../../../../commons/languages';
import TextUtil from '../../../../commons/utils/TextUtil';

import DialogDecorator from '../../../../../.storybook/decorator/Dialog';
import DailyAttentionsDialog from '../DailyAttentionsDialog';

const messages = [
  TextUtil.template(msg().Att_Msg_NotIncludeWorkingTime, '7:00', '8:00'),
  TextUtil.template(msg().Att_Msg_NotIncludeWorkingTime, '18:00', '20:00'),
  TextUtil.template(msg().Att_Msg_InsufficientRestTime, '15'),
];

export default {
  title: 'timesheet-pc/dialogs/DailyAttentionsDialog',
  decorators: [(story) => <DialogDecorator>{story()}</DialogDecorator>],
};

export const SingleMessage = () => {
  return (
    <DailyAttentionsDialog
      messages={[messages[0]]}
      isHide={false}
      onHide={action('Hide Dialog')}
    />
  );
};

SingleMessage.storyName = 'single message';

SingleMessage.parameters = {
  info: {
    propTables: [DailyAttentionsDialog],
    inline: false,
    source: true,
  },
};

export const MultipleMassage = () => {
  return (
    <DailyAttentionsDialog
      messages={messages}
      isHide={false}
      onHide={action('Hide Dialog')}
    />
  );
};

MultipleMassage.storyName = 'multiple massage';

MultipleMassage.parameters = {
  info: {
    propTables: [DailyAttentionsDialog],
    inline: false,
    source: true,
  },
};
