import React, { FC } from 'react';

import { action } from '@storybook/addon-actions';
import { Options, withInfo } from '@storybook/addon-info';

import PersonalMenuPopover from '../components/PersonalMenuPopover';

interface FCStory extends FC {
  storyName?: string;
  parameters?: unknown;
}

export default {
  title: 'commons',
  decorators: [withInfo],
};

export const _PersonalMenuPopover: FCStory = () => (
  <div
    style={{
      height: 240,
      position: 'relative',
      width: 480,
    }}
  >
    {/*
    // @ts-ignore */}
    <PersonalMenuPopover
      employeeName="田中 太郎"
      departmentName="テスト部署"
      showProxyEmployeeSelectButton
      showChangeApproverButton
      onClickCloseButton={action('clickCloseButton')}
      onClickOpenProxyEmployeeSelectButton={action(
        'clickOpenProxyEmployeeSelectButton'
      )}
      onClickOpenLeaveWindowButton={action('clickOpenLeaveWindowButton')}
      onClickOpenChangeApproverButton={action('clickOpenChangeApproverButton')}
    />
  </div>
);

_PersonalMenuPopover.storyName = 'PersonalMenuPopover';
_PersonalMenuPopover.parameters = {
  info: {
    propTables: [PersonalMenuPopover],
    inline: true,
    source: true,
  } as Options,
};
