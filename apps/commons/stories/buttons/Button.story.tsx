import React from 'react';

import { action } from '@storybook/addon-actions';

import Button from '../../components/buttons/Button';

import ImgIconDummy from '../../images/iconClock.png';

export default {
  title: 'commons/buttons',
};

export const _Button = () => (
  <Button onClick={action('ボタンクリック')}>Default</Button>
);

_Button.parameters = {
  info: {
    text: `
デフォルト表示（type指定なし）
`,
    propTables: [Button],
    inline: true,
    source: true,
  },
};

export const ButtonTypeOutlineDefault = () => (
  <div style={{ padding: 20, backgroundColor: '#f2f2f2' }}>
    <Button type="outline-default" onClick={action('ボタンクリック')}>
      Primary
    </Button>
  </div>
);

ButtonTypeOutlineDefault.storyName = 'Button - type:outline-default';
ButtonTypeOutlineDefault.parameters = {
  info: { propTables: false, inline: true, source: true },
};

export const ButtonTypePrimary = () => (
  <Button type="primary" onClick={action('ボタンクリック')}>
    Primary
  </Button>
);

ButtonTypePrimary.storyName = 'Button - type:primary';
ButtonTypePrimary.parameters = {
  info: { propTables: false, inline: true, source: true },
};

export const ButtonTypeSecondary = () => (
  <Button type="secondary" onClick={action('ボタンクリック')}>
    Secondary
  </Button>
);

ButtonTypeSecondary.storyName = 'Button - type:secondary';
ButtonTypeSecondary.parameters = {
  info: { propTables: false, inline: true, source: true },
};

export const ButtonTypeDestructive = () => (
  <Button type="destructive" onClick={action('ボタンクリック')}>
    Destructive
  </Button>
);

ButtonTypeDestructive.storyName = 'Button - type:destructive';
ButtonTypeDestructive.parameters = {
  info: { propTables: false, inline: true, source: true },
};

export const ButtonTypeText = () => (
  <Button type="text" onClick={action('ボタンクリック')}>
    Destructive
  </Button>
);

ButtonTypeText.storyName = 'Button - type:text';
ButtonTypeText.parameters = {
  info: { propTables: false, inline: true, source: true },
};

export const ButtonDisabled = () => (
  <div>
    <Button type="default" onClick={action('Defaultクリック')} disabled>
      Default
    </Button>
    <Button
      type="outline-default"
      onClick={action('Outline Defultクリック')}
      disabled
    >
      Outline
    </Button>
    <Button type="primary" onClick={action('Primaryクリック')} disabled>
      Primary
    </Button>
    <Button type="secondary" onClick={action('Secondaryクリック')} disabled>
      Secondary
    </Button>
    <Button type="destructive" onClick={action('Destructiveクリック')} disabled>
      Destructive
    </Button>
    <Button type="text" onClick={action('textクリック')} disabled>
      Destructive
    </Button>
  </div>
);

ButtonDisabled.storyName = 'Button - disabled';
ButtonDisabled.parameters = {
  info: { propTables: false, inline: true, source: true },
};

export const ButtonSubmit = () => (
  <form onSubmit={action('submit')}>
    <input type="text" />
    <Button type="primary" submit>
      送信
    </Button>
  </form>
);

ButtonSubmit.storyName = 'Button - submit';
ButtonSubmit.parameters = {
  info: { propTables: false, inline: true, source: true },
};

export const ButtonWithIcon = () => (
  <Button
    onClick={action('ボタンクリック')}
    iconSrc={ImgIconDummy}
    iconAlt="image"
  >
    with
  </Button>
);

ButtonWithIcon.storyName = 'Button - with icon';
ButtonWithIcon.parameters = {
  info: { propTables: false, inline: true, source: true },
};

export const ButtonWithIconAlignRight = () => (
  <Button
    onClick={action('ボタンクリック')}
    iconSrc={ImgIconDummy}
    iconAlt="image"
    iconAlign="right"
  >
    with
  </Button>
);

ButtonWithIconAlignRight.storyName = 'Button - with icon (align:right)';
ButtonWithIconAlignRight.parameters = {
  info: { propTables: false, inline: true, source: true },
};

export const ButtonWithCssClass = () => (
  <div className="slds-clearfix">
    <Button
      className="slds-float--right"
      type="primary"
      onClick={action('Primaryクリック')}
    >
      Default
    </Button>
  </div>
);

ButtonWithCssClass.storyName = 'Button - with css class';
ButtonWithCssClass.parameters = {
  info: { propTables: false, inline: true, source: true },
};
