import React from 'react';

import { action } from '@storybook/addon-actions';

import Dropdown from '../../components/fields/Dropdown';

const dummyData = [
  { type: 'item', label: '選択肢1', value: 1 },
  { type: 'item', label: '選択肢2', value: 2 },
  { type: 'item', label: '選択肢3', value: 3 },
  { type: 'divider' },
  {
    type: 'item',
    label:
      'とーっても長い選択肢です。幅が足りない場合でも、折り返して表示します。ながーいマスタデータ等が作られた時でも、選択肢が途中で隠れなくて便利ですね!',
    value: 5,
  },
  { type: 'item', label: '選択肢4', value: 4 },
];

export default {
  title: 'commons/fields',
};

export const _Dropdown = () => (
  <Dropdown label="ドロップダウン" options={dummyData} />
);

_Dropdown.parameters = {
  info: { propTables: [Dropdown], inline: true, source: true },
};

export const DropdownWithoutLabel = () => <Dropdown options={dummyData} />;

DropdownWithoutLabel.storyName = 'Dropdown without label';
DropdownWithoutLabel.parameters = {
  info: { propTables: [Dropdown], inline: true, source: true },
};

export const DropdownOnSelect = () => (
  <Dropdown
    label="ドロップダウン"
    options={dummyData}
    onSelect={action('onSelect')}
  />
);

DropdownOnSelect.storyName = 'Dropdown onSelect';
DropdownOnSelect.parameters = {
  info: { propTables: [Dropdown], inline: true, source: true },
};

export const DropdownDefaultValue = () => (
  <Dropdown
    label="ドロップダウン"
    options={dummyData}
    value={3}
    onSelect={action('onSelect')}
  />
);

DropdownDefaultValue.storyName = 'Dropdown default value';
DropdownDefaultValue.parameters = {
  info: { propTables: [Dropdown], inline: true, source: true },
};

export const DropdownDisabled = () => (
  <Dropdown
    label="ドロップダウン"
    options={dummyData}
    value={3}
    disabled
    onSelect={action('onSelect')}
  />
);

DropdownDisabled.storyName = 'Dropdown disabled';
DropdownDisabled.parameters = {
  info: { propTables: [Dropdown], inline: true, source: true },
};

const dummyData2 = [
  {
    className: 'custom-li-class',
    divider: 'bottom',
    label: 'A Header',
    type: 'header',
  },
  {
    href: 'http://sfdc.co/',
    id: 'custom-li-id',
    label: 'Has a value',
    leftIcon: {
      name: 'settings',
      category: 'utility',
    },
    rightIcon: {
      name: 'settings',
      category: 'utility',
    },
    type: 'item',
    value: 'B0',
  },
  {
    type: 'divider',
  },
];

export const DropdownRichMenu = () => (
  <Dropdown
    label="ドロップダウン"
    options={dummyData2}
    onSelect={action('onSelect')}
  />
);

DropdownRichMenu.storyName = 'Dropdown rich menu';
DropdownRichMenu.parameters = {
  info: { propTables: [Dropdown], inline: true, source: true },
};
