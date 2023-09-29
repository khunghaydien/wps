import React from 'react';

import { action } from '@storybook/addon-actions';

import Button from '../components/buttons/Button';
import Tooltip from '../components/Tooltip';

export default {
  title: 'commons',
};

export const Basic = () => {
  const aligns = [
    'top',
    'top left',
    'top right',
    'right',
    'right top',
    'right bottom',
    'bottom',
    'bottom left',
    'bottom right',
    'left',
    'left top',
    'left bottom',
  ];

  return (
    <div
      style={{
        fontSize: '1.5em',
        display: 'flex',
        flexFlow: 'column',
        justifyContent: 'center',
      }}
    >
      <ul>
        {aligns.map((align, index) => (
          <li
            key={index}
            style={{
              padding: '1em',
              width: '10em',
              border: '1px solid #ddd',
              marginBottom: '1em',
            }}
          >
            <Tooltip
              align={align}
              content={align}
              contentStyle={{
                border: '1px solid #aaa',
                padding: '0.8em',
              }}
            >
              {align}
            </Tooltip>
          </li>
        ))}
      </ul>
    </div>
  );
};

Basic.storyName = 'Tooltip';

Basic.parameters = {
  info: {
    propTables: [Tooltip],
    inline: true,
    source: true,
  },
};

export const TooltipOnButton = () => (
  <div style={{ fontSize: '1.5em', marginLeft: '10em' }}>
    <Tooltip content="Tooltip Text">
      <Button onClick={action('onClick')}>Button</Button>
    </Tooltip>
  </div>
);

TooltipOnButton.storyName = 'Tooltip on Button';

TooltipOnButton.parameters = {
  info: {
    propTables: [Tooltip],
    inline: true,
    source: true,
  },
};

export const TooltipOnRichContent = () => (
  <div style={{ fontSize: '1.5em', marginLeft: '10em' }}>
    <Tooltip content="Tooltip Text">
      <div
        style={{
          display: 'block',
          border: 'solid #ddd 1px',
          width: '9em',
          marginLeft: '1em',
          padding: '0.3em',
        }}
      >
        <h1 style={{ fontSize: '2em' }}>Title</h1>
        <div>Content</div>
      </div>
    </Tooltip>
  </div>
);

TooltipOnRichContent.storyName = 'Tooltip on rich content';

TooltipOnRichContent.parameters = {
  info: {
    propTables: [Tooltip],
    inline: true,
    source: true,
  },
};

export const TooltipShowingRichContent = () => (
  <div style={{ fontSize: '1.5em', marginLeft: '10em' }}>
    <Tooltip
      content={
        <div
          style={{
            display: 'inline-block',
            border: 'solid #ddd 1px',
            width: '9em',
            padding: '0.3em',
          }}
        >
          <h1 style={{ fontSize: '2em' }}>Title</h1>
          <div>Content</div>
        </div>
      }
    >
      <Button onClick={action('onClick')}>Button</Button>
    </Tooltip>
  </div>
);

TooltipShowingRichContent.storyName = 'Tooltip showing rich content';

TooltipShowingRichContent.parameters = {
  info: {
    propTables: [Tooltip],
    inline: true,
    source: true,
  },
};
