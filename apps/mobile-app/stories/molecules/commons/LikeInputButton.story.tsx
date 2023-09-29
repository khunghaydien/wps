import React from 'react';

import { action } from '@storybook/addon-actions';
import { withInfo } from '@storybook/addon-info';
/* eslint-disable import/no-extraneous-dependencies */
import { boolean, text, withKnobs } from '@storybook/addon-knobs';

import LikeInputButton from '../../../components/molecules/commons/LikeInputButton';

export default {
  title: 'Components/molecules/commons/LikeInputButton',
  decorators: [withKnobs],
};

export const Basic = withInfo(`
      # Description

      インプットのようなボタンです。
    `)(() => (
  <LikeInputButton
    placeholder={text('placeholder', 'Like input atom.')}
    error={boolean('error', false)}
    disabled={boolean('disabled', false)}
    readOnly={boolean('readOnly', false)}
    onClick={action('onClick')}
    value={text('value', 'Like input atom.')}
  />
));
