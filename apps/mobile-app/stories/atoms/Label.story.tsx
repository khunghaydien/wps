import React from 'react';

import { action } from '@storybook/addon-actions';
/* eslint-disable import/no-extraneous-dependencies */
import { boolean, text, withKnobs } from '@storybook/addon-knobs';

import Label from '../../components/atoms/Label';

export default {
  title: 'Components/atoms/Label',
  decorators: [withKnobs],
};

export const Basic = () => (
  <Label
    text={text(
      'text',
      'LABEL LABEL LABEL LABEL ラベル　ラベル　ラベル　ラベル ラベル'
    )}
    marked={boolean('marked', null)}
    emphasis={boolean('emphasis', null)}
  />
);

export const Form = () => (
  <div>
    <div>
      <Label text="Clickable!" htmlFor="id" />
      <input type="checkbox" id="id" />
    </div>
    <hr />
    <Label text="Clickable!">
      <input type="checkbox" />
    </Label>
  </div>
);

export const WithHint = () => (
  <Label
    text="Clickable!"
    hintMsg="hint message"
    onClickHint={action('onClickHint')}
  >
    <input type="text" />
  </Label>
);
