import React from 'react';

/* eslint-disable import/no-extraneous-dependencies */
import { boolean, withKnobs } from '@storybook/addon-knobs';

import PersonCheckBox from '../../../../components/molecules/commons/Fields/PersonCheckBox';

import ImgSample from '../../../images/sample.png';

export default {
  title: 'Components/molecules/commons/Fields/PersonCheckBox',
  decorators: [withKnobs],
};

export const Basic = (): React.ReactNode => (
  <PersonCheckBox
    src={ImgSample}
    value={boolean('checked', false)}
    error={boolean('error', false)}
    disabled={boolean('disabled', false)}
    readOnly={boolean('readOnly', false)}
  />
);
