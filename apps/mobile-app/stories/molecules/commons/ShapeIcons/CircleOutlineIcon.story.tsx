import React from 'react';

import { withInfo } from '@storybook/addon-info';
/* eslint-disable import/no-extraneous-dependencies */
import { text, withKnobs } from '@storybook/addon-knobs';

import CircleOutlineShapeIcon from '../../../../components/molecules/commons/ShapeIcons/CircleOutlineShapeIcon';

export default {
  title: 'Components/molecules/commons/ShapeIcons/CircleOutlineShapeIcon',
  decorators: [withKnobs],
};

export const Basic = withInfo({
  text: `
  # Description

  円ので囲まれたアイコンです。

  # borderColor

  線の色です。指定がなければ color を使用します。
`,
})(() => {
  const color = text('color', 'red');
  const borderColor = text('borderColor', 'red');
  const type = 'adduser';

  return (
    <React.Fragment>
      <CircleOutlineShapeIcon
        color={color}
        borderColor={borderColor}
        type={type}
        size="x-large"
      />
      <CircleOutlineShapeIcon
        color={color}
        borderColor={borderColor}
        type={type}
        size="large"
      />
      <CircleOutlineShapeIcon
        color={color}
        borderColor={borderColor}
        type={type}
        size="medium"
      />
      <CircleOutlineShapeIcon
        color={color}
        borderColor={borderColor}
        type={type}
        size="small"
      />
      <CircleOutlineShapeIcon
        color={color}
        borderColor={borderColor}
        type={type}
        size="x-small"
      />
    </React.Fragment>
  );
});
