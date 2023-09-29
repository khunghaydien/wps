import React from 'react';

/* eslint-disable import/no-extraneous-dependencies */
import { text, withKnobs } from '@storybook/addon-knobs';

import Spinner from '../../components/atoms/Spinner';

import colors from '../../styles/variables/_colors.scss';

export default {
  title: 'Components/atoms/Spinner',
  decorators: [withKnobs],
};

export const Basic = () => (
  <Spinner
    assistiveText={text('assistiveText', null)}
    color={text('color', null)}
  />
);

Basic.parameters = {
  info: {
    text: `
  ローディングなどを表現するSpinnerになります。
`,
  },
};

export const Colors = () => (
  <div>
    <Spinner
      assistiveText={text('assistiveText', null)}
      color={text('color', null)}
    />

    <div
      style={{
        display: 'flex',
        flexFlow: 'row wrap',
        justifyContent: 'flex-start',
      }}
    >
      {Object.keys(colors).map((key) => (
        <div
          style={{
            textAlign: 'center',
          }}
        >
          <Spinner color={colors[key]} />
          {key}
        </div>
      ))}
    </div>
  </div>
);

Colors.parameters = {
  info: {
    text: `
  ローディングなどを表現するSpinnerになります。
`,
  },
};
