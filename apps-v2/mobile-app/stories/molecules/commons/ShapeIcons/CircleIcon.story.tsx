import React from 'react';

import { withInfo } from '@storybook/addon-info';
/* eslint-disable import/no-extraneous-dependencies */
import { text, withKnobs } from '@storybook/addon-knobs';

import CircleShapeIcon from '../../../../components/molecules/commons/ShapeIcons/CircleShapeIcon';

export default {
  title: 'Components/molecules/commons/ShapeIcons/CircleShapeIcon',
  decorators: [withKnobs, withInfo],
};

export const Basic = () => {
  const backgroundColor = text('backgroundColor', 'red');
  const type = 'adduser';

  return (
    <React.Fragment>
      <CircleShapeIcon
        backgroundColor={backgroundColor}
        type={type}
        size="x-large"
      />
      <CircleShapeIcon
        backgroundColor={backgroundColor}
        type={type}
        size="large"
      />
      <CircleShapeIcon
        backgroundColor={backgroundColor}
        type={type}
        size="medium"
      />
      <CircleShapeIcon
        backgroundColor={backgroundColor}
        type={type}
        size="small"
      />
      <CircleShapeIcon
        backgroundColor={backgroundColor}
        type={type}
        size="x-small"
      />
    </React.Fragment>
  );
};

Basic.story = {
  parameters: {
    info: {
      text: `
  # Description

  背景に円のあるアイコンです。

  # backgroundColor

  背景色です
      `,
    },
  },
};
