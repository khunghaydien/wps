import React from 'react';

/* eslint-disable import/no-extraneous-dependencies */
import { boolean, text, withKnobs } from '@storybook/addon-knobs';

import CheckBox from '../../../components/atoms/Fields/CheckBox';

export default {
  title: 'Components/atoms/Fields/CheckBox',
  decorators: [withKnobs],
};

export const Basic = (): React.ReactNode => (
  <>
    <CheckBox
      label={text('label', '')}
      value={boolean('checked', false)}
      error={boolean('error', false)}
      disabled={boolean('disabled', false)}
      readOnly={boolean('readOnly', false)}
    />
  </>
);

const flag = (i: number, mask: number) => !!(i & mask);

const flagText = (f: unknown) => (f ? 'True' : 'False');

export const AllPattern = (): React.ReactNode => {
  const rows = [];

  for (let i = 0; i <= 0b1111; i++) {
    const value = flag(i, 0b1);
    const error = flag(i, 0b10);
    const disabled = flag(i, 0b100);
    const readOnly = flag(i, 0b1000);
    rows.push(
      <tr key={i}>
        <td
          style={{
            padding: '4px',
          }}
        >
          <CheckBox
            value={value}
            error={error}
            disabled={disabled}
            readOnly={readOnly}
          />
        </td>
        <td>{flagText(value)}</td>
        <td>{flagText(error)}</td>
        <td>{flagText(disabled)}</td>
        <td>{flagText(readOnly)}</td>
      </tr>
    );
  }

  return (
    <table
      style={{
        maxWidth: '500px',
      }}
    >
      <tr>
        <th>CheckBox</th>
        <th>Value</th>
        <th>Error</th>
        <th>Disabled</th>
        <th>ReadOnly</th>
      </tr>
      {rows}
    </table>
  );
};

export const WithLabel = (): React.ReactNode => (
  <>
    <CheckBox label={'Label'} />
  </>
);
