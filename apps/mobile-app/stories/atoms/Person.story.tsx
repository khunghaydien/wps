import React from 'react';

/* eslint-disable import/no-extraneous-dependencies */
import { withKnobs } from '@storybook/addon-knobs';

import Person from '../../components/atoms/Person';

import ImgSample from '../images/sample.png';

export default {
  title: 'Components/atoms/Person',
  decorators: [withKnobs],
};

export const Basic = () => <Person src={ImgSample} alt="sample" />;

Basic.parameters = {
  info: `
      # Description

      承認者、申請者のアイコンデザインです。
    `,
};
